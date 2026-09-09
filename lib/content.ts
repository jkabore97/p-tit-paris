import "server-only";
import { db } from "./db";
import { booksFromSections, seedSections, type Book, type DbSection } from "./menu";
import { site } from "./site";
import type { Post, SiteData, Social } from "./types";

/** Petit cache en mémoire (par instance serveur) pour ne pas interroger la base à chaque rendu. */
const TTL = 15_000;
const memo = new Map<string, { t: number; v: unknown }>();

async function cached<T>(key: string, load: () => Promise<T>, fallback: () => T): Promise<T> {
  const hit = memo.get(key);
  if (hit && Date.now() - hit.t < TTL) return hit.v as T;
  try {
    const v = await load();
    memo.set(key, { t: Date.now(), v });
    return v;
  } catch (e) {
    console.error(`[content] ${key}:`, e instanceof Error ? e.message : e);
    return (hit?.v as T) ?? fallback();
  }
}

export function bustContentCache() {
  memo.clear();
}

/** Rubriques brutes (y compris masquées), pour l'administration. */
export async function getSections(): Promise<DbSection[]> {
  return cached(
    "sections",
    async () => {
      const rows = await db.menu();
      return rows.length ? rows : seedSections();
    },
    seedSections,
  );
}

/** Les trois cartes publiques. */
export async function getMenu(): Promise<Book[]> {
  return booksFromSections(await getSections());
}

/** Annonces, plat du jour, partenaires et publicités actifs aujourd'hui. */
export async function getPosts(): Promise<Post[]> {
  return cached("posts", () => db.posts(), () => []);
}

export type ResolvedSite = Required<Pick<SiteData, "tagline" | "whatsapp" | "socials">> & SiteData;

/** Infos du restaurant, avec les valeurs par défaut du code en secours. */
export async function getSite(): Promise<ResolvedSite> {
  const data = await cached("site", () => db.site(), () => ({}) as SiteData);
  const socials: Social[] = data.socials?.length ? data.socials : site.socials;
  return {
    ...data,
    tagline: data.tagline?.trim() || site.tagline,
    whatsapp: data.whatsapp?.replace(/\D/g, "") || site.whatsapp,
    socials,
  };
}
