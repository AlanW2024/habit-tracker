"use client";

import { useState, useTransition } from "react";
import { completeHabit } from "@/lib/actions";
import { format } from "@/i18n/format";
import { useDict } from "@/i18n/Provider";
import { colorForHabit, iconForHabit } from "@/lib/habit-style";
import { FlameIcon, HabitIcon } from "./icons";
import { Celebration } from "./Celebration";
import { DrawRitual } from "./DrawRitual";
import type { TodayHabit } from "@/lib/types";

type Trigger = "daily_complete" | "weekly_target" | "streak_milestone";

interface HabitCardProps {
  habit: TodayHabit;
}

export function HabitCard({ habit }: HabitCardProps) {
  const dict = useDict();
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(habit.completed_today);
  const [streak, setStreak] = useState(habit.streak?.current_streak ?? 0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [pendingDraw, setPendingDraw] = useState<{
    trigger: Trigger;
  } | null>(null);
  const [ritualOpen, setRitualOpen] = useState(false);

  const tint = colorForHabit(habit.id);
  const iconKind = iconForHabit(habit.name);

  const onClick = () => {
    if (done || pending) return;
    startTransition(async () => {
      const result = await completeHabit(habit.id, habit.target_qty);
      setDone(true);
      // Optimistically reflect the streak bump for the celebration text.
      setStreak((prev) => prev + 1);
      setShowCelebration(true);
      if (result.shouldDraw) {
        setPendingDraw({ trigger: result.trigger });
      }
    });
  };

  const onCelebrationDone = () => {
    setShowCelebration(false);
    if (pendingDraw) {
      setRitualOpen(true);
    }
  };

  const onRitualClose = () => {
    setRitualOpen(false);
    setPendingDraw(null);
  };

  const goalLabel =
    habit.type === "daily_must"
      ? dict.habit_card.type_daily
      : format(dict.habit_card.type_weekly, { done: habit.weekly_goal });
  const time = habit.cue_time ?? "";

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        aria-pressed={done}
        aria-label={done ? dict.habit_card.label_completed : dict.habit_card.label_complete}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick();
          }
        }}
        style={{
          background: "var(--color-surface)",
          borderRadius: 22,
          padding: 16,
          display: "flex",
          alignItems: "center",
          gap: 14,
          cursor: done || pending ? "default" : "pointer",
          border: "1.5px solid var(--color-border)",
          boxShadow: "var(--shadow-pop-light)",
          transition: "transform 120ms ease",
          opacity: done ? 0.7 : 1,
          position: "relative",
          overflow: "hidden",
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
          <HabitIcon kind={iconKind} size={28} color="#fff" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: "var(--font-body), Nunito, system-ui, sans-serif",
              fontSize: 16,
              fontWeight: 800,
              color: "var(--color-text)",
              letterSpacing: -0.2,
              textDecoration: done ? "line-through" : "none",
              textDecorationThickness: 2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {habit.name}
          </div>
          <div
            style={{
              marginTop: 4,
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "var(--font-body), Nunito, system-ui, sans-serif",
              fontSize: 12,
              fontWeight: 700,
              color: "var(--color-muted)",
            }}
          >
            <FlameIcon size={14} color="var(--color-flame)" />
            <span>
              {streak} {dict.today.stat_streak_unit}
            </span>
            {time && (
              <>
                <span style={{ opacity: 0.5 }}>·</span>
                <span>{time}</span>
              </>
            )}
            <span style={{ opacity: 0.5 }}>·</span>
            <span>{goalLabel}</span>
          </div>
        </div>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            background: done ? "var(--color-success)" : "transparent",
            boxShadow: done
              ? "inset 0 -4px 0 rgba(0,0,0,0.15)"
              : "inset 0 0 0 2.5px var(--color-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "all 200ms cubic-bezier(.2,.9,.3,1.4)",
          }}
        >
          {done && (
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M5 12 l5 5 l9 -10"
                stroke="#fff"
                strokeWidth="3.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            // Detail menu placeholder — will hook into /habits in Phase 5.
          }}
          aria-label={dict.habit_card.details_aria}
          style={{
            width: 32,
            height: 32,
            borderRadius: 12,
            border: "none",
            cursor: "pointer",
            background: "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="6" height="22" viewBox="0 0 6 22" aria-hidden="true">
            <circle cx="3" cy="4" r="2" fill="var(--color-muted)" />
            <circle cx="3" cy="11" r="2" fill="var(--color-muted)" />
            <circle cx="3" cy="18" r="2" fill="var(--color-muted)" />
          </svg>
        </button>
      </div>

      {showCelebration && (
        <Celebration
          habit={{ id: habit.id, name: habit.name, streak }}
          onDone={onCelebrationDone}
        />
      )}

      <DrawRitual
        open={ritualOpen}
        trigger={pendingDraw?.trigger ?? "daily_complete"}
        onClose={onRitualClose}
      />
    </>
  );
}
