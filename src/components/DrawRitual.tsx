"use client";

import { useEffect, useState } from "react";
import { drawCard } from "@/lib/actions";
import type { CardRarity, DrawCard } from "@/lib/types";

type Trigger = "daily_complete" | "weekly_target" | "streak_milestone";
type Phase = "back" | "charge" | "flip" | "revealed";

interface DrawRitualProps {
  open: boolean;
  trigger: Trigger;
  onClose: () => void;
  // Dev-only: force a specific rarity. Honored only when NODE_ENV === 'development'.
  forceRarity?: CardRarity;
}

const RARITY_STYLE: Record<
  CardRarity,
  {
    label: string;
    border: string;
    rayColor: string;
    flashColor: string;
    particleColor: string;
    titleGlow: string;
  }
> = {
  common: {
    label: "Common",
    border: "rgba(168, 163, 156, 0.5)",
    rayColor: "rgba(245, 241, 235, 0.55)",
    flashColor: "rgba(245, 241, 235, 0.35)",
    particleColor: "#f5f1eb",
    titleGlow: "0 0 12px rgba(245,241,235,0.4)",
  },
  rare: {
    label: "Rare",
    border: "rgba(94, 234, 212, 0.85)",
    rayColor: "rgba(94, 234, 212, 0.85)",
    flashColor: "rgba(94, 234, 212, 0.45)",
    particleColor: "#5eead4",
    titleGlow: "0 0 18px rgba(94,234,212,0.7)",
  },
  epic: {
    label: "Epic",
    border: "rgba(251, 191, 36, 0.95)",
    rayColor: "rgba(251, 191, 36, 0.95)",
    flashColor: "rgba(251, 191, 36, 0.6)",
    particleColor: "#fbbf24",
    titleGlow: "0 0 22px rgba(251,191,36,0.85)",
  },
  legendary: {
    label: "Legendary",
    border: "rgba(251, 113, 133, 1)",
    rayColor: "rgba(251, 113, 133, 1)",
    flashColor: "rgba(251, 113, 133, 0.75)",
    particleColor: "#fb7185",
    titleGlow: "0 0 28px rgba(251,113,133,1)",
  },
};

const TRIGGER_HEADLINE: Record<Trigger, string> = {
  daily_complete: "今日達成 · 抽一張",
  weekly_target: "本週達標 · 抽一張",
  streak_milestone: "七日不間斷 · 抽一張",
};

// Sigil: a hexagonal frame with a runic core. Pure SVG.
function Sigil() {
  return (
    <svg
      viewBox="0 0 200 200"
      className="sigil-svg"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hexLine" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#5eead4" stopOpacity="0.6" />
        </linearGradient>
      </defs>

      {/* Outer slow-rotating ring with runes */}
      <g className="sigil-ring-outer">
        <circle
          cx="100"
          cy="100"
          r="92"
          fill="none"
          stroke="url(#hexLine)"
          strokeWidth="0.5"
          strokeDasharray="2 6"
          opacity="0.65"
        />
        {/* Runic dots scattered on ring */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const x = 100 + 88 * Math.cos(angle);
          const y = 100 + 88 * Math.sin(angle);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={i % 4 === 0 ? 1.5 : 0.8}
              fill="#fbbf24"
              opacity={i % 4 === 0 ? 0.95 : 0.55}
            />
          );
        })}
      </g>

      {/* Inner counter-rotating hexagon */}
      <g className="sigil-ring-inner">
        <polygon
          points="100,30 161,65 161,135 100,170 39,135 39,65"
          fill="none"
          stroke="url(#hexLine)"
          strokeWidth="1.2"
          opacity="0.85"
        />
        <polygon
          points="100,55 138,77 138,123 100,145 62,123 62,77"
          fill="none"
          stroke="#fbbf24"
          strokeWidth="0.6"
          strokeDasharray="3 3"
          opacity="0.55"
        />
      </g>

      {/* Core glow + glyph */}
      <circle cx="100" cy="100" r="52" fill="url(#coreGlow)" />
      <g className="sigil-core">
        {/* Stylized "1" stroke as runic mark */}
        <path
          d="M 100 70 L 100 130 M 92 78 L 100 70 M 86 130 L 114 130"
          stroke="#1a1100"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Subtle dot for percent */}
        <circle cx="118" cy="124" r="3.5" fill="#1a1100" />
      </g>
    </svg>
  );
}

