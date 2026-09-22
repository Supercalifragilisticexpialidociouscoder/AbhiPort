import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0b0b0a" }}>
        <svg width="132" height="132" viewBox="0 0 64 64">
          <path fill="#ecebe6" fillRule="evenodd" d="M13 54 24.5 10h11L47 54h-9.5l-2.1-9.2h-10.8L22.5 54zm13.3-17.4h7.4L30 20.4z" />
          <rect x="49" y="46" width="8" height="8" fill="#ff4521" />
        </svg>
      </div>
    ),
    size,
  );
}
