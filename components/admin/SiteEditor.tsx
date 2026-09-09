"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminOp } from "@/lib/admin-client";
import type { SiteData, Social } from "@/lib/types";
import { Btn, Card, Field, Input, PageHeader, Textarea, useToast } from "./ui";

const PRESETS = ["Facebook", "Instagram", "TikTok", "Snapchat", "WhatsApp", "YouTube", "X", "LinkedIn", "Site web"];

export function SiteEditor({ initial }: { initial: SiteData }) {
  const toast = useToast();
  const router = useRouter();
  const [d, setD] = useState<SiteData>({ ...initial, socials: initial.socials ?? [] });
  const [busy, setBusy] = useState(false);
  const socials = d.socials ?? [];
  const setSocial = (i: number, patch: Partial<Social>) => setD({ ...d, socials: socials.map((s, j) => (j === i ? { ...s, ...patch } : s)) });
  const move = (i: number, dir: -1 | 1) => {
    const arr = [...socials]; const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    setD({ ...d, socials: arr });
  };

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await adminOp("site_set", { ...d, whatsapp: d.whatsapp?.replace(/\D/g, ""), socials: socials.filter((s) => s.label.trim() && s.href.trim()) });
      toast("Infos enregistrées");
      router.refresh();
    } catch (err) { toast(err instanceof Error ? err.message : "Erreur", "err"); } finally { setBusy(false); }
  }

  return (
    <form onSubmit={save}>
      <PageHeader title="Infos & réseaux" sub="Ce qui apparaît dans le pied de page, la réservation et les partages.">
        <Btn disabled={busy}>{busy ? "…" : "Enregistrer"}</Btn>
      </PageHeader>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-4">
          <h2 className="font-display text-xl font-bold text-ink">Le restaurant</h2>
          <Field label="Devise"><Input value={d.tagline ?? ""} onChange={(e) => setD({ ...d, tagline: e.target.value })} placeholder="Le pari de vous faire plaisir" /></Field>
          <Field label="WhatsApp (réservations)" hint="Format international sans le +, ex. 22670000000. Active le bouton WhatsApp de la page Réserver."><Input inputMode="tel" value={d.whatsapp ?? ""} onChange={(e) => setD({ ...d, whatsapp: e.target.value })} placeholder="22670000000" /></Field>
          <Field label="Téléphone affiché"><Input value={d.phone ?? ""} onChange={(e) => setD({ ...d, phone: e.target.value })} placeholder="+226 70 00 00 00" /></Field>
          <Field label="Adresse"><Input value={d.address ?? ""} onChange={(e) => setD({ ...d, address: e.target.value })} placeholder="Gounghin, Ouagadougou, Burkina Faso" /></Field>
          <Field label="Horaires (texte libre)"><Textarea rows={2} value={d.hours ?? ""} onChange={(e) => setD({ ...d, hours: e.target.value })} placeholder="Petit-déjeuner dès 6h30, déjeuner et dîner, pâtisserie, cocktails et cave jusque tard." /></Field>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-ink">Réseaux sociaux</h2>
            <Btn type="button" variant="soft" onClick={() => setD({ ...d, socials: [...socials, { label: "Instagram", handle: "", href: "" }] })}>+ Ajouter</Btn>
          </div>
          <ul className="mt-4 space-y-3">
            {socials.length === 0 && <li className="text-sm text-muted">Aucun réseau. Ajoutez Instagram, TikTok, Facebook…</li>}
            {socials.map((s, i) => (
              <li key={i} className="rounded-2xl bg-marble p-3">
                <div className="grid gap-2 sm:grid-cols-[1fr_1fr]">
                  <Input list="social-presets" value={s.label} onChange={(e) => setSocial(i, { label: e.target.value })} placeholder="Réseau" className="bg-white" />
                  <Input value={s.handle} onChange={(e) => setSocial(i, { handle: e.target.value })} placeholder="@compte" className="bg-white" />
                  <Input value={s.href} onChange={(e) => setSocial(i, { href: e.target.value })} placeholder="https://…" className="bg-white sm:col-span-2" />
                </div>
                <div className="mt-2 flex justify-end gap-1">
                  <Btn type="button" variant="ghost" onClick={() => move(i, -1)} aria-label="Monter">↑</Btn>
                  <Btn type="button" variant="ghost" onClick={() => move(i, 1)} aria-label="Descendre">↓</Btn>
                  <Btn type="button" variant="danger" onClick={() => setD({ ...d, socials: socials.filter((_, j) => j !== i) })}>Retirer</Btn>
                </div>
              </li>
            ))}
          </ul>
          <datalist id="social-presets">{PRESETS.map((p) => <option key={p} value={p} />)}</datalist>
        </Card>
      </div>
    </form>
  );
}
