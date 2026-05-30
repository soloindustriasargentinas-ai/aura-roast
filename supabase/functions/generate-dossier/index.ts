import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
}

const DOSSIER_SYSTEM_PROMPT = `Eres AURA, un Director Creativo de élite con profundo conocimiento del mercado latinoamericano. Se te proporciona el análisis de Aura de un usuario y su país/región. Tu tarea es generar el "Dossier Premium" — un reporte profundo de identidad visual con referencias REALES y DISPONIBLES en su mercado.

INSTRUCCIÓN CRÍTICA: Responde ÚNICAMENTE con JSON válido. Sin texto adicional.
IMPORTANTE: Las marcas, canciones y referencias deben ser accesibles en Argentina/LATAM cuando corresponda. Prioriza marcas con presencia en la región o disponibles online con envío a LATAM.

Estructura exacta requerida:
{
  "extended_analysis": "Análisis profundo de 3-4 párrafos sobre la identidad visual, referencias culturales latinoamericanas y globales relevantes, y cómo esta persona puede monetizar su estética en el mercado digital actual.",
  "video_scripts": [
    {
      "title": "Título del video",
      "hook": "Los primeros 3 segundos — la frase que detiene el scroll.",
      "script": "Guión completo de 30-60 segundos con instrucciones de producción.",
      "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5"]
    },
    {
      "title": "Título del segundo video",
      "hook": "Hook diferente al anterior.",
      "script": "Segundo guión.",
      "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3"]
    },
    {
      "title": "Título del tercer video",
      "hook": "Hook para el tercer video.",
      "script": "Tercer guión.",
      "hashtags": ["#hashtag1", "#hashtag2"]
    }
  ],
  "brand_analysis": [
    {
      "brand": "Nombre exacto de la marca",
      "website": "dominio.com (solo el dominio, sin https://)",
      "reason": "Por qué esta marca es coherente con su Aura y está disponible en su región.",
      "specific_items": ["Ítem específico real de la marca 1", "Ítem específico real 2"]
    },
    {
      "brand": "Segunda marca",
      "website": "dominio.com",
      "reason": "Razón de coherencia estética.",
      "specific_items": ["Ítem 1", "Ítem 2"]
    },
    {
      "brand": "Tercera marca",
      "website": "dominio.com",
      "reason": "Razón.",
      "specific_items": ["Ítem 1"]
    }
  ],
  "spotify_playlist": [
    { "track": "Nombre exacto de canción", "artist": "Artista exacto", "why": "Por qué esta canción captura su energía." },
    { "track": "Canción 2", "artist": "Artista 2", "why": "Razón." },
    { "track": "Canción 3", "artist": "Artista 3", "why": "Razón." },
    { "track": "Canción 4", "artist": "Artista 4", "why": "Razón." },
    { "track": "Canción 5", "artist": "Artista 5", "why": "Razón." },
    { "track": "Canción 6", "artist": "Artista 6", "why": "Razón." }
  ],
  "mood_board": [
    { "query": "término de búsqueda en inglés para unsplash (2-3 palabras)", "caption": "Por qué esta imagen representa su aura." },
    { "query": "segundo término visual", "caption": "Descripción." },
    { "query": "tercer término visual", "caption": "Descripción." },
    { "query": "cuarto término visual", "caption": "Descripción." }
  ],
  "style_guide": {
    "core_pieces": ["Prenda/accesorio esencial 1", "Prenda/accesorio esencial 2", "Prenda/accesorio esencial 3"],
    "avoid": ["Qué evitar 1", "Qué evitar 2"],
    "investment_priority": "En qué pieza invertir primero y por qué."
  }
}`

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS })
  }

  try {
    const { auraId, email, country } = await req.json()

    if (!auraId) {
      return new Response(JSON.stringify({ error: "auraId requerido" }), {
        status: 400,
        headers: { ...CORS, "content-type": "application/json" }
      })
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    )

    // Fetch existing aura record
    const { data: auraRecord, error: fetchError } = await supabase
      .from("user_auras")
      .select("*")
      .eq("id", auraId)
      .single()

    if (fetchError || !auraRecord) {
      return new Response(JSON.stringify({ error: "Aura no encontrada" }), {
        status: 404,
        headers: { ...CORS, "content-type": "application/json" }
      })
    }

    // If dossier already exists, return it (idempotent)
    if (auraRecord.dossier_data) {
      return new Response(
        JSON.stringify({ success: true, dossier: auraRecord.dossier_data }),
        { headers: { ...CORS, "content-type": "application/json" } }
      )
    }

    const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY")!
    const currentLevel = auraRecord.level ?? 1

    // For Level 2+, fetch parent dossier to use as evolution context
    let evolutionContext = ""
    if (auraRecord.parent_aura_id) {
      const { data: parentRecord } = await supabase
        .from("user_auras")
        .select("aura_data, dossier_data, level")
        .eq("id", auraRecord.parent_aura_id)
        .single()

      if (parentRecord?.dossier_data) {
        const prevLevel = parentRecord.level ?? currentLevel - 1
        evolutionContext = `\n\nCONTEXTO DE EVOLUCIÓN (este es el Dossier Nivel ${currentLevel}, continuación del Nivel ${prevLevel}):
El usuario ya ejecutó parte del dossier anterior. A continuación está ese dossier previo — NO repetir las mismas marcas, guiones ni canciones. Generar contenido más profundo, más avanzado, que asuma mayor dominio y experiencia de quien lo lee.

DOSSIER NIVEL ${prevLevel} (no repetir):
${JSON.stringify(parentRecord.dossier_data, null, 2)}`
      }
    }

    const levelInstruction = currentLevel > 1
      ? `\n\nNIVEL ${currentLevel}: Este es un Dossier de evolución. El usuario ya ejecutó el nivel anterior. El contenido debe ser MÁS AVANZADO, más profundo, con referencias distintas a las del nivel previo. Asumí que el usuario ya tiene experiencia y audiencia inicial.`
      : ""

    const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 2500,
        system: DOSSIER_SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: `Genera el Dossier Premium basándote en este análisis de Aura:\n\n${JSON.stringify(auraRecord.aura_data, null, 2)}\n\nPaís/región del usuario: ${country || "Argentina"}\nEmail: ${email || "desconocido"}\n\nPriorizá marcas y referencias disponibles en ${country || "Argentina"}/LATAM.${levelInstruction}${evolutionContext}`
          }
        ]
      })
    })

    if (!claudeRes.ok) throw new Error(`Claude API error: ${claudeRes.status}`)

    const claudeData = await claudeRes.json()
    const rawText = claudeData.content[0]?.text

    let dossierJson
    try {
      dossierJson = JSON.parse(rawText)
    } catch {
      const cleaned = rawText.replace(/```json?\n?/g, "").replace(/```/g, "").trim()
      dossierJson = JSON.parse(cleaned)
    }

    // Update record with dossier + upgrade tier (preserve level and parent_aura_id)
    const { error: updateError } = await supabase
      .from("user_auras")
      .update({
        tier: "premium",
        dossier_data: dossierJson,
        email: email || auraRecord.email
      })
      .eq("id", auraId)

    if (updateError) throw new Error(`DB update error: ${updateError.message}`)

    return new Response(JSON.stringify({ success: true, dossier: dossierJson }), {
      headers: { ...CORS, "content-type": "application/json" }
    })
  } catch (err) {
    console.error("generate-dossier error:", err)
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...CORS, "content-type": "application/json" }
    })
  }
})
