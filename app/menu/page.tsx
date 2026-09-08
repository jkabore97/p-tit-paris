import type { Metadata } from "next";
import { Suspense } from "react";
import { MenuExplorer } from "@/components/MenuExplorer";

export const metadata: Metadata = {
  title: "La carte",
  description: "Toute la carte P'tit Paris : petit-déjeuner, déjeuner & dîner, bar et cave. Recherche, filtres végétarien, spicy et spécialités maison.",
};

export default async function MenuPage({ searchParams }: PageProps<"/menu">) {
  const sp = await searchParams;
  const book = typeof sp.book === "string" ? sp.book : undefined;
  const tag = typeof sp.tag === "string" ? sp.tag : undefined;
  return (
    <div className="velvet min-h-screen text-cream">
      <div className="mx-auto max-w-6xl px-5 pb-24 pt-10">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">La carte</p>
        <h1 className="font-display mt-2 text-5xl md:text-6xl">Tout, du matin au soir.</h1>
        <div className="mt-8">
          <Suspense fallback={<div className="h-40 animate-pulse rounded-3xl bg-cream/5" />}>
            <MenuExplorer initialBook={book} initialTag={tag} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
