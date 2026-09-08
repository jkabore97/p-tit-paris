import type { Metadata } from "next";
import { ReservationForm } from "@/components/ReservationForm";

export const metadata: Metadata = {
  title: "Réserver une table",
  description: "Réservez votre table chez P'tit Paris, Ouagadougou, en un message.",
};

export default function ReserverPage() {
  return (
    <div className="velvet min-h-screen text-cream">
      <div className="mx-auto max-w-5xl px-5 pb-24 pt-10">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Réservation</p>
        <h1 className="font-display mt-2 text-5xl md:text-6xl">Votre table vous attend.</h1>
        <p className="mt-4 max-w-xl text-cream/70">
          Petit-déjeuner dès 6h30, déjeuner à partir de 12h30, dîner jusque tard. Remplissez, envoyez, on confirme.
        </p>
        <div className="mt-10">
          <ReservationForm />
        </div>
      </div>
    </div>
  );
}
