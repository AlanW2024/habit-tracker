export type HabitType = "daily_must" | "weekly_target";
export type HabitDifficulty = "tiny" | "normal" | "stretch";
export type StreakStatus = "on_track" | "missed_once" | "alert";
export type CardRarity = "common" | "rare" | "epic" | "legendary";

export interface Profile {
  id: string;
  display_name: string;
  level: number;
  xp: number;
  created_at: string;
}

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  type: HabitType;
  target_qty: number;
  unit: string;
  if_then: string;
  cue_time: string | null;
  difficulty: HabitDifficulty;
  weekly_goal: number;
  active: boolean;
  created_at: string;
  archived_at: string | null;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  log_date: string;
  qty: number;
  note: string | null;
  created_at: string;
}

export interface StreakState {
  habit_id: string;
  current_streak: number;
  best_streak: number;
  last_completed_date: string | null;
  status: StreakStatus;
  updated_at: string;
}

export interface DrawCard {
  id: string;
  code: string;
  rarity: CardRarity;
  title: string;
  copy: string;
  weight: number;
}

export interface DrawLog {
  id: string;
  user_id: string;
  card_id: string;
  trigger: string;
  drawn_at: string;
}

export interface TodayHabit extends Habit {
  completed_today: boolean;
  completed_qty: number | null;
  note: string | null;
  streak: StreakState | null;
}
