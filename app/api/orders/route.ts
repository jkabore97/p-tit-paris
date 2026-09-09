import { NextResponse } from "next/server";
import { db, type OrderLine } from "@/lib/db";
import { resolveCartKey } from "@/lib/menu";

export const runtime = "nodejs";

type Body = { table?: number; name?: string; note?: string; lines?: { key: string; qty: number }[] };

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }
  const table = Number(body.table);
  const name = (body.name ?? "").trim();
  if (!Number.isInteger(table) || table < 1 || table > 200) return NextResponse.json({ error: "Numéro de table invalide (1 à 200)" }, { status: 400 });
  if (name.length < 1 || name.length > 60) return NextResponse.json({ error: "Indiquez votre prénom" }, { status: 400 });
  if (!Array.isArray(body.lines) || body.lines.length === 0) return NextResponse.json({ error: "Votre commande est vide" }, { status: 400 });

  // Les prix viennent du serveur, jamais du client.
  const items: OrderLine[] = [];
  for (const l of body.lines.slice(0, 40)) {
    const qty = Math.min(20, Math.max(1, Math.floor(Number(l.qty) || 0)));
    const r = resolveCartKey(String(l.key));
    if (!r) return NextResponse.json({ error: `Plat inconnu : ${l.key}` }, { status: 400 });
    items.push({ key: String(l.key), slug: r.item.slug, name: r.label, qty, price: r.price });
  }
  try {
    const order = await db.placeOrder(table, name, items, body.note?.slice(0, 300));
    return NextResponse.json(order, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Impossible d'envoyer la commande" }, { status: 500 });
  }
}
