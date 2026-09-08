import { site } from "./site";

/** Horaires de service (heure locale d'Ouagadougou). */
export const services = [
  { id: "dej" as const, label: "P'tit Déjeuner", start: 6.5, end: 12.5 },
  { id: "diner" as const, label: "Déjeuner & Dîner", start: 12.5, end: 23.5 },
];

export function ouagaNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat("fr-FR", {
    timeZone: site.timeZone,
    hour: "numeric",
    minute: "numeric",
    weekday: "long",
    hour12: false,
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const hour = Number(get("hour")) % 24;
  const minute = Number(get("minute"));
  return { hour, minute, weekday: get("weekday"), decimal: hour + minute / 60 };
}

export function currentService(date = new Date()) {
  const { decimal } = ouagaNow(date);
  const active = services.find((s) => decimal >= s.start && decimal < s.end);
  if (active) return { open: true as const, service: active, until: fmt(active.end) };
  const next = services.find((s) => decimal < s.start) ?? services[0];
  return { open: false as const, service: next, opensAt: fmt(next.start) };
}

function fmt(h: number) {
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  return `${hh}h${mm ? String(mm).padStart(2, "0") : ""}`;
}
