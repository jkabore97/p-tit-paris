import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { findItem, formatPrice, TAG_LABEL } from "@/lib/menu";

export const alt = "P'tit Paris";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = findItem(slug);
  let photo: string | null = null;
  if (item?.photo) {
    try {
      const buf = await readFile(path.join(process.cwd(), "public", item.photo));
      photo = `data:image/jpeg;base64,${buf.toString("base64")}`;
    } catch {
      photo = null;
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(135deg,#fffaf3 0%,#ffdbe4 45%,#ffe7b3 100%)",
          color: "#3d0a12",
          fontFamily: "Arial, Helvetica, sans-serif", fontWeight: 800,
        }}
      >
        {photo && (
          <img
            src={photo}
            alt=""
            style={{ width: 560, height: 630, objectFit: "cover" }}
          />
        )}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 56, flex: 1 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 22, letterSpacing: 8, textTransform: "uppercase", color: "#ff4f7f" }}>
              {item?.sectionTitle ?? "La carte"}
            </div>
            <div style={{ fontSize: item && item.name.length > 26 ? 52 : 68, lineHeight: 1.05, marginTop: 20 }}>
              {item?.name ?? "P'tit Paris"}
            </div>
            {item?.tags && (
              <div style={{ display: "flex", gap: 12, marginTop: 20, fontSize: 24 }}>
                {item.tags.map((t) => (
                  <span key={t}>
                    {TAG_LABEL[t].emoji} {TAG_LABEL[t].label}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div style={{ fontSize: 56, color: "#ff4f7f" }}>{item ? formatPrice(item.price) : ""}</div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <svg viewBox="0 0 100 100" width="44" height="44"><circle cx="50" cy="50" r="49" fill="#8c0f26" /><g fill="none" stroke="#fff2e4" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round"><path d="M7 53.5 H57" /><path d="M35 53.5 V25 A13 13 0 0 1 61 25 V62" /><path d="M93 46.5 H43" /><path d="M65 46.5 V75 A13 13 0 0 1 39 75 V38" /></g></svg>
                <div style={{ fontSize: 30, color: "#5c0c16", letterSpacing: 3 }}>P&apos;TIT PARIS</div>
              </div>
              <div style={{ fontSize: 16, letterSpacing: 4, textTransform: "uppercase", color: "#ff4f7f" }}>Ouagadougou</div>
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
