"use client";

import { useMemo, useState } from "react";
import { track } from "@/lib/track";

const slots = ["07:00", "08:00", "09:30", "12:00", "12:30", "13:00", "13:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"];

export function ReservationForm({ whatsapp }: { whatsapp: string }) {
  const today = new Date().toISOString().slice(0, 10);
  const [f, setF] = useState({ name: "", phone: "", date: today, time: "20:00", guests: 2, note: "" });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF({ ...f, [k]: k === "guests" ? Number(e.target.value) : e.target.value });

  const message = useMemo(() => {
    const d = new Date(`${f.date}T12:00:00`).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
    return `Bonjour P'tit Paris, je souhaite réserver une table pour ${f.guests} personne${f.guests > 1 ? "s" : ""} le ${d} à ${f.time.replace(":", "h")}, au nom de ${f.name || "…"}${f.phone ? ` (${f.phone})` : ""}.${f.note ? ` ${f.note}` : ""}`;
  }, [f]);

  const ready = f.name.trim().length > 1 && f.date && f.time && f.guests > 0;
  const wa = whatsapp ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}` : null;
  const [copied, setCopied] = useState(false);

  async function copy() {
    track("reservation", { canal: "copie", couverts: f.guests });
    await navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="grid gap-8 md:grid-cols-[1.1fr_1fr]">
      <form className="space-y-5 rounded-[2rem] bg-white p-6 shadow-xl ring-1 ring-ink/5" onSubmit={(e) => e.preventDefault()}>
        <Field label="Votre nom">
          <input value={f.name} onChange={set("name")} required className={inputCls} placeholder="Prénom et nom" />
        </Field>
        <Field label="Téléphone (optionnel)">
          <input value={f.phone} onChange={set("phone")} className={inputCls} placeholder="+226 …" inputMode="tel" />
        </Field>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Date">
            <input type="date" min={today} value={f.date} onChange={set("date")} className={inputCls} />
          </Field>
          <Field label="Heure">
            <select value={f.time} onChange={set("time")} className={inputCls}>
              {slots.map((s) => (
                <option key={s} value={s} className="text-ink bg-white">
                  {s.replace(":", "h")}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Couverts">
            <input type="number" min={1} max={30} value={f.guests} onChange={set("guests")} className={inputCls} />
          </Field>
        </div>
        <Field label="Une occasion, une allergie, une envie ?">
          <textarea value={f.note} onChange={set("note")} rows={3} className={inputCls} placeholder="Anniversaire, terrasse, chaise haute…" />
        </Field>
      </form>

      <div className="flex flex-col justify-between rounded-[2rem] bg-ink p-6 text-white shadow-2xl">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-honey">Votre demande</p>
          <p className="font-display mt-4 text-2xl leading-snug">{message}</p>
        </div>
        <div className="mt-8 space-y-3">
          {wa ? (
            <a
              onClick={() => ready && track("reservation", { canal: "whatsapp", couverts: f.guests })}
              href={ready ? wa : undefined}
              aria-disabled={!ready}
              target="_blank"
              rel="noreferrer"
              className={`block rounded-full px-6 py-4 text-center text-sm uppercase tracking-[0.2em] text-cream transition ${
                ready ? "bg-[#128C7E] hover:bg-[#075E54]" : "cursor-not-allowed bg-ink/30"
              }`}
            >
              Envoyer sur WhatsApp
            </a>
          ) : (
            <p className="rounded-2xl bg-white/10 p-4 text-sm text-white/80">
              Le bouton WhatsApp s&apos;active dès que <code>NEXT_PUBLIC_WHATSAPP_NUMBER</code> est renseigné sur Vercel. En attendant,
              copiez le message et envoyez-le au restaurant.
            </p>
          )}
          <button
            onClick={copy}
            disabled={!ready}
            className="block w-full rounded-full bg-white px-6 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-ink transition hover:bg-honey disabled:opacity-40"
          >
            {copied ? "Message copié ✓" : "Copier le message"}
          </button>
          <p className="text-center text-xs text-white/50">La réservation est confirmée par l&apos;équipe en retour.</p>
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-2xl bg-marble px-4 py-3 text-ink placeholder:text-muted/70 focus:ring-2 focus:ring-candy focus:outline-none";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.2em] text-muted">{label}</span>
      {children}
    </label>
  );
}
