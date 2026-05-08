// Pure helpers to derive presentation (icon + color tab) from habit data.
// No DB changes — keys off the existing habit name + id only.

import type { HabitIconKind } from "@/components/icons";

const ICON_RULES: Array<{ keywords: readonly string[]; icon: HabitIconKind }> = [
  { keywords: ["水", "water"], icon: "water" },
  { keywords: ["跑", "run"], icon: "run" },
  { keywords: ["讀", "閱", "book", "read"], icon: "read" },
  { keywords: ["冥", "靜", "禪", "meditate"], icon: "meditate" },
  { keywords: ["睡", "床", "sleep", "11 點"], icon: "sleep" },
  { keywords: ["code", "程式", "coding", "ide", "vibe"], icon: "code" },
  { keywords: ["健", "gym", "舉", "肌"], icon: "gym" },
  { keywords: ["學", "study", "練"], icon: "study" },
  { keywords: ["澆", "植", "plant", "草"], icon: "water-plant" },
  { keywords: ["寫", "日記", "journal", "反思"], icon: "journal" },
];

/** Pick an icon kind from a habit name, falling back to "default". */
export function iconForHabit(name: string): HabitIconKind {
  const lower = name.toLowerCase();
  for (const rule of ICON_RULES) {
    for (const k of rule.keywords) {
      if (lower.includes(k.toLowerCase())) return rule.icon;
    }
  }
  return "default";
}

const COLOR_PALETTE: readonly string[] = [
  "#FF6B3D", // tangerine
  "#7C3AED", // grape
  "#5C9F22", // lime
  "#2D6FF0", // cobalt
  "#E0A800", // amber
  "#9B6BFF", // violet light
];

/** Stable color tab from habit id — same id always gets same color. */
export function colorForHabit(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  const idx = Math.abs(hash) % COLOR_PALETTE.length;
  return COLOR_PALETTE[idx];
}
