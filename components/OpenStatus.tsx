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
  if (!state) return <span className="inline-block h-8 w-56 animate-pulse rounded-full bg-ink/10" />;
  return (
    <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-ink shadow">
      <span className={`h-2.5 w-2.5 rounded-full ${state.open ? "bg-mint" : "bg-honey"} ${state.open ? "animate-ring" : ""}`} />
      {state.open ? `En service · ${state.service.label} jusqu'à ${state.until}` : `Fermé · ${state.service.label} dès ${state.opensAt}`}
    </span>
  );
}
