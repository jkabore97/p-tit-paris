"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminOp } from "@/lib/admin-client";
import { formatPrice } from "@/lib/menu";
import { POST_KIND_LABEL, type Post, type PostKind } from "@/lib/types";
import { ImagePicker } from "./ImagePicker";
import { Badge, Btn, Card, Field, Input, Modal, PageHeader, Select, Textarea, Toggle, useToast } from "./ui";

type Form = { id?: string; kind: PostKind; title: string; body: string; image: string | null; link: string; cta: string; price: string; starts_at: string; ends_at: string; active: boolean };
const KINDS: { k: PostKind; hint: string; emoji: string }[] = [
  { k: "plat_du_jour", emoji: "☀️", hint: "Grande carte commandable en haut de la carte et de la commande à table. Un seul à la fois suffit." },
  { k: "annonce", emoji: "📣", hint: "Bandeau défilant sous le menu du site : horaires, fermeture, événement, nouveauté." },
  { k: "partenaire", emoji: "🤝", hint: "Logo et nom dans la rangée « Ils nous accompagnent » de l'accueil." },
  { k: "pub", emoji: "✨", hint: "Carte sponsorisée (image, titre, lien) sur l'accueil et au fil de la carte." },
];
const empty = (kind: PostKind): Form => ({ kind, title: "", body: "", image: null, link: "", cta: "", price: "", starts_at: "", ends_at: "", active: true });
const today = () => new Date().toISOString().slice(0, 10);

