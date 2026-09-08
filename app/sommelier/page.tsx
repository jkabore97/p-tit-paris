import type { Metadata } from "next";
import { Sommelier } from "@/components/Sommelier";

export const metadata: Metadata = {
  title: "Sommelier IA",
  description: "Le sommelier de P'tit Paris compose votre menu et vos accords à partir de la carte, selon votre budget.",
};

export default async function SommelierPage({ searchParams }: PageProps<"/sommelier">) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : undefined;
  return (
    <div className="velvet min-h-screen text-cream">
      <div className="mx-auto max-w-3xl px-5 pb-24 pt-10">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Le sommelier</p>
        <h1 className="font-display mt-2 text-5xl md:text-6xl">Demandez, il compose.</h1>
        <p className="mt-4 text-cream/70">
          Accords mets-boissons, menus à budget, options végétariennes ou sans porc : il ne cite que ce qui est réellement sur la carte,
          prix compris.
        </p>
        <div className="mt-8">
          <Sommelier initialQuestion={q} />
        </div>
        <p className="mt-4 text-xs text-cream/40">
          Propulsé par Claude. Les conseils sont indicatifs ; l&apos;équipe en salle a toujours le dernier mot.
        </p>
      </div>
    </div>
  );
}
