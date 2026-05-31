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

const S: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#080808", display: "flex", flexDirection: "column", alignItems: "center", padding: "0", fontFamily: "Inter, sans-serif" },
  wrap: { width: "100%", maxWidth: "440px", padding: "4rem 1.5rem" },
  label: { fontSize: "10px", letterSpacing: "0.5em", textTransform: "uppercase" as const, color: "#6b6b6b" },
  border: { border: "1px solid rgba(42,42,42,0.6)" },
  btn: { width: "100%", border: "none", cursor: "pointer", letterSpacing: "0.3em", textTransform: "uppercase" as const, fontWeight: 500 },
}

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

  if (result) {
    return (
      <main style={{ ...S.page, justifyContent: "center" }}>
        <div style={S.wrap}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <p style={{ ...S.label, marginBottom: "0.5rem" }}>Tu diagnóstico</p>
            <h1 style={{ fontFamily: "Georgia, serif", fontWeight: 300, color: "#e8e8e8", lineHeight: 1.2, fontSize: "2.25rem" }}>
              {result.aura_name}
            </h1>
          </div>

          <div style={{ borderLeft: "2px solid #7f1d1d", paddingLeft: "1.25rem", paddingTop: "0.5rem", paddingBottom: "0.5rem", marginBottom: "2rem" }}>
            <p style={{ fontSize: "14px", color: "rgba(232,232,232,0.8)", fontStyle: "italic", lineHeight: 1.6 }}>
              &ldquo;{result.free_hook}&rdquo;
            </p>
          </div>

          <div style={{ ...S.border, position: "relative", overflow: "hidden", marginBottom: "2rem" }}>
            <div style={{ padding: "1.25rem" }}>
              <p style={{ ...S.label, marginBottom: "0.75rem" }}>Roast completo</p>
              <div style={{ filter: "blur(6px)", opacity: 0.35, userSelect: "none", pointerEvents: "none" }}>
                <p style={{ fontSize: "14px", color: "#e8e8e8", lineHeight: 1.7 }}>
                  Tu elección de vestimenta habla de alguien que leyó sobre minimalismo pero nunca entendió por qué funciona. La tensión entre querer proyectar sofisticación y la incapacidad de soltar los patrones de consumo masivo es dolorosamente visible en cada decisión que tomás frente al espejo.
                </p>
              </div>
            </div>
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "4rem", background: "linear-gradient(to bottom, transparent, #0d0d0d)" }} />
          </div>

          <div style={{ ...S.border, padding: "1.5rem", textAlign: "center", marginBottom: "1rem" }}>
            <p style={{ fontSize: "18px", color: "#e8e8e8", fontWeight: 300, marginBottom: "0.25rem" }}>
              Roast completo · USD 3
            </p>
            <p style={{ fontSize: "12px", color: "#6b6b6b", marginBottom: "1.25rem" }}>
              Análisis completo · Paleta real · Consejo concreto
            </p>
            {isLatam ? (
              <button
                onClick={handleMPCheckout}
                disabled={isRedirecting}
                style={{ ...S.btn, padding: "1rem", background: "#e8e8e8", color: "#080808", fontSize: "12px", marginBottom: "0.5rem", opacity: isRedirecting ? 0.5 : 1 }}
              >
                {isRedirecting ? "Redirigiendo..." : "Pagar con Mercado Pago"}
              </button>
            ) : (
              <button
                onClick={handlePayPal}
                style={{ ...S.btn, padding: "1rem", background: "#003087", color: "white", fontSize: "12px", marginBottom: "0.5rem" }}
              >
                Pagar con PayPal — USD 3
              </button>
            )}
            <p style={{ fontSize: "10px", color: "rgba(107,107,107,0.5)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Pago único · Acceso inmediato
            </p>
          </div>

          {error && <p style={{ fontSize: "12px", color: "#e57373", textAlign: "center", marginBottom: "1rem" }}>{error}</p>}
          <button
            onClick={() => { setResult(null); setError(null) }}
            style={{ ...S.btn, background: "none", padding: "0.5rem", fontSize: "12px", color: "#6b6b6b", border: "none" }}
          >
            Nueva foto
          </button>
        </div>
      </main>
    )
  }

  return (
    <main style={S.page}>
      <div style={S.wrap}>

        {/* HERO */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <p style={{ ...S.label, marginBottom: "1rem" }}>by AURA · IA</p>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "5.5rem", fontWeight: 300, color: "#e8e8e8", lineHeight: 1, marginBottom: "1.25rem" }}>
            ROAST
          </h1>
          <p style={{ fontSize: "16px", color: "rgba(232,232,232,0.7)", fontWeight: 300, lineHeight: 1.65, marginBottom: "1rem" }}>
            Subí tu foto.<br />
            La IA analiza tu estética y te dice<br />
            lo que nadie se atreve a decirte.
          </p>
          <p style={{ fontSize: "11px", color: "rgba(107,107,107,0.7)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            Diagnóstico gratis · Roast completo USD 3
          </p>
        </div>

        {/* CÓMO FUNCIONA */}
        <div style={{ marginBottom: "3rem" }}>
          <p style={{ ...S.label, marginBottom: "1.25rem", textAlign: "center" }}>Cómo funciona</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {[
              { n: "01", title: "Subís tu foto", desc: "Una selfie o foto de cuerpo entero. Puede ser de redes." },
              { n: "02", title: "La IA analiza tu estética", desc: "Estudia tu ropa, colores, lenguaje corporal y entorno." },
              { n: "03", title: "Recibís el diagnóstico", desc: "Nombre de aura + frase inicial. Gratis, sin registro." },
              { n: "04", title: "Desbloqueás el roast completo", desc: "Análisis profundo + paleta real + consejo concreto por USD 3." },
            ].map((step, i) => (
              <div key={i} style={{ display: "flex", gap: "1rem", padding: "1rem 0", borderBottom: i < 3 ? "1px solid rgba(42,42,42,0.4)" : "none" }}>
                <span style={{ fontSize: "10px", color: "#3a3a3a", letterSpacing: "0.1em", fontWeight: 500, paddingTop: "2px", minWidth: "24px" }}>{step.n}</span>
                <div>
                  <p style={{ fontSize: "13px", color: "#e8e8e8", marginBottom: "0.2rem", fontWeight: 500 }}>{step.title}</p>
                  <p style={{ fontSize: "12px", color: "#6b6b6b", lineHeight: 1.5 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* EJEMPLOS */}
        <div style={{ marginBottom: "3rem" }}>
          <p style={{ ...S.label, marginBottom: "1.25rem", textAlign: "center" }}>Ejemplos reales</p>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
            {EXAMPLES.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveExample(i)}
                style={{ flex: 1, padding: "0.4rem", background: "none", border: `1px solid ${activeExample === i ? "rgba(232,232,232,0.4)" : "rgba(42,42,42,0.6)"}`, cursor: "pointer", fontSize: "10px", letterSpacing: "0.2em", color: activeExample === i ? "#e8e8e8" : "#4a4a4a", textTransform: "uppercase" as const }}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <div style={{ ...S.border, padding: "1.25rem" }}>
            <p style={{ fontSize: "15px", color: "#e8e8e8", fontFamily: "Georgia, serif", fontWeight: 300, marginBottom: "0.75rem", lineHeight: 1.3 }}>
              {EXAMPLES[activeExample].name}
            </p>
            <p style={{ fontSize: "13px", color: "rgba(232,232,232,0.6)", fontStyle: "italic", lineHeight: 1.6, marginBottom: "1rem" }}>
              &ldquo;{EXAMPLES[activeExample].hook}&rdquo;
            </p>
            <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
              <span style={{ fontSize: "9px", color: "#4a4a4a", letterSpacing: "0.2em", textTransform: "uppercase" as const, marginRight: "0.25rem" }}>Paleta</span>
              {EXAMPLES[activeExample].palette.map((c, i) => (
                <div key={i} style={{ width: "16px", height: "16px", background: c, border: "1px solid rgba(255,255,255,0.08)" }} />
              ))}
            </div>
          </div>
          <p style={{ fontSize: "11px", color: "#3a3a3a", textAlign: "center", marginTop: "0.75rem", letterSpacing: "0.05em" }}>
            El roast completo incluye análisis detallado + consejo específico
          </p>
        </div>

        {/* SELECTOR PAÍS */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ ...S.label, display: "block", marginBottom: "0.5rem" }}>Tu país</label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            style={{ width: "100%", background: "#111", border: "1px solid #2a2a2a", padding: "0.75rem 1rem", fontSize: "14px", color: "#e8e8e8", cursor: "pointer", appearance: "none" as const }}
          >
            {["Argentina","México","Colombia","Chile","Uruguay","Brasil","Perú","España","Estados Unidos","Otro"].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* UPLOAD */}
        <div style={{ marginBottom: "2rem" }}>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={isAnalyzing}
            style={{ width: "100%", padding: "1.25rem", border: "1px solid rgba(232,232,232,0.3)", background: "none", fontSize: "12px", letterSpacing: "0.4em", textTransform: "uppercase" as const, color: "#e8e8e8", cursor: isAnalyzing ? "default" : "pointer", opacity: isAnalyzing ? 0.5 : 1 }}
          >
            {isAnalyzing ? "Analizando..." : "Subir mi foto"}
          </button>
          {isAnalyzing && (
            <p style={{ fontSize: "11px", textAlign: "center", color: "#6b6b6b", marginTop: "0.75rem", letterSpacing: "0.05em" }}>
              El crítico está evaluando tu estética...
            </p>
          )}
        </div>

        {error && <p style={{ fontSize: "12px", color: "#e57373", textAlign: "center" }}>{error}</p>}

        <p style={{ fontSize: "10px", color: "rgba(107,107,107,0.4)", textAlign: "center", letterSpacing: "0.1em", textTransform: "uppercase" as const }}>
          Tu imagen no se almacena permanentemente
        </p>
      </div>
    </main>
  )
}
