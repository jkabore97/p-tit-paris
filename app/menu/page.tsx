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
    <div className="marble min-h-screen">
      <div className="mx-auto max-w-6xl px-5 pb-28 pt-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-candy">La carte</p>
        <h1 className="font-display mt-2 text-5xl font-extrabold text-ink md:text-6xl">Tout, du matin au soir.</h1>
        <div className="mt-8">
          <Suspense fallback={<div className="h-40 animate-pulse rounded-3xl bg-white/60" />}>
            <MenuExplorer initialBook={book} initialTag={tag} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
