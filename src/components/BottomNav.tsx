"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Home, Sparkles } from "lucide-react";

const TABS = [
  { href: "/today", label: "今日", icon: Home },
  { href: "/calendar", label: "月曆", icon: CalendarDays },
  { href: "/stats", label: "成長", icon: Sparkles },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 border-t border-[var(--color-border)] bg-[var(--color-bg)]/85 backdrop-blur-md safe-bottom"
      aria-label="主要分頁"
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around px-3 pt-2">
        {TABS.map((tab) => {
          const active =
            pathname === tab.href || pathname.startsWith(tab.href + "/");
          const Icon = tab.icon;
          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-0.5 rounded-xl py-2 transition-colors ${
                  active
                    ? "text-[var(--color-accent)]"
                    : "text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
                }`}
              >
                <Icon size={22} strokeWidth={2} />
                <span className="text-[11px] font-medium tracking-wide">
                  {tab.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
