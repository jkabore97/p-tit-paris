"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";

export function PinGate() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const r = await fetch("/api/kitchen/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pin }) });
    if (r.ok) router.refresh();
    else {
      setError(((await r.json().catch(() => ({}))) as { error?: string }).error ?? "PIN incorrect");
      setBusy(false);
    }
  }

  return (
    <div className="marble flex min-h-screen items-center justify-center px-5">
      <form onSubmit={submit} className="animate-pop w-full max-w-sm rounded-[2rem] bg-white p-8 text-center shadow-2xl">
        <Logo className="mx-auto h-14 w-14" />
        <h1 className="font-display mt-4 text-3xl font-extrabold text-ink">Espace équipe</h1>
        <p className="mt-1 text-sm text-muted">Entrez le PIN du personnel pour ouvrir l&apos;écran cuisine.</p>
        <input
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 8))}
          inputMode="numeric"
          autoFocus
          placeholder="••••••"
          className="mt-6 w-full rounded-2xl bg-marble px-4 py-4 text-center font-display text-3xl font-bold tracking-[0.4em] text-ink focus:outline-none focus:ring-2 focus:ring-candy"
        />
        {error && <p className="mt-3 text-sm text-candy">{error}</p>}
        <button disabled={busy || pin.length < 4} className="btn-shine mt-5 w-full rounded-full bg-ink py-3.5 font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-candy disabled:opacity-40">
          {busy ? "…" : "Entrer"}
        </button>
        <p className="mt-5 text-xs text-muted">
          Vous gérez le restaurant ? <Link href="/admin" className="font-semibold text-wine hover:text-candy">Centre de contrôle →</Link>
        </p>
      </form>
    </div>
  );
}
