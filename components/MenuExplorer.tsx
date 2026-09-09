"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { AddButton } from "./AddButton";
import { formatPrice, slugify, TAG_LABEL, type Book, type FlatItem, type Tag } from "@/lib/menu";
import type { Post } from "@/lib/types";
import { AdCard } from "./PostCards";

const TAGS: Tag[] = ["house", "veg", "spicy"];
const tints = ["bg-candy-soft/60", "bg-mint-soft/70", "bg-azure-soft/70", "bg-wood/40"];

function normalize(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export function MenuExplorer({ books, ads = [], initialBook, initialTag }: { books: Book[]; ads?: Post[]; initialBook?: string; initialTag?: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const [bookId, setBookId] = useState<Book["id"]>((books.find((b) => b.id === initialBook)?.id ?? "diner") as Book["id"]);
  const [tag, setTag] = useState<Tag | null>(TAGS.includes(initialTag as Tag) ? (initialTag as Tag) : null);
  const [query, setQuery] = useState("");
  const q = useDeferredValue(normalize(query.trim()));
  const [active, setActive] = useState<string>("");
  const railRef = useRef<HTMLDivElement>(null);

  const book = books.find((b) => b.id === bookId) ?? books[0];

  useEffect(() => {
    const next = new URLSearchParams(params.toString());
    next.set("book", bookId);
    if (tag) next.set("tag", tag);
    else next.delete("tag");
    router.replace(`/menu?${next.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId, tag]);

  const sections = useMemo(
    () =>
      book.sections
        .map((s) => ({
          ...s,
          items: s.items.filter((it) => {
            if (tag && !it.tags?.includes(tag)) return false;
            if (!q) return true;
            return normalize(`${it.name} ${it.desc ?? ""} ${s.title}`).includes(q);
          }),
        }))
        .filter((s) => s.items.length > 0),
    [book, tag, q],
  );
  const count = sections.reduce((n, s) => n + s.items.length, 0);

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
    railRef.current?.querySelector<HTMLElement>(`[data-id="${active}"]`)?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [active]);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {books.map((b) => (
          <button
            key={b.id}
            onClick={() => setBookId(b.id)}
            className={`btn-shine rounded-full px-5 py-2 text-sm font-semibold uppercase tracking-[0.12em] transition ${
              b.id === bookId ? "bg-candy text-white shadow-lg shadow-candy/30" : "bg-white text-ink ring-1 ring-ink/10 hover:ring-candy"
            }`}
          >
            {b.title} <span className="ml-1 text-[10px] opacity-70">{b.hours}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Rechercher un plat</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Chercher un plat, un ingrédient… (crevettes, mozzarella, bissap)"
            className="w-full rounded-full bg-white px-5 py-3 text-ink shadow-inner ring-1 ring-ink/10 placeholder:text-muted/70 focus:ring-2 focus:ring-candy focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-ink" aria-label="Effacer">✕</button>
          )}
        </label>
        <div className="flex gap-2">
          {TAGS.map((t) => (
            <button
              key={t}
              onClick={() => setTag(tag === t ? null : t)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${tag === t ? "bg-ink text-white" : "bg-white text-ink ring-1 ring-ink/10 hover:ring-ink"}`}
            >
              {TAG_LABEL[t].emoji} {TAG_LABEL[t].label}
            </button>
          ))}
        </div>
      </div>

      <div className="glass sticky top-14 z-30 -mx-5 mt-8 px-5 py-3 md:top-16">
        <div ref={railRef} className="no-scrollbar flex gap-2 overflow-x-auto">
          {sections.map((s) => (
            <a
              key={s.id}
              data-id={s.id}
              href={`#sec-${s.id}`}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap transition ${active === s.id ? "bg-candy text-white shadow" : "text-ink/70 hover:bg-white hover:text-ink"}`}
            >
              {s.title}
            </a>
          ))}
        </div>
      </div>

      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-muted">
        {count} {count > 1 ? "références" : "référence"}
        {q && ` pour « ${query.trim()} »`}
      </p>

      {count === 0 && (
        <div className="mt-10 rounded-3xl bg-white p-10 text-center text-muted shadow">Rien pour cette recherche. Essayez « poulet », « chocolat » ou « rosé ».</div>
      )}

      <div className="mt-4 space-y-14">
        {sections.map((s, si) => (
          <div key={s.id} className="space-y-14">
          {si === 2 && ads.length > 0 && (
            <div className="grid gap-4 md:grid-cols-3">
              {ads.slice(0, 3).map((a, i) => <AdCard key={a.id} post={a} index={i} />)}
            </div>
          )}
          <section id={`sec-${s.id}`} className={`scroll-mt-40 rounded-[2rem] p-5 md:p-8 ${tints[si % tints.length]}`}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-display text-3xl font-extrabold text-ink md:text-4xl">{s.title}</h2>
              {s.tagline && <p className="font-display text-sm italic text-candy">{s.tagline}</p>}
            </div>
            {s.dual && <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted">{s.dual}</p>}
            {s.gallery && (
              <div className="mt-4 flex gap-3 overflow-x-auto no-scrollbar">
                {s.gallery.map((g) => (
                  <span key={g} className="relative h-28 w-40 shrink-0 overflow-hidden rounded-2xl shadow">
                    <Image src={g} alt="" fill sizes="160px" className="object-cover" />
                  </span>
                ))}
              </div>
            )}
            <ul className="mt-6 grid gap-3 md:grid-cols-2">
              {s.items.map((it) => {
                const slug = it.slug ?? slugify(it.name);
                const flat: FlatItem = { ...it, slug, sectionId: s.id, sectionTitle: s.title, bookId: book.id, bookTitle: book.title };
                return (
                  <li key={slug} className={`card-hover group flex gap-4 rounded-3xl bg-white p-3 shadow-sm ring-1 ring-ink/5 ${it.available === false ? "opacity-60" : ""}`}>
                    <Link href={`/menu/${slug}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-marble">
                      {it.photo && <Image src={it.photo} alt="" fill sizes="96px" className="object-cover transition duration-500 group-hover:scale-110" />}
                    </Link>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <Link href={`/menu/${slug}`} className="font-display text-lg font-bold leading-tight text-ink hover:text-candy">
                          {it.name}
                          {it.tags?.map((t) => (
                            <span key={t} className="ml-1.5 text-sm" title={TAG_LABEL[t].label}>{TAG_LABEL[t].emoji}</span>
                          ))}
                        </Link>
                        <span className="shrink-0 whitespace-nowrap font-display font-bold text-candy">{formatPrice(it.price)}</span>
                      </div>
                      {it.desc && <p className="mt-1 line-clamp-2 text-sm leading-snug text-muted">{it.desc}</p>}
                      <div className="mt-2">
                        <AddButton item={flat} dual={s.dual} />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            {s.note && <p className="mt-4 text-xs leading-relaxed text-muted">{s.note}</p>}
          </section>
          </div>
        ))}
      </div>
    </div>
  );
}
