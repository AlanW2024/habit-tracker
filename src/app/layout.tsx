import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "1% — 自律打卡",
  description: "每日 1% 進步。建立習慣、累積身份、看見複利。",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "1%",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0c",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
