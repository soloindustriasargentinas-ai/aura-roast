import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
}

const ROAST_PROMPT = `Eres el Crítico Estético Jefe de AURA ROAST. Tu especialidad es la semiótica visual, la psicología de la moda y el análisis de la cultura pop. No eres amable, no eres políticamente correcto, pero eres extremadamente inteligente, sofisticado y mordaz. Hablas como un director de arte de Milán o Nueva York que está cansado de ver estéticas genéricas en redes sociales.

Analiza la fotografía del usuario. Asígnale una etiqueta de identidad irónica pero dolorosamente precisa y redacta un "Roast" sobre lo que su imagen proyecta realmente en el mundo digital.

INSTRUCCIÓN CRÍTICA: Responde ÚNICAMENTE con JSON válido. Sin texto adicional.

{
  "aura_name": "Nombre de la estética irónico y memorable (ej: 'Minimalista Pretencioso de Palermo', 'Crypto-Bro de Departamento Alquilado', 'Lujo Silencioso de Segunda Mano')",
  "free_hook": "Una sola frase letal, el diagnóstico inicial gratuito que dejará al usuario con ganas de leer más.",
  "roast_completo": "Un párrafo de 4 líneas que destruya con elegancia, precisión y terminología de moda/diseño sus elecciones estéticas, lenguaje corporal y entorno.",
  "paleta_colores": ["#HEX1", "#HEX2", "#HEX3"],
  "consejo_estatutario": "Qué pequeña cosa física o visual debe cambiar hoy mismo para dejar de proyectar esa vibra ineficiente."
}

Usa Español de Argentina refinado, irónico y maduro. Evita insultos vulgares; prefiere la humillación intelectual basada en el mal gusto o la falta de autenticidad visual.`

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS })

  try {
    const { imageBase64, imageType, country } = await req.json()

    if (!imageBase64) {
      return new Response(JSON.stringify({ error: "imagen requerida" }), {
        status: 400, headers: { ...CORS, "content-type": "application/json" }
      })
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    )

    const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY")!

    const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        system: ROAST_PROMPT,
        messages: [{
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: imageType, data: imageBase64 }
            },
            {
              type: "text",
              text: `Analiza esta imagen y genera el roast. País del usuario: ${country || "Argentina"}.`
            }
          ]
        }]
      })
    })

    if (!claudeRes.ok) throw new Error(`Claude error: ${claudeRes.status}`)

    const claudeData = await claudeRes.json()
    const rawText = claudeData.content[0]?.text

    let roastJson
    try {
      roastJson = JSON.parse(rawText)
    } catch {
      const cleaned = rawText.replace(/```json?\n?/g, "").replace(/```/g, "").trim()
      roastJson = JSON.parse(cleaned)
    }

    // Upload image to Supabase Storage
    let imageUrl: string | null = null
    try {
      const imageBuffer = Uint8Array.from(atob(imageBase64), c => c.charCodeAt(0))
      const ext = imageType.split("/")[1] || "jpg"
      const filename = `roast-${Date.now()}.${ext}`
      const { data: uploadData } = await supabase.storage
        .from("roast-images")
        .upload(filename, imageBuffer, { contentType: imageType, upsert: false })
      if (uploadData) {
        const { data: urlData } = supabase.storage.from("roast-images").getPublicUrl(filename)
        imageUrl = urlData.publicUrl
      }
    } catch {}

    // Save to DB
    const { data: session, error } = await supabase
      .from("roast_sessions")
      .insert({
        tier: "free",
        aura_name: roastJson.aura_name,
        free_hook: roastJson.free_hook,
        roast_data: roastJson,
        image_url: imageUrl,
        country: country || "Argentina"
      })
      .select("id")
      .single()

    if (error) throw new Error(error.message)

    return new Response(JSON.stringify({
      id: session.id,
      aura_name: roastJson.aura_name,
      free_hook: roastJson.free_hook,
      image_url: imageUrl
    }), { headers: { ...CORS, "content-type": "application/json" } })

  } catch (err) {
    console.error("analyze-roast error:", err)
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500, headers: { ...CORS, "content-type": "application/json" }
    })
  }
})
