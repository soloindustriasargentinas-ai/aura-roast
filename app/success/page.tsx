"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { getRoastById } from "@/lib/supabase"
import type { RoastData } from "@/lib/types"

const S: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#080808", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "4rem 1.5rem", fontFamily: "Inter, sans-serif" },
  wrap: { width: "100%", maxWidth: "440px" },
  label: { fontSize: "10px", letterSpacing: "0.5em", textTransform: "uppercase" as const, color: "#6b6b6b" },
}

function extractHex(str: string): string | null {
  const m = str.match(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})/)
  return m ? m[0] : null
}

function LoadingView({ auraName, dots }: { auraName: string; dots: string }) {
  return (
    <main style={S.page}>
      <div style={{ ...S.wrap, textAlign: "center" }}>
        <p style={{ ...S.label, marginBottom: "1rem" }}>Verificando pago</p>
        {auraName && (
          <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 300, color: "#e8e8e8", fontSize: "1.75rem", marginBottom: "1.5rem", lineHeight: 1.2 }}>
            {auraName}
          </h2>
        )}
        <p style={{ fontSize: "13px", color: "#6b6b6b", letterSpacing: "0.05em" }}>
          Preparando tu roast completo{dots}
        </p>
        <div style={{ marginTop: "2rem", display: "flex", gap: "8px", justifyContent: "center" }}>
          {[0, 1, 2].map(i => (
            <div
              key={i}
              style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#3a3a3a", animationName: "fade", animationDuration: "1.2s", animationDelay: `${i * 0.2}s`, animationIterationCount: "infinite", animationTimingFunction: "ease-in-out" }}
            />
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
    const interval = setInterval(() => {
      setDots(d => d.length >= 3 ? "" : d + ".")
    }, 400)
    return () => clearInterval(interval)
  }, [status])

  if (status === "loading" || status === "polling") {
    return <LoadingView auraName={auraName} dots={dots} />
  }

  if (status === "error" || !roastData) {
    return (
      <main style={S.page}>
        <div style={{ ...S.wrap, textAlign: "center" }}>
          <p style={{ ...S.label, marginBottom: "1rem", color: "#7f1d1d" }}>Problema con el pago</p>
          <p style={{ fontSize: "14px", color: "rgba(232,232,232,0.7)", lineHeight: 1.6, marginBottom: "0.5rem" }}>
            No pudimos verificar tu pago aún.
          </p>
          <p style={{ fontSize: "12px", color: "#6b6b6b", lineHeight: 1.6, marginBottom: "2rem" }}>
            Si ya pagaste, esperá unos segundos y recargá la página.
          </p>
          {id && (
            <button
              onClick={() => { setStatus("loading"); setDots(""); window.location.reload() }}
              style={{ width: "100%", padding: "0.875rem", border: "1px solid rgba(232,232,232,0.2)", background: "none", fontSize: "11px", letterSpacing: "0.4em", textTransform: "uppercase" as const, color: "#e8e8e8", cursor: "pointer", marginBottom: "1rem" }}
            >
              Reintentar
            </button>
          )}
          <a href="/" style={{ display: "block", fontSize: "11px", color: "#6b6b6b", letterSpacing: "0.3em", textTransform: "uppercase", textDecoration: "none" }}>
            Volver al inicio
          </a>
        </div>
      </main>
    )
  }

  return (
    <main style={S.page}>
      <style>{`@keyframes fade { 0%,100%{opacity:0.2} 50%{opacity:1} }`}</style>
      <div style={S.wrap}>

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <p style={{ ...S.label, marginBottom: "0.5rem" }}>Tu roast completo</p>
          <h1 style={{ fontFamily: "Georgia, serif", fontWeight: 300, color: "#e8e8e8", lineHeight: 1.2, fontSize: "2.25rem", marginBottom: "0.75rem" }}>
            {auraName}
          </h1>
          <p style={{ fontSize: "14px", color: "rgba(232,232,232,0.5)", fontStyle: "italic" }}>
            &ldquo;{freeHook}&rdquo;
          </p>
        </div>

        <div style={{ borderLeft: "2px solid #7f1d1d", paddingLeft: "1.25rem", paddingTop: "0.5rem", paddingBottom: "0.5rem", marginBottom: "2rem" }}>
          <p style={{ fontSize: "14px", color: "rgba(232,232,232,0.85)", lineHeight: 1.75 }}>
            {roastData.roast_completo}
          </p>
        </div>

        {roastData.paleta_colores?.length > 0 && (
          <div style={{ border: "1px solid rgba(42,42,42,0.6)", padding: "1.25rem", marginBottom: "1.5rem" }}>
            <p style={{ ...S.label, marginBottom: "1rem" }}>Tu paleta real</p>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {roastData.paleta_colores.map((c, i) => {
                const hex = extractHex(c)
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", border: "1px solid rgba(255,255,255,0.06)", padding: "0.4rem 0.65rem", background: "rgba(255,255,255,0.03)" }}>
                    {hex && <div style={{ width: "14px", height: "14px", background: hex, border: "1px solid rgba(255,255,255,0.12)", flexShrink: 0 }} />}
                    <span style={{ fontSize: "11px", color: "#9a9a9a", letterSpacing: "0.03em" }}>{c}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div style={{ border: "1px solid rgba(42,42,42,0.6)", padding: "1.25rem", background: "rgba(127,29,29,0.07)", marginBottom: "2rem" }}>
          <p style={{ ...S.label, marginBottom: "0.75rem" }}>Consejo específico</p>
          <p style={{ fontSize: "14px", color: "rgba(232,232,232,0.8)", lineHeight: 1.65, fontStyle: "italic" }}>
            {roastData.consejo_estatutario}
          </p>
        </div>

        <a
          href="/"
          style={{ display: "block", width: "100%", textAlign: "center", padding: "0.875rem", fontSize: "11px", letterSpacing: "0.4em", textTransform: "uppercase", color: "#6b6b6b", textDecoration: "none", border: "1px solid rgba(42,42,42,0.4)", boxSizing: "border-box" as const }}
        >
          Nuevo roast
        </a>
      </div>
    </main>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<LoadingView auraName="" dots="..." />}>
      <SuccessContent />
    </Suspense>
  )
}
