"use client";

export function PrintButton() {
  return (
    <button onClick={() => window.print()} className="btn-shine rounded-full bg-candy px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-white">
      Imprimer
    </button>
  );
}
