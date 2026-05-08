import type { Metadata, Viewport } from "next";
import { Nunito, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { getDict, getLocale, htmlLang } from "@/i18n";
import { I18nProvider } from "@/i18n/Provider";
import {
  getAccent,
  getTheme,
  THEME_COLOR_DARK,
  THEME_COLOR_LIGHT,
} from "@/theme";

const nunito = Nunito({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display-google",
});

export const metadata: Metadata = {
  title: "1% Discipline · 自律打卡",
  description: "每天進步 1%。建立習慣、累積身份、看見複利。",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "1%",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: THEME_COLOR_LIGHT },
    { media: "(prefers-color-scheme: dark)", color: THEME_COLOR_DARK },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [locale, theme, accent, dict] = await Promise.all([
    getLocale(),
    getTheme(),
    getAccent(),
    getDict(),
  ]);

  return (
    <html
      lang={htmlLang(locale)}
      data-theme={theme}
      data-accent={accent}
      className={`h-full ${nunito.variable} ${spaceGrotesk.variable}`}
    >
      <body className="min-h-full">
        <I18nProvider locale={locale} dict={dict}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
