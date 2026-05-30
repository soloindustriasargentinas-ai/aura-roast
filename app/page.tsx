"use client"

import { useState, useRef } from "react"
import { analyzeRoast } from "@/lib/supabase"

const LATAM = ["Argentina", "México", "Colombia", "Chile", "Uruguay", "Brasil", "Perú"]

const S: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#080808", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "4rem 1.5rem", fontFamily: "Inter, sans-serif" },
  wrap: { width: "100%", maxWidth: "440px" },
  label: { fontSize: "10px", letterSpacing: "0.5em", textTransform: "uppercase", color: "#6b6b6b" },
  border: { border: "1px solid rgba(42,42,42,0.6)" },
  btn: { width: "100%", border: "none", cursor: "pointer", letterSpacing: "0.3em", textTransform: "uppercase" as const, fontWeight: 500 },
}

export default function HomePage() {
  const [country, setCountry] = useState("Argentina")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ id: string; aura_name: string; free_hook: string } | null>(null)
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
      <main style={S.page}>
        <div style={S.wrap}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <p style={{ ...S.label, marginBottom: "0.5rem" }}>Diagnóstico inicial</p>
            <h1 style={{ fontFamily: "Georgia, serif", fontWeight: 300, color: "#e8e8e8", lineHeight: 1.2, fontSize: "2.5rem" }}>
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
              <div style={{ filter: "blur(5px)", opacity: 0.4, userSelect: "none" }}>
                <p style={{ fontSize: "14px", color: "#e8e8e8", lineHeight: 1.6 }}>
                  Tu elección de vestimenta habla de alguien que leyó sobre minimalismo pero nunca entendió por qué funciona. La tensión entre querer proyectar sofisticación y la incapacidad de soltar los patrones de consumo masivo es dolorosamente visible...
                </p>
              </div>
            </div>
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "4rem", background: "linear-gradient(to bottom, transparent, #111)" }} />
          </div>

          <div style={{ ...S.border, padding: "1.5rem", textAlign: "center", marginBottom: "1rem" }}>
            <p style={{ fontSize: "18px", color: "#e8e8e8", fontWeight: 300, marginBottom: "0.25rem" }}>
              Roast completo · USD 3
            </p>
            <p style={{ fontSize: "12px", color: "#6b6b6b", marginBottom: "1.25rem" }}>
              Análisis profundo · Paleta real · Consejo específico
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
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <p style={{ ...S.label, marginBottom: "0.75rem" }}>Identidad Visual · IA</p>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "6rem", fontWeight: 300, color: "#e8e8e8", lineHeight: 1, marginBottom: "0.75rem" }}>
            ROAST
          </h1>
          <p style={{ fontSize: "14px", color: "#6b6b6b", fontWeight: 300, lineHeight: 1.6, marginBottom: "0.75rem" }}>
            Subí tu foto.<br />La IA te dice lo que nadie se atreve.
          </p>
          <p style={{ fontSize: "11px", color: "rgba(107,107,107,0.6)", letterSpacing: "0.1em" }}>
            Diagnóstico gratis · Roast completo USD 3
          </p>
        </div>

        <div style={{ ...S.border, padding: "1.25rem", marginBottom: "2rem" }}>
          <p style={{ ...S.label, fontSize: "9px", marginBottom: "0.5rem" }}>Ejemplo de diagnóstico</p>
          <p style={{ fontSize: "14px", color: "#e8e8e8", fontStyle: "italic", marginBottom: "0.25rem" }}>
            &ldquo;Minimalista Pretencioso de Palermo&rdquo;
          </p>
          <p style={{ fontSize: "12px", color: "#6b6b6b", lineHeight: 1.5 }}>
            &ldquo;Proyectás una austeridad que en realidad es indecisión cromática.&rdquo;
          </p>
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ ...S.label, display: "block", marginBottom: "0.5rem" }}>País</label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            style={{ width: "100%", background: "#111", border: "1px solid #2a2a2a", padding: "0.75rem 1rem", fontSize: "14px", color: "#e8e8e8", cursor: "pointer", appearance: "none" }}
          >
            {["Argentina","México","Colombia","Chile","Uruguay","Brasil","Perú","España","Estados Unidos","Otro"].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
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
            style={{ width: "100%", padding: "1.25rem", border: "1px solid rgba(232,232,232,0.3)", background: "none", fontSize: "12px", letterSpacing: "0.4em", textTransform: "uppercase", color: "#e8e8e8", cursor: "pointer", opacity: isAnalyzing ? 0.5 : 1 }}
          >
            {isAnalyzing ? "Analizando..." : "Subir mi foto"}
          </button>
          {isAnalyzing && (
            <p style={{ fontSize: "11px", textAlign: "center", color: "#6b6b6b", marginTop: "0.75rem" }}>
              El crítico está evaluando tu estética...
            </p>
          )}
        </div>

        {error && <p style={{ fontSize: "12px", color: "#e57373", textAlign: "center", marginTop: "1rem" }}>{error}</p>}
      </div>
    </main>
  )
}
