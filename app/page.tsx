"use client"

import { useState, useRef } from "react"
import { analyzeRoast } from "@/lib/supabase"

const LATAM = ["Argentina", "México", "Colombia", "Chile", "Uruguay", "Brasil", "Perú"]

const EXAMPLES = [
  {
    name: "La Francesa de Microcentro que Nunca Salió de Buenos Aires",
    hook: "Las rayas horizontales no adelgazan, cariño, y menos cuando el único riesgo que tomás es un turtleneck de Zara.",
    palette: ["#2C2C2C", "#8B7355", "#F5F0E8"]
  },
  {
    name: "Crypto-Bro de Departamento Alquilado",
    hook: "Tu hoodie de marca comunica exactamente lo que querés ocultar: que todavía no decidiste quién sos.",
    palette: ["#1A1A2E", "#16213E", "#C0C0C0"]
  },
  {
    name: "Minimalista Pretencioso de Palermo",
    hook: "Proyectás una austeridad que en realidad es indecisión cromática disfrazada de filosofía.",
    palette: ["#F5F5F5", "#E0E0E0", "#333333"]
  }
]

export default function HomePage() {
  const [country, setCountry] = useState("Argentina")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ id: string; aura_name: string; free_hook: string } | null>(null)
  const [activeExample, setActiveExample] = useState(0)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return
    setIsAnalyzing(true)
    setError(null)
    try {
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve((e.target?.result as string).split(",")[1])
        reader.readAsDataURL(file)
      })
      const data = await analyzeRoast(base64, file.type, country)
      setResult(data)
    } catch {
      setError("No se pudo analizar la imagen. Intentá de nuevo.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleMPCheckout = async () => {
    if (!result || isRedirecting) return
    setIsRedirecting(true)
    try {
      const res = await fetch("/api/mp-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: result.id, country })
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else { setError("Error al iniciar el pago."); setIsRedirecting(false) }
    } catch {
      setError("Error de conexión.")
      setIsRedirecting(false)
    }
  }

  const handlePayPal = async () => {
    if (!result) return
    try {
      const orderRes = await fetch("/api/paypal-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: result.id })
      })
      const { orderID } = await orderRes.json()
      window.location.href = `https://www.paypal.com/checkoutnow?token=${orderID}`
    } catch {
      setError("Error al iniciar PayPal.")
    }
  }

  const isLatam = LATAM.includes(country)

  const label: React.CSSProperties = { fontSize: "10px", letterSpacing: "0.5em", textTransform: "uppercase", color: "#6b6b6b" }
  const border: React.CSSProperties = { border: "1px solid rgba(42,42,42,0.6)" }

  // ── RESULT STATE ──────────────────────────────────────────────────────────
  if (result) {
    return (
      <>
        <style>{`
          @media(min-width:900px){
            .result-page{padding:4rem 3rem!important}
            .result-wrap{max-width:520px!important}
          }
        `}</style>
        <main className="result-page" style={{ minHeight: "100vh", background: "#080808", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "3rem 1.5rem", fontFamily: "Inter, sans-serif" }}>
          <div className="result-wrap" style={{ width: "100%", maxWidth: "440px" }}>

            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <p style={{ ...label, marginBottom: "0.5rem" }}>Tu diagnóstico</p>
              <h1 style={{ fontFamily: "Georgia, serif", fontWeight: 300, color: "#e8e8e8", lineHeight: 1.2, fontSize: "2.25rem" }}>
                {result.aura_name}
              </h1>
            </div>

            <div style={{ borderLeft: "2px solid #7f1d1d", paddingLeft: "1.25rem", paddingTop: "0.5rem", paddingBottom: "0.5rem", marginBottom: "2rem" }}>
              <p style={{ fontSize: "14px", color: "rgba(232,232,232,0.8)", fontStyle: "italic", lineHeight: 1.6 }}>
                &ldquo;{result.free_hook}&rdquo;
              </p>
            </div>

            <div style={{ ...border, position: "relative", overflow: "hidden", marginBottom: "2rem" }}>
              <div style={{ padding: "1.25rem" }}>
                <p style={{ ...label, marginBottom: "0.75rem" }}>Roast completo</p>
                <div style={{ filter: "blur(6px)", opacity: 0.35, userSelect: "none", pointerEvents: "none" }}>
                  <p style={{ fontSize: "14px", color: "#e8e8e8", lineHeight: 1.7 }}>
                    Tu elección de vestimenta habla de alguien que leyó sobre minimalismo pero nunca entendió por qué funciona. La tensión entre querer proyectar sofisticación y la incapacidad de soltar los patrones de consumo masivo es dolorosamente visible.
                  </p>
                </div>
              </div>
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "4rem", background: "linear-gradient(to bottom, transparent, #0d0d0d)" }} />
            </div>

            <div style={{ ...border, padding: "1.5rem", textAlign: "center", marginBottom: "1rem" }}>
              <p style={{ fontSize: "18px", color: "#e8e8e8", fontWeight: 300, marginBottom: "0.25rem" }}>
                Roast completo · USD 3
              </p>
              <p style={{ fontSize: "12px", color: "#6b6b6b", marginBottom: "1.25rem" }}>
                Análisis completo · Paleta real · Consejo concreto · Roast Card para compartir
              </p>
              {isLatam ? (
                <button onClick={handleMPCheckout} disabled={isRedirecting}
                  style={{ width: "100%", border: "none", cursor: "pointer", letterSpacing: "0.3em", textTransform: "uppercase" as const, fontWeight: 600, padding: "1rem", background: "#e8e8e8", color: "#080808", fontSize: "12px", marginBottom: "0.5rem", opacity: isRedirecting ? 0.5 : 1 }}>
                  {isRedirecting ? "Redirigiendo..." : "Pagar con Mercado Pago"}
                </button>
              ) : (
                <button onClick={handlePayPal}
                  style={{ width: "100%", border: "none", cursor: "pointer", letterSpacing: "0.3em", textTransform: "uppercase" as const, fontWeight: 600, padding: "1rem", background: "#003087", color: "white", fontSize: "12px", marginBottom: "0.5rem" }}>
                  Pagar con PayPal — USD 3
                </button>
              )}
              <p style={{ fontSize: "10px", color: "rgba(107,107,107,0.5)", letterSpacing: "0.1em", textTransform: "uppercase" as const }}>
                Pago único · Acceso inmediato
              </p>
            </div>

            {error && <p style={{ fontSize: "12px", color: "#e57373", textAlign: "center", marginBottom: "1rem" }}>{error}</p>}
            <button onClick={() => { setResult(null); setError(null) }}
              style={{ width: "100%", background: "none", border: "none", padding: "0.5rem", fontSize: "12px", color: "#6b6b6b", cursor: "pointer", letterSpacing: "0.2em", textTransform: "uppercase" as const }}>
              Nueva foto
            </button>
          </div>
        </main>
      </>
    )
  }

  // ── LANDING ────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        body { margin: 0; }
        @media(min-width:900px){
          .land-outer { align-items: flex-start !important; justify-content: center !important; }
          .land-inner { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 5rem !important; max-width: 960px !important; padding: 5rem 3rem !important; align-items: start !important; }
          .land-left { position: sticky; top: 4rem; }
          .land-right { padding-top: 0 !important; }
        }
      `}</style>
      <main className="land-outer" style={{ minHeight: "100vh", background: "#080808", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif" }}>
        <div className="land-inner" style={{ width: "100%", maxWidth: "440px", padding: "4rem 1.5rem", display: "flex", flexDirection: "column", gap: "0" }}>

          {/* LEFT COLUMN — Hero + Upload */}
          <div className="land-left">
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <p style={{ ...label, marginBottom: "1rem" }}>by AURA · IA</p>
              <h1 style={{ fontFamily: "Georgia, serif", fontSize: "5.5rem", fontWeight: 300, color: "#e8e8e8", lineHeight: 1, marginBottom: "1.25rem" }}>
                ROAST
              </h1>
              <p style={{ fontSize: "16px", color: "rgba(232,232,232,0.65)", fontWeight: 300, lineHeight: 1.65, marginBottom: "1rem" }}>
                Subí tu foto.<br />
                La IA analiza tu estética y te dice<br />
                lo que nadie se atreve a decirte.
              </p>
              <p style={{ fontSize: "11px", color: "rgba(107,107,107,0.7)", letterSpacing: "0.15em", textTransform: "uppercase" as const }}>
                Diagnóstico gratis · Roast completo USD 3
              </p>
            </div>

            {/* Cómo funciona */}
            <div style={{ marginBottom: "2.5rem" }}>
              <p style={{ ...label, marginBottom: "1.25rem" }}>Cómo funciona</p>
              {[
                { n: "01", title: "Subís tu foto", desc: "Selfie o foto de cuerpo entero. Puede ser de redes." },
                { n: "02", title: "La IA analiza tu estética", desc: "Ropa, colores, lenguaje corporal y entorno." },
                { n: "03", title: "Diagnóstico gratis", desc: "Nombre de aura + frase inicial. Sin registro." },
                { n: "04", title: "Roast completo · USD 3", desc: "Análisis profundo + paleta real + consejo + Roast Card." },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", gap: "1rem", padding: "0.875rem 0", borderBottom: i < 3 ? "1px solid rgba(42,42,42,0.4)" : "none" }}>
                  <span style={{ fontSize: "10px", color: "#3a3a3a", letterSpacing: "0.1em", paddingTop: "2px", minWidth: "24px" }}>{s.n}</span>
                  <div>
                    <p style={{ fontSize: "13px", color: "#e8e8e8", marginBottom: "0.15rem", fontWeight: 500 }}>{s.title}</p>
                    <p style={{ fontSize: "12px", color: "#6b6b6b", lineHeight: 1.5 }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* País */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ ...label, display: "block", marginBottom: "0.5rem" }}>Tu país</label>
              <select value={country} onChange={(e) => setCountry(e.target.value)}
                style={{ width: "100%", background: "#111", border: "1px solid #2a2a2a", padding: "0.75rem 1rem", fontSize: "14px", color: "#e8e8e8", cursor: "pointer", appearance: "none" as const }}>
                {["Argentina","México","Colombia","Chile","Uruguay","Brasil","Perú","España","Estados Unidos","Otro"].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Upload */}
            <div style={{ marginBottom: "1.5rem" }}>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
              <button onClick={() => fileRef.current?.click()} disabled={isAnalyzing}
                style={{ width: "100%", padding: "1.25rem", border: "1px solid rgba(232,232,232,0.3)", background: "none", fontSize: "12px", letterSpacing: "0.4em", textTransform: "uppercase" as const, color: "#e8e8e8", cursor: isAnalyzing ? "default" : "pointer", opacity: isAnalyzing ? 0.5 : 1 }}>
                {isAnalyzing ? "Analizando..." : "Subir mi foto"}
              </button>
              {isAnalyzing && (
                <p style={{ fontSize: "11px", textAlign: "center", color: "#6b6b6b", marginTop: "0.75rem" }}>
                  El crítico está evaluando tu estética...
                </p>
              )}
            </div>

            {error && <p style={{ fontSize: "12px", color: "#e57373", textAlign: "center", marginBottom: "1rem" }}>{error}</p>}

            <p style={{ fontSize: "10px", color: "rgba(107,107,107,0.35)", textAlign: "center", letterSpacing: "0.1em", textTransform: "uppercase" as const }}>
              Tu imagen no se almacena permanentemente
            </p>
          </div>

          {/* RIGHT COLUMN — Ejemplos */}
          <div className="land-right" style={{ paddingTop: "2.5rem" }}>
            <p style={{ ...label, marginBottom: "1.25rem" }}>Ejemplos reales</p>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
              {EXAMPLES.map((_, i) => (
                <button key={i} onClick={() => setActiveExample(i)}
                  style={{ flex: 1, padding: "0.4rem", background: "none", border: `1px solid ${activeExample === i ? "rgba(232,232,232,0.4)" : "rgba(42,42,42,0.6)"}`, cursor: "pointer", fontSize: "10px", letterSpacing: "0.2em", color: activeExample === i ? "#e8e8e8" : "#4a4a4a", textTransform: "uppercase" as const }}>
                  {i + 1}
                </button>
              ))}
            </div>

            {/* Example card */}
            <div style={{ border: "1px solid rgba(42,42,42,0.6)", padding: "1.5rem", marginBottom: "1.25rem" }}>
              <p style={{ ...label, fontSize: "9px", marginBottom: "0.75rem" }}>Diagnóstico</p>
              <p style={{ fontSize: "1.1rem", color: "#e8e8e8", fontFamily: "Georgia, serif", fontWeight: 300, marginBottom: "0.75rem", lineHeight: 1.3 }}>
                {EXAMPLES[activeExample].name}
              </p>
              <div style={{ width: "24px", height: "1px", background: "#7f1d1d", marginBottom: "0.75rem" }} />
              <p style={{ fontSize: "13px", color: "rgba(232,232,232,0.55)", fontStyle: "italic", lineHeight: 1.6, marginBottom: "1.25rem" }}>
                &ldquo;{EXAMPLES[activeExample].hook}&rdquo;
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "9px", color: "#4a4a4a", letterSpacing: "0.2em", textTransform: "uppercase" as const }}>Paleta</span>
                {EXAMPLES[activeExample].palette.map((c, i) => (
                  <div key={i} style={{ width: "16px", height: "16px", background: c, border: "1px solid rgba(255,255,255,0.08)" }} />
                ))}
              </div>
            </div>

            {/* Mini card preview */}
            <div style={{ border: "1px solid rgba(42,42,42,0.4)", padding: "1.25rem", background: "#0a0a0a", marginBottom: "1.25rem" }}>
              <p style={{ ...label, fontSize: "9px", marginBottom: "0.75rem" }}>Roast Card (incluida en el roast completo)</p>
              <div style={{ background: "#080808", border: "1px solid rgba(232,232,232,0.08)", padding: "1rem" }}>
                <p style={{ fontSize: "8px", letterSpacing: "0.4em", textTransform: "uppercase" as const, color: "#6b6b6b", fontFamily: "Inter, sans-serif", marginBottom: "0.5rem" }}>AURA ROAST</p>
                <div style={{ width: "20px", height: "1px", background: "#7f1d1d", marginBottom: "0.5rem" }} />
                <p style={{ fontFamily: "Georgia, serif", fontWeight: 300, color: "#e8e8e8", fontSize: "0.85rem", lineHeight: 1.3, marginBottom: "0.5rem" }}>
                  {EXAMPLES[activeExample].name}
                </p>
                <p style={{ fontSize: "10px", color: "rgba(232,232,232,0.45)", fontStyle: "italic", lineHeight: 1.5, marginBottom: "0.75rem" }}>
                  &ldquo;{EXAMPLES[activeExample].hook.substring(0, 60)}...&rdquo;
                </p>
                <div style={{ display: "flex", gap: "3px", marginBottom: "0.5rem" }}>
                  {EXAMPLES[activeExample].palette.map((c, i) => (
                    <div key={i} style={{ width: "12px", height: "12px", background: c }} />
                  ))}
                </div>
                <p style={{ fontSize: "7px", letterSpacing: "0.3em", textTransform: "uppercase" as const, color: "#2a2a2a" }}>roast.tuaura.com.ar</p>
              </div>
            </div>

            <p style={{ fontSize: "11px", color: "#3a3a3a", textAlign: "center", letterSpacing: "0.05em" }}>
              Descargás la imagen y la compartís en Stories, TikTok o WhatsApp
            </p>
          </div>

        </div>
      </main>
    </>
  )
}
