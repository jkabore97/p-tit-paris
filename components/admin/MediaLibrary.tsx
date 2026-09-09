"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { adminOp, uploadMedia } from "@/lib/admin-client";
import type { MediaInfo } from "@/lib/types";
import { Btn, Card, PageHeader, useToast } from "./ui";

export function MediaLibrary({ initial }: { initial: MediaInfo[] }) {
  const toast = useToast();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);

  async function upload(files: FileList | File[]) {
    setBusy(true);
    let n = 0;
    for (const f of Array.from(files)) {
      try { await uploadMedia(f); n++; } catch (err) { toast(`${f.name} : ${err instanceof Error ? err.message : "erreur"}`, "err"); }
    }
    setBusy(false);
    if (n) { toast(`${n} photo(s) ajoutée(s)`); router.refresh(); }
  }
  async function remove(m: MediaInfo) {
    if (!confirm(`Supprimer « ${m.name} » ? Les plats qui l'utilisent perdront leur photo.`)) return;
    try { await adminOp("media_delete", { id: m.id }); toast("Photo supprimée"); router.refresh(); } catch (err) { toast(err instanceof Error ? err.message : "Erreur", "err"); }
  }
  function copy(url: string) {
    navigator.clipboard.writeText(url).then(() => toast("Lien copié"));
  }

  return (
    <div>
      <PageHeader title="Photos" sub="Toutes les images téléversées. Elles sont redimensionnées automatiquement (1600 px max).">
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && upload(e.target.files)} />
        <Btn onClick={() => fileRef.current?.click()} disabled={busy}>{busy ? "Envoi…" : "⬆ Téléverser"}</Btn>
      </PageHeader>
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); upload(e.dataTransfer.files); }}
        className={`mb-6 rounded-[1.75rem] border-2 border-dashed p-8 text-center text-sm transition ${drag ? "border-candy bg-candy-soft/50 text-candy" : "border-ink/15 text-muted"}`}
      >
        Glissez-déposez des photos ici, ou utilisez le bouton Téléverser.
      </div>
      {initial.length === 0 ? (
        <Card><p className="text-sm text-muted">Aucune photo téléversée pour l&apos;instant. Les photos de la carte imprimée restent disponibles dans la bibliothèque des éditeurs.</p></Card>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {initial.map((m) => (
            <div key={m.id} className="group overflow-hidden rounded-2xl bg-white shadow ring-1 ring-ink/5">
              <div className="relative aspect-square bg-marble">
                <Image src={`/media/${m.id}`} alt={m.name} fill sizes="240px" className="object-cover" />
              </div>
              <div className="p-2.5">
                <p className="truncate text-xs font-medium text-ink">{m.name}</p>
                <p className="text-[10px] text-muted">{Math.round(m.size / 1024)} Ko</p>
                <div className="mt-1.5 flex gap-1">
                  <button onClick={() => copy(`/media/${m.id}`)} className="rounded-full bg-marble px-2 py-0.5 text-[11px] font-semibold text-ink hover:bg-wood/60">Copier</button>
                  <button onClick={() => remove(m)} className="rounded-full px-2 py-0.5 text-[11px] font-semibold text-candy hover:bg-candy-soft">Supprimer</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
