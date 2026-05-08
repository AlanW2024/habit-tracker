"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getServerSupabase } from "./supabase/server";
import { SELF_USER_ID } from "./supabase/config";
import {
  RARITY_WEIGHTS,
  XP_PER_7DAY_STREAK,
  XP_PER_DAILY_COMPLETE,
  XP_PER_WEEKLY_TARGET,
  nextStreakOnComplete,
  todayIso,
} from "./domain";
import type { CardRarity, DrawCard, StreakState } from "./types";

const habitInput = z.object({
  name: z.string().min(1, "請填習慣名稱").max(40),
  type: z.enum(["daily_must", "weekly_target"]),
  target_qty: z.coerce.number().min(1).max(999),
  unit: z.string().min(1).max(8),
  if_then: z
    .string()
    .min(6, "If-then 不能少於 6 字。寫清楚：what / when / where。")
    .max(200),
  cue_time: z.string().regex(/^\d{2}:\d{2}$/).optional().or(z.literal("")),
  difficulty: z.enum(["tiny", "normal", "stretch"]),
  weekly_goal: z.coerce.number().min(1).max(7),
});

export type HabitFormState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function createHabit(
  _prev: HabitFormState | undefined,
  formData: FormData,
): Promise<HabitFormState> {
  const raw = Object.fromEntries(formData);
  const parsed = habitInput.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[issue.path.join(".")] = issue.message;
    }
    return { ok: false, error: "請修正欄位", fieldErrors };
  }

  const sb = getServerSupabase();
  // Enforce Day 1 cap: max 2 active habits in first 21 days.
  const { count } = await sb
    .from("habits")
    .select("id", { count: "exact", head: true })
    .eq("user_id", SELF_USER_ID)
    .eq("active", true);
  if ((count ?? 0) >= 2) {
    return {
      ok: false,
      error: "Day 1 cap：最多 2 個 habit。21 日後可以解鎖加。",
    };
  }

  const { error } = await sb.from("habits").insert({
    user_id: SELF_USER_ID,
    name: parsed.data.name,
    type: parsed.data.type,
    target_qty: parsed.data.target_qty,
    unit: parsed.data.unit,
    if_then: parsed.data.if_then,
    cue_time: parsed.data.cue_time || null,
    difficulty: parsed.data.difficulty,
    weekly_goal: parsed.data.weekly_goal,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/today");
  redirect("/today");
}

interface CompleteResult {
  ok: boolean;
  drawnCard: DrawCard | null;
  streakBonus: boolean;
  weeklyBonus: boolean;
}

export async function completeHabit(
  habitId: string,
  qty: number,
  note?: string,
): Promise<CompleteResult> {
  const sb = getServerSupabase();
  const today = todayIso();

  // Idempotent: if already logged today, no-op.
  const { data: existingLog } = await sb
    .from("habit_logs")
    .select("id")
    .eq("habit_id", habitId)
    .eq("log_date", today)
    .maybeSingle();
  if (existingLog) {
    return { ok: true, drawnCard: null, streakBonus: false, weeklyBonus: false };
  }

  const { error: logErr } = await sb.from("habit_logs").insert({
    habit_id: habitId,
    log_date: today,
    qty,
    note: note ?? null,
  });
  if (logErr) throw new Error(logErr.message);

  // Update streak (never miss twice).
  const { data: prevStreakRow } = await sb
    .from("streak_state")
    .select("*")
    .eq("habit_id", habitId)
    .maybeSingle();
  const next = nextStreakOnComplete({
    prev: (prevStreakRow as StreakState | null) ?? null,
    todayIso: today,
  });
  await sb.from("streak_state").upsert({
    habit_id: habitId,
    current_streak: next.current_streak,
    best_streak: next.best_streak,
    last_completed_date: next.last_completed_date,
    status: next.status,
    updated_at: new Date().toISOString(),
  });

  // Weekly target check (Mon..Sun).
  const weeklyBonus = await checkWeeklyTarget(habitId, today);
  const streakBonus = next.current_streak > 0 && next.current_streak % 7 === 0;

  // XP delta.
  const xpDelta =
    XP_PER_DAILY_COMPLETE +
    (weeklyBonus ? XP_PER_WEEKLY_TARGET : 0) +
    (streakBonus ? XP_PER_7DAY_STREAK : 0);
  const { data: prof } = await sb
    .from("profiles")
    .select("xp")
    .eq("id", SELF_USER_ID)
    .single();
  if (prof) {
    await sb
      .from("profiles")
      .update({ xp: (prof.xp ?? 0) + xpDelta })
      .eq("id", SELF_USER_ID);
  }

  // Variable-ratio draw: every completion grants a guaranteed draw.
  const drawnCard = await drawRandomCard(
    streakBonus
      ? "streak_milestone"
      : weeklyBonus
        ? "weekly_target"
        : "daily_complete",
  );

  revalidatePath("/today");
  revalidatePath("/calendar");
  revalidatePath("/stats");

  return { ok: true, drawnCard, streakBonus, weeklyBonus };
}

async function checkWeeklyTarget(
  habitId: string,
  todayIsoStr: string,
): Promise<boolean> {
  const sb = getServerSupabase();
  const today = new Date(todayIsoStr + "T00:00:00Z");
  // ISO week: Monday is start. JS getUTCDay: Sunday=0..Saturday=6.
  const day = today.getUTCDay() === 0 ? 7 : today.getUTCDay();
  const monday = new Date(today);
  monday.setUTCDate(today.getUTCDate() - (day - 1));
  const weekStart = monday.toISOString().slice(0, 10);

  const { data: habit } = await sb
    .from("habits")
    .select("type, weekly_goal")
    .eq("id", habitId)
    .single();
  if (!habit || habit.type !== "weekly_target") return false;

  const { count } = await sb
    .from("habit_logs")
    .select("id", { count: "exact", head: true })
    .eq("habit_id", habitId)
    .gte("log_date", weekStart)
    .lte("log_date", todayIsoStr);
  return (count ?? 0) >= habit.weekly_goal;
}

async function drawRandomCard(trigger: string): Promise<DrawCard | null> {
  const sb = getServerSupabase();
  const rarity = pickRarity();
  const { data: cards } = await sb
    .from("draw_cards")
    .select("*")
    .eq("rarity", rarity);
  if (!cards || cards.length === 0) return null;
  const totalWeight = cards.reduce((sum, c) => sum + Number(c.weight ?? 1), 0);
  let r = Math.random() * totalWeight;
  let chosen: DrawCard = cards[0] as DrawCard;
  for (const c of cards) {
    r -= Number(c.weight ?? 1);
    if (r <= 0) {
      chosen = c as DrawCard;
      break;
    }
  }
  await sb.from("draw_log").insert({
    user_id: SELF_USER_ID,
    card_id: chosen.id,
    trigger,
  });
  return chosen;
}

function pickRarity(): CardRarity {
  const total =
    RARITY_WEIGHTS.common +
    RARITY_WEIGHTS.rare +
    RARITY_WEIGHTS.epic +
    RARITY_WEIGHTS.legendary;
  let r = Math.random() * total;
  if ((r -= RARITY_WEIGHTS.common) <= 0) return "common";
  if ((r -= RARITY_WEIGHTS.rare) <= 0) return "rare";
  if ((r -= RARITY_WEIGHTS.epic) <= 0) return "epic";
  return "legendary";
}

export async function archiveHabit(habitId: string): Promise<void> {
  const sb = getServerSupabase();
  await sb
    .from("habits")
    .update({ active: false, archived_at: new Date().toISOString() })
    .eq("id", habitId)
    .eq("user_id", SELF_USER_ID);
  revalidatePath("/today");
  revalidatePath("/stats");
}
