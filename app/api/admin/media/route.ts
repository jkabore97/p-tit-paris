import { NextResponse } from "next/server";
import sharp from "sharp";
import { db } from "@/lib/db";
import { bustContentCache } from "@/lib/content";
import { adminPassword } from "@/lib/staff";

export const runtime = "nodejs";
export const maxDuration = 30;

/** Téléversement d'une image : redimensionnée (1600 px max), recompressée, stockée en base, servie via /media/<id>. */
export async function POST(req: Request) {
  const pwd = await adminPassword();
  if (!pwd) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Aucun fichier" }, { status: 400 });
  if (file.size > 12 * 1024 * 1024) return NextResponse.json({ error: "Fichier trop lourd (12 Mo max)" }, { status: 400 });
  try {
    const input = Buffer.from(await file.arrayBuffer());
    const meta = await sharp(input).metadata();
    const keepPng = meta.format === "png" && meta.hasAlpha;
    const pipeline = sharp(input).rotate().resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true });
    const out = keepPng ? await pipeline.png({ compressionLevel: 9 }).toBuffer() : await pipeline.jpeg({ quality: 82, mozjpeg: true }).toBuffer();
    const name = file.name.replace(/\.[^.]+$/, "") + (keepPng ? ".png" : ".jpg");
    const id = await db.adminMediaPut(pwd, name, keepPng ? "image/png" : "image/jpeg", out.toString("base64"));
    bustContentCache();
    return NextResponse.json({ id, url: `/media/${id}`, size: out.length });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Image illisible" }, { status: 400 });
  }
}
