// Client-side badge computation. No DB schema changes — pure derivation
// from values already on the page (streak, total completions, level).

import type { Dict } from "@/i18n";

export type BadgeKey =
  | "streak_7"
  | "streak_30"
  | "streak_100"
  | "total_30"
  | "total_100"
  | "level_5"
  | "level_10"
  | "level_20";

export interface BadgeStat {
  key: BadgeKey;
  earned: boolean;
  title: string;
  desc: string;
}

interface BadgeInputs {
  bestStreak: number;
  totalCompletions: number;
  level: number;
  dict: Dict;
}

export function computeBadges({
  bestStreak,
  totalCompletions,
  level,
  dict,
}: BadgeInputs): readonly BadgeStat[] {
  return [
    {
      key: "streak_7",
      earned: bestStreak >= 7,
      title: dict.rewards.badge_streak_7_title,
      desc: dict.rewards.badge_streak_7_desc,
    },
    {
      key: "streak_30",
      earned: bestStreak >= 30,
      title: dict.rewards.badge_streak_30_title,
      desc: dict.rewards.badge_streak_30_desc,
    },
    {
      key: "streak_100",
      earned: bestStreak >= 100,
      title: dict.rewards.badge_streak_100_title,
      desc: dict.rewards.badge_streak_100_desc,
    },
    {
      key: "total_30",
      earned: totalCompletions >= 30,
      title: dict.rewards.badge_total_30_title,
      desc: dict.rewards.badge_total_30_desc,
    },
    {
      key: "total_100",
      earned: totalCompletions >= 100,
      title: dict.rewards.badge_total_100_title,
      desc: dict.rewards.badge_total_100_desc,
    },
    {
      key: "level_5",
      earned: level >= 5,
      title: dict.rewards.badge_level_5_title,
      desc: dict.rewards.badge_level_5_desc,
    },
    {
      key: "level_10",
      earned: level >= 10,
      title: dict.rewards.badge_level_10_title,
      desc: dict.rewards.badge_level_10_desc,
    },
    {
      key: "level_20",
      earned: level >= 20,
      title: dict.rewards.badge_level_20_title,
      desc: dict.rewards.badge_level_20_desc,
    },
  ];
}
