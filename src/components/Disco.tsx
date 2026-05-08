// Disco — the 1% Discipline mascot.
// Pure SVG primitives — no state — safe for server components.

export type DiscoMood = "happy" | "cheer" | "sleepy";

interface DiscoProps {
  size?: number;
  mood?: DiscoMood;
  /** Body fill color (e.g. accent or surface). */
  color?: string;
  /** Antenna ball color (small accent dot). */
  accent?: string;
  wink?: boolean;
}

export function Disco({
  size = 80,
  mood = "happy",
  color = "var(--color-primary)",
  accent = "#FFFCF5",
  wink = false,
}: DiscoProps) {
  const eyes =
    mood === "sleepy"
      ? { y: 50, rx: 6, ry: 1.5 }
      : mood === "cheer"
      ? { y: 47, rx: 4.5, ry: 5 }
      : { y: 48, rx: 4, ry: 4.5 };
  const mouthArc =
    mood === "sleepy"
      ? "M 38 64 Q 50 66 62 64"
      : mood === "cheer"
      ? "M 36 60 Q 50 76 64 60"
      : "M 38 62 Q 50 72 62 62";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ display: "block", overflow: "visible" }}
      aria-hidden="true"
    >
      <ellipse cx="50" cy="92" rx="28" ry="4" fill="rgba(0,0,0,0.12)" />
      <rect x="14" y="20" width="72" height="68" rx="36" fill={color} />
      <ellipse cx="50" cy="78" rx="22" ry="6" fill="rgba(255,255,255,0.12)" />
      <circle cx="28" cy="58" r="5" fill="rgba(255,107,61,0.55)" />
      <circle cx="72" cy="58" r="5" fill="rgba(255,107,61,0.55)" />
      {wink ? (
        <>
          <ellipse
            cx="38"
            cy={eyes.y}
            rx={eyes.rx}
            ry={eyes.ry}
            fill="#1A1410"
          />
          <path
            d="M 58 48 Q 64 44 70 48"
            stroke="#1A1410"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          <ellipse
            cx="38"
            cy={eyes.y}
            rx={eyes.rx}
            ry={eyes.ry}
            fill="#1A1410"
          />
          <ellipse
            cx="62"
            cy={eyes.y}
            rx={eyes.rx}
            ry={eyes.ry}
            fill="#1A1410"
          />
          {mood !== "sleepy" && (
            <>
              <circle cx="39.5" cy={eyes.y - 1.5} r="1.2" fill="#FFFCF5" />
              <circle cx="63.5" cy={eyes.y - 1.5} r="1.2" fill="#FFFCF5" />
            </>
          )}
        </>
      )}
      <path
        d={mouthArc}
        stroke="#1A1410"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="50"
        y1="20"
        x2="50"
        y2="12"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle
        cx="50"
        cy="9"
        r="3.5"
        fill={accent}
        stroke="#1A1410"
        strokeWidth="1.5"
      />
    </svg>
  );
}
