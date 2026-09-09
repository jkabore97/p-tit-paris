"use client";

import type { AdminOp } from "./db";

/** Appel d'une opération du centre de contrôle. Lève une erreur lisible en cas d'échec. */
export async function adminOp<T = unknown>(op: AdminOp, payload: Record<string, unknown> = {}): Promise<T> {
  const r = await fetch("/api/admin/op", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ op, payload }) });
  const data = (await r.json().catch(() => ({}))) as { result?: T; error?: string };
  if (!r.ok) throw new Error(data.error ?? `Erreur ${r.status}`);
  return data.result as T;
}

export async function uploadMedia(file: File): Promise<{ id: string; url: string; size: number }> {
  const fd = new FormData();
  fd.append("file", file);
  const r = await fetch("/api/admin/media", { method: "POST", body: fd });
  const data = (await r.json().catch(() => ({}))) as { id?: string; url?: string; size?: number; error?: string };
  if (!r.ok || !data.url) throw new Error(data.error ?? "Téléversement impossible");
  return { id: data.id!, url: data.url, size: data.size ?? 0 };
}
