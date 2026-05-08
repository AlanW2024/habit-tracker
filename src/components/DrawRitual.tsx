"use client";

import { useEffect, useState } from "react";
import { drawCard } from "@/lib/actions";
import type { CardRarity, DrawCard } from "@/lib/types";

type Trigger = "daily_complete" | "weekly_target" | "streak_milestone";

interface DrawRitualProps {
  open: boolean;
  trigger: Trigger;
  onClose: () => void;
}

const RARITY_STYLE: Record<
  CardRarity,
  { label: string; ring: string; glow: string; flash: string }
> = {
  common: {
    label: "Common",
    ring: "ring-[var(--color-border-strong)]",
    glow: "from-[#3a3a42]/40",
    flash: "rgba(245,241,235,0.18)",
  },
  rare: {
    label: "Rare",
    ring: "ring-[var(--color-mint)]",
    glow: "from-[var(--color-mint-soft)]",
    flash: "rgba(94,234,212,0.45)",
  },
  epic: {
    label: "Epic",
    ring: "ring-[var(--color-accent)]",
    glow: "from-[var(--color-accent-soft)]",
    flash: "rgba(251,191,36,0.55)",
  },
  legendary: {
    label: "Legendary",
    ring: "ring-[#fb7185]",
    glow: "from-[var(--color-rose-soft)]",
    flash: "rgba(251,113,133,0.65)",
  },
};

const TRIGGER_HEADLINE: Record<Trigger, string> = {
  daily_complete: "今日達成 · 抽一張",
  weekly_target: "本週達標 · 抽一張",
  streak_milestone: "七日不間斷 · 抽一張",
};

export function DrawRitual({ open, trigger, onClose }: DrawRitualProps) {
  const [phase, setPhase] = useState<"back" | "pulling" | "revealed">("back");
  const [card, setCard] = useState<DrawCard | null>(null);
  const [pending, setPending] = useState(false);

  // Reset on close + reopen
  useEffect(() => {
    if (open) {
      setPhase("back");
      setCard(null);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && phase === "revealed") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, phase, onClose]);

  if (!open) return null;

  const handlePull = async () => {
    if (pending || phase !== "back") return;
    setPending(true);
    setPhase("pulling");
    // Fetch the card during the flip motion so the reveal lands at ~600ms
    const drawn = await drawCard(trigger);
    setCard(drawn);
    setPending(false);
    // Settle into revealed after flip completes
    setTimeout(() => setPhase("revealed"), 50);
  };

  const flipped = phase !== "back";
  const style = card ? RARITY_STYLE[card.rarity] : RARITY_STYLE.common;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={() => phase === "revealed" && onClose()}
    >
      <div
        className="flex flex-col items-center gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-fg-muted)]">
          {TRIGGER_HEADLINE[trigger]}
        </p>

        <div className="flip-perspective">
          <div
            className={`flip-card ${flipped ? "is-flipped" : ""}`}
            style={
              phase === "revealed" && card
                ? ({ "--flash": style.flash } as React.CSSProperties)
                : undefined
            }
          >
            {/* Card back */}
            <button
              type="button"
              onClick={handlePull}
              disabled={pending || phase !== "back"}
              aria-label="抽一張卡"
              className="flip-face flip-back surface-card relative overflow-hidden"
            >
              <div className="card-glow" aria-hidden="true" />
              <div className="card-pulse" aria-hidden="true" />
              <div className="relative flex flex-col items-center gap-3 px-8 py-12">
                <span className="card-mark">1%</span>
                <span className="text-xs tracking-[0.32em] text-[var(--color-fg-muted)]">
                  {phase === "back" ? "點一下抽" : "翻牌中"}
                </span>
              </div>
            </button>

            {/* Card front (revealed) */}
            <div
              className={`flip-face flip-front surface-card relative overflow-hidden ring-2 ${style.ring}`}
            >
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${style.glow} to-transparent`}
                aria-hidden="true"
              />
              {card ? (
                <div className="relative flex h-full flex-col px-6 py-6">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--color-fg-muted)]">
                    {style.label}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold leading-tight">
                    {card.title}
                  </h2>
                  <p className="mt-3 text-[14px] leading-relaxed text-[var(--color-fg-muted)]">
                    {card.copy}
                  </p>
                  <div className="mt-auto pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="btn-primary w-full"
                    >
                      收下
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative flex h-full items-center justify-center text-sm text-[var(--color-fg-muted)]">
                  ...
                </div>
              )}
            </div>
          </div>
        </div>

        {phase === "back" && (
          <p className="max-w-[260px] text-center text-[12px] leading-relaxed text-[var(--color-fg-subtle)]">
            點咗先翻牌——你抽嘅手勢，係儀式嘅一部分。
          </p>
        )}
      </div>

      <style>{`
        .flip-perspective {
          perspective: 1400px;
        }
        .flip-card {
          width: 280px;
          height: 380px;
          transform-style: preserve-3d;
          transition: transform 720ms cubic-bezier(.34, 1.4, .64, 1),
                      box-shadow 720ms ease-out;
          will-change: transform;
        }
        .flip-card.is-flipped {
          transform: rotateY(180deg);
          box-shadow: 0 0 80px var(--flash, rgba(251,191,36,0.4));
        }
        .flip-face {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .flip-back {
          background:
            radial-gradient(ellipse at center,
              rgba(251,191,36,0.10) 0%,
              rgba(251,191,36,0) 60%),
            var(--color-bg-card);
          border: 1px solid var(--color-border-strong);
          cursor: pointer;
          transition: transform 120ms ease;
        }
        .flip-back:active {
          transform: scale(0.97);
        }
        .flip-back:disabled {
          cursor: default;
        }
        .flip-front {
          transform: rotateY(180deg);
        }
        .card-mark {
          font-size: 88px;
          font-weight: 700;
          letter-spacing: -0.05em;
          line-height: 1;
          background: linear-gradient(180deg, #fbbf24 0%, #f59e0b 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          filter: drop-shadow(0 4px 24px rgba(251,191,36,0.3));
        }
        .card-glow {
          position: absolute;
          inset: -50%;
          background: radial-gradient(closest-side,
            rgba(251,191,36,0.25),
            transparent);
          animation: glow-rotate 6s linear infinite;
        }
        .card-pulse {
          position: absolute;
          inset: 12px;
          border-radius: 14px;
          border: 1px solid rgba(251,191,36,0.35);
          animation: card-pulse 2.4s ease-in-out infinite;
        }
        @keyframes glow-rotate {
          to { transform: rotate(360deg); }
        }
        @keyframes card-pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50%      { opacity: 0.9; transform: scale(1.015); }
        }
        @media (prefers-reduced-motion: reduce) {
          .flip-card,
          .card-glow,
          .card-pulse {
            transition: none;
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
