"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { adminOp } from "@/lib/admin-client";
import { BOOK_META, BOOK_IDS, formatPrice, TAG_LABEL, type Book, type DbItem, type DbSection, type Tag } from "@/lib/menu";
import { ImagePicker } from "./ImagePicker";
import { Badge, Btn, Card, Field, Input, Modal, PageHeader, Select, Textarea, Toggle, useToast } from "./ui";

type ItemForm = { id?: string; section_id: string; name: string; description: string; price: string; price2: string; tags: Tag[]; photo: string | null; available: boolean; visible: boolean };
type SectionForm = { id?: string; title: string; books: Book["id"][]; tagline: string; note: string; dual: string; visible: boolean };

const emptyItem = (section_id: string): ItemForm => ({ section_id, name: "", description: "", price: "", price2: "", tags: [], photo: null, available: true, visible: true });
const emptySection = (): SectionForm => ({ title: "", books: ["diner"], tagline: "", note: "", dual: "", visible: true });

export function MenuEditor({ initial, openNew = false }: { initial: DbSection[]; openNew?: boolean }) {
  const toast = useToast();
  const router = useRouter();
  const sections = useMemo(() => [...initial].sort((a, b) => a.position - b.position), [initial]);
  const [q, setQ] = useState("");
  const [bookFilter, setBookFilter] = useState<Book["id"] | "all">("all");
  const [openSec, setOpenSec] = useState<Set<string>>(() => new Set(sections.slice(0, 2).map((s) => s.id)));
  const [item, setItem] = useState<ItemForm | null>(openNew ? emptyItem(sections[0]?.id ?? "") : null);
  const [section, setSection] = useState<SectionForm | null>(null);
  const [busy, setBusy] = useState(false);

  const nq = q.trim().toLowerCase();
  const shown = sections
    .filter((s) => bookFilter === "all" || s.books.includes(bookFilter))
    .map((s) => ({ ...s, items: nq ? s.items.filter((i) => `${i.name} ${i.description ?? ""}`.toLowerCase().includes(nq)) : [...s.items].sort((a, b) => a.position - b.position) }))
    .filter((s) => !nq || s.items.length > 0 || s.title.toLowerCase().includes(nq));

  async function run(label: string, fn: () => Promise<unknown>) {
    setBusy(true);
    try {
      await fn();
      toast(label);
      router.refresh();
      return true;
    } catch (err) {
      toast(err instanceof Error ? err.message : "Erreur", "err");
      return false;
    } finally {
      setBusy(false);
    }
  }

  const toggleSec = (id: string) =>
    setOpenSec((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  const editItem = (s: DbSection, i: DbItem) => setItem({ id: i.id, section_id: s.id, name: i.name, description: i.description ?? "", price: String(i.price), price2: i.price2 != null ? String(i.price2) : "", tags: i.tags as Tag[], photo: i.photo, available: i.available, visible: i.visible });
  const editSection = (s: DbSection) => setSection({ id: s.id, title: s.title, books: s.books, tagline: s.tagline ?? "", note: s.note ?? "", dual: s.dual ?? "", visible: s.visible });

  async function saveItem(e: React.FormEvent) {
    e.preventDefault();
    if (!item) return;
    const ok = await run(item.id ? "Plat modifié" : "Plat ajouté", () =>
      adminOp("item_upsert", { ...item, price: Number(item.price), price2: item.price2 === "" ? null : Number(item.price2), description: item.description || null, photo: item.photo }),
    );
    if (ok) setItem(null);
  }
  async function saveSection(e: React.FormEvent) {
    e.preventDefault();
    if (!section) return;
    const ok = await run(section.id ? "Rubrique modifiée" : "Rubrique ajoutée", () => adminOp("section_upsert", section));
    if (ok) setSection(null);
  }
  async function moveSection(i: number, dir: -1 | 1) {
    const ids = sections.map((s) => s.id);
    const j = i + dir;
    if (j < 0 || j >= ids.length) return;
    [ids[i], ids[j]] = [ids[j], ids[i]];
    await run("Ordre mis à jour", () => adminOp("reorder_sections", { ids }));
  }
  async function moveItem(s: DbSection, i: number, dir: -1 | 1) {
    const ids = [...s.items].sort((a, b) => a.position - b.position).map((x) => x.id);
    const j = i + dir;
    if (j < 0 || j >= ids.length) return;
    [ids[i], ids[j]] = [ids[j], ids[i]];
    await run("Ordre mis à jour", () => adminOp("reorder_items", { ids }));
  }

  return (
    <div>
      <PageHeader title="La carte" sub={`${sections.length} rubriques · ${sections.reduce((n, s) => n + s.items.length, 0)} plats. Les changements sont en ligne immédiatement.`}>
        <Btn variant="soft" onClick={() => setSection(emptySection())}>+ Rubrique</Btn>
        <Btn onClick={() => setItem(emptyItem(sections[0]?.id ?? ""))}>+ Ajouter un plat</Btn>
      </PageHeader>

      <div className="mb-5 flex flex-col gap-3 md:flex-row">
        <Input placeholder="Chercher un plat…" value={q} onChange={(e) => setQ(e.target.value)} className="bg-white md:max-w-sm" />
        <div className="flex flex-wrap gap-2">
          {(["all", ...BOOK_IDS] as const).map((b) => (
            <button key={b} onClick={() => setBookFilter(b)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${bookFilter === b ? "bg-ink text-white" : "bg-white text-ink ring-1 ring-ink/10 hover:ring-ink"}`}>
              {b === "all" ? "Toutes les cartes" : BOOK_META[b].title}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {shown.map((s) => {
          const idx = sections.findIndex((x) => x.id === s.id);
          const open = openSec.has(s.id) || Boolean(nq);
          return (
            <Card key={s.id} className={`p-0 ${s.visible ? "" : "opacity-60"}`}>
              <div className="flex flex-wrap items-center gap-3 p-4">
                <button onClick={() => toggleSec(s.id)} className="grid h-8 w-8 place-items-center rounded-full bg-marble text-sm text-ink" aria-label="Déplier">{open ? "−" : "+"}</button>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-lg font-bold text-ink">{s.title}</h2>
                    {s.books.map((b) => <Badge key={b}>{BOOK_META[b].title}</Badge>)}
                    {!s.visible && <Badge tone="warn">Masquée</Badge>}
                    <span className="text-xs text-muted">{s.items.length} plat(s)</span>
                  </div>
                  {s.tagline && <p className="text-xs italic text-muted">{s.tagline}</p>}
                </div>
                <div className="flex gap-1">
                  <Btn variant="ghost" onClick={() => moveSection(idx, -1)} disabled={busy || idx === 0} aria-label="Monter">↑</Btn>
                  <Btn variant="ghost" onClick={() => moveSection(idx, 1)} disabled={busy || idx === sections.length - 1} aria-label="Descendre">↓</Btn>
                  <Btn variant="soft" onClick={() => setItem(emptyItem(s.id))}>+ Plat</Btn>
                  <Btn variant="ghost" onClick={() => editSection(s)}>Modifier</Btn>
                </div>
              </div>
              {open && (
                <ul className="divide-y divide-ink/5 border-t border-ink/5">
                  {s.items.length === 0 && <li className="px-4 py-3 text-sm text-muted">Aucun plat dans cette rubrique.</li>}
                  {s.items.map((it, i) => (
                    <li key={it.id} className={`flex items-center gap-3 px-4 py-2.5 ${it.visible ? "" : "opacity-50"}`}>
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-marble">
                        {it.photo && <Image src={it.photo} alt="" fill sizes="48px" className="object-cover" unoptimized={it.photo.startsWith("http")} />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-ink">
                          {it.name} {it.tags.map((t) => <span key={t} className="ml-1 text-xs">{TAG_LABEL[t as Tag]?.emoji}</span>)}
                          {!it.available && <span className="ml-2 rounded-full bg-candy px-2 py-0.5 text-[10px] font-semibold uppercase text-white">Épuisé</span>}
                          {!it.visible && <span className="ml-2 rounded-full bg-marble px-2 py-0.5 text-[10px] font-semibold uppercase text-muted">Masqué</span>}
                        </p>
                        <p className="truncate text-xs text-muted">{it.description || "—"}</p>
                      </div>
                      <span className="hidden whitespace-nowrap text-sm font-bold text-candy sm:block">{formatPrice(it.price2 != null ? [it.price, it.price2] : it.price)}</span>
                      <div className="flex items-center gap-1">
                        <Toggle checked={it.available} onChange={(v) => run(v ? "De retour à la carte" : "Marqué épuisé", () => adminOp("item_toggle", { id: it.id, available: v }))} />
                        <Btn variant="ghost" onClick={() => moveItem(s, i, -1)} disabled={busy || i === 0 || Boolean(nq)} aria-label="Monter">↑</Btn>
                        <Btn variant="ghost" onClick={() => moveItem(s, i, 1)} disabled={busy || i === s.items.length - 1 || Boolean(nq)} aria-label="Descendre">↓</Btn>
                        <Btn variant="ghost" onClick={() => editItem(s, it)}>Modifier</Btn>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          );
        })}
      </div>

      {/* ------------------------------------------------ plat */}
      <Modal open={item !== null} onClose={() => setItem(null)} title={item?.id ? "Modifier le plat" : "Nouveau plat"} wide>
        {item && (
          <form onSubmit={saveItem} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Nom" className="md:col-span-2"><Input value={item.name} onChange={(e) => setItem({ ...item, name: e.target.value })} required autoFocus /></Field>
              <Field label="Rubrique">
                <Select value={item.section_id} onChange={(e) => setItem({ ...item, section_id: e.target.value })}>
                  {sections.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
                </Select>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Prix (F)"><Input type="number" min={0} step={50} inputMode="numeric" value={item.price} onChange={(e) => setItem({ ...item, price: e.target.value })} required /></Field>
                <Field label="2e prix (F)" hint="Grande / bouteille"><Input type="number" min={0} step={50} inputMode="numeric" value={item.price2} onChange={(e) => setItem({ ...item, price2: e.target.value })} /></Field>
              </div>
              <Field label="Description" className="md:col-span-2"><Textarea rows={2} value={item.description} onChange={(e) => setItem({ ...item, description: e.target.value })} placeholder="Ingrédients, accompagnements…" /></Field>
            </div>
            <ImagePicker value={item.photo} onChange={(photo) => setItem({ ...item, photo })} />
            <div className="flex flex-wrap gap-2">
              {(Object.keys(TAG_LABEL) as Tag[]).map((t) => {
                const on = item.tags.includes(t);
                return (
                  <button type="button" key={t} onClick={() => setItem({ ...item, tags: on ? item.tags.filter((x) => x !== t) : [...item.tags, t] })} className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${on ? "bg-ink text-white" : "bg-marble text-ink hover:bg-wood/60"}`}>
                    {TAG_LABEL[t].emoji} {TAG_LABEL[t].label}
                  </button>
                );
              })}
            </div>
            <div className="flex flex-wrap gap-6">
              <Toggle checked={item.available} onChange={(v) => setItem({ ...item, available: v })} label="Disponible aujourd'hui" />
              <Toggle checked={item.visible} onChange={(v) => setItem({ ...item, visible: v })} label="Visible sur la carte" />
            </div>
            <div className="flex items-center justify-between border-t border-ink/10 pt-4">
              {item.id ? (
                <Btn type="button" variant="danger" onClick={async () => { if (confirm(`Supprimer « ${item.name} » ?`)) { const ok = await run("Plat supprimé", () => adminOp("item_delete", { id: item.id })); if (ok) setItem(null); } }}>Supprimer</Btn>
              ) : <span />}
              <div className="flex gap-2">
                <Btn type="button" variant="ghost" onClick={() => setItem(null)}>Annuler</Btn>
                <Btn disabled={busy || !item.name.trim() || item.price === ""}>{busy ? "…" : "Enregistrer"}</Btn>
              </div>
            </div>
          </form>
        )}
      </Modal>

      {/* ------------------------------------------------ rubrique */}
      <Modal open={section !== null} onClose={() => setSection(null)} title={section?.id ? "Modifier la rubrique" : "Nouvelle rubrique"}>
        {section && (
          <form onSubmit={saveSection} className="space-y-4">
            <Field label="Titre"><Input value={section.title} onChange={(e) => setSection({ ...section, title: e.target.value })} required autoFocus /></Field>
            <div>
              <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Apparaît dans</span>
              <div className="flex flex-wrap gap-2">
                {BOOK_IDS.map((b) => {
                  const on = section.books.includes(b);
                  return (
                    <button type="button" key={b} onClick={() => setSection({ ...section, books: on ? section.books.filter((x) => x !== b) : [...section.books, b] })} className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${on ? "bg-ink text-white" : "bg-marble text-ink hover:bg-wood/60"}`}>
                      {BOOK_META[b].title}
                    </button>
                  );
                })}
              </div>
            </div>
            <Field label="Accroche" hint="Petite phrase en italique à côté du titre."><Input value={section.tagline} onChange={(e) => setSection({ ...section, tagline: e.target.value })} /></Field>
            <Field label="Libellé des deux prix" hint="Ex. « Moyenne / Grande » ou « Verre / Bouteille » si les plats ont deux prix."><Input value={section.dual} onChange={(e) => setSection({ ...section, dual: e.target.value })} /></Field>
            <Field label="Note en bas de rubrique" hint="Suppléments, sauces au choix…"><Textarea rows={2} value={section.note} onChange={(e) => setSection({ ...section, note: e.target.value })} /></Field>
            <Toggle checked={section.visible} onChange={(v) => setSection({ ...section, visible: v })} label="Visible sur la carte" />
            <div className="flex items-center justify-between border-t border-ink/10 pt-4">
              {section.id ? (
                <Btn type="button" variant="danger" onClick={async () => { if (confirm(`Supprimer la rubrique « ${section.title} » et tous ses plats ?`)) { const ok = await run("Rubrique supprimée", () => adminOp("section_delete", { id: section.id })); if (ok) setSection(null); } }}>Supprimer</Btn>
              ) : <span />}
              <div className="flex gap-2">
                <Btn type="button" variant="ghost" onClick={() => setSection(null)}>Annuler</Btn>
                <Btn disabled={busy || !section.title.trim() || section.books.length === 0}>{busy ? "…" : "Enregistrer"}</Btn>
              </div>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
