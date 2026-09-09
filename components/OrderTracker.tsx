"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Order, OrderStatus } from "@/lib/db";
import { formatPrice } from "@/lib/menu";

const steps: { s: OrderStatus; label: string; icon: string; hint: string }[] = [
  { s: "new", label: "Reçue", icon: "📨", hint: "La cuisine a votre commande." },
  { s: "preparing", label: "En cuisine", icon: "👩‍🍳", hint: "Ça chauffe, ça grille, ça mijote." },
  { s: "ready", label: "Prête", icon: "🔔", hint: "On arrive à votre table." },
  { s: "served", label: "Servie", icon: "🎉", hint: "Bon appétit !" },
];

export function OrderTracker({ initial }: { initial: Order }) {
  const [order, setOrder] = useState(initial);
  const [cancelling, setCancelling] = useState(false);
  const idx = steps.findIndex((s) => s.s === order.status);

  useEffect(() => {
    if (order.status === "served" || order.status === "cancelled") return;
    const id = setInterval(async () => {
      try {
        const r = await fetch(`/api/orders/${order.id}`, { cache: "no-store" });
        if (r.ok) setOrder((await r.json()) as Order);
      } catch {
        /* réseau */
      }
    }, 6000);
    return () => clearInterval(id);
  }, [order.id, order.status]);

  async function cancel() {
    if (!confirm("Annuler cette commande ?")) return;
    setCancelling(true);
    const r = await fetch(`/api/orders/${order.id}`, { method: "DELETE" });
    if (r.ok) setOrder((await r.json()) as Order);
    setCancelling(false);
  }

  return (
    <div>
      <div className="animate-rise text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-candy">Merci {order.guest_name} !</p>
        <h1 className="font-display mt-2 text-5xl font-extrabold text-ink">
          Table {order.table_no} · <span className="sunrise-text">{order.code}</span>
        </h1>
        <p className="mt-2 text-muted">Gardez cette page ouverte, elle se met à jour toute seule.</p>
      </div>

      {order.status === "cancelled" ? (
        <div className="animate-pop mt-10 rounded-[2rem] bg-white p-8 text-center shadow-xl">
          <p className="text-4xl">🙈</p>
          <p className="font-display mt-2 text-2xl font-bold text-ink">Commande annulée</p>
          <Link href="/commander" className="mt-6 inline-block rounded-full bg-candy px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-white">Recommencer</Link>
        </div>
      ) : (
        <ol className="mt-10 grid gap-3 md:grid-cols-4">
          {steps.map((st, i) => {
            const done = i < idx;
            const current = i === idx;
            return (
              <li
                key={st.s}
                className={`animate-rise relative rounded-3xl p-5 text-center transition ${current ? "bg-ink text-white shadow-2xl" : done ? "bg-mint-soft text-sage" : "bg-white text-muted shadow"}`}
                style={{ animationDelay: `${i * 90}ms` }}
              >
                <span className={`mx-auto grid h-14 w-14 place-items-center rounded-full text-3xl ${current ? "bg-candy animate-ring" : done ? "bg-mint" : "bg-marble"}`}>
                  {done ? "✓" : st.icon}
                </span>
                <p className="font-display mt-3 text-lg font-bold">{st.label}</p>
                {current && <p className="mt-1 text-xs text-white/70">{st.hint}</p>}
              </li>
            );
          })}
        </ol>
      )}

      <div className="animate-rise mt-8 rounded-[2rem] bg-white p-6 shadow-xl" style={{ animationDelay: ".3s" }}>
        <ul className="divide-y divide-ink/5">
          {order.items.map((l) => (
            <li key={l.key} className="flex items-center justify-between gap-3 py-3">
              <span className="flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-candy-soft text-sm font-bold text-candy">{l.qty}</span>
                <span className="font-medium text-ink">{l.name}</span>
              </span>
              <span className="font-display font-bold text-ink">{formatPrice(l.qty * l.price)}</span>
            </li>
          ))}
        </ul>
        {order.note && <p className="mt-3 rounded-2xl bg-marble px-4 py-2 text-sm text-muted">📝 {order.note}</p>}
        <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-4">
          <span className="text-sm uppercase tracking-[0.2em] text-muted">Total</span>
          <span className="font-display text-2xl font-extrabold text-candy">{formatPrice(order.total)}</span>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href={`/commander?table=${order.table_no}`} className="btn-shine rounded-full bg-ink px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-candy">
          Commander autre chose
        </Link>
        {order.status === "new" && (
          <button onClick={cancel} disabled={cancelling} className="rounded-full bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-muted shadow transition hover:text-candy disabled:opacity-50">
            Annuler
          </button>
        )}
      </div>
    </div>
  );
}
