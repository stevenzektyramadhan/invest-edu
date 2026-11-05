import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "InvestEdu - Edukasi & Rekomendasi Investasi",
    short_name: "InvestEdu",
    description: "Belajar investasi saham, reksa dana, emas, dan kripto dengan rekomendasi portofolio cerdas serta pantauan pasar.",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#0284c7",
    orientation: "portrait",
    icons: [
      {
        src: "/icon-192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
      },
      {
        src: "/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
      },
    ],
  };
}
