import type { StreakState, StreakStatus } from "./types";

export const XP_PER_DAILY_COMPLETE = 10;
export const XP_PER_WEEKLY_TARGET = 50;
export const XP_PER_7DAY_STREAK = 100;

function daysBetween(a: string, b: string): number {
  const da = new Date(a + "T00:00:00Z");
  const db = new Date(b + "T00:00:00Z");
  return Math.round((db.getTime() - da.getTime()) / 86_400_000);
}

interface NextStreakInput {
  prev: StreakState | null;
  todayIso: string;
}

interface NextStreakResult {
  current_streak: number;
  best_streak: number;
  last_completed_date: string;
  status: StreakStatus;
}

export function nextStreakOnComplete({
  prev,
  todayIso,
}: NextStreakInput): NextStreakResult {
  if (!prev || !prev.last_completed_date) {
    return {
      current_streak: 1,
      best_streak: Math.max(1, prev?.best_streak ?? 0),
      last_completed_date: todayIso,
      status: "on_track",
    };
  }
  if (prev.last_completed_date === todayIso) {
    return {
      current_streak: prev.current_streak,
      best_streak: prev.best_streak,
      last_completed_date: todayIso,
      status: "on_track",
    };
  }
  const gap = daysBetween(prev.last_completed_date, todayIso);
  let nextStreak: number;
  if (gap === 1) {
    nextStreak = prev.current_streak + 1;
  } else if (gap === 2) {
    // missed exactly one day — never miss twice keeps soft continuity
    nextStreak = prev.current_streak + 1;
  } else {
    nextStreak = 1;
  }
  return {
    current_streak: nextStreak,
    best_streak: Math.max(prev.best_streak, nextStreak),
    last_completed_date: todayIso,
    status: "on_track",
  };
}

export function statusForToday(
  prev: StreakState | null,
  todayIso: string,
): StreakStatus {
  if (!prev?.last_completed_date) return "on_track";
  if (prev.last_completed_date === todayIso) return "on_track";
  const gap = daysBetween(prev.last_completed_date, todayIso);
  if (gap <= 1) return "on_track";
  if (gap === 2) return "missed_once";
  return "alert";
}

interface CardRarityWeight {
  common: number;
  rare: number;
  epic: number;
  legendary: number;
}

export const RARITY_WEIGHTS: CardRarityWeight = {
  common: 70,
  rare: 22,
  epic: 7,
  legendary: 1,
};

// Rarity-tier reward — 唔同 rarity 派唔同 bonus XP
// Common 唔加 bonus 因為已經有 base XP，留住 rarity 跳升嘅落差感
export const RARITY_XP_BONUS: CardRarityWeight = {
  common: 0,
  rare: 5,
  epic: 20,
  legendary: 50,
};

export function todayIso(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
