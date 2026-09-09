"use client";

import { useState } from "react";

export function ShareButton({ title, text }: { title: string; text: string }) {
  const [done, setDone] = useState(false);
  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title, text, url });
      else {
        await navigator.clipboard.writeText(url);
        setDone(true);
        setTimeout(() => setDone(false), 1800);
      }
    } catch {
      /* annulé */
    }
  }
  return (
    <button onClick={share} className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink shadow transition hover:-translate-y-0.5">
      {done ? "Lien copié ✓" : "↗ Partager"}
    </button>
  );
}
