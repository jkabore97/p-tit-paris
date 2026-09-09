import type { MetadataRoute } from "next";
import { getMenu } from "@/lib/content";
import { allItems } from "@/lib/menu";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://p-tit-paris-ten.vercel.app";
  const now = new Date();
  const items = allItems(await getMenu());
  return [
    { url: base, lastModified: now, priority: 1 },
    { url: `${base}/menu`, lastModified: now, priority: 0.9 },
    { url: `${base}/commander`, lastModified: now, priority: 0.8 },
    { url: `${base}/sommelier`, lastModified: now, priority: 0.6 },
    { url: `${base}/reserver`, lastModified: now, priority: 0.8 },
    ...items.map((i) => ({ url: `${base}/menu/${i.slug}`, lastModified: now, priority: 0.5 })),
  ];
}
