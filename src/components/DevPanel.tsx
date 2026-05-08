"use client";

import { useState } from "react";
import { DrawRitual } from "./DrawRitual";
import type { CardRarity } from "@/lib/types";

const RARITIES: Array<{ key: CardRarity; label: string; color: string }> = [
  { key: "common", label: "C", color: "#a8a39c" },
  { key: "rare", label: "R", color: "#5eead4" },
  { key: "epic", label: "E", color: "#fbbf24" },
  { key: "legendary", label: "L", color: "#fb7185" },
];

export function DevPanel() {
  // Hidden in production builds — Next.js inlines NODE_ENV at compile time.
  if (process.env.NODE_ENV !== "development") return null;

  const [open, setOpen] = useState(false);
  const [forced, setForced] = useState<CardRarity | null>(null);

  const trigger = (rarity: CardRarity) => {
    setForced(rarity);
    setOpen(true);
  };

  return (
    <>
      <div className="dev-panel" aria-label="Dev tools">
        <span className="dev-tag">DEV · 強制抽</span>
        <div className="dev-buttons">
          {RARITIES.map((r) => (
            <button
              key={r.key}
              type="button"
              onClick={() => trigger(r.key)}
              className="dev-btn"
              style={
                {
                  "--c": r.color,
                } as React.CSSProperties
              }
              title={`Force pull: ${r.key}`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {forced && (
        <DrawRitual
          open={open}
          trigger="daily_complete"
          forceRarity={forced}
          onClose={() => {
            setOpen(false);
            setForced(null);
          }}
        />
      )}

      <style>{`
        .dev-panel {
          position: fixed;
          bottom: calc(env(safe-area-inset-bottom, 0) + 88px);
          right: 12px;
          z-index: 30;
          display: flex; flex-direction: column; align-items: flex-end;
          gap: 6px;
          padding: 8px 10px;
          border-radius: 12px;
          background: rgba(15, 14, 22, 0.85);
          border: 1px solid var(--color-border);
          backdrop-filter: blur(10px);
        }
        .dev-tag {
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--color-fg-subtle);
        }
        .dev-buttons {
          display: flex; gap: 4px;
        }
        .dev-btn {
          width: 30px; height: 30px;
          border-radius: 8px;
          border: 1px solid var(--c, var(--color-border-strong));
          color: var(--c, var(--color-fg));
          background: rgba(0,0,0,0.4);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: transform 80ms ease, background 120ms ease;
        }
        .dev-btn:hover {
          background: color-mix(in oklab, var(--c) 18%, transparent);
        }
        .dev-btn:active { transform: scale(0.92); }
      `}</style>
    </>
  );
}
