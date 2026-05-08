import { getServerSupabase } from "./supabase/server";
import { SELF_USER_ID } from "./supabase/config";
import type {
  DrawCard,
  DrawLog,
  Habit,
  HabitLog,
  Profile,
  StreakState,
  TodayHabit,
} from "./types";

export async function getProfile(): Promise<Profile> {
  const sb = getServerSupabase();
  const { data, error } = await sb
    .from("profiles")
    .select("*")
    .eq("id", SELF_USER_ID)
    .single();
  if (error || !data) {
    throw new Error(`找唔到 profile (id=${SELF_USER_ID})：${error?.message}`);
  }
  return data as Profile;
}

export async function getActiveHabits(): Promise<Habit[]> {
  const sb = getServerSupabase();
  const { data, error } = await sb
    .from("habits")
    .select("*")
    .eq("user_id", SELF_USER_ID)
    .eq("active", true)
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Habit[];
}

export async function getTodayHabits(todayIso: string): Promise<TodayHabit[]> {
  const sb = getServerSupabase();
  const habits = await getActiveHabits();
  if (habits.length === 0) return [];

  const habitIds = habits.map((h) => h.id);
  const [logsResp, streakResp] = await Promise.all([
    sb
      .from("habit_logs")
      .select("*")
      .in("habit_id", habitIds)
      .eq("log_date", todayIso),
    sb.from("streak_state").select("*").in("habit_id", habitIds),
  ]);
  if (logsResp.error) throw new Error(logsResp.error.message);
  if (streakResp.error) throw new Error(streakResp.error.message);

  const logsByHabit = new Map<string, HabitLog>();
  for (const l of logsResp.data ?? []) logsByHabit.set(l.habit_id, l);
  const streakByHabit = new Map<string, StreakState>();
  for (const s of streakResp.data ?? []) streakByHabit.set(s.habit_id, s);

  return habits.map((h) => {
    const log = logsByHabit.get(h.id) ?? null;
    return {
      ...h,
      completed_today: !!log,
      completed_qty: log?.qty ?? null,
      note: log?.note ?? null,
      streak: streakByHabit.get(h.id) ?? null,
    };
  });
}

export async function getMonthLogs(
  year: number,
  month: number,
): Promise<HabitLog[]> {
  const sb = getServerSupabase();
  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(year, month, 1));
  const startIso = start.toISOString().slice(0, 10);
  const endIso = end.toISOString().slice(0, 10);

  const { data: habits, error: hErr } = await sb
    .from("habits")
    .select("id")
    .eq("user_id", SELF_USER_ID);
  if (hErr) throw new Error(hErr.message);
  const ids = (habits ?? []).map((h) => h.id);
  if (ids.length === 0) return [];

  const { data, error } = await sb
    .from("habit_logs")
    .select("*")
    .in("habit_id", ids)
    .gte("log_date", startIso)
    .lt("log_date", endIso);
  if (error) throw new Error(error.message);
  return (data ?? []) as HabitLog[];
}

export async function getRecentDraws(limit = 12): Promise<
  Array<DrawLog & { card: DrawCard }>
> {
  const sb = getServerSupabase();
  const { data, error } = await sb
    .from("draw_log")
    .select("*, card:draw_cards(*)")
    .eq("user_id", SELF_USER_ID)
    .order("drawn_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data ?? []) as Array<DrawLog & { card: DrawCard }>;
}

export async function getCompletionStats(days = 30): Promise<{
  totalCompletions: number;
  perDay: Record<string, number>;
  topHabit: { name: string; count: number } | null;
}> {
  const sb = getServerSupabase();
  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceIso = since.toISOString().slice(0, 10);

  const { data: habits, error: hErr } = await sb
    .from("habits")
    .select("id, name")
    .eq("user_id", SELF_USER_ID);
  if (hErr) throw new Error(hErr.message);
  const idToName = new Map<string, string>();
  for (const h of habits ?? []) idToName.set(h.id, h.name);
  const ids = Array.from(idToName.keys());
  if (ids.length === 0) {
    return { totalCompletions: 0, perDay: {}, topHabit: null };
  }

  const { data, error } = await sb
    .from("habit_logs")
    .select("habit_id, log_date")
    .in("habit_id", ids)
    .gte("log_date", sinceIso);
  if (error) throw new Error(error.message);

  const perDay: Record<string, number> = {};
  const perHabit: Record<string, number> = {};
  for (const l of data ?? []) {
    perDay[l.log_date] = (perDay[l.log_date] ?? 0) + 1;
    perHabit[l.habit_id] = (perHabit[l.habit_id] ?? 0) + 1;
  }
  let topHabit: { name: string; count: number } | null = null;
  for (const [hid, count] of Object.entries(perHabit)) {
    if (!topHabit || count > topHabit.count) {
      topHabit = { name: idToName.get(hid) ?? "未命名", count };
    }
  }
  return { totalCompletions: data?.length ?? 0, perDay, topHabit };
}
