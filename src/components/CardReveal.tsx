"use client";

import { useEffect } from "react";
import type { CardRarity, DrawCard } from "@/lib/types";

interface CardRevealProps {
  card: DrawCard | null;
  onClose: () => void;
}

const RARITY_STYLE: Record<CardRarity, { label: string; ring: string; glow: string }> = {
  common: { label: "Common", ring: "ring-[var(--color-border-strong)]", glow: "from-[#3a3a42]/30" },
  rare: { label: "Rare", ring: "ring-[var(--color-mint)]", glow: "from-[var(--color-mint-soft)]" },
  epic: { label: "Epic", ring: "ring-[var(--color-accent)]", glow: "from-[var(--color-accent-soft)]" },
  legendary: { label: "Legendary", ring: "ring-[#fb7185]", glow: "from-[var(--color-rose-soft)]" },
};

export function CardReveal({ card, onClose }: CardRevealProps) {
  useEffect(() => {
    if (!card) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [card, onClose]);

  if (!card) return null;
  const style = RARITY_STYLE[card.rarity];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`surface-card relative w-full max-w-sm overflow-hidden p-6 ring-2 ${style.ring}`}
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "cardIn 320ms ease-out" }}
      >
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${style.glow} to-transparent`}
          aria-hidden="true"
        />
        <p className="relative text-xs uppercase tracking-[0.18em] text-[var(--color-fg-muted)]">
          {style.label}
        </p>
        <h2 className="relative mt-2 text-2xl font-semibold leading-tight">
          {card.title}
        </h2>
        <p className="relative mt-4 text-[15px] leading-relaxed text-[var(--color-fg-muted)]">
          {card.copy}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="btn-primary relative mt-6 w-full"
        >
          收下
        </button>
      </div>
      <style>{`
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(12px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
