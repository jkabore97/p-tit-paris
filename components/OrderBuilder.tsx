"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { cart, useCart } from "@/lib/cart";
import { track } from "@/lib/track";
import { formatPrice, orderableSections, slugify, TAG_LABEL, type Book, type FlatItem } from "@/lib/menu";
import type { Post } from "@/lib/types";
import { PlatDuJourCard } from "./PostCards";
import { AddButton } from "./AddButton";

function normalize(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export function OrderBuilder({ books, platDuJour, tableFromUrl }: { books: Book[]; platDuJour: Post | null; tableFromUrl: number | null }) {
  const router = useRouter();
  const { lines, table, name, count, total } = useCart();
  const [query, setQuery] = useState("");
  const q = useDeferredValue(normalize(query.trim()));
  const [note, setNote] = useState("");
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState("");
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tableFromUrl) cart.setTable(tableFromUrl);
  }, [tableFromUrl]);

  const groups = useMemo(
    () =>
      orderableSections(books)
        .map(({ book, section }) => ({
          book,
          section,
          items: section.items.filter((it) => it.available !== false && (!q || normalize(`${it.name} ${it.desc ?? ""} ${section.title}`).includes(q))),
        }))
        .filter((g) => g.items.length > 0),
    [books, q],
  );

  useEffect(() => {
    const els = groups.map((g) => document.getElementById(`o-${g.section.id}`)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const v = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (v[0]) setActive(v[0].target.id.replace("o-", ""));
      },
      { rootMargin: "-25% 0px -65% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [groups]);
  useEffect(() => {
    railRef.current?.querySelector<HTMLElement>(`[data-id="${active}"]`)?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [active]);

  async function send() {
    setError(null);
    if (!table) return setError("Indiquez votre numéro de table.");
    if (!name.trim()) return setError("Indiquez votre prénom pour qu'on vous retrouve.");
    if (count === 0) return setError("Ajoutez au moins un plat.");
    setBusy(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table, name, note, lines: lines.map((l) => ({ key: l.key, qty: l.qty })) }),
      });
      const data = (await res.json()) as { id?: string; error?: string };
      if (!res.ok || !data.id) throw new Error(data.error ?? "Envoi impossible");
      track("commande_envoyee", {
        table,
        total,
        articles: count,
        plat_du_jour: lines.some((l) => l.key.startsWith("post:")),
        origine: tableFromUrl ? "qr" : "manuel",
      });
      cart.clear();
      router.push(`/commande/${data.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Envoi impossible");
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-5 pb-40 pt-6">
      {/* En-tête table + prénom */}
      <div className="animate-rise flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-candy">Commande à table</p>
          <h1 className="font-display mt-1 text-4xl font-extrabold text-ink md:text-5xl">
            {table ? (
              <>
                Table <span className="sunrise-text">{table}</span>
              </>
            ) : (
              "Bienvenue !"
            )}
          </h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <label className="block">
            <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Table</span>
            <input
              type="number"
              min={1}
              max={200}
              inputMode="numeric"
              value={table ?? ""}
              onChange={(e) => cart.setTable(e.target.value ? Number(e.target.value) : null)}
              className="w-24 rounded-2xl bg-white px-4 py-2.5 font-display text-xl font-bold text-ink shadow ring-1 ring-ink/10 focus:ring-2 focus:ring-candy focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Votre prénom</span>
            <input
              value={name}
              onChange={(e) => cart.setName(e.target.value.slice(0, 60))}
              placeholder="Ex. Aïcha"
              className="w-44 rounded-2xl bg-white px-4 py-2.5 text-ink shadow ring-1 ring-ink/10 placeholder:text-muted/60 focus:ring-2 focus:ring-candy focus:outline-none"
            />
          </label>
        </div>
      </div>

      <label className="relative mt-6 block">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Une envie ? (burger, mojito, crêpe…)"
          className="w-full rounded-full bg-white px-5 py-3 text-ink shadow-inner ring-1 ring-ink/10 placeholder:text-muted/70 focus:ring-2 focus:ring-candy focus:outline-none"
        />
        {query && <button onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted" aria-label="Effacer">✕</button>}
      </label>

      {platDuJour && platDuJour.price != null && !q && (
        <div className="mt-6">
          <PlatDuJourCard post={platDuJour} compact />
        </div>
      )}

      <div className="glass sticky top-14 z-30 -mx-5 mt-5 px-5 py-3 md:top-16">
        <div ref={railRef} className="no-scrollbar flex gap-2 overflow-x-auto">
          {groups.map((g) => (
            <a key={g.section.id} data-id={g.section.id} href={`#o-${g.section.id}`} className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap transition ${active === g.section.id ? "bg-candy text-white shadow" : "text-ink/70 hover:bg-white"}`}>
              {g.section.title}
            </a>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-12">
        {groups.map((g) => (
          <section key={g.section.id} id={`o-${g.section.id}`} className="scroll-mt-36">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="font-display text-2xl font-extrabold text-ink md:text-3xl">{g.section.title}</h2>
              <span className="text-[11px] uppercase tracking-[0.2em] text-muted">{g.book.title}</span>
            </div>
            {g.section.dual && <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{g.section.dual}</p>}
            <ul className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {g.items.map((it) => {
                const slug = it.slug ?? slugify(it.name);
                const flat: FlatItem = { ...it, slug, sectionId: g.section.id, sectionTitle: g.section.title, bookId: g.book.id, bookTitle: g.book.title };
                return (
                  <li key={slug} className="card-hover flex gap-3 rounded-3xl bg-white p-3 shadow-sm ring-1 ring-ink/5">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-marble">
                      {it.photo && <Image src={it.photo} alt="" fill sizes="80px" className="object-cover" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-display text-base font-bold leading-tight text-ink">
                          {it.name}
                          {it.tags?.map((t) => (
                            <span key={t} className="ml-1 text-xs" title={TAG_LABEL[t].label}>{TAG_LABEL[t].emoji}</span>
                          ))}
                        </p>
                        <span className="shrink-0 whitespace-nowrap text-sm font-bold text-candy">{formatPrice(it.price)}</span>
                      </div>
                      {it.desc && <p className="mt-0.5 line-clamp-2 text-xs text-muted">{it.desc}</p>}
                      <div className="mt-2">
                        <AddButton item={flat} dual={g.section.dual} />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      {/* Panier flottant */}
      <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3">
        <div className={`mx-auto max-w-2xl velvet overflow-hidden rounded-[2rem] text-white shadow-2xl shadow-wine/40 transition-all ${open ? "max-h-[75vh]" : "max-h-20"}`}>
          <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between gap-4 px-6 py-4">
            <span className="flex items-center gap-3">
              <span className={`grid h-9 w-9 place-items-center rounded-full bg-candy font-bold ${count ? "animate-pop" : ""}`}>{count}</span>
              <span className="text-left">
                <span className="block text-sm font-semibold">{count ? "Ma commande" : "Votre commande est vide"}</span>
                <span className="block text-xs text-white/60">{open ? "Replier" : count ? "Voir le détail et envoyer" : "Ajoutez des plats ci-dessus"}</span>
              </span>
            </span>
            <span className="font-display text-xl font-bold text-honey">{formatPrice(total)}</span>
          </button>
          {open && (
            <div className="max-h-[calc(75vh-5rem)] overflow-y-auto border-t border-white/10 px-6 pb-6 pt-4">
              <ul className="space-y-3">
                {lines.map((l) => (
                  <li key={l.key} className="flex items-center gap-3">
                    <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-white/10">{l.photo && <Image src={l.photo} alt="" fill sizes="48px" className="object-cover" />}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{l.name}</span>
                      <span className="block text-xs text-white/60">{formatPrice(l.price)}</span>
                    </span>
                    <span className="flex items-center gap-1 rounded-full bg-white/10 p-1">
                      <button onClick={() => cart.setQty(l.key, l.qty - 1)} className="grid h-7 w-7 place-items-center rounded-full hover:bg-white/20" aria-label="Moins">−</button>
                      <span className="w-6 text-center text-sm font-bold">{l.qty}</span>
                      <button onClick={() => cart.setQty(l.key, l.qty + 1)} className="grid h-7 w-7 place-items-center rounded-full hover:bg-white/20" aria-label="Plus">+</button>
                    </span>
                  </li>
                ))}
              </ul>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value.slice(0, 300))}
                rows={2}
                placeholder="Une précision ? (sans oignon, bien cuit, allergie…)"
                className="mt-4 w-full rounded-2xl bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-honey"
              />
              {error && <p className="mt-3 rounded-2xl bg-candy/20 px-4 py-2 text-sm text-candy-soft">{error}</p>}
              <button
                onClick={send}
                disabled={busy || count === 0}
                className="btn-shine mt-4 w-full rounded-full bg-candy py-4 font-display text-lg font-bold text-white shadow-xl shadow-candy/30 transition hover:-translate-y-0.5 disabled:opacity-40"
              >
                {busy ? "Envoi…" : `Envoyer en cuisine · ${formatPrice(total)}`}
              </button>
              <p className="mt-2 text-center text-xs text-white/50">Règlement à table ou au comptoir, comme d&apos;habitude.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