export function PostsEditor({ initial, openNew }: { initial: Post[]; openNew: PostKind | null }) {
  const toast = useToast();
  const router = useRouter();
  const [tab, setTab] = useState<PostKind | "all">("all");
  const [form, setForm] = useState<Form | null>(openNew ? { ...empty(openNew), starts_at: openNew === "plat_du_jour" ? today() : "", ends_at: openNew === "plat_du_jour" ? today() : "" } : null);
  const [busy, setBusy] = useState(false);

  const posts = initial.filter((p) => tab === "all" || p.kind === tab);
  const isLive = (p: Post) => p.active && (!p.starts_at || p.starts_at <= today()) && (!p.ends_at || p.ends_at >= today());

  async function run(label: string, fn: () => Promise<unknown>) {
    setBusy(true);
    try { await fn(); toast(label); router.refresh(); return true; } catch (err) { toast(err instanceof Error ? err.message : "Erreur", "err"); return false; } finally { setBusy(false); }
  }
  const edit = (p: Post) => setForm({ id: p.id, kind: p.kind, title: p.title, body: p.body ?? "", image: p.image, link: p.link ?? "", cta: p.cta ?? "", price: p.price != null ? String(p.price) : "", starts_at: p.starts_at ?? "", ends_at: p.ends_at ?? "", active: p.active });
  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    const ok = await run(form.id ? "Enregistré" : "Publié", () => adminOp("post_upsert", { ...form, price: form.price === "" ? null : Number(form.price) }));
    if (ok) setForm(null);
  }

  return (
    <div>
      <PageHeader title="Annonces & pubs" sub="Plat du jour, annonces, partenaires et publicités. Chaque élément a une période d'affichage optionnelle.">
        {KINDS.map((k) => (
          <Btn key={k.k} variant={k.k === "plat_du_jour" ? "primary" : "soft"} onClick={() => setForm({ ...empty(k.k), starts_at: k.k === "plat_du_jour" ? today() : "", ends_at: k.k === "plat_du_jour" ? today() : "" })}>
            {k.emoji} {POST_KIND_LABEL[k.k]}
          </Btn>
        ))}
      </PageHeader>

      <div className="mb-5 flex flex-wrap gap-2">
        {(["all", ...KINDS.map((k) => k.k)] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${tab === t ? "bg-ink text-white" : "bg-white text-ink ring-1 ring-ink/10 hover:ring-ink"}`}>
            {t === "all" ? `Tout (${initial.length})` : `${POST_KIND_LABEL[t]} (${initial.filter((p) => p.kind === t).length})`}
          </button>
        ))}
      </div>

      {posts.length === 0 ? (
        <Card>
          <p className="text-sm text-muted">Rien ici pour l&apos;instant.</p>
          <ul className="mt-3 space-y-1 text-sm text-ink/80">{KINDS.map((k) => <li key={k.k}><b>{k.emoji} {POST_KIND_LABEL[k.k]}</b> — {k.hint}</li>)}</ul>
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((p) => (
            <Card key={p.id} className={`flex gap-4 ${p.active ? "" : "opacity-60"}`}>
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-marble">
                {p.image ? <Image src={p.image} alt="" fill sizes="96px" className="object-cover" unoptimized={p.image.startsWith("http")} /> : <span className="grid h-full place-items-center text-3xl">{KINDS.find((k) => k.k === p.kind)?.emoji}</span>}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge tone="wine">{POST_KIND_LABEL[p.kind]}</Badge>
                  {isLive(p) ? <Badge tone="ok">En ligne</Badge> : <Badge tone="warn">{p.active ? "Hors période" : "Désactivé"}</Badge>}
                </div>
                <p className="font-display mt-1 truncate text-lg font-bold text-ink">{p.title}</p>
                {p.body && <p className="line-clamp-2 text-xs text-muted">{p.body}</p>}
                <p className="mt-1 text-xs text-muted">
                  {p.price != null && <span className="font-semibold text-candy">{formatPrice(p.price)} · </span>}
                  {p.starts_at || p.ends_at ? `${p.starts_at ?? "…"} → ${p.ends_at ?? "…"}` : "Sans date"}
                </p>
                <div className="mt-2 flex gap-1">
                  <Toggle checked={p.active} onChange={(v) => run(v ? "Activé" : "Désactivé", () => adminOp("post_upsert", { id: p.id, active: v }))} />
                  <Btn variant="ghost" onClick={() => edit(p)}>Modifier</Btn>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={form !== null} onClose={() => setForm(null)} title={form?.id ? "Modifier" : `Nouveau · ${form ? POST_KIND_LABEL[form.kind] : ""}`} wide>
        {form && (
          <form onSubmit={save} className="space-y-4">
            <p className="rounded-2xl bg-marble px-4 py-2 text-xs text-muted">{KINDS.find((k) => k.k === form.kind)?.hint}</p>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Type"><Select value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value as PostKind })}>{KINDS.map((k) => <option key={k.k} value={k.k}>{k.emoji} {POST_KIND_LABEL[k.k]}</option>)}</Select></Field>
              {form.kind === "plat_du_jour" ? (
                <Field label="Prix (F)" hint="Rend le plat commandable à table."><Input type="number" min={0} step={50} inputMode="numeric" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></Field>
              ) : (
                <Field label="Texte du bouton" hint="Ex. « Réserver », « Découvrir »"><Input value={form.cta} onChange={(e) => setForm({ ...form, cta: e.target.value })} /></Field>
              )}
              <Field label="Titre" className="md:col-span-2"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required autoFocus /></Field>
              <Field label="Texte" className="md:col-span-2"><Textarea rows={3} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} /></Field>
              <Field label="Lien (optionnel)" className="md:col-span-2" hint="Page du site (/reserver) ou adresse externe (https://…)."><Input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} /></Field>
              <Field label="Du"><Input type="date" value={form.starts_at} onChange={(e) => setForm({ ...form, starts_at: e.target.value })} /></Field>
              <Field label="Au"><Input type="date" value={form.ends_at} onChange={(e) => setForm({ ...form, ends_at: e.target.value })} /></Field>
            </div>
            <ImagePicker value={form.image} onChange={(image) => setForm({ ...form, image })} label={form.kind === "partenaire" ? "Logo" : "Image"} />
            <Toggle checked={form.active} onChange={(v) => setForm({ ...form, active: v })} label="Actif" />
            <div className="flex items-center justify-between border-t border-ink/10 pt-4">
              {form.id ? <Btn type="button" variant="danger" onClick={async () => { if (confirm("Supprimer ?")) { const ok = await run("Supprimé", () => adminOp("post_delete", { id: form.id })); if (ok) setForm(null); } }}>Supprimer</Btn> : <span />}
              <div className="flex gap-2">
                <Btn type="button" variant="ghost" onClick={() => setForm(null)}>Annuler</Btn>
                <Btn disabled={busy || !form.title.trim()}>{busy ? "…" : form.id ? "Enregistrer" : "Publier"}</Btn>
              </div>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
