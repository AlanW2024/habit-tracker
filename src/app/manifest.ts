import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "1% — 自律打卡",
    short_name: "1%",
    description: "每日 1% 進步",
    start_url: "/today",
    display: "standalone",
    background_color: "#0a0a0c",
    theme_color: "#0a0a0c",
    orientation: "portrait",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