// Starfield rendered with positioned divs (avoids huge SVG)
function Starfield() {
  const stars = Array.from({ length: 36 }).map((_, i) => {
    const top = Math.floor((i * 137.5) % 100);
    const left = Math.floor((i * 91.3) % 100);
    const delay = (i % 7) * 0.4;
    const dur = 2.4 + (i % 5) * 0.6;
    const size = i % 9 === 0 ? 2 : i % 4 === 0 ? 1.2 : 0.6;
    return { top, left, delay, dur, size };
  });
  return (
    <div className="starfield" aria-hidden="true">
      {stars.map((s, i) => (
        <span
          key={i}
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.dur}s`,
          }}
        />
      ))}
    </div>
  );
}

// Light rays radiating from card center on reveal
function RayFan({ color }: { color: string }) {
  const rays = Array.from({ length: 14 }).map((_, i) => i);
  return (
    <div className="ray-fan" aria-hidden="true">
      {rays.map((i) => (
        <span
          key={i}
          className="ray"
          style={{
            transform: `rotate(${(i * 360) / rays.length}deg)`,
            background: `linear-gradient(to top, transparent, ${color} 50%, transparent)`,
          }}
        />
      ))}
    </div>
  );
}

// Particle burst on reveal
function ParticleBurst({ color }: { color: string }) {
  const particles = Array.from({ length: 22 });
  return (
    <div className="particle-burst" aria-hidden="true">
      {particles.map((_, i) => {
        const angle = (i * 360) / particles.length + (i % 2) * 9;
        const dist = 110 + ((i * 31) % 80);
        const dx = Math.cos((angle * Math.PI) / 180) * dist;
        const dy = Math.sin((angle * Math.PI) / 180) * dist;
        return (
          <span
            key={i}
            className="particle"
            style={
              {
                "--dx": `${dx}px`,
                "--dy": `${dy}px`,
                "--delay": `${(i % 5) * 30}ms`,
                background: color,
                boxShadow: `0 0 8px ${color}`,
              } as React.CSSProperties
            }
          />
        );
      })}
    </div>
  );
}

export function DrawRitual({
  open,
  trigger,
  onClose,
  forceRarity,
}: DrawRitualProps) {
  const [phase, setPhase] = useState<Phase>("back");
  const [card, setCard] = useState<DrawCard | null>(null);
  const [xpBonus, setXpBonus] = useState(0);

  useEffect(() => {
    if (open) {
      setPhase("back");
      setCard(null);
      setXpBonus(0);
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
    if (phase !== "back") return;

    // 1. Charge — card vibrates + glow intensifies (400ms)
    setPhase("charge");
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate?.([12, 60, 16]);
      } catch {
        /* ignore */
      }
    }

    // 2. Fetch in parallel with the charge animation
    const drawnPromise = drawCard(trigger, forceRarity);

    // 3. Start flip after 400ms charge
    await new Promise((r) => setTimeout(r, 400));
    setPhase("flip");

    // 4. Resolve fetch + flip animation (720ms)
    const result = await drawnPromise;
    await new Promise((r) => setTimeout(r, 720));
    setCard(result?.card ?? null);
    setXpBonus(result?.xpBonus ?? 0);
    setPhase("revealed");
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate?.(40);
      } catch {
        /* ignore */
      }
    }
  };

  const style = card ? RARITY_STYLE[card.rarity] : RARITY_STYLE.common;
  const charging = phase === "charge";
  const flipping = phase === "flip";
  const revealed = phase === "revealed";
  const flipped = flipping || revealed;

  return (
    <div
      className="ritual-overlay"
      role="dialog"
      aria-modal="true"
      onClick={() => revealed && onClose()}
    >
      <Starfield />

      {/* Full-screen flash on reveal */}
      {revealed && card && (
        <div
          className="reveal-flash"
          style={{ background: style.flashColor }}
          aria-hidden="true"
        />
      )}

      <div
        className="ritual-stack"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="ritual-headline">{TRIGGER_HEADLINE[trigger]}</p>

        <div className="card-stage">
          {/* Light rays — only on reveal */}
          {revealed && card && <RayFan color={style.rayColor} />}
          {revealed && card && <ParticleBurst color={style.particleColor} />}

          <div
            className={`flip-perspective ${charging ? "is-charging" : ""} ${
              revealed && card ? `is-revealed rarity-${card.rarity}` : ""
            }`}
          >
            <div
              className={`flip-card ${flipped ? "is-flipped" : ""}`}
              style={
                revealed && card
                  ? ({
                      "--rarity-border": style.border,
                    } as React.CSSProperties)
                  : undefined
              }
            >
              {/* BACK */}
              <button
                type="button"
                onClick={handlePull}
                disabled={phase !== "back"}
                aria-label="抽一張卡"
                className="flip-face flip-back"
              >
                <div className="back-aura" />
                <div className="back-content">
                  <div className="sigil-wrap">
                    <Sigil />
                  </div>
                  <p className="back-prompt">
                    {phase === "back" ? "點一下抽" : "蓄力中..."}
                  </p>
                </div>
              </button>

              {/* FRONT */}
              <div className="flip-face flip-front">
                {card ? (
                  <>
                    <div className="front-rarity-row">
                      <span className="front-rarity">{style.label}</span>
                      {xpBonus > 0 && (
                        <span
                          className="front-xp"
                          style={{
                            color: style.particleColor,
                            borderColor: style.border,
                            boxShadow: `0 0 12px ${style.flashColor}`,
                          }}
                        >
                          +{xpBonus} XP
                        </span>
                      )}
                    </div>
                    <h2
                      className="front-title"
                      style={{ textShadow: style.titleGlow }}
                    >
                      {card.title}
                    </h2>
                    <p className="front-copy">{card.copy}</p>
                    <div className="front-action">
                      <button
                        type="button"
                        onClick={onClose}
                        className="btn-primary w-full"
                      >
                        收下
                      </button>
                    </div>
                  </>
                ) : null}
              </div>
            </div>

            {/* Mid-flip burst */}
            {flipping && <div className="mid-burst" aria-hidden="true" />}
          </div>
        </div>

        {phase === "back" && (
          <p className="ritual-hint">點咗先翻牌——你抽嘅手勢，係儀式嘅一部分。</p>
        )}
      </div>

      <style>{`
        .ritual-overlay {
          position: fixed; inset: 0; z-index: 50;
          display: flex; align-items: center; justify-content: center;
          background: radial-gradient(ellipse at center,
            rgba(20, 18, 28, 0.92) 0%,
            rgba(0, 0, 0, 0.96) 60%);
          padding: 0 1.5rem;
          overflow: hidden;
        }
        .ritual-stack {
          position: relative; z-index: 2;
          display: flex; flex-direction: column; align-items: center;
          gap: 1.5rem;
        }
        .ritual-headline {
          font-size: 11px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: var(--color-fg-muted);
        }
        .ritual-hint {
          max-width: 260px;
          text-align: center;
          font-size: 12px;
          line-height: 1.55;
          color: var(--color-fg-subtle);
        }

        /* Starfield */
        .starfield {
          position: absolute; inset: 0;
          pointer-events: none;
        }
        .starfield > span {
          position: absolute;
          background: #f5f1eb;
          border-radius: 50%;
          opacity: 0;
          animation: twinkle 3s ease-in-out infinite;
          box-shadow: 0 0 4px rgba(245,241,235,0.6);
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0.6); }
          50%      { opacity: 0.85; transform: scale(1); }
        }

        /* Card stage */
        .card-stage {
          position: relative;
          display: flex; align-items: center; justify-content: center;
          width: 320px; height: 440px;
        }

        .flip-perspective {
          perspective: 1600px;
          width: 280px; height: 380px;
          position: relative;
          transition: transform 380ms cubic-bezier(.4,0,.2,1);
        }
        .flip-perspective.is-charging {
          animation: charge-shake 380ms ease-in-out;
        }
        @keyframes charge-shake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-3px) translateY(-1px); }
          30% { transform: translateX(3px) translateY(1px); }
          45% { transform: translateX(-4px); }
          60% { transform: translateX(4px); }
          75% { transform: translateX(-2px); }
        }

        .flip-card {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          transform-style: preserve-3d;
          transition: transform 720ms cubic-bezier(.34, 1.4, .64, 1);
          will-change: transform;
        }
        .flip-card.is-flipped {
          transform: rotateY(180deg);
        }

        .flip-face {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: 22px;
          overflow: hidden;
          display: flex; flex-direction: column;
        }

        /* Card back */
        .flip-back {
          background:
            radial-gradient(ellipse at 50% 35%,
              rgba(251,191,36,0.18) 0%,
              rgba(94,234,212,0.06) 35%,
              rgba(20,18,28,1) 70%),
            linear-gradient(180deg, #181520 0%, #0d0c14 100%);
          border: 1px solid rgba(251,191,36,0.35);
          box-shadow:
            0 0 0 1px rgba(251,191,36,0.12) inset,
            0 24px 60px rgba(251,191,36,0.18),
            0 0 80px rgba(251,191,36,0.12);
          cursor: pointer;
          padding: 0;
        }
        .flip-back:active { transform: scale(0.985); }
        .flip-back:disabled { cursor: default; }

        .back-aura {
          position: absolute; inset: -30%;
          background: conic-gradient(from 0deg,
            rgba(251,191,36,0.18),
            rgba(94,234,212,0.10),
            rgba(251,191,36,0.18),
            rgba(167,139,250,0.10),
            rgba(251,191,36,0.18));
          filter: blur(30px);
          animation: aura-spin 14s linear infinite;
        }
        @keyframes aura-spin {
          to { transform: rotate(360deg); }
        }

        .back-content {
          position: relative; z-index: 1;
          flex: 1;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 1.5rem;
          padding: 1.5rem;
        }
        .sigil-wrap {
          width: 200px; height: 200px;
          animation: sigil-breathe 3.4s ease-in-out infinite;
        }
        @keyframes sigil-breathe {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 12px rgba(251,191,36,0.4)); }
          50%      { transform: scale(1.04); filter: drop-shadow(0 0 28px rgba(251,191,36,0.75)); }
        }
        .sigil-svg { width: 100%; height: 100%; display: block; }
        .sigil-ring-outer { transform-origin: 100px 100px; animation: ring-spin 22s linear infinite; }
        .sigil-ring-inner { transform-origin: 100px 100px; animation: ring-spin 16s linear infinite reverse; }
        .sigil-core { transform-origin: 100px 100px; animation: core-pulse 2.6s ease-in-out infinite; }
        @keyframes ring-spin { to { transform: rotate(360deg); } }
        @keyframes core-pulse {
          0%, 100% { opacity: 0.85; transform: scale(1); }
          50%      { opacity: 1;   transform: scale(1.06); }
        }

        .back-prompt {
          font-size: 11px;
          letter-spacing: 0.36em;
          color: rgba(251,191,36,0.85);
          text-transform: uppercase;
        }

        /* Card front */
        .flip-front {
          transform: rotateY(180deg);
          background: linear-gradient(160deg,
            #1a1822 0%,
            #0e0d14 100%);
          border: 1.5px solid var(--rarity-border, rgba(251,191,36,0.6));
          box-shadow:
            0 0 0 1px var(--rarity-border, rgba(251,191,36,0.6)) inset,
            0 24px 60px rgba(0,0,0,0.6),
            0 0 50px var(--rarity-border, rgba(251,191,36,0.3));
          padding: 24px 22px;
          gap: 0.75rem;
        }
        .front-rarity-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          margin-bottom: 6px;
        }
        .front-rarity {
          font-size: 10px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: var(--color-fg-muted);
        }
        .front-xp {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.05em;
          padding: 4px 10px;
          border-radius: 999px;
          border: 1px solid;
          background: rgba(0,0,0,0.4);
          animation: xp-pop 480ms 360ms cubic-bezier(.2,1.4,.4,1) backwards;
        }
        @keyframes xp-pop {
          from { opacity: 0; transform: scale(0.4) translateY(4px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .front-title {
          font-size: 26px;
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: -0.01em;
          animation: title-rise 480ms 200ms cubic-bezier(.2,.8,.2,1) backwards;
        }
        .front-copy {
          font-size: 14px;
          line-height: 1.6;
          color: var(--color-fg-muted);
          margin-top: 12px;
          animation: title-rise 480ms 380ms cubic-bezier(.2,.8,.2,1) backwards;
        }
        .front-action {
          margin-top: auto;
          animation: title-rise 480ms 540ms cubic-bezier(.2,.8,.2,1) backwards;
        }
        @keyframes title-rise {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Mid-flip burst (visible only during the rotation) */
        .mid-burst {
          position: absolute; inset: -10%;
          border-radius: 50%;
          background: radial-gradient(circle,
            rgba(251,191,36,0.55) 0%,
            rgba(251,191,36,0) 60%);
          pointer-events: none;
          animation: mid-burst-pulse 720ms ease-out forwards;
          mix-blend-mode: screen;
        }
        @keyframes mid-burst-pulse {
          0%   { opacity: 0;   transform: scale(0.6); }
          50%  { opacity: 0.95; transform: scale(1.4); }
          100% { opacity: 0;   transform: scale(2.2); }
        }

        /* Reveal full-screen flash */
        .reveal-flash {
          position: absolute; inset: 0;
          z-index: 1;
          pointer-events: none;
          animation: reveal-flash 800ms ease-out forwards;
          mix-blend-mode: screen;
        }
        @keyframes reveal-flash {
          0%   { opacity: 0.9; }
          25%  { opacity: 0.7; }
          100% { opacity: 0;   }
        }

        /* Light rays */
        .ray-fan {
          position: absolute;
          inset: 50% 50% auto auto;
          width: 0; height: 0;
          z-index: 0;
          pointer-events: none;
          animation: ray-fan-spin 18s linear infinite, ray-fan-fade 1200ms ease-out backwards;
        }
        .ray-fan .ray {
          position: absolute;
          left: -1.5px; top: -260px;
          width: 3px; height: 260px;
          transform-origin: bottom center;
          opacity: 0.85;
          filter: blur(0.5px);
        }
        @keyframes ray-fan-spin { to { transform: rotate(360deg); } }
        @keyframes ray-fan-fade {
          from { opacity: 0; transform: scale(0.5); }
          to   { opacity: 1; transform: scale(1); }
        }

        /* Particle burst */
        .particle-burst {
          position: absolute;
          inset: 50% 50% auto auto;
          width: 0; height: 0;
          z-index: 1;
          pointer-events: none;
        }
        .particle {
          position: absolute;
          left: -3px; top: -3px;
          width: 6px; height: 6px;
          border-radius: 50%;
          opacity: 0;
          animation: particle-fly 1100ms cubic-bezier(.2,.65,.35,1) var(--delay, 0ms) forwards;
        }
        @keyframes particle-fly {
          0%   { opacity: 0;    transform: translate(0, 0) scale(0.4); }
          15%  { opacity: 1;    }
          100% { opacity: 0;    transform: translate(var(--dx, 0), var(--dy, 0)) scale(0.2); }
        }

        @media (prefers-reduced-motion: reduce) {
          .flip-card,
          .flip-perspective,
          .sigil-wrap,
          .sigil-ring-outer,
          .sigil-ring-inner,
          .sigil-core,
          .back-aura,
          .starfield > span,
          .ray-fan,
          .particle,
          .mid-burst,
          .reveal-flash {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}
