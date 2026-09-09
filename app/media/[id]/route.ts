import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Sert les images téléversées depuis le centre de contrôle. L'identifiant est unique : cache long. */
export async function GET(_req: NextRequest, ctx: RouteContext<"/media/[id]">) {
  const { id } = await ctx.params;
  if (!UUID.test(id)) return new NextResponse("Not found", { status: 404 });
  const m = await db.mediaGet(id).catch(() => null);
  if (!m) return new NextResponse("Not found", { status: 404 });
  return new NextResponse(Buffer.from(m.data, "base64"), {
    headers: { "Content-Type": m.mime, "Cache-Control": "public, max-age=31536000, immutable", "Content-Disposition": `inline; filename="${m.name.replace(/"/g, "")}"` },
  });
}
