"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { adminOp, uploadMedia } from "@/lib/admin-client";
import type { MediaInfo } from "@/lib/types";
import { Btn, Input, Modal, useToast } from "./ui";

/** Choix d'une image : téléversement, bibliothèque des photos existantes, ou URL. */
export function ImagePicker({ value, onChange, label = "Photo" }: { value: string | null; onChange: (url: string | null) => void; label?: string }) {
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [lib, setLib] = useState(false);
  const [url, setUrl] = useState(false);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusy(true);
    try {
      const r = await uploadMedia(f);
      onChange(r.url);
      toast(`Photo ajoutée (${Math.round(r.size / 1024)} Ko)`);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Téléversement impossible", "err");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">{label}</span>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative h-24 w-32 overflow-hidden rounded-2xl bg-marble ring-1 ring-ink/10">
          {value ? <Image src={value} alt="" fill sizes="128px" className="object-cover" unoptimized={value.startsWith("http")} /> : <span className="grid h-full place-items-center text-2xl text-muted/40">🍽️</span>}
        </div>
        <div className="flex flex-wrap gap-2">
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
          <Btn type="button" variant="soft" onClick={() => fileRef.current?.click()} disabled={busy}>{busy ? "Envoi…" : "⬆ Téléverser"}</Btn>
          <Btn type="button" variant="soft" onClick={() => setLib(true)}>🖼 Bibliothèque</Btn>
          <Btn type="button" variant="ghost" onClick={() => setUrl((u) => !u)}>Lien</Btn>
          {value && <Btn type="button" variant="danger" onClick={() => onChange(null)}>Retirer</Btn>}
        </div>
      </div>
      {url && <Input className="mt-2" placeholder="https://… ou /photos/nom.jpg" defaultValue={value ?? ""} onBlur={(e) => onChange(e.target.value.trim() || null)} />}
      <MediaLibraryModal open={lib} onClose={() => setLib(false)} onPick={(u) => { onChange(u); setLib(false); }} />
    </div>
  );
}

/** Photos existantes : celles de la carte imprimée (public/photos) et celles téléversées (/media). */
export function MediaLibraryModal({ open, onClose, onPick }: { open: boolean; onClose: () => void; onPick: (url: string) => void }) {
  const [media, setMedia] = useState<MediaInfo[] | null>(null);
  const [q, setQ] = useState("");
  useEffect(() => {
    if (open) adminOp<MediaInfo[]>("media").then(setMedia).catch(() => setMedia([]));
  }, [open]);
  const bundled = BUNDLED_PHOTOS.filter((p) => p.includes(q.toLowerCase()));
  const uploaded = (media ?? []).filter((m) => m.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <Modal open={open} onClose={onClose} title="Bibliothèque de photos" wide>
      <Input placeholder="Filtrer…" value={q} onChange={(e) => setQ(e.target.value)} />
      {uploaded.length > 0 && (
        <>
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Téléversées</p>
          <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
            {uploaded.map((m) => (
              <button key={m.id} onClick={() => onPick(`/media/${m.id}`)} className="group relative aspect-square overflow-hidden rounded-xl bg-marble ring-2 ring-transparent hover:ring-candy">
                <Image src={`/media/${m.id}`} alt={m.name} fill sizes="120px" className="object-cover" />
                <span className="absolute inset-x-0 bottom-0 truncate bg-white/85 px-1.5 py-0.5 text-[10px] text-ink">{m.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Photos de la carte</p>
      <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
        {bundled.map((p) => (
          <button key={p} onClick={() => onPick(`/photos/${p}.jpg`)} className="group relative aspect-square overflow-hidden rounded-xl bg-marble ring-2 ring-transparent hover:ring-candy">
            <Image src={`/photos/${p}.jpg`} alt={p} fill sizes="120px" className="object-cover" />
            <span className="absolute inset-x-0 bottom-0 truncate bg-white/85 px-1.5 py-0.5 text-[10px] text-ink">{p}</span>
          </button>
        ))}
      </div>
    </Modal>
  );
}

export const BUNDLED_PHOTOS = [
  "affogato","ailes-de-poulet","aperol-spritz","assiette-chawarma-boeuf","assiette-chawarma-poulet","blue-marguarita","boeuf-milanaise","brochettes","brownies","bubble-teas","chawarma-poulet","cheezy-pizza-burger","combo-2-personnes","crepe-boeuf-curry","crepe-jambon-fromage","crepe-nutella","crepe-submarine","espresso-martini","feta-quinoa-betterave","fettucine-trois-chocolats","lattes","limonades","mac-and-cheese-burger","manaiches-spread","manouche-kebab","manouche-viande","manouche-zaatar","mille-feuilles-merguez","nachos","nems","nuggets","oeuf-benedicte","omelette-au-four","pain-perdu-tropical","patate-douce-poulet-bbq","petit-dejeuner-oriental","pizza-fruits-de-mer","pizza-pepperoni","pizza-poulet-alfredo","pizza-vegetarienne","poitrine-de-boeuf-48h","pork-ribs-merguez","potsticker","poulet-broasted","poulet-milanais","poulet-wellington","poutine","profiterole","quesadillas","ranchero","ravioli-betterave","ribs-bbq-burger","riz-cantonais","salade-boeuf-thai","salade-de-fruits","salade-tortellini","sandwich-roti-de-boeuf","sandwich-saumon","sap-sap-salade","smoothies","stylish-bolognaise","tartine-filet-de-boeuf","tenders","tortellini-fruits-de-mer","wines",
];
