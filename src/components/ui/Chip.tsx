import type { CSSProperties, ReactNode } from "react";

interface ChipProps {
  children: ReactNode;
  bg?: string;
  fg?: string;
  style?: CSSProperties;
}

export function Chip({
  children,
  bg = "var(--color-surface)",
  fg = "var(--color-text)",
  style,
}: ChipProps) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 12px",
        borderRadius: 999,
        fontFamily: "var(--font-body), Nunito, system-ui, sans-serif",
        fontSize: 13,
        fontWeight: 700,
        background: bg,
        color: fg,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
