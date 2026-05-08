import { cookies } from "next/headers";

export type Theme = "system" | "light" | "dark";
export type Accent = "tangerine" | "grape" | "lime" | "cobalt";

export const SUPPORTED_THEMES: readonly Theme[] = [
  "system",
  "light",
  "dark",
] as const;
export const SUPPORTED_ACCENTS: readonly Accent[] = [
  "tangerine",
  "grape",
  "lime",
  "cobalt",
] as const;

export const DEFAULT_THEME: Theme = "system";
export const DEFAULT_ACCENT: Accent = "tangerine";

export function isTheme(value: string | undefined): value is Theme {
  return value === "system" || value === "light" || value === "dark";
}

export function isAccent(value: string | undefined): value is Accent {
  return (
    value === "tangerine" ||
    value === "grape" ||
    value === "lime" ||
    value === "cobalt"
  );
}

export async function getTheme(): Promise<Theme> {
  const c = await cookies();
  const raw = c.get("theme")?.value;
  return isTheme(raw) ? raw : DEFAULT_THEME;
}

export async function getAccent(): Promise<Accent> {
  const c = await cookies();
  const raw = c.get("accent")?.value;
  return isAccent(raw) ? raw : DEFAULT_ACCENT;
}

// Light mode meta theme color (matches --color-bg in globals.css).
export const THEME_COLOR_LIGHT = "#FFF8F0";
// Dark mode meta theme color (matches --color-bg in globals.css).
export const THEME_COLOR_DARK = "#0F0E1A";
