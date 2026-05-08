import type { ReactNode } from "react";

interface SectionHeaderProps {
  title: ReactNode;
  /** Optional right-aligned indicator/action label. */
  action?: ReactNode;
  /** Whether to render the action with arrow. */
  actionAsLink?: boolean;
}

export function SectionHeader({
  title,
  action,
  actionAsLink = false,
}: SectionHeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        padding: "0 4px",
        marginBottom: 10,
      }}
    >
      <h2
        style={{
          margin: 0,
          fontFamily:
            "var(--font-display), Space Grotesk, system-ui, sans-serif",
          fontSize: 20,
          fontWeight: 700,
          color: "var(--color-text)",
          letterSpacing: -0.5,
        }}
      >
        {title}
      </h2>
      {action !== undefined && action !== null && (
        <span
          style={{
            fontFamily: "var(--font-body), Nunito, system-ui, sans-serif",
            fontWeight: 800,
            fontSize: 13,
            color: actionAsLink ? "var(--color-primary)" : "var(--color-muted)",
          }}
        >
          {action}
          {actionAsLink ? " →" : null}
        </span>
      )}
    </div>
  );
}
