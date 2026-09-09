import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#8c0f26", borderRadius: 256 }}>
        <svg viewBox="0 0 100 100" width="420" height="420">
          <g fill="none" stroke="#fff2e4" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 53.5 H57" />
        <path d="M35 53.5 V25 A13 13 0 0 1 61 25 V62" />
        <path d="M93 46.5 H43" />
        <path d="M65 46.5 V75 A13 13 0 0 1 39 75 V38" />
          </g>
        </svg>
      </div>
    ),
    size,
  );
}
