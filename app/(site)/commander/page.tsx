import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderBuilder } from "@/components/OrderBuilder";
import { getMenu, getPosts } from "@/lib/content";

export const metadata: Metadata = { title: "Commander à table", description: "Commandez depuis votre table chez P'tit Paris : scannez, choisissez, on vous apporte." };

export default async function CommanderPage({ searchParams }: PageProps<"/commander">) {
  const sp = await searchParams;
  const t = Number.parseInt(typeof sp.table === "string" ? sp.table : "", 10);
  const [books, posts] = await Promise.all([getMenu(), getPosts()]);
  const plat = posts.find((p) => p.kind === "plat_du_jour") ?? null;
  return (
    <div className="marble min-h-screen">
      <Suspense fallback={<div className="mx-auto max-w-6xl px-5 pt-10"><div className="h-40 animate-pulse rounded-3xl bg-white/60" /></div>}>
        <OrderBuilder books={books} platDuJour={plat} tableFromUrl={Number.isFinite(t) && t > 0 ? t : null} />
      </Suspense>
    </div>
  );
}
