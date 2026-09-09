import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const alt = "P'tit Paris — Le pari de vous faire plaisir";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const shots = ["poulet-wellington", "ribs-bbq-burger", "blue-marguarita", "oeuf-benedicte"];
  const data = await Promise.all(
    shots.map(async (s) => {
      const buf = await readFile(path.join(process.cwd(), "public", "photos", `${s}.jpg`));
      return `data:image/jpeg;base64,${buf.toString("base64")}`;
    }),
  );
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "linear-gradient(135deg,#fffaf3 0%,#ffdbe4 45%,#ffe7b3 100%)", color: "#3d0a12", fontFamily: "Arial, Helvetica, sans-serif", fontWeight: 800 }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: 64, width: 620 }}>
          <div style={{ fontSize: 20, letterSpacing: 8, textTransform: "uppercase", color: "#ff4f7f" }}>Le pari de vous faire plaisir</div>
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 24 }}>
            <svg viewBox="0 0 100 100" width="110" height="110"><circle cx="50" cy="50" r="49" fill="#8b1421" /><g fill="none" stroke="#d9c49d" strokeWidth="9.3" strokeLinecap="butt" strokeLinejoin="round"><path d="M10.5 54.2 H34 V68.7 A10.75 10.75 0 0 0 55.5 68.7 V50" /><path d="M44.5 50 V31.3 A10.75 10.75 0 0 1 66 31.3 V45.8 H89.5" /></g></svg>
            <div style={{ fontSize: 96, lineHeight: 0.95, color: "#5c0c16", letterSpacing: 4 }}>P&apos;TIT PARIS</div>
          </div>
          <div style={{ fontSize: 26, marginTop: 28, color: "#7d6b5d" }}>Petit-déjeuner · Déjeuner & Dîner · Bar & Cave</div>
          <div style={{ fontSize: 18, letterSpacing: 4, marginTop: 40, textTransform: "uppercase", color: "#ff4f7f" }}>Gounghin · Ouagadougou</div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", width: 580 }}>
          {data.map((src) => (
            <img key={src.slice(0, 40)} src={src} alt="" style={{ width: 290, height: 315, objectFit: "cover" }} />
          ))}
        </div>
      </div>
    ),
    size,
  );
}
