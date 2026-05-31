"use client"

import { Suspense, useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { toPng } from "html-to-image"
import { getRoastById } from "@/lib/supabase"
import type { RoastData } from "@/lib/types"

function extractHex(str: string): string | null {
  const m = str.match(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})/)
  return m ? m[0] : null
}

function RoastCard({ auraName, freeHook, palette }: { auraName: string; freeHook: string; palette: string[] }) {
  const hexes = palette.map(extractHex).filter(Boolean) as string[]
  return (
    <div style={{
      width: "400px", height: "400px", background: "#080808",
      display: "flex", flexDirection: "column", justifyContent: "space-between",
      padding: "36px", boxSizing: "border-box", fontFamily: "Georgia, serif",
      border: "1px solid rgba(232,232,232,0.12)"
    }}>
      <div>
        <p style={{ fontSize: "9px", letterSpacing: "0.5em", textTransform: "uppercase", color: "#6b6b6b", fontFamily: "Inter, sans-serif", marginBottom: "24px" }}>
          AURA ROAST
        </p>
        <div style={{ width: "32px", height: "2px", background: "#7f1d1d", marginBottom: "20px" }} />
        <p style={{ fontSize: "1.45rem", fontWeight: 300, color: "#e8e8e8", lineHeight: 1.3, marginBottom: "20px" }}>
          {auraName}
        </p>
        <p style={{ fontSize: "13px", color: "rgba(232,232,232,0.55)", fontStyle: "italic", lineHeight: 1.6 }}>
          &ldquo;{freeHook}&rdquo;
        </p>
      </div>
      <div>
        {hexes.length > 0 && (
          <div style={{ display: "flex", gap: "6px", marginBottom: "20px" }}>
            {hexes.map((c, i) => (
              <div key={i} style={{ width: "20px", height: "20px", background: c, border: "1px solid rgba(255,255,255,0.1)" }} />
            ))}
          </div>
        )}
        <p style={{ fontSize: "9px", letterSpacing: "0.35em", textTransform: "uppercase", color: "#2a2a2a", fontFamily: "Inter, sans-serif" }}>
          roast.tuaura.com.ar
        </p>
      </div>
    </div>
  )
}

function RoastCardSection({ auraName, freeHook, roastData }: { auraName: string; freeHook: string; roastData: RoastData }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [generating, setGenerating] = useState(false)
  const [done, setDone] = useState(false)

  const palette = roastData.paleta_colores || []

  const handleDownload = async () => {
    if (!cardRef.current || generating) return
    setGenerating(true)
    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2, backgroundColor: "#080808" })

      const isMobile = /Mobi|Android/i.test(navigator.userAgent)
      if (isMobile && navigator.share) {
        try {
          const blob = await (await fetch(dataUrl)).blob()
          const file = new File([blob], "roast.png", { type: "image/png" })
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({ files: [file], title: `Mi AURA ROAST: ${auraName}` })
            setDone(true)
            return
          }
        } catch {}
      }

      const link = document.createElement("a")
      link.download = `roast-${auraName.replace(/\s+/g, "-").toLowerCase()}.png`
      link.href = dataUrl
      link.click()
      setDone(true)
      setTimeout(() => setDone(false), 3000)
    } catch (err) {
      console.error(err)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div>
      <p style={{ fontSize: "10px", letterSpacing: "0.5em", textTransform: "uppercase" as const, color: "#6b6b6b", marginBottom: "1.25rem", textAlign: "center" }}>
        Tu Roast Card
      </p>

      {/* Card preview — centered, cropped on mobile */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.25rem", overflow: "hidden" }}>
        <div ref={cardRef}>
          <RoastCard auraName={auraName} freeHook={freeHook} palette={palette} />
        </div>
      </div>

      <button
        onClick={handleDownload}
        disabled={generating}
        style={{
          width: "100%", padding: "1rem", background: "#e8e8e8", color: "#080808",
          border: "none", fontSize: "11px", letterSpacing: "0.4em",
          textTransform: "uppercase" as const, cursor: generating ? "default" : "pointer",
          fontWeight: 600, opacity: generating ? 0.6 : 1, marginBottom: "0.5rem"
        }}
      >
        {generating ? "Generando..." : done ? "¡Descargada! Compartila en Stories" : "Descargar y compartir"}
      </button>
      <p style={{ fontSize: "10px", color: "#3a3a3a", textAlign: "center", letterSpacing: "0.1em", textTransform: "uppercase" as const }}>
        Perfecta para Instagram Stories · TikTok · WhatsApp
      </p>
    </div>
  )
}

