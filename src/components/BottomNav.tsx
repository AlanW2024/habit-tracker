"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useDict } from "@/i18n/Provider";

interface TabIconProps {
  kind: "home" | "list" | "chart" | "deck" | "user";
  color: string;
}

function TabIcon({ kind, color }: TabIconProps) {
  const stroke = {
    stroke: color,
    strokeWidth: 2.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    fill: "none",
  };
  switch (kind) {
    case "home":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M3 11 L12 4 L21 11 V20 a1 1 0 0 1 -1 1 H4 a1 1 0 0 1 -1 -1 z"
            {...stroke}
          />
        </svg>
      );
    case "list":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="4" y="5" width="16" height="3.5" rx="1.5" {...stroke} />
          <rect x="4" y="11" width="16" height="3.5" rx="1.5" {...stroke} />
          <rect x="4" y="17" width="10" height="3.5" rx="1.5" {...stroke} />
        </svg>
      );
    case "chart":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 20 V12 M10 20 V6 M16 20 V14 M22 20 V8" {...stroke} />
        </svg>
      );
    case "deck":
      // stacked cards
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="6" y="4" width="12" height="14" rx="2" {...stroke} />
          <rect x="3" y="8" width="12" height="14" rx="2" {...stroke} />
        </svg>
      );
    case "user":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="8" r="3.5" {...stroke} />
          <path d="M5 20 c 0 -4, 4 -6, 7 -6 s 7 2, 7 6" {...stroke} />
        </svg>
      );
  }
}

interface Tab {
  href: string;
  labelKey:
    | "today"
    | "habits"
    | "stats"
    | "rewards"
    | "profile";
  icon: TabIconProps["kind"];
}

const TABS: readonly Tab[] = [
  { href: "/today", labelKey: "today", icon: "home" },
  { href: "/habits", labelKey: "habits", icon: "list" },
  { href: "/stats", labelKey: "stats", icon: "chart" },
  { href: "/rewards", labelKey: "rewards", icon: "deck" },
  { href: "/profile", labelKey: "profile", icon: "user" },
] as const;

export function BottomNav(): ReactNode {
  const pathname = usePathname();
  const dict = useDict();
  return (
    <nav
      className="fixed left-0 right-0 z-30 safe-bottom"
      aria-label="主要分頁"
      style={{
        bottom: 0,
        padding: "0 12px max(12px, env(safe-area-inset-bottom)) 12px",
      }}
    >
      <ul
        className="mx-auto flex max-w-md items-stretch"
        style={{
          gap: 4,
          padding: "8px 6px",
          borderRadius: 30,
          background: "color-mix(in srgb, var(--color-surface) 92%, transparent)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          border: "1px solid var(--color-border)",
          boxShadow: "0 10px 30px rgba(26,20,16,0.10)",
        }}
      >
        {TABS.map((tab) => {
          const active =
            pathname === tab.href || pathname.startsWith(tab.href + "/");
          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 3,
                  padding: "10px 4px",
                  borderRadius: 22,
                  background: active ? "var(--color-primary-soft)" : "transparent",
                  color: active ? "var(--color-primary)" : "var(--color-muted)",
                  transition: "all 220ms cubic-bezier(.2,.9,.3,1.2)",
                  textDecoration: "none",
                }}
              >
                <TabIcon
                  kind={tab.icon}
                  color={active ? "var(--color-primary)" : "var(--color-muted)"}
                />
                <span
                  style={{
                    fontFamily:
                      "var(--font-body), Nunito, system-ui, sans-serif",
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: 0.2,
                  }}
                >
                  {dict.nav[tab.labelKey]}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
