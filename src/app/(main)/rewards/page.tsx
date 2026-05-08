import { getAllCards, getBestStreak, getCompletionStats, getProfile } from "@/lib/db";
import type { DrawCard, CardRarity } from "@/lib/types";
import { RARITY_XP_BONUS } from "@/lib/domain";
import { computeBadges } from "@/lib/badges";
import { levelFromTotalXp } from "@/lib/identity";
import { getDict, format } from "@/i18n";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { RewardForm } from "./RewardForm";
import { DeleteCardButton } from "./DeleteCardButton";

export const dynamic = "force-dynamic";

const RARITY_COLOR: Record<CardRarity, string> = {
  common: "var(--color-muted)",
  rare: "#5C9F22",
  epic: "var(--color-primary)",
  legendary: "#C73B4A",
};

const RARITY_ODDS: Record<CardRarity, string> = {
  common: "70%",
  rare: "22%",
  epic: "7%",
  legendary: "1%",
};

export default async function RewardsPage() {
  const [cards, bestStreak, stats, profile, dict] = await Promise.all([
    getAllCards(),
    getBestStreak(),
    getCompletionStats(365),
    getProfile(),
    getDict(),
  ]);
  const grouped: Record<CardRarity, DrawCard[]> = {
    common: [],
    rare: [],
    epic: [],
    legendary: [],
  };
  for (const c of cards) grouped[c.rarity].push(c);

  const { level } = levelFromTotalXp(profile.xp);
  const badges = computeBadges({
    bestStreak,
    totalCompletions: stats.totalCompletions,
    level,
    dict,
  });
  const earnedBadges = badges.filter((b) => b.earned);

  return (
    <div className="pt-2" style={{ paddingBottom: 120 }}>
      <header className="mb-5 mt-2">
        <p
          style={{
            fontSize: 11,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: "var(--color-muted)",
          }}
        >
          {dict.rewards.title}
        </p>
        <h1
          style={{
            marginTop: 4,
            fontFamily:
              "var(--font-display), Space Grotesk, system-ui, sans-serif",
            fontSize: 30,
            fontWeight: 700,
            color: "var(--color-text)",
            letterSpacing: -1,
          }}
        >
          {dict.rewards.title}
        </h1>
        <p
          style={{
            marginTop: 8,
            fontSize: 14,
            color: "var(--color-muted)",
            lineHeight: 1.6,
            whiteSpace: "pre-line",
          }}
        >
          {dict.rewards.subtitle}
        </p>
      </header>

      <section style={{ marginBottom: 24 }}>
        <SectionHeader
          title={dict.rewards.section_badges}
          action={`${earnedBadges.length}/${badges.length}`}
        />
        <ul
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
            gap: 8,
          }}
        >
          {badges.map((b) => (
            <li
              key={b.key}
              style={{
                background: b.earned
                  ? "var(--color-primary-soft)"
                  : "var(--color-surface)",
                border: `1.5px solid ${b.earned ? "var(--color-primary)" : "var(--color-border)"}`,
                borderRadius: 16,
                padding: 12,
                opacity: b.earned ? 1 : 0.55,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 26,
                  marginBottom: 6,
                  color: b.earned ? "var(--color-primary)" : "var(--color-muted)",
                }}
                aria-hidden="true"
              >
                {b.earned ? "★" : "☆"}
              </div>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: b.earned ? "var(--color-primary)" : "var(--color-text)",
                  lineHeight: 1.3,
                }}
              >
                {b.title}
              </p>
              <p
                style={{
                  marginTop: 4,
                  fontSize: 11,
                  color: "var(--color-muted)",
                  lineHeight: 1.4,
                }}
              >
                {b.desc}
              </p>
              <p
                style={{
                  marginTop: 6,
                  fontSize: 10,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  color: b.earned ? "var(--color-primary)" : "var(--color-muted)",
                }}
              >
                {b.earned ? dict.rewards.badge_earned : dict.rewards.badge_locked}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section
        style={{
          background: "var(--color-surface)",
          borderRadius: 22,
          border: "1.5px solid var(--color-border)",
          padding: 16,
          marginBottom: 24,
        }}
      >
        <h2
          style={{
            fontSize: 14,
            fontWeight: 800,
            color: "var(--color-text)",
          }}
        >
          {dict.rewards.section_add}
        </h2>
        <p
          style={{
            marginTop: 4,
            marginBottom: 14,
            fontSize: 12,
            color: "var(--color-muted)",
            lineHeight: 1.6,
            whiteSpace: "pre-line",
          }}
        >
          {dict.rewards.add_hint}
        </p>
        <RewardForm />
      </section>

      <section>
        <SectionHeader
          title={format(dict.rewards.section_list, { count: cards.length })}
        />
        {(["legendary", "epic", "rare", "common"] as CardRarity[]).map(
          (rarity) =>
            grouped[rarity].length > 0 && (
              <RarityGroup
                key={rarity}
                rarity={rarity}
                cards={grouped[rarity]}
                rarityLabel={dict.rarities[rarity]}
                oddsLabel={format(dict.rewards.rarity_odds, {
                  odds: RARITY_ODDS[rarity],
                  bonus: RARITY_XP_BONUS[rarity],
                })}
                ownedLabel={dict.rewards.owned_label}
                weightTemplate={dict.rewards.weight_label}
              />
            ),
        )}
      </section>
    </div>
  );
}

interface RarityGroupProps {
  rarity: CardRarity;
  cards: DrawCard[];
  rarityLabel: string;
  oddsLabel: string;
  ownedLabel: string;
  weightTemplate: string;
}

function RarityGroup({
  rarity,
  cards,
  rarityLabel,
  oddsLabel,
  ownedLabel,
  weightTemplate,
}: RarityGroupProps) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div className="mb-2 flex items-baseline justify-between">
        <h3 className="flex items-baseline gap-2" style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.2em" }}>
          <span style={{ color: RARITY_COLOR[rarity], fontWeight: 800 }}>
            {rarityLabel}
          </span>
          <span style={{ fontSize: 10, color: "var(--color-muted)" }}>
            {oddsLabel}
          </span>
        </h3>
      </div>
      <ul style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {cards.map((c) => (
          <li
            key={c.id}
            style={{
              background: "var(--color-surface)",
              borderRadius: 16,
              border: "1.5px solid var(--color-border)",
              padding: "12px 14px",
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="flex items-baseline gap-2">
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 800,
                    color: "var(--color-text)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {c.title}
                </span>
                {c.code.startsWith("u_") && (
                  <span
                    style={{
                      borderRadius: 999,
                      border: "1px solid var(--color-primary)",
                      padding: "0 6px",
                      fontSize: 9,
                      fontWeight: 800,
                      color: "var(--color-primary)",
                    }}
                  >
                    {ownedLabel}
                  </span>
                )}
              </div>
              <p
                style={{
                  marginTop: 4,
                  fontSize: 13,
                  color: "var(--color-muted)",
                  lineHeight: 1.5,
                }}
              >
                {c.copy}
              </p>
              <p
                style={{
                  marginTop: 4,
                  fontSize: 10,
                  color: "var(--color-muted)",
                }}
              >
                {format(weightTemplate, { weight: c.weight })}
              </p>
            </div>
            {c.code.startsWith("u_") && <DeleteCardButton cardId={c.id} />}
          </li>
        ))}
      </ul>
    </div>
  );
}
