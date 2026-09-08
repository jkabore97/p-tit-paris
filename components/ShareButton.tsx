"use client";

import { useState } from "react";

export function ShareButton({ title, text }: { title: string; text: string }) {
  const [done, setDone] = useState(false);
  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
      } else {
        await navigator.clipboard.writeText(url);
        setDone(true);
        setTimeout(() => setDone(false), 1800);
      }
    } catch {
      /* annulé */
    }
  }
  return (
    <button onClick={share} className="rounded-full border border-cream/40 px-6 py-3 text-sm uppercase tracking-[0.2em] hover:bg-cream/10">
      {done ? "Lien copié ✓" : "Partager"}
    </button>
  );
}
