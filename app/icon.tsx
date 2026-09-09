import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#8b1421", borderRadius: 256 }}>
        <svg viewBox="0 0 100 100" width="420" height="420">
          <g fill="none" stroke="#d9c49d" strokeWidth="9.3" strokeLinecap="butt" strokeLinejoin="round">
            <path d="M10.5 54.2 H34 V68.7 A10.75 10.75 0 0 0 55.5 68.7 V50" />
        <path d="M44.5 50 V31.3 A10.75 10.75 0 0 1 66 31.3 V45.8 H89.5" />
          </g>
        </svg>
      </div>
    ),
    size,
  );
}