function LoadingView({ auraName, dots }: { auraName: string; dots: string }) {
  return (
    <main style={{ minHeight: "100vh", background: "#080808", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", fontFamily: "Inter, sans-serif" }}>
      <div style={{ textAlign: "center", maxWidth: "360px" }}>
        <p style={{ fontSize: "10px", letterSpacing: "0.5em", textTransform: "uppercase" as const, color: "#6b6b6b", marginBottom: "1rem" }}>Verificando pago</p>
        {auraName && (
          <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 300, color: "#e8e8e8", fontSize: "1.75rem", marginBottom: "1.5rem", lineHeight: 1.2 }}>
            {auraName}
          </h2>
        )}
        <p style={{ fontSize: "13px", color: "#6b6b6b" }}>Preparando tu roast completo{dots}</p>
        <style>{`@keyframes fade{0%,100%{opacity:.2}50%{opacity:1}}`}</style>
        <div style={{ marginTop: "2rem", display: "flex", gap: "8px", justifyContent: "center" }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#3a3a3a", animation: `fade 1.2s ${i * 0.2}s infinite` }} />
          ))}
        </div>
      </div>
    </main>
  )
}

function SuccessContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get("id")

  const [roastData, setRoastData] = useState<RoastData | null>(null)
  const [auraName, setAuraName] = useState("")
  const [freeHook, setFreeHook] = useState("")
  const [status, setStatus] = useState<"loading" | "polling" | "done" | "error">("loading")
  const [dots, setDots] = useState("")

  useEffect(() => {
    if (!id) { setStatus("error"); return }
    let polls = 0
    const MAX_POLLS = 60
    let cancelled = false

    const poll = async () => {
      if (cancelled) return
      try {
        const session = await getRoastById(id)
        if (cancelled) return
        if (!session) { setStatus("error"); return }
        setAuraName(session.aura_name)
        setFreeHook(session.free_hook)
        setStatus("polling")
        if (session.tier === "premium" && session.roast_data) {
          setRoastData(session.roast_data)
          setStatus("done")
          return
        }
        polls++
        if (polls >= MAX_POLLS) { setStatus("error"); return }
        setTimeout(poll, 2000)
      } catch {
        if (!cancelled) setStatus("error")
      }
    }

    poll()
    return () => { cancelled = true }
  }, [id])

  useEffect(() => {
    if (status !== "polling") return
    const interval = setInterval(() => setDots(d => d.length >= 3 ? "" : d + "."), 400)
    return () => clearInterval(interval)
  }, [status])

  if (status === "loading" || status === "polling") return <LoadingView auraName={auraName} dots={dots} />

  if (status === "error" || !roastData) {
    return (
      <main style={{ minHeight: "100vh", background: "#080808", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", fontFamily: "Inter, sans-serif" }}>
        <div style={{ textAlign: "center", maxWidth: "360px" }}>
          <p style={{ fontSize: "10px", letterSpacing: "0.5em", textTransform: "uppercase" as const, color: "#7f1d1d", marginBottom: "1rem" }}>Problema con el pago</p>
          <p style={{ fontSize: "14px", color: "rgba(232,232,232,0.7)", lineHeight: 1.6, marginBottom: "2rem" }}>
            Si ya pagaste, esperá unos segundos y recargá la página.
          </p>
          <button onClick={() => window.location.reload()}
            style={{ width: "100%", padding: "0.875rem", border: "1px solid rgba(232,232,232,0.2)", background: "none", fontSize: "11px", letterSpacing: "0.4em", textTransform: "uppercase" as const, color: "#e8e8e8", cursor: "pointer", marginBottom: "1rem" }}>
            Reintentar
          </button>
          <a href="/" style={{ display: "block", fontSize: "11px", color: "#6b6b6b", letterSpacing: "0.3em", textTransform: "uppercase", textDecoration: "none" }}>
            Volver al inicio
          </a>
        </div>
      </main>
    )
  }

  const hexPalette = (roastData.paleta_colores || []).map(extractHex).filter(Boolean) as string[]

  return (
    <>
      <style>{`
        @keyframes fade{0%,100%{opacity:.2}50%{opacity:1}}
        .success-grid { display: grid; grid-template-columns: 1fr; gap: 0; }
        @media(min-width: 900px) {
          .success-grid { grid-template-columns: 1fr 420px; gap: 4rem; align-items: start; }
          .success-page { padding: 4rem 3rem !important; justify-content: flex-start !important; align-items: flex-start !important; }
          .success-wrap { max-width: 960px !important; width: 100% !important; }
        }
      `}</style>
      <main className="success-page" style={{ minHeight: "100vh", background: "#080808", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "3rem 1.5rem", fontFamily: "Inter, sans-serif" }}>
        <div className="success-wrap" style={{ width: "100%", maxWidth: "480px" }}>
          <div className="success-grid">

            {/* LEFT: Roast content */}
            <div>
              <div style={{ marginBottom: "2rem" }}>
                <p style={{ fontSize: "10px", letterSpacing: "0.5em", textTransform: "uppercase" as const, color: "#6b6b6b", marginBottom: "0.5rem" }}>Tu roast completo</p>
                <h1 style={{ fontFamily: "Georgia, serif", fontWeight: 300, color: "#e8e8e8", lineHeight: 1.2, fontSize: "2rem", marginBottom: "0.75rem" }}>
                  {auraName}
                </h1>
                <p style={{ fontSize: "14px", color: "rgba(232,232,232,0.45)", fontStyle: "italic" }}>
                  &ldquo;{freeHook}&rdquo;
                </p>
              </div>

              <div style={{ borderLeft: "2px solid #7f1d1d", paddingLeft: "1.25rem", paddingTop: "0.5rem", paddingBottom: "0.5rem", marginBottom: "2rem" }}>
                <p style={{ fontSize: "14px", color: "rgba(232,232,232,0.85)", lineHeight: 1.75 }}>
                  {roastData.roast_completo}
                </p>
              </div>

              {hexPalette.length > 0 && (
                <div style={{ border: "1px solid rgba(42,42,42,0.6)", padding: "1.25rem", marginBottom: "1.5rem" }}>
                  <p style={{ fontSize: "10px", letterSpacing: "0.5em", textTransform: "uppercase" as const, color: "#6b6b6b", marginBottom: "1rem" }}>Tu paleta real</p>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    {(roastData.paleta_colores || []).map((c, i) => {
                      const hex = extractHex(c)
                      return (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", border: "1px solid rgba(255,255,255,0.06)", padding: "0.4rem 0.65rem", background: "rgba(255,255,255,0.03)" }}>
                          {hex && <div style={{ width: "14px", height: "14px", background: hex, border: "1px solid rgba(255,255,255,0.12)", flexShrink: 0 }} />}
                          <span style={{ fontSize: "11px", color: "#9a9a9a" }}>{c}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              <div style={{ border: "1px solid rgba(42,42,42,0.6)", padding: "1.25rem", background: "rgba(127,29,29,0.07)", marginBottom: "2rem" }}>
                <p style={{ fontSize: "10px", letterSpacing: "0.5em", textTransform: "uppercase" as const, color: "#6b6b6b", marginBottom: "0.75rem" }}>Consejo específico</p>
                <p style={{ fontSize: "14px", color: "rgba(232,232,232,0.8)", lineHeight: 1.65, fontStyle: "italic" }}>
                  {roastData.consejo_estatutario}
                </p>
              </div>

              <a href="/" style={{ display: "block", width: "100%", textAlign: "center", padding: "0.875rem", fontSize: "11px", letterSpacing: "0.4em", textTransform: "uppercase", color: "#6b6b6b", textDecoration: "none", border: "1px solid rgba(42,42,42,0.4)", boxSizing: "border-box" as const }}>
                Nuevo roast
              </a>
            </div>

            {/* RIGHT: Roast Card */}
            <div style={{ paddingTop: "0" }}>
              <RoastCardSection auraName={auraName} freeHook={freeHook} roastData={roastData} />
            </div>

          </div>
        </div>
      </main>
    </>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<LoadingView auraName="" dots="..." />}>
      <SuccessContent />
    </Suspense>
  )
}
