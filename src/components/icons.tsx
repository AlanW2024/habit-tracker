// Habit category icons + flame + confetti — simple geometric SVG primitives.

import type { SVGAttributes } from "react";

export type HabitIconKind =
  | "water"
  | "run"
  | "read"
  | "meditate"
  | "sleep"
  | "code"
  | "gym"
  | "study"
  | "water-plant"
  | "journal"
  | "plus"
  | "default";

interface HabitIconProps {
  kind: HabitIconKind | string;
  size?: number;
  color?: string;
}

export function HabitIcon({
  kind,
  size = 28,
  color = "#fff",
}: HabitIconProps) {
  const stroke: SVGAttributes<SVGElement> = {
    stroke: color,
    strokeWidth: 2.4,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    fill: "none",
  };
  const s = size;
  switch (kind) {
    case "water":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 3 C 7 10, 5 14, 5 16 a 7 7 0 0 0 14 0 C 19 14, 17 10, 12 3 z"
            {...stroke}
          />
        </svg>
      );
    case "run":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="14" cy="5" r="2.2" {...stroke} />
          <path d="M7 22 l3-7 4 2 3-5 3 4" {...stroke} />
        </svg>
      );
    case "read":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="5" width="8" height="14" rx="1" {...stroke} />
          <rect x="13" y="5" width="8" height="14" rx="1" {...stroke} />
        </svg>
      );
    case "meditate":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="8" {...stroke} />
          <circle cx="12" cy="9" r="2" {...stroke} />
          <path d="M5 18 c 3 -3, 11 -3, 14 0" {...stroke} />
        </svg>
      );
    case "sleep":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M20 14 a 8 8 0 1 1 -10 -10 a 6 6 0 0 0 10 10 z"
            {...stroke}
          />
        </svg>
      );
    case "code":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 6 L3 12 L8 18 M16 6 L21 12 L16 18" {...stroke} />
        </svg>
      );
    case "gym":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true">
          <rect x="2" y="9" width="3" height="6" rx="1" {...stroke} />
          <rect x="19" y="9" width="3" height="6" rx="1" {...stroke} />
          <rect x="6" y="10.5" width="12" height="3" rx="1" {...stroke} />
        </svg>
      );
    case "study":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true">
          <rect
            x="14"
            y="3"
            width="6"
            height="14"
            transform="rotate(45 17 10)"
            {...stroke}
          />
          <path d="M5 21 l4 -1 1 -4" {...stroke} />
        </svg>
      );
    case "water-plant":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M5 19 c 6 -2, 12 -8, 14 -16 c -8 2, -14 8, -16 14 z"
            {...stroke}
          />
          <path d="M5 19 l 8 -8" {...stroke} />
        </svg>
      );
    case "journal":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true">
          <rect x="5" y="3" width="14" height="18" rx="2" {...stroke} />
          <path d="M9 9 h 6 M9 13 h 6 M9 17 h 4" {...stroke} />
        </svg>
      );
    case "plus":
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 5 v 14 M5 12 h 14" {...stroke} />
        </svg>
      );
    default:
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="8" {...stroke} />
        </svg>
      );
  }
}

interface FlameIconProps {
  size?: number;
  color?: string;
}

export function FlameIcon({
  size = 24,
  color = "var(--color-flame)",
}: FlameIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2 c 1 4 6 6 6 11 a 6 6 0 1 1 -12 0 c 0 -3 2 -4 3 -7 c 1 2 2 3 3 -4z"
        fill={color}
      />
      <path
        d="M12 10 c 0.5 2 3 3 3 5.5 a 3 3 0 1 1 -6 0 c 0 -1.5 1 -2 1.5 -3.5 c 0.5 1 1 1.5 1.5 -2z"
        fill="#FFD89E"
      />
    </svg>
  );
}

interface ConfettiBurstProps {
  size?: number;
}

// Static decorative confetti — always 6 pieces in fixed positions.
export function ConfettiBurst({ size = 60 }: ConfettiBurstProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" aria-hidden="true">
      <circle cx="10" cy="20" r="2.5" fill="#FF6B3D" />
      <rect
        x="46"
        y="14"
        width="5"
        height="5"
        fill="#7C3AED"
        transform="rotate(20 48 16)"
      />
      <circle cx="50" cy="42" r="2" fill="#84CC16" />
      <rect
        x="6"
        y="44"
        width="4"
        height="4"
        fill="#FACC15"
        transform="rotate(45 8 46)"
      />
      <circle cx="30" cy="6" r="2" fill="#2D6FF0" />
      <rect
        x="28"
        y="50"
        width="4"
        height="4"
        fill="#FF6B3D"
        transform="rotate(30 30 52)"
      />
    </svg>
  );
}
