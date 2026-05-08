import type { Dict } from "@/i18n";

export type IdentityTierKey =
  | "beginner"
  | "daily_mover"
  | "practitioner"
  | "identity_forming"
  | "identity_aligned"
  | "master"
  | "sage"
  | "legend";

interface IdentityTier {
  minLevel: number;
  key: IdentityTierKey;
}

const TIERS: readonly IdentityTier[] = [
  { minLevel: 1, key: "beginner" },
  { minLevel: 5, key: "daily_mover" },
  { minLevel: 10, key: "practitioner" },
  { minLevel: 20, key: "identity_forming" },
  { minLevel: 30, key: "identity_aligned" },
  { minLevel: 50, key: "master" },
  { minLevel: 80, key: "sage" },
  { minLevel: 99, key: "legend" },
] as const;

export function identityKeyFor(level: number): IdentityTierKey {
  let result: IdentityTierKey = TIERS[0].key;
  for (const tier of TIERS) {
    if (level >= tier.minLevel) result = tier.key;
  }
  return result;
}

export function identityTitleFor(level: number, dict: Dict): string {
  const key = identityKeyFor(level);
  const titleKey = `tier_title_${key}` as keyof Dict["identity"];
  return dict.identity[titleKey];
}

export function identityBlurbFor(level: number, dict: Dict): string {
  const key = identityKeyFor(level);
  const blurbKey = `tier_blurb_${key}` as keyof Dict["identity"];
  return dict.identity[blurbKey];
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
