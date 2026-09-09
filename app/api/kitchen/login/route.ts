import { NextResponse } from "next/server";
import { STAFF_COOKIE, db } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { pin } = (await req.json().catch(() => ({}))) as { pin?: string };
  const p = String(pin ?? "").trim();
  if (!/^[0-9]{4,8}$/.test(p)) return NextResponse.json({ error: "PIN : 4 à 8 chiffres" }, { status: 400 });
  const ok = await db.verifyPin(p).catch(() => false);
  if (!ok) return NextResponse.json({ error: "PIN incorrect" }, { status: 401 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(STAFF_COOKIE, p, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 14 });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(STAFF_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
