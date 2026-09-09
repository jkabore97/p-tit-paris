import { NextResponse } from "next/server";
import { db, type OrderStatus } from "@/lib/db";
import { staffPin } from "@/lib/staff";

export const runtime = "nodejs";
const STATUSES: OrderStatus[] = ["new", "preparing", "ready", "served", "cancelled"];

export async function POST(req: Request) {
  const pin = await staffPin();
  if (!pin) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id, status } = (await req.json().catch(() => ({}))) as { id?: string; status?: OrderStatus };
  if (!id || !status || !STATUSES.includes(status)) return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
  try {
    return NextResponse.json(await db.setStatus(pin, id, status));
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Erreur" }, { status: 500 });
  }
}
