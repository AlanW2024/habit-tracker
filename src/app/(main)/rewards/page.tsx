import { getAllCards } from "@/lib/db";
import type { DrawCard, CardRarity } from "@/lib/types";
import { RARITY_XP_BONUS } from "@/lib/domain";
import { RewardForm } from "./RewardForm";
import { DeleteCardButton } from "./DeleteCardButton";

export const dynamic = "force-dynamic";

const RARITY_LABEL: Record<CardRarity, string> = {
  common: "Common",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary",
};

const RARITY_COLOR: Record<CardRarity, string> = {
  common: "var(--color-fg-muted)",
  rare: "var(--color-mint)",
  epic: "var(--color-accent)",
  legendary: "#fb7185",
};

const RARITY_ODDS: Record<CardRarity, string> = {
  common: "70%",
  rare: "22%",
  epic: "7%",
  legendary: "1%",
};

export default async function RewardsPage() {
  const cards = await getAllCards();
  const grouped: Record<CardRarity, DrawCard[]> = {
    common: [],
    rare: [],
    epic: [],
    legendary: [],
  };
  for (const c of cards) grouped[c.rarity].push(c);

  return (
    <div className="pt-2">
      <header className="mb-5 mt-2">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
          REWARD DECK
        </p>
        <h1 className="mt-1 text-3xl font-semibold">牌庫</h1>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-fg-muted)]">
          自己定獎勵卡。完成 habit 後抽中就解鎖。
          系統 identity 卡保留，做安慰獎；rare 以上嘅獎勵建議你自己 add。
        </p>
      </header>

      <section className="surface-card mb-6 p-4">
        <h2 className="text-sm font-semibold">加自己嘅獎勵</h2>
        <p className="mt-1 mb-4 text-[12px] leading-relaxed text-[var(--color-fg-subtle)]">
          例：「玩 30 分鐘 game」「食一支雪糕」「買杯咖啡」「Netflix 一集」。
          rarity 越高，被抽中機會越低，但 +XP 越多。
        </p>
        <RewardForm />
      </section>

      <section>
        <h2 className="mb-3 text-sm font-medium text-[var(--color-fg-muted)]">
          已加入嘅卡 · 共 {cards.length} 張
        </h2>
        {(["legendary", "epic", "rare", "common"] as CardRarity[]).map(
          (rarity) =>
            grouped[rarity].length > 0 && (
              <RarityGroup
                key={rarity}
                rarity={rarity}
                cards={grouped[rarity]}
              />
            ),
        )}
      </section>
    </div>
  );
}

function RarityGroup({
  rarity,
  cards,
}: {
  rarity: CardRarity;
  cards: DrawCard[];
}) {
  return (
    <div className="mb-5">
      <div className="mb-2 flex items-baseline justify-between">
        <h3 className="flex items-baseline gap-2 text-[12px] uppercase tracking-[0.2em]">
          <span style={{ color: RARITY_COLOR[rarity] }}>
            {RARITY_LABEL[rarity]}
          </span>
          <span className="text-[10px] text-[var(--color-fg-subtle)]">
            機率 {RARITY_ODDS[rarity]} · +{RARITY_XP_BONUS[rarity]} XP
          </span>
        </h3>
      </div>
      <ul className="flex flex-col gap-2">
        {cards.map((c) => (
          <li
            key={c.id}
            className="surface-card flex items-start gap-3 px-4 py-3"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2">
                <span className="truncate text-[15px] font-semibold">
                  {c.title}
                </span>
                {c.code.startsWith("u_") && (
                  <span className="rounded-full border border-[var(--color-accent)] px-1.5 py-0 text-[9px] font-medium text-[var(--color-accent)]">
                    你嘅
                  </span>
                )}
              </div>
              <p className="mt-1 text-[13px] leading-snug text-[var(--color-fg-muted)]">
                {c.copy}
              </p>
              <p className="mt-1 text-[10px] text-[var(--color-fg-subtle)]">
                權重 {c.weight}
              </p>
            </div>
            {c.code.startsWith("u_") && <DeleteCardButton cardId={c.id} />}
          </li>
        ))}
      </ul>
    </div>
  );
}
