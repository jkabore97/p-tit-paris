import { NextResponse } from "next/server";
import { ADMIN_COOKIE, db } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { password } = (await req.json().catch(() => ({}))) as { password?: string };
  const p = String(password ?? "").trim();
  if (p.length < 4) return NextResponse.json({ error: "Mot de passe trop court" }, { status: 400 });
  const ok = await db.adminVerify(p).catch(() => false);
  if (!ok) return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, p, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 12 });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
