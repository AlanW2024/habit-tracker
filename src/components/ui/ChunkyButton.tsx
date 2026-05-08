import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ChunkyButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  children: ReactNode;
  /** Background color — defaults to current accent. */
  color?: string;
  /** Foreground color — defaults to white. */
  fg?: string;
  /** Stretch to container width. */
  full?: boolean;
  size?: "sm" | "lg";
}

export function ChunkyButton({
  children,
  color = "var(--color-primary)",
  fg = "#fff",
  full,
  size = "lg",
  disabled,
  style,
  ...rest
}: ChunkyButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled}
      style={{
        background: color,
        color: fg,
        border: "none",
        padding: size === "sm" ? "10px 18px" : "16px 22px",
        borderRadius: 999,
        fontFamily: "var(--font-body), Nunito, system-ui, sans-serif",
        fontWeight: 900,
        fontSize: size === "sm" ? 14 : 16,
        letterSpacing: 0.2,
        cursor: disabled ? "default" : "pointer",
        width: full ? "100%" : "auto",
        boxShadow: "inset 0 -4px 0 rgba(0,0,0,0.18)",
        opacity: disabled ? 0.5 : 1,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        ...style,
      }}
    >
      {children}
    </button>
  );
}
