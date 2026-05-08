"use client";

import { useActionState, useState } from "react";
import { createRewardCard, type RewardCardFormState } from "@/lib/actions";
import { ChunkyButton } from "@/components/ui/ChunkyButton";
import { useDict } from "@/i18n/Provider";
import type { Dict } from "@/i18n";
import type { CardRarity } from "@/lib/types";

interface RarityChoice {
  key: CardRarity;
  bonus: string;
  odds: string;
}

const RARITIES: readonly RarityChoice[] = [
  { key: "rare", bonus: "+5 XP", odds: "22%" },
  { key: "epic", bonus: "+20 XP", odds: "7%" },
  { key: "legendary", bonus: "+50 XP", odds: "1%" },
] as const;

interface Preset {
  titleKey: keyof Dict["rewards"];
  rarity: CardRarity;
}

const PRESETS: readonly Preset[] = [
  { titleKey: "preset_game", rarity: "rare" },
  { titleKey: "preset_netflix", rarity: "rare" },
  { titleKey: "preset_icecream", rarity: "rare" },
  { titleKey: "preset_meal", rarity: "epic" },
  { titleKey: "preset_book", rarity: "epic" },
  { titleKey: "preset_trip", rarity: "legendary" },
] as const;

export function RewardForm() {
  const dict = useDict();
  const [state, action, pending] = useActionState<RewardCardFormState, FormData>(
    createRewardCard,
    { ok: false },
  );
  const [rarity, setRarity] = useState<CardRarity>("rare");

  const fillPreset = (p: Preset) => {
    const titleEl = document.querySelector(
      'input[name="title"]',
    ) as HTMLInputElement | null;
    if (titleEl) titleEl.value = dict.rewards[p.titleKey];
    setRarity(p.rarity);
  };

  return (
    <form action={action} className="flex flex-col gap-4" key={state.ok ? "ok" : "form"}>
      <div>
        <p
          style={{
            marginBottom: 8,
            fontSize: 11,
            fontWeight: 700,
            color: "var(--color-muted)",
          }}
        >
          {dict.rewards.form_quick_examples}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {PRESETS.map((p) => (
            <button
              key={p.titleKey}
              type="button"
              onClick={() => fillPreset(p)}
              style={{
                background: "var(--color-primary-soft)",
                color: "var(--color-primary)",
                border: "none",
                borderRadius: 999,
                padding: "6px 12px",
                fontSize: 12,
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              {dict.rewards[p.titleKey]}
            </button>
          ))}
        </div>
      </div>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">
          {dict.rewards.form_name_label}
        </span>
        <input
          name="title"
          required
          maxLength={40}
          placeholder={dict.rewards.form_name_placeholder}
          className="input-field"
        />
        {state.fieldErrors?.title && (
          <p style={{ marginTop: 4, fontSize: 12, color: "var(--color-danger)" }}>
            {state.fieldErrors.title}
          </p>
        )}
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">
          {dict.rewards.form_copy_label}{" "}
          <span style={{ color: "var(--color-muted)", fontWeight: 400 }}>
            {dict.rewards.form_copy_optional}
          </span>
        </span>
        <input
          name="copy"
          maxLength={160}
          placeholder={dict.rewards.form_copy_placeholder}
          className="input-field"
        />
      </label>

      <div>
        <span className="mb-2 block text-sm font-medium">
          {dict.rewards.form_rarity_label}
        </span>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {RARITIES.map((r) => {
            const active = rarity === r.key;
            return (
              <label
                key={r.key}
                style={{
                  background: active
                    ? "var(--color-primary-soft)"
                    : "var(--color-surface)",
                  color: active ? "var(--color-primary)" : "var(--color-text)",
                  border: `1.5px solid ${active ? "var(--color-primary)" : "var(--color-border)"}`,
                  borderRadius: 16,
                  padding: "10px 8px",
                  cursor: "pointer",
                  textAlign: "center",
                }}
              >
                <input
                  type="radio"
                  name="rarity"
                  value={r.key}
                  checked={active}
                  onChange={() => setRarity(r.key)}
                  className="sr-only"
                />
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                  }}
                >
                  {dict.rarities[r.key]}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "var(--color-muted)",
                    marginTop: 2,
                  }}
                >
                  {r.odds} · {r.bonus}
                </div>
              </label>
            );
          })}
        </div>
      </div>

      <input type="hidden" name="weight" value="1" />

      {state.error && !state.fieldErrors && (
        <p
          style={{
            borderRadius: 12,
            border: "1.5px solid var(--color-danger)",
            background:
              "color-mix(in srgb, var(--color-danger) 12%, transparent)",
            padding: "10px 12px",
            fontSize: 14,
            color: "var(--color-danger)",
          }}
        >
          {state.error}
        </p>
      )}
      {state.ok && (
        <p
          style={{
            borderRadius: 12,
            border: "1.5px solid var(--color-success)",
            background:
              "color-mix(in srgb, var(--color-success) 12%, transparent)",
            padding: "10px 12px",
            fontSize: 14,
            color: "var(--color-success)",
          }}
        >
          {dict.rewards.form_success}
        </p>
      )}

      <ChunkyButton type="submit" full disabled={pending}>
        {pending ? dict.rewards.form_submitting : dict.rewards.form_submit}
      </ChunkyButton>
    </form>
  );
}
