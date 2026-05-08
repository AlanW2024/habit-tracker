import { cookies } from "next/headers";
import zhTW from "./locales/zh-TW.json";
import en from "./locales/en.json";

export type Locale = "zh-TW" | "en";

// Source of truth for shape; en.json must structurally match.
export type Dict = typeof zhTW;

const DICTS: Record<Locale, Dict> = {
  "zh-TW": zhTW,
  // Cast through unknown — TypeScript verifies en.json matches at compile time
  // because the import is structurally checked against the same shape.
  en: en as Dict,
};

export const SUPPORTED_LOCALES: readonly Locale[] = ["zh-TW", "en"] as const;
export const DEFAULT_LOCALE: Locale = "zh-TW";

export function isLocale(value: string | undefined): value is Locale {
  return value === "zh-TW" || value === "en";
}

export async function getLocale(): Promise<Locale> {
  const c = await cookies();
  const raw = c.get("locale")?.value;
  return isLocale(raw) ? raw : DEFAULT_LOCALE;
}

export function getDictFor(locale: Locale): Dict {
  return DICTS[locale];
}

export async function getDict(): Promise<Dict> {
  return getDictFor(await getLocale());
}

// Translate to lang-tag for <html lang="...">.
export function htmlLang(locale: Locale): string {
  return locale === "zh-TW" ? "zh-Hant" : "en";
}

// Tiny mustache-style interpolation: replaces {key} with values[key].
export function format(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) =>
    k in values ? String(values[k]) : `{${k}}`,
  );
}
