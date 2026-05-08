import Link from "next/link";
import { getServerSupabase } from "@/lib/supabase/server";
import { SELF_USER_ID } from "@/lib/supabase/config";
import { getDict, format } from "@/i18n";
import { ChunkyButton } from "@/components/ui/ChunkyButton";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FlameIcon, HabitIcon } from "@/components/icons";
import { colorForHabit, iconForHabit } from "@/lib/habit-style";
import type { Habit, StreakState } from "@/lib/types";

export const dynamic = "force-dynamic";

interface HabitRowProps {
  habit: Habit;
  streak: StreakState | null;
  archived?: boolean;
  weeklyLabel: string;
  dailyLabel: string;
  streakUnit: string;
}

function HabitRow({
  habit,
  streak,
  archived,
  weeklyLabel,
  dailyLabel,
  streakUnit,
}: HabitRowProps) {
  const tint = colorForHabit(habit.id);
  const icon = iconForHabit(habit.name);
  return (
    <div
      style={{
        background: "var(--color-surface)",
        borderRadius: 22,
        padding: 16,
        display: "flex",
        alignItems: "center",
        gap: 14,
        border: "1.5px solid var(--color-border)",
        opacity: archived ? 0.65 : 1,
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 16,
          background: tint,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          boxShadow: `inset 0 -3px 0 rgba(0,0,0,0.15), 0 4px 0 ${tint}33`,
        }}
      >
        <HabitIcon kind={icon} size={28} color="#fff" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: "var(--color-text)",
            letterSpacing: -0.2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {habit.name}
        </p>
        <div
          style={{
            marginTop: 4,
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 12,
            fontWeight: 700,
            color: "var(--color-muted)",
          }}
        >
          <FlameIcon size={14} color="var(--color-flame)" />
          <span>
            {streak?.current_streak ?? 0} {streakUnit}
          </span>
          <span style={{ opacity: 0.5 }}>·</span>
          <span>
            {habit.type === "daily_must" ? dailyLabel : weeklyLabel}
          </span>
          {habit.cue_time && (
            <>
              <span style={{ opacity: 0.5 }}>·</span>
              <span>{habit.cue_time}</span>
            </>
          )}
        </div>
        <p
          style={{
            marginTop: 4,
            fontSize: 12,
            color: "var(--color-muted)",
            lineHeight: 1.5,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {habit.if_then}
        </p>
      </div>
    </div>
  );
}

export default async function HabitsPage() {
  const dict = await getDict();
  const sb = await getServerSupabase();
  const [habitsResp, streakResp] = await Promise.all([
    sb
      .from("habits")
      .select("*")
      .eq("user_id", SELF_USER_ID)
      .order("created_at", { ascending: true }),
    sb.from("streak_state").select("*"),
  ]);
  const habits: Habit[] = (habitsResp.data ?? []) as Habit[];
  const streaks: StreakState[] = (streakResp.data ?? []) as StreakState[];
  const streakByHabit = new Map<string, StreakState>();
  for (const s of streaks) streakByHabit.set(s.habit_id, s);

  const active = habits.filter((h) => h.active);
  const archived = habits.filter((h) => !h.active);

  return (
    <div className="pt-2" style={{ paddingBottom: 120 }}>
      <header className="mb-5 mt-2">
        <h1
          style={{
            fontFamily:
              "var(--font-display), Space Grotesk, system-ui, sans-serif",
            fontSize: 30,
            fontWeight: 700,
            color: "var(--color-text)",
            letterSpacing: -1,
          }}
        >
          {dict.habits.title}
        </h1>
        <p style={{ marginTop: 4, fontSize: 14, color: "var(--color-muted)" }}>
          {dict.habits.subtitle}
        </p>
      </header>

      <section style={{ marginBottom: 18 }}>
        <SectionHeader title={dict.habits.filter_active} action={`${active.length}`} />
        {active.length === 0 ? (
          <p style={{ fontSize: 14, color: "var(--color-muted)" }}>
            {dict.habits.empty_active}
          </p>
        ) : (
          <ul style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {active.map((h) => (
              <li key={h.id}>
                <HabitRow
                  habit={h}
                  streak={streakByHabit.get(h.id) ?? null}
                  weeklyLabel={format(dict.habit_card.type_weekly, {
                    done: h.weekly_goal,
                  })}
                  dailyLabel={dict.habit_card.type_daily}
                  streakUnit={dict.today.stat_streak_unit}
                />
              </li>
            ))}
          </ul>
        )}
        <div style={{ marginTop: 14 }}>
          <Link
            href="/onboarding/new"
            style={{ textDecoration: "none", display: "inline-block" }}
          >
            <ChunkyButton size="sm">{dict.habits.add_cta}</ChunkyButton>
          </Link>
        </div>
      </section>

      {archived.length > 0 && (
        <section>
          <SectionHeader
            title={dict.habits.filter_archived}
            action={`${archived.length}`}
          />
          <ul style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {archived.map((h) => (
              <li key={h.id}>
                <HabitRow
                  habit={h}
                  streak={streakByHabit.get(h.id) ?? null}
                  archived
                  weeklyLabel={format(dict.habit_card.type_weekly, {
                    done: h.weekly_goal,
                  })}
                  dailyLabel={dict.habit_card.type_daily}
                  streakUnit={dict.today.stat_streak_unit}
                />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
