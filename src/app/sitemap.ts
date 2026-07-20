import type { MetadataRoute } from "next";

import { getPopularDonghua } from "@/lib/anilist";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://donghuawiki-id.vercel.app";

export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/ranking",
    "/character",
    "/search",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: path === "" ? 1 : 0.8,
  }));

  // Tambahkan halaman donghua terpopuler ke sitemap.
  let donghuaRoutes: MetadataRoute.Sitemap = [];
  try {
    const popular = await getPopularDonghua(1, 50);
    donghuaRoutes = popular.items.map((m) => ({
      url: `${SITE_URL}/donghua/${m.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    }));
  } catch {
    // Abaikan jika API gagal saat build.
  }

  return [...staticRoutes, ...donghuaRoutes];
}
