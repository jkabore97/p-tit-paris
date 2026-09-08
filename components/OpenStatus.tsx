"use client";

import { useEffect, useState } from "react";
import { currentService } from "@/lib/hours";

export function OpenStatus() {
  const [state, setState] = useState<ReturnType<typeof currentService> | null>(null);
  useEffect(() => {
    const tick = () => setState(currentService());
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);
  if (!state) return <span className="inline-block h-6 w-48 animate-pulse rounded-full bg-cream/10" />;
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cream/90">
      <span className={`h-2 w-2 rounded-full ${state.open ? "bg-emerald-400" : "bg-amber-400"} shadow-[0_0_12px_currentColor]`} />
      {state.open
        ? `En service · ${state.service.label} jusqu'à ${state.until}`
        : `Fermé · ${state.service.label} dès ${state.opensAt}`}
    </span>
  );
}
