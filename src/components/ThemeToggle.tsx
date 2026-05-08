"use client";

import { useTransition } from "react";
import { setTheme } from "@/theme/setTheme";
import type { Theme } from "@/theme";
import { useDict } from "@/i18n/Provider";

interface ThemeToggleProps {
  current: Theme;
}

const OPTIONS: ReadonlyArray<{ key: Theme }> = [
  { key: "system" },
  { key: "light" },
  { key: "dark" },
] as const;

export function ThemeToggle({ current }: ThemeToggleProps) {
  const dict = useDict();
  const [pending, startTransition] = useTransition();

  return (
    <div
      role="radiogroup"
      aria-label={dict.settings.theme}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: 6,
        background: "var(--color-surface-alt)",
        padding: 4,
        borderRadius: 999,
      }}
    >
      {OPTIONS.map((opt) => {
        const active = opt.key === current;
        const label =
          opt.key === "system"
            ? dict.settings.theme_system
            : opt.key === "light"
            ? dict.settings.theme_light
            : dict.settings.theme_dark;
        return (
          <button
            key={opt.key}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={pending || active}
            onClick={() =>
              startTransition(async () => {
                await setTheme(opt.key);
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
