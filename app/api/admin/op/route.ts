import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, db, type AdminOp } from "@/lib/db";
import { bustContentCache } from "@/lib/content";
import { adminPassword } from "@/lib/staff";

export const runtime = "nodejs";

const OPS: AdminOp[] = ["menu", "section_upsert", "section_delete", "item_upsert", "item_delete", "item_toggle", "reorder_sections", "reorder_items", "posts", "post_upsert", "post_delete", "site", "site_set", "media", "media_delete", "set_password", "set_staff_pin", "stats"];
const READ: AdminOp[] = ["menu", "posts", "site", "media", "stats"];

export async function POST(req: Request) {
  const pwd = await adminPassword();
  if (!pwd) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { op, payload } = (await req.json().catch(() => ({}))) as { op?: AdminOp; payload?: Record<string, unknown> };
  if (!op || !OPS.includes(op)) return NextResponse.json({ error: "Opération inconnue" }, { status: 400 });
  try {
    const result = await db.admin(pwd, op, payload ?? {});
    const res = NextResponse.json({ result });
    if (!READ.includes(op)) {
      bustContentCache();
      revalidatePath("/", "layout");
      if (op === "set_password" && payload?.next) {
        res.cookies.set(ADMIN_COOKIE, String(payload.next), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 12 });
      }
    }
    return res;
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Erreur" }, { status: 400 });
  }
}
