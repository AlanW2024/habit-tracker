"use client";

import { useState, useTransition } from "react";
import { Check, Flame } from "lucide-react";
import { completeHabit } from "@/lib/actions";
import { fireConfetti } from "./ConfettiBurst";
import { DrawRitual } from "./DrawRitual";
import type { TodayHabit } from "@/lib/types";

type Trigger = "daily_complete" | "weekly_target" | "streak_milestone";

interface HabitCardProps {
  habit: TodayHabit;
}

export function HabitCard({ habit }: HabitCardProps) {
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(habit.completed_today);
  const [ritualOpen, setRitualOpen] = useState(false);
  const [trigger, setTrigger] = useState<Trigger>("daily_complete");
  const [bonusBadge, setBonusBadge] = useState<string | null>(null);

  const onComplete = () => {
    if (done || pending) return;
    startTransition(async () => {
      const result = await completeHabit(habit.id, habit.target_qty);
      setDone(true);
      fireConfetti();
      if (result.streakBonus) setBonusBadge("七日不間斷 +100 XP");
      else if (result.weeklyBonus) setBonusBadge("達到本週目標 +50 XP");
      if (result.shouldDraw) {
        setTrigger(result.trigger);
        // Slight delay so confetti gets the spotlight first, then ritual takes over
        setTimeout(() => setRitualOpen(true), 350);
      }
    });
  };

  const streak = habit.streak?.current_streak ?? 0;

  return (
    <>
      <article
        className={`surface-card flex items-start gap-3 p-4 transition-all ${
          done ? "opacity-70" : ""
        }`}
      >
        <button
          type="button"
          aria-label={done ? "今日已完成" : "標記完成"}
          aria-pressed={done}
          onClick={onComplete}
          disabled={done || pending}
          className={`shrink-0 flex h-12 w-12 items-center justify-center rounded-full border transition-all ${
            done
              ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent)] complete-ring"
              : "border-[var(--color-border-strong)] hover:border-[var(--color-accent)]"
          }`}
        >
          {done ? <Check size={22} strokeWidth={2.4} /> : null}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <h3 className="truncate text-[17px] font-semibold tracking-tight">
              {habit.name}
            </h3>
            {streak >= 1 && (
              <span className="inline-flex items-center gap-0.5 text-xs text-[var(--color-accent)]">
                <Flame size={12} strokeWidth={2.5} />
                {streak}
              </span>
            )}
          </div>
          <p className="mt-1 text-[13px] leading-snug text-[var(--color-fg-muted)]">
            {habit.if_then}
          </p>
          <div className="mt-2 flex items-center gap-3 text-[12px] text-[var(--color-fg-subtle)]">
            <span>
              {habit.type === "daily_must" ? "每日" : `每週 ${habit.weekly_goal}/7`}
            </span>
            <span aria-hidden="true">·</span>
            <span>
              {habit.target_qty} {habit.unit}
            </span>
            {habit.cue_time && (
              <>
                <span aria-hidden="true">·</span>
                <span>{habit.cue_time}</span>
              </>
            )}
          </div>
          {bonusBadge && (
            <p className="mt-2 inline-block rounded-full bg-[var(--color-accent-soft)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--color-accent)]">
              {bonusBadge}
            </p>
          )}
        </div>
      </article>

      <DrawRitual
        open={ritualOpen}
        trigger={trigger}
        onClose={() => setRitualOpen(false)}
      />
    </>
  );
}
