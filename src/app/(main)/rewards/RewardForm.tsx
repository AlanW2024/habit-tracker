"use client";

import { useActionState, useState } from "react";
import { createRewardCard, type RewardCardFormState } from "@/lib/actions";
import type { CardRarity } from "@/lib/types";

const RARITIES: Array<{ key: CardRarity; label: string; bonus: string; odds: string }> = [
  { key: "rare", label: "Rare", bonus: "+5 XP", odds: "22%" },
  { key: "epic", label: "Epic", bonus: "+20 XP", odds: "7%" },
  { key: "legendary", label: "Legendary", bonus: "+50 XP", odds: "1%" },
];

const PRESETS = [
  { title: "玩 30 分鐘 game", rarity: "rare" as CardRarity },
  { title: "Netflix 一集", rarity: "rare" as CardRarity },
  { title: "食一支雪糕", rarity: "rare" as CardRarity },
  { title: "出去食一餐想食嘅", rarity: "epic" as CardRarity },
  { title: "買嗰本想要嘅書", rarity: "epic" as CardRarity },
  { title: "去旅行訂機票", rarity: "legendary" as CardRarity },
];

export function RewardForm() {
  const [state, action, pending] = useActionState<RewardCardFormState, FormData>(
    createRewardCard,
    { ok: false },
  );
  const [rarity, setRarity] = useState<CardRarity>("rare");

  const fillPreset = (p: (typeof PRESETS)[number]) => {
    const titleEl = document.querySelector(
      'input[name="title"]',
    ) as HTMLInputElement | null;
    if (titleEl) titleEl.value = p.title;
    setRarity(p.rarity);
  };

  return (
    <form action={action} className="flex flex-col gap-4" key={state.ok ? "ok" : "form"}>
      <div>
        <p className="mb-1.5 text-[11px] text-[var(--color-fg-subtle)]">快速範例</p>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.title}
              type="button"
              onClick={() => fillPreset(p)}
              className="rounded-full border border-[var(--color-border-strong)] px-2.5 py-1 text-[11px] hover:border-[var(--color-accent)]"
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">獎勵名稱</span>
        <input
          name="title"
          required
          maxLength={40}
          placeholder="例：玩 30 分鐘 Genshin"
          className="input-field"
        />
        {state.fieldErrors?.title && (
          <p className="mt-1 text-[12px] text-[var(--color-rose)]">
            {state.fieldErrors.title}
          </p>
        )}
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">
          描述 <span className="text-[var(--color-fg-subtle)]">(可空)</span>
        </span>
        <input
          name="copy"
          maxLength={160}
          placeholder="可空。空就自動：「___ · 你今日贏到嘅。」"
          className="input-field"
        />
      </label>

      <div>
        <span className="mb-2 block text-sm font-medium">等級</span>
        <div className="grid grid-cols-3 gap-2">
          {RARITIES.map((r) => (
            <label
              key={r.key}
              className={`surface-card cursor-pointer px-2 py-2.5 text-center ${
                rarity === r.key ? "ring-2 ring-[var(--color-accent)]" : ""
              }`}
            >
              <input
                type="radio"
                name="rarity"
                value={r.key}
                checked={rarity === r.key}
                onChange={() => setRarity(r.key)}
                className="sr-only"
              />
              <div className="text-[12px] font-medium">{r.label}</div>
              <div className="text-[10px] text-[var(--color-fg-subtle)]">
                {r.odds} · {r.bonus}
              </div>
            </label>
          ))}
        </div>
      </div>

      <input type="hidden" name="weight" value="1" />

      {state.error && !state.fieldErrors && (
        <p className="rounded-[12px] border border-[var(--color-rose)] bg-[var(--color-rose-soft)] px-3 py-2 text-sm text-[var(--color-rose)]">
          {state.error}
        </p>
      )}
      {state.ok && (
        <p className="rounded-[12px] border border-[var(--color-mint)] bg-[var(--color-mint-soft)] px-3 py-2 text-sm text-[var(--color-mint)]">
          已加入牌庫
        </p>
      )}

      <button type="submit" className="btn-primary" disabled={pending}>
        {pending ? "建立中..." : "加入牌庫"}
      </button>
    </form>
  );
}
