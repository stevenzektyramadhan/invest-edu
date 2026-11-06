import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "InvestEdu - Edukasi & Rekomendasi Investasi",
    short_name: "InvestEdu",
    description:
      "Belajar investasi saham, reksa dana, emas, dan kripto dengan rekomendasi portofolio cerdas, pantauan pasar live, dan simulasi sandbox.",
    start_url: "/",
    display: "standalone",
    background_color: "#090a0b",
    theme_color: "#090a0b",
    orientation: "portrait-primary",
    shortcuts: [
      { name: "Terminal Pasar", url: "/market" },
      { name: "Paper Sandbox", url: "/portfolio-sandbox" },
      { name: "Modul Edukasi", url: "/education" },
    ],
    icons: [
      {
        src: "/icon-192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
