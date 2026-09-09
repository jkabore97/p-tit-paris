import { NextResponse } from "next/server";
import { STAFF_COOKIE, db } from "@/lib/db";
import { staffPin } from "@/lib/staff";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const pin = await staffPin();
  if (!pin) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { next } = (await req.json().catch(() => ({}))) as { next?: string };
  const n = String(next ?? "").trim();
  if (!/^[0-9]{4,8}$/.test(n)) return NextResponse.json({ error: "Le nouveau PIN doit contenir 4 à 8 chiffres" }, { status: 400 });
  try {
    await db.changePin(pin, n);
    const res = NextResponse.json({ ok: true });
    res.cookies.set(STAFF_COOKIE, n, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 14 });
    return res;
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Erreur" }, { status: 500 });
  }
}
