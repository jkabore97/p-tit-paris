import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#ff4f7f", borderRadius: 256 }}>
        <svg viewBox="0 0 64 64" width="380" height="380">
          <path d="M20 40V24h10a7 7 0 0 1 0 14h-4M44 24v16H34a7 7 0 0 1 0-14h4" fill="none" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    ),
    size,
  );
}
