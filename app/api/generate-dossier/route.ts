import { NextRequest, NextResponse } from "next/server"

export const maxDuration = 30

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  try {
    const { auraName, archetype, narrativeHook, country } = await req.json()

    const name = auraName ?? "tu Aura"
    const arch = archetype ?? "El Creativo"
    const hook = narrativeHook ?? ""
    const region = country || "Argentina"

    const mockDossier = {
      extended_analysis: `${name} es una de las expresiones visuales más particulares del espectro estético contemporáneo. Tu arquetipo "${arch}" no es una etiqueta — es una frecuencia que emitís en cada elección visual, desde cómo componés un selfie hasta la paleta cromática de tu feed.\n\nEn el contexto latinoamericano actual, este tipo de identidad tiene una ventaja competitiva brutal: es auténtica en un mercado saturado de copias. El mercado digital de LATAM está hambriento de referencias propias, no importadas. Tu estética tiene el potencial de convertirse en referencia cultural, no solo en contenido.\n\nLa clave de monetización para "${arch}" está en la autoridad narrativa: no vendés productos, vendés un punto de vista. Los creadores con este perfil generan comunidades más leales que los que tienen el doble de seguidores con una identidad difusa.\n\nTu próximo nivel de crecimiento requiere consistencia radical: la misma energía que proyectás en tu persona tiene que estar en cada touchpoint de tu presencia digital.`,
      video_scripts: [
        {
          title: `El arquetipo ${arch} — ¿Qué dice tu ropa de vos?`,
          hook: `"${hook || `Tardé años en entender por qué mi ropa nunca me representaba. Hasta que la IA analizó mi foto.`}"`,
          script: `APERTURA (0-3s): Plano fijo de tu cara mirando a cámara. Sin música todavía. Pausa de 2 segundos.\n\nDESARROLLO (3-25s): Corte a tu outfit completo desde arriba. Voz en off: "Me dijeron que soy ${name}. Y por primera vez, una descripción me cerró completamente."\nMostrás la card de Aura en pantalla durante 3 segundos.\n\nCIERRE (25-35s): Volvés a cámara. "Probalo gratis — link en bio. Comentame qué Aura te dió."\n\nPRODUCCIÓN: Iluminación lateral. Fondo neutro o el de tu Aura. Sin efectos.`,
          hashtags: ["#AuraVisual", "#IdentidadEstética", "#IAModa", "#EstiloPersonal", "#CreadorLatam"]
        },
        {
          title: "POV: La IA analizó mi foto y esto pasó",
          hook: `"POV: Subís una foto y la IA te dice exactamente quién sos estéticamente."`,
          script: `FORMATO: Screen recording del proceso en tuaura.com.ar\n\nAPERTURA (0-5s): Mostrás la pantalla con la foto ya subida, el loading del análisis.\n\nREVELACIÓN (5-15s): Aparece el nombre del Aura. Reacción genuina de sorpresa o reconocimiento.\n\nLECTURA (15-40s): Mostrás el arquetipo y el narrative hook. Voz en off leyendo lo más impactante del análisis.\n\nCIERRE (40-50s): "Si querés saber el tuyo — link en bio. Es gratis."`,
          hashtags: ["#IACreativa", "#TuAura", "#EstéticaPersonal", "#AutoconocimientoVisual", "#LATAM"]
        },
        {
          title: `3 cosas que aprendí sobre mi estética siendo ${arch}`,
          hook: `"3 cosas que cambié cuando entendí que soy ${arch}."`,
          script: `FORMATO: Talking head con edición rápida.\n\nCosa 1 (0-12s): "Dejé de comprar ropa 'por si acaso'. Empecé a comprar solo lo que habla mi idioma visual."\nCosa 2 (12-24s): "Entendí que mi paleta de colores no es capricho — es mi firma."\nCosa 3 (24-36s): "Empecé a crear contenido desde mi arquetipo, no desde las tendencias. Y todo cambió."\n\nCIERRE (36-45s): "Link en bio para saber cuál es el tuyo. Tarda 30 segundos."`,
          hashtags: ["#DesarrolloPersonal", "#EstiloDeVida", "#ComunidadCreativa", "#AuraVisual", "#Autenticidad"]
        }
      ],
      brand_analysis: [
        {
          brand: "Zara",
          website: "zara.com",
          reason: `Zara tiene piezas que hablan directamente al arquetipo ${arch} — básicos estructurados con detalles inesperados. Su línea Studio tiene referencias editoriales accesibles perfectas para construir tu armario base en ${region}.`,
          specific_items: ["Blazer oversize en tono neutro", "Pantalón de corte recto en negro o crudo"]
        },
        {
          brand: "MANGO",
          website: "mango.com",
          reason: `MANGO captura la sofisticación accesible que resuena con tu energía visual. Tienen presencia online con envío a toda LATAM y una línea editorial que matchea con tu paleta.`,
          specific_items: ["Camisa de lino en colores tierra", "Cardigan de punto fino"]
        },
        {
          brand: "Massimo Dutti",
          website: "massimodutti.com",
          reason: `Para los momentos en que tu Aura necesita hablar con más autoridad. El lujo silencioso de Massimo Dutti es coherente con la profundidad que proyectás como ${arch}.`,
          specific_items: ["Cinturón de cuero trenzado", "Mocasines en cuero mate"]
        }
      ],
      spotify_playlist: [
        { track: "Intro", artist: "The xx", why: "La tensión y el espacio de esta canción capturan perfectamente la energía contenida del arquetipo." },
        { track: "White Ferrari", artist: "Frank Ocean", why: "Nostalgia sofisticada — la misma que proyectás en tu estética visual." },
        { track: "Pyramids", artist: "Frank Ocean", why: "Épico y personal al mismo tiempo. Como tu Aura." },
        { track: "Motion Sickness", artist: "Phoebe Bridgers", why: "Vulnerabilidad convertida en arte — eso es lo que hace un verdadero creador de contenido." },
        { track: "Electric Feel", artist: "MGMT", why: "La energía que necesitás para crear contenido. Sube el tono sin perder la esencia." },
        { track: "Midnight City", artist: "M83", why: "Cinematográfico. Perfecto para entrar en personaje antes de grabar." }
      ],
      mood_board: [
        { query: "editorial fashion dark aesthetic", caption: "La tensión visual que define tu paleta — contraste sin esfuerzo." },
        { query: "minimalist architecture interior", caption: "El espacio donde tu Aura respira — limpio, deliberado, con intención." },
        { query: "film noir portrait lighting", caption: "La iluminación que va con tu arquetipo — sombras que revelan más que la luz." },
        { query: "luxury fashion detail texture", caption: "Los detalles que hacen la diferencia — tu ojo está entrenado para esto." }
      ],
      style_guide: {
        core_pieces: [
          "Un blazer oversize en negro, blanco roto o camel — tu prenda de autoridad",
          "Pantalón de corte recto, sin estampados — el canvas de tu Aura",
          "Una pieza de color de tu paleta principal — el toque que te identifica"
        ],
        avoid: [
          "Estampados llamativos sin coherencia con tu paleta — ruido visual que diluye tu identidad",
          "Accesorios en exceso — menos es tu lenguaje"
        ],
        investment_priority: `Invertí primero en calzado. Es lo que el ojo detecta inconscientemente y lo que más impacta en la lectura de tu Aura como ${arch}. Un par de buena calidad transforma cualquier outfit.`
      }
    }

    return NextResponse.json({ success: true, dossier: mockDossier })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
