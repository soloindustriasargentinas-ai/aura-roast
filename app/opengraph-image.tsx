import { ImageResponse } from "next/og"

export const alt = "AURA — Tu identidad visual destilada"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#050505",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Left accent bar */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, bottom: 0,
          width: 4,
          background: "#9B6EFA",
          display: "flex"
        }} />

        {/* Top color strip */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: 3,
          background: "linear-gradient(90deg, #9B6EFA 0%, #F59E0B 50%, #38BDF8 100%)",
          display: "flex"
        }} />

        {/* Label */}
        <p style={{
          color: "#4a4a4a",
          fontSize: 14,
          letterSpacing: "0.55em",
          textTransform: "uppercase",
          marginBottom: 16,
          display: "flex"
        }}>
          IDENTIDAD VISUAL · IA
        </p>

        {/* Main title */}
        <h1 style={{
          color: "#E8E8E8",
          fontSize: 200,
          fontWeight: 300,
          letterSpacing: "0.1em",
          margin: 0,
          lineHeight: 1,
          display: "flex"
        }}>
          AURA
        </h1>

        {/* Divider */}
        <div style={{
          width: 60,
          height: 1,
          background: "#9B6EFA",
          opacity: 0.6,
          marginTop: 32,
          marginBottom: 32,
          display: "flex"
        }} />

        {/* Tagline */}
        <p style={{
          color: "#5a5a5a",
          fontSize: 22,
          fontWeight: 300,
          letterSpacing: "0.1em",
          margin: 0,
          display: "flex"
        }}>
          Subí una foto. Destilamos quién sos.
        </p>

        {/* Palette swatches */}
        <div style={{ display: "flex", gap: 10, marginTop: 48, alignItems: "center" }}>
          {[
            { color: "#9B6EFA", width: 52, opacity: 1 },
            { color: "#F59E0B", width: 20, opacity: 0.7 },
            { color: "#38BDF8", width: 20, opacity: 0.7 },
          ].map((s, i) => (
            <div key={i} style={{
              width: s.width,
              height: 3,
              background: s.color,
              opacity: s.opacity,
              display: "flex"
            }} />
          ))}
        </div>

        {/* URL */}
        <p style={{
          position: "absolute",
          bottom: 36,
          right: 56,
          color: "#222222",
          fontSize: 13,
          letterSpacing: "0.45em",
          textTransform: "uppercase",
          display: "flex"
        }}>
          tuaura.com.ar
        </p>

        {/* Decorative corner lines */}
        <div style={{
          position: "absolute",
          top: 36,
          right: 56,
          width: 24,
          height: 1,
          background: "#1a1a1a",
          display: "flex"
        }} />
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 1,
          background: "#111111",
          display: "flex"
        }} />
      </div>
    ),
    { ...size }
  )
}
