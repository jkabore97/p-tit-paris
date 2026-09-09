import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { staffPin } from "@/lib/staff";

export const runtime = "nodejs";

export async function GET() {
  const pin = await staffPin();
  if (!pin) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const orders = await db.kitchenOrders(pin);
    return NextResponse.json(orders, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Erreur" }, { status: 500 });
  }
}
