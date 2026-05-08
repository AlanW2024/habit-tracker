"use client";

import { useTransition } from "react";
import { setAccent } from "@/theme/setAccent";
import type { Accent } from "@/theme";
import { useDict } from "@/i18n/Provider";

interface AccentToggleProps {
  current: Accent;
}

const SWATCHES: ReadonlyArray<{ key: Accent; light: string; dark: string }> = [
  { key: "tangerine", light: "#FF6B3D", dark: "#FF7E55" },
  { key: "grape", light: "#7C3AED", dark: "#9B6BFF" },
  { key: "lime", light: "#5C9F22", dark: "#84CC16" },
  { key: "cobalt", light: "#2D6FF0", dark: "#5C8DF5" },
] as const;

export function AccentToggle({ current }: AccentToggleProps) {
  const dict = useDict();
  const [pending, startTransition] = useTransition();

  const labelFor = (k: Accent): string => {
    if (k === "tangerine") return dict.settings.accent_tangerine;
    if (k === "grape") return dict.settings.accent_grape;
    if (k === "lime") return dict.settings.accent_lime;
    return dict.settings.accent_cobalt;
  };

  return (
    <div
      role="radiogroup"
      aria-label={dict.settings.accent}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 8,
      }}
    >
      {SWATCHES.map((s) => {
        const active = s.key === current;
        return (
          <button
            key={s.key}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={labelFor(s.key)}
            disabled={pending || active}
            onClick={() =>
              startTransition(async () => {
                await setAccent(s.key);
              })
            }
            style={{
              padding: 6,
              border: `2px solid ${active ? "var(--color-text)" : "var(--color-border)"}`,
              borderRadius: 16,
              background: "var(--color-surface)",
              cursor: active || pending ? "default" : "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span
              style={{
                display: "block",
                width: 32,
                height: 32,
                borderRadius: 999,
                background: `linear-gradient(140deg, ${s.light} 0%, ${s.dark} 100%)`,
                boxShadow: "inset 0 -3px 0 rgba(0,0,0,0.18)",
              }}
            />
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: active ? "var(--color-text)" : "var(--color-muted)",
              }}
            >
              {labelFor(s.key)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
