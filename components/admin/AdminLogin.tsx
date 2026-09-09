"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/Logo";

export function AdminLogin() {
  const router = useRouter();
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const r = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pwd }) });
    if (r.ok) router.refresh();
    else {
      setError(((await r.json().catch(() => ({}))) as { error?: string }).error ?? "Mot de passe incorrect");
      setBusy(false);
    }
  }
  return (
    <div className="marble flex min-h-screen items-center justify-center px-5">
      <form onSubmit={submit} className="animate-pop w-full max-w-sm rounded-[2rem] bg-white p-8 text-center shadow-2xl">
        <Logo className="mx-auto h-14 w-14" />
        <h1 className="font-display mt-4 text-3xl font-extrabold text-ink">Centre de contrôle</h1>
        <p className="mt-1 text-sm text-muted">Carte, annonces, réseaux, photos : tout se règle ici.</p>
        <input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} autoFocus placeholder="Mot de passe" className="mt-6 w-full rounded-2xl bg-marble px-4 py-3.5 text-center text-lg text-ink focus:outline-none focus:ring-2 focus:ring-candy" />
        {error && <p className="mt-3 text-sm text-candy">{error}</p>}
        <button disabled={busy || pwd.length < 4} className="btn-shine mt-5 w-full rounded-full bg-wine py-3.5 font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-candy disabled:opacity-40">{busy ? "…" : "Entrer"}</button>
        <p className="mt-5 flex justify-center gap-4 text-xs text-muted">
          <Link href="/" className="hover:text-wine">← Le site</Link>
          <Link href="/cuisine" className="hover:text-wine">Écran cuisine →</Link>
        </p>
      </form>
    </div>
  );
}
