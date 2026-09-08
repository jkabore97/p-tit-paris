"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { books, formatPrice, slugify, TAG_LABEL, type Book, type Tag } from "@/lib/menu";

const TAGS: Tag[] = ["house", "veg", "spicy"];

function normalize(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export function MenuExplorer({ initialBook, initialTag }: { initialBook?: string; initialTag?: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const [bookId, setBookId] = useState<Book["id"]>(
    (books.find((b) => b.id === initialBook)?.id ?? "diner") as Book["id"],
  );
  const [tag, setTag] = useState<Tag | null>(TAGS.includes(initialTag as Tag) ? (initialTag as Tag) : null);
  const [query, setQuery] = useState("");
  const q = useDeferredValue(normalize(query.trim()));
  const [active, setActive] = useState<string>("");
  const railRef = useRef<HTMLDivElement>(null);

  const book = books.find((b) => b.id === bookId)!;

  // Synchronise l'URL (partageable) sans recharger
  useEffect(() => {
    const next = new URLSearchParams(params.toString());
    next.set("book", bookId);
    if (tag) next.set("tag", tag);
    else next.delete("tag");
    router.replace(`/menu?${next.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId, tag]);

  const sections = useMemo(() => {
    return book.sections
      .map((s) => ({
        ...s,
        items: s.items.filter((it) => {
          if (tag && !it.tags?.includes(tag)) return false;
          if (!q) return true;
          return normalize(`${it.name} ${it.desc ?? ""} ${s.title}`).includes(q);
        }),
      }))
      .filter((s) => s.items.length > 0);
  }, [book, tag, q]);

  const count = sections.reduce((n, s) => n + s.items.length, 0);

  // Rubrique active au scroll
  useEffect(() => {
    const els = sections.map((s) => document.getElementById(`sec-${s.id}`)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id.replace("sec-", ""));
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sections]);

  useEffect(() => {
    const btn = railRef.current?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    btn?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [active]);

  return (
    <div>
      {/* Sélecteur de carte */}
      <div className="flex flex-wrap gap-2">
        {books.map((b) => (
          <button
            key={b.id}
            onClick={() => setBookId(b.id)}
            className={`rounded-full px-5 py-2 text-sm uppercase tracking-[0.15em] transition ${
              b.id === bookId ? "bg-gold text-bordeaux-deep" : "border border-cream/30 text-cream/80 hover:border-cream"
            }`}
          >
            {b.title} <span className="ml-1 text-[10px] opacity-70">{b.hours}</span>
          </button>
        ))}
      </div>

      {/* Recherche + filtres */}
      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Rechercher un plat</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Chercher un plat, un ingrédient… (crevettes, mozzarella, bissap)"
            className="w-full rounded-full border border-cream/20 bg-cream/5 px-5 py-3 text-cream placeholder:text-cream/40 focus:border-gold focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/60 hover:text-cream" aria-label="Effacer">
              ✕
            </button>
          )}
        </label>
        <div className="flex gap-2">
          {TAGS.map((t) => (
            <button
              key={t}
              onClick={() => setTag(tag === t ? null : t)}
              className={`rounded-full px-4 py-2 text-sm transition ${
                tag === t ? "bg-cream text-bordeaux-deep" : "border border-cream/20 text-cream/80 hover:border-cream"
              }`}
            >
              {TAG_LABEL[t].emoji} {TAG_LABEL[t].label}
            </button>
          ))}
        </div>
      </div>

      {/* Rail des rubriques */}
      <div className="sticky top-14 z-30 -mx-5 mt-8 bg-bordeaux-deep/95 px-5 py-3 backdrop-blur md:top-16">
        <div ref={railRef} className="no-scrollbar flex gap-2 overflow-x-auto">
          {sections.map((s) => (
            <a
              key={s.id}
              data-id={s.id}
              href={`#sec-${s.id}`}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm whitespace-nowrap transition ${
                active === s.id ? "bg-gold text-bordeaux-deep" : "text-cream/70 hover:text-cream"
              }`}
            >
              {s.title}
            </a>
          ))}
        </div>
      </div>

      <p className="mt-6 text-xs uppercase tracking-[0.25em] text-cream/50">
        {count} {count > 1 ? "références" : "référence"}
        {q && ` pour « ${query.trim()} »`}
      </p>

      {count === 0 && (
        <div className="mt-10 rounded-3xl border border-cream/10 p-10 text-center text-cream/70">
          Rien pour cette recherche. Essayez « poulet », « chocolat » ou « rosé ».
        </div>
      )}

      {/* Rubriques */}
      <div className="mt-4 space-y-16">
        {sections.map((s) => (
          <section key={s.id} id={`sec-${s.id}`} className="scroll-mt-40">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-display text-3xl text-cream md:text-4xl">{s.title}</h2>
              {s.tagline && <p className="font-display text-sm italic text-gold/80">{s.tagline}</p>}
            </div>
            {s.dual && <p className="mt-1 text-xs uppercase tracking-[0.2em] text-cream/50">{s.dual}</p>}
            <ul className="mt-6 grid gap-x-10 gap-y-2 md:grid-cols-2">
              {s.items.map((it) => {
                const slug = slugify(it.name);
                return (
                  <li key={slug}>
                    <Link
                      href={`/menu/${slug}`}
                      className="group flex gap-4 rounded-2xl p-3 transition hover:bg-cream/5"
                    >
                      {it.photo && (
                        <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                          <Image src={it.photo} alt="" fill sizes="80px" className="object-cover transition duration-500 group-hover:scale-110" />
                        </span>
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="flex items-baseline justify-between gap-3">
                          <span className="font-display text-lg text-cream">
                            {it.name}
                            {it.tags?.map((t) => (
                              <span key={t} className="ml-1.5 text-sm" title={TAG_LABEL[t].label}>
                                {TAG_LABEL[t].emoji}
                              </span>
                            ))}
                          </span>
                          <span className="shrink-0 whitespace-nowrap text-gold">{formatPrice(it.price)}</span>
                        </span>
                        {it.desc && <span className="mt-1 block text-sm leading-snug text-cream/60">{it.desc}</span>}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            {s.note && <p className="mt-4 text-xs leading-relaxed text-cream/50">{s.note}</p>}
          </section>
        ))}
      </div>
    </div>
  );
}
