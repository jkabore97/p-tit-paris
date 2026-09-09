import { NextResponse, type NextRequest } from "next/server";

/** Cible des QR codes : /t/12 → /commander?table=12 */
export async function GET(req: NextRequest, ctx: RouteContext<"/t/[table]">) {
  const { table } = await ctx.params;
  const n = Number.parseInt(table, 10);
  const url = new URL(Number.isFinite(n) && n > 0 ? `/commander?table=${n}` : "/commander", req.url);
  return NextResponse.redirect(url);
}
