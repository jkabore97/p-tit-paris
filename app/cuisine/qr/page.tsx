import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import QRCode from "qrcode";
import { Logo } from "@/components/Logo";
import { PinGate } from "@/components/PinGate";
import { PrintButton } from "@/components/PrintButton";
import { staffPin } from "@/lib/staff";

export const metadata: Metadata = { title: "QR codes des tables", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function QrPage({ searchParams }: PageProps<"/cuisine/qr">) {
  const pin = await staffPin();
  if (!pin) return <PinGate />;
  const sp = await searchParams;
  const n = Math.min(200, Math.max(1, Number.parseInt(typeof sp.n === "string" ? sp.n : "30", 10) || 30));
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "https";
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? `${proto}://${host}`;
  const tables = await Promise.all(
    Array.from({ length: n }, (_, i) => i + 1).map(async (t) => ({
      t,
      url: `${base}/t/${t}`,
      svg: await QRCode.toString(`${base}/t/${t}`, { type: "svg", margin: 1, color: { dark: "#2b2118", light: "#ffffff" }, errorCorrectionLevel: "M" }),
    })),
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="no-print sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 bg-white/95 px-5 py-3 backdrop-blur">
        <div>
          <p className="font-display text-xl font-bold text-ink">QR codes des tables</p>
          <p className="text-xs text-muted">Chaque QR ouvre {base}/t/N avec la table pré-remplie. Imprimez, plastifiez, posez.</p>
        </div>
        <div className="flex items-center gap-2">
          <form className="flex items-center gap-2">
            <label className="text-xs uppercase tracking-[0.15em] text-muted">Tables</label>
            <input name="n" type="number" min={1} max={200} defaultValue={n} className="w-20 rounded-full bg-marble px-3 py-1.5 text-sm" />
            <button className="rounded-full bg-ink px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-white">OK</button>
          </form>
          <Link href="/cuisine" className="rounded-full bg-marble px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-ink">← Cuisine</Link>
          <PrintButton />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 p-5 print:grid-cols-3 print:gap-2 md:grid-cols-3 lg:grid-cols-4">
        {tables.map(({ t, svg }) => (
          <div key={t} className="flex break-inside-avoid flex-col items-center rounded-3xl border-2 border-dashed border-ink/15 p-4 text-center print:rounded-none">
            <div className="flex items-center gap-2">
              <Logo className="h-7 w-7 text-candy" />
              <span className="font-display text-lg font-bold text-ink">P&apos;tit Paris</span>
            </div>
            <p className="font-display mt-1 text-4xl font-extrabold text-candy">Table {t}</p>
            <div className="mt-2 w-40" dangerouslySetInnerHTML={{ __html: svg }} />
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.15em] text-ink">Scannez · Commandez · Savourez</p>
            <p className="mt-1 text-[10px] text-muted">{base.replace(/^https?:\/\//, "")}/t/{t}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

