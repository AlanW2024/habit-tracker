interface IdentityTier {
  minLevel: number;
  title: string;
  blurb: string;
}

const TIERS: IdentityTier[] = [
  { minLevel: 1, title: "Beginner", blurb: "你已經開始。" },
  { minLevel: 5, title: "Daily Mover", blurb: "每日多走一步。" },
  { minLevel: 10, title: "Practitioner", blurb: "你開始練。" },
  { minLevel: 20, title: "Identity Forming", blurb: "你開始覺得自己係。" },
  { minLevel: 30, title: "Identity Aligned", blurb: "你係呢種人。" },
  { minLevel: 50, title: "Master", blurb: "你而家係榜樣。" },
  { minLevel: 80, title: "Sage", blurb: "你嘅習慣已經唔再需要 app。" },
  { minLevel: 99, title: "Legend", blurb: "新名稱由你定。" },
];

export function identityFor(level: number): IdentityTier {
  let result = TIERS[0];
  for (const tier of TIERS) {
    if (level >= tier.minLevel) result = tier;
  }
  return result;
}

const XP_BASE = 100;
const XP_GROWTH = 1.18;

export function xpRequiredForLevel(level: number): number {
  return Math.round(XP_BASE * Math.pow(XP_GROWTH, level - 1));
}

export function levelFromTotalXp(totalXp: number): {
  level: number;
  inLevelXp: number;
  needed: number;
} {
  let level = 1;
  let remaining = totalXp;
  while (remaining >= xpRequiredForLevel(level) && level < 99) {
    remaining -= xpRequiredForLevel(level);
    level += 1;
  }
  return { level, inLevelXp: remaining, needed: xpRequiredForLevel(level) };
}
