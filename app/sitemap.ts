import type { MetadataRoute } from "next";
import { allItems } from "@/lib/menu";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ptitparis.vercel.app";
  const now = new Date();
  return [
    { url: base, lastModified: now, priority: 1 },
    { url: `${base}/menu`, lastModified: now, priority: 0.9 },
    { url: `${base}/sommelier`, lastModified: now, priority: 0.6 },
    { url: `${base}/reserver`, lastModified: now, priority: 0.8 },
    ...allItems().map((i) => ({ url: `${base}/menu/${i.slug}`, lastModified: now, priority: 0.5 })),
  ];
}
