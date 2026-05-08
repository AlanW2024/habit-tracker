"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Dict, Locale } from "./index";

interface I18nContextValue {
  locale: Locale;
  dict: Dict;
}

const I18nContext = createContext<I18nContextValue | null>(null);

interface I18nProviderProps {
  locale: Locale;
  dict: Dict;
  children: ReactNode;
}

export function I18nProvider({ locale, dict, children }: I18nProviderProps) {
  return (
    <I18nContext.Provider value={{ locale, dict }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useDict(): Dict {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useDict must be used inside <I18nProvider>");
  return ctx.dict;
}

export function useLocale(): Locale {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useLocale must be used inside <I18nProvider>");
  return ctx.locale;
}
