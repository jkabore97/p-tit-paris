import type { Metadata } from "next";
import { ReservationForm } from "@/components/ReservationForm";
import { getSite } from "@/lib/content";

export const metadata: Metadata = { title: "Réserver une table", description: "Réservez votre table chez P'tit Paris, Ouagadougou, en un message." };

export default async function ReserverPage() {
  const siteData = await getSite();
  return (
    <div className="marble relative min-h-screen overflow-hidden">
      <div className="blob left-[-10%] top-[-5%] h-[35vw] w-[35vw] bg-honey opacity-40" />
      <div className="relative mx-auto max-w-5xl px-5 pb-28 pt-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-candy">Réservation</p>
        <h1 className="font-display mt-2 text-5xl font-extrabold text-ink md:text-6xl">Votre table vous attend.</h1>
        <p className="mt-4 max-w-xl text-muted">Petit-déjeuner dès 6h30, déjeuner à partir de 12h30, dîner jusque tard. Pour un gâteau ou une bûche, précisez la date et le nombre de parts.</p>
        <div className="mt-10">
          <ReservationForm whatsapp={siteData.whatsapp} />
        </div>
      </div>
    </div>
  );
}
