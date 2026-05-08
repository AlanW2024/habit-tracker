import type { ReactNode } from "react";

interface ProgressRingProps {
  size?: number;
  stroke?: number;
  /** 0 to 1. */
  value?: number;
  color?: string;
  track?: string;
  label?: ReactNode;
  sublabel?: ReactNode;
  textColor?: string;
}

export function ProgressRing({
  size = 120,
  stroke = 10,
  value = 0.6,
  color = "var(--color-primary)",
  track = "var(--color-primary-soft)",
  label,
  sublabel,
  textColor = "var(--color-text)",
}: ProgressRingProps) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - Math.max(0, Math.min(1, value)));
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg
        width={size}
        height={size}
        style={{ transform: "rotate(-90deg)" }}
        aria-hidden="true"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={track}
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 600ms cubic-bezier(.2,.8,.2,1)",
          }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-display), Space Grotesk, system-ui, sans-serif",
            fontSize: size * 0.28,
            fontWeight: 700,
            color: textColor,
            letterSpacing: -1,
            lineHeight: 1,
          }}
        >
          {label}
        </div>
        {sublabel && (
          <div
            style={{
              fontFamily: "var(--font-body), Nunito, system-ui, sans-serif",
              fontSize: 11,
              fontWeight: 700,
              color: textColor,
              opacity: 0.55,
              marginTop: 4,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            {sublabel}
          </div>
        )}
      </div>
    </div>
  );
}
