"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Order, OrderStatus } from "@/lib/db";
import { formatPrice } from "@/lib/menu";
import { Logo } from "./Logo";

const COLS: { s: OrderStatus; title: string; next: OrderStatus | null; nextLabel: string; tint: string }[] = [
  { s: "new", title: "Nouvelles", next: "preparing", nextLabel: "En cuisine →", tint: "bg-candy-soft" },
  { s: "preparing", title: "En cuisine", next: "ready", nextLabel: "Prête →", tint: "bg-wood/50" },
  { s: "ready", title: "Prêtes à servir", next: "served", nextLabel: "Servie ✓", tint: "bg-mint-soft" },
];

function minutesSince(iso: string) {
  return Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
}

function chime() {
  try {
    const ctx = new AudioContext();
    [0, 0.18].forEach((t, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g);
      g.connect(ctx.destination);
      o.frequency.value = i ? 1320 : 880;
      g.gain.setValueAtTime(0.0001, ctx.currentTime + t);
      g.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t + 0.35);
      o.start(ctx.currentTime + t);
      o.stop(ctx.currentTime + t + 0.4);
    });
  } catch {
    /* audio bloqué */
  }
}

export function KitchenBoard() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showServed, setShowServed] = useState(false);
  const [tick, setTick] = useState(0);
  const known = useRef<Set<string> | null>(null);
  const [flash, setFlash] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    try {
      const r = await fetch("/api/kitchen/orders", { cache: "no-store" });
      if (r.status === 401) return router.refresh();
      if (!r.ok) throw new Error("Chargement impossible");
      const data = (await r.json()) as Order[];
      if (known.current) {
        const fresh = data.filter((o) => !known.current!.has(o.id) && o.status === "new").map((o) => o.id);
        if (fresh.length) {
          chime();
          setFlash(new Set(fresh));
          setTimeout(() => setFlash(new Set()), 4000);
        }
      }
      known.current = new Set(data.map((o) => o.id));
      setOrders(data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    }
  }, [router]);

  useEffect(() => {
    void load();
    const id = setInterval(load, 5000);
    const t = setInterval(() => setTick((x) => x + 1), 30000);
    return () => {
      clearInterval(id);
      clearInterval(t);
    };
  }, [load]);

  async function setStatus(id: string, status: OrderStatus) {
    setOrders((os) => os?.map((o) => (o.id === id ? { ...o, status } : o)) ?? null);
    await fetch("/api/kitchen/status", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    void load();
  }
  async function logout() {
    await fetch("/api/kitchen/login", { method: "DELETE" });
    router.refresh();
  }
  async function changePin() {
    const next = prompt("Nouveau PIN (4 à 8 chiffres) :");
    if (!next) return;
    const r = await fetch("/api/kitchen/pin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ next }) });
    alert(r.ok ? "PIN modifié." : ((await r.json().catch(() => ({}))) as { error?: string }).error ?? "Erreur");
  }

  const served = orders?.filter((o) => o.status === "served") ?? [];
  void tick;

  return (
    <div className="min-h-screen bg-marble">
      <header className="velvet sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 px-5 py-3 text-white">
        <div className="flex items-center gap-3">
          <Logo className="h-9 w-9" variant="pink" />
          <div>
            <p className="font-display text-xl font-bold leading-tight">Cuisine · P&apos;tit Paris</p>
            <p className="text-xs text-white/60">{orders ? `${orders.filter((o) => o.status !== "served").length} commande(s) en cours · actualisé toutes les 5 s` : "Chargement…"}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.15em]">
          <Link href="/cuisine/qr" className="rounded-full bg-white/10 px-4 py-2 hover:bg-white/20">QR des tables</Link>
          <button onClick={changePin} className="rounded-full bg-white/10 px-4 py-2 hover:bg-white/20">Changer le PIN</button>
          <button onClick={logout} className="rounded-full bg-white/10 px-4 py-2 hover:bg-candy">Quitter</button>
        </div>
      </header>

      {error && <p className="mx-5 mt-4 rounded-2xl bg-candy-soft px-4 py-2 text-sm text-candy">{error}</p>}

      <div className="grid gap-4 p-4 lg:grid-cols-3">
        {COLS.map((col) => {
          const list = orders?.filter((o) => o.status === col.s) ?? [];
          return (
            <section key={col.s} className={`rounded-[2rem] ${col.tint} p-4`}>
              <div className="flex items-center justify-between px-2">
                <h2 className="font-display text-2xl font-extrabold text-ink">{col.title}</h2>
                <span className="grid h-9 min-w-9 place-items-center rounded-full bg-white px-2 font-display text-lg font-bold text-ink shadow">{list.length}</span>
              </div>
              <ul className="mt-3 space-y-3">
                {list.length === 0 && <li className="rounded-3xl bg-white/60 p-6 text-center text-sm text-muted">Rien pour l&apos;instant</li>}
                {list.map((o) => {
                  const mins = minutesSince(o.created_at);
                  const late = col.s !== "ready" && mins >= 15;
                  return (
                    <li key={o.id} className={`rounded-3xl bg-white p-4 shadow-lg ring-2 transition ${flash.has(o.id) ? "animate-pop ring-candy" : late ? "ring-candy/60" : "ring-transparent"}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-display text-4xl font-extrabold leading-none text-ink">
                            T{o.table_no} <span className="text-lg text-muted">· {o.code}</span>
                          </p>
                          <p className="mt-1 text-sm font-semibold text-ink">{o.guest_name}</p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${late ? "bg-candy text-white" : "bg-marble text-muted"}`}>{mins} min</span>
                      </div>
                      <ul className="mt-3 space-y-1.5">
                        {o.items.map((l) => (
                          <li key={l.key} className="flex items-start gap-2 text-sm">
                            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink text-xs font-bold text-white">{l.qty}</span>
                            <span className="font-medium text-ink">{l.name}</span>
                          </li>
                        ))}
                      </ul>
                      {o.note && <p className="mt-3 rounded-2xl bg-honey/30 px-3 py-2 text-sm font-medium text-ink">📝 {o.note}</p>}
                      <div className="mt-4 flex items-center justify-between gap-2">
                        <span className="text-xs text-muted">{formatPrice(o.total)}</span>
                        <div className="flex gap-2">
                          {col.s === "new" && (
                            <button onClick={() => setStatus(o.id, "cancelled")} className="rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-muted hover:text-candy">Annuler</button>
                          )}
                          {col.next && (
                            <button onClick={() => setStatus(o.id, col.next!)} className="btn-shine rounded-full bg-ink px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] text-white transition hover:bg-candy">
                              {col.nextLabel}
                            </button>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>

      <div className="px-4 pb-10">
        <button onClick={() => setShowServed((s) => !s)} className="text-sm font-semibold uppercase tracking-[0.15em] text-muted hover:text-ink">
          {showServed ? "Masquer" : "Voir"} les commandes servies ({served.length})
        </button>
        {showServed && (
          <ul className="mt-3 grid gap-2 md:grid-cols-3">
            {served.map((o) => (
              <li key={o.id} className="rounded-2xl bg-white/70 px-4 py-3 text-sm text-muted">
                <span className="font-bold text-ink">T{o.table_no} · {o.code}</span> · {o.guest_name} · {formatPrice(o.total)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
