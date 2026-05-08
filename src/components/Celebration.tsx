"use client";

import { useEffect, useMemo, useState } from "react";
import { Disco } from "./Disco";
import { useDict } from "@/i18n/Provider";
import { format } from "@/i18n/format";

interface CelebrationProps {
  /** Habit display info — name + new streak count after the completion. */
  habit: { id: string; name: string; streak: number } | null;
  /** Called once the 1.8s sequence finishes. */
  onDone: () => void;
}

type Phase = "in" | "hold" | "out";

interface Piece {
  id: number;
  x: number;
  y: number;
  rot: number;
  color: string;
  shape: "rect" | "circle";
  size: number;
  delay: number;
}

const PALETTE = [
  "#FF6B3D",
  "#7C3AED",
  "#5C9F22",
  "#FACC15",
  "#2D6FF0",
  "#C73B4A",
  "#FFFCF5",
];

export function Celebration({ habit, onDone }: CelebrationProps) {
  const dict = useDict();
  const [phase, setPhase] = useState<Phase>("in");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 50);
    const t2 = setTimeout(() => setPhase("out"), 1400);
    const t3 = setTimeout(() => onDone(), 1800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onDone]);

  const pieces: Piece[] = useMemo(() => {
    let s = (habit?.id || "x").charCodeAt(1) || 7;
    const rand = () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
    return Array.from({ length: 28 }, (_, i) => {
      const r1 = rand();
      const r2 = rand();
      const r3 = rand();
      const r4 = rand();
      const r5 = rand();
      const r6 = rand();
      return {
        id: i,
        x: (r1 - 0.5) * 280,
        y: -r2 * 220 - 30,
        rot: (r3 - 0.5) * 720,
        color: PALETTE[Math.floor(r4 * PALETTE.length)],
        shape: r5 > 0.5 ? "rect" : "circle",
        size: 6 + r6 * 8,
        delay: rand() * 80,
      };
    });
  }, [habit?.id]);

  const opacity = phase === "out" ? 0 : 1;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        pointerEvents: "none",
        background:
          phase === "in" ? "rgba(0,0,0,0)" : "rgba(0,0,0,0.18)",
        transition: "background 250ms ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      aria-live="polite"
    >
      <div
        style={{
          background: "var(--color-surface)",
          borderRadius: 28,
          padding: "24px 28px 22px",
          boxShadow: "0 20px 50px rgba(26,20,16,0.18)",
          textAlign: "center",
          minWidth: 220,
          transform:
            phase === "in"
              ? "scale(0.6) translateY(20px)"
              : phase === "out"
              ? "scale(0.9)"
              : "scale(1)",
          opacity,
          transition:
            "transform 360ms cubic-bezier(.2,.9,.3,1.4), opacity 260ms ease",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 8,
          }}
        >
          <Disco size={84} mood="cheer" color="var(--color-primary)" accent="#FFFCF5" />
        </div>
        <div
          style={{
            fontFamily:
              "var(--font-display), Space Grotesk, system-ui, sans-serif",
            fontSize: 22,
            fontWeight: 700,
            color: "var(--color-text)",
            letterSpacing: -0.5,
          }}
        >
          {dict.celebration.title}
        </div>
        <div
          style={{
            fontFamily: "var(--font-body), Nunito, system-ui, sans-serif",
            fontSize: 13,
            fontWeight: 700,
            color: "var(--color-muted)",
            marginTop: 4,
          }}
        >
          {habit
            ? format(dict.celebration.streak_template, {
                habit: habit.name,
                days: habit.streak,
              })
            : ""}
        </div>
      </div>

      {pieces.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: p.size,
            height: p.size * (p.shape === "rect" ? 1.6 : 1),
            background: p.color,
            borderRadius: p.shape === "circle" ? 99 : 2,
            transform:
              phase === "in"
                ? `translate(-50%, -50%) rotate(0deg)`
                : `translate(calc(-50% + ${p.x}px), calc(-50% + ${
                    p.y + (phase === "out" ? 320 : 0)
                  }px)) rotate(${p.rot}deg)`,
            opacity: phase === "out" ? 0 : 1,
            transition: `transform 1100ms cubic-bezier(.2,.6,.3,1) ${p.delay}ms, opacity 400ms ease ${
              phase === "out" ? 0 : 700
            }ms`,
          }}
        />
      ))}
    </div>
  );
}
