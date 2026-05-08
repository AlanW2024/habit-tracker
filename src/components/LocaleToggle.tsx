"use client";

import { useTransition } from "react";
import { setLocale } from "@/i18n/setLocale";
import type { Locale } from "@/i18n";
import { useDict, useLocale } from "@/i18n/Provider";

const OPTIONS: ReadonlyArray<{ key: Locale }> = [
  { key: "zh-TW" },
  { key: "en" },
] as const;

export function LocaleToggle() {
  const dict = useDict();
  const current = useLocale();
  const [pending, startTransition] = useTransition();

  return (
    <div
      role="radiogroup"
      aria-label={dict.settings.language}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 6,
        background: "var(--color-surface-alt)",
        padding: 4,
        borderRadius: 999,
      }}
    >
      {OPTIONS.map((opt) => {
        const active = opt.key === current;
        const label =
          opt.key === "zh-TW" ? dict.settings.language_zh : dict.settings.language_en;
        return (
          <button
            key={opt.key}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={pending || active}
            onClick={() =>
              startTransition(async () => {
                await setLocale(opt.key);
              })
            }
            style={{
              padding: "8px 10px",
              borderRadius: 999,
              border: "none",
              cursor: active || pending ? "default" : "pointer",
              background: active ? "var(--color-surface)" : "transparent",
              color: active ? "var(--color-text)" : "var(--color-muted)",
              fontFamily: "var(--font-body), Nunito, system-ui, sans-serif",
              fontSize: 13,
              fontWeight: 800,
              boxShadow: active ? "var(--shadow-pop-light)" : undefined,
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
