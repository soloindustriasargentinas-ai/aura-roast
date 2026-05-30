# AURA — Plan de Negocios
**tuaura.com.ar · Mayo 2026**

---

## 1. El producto

AURA es una app web que analiza una foto del usuario con IA (Claude de Anthropic) y devuelve su "identidad visual": nombre de aura, arquetipo, paleta de colores, descripción y hook narrativo.

**Tier gratuito:** análisis completo de identidad visual. Sin cuenta, sin email, en 30 segundos.

**Tier premium — "The Dossier" (USD 7 LATAM / USD 12 internacional):**
- Análisis extendido (3-4 párrafos)
- 3 guiones listos para filmar en Reels/TikTok
- Marcas reales afines al arquetipo con productos específicos
- Playlist de Spotify personalizada
- Mood board con referencias visuales
- Guía de estilo con prendas esenciales y qué evitar

**Tier evolución — Nivel 2 (USD 10 LATAM / USD 17 internacional):**
- Dossier nuevo que parte del anterior, más profundo, sin repeticiones

---

## 2. Estado actual

| Ítem | Estado |
|------|--------|
| App en producción | ✅ tuaura.com.ar |
| Análisis con IA | ✅ Funcional |
| Pago MercadoPago | ✅ Probado con pago real |
| Pago LemonSqueezy | ⏳ Pendiente de aprobación |
| Dossier generado post-pago | ✅ Funcional |
| Servidor siempre activo | ⏳ Pendiente (USD 7/mes Render Starter) |

---

## 3. Estructura de costos

### Costos fijos mensuales

| Concepto | Costo |
|----------|-------|
| Render Starter (servidor) | USD 7 |
| Supabase (DB + Edge Functions) | USD 0 (free tier hasta ~500 usuarios activos) |
| Dominio tuaura.com.ar | USD 1 aprox (prorrateado) |
| **Total fijo** | **USD 8/mes** |

### Costos variables por dossier generado

| Concepto | Costo estimado |
|----------|---------------|
| Claude Sonnet API (~2500 tokens in/out) | USD 0.04–0.06 |
| MercadoPago comisión (~3.49% + IVA) | USD 0.27 por dossier de USD 7 |
| **Costo variable total por venta** | **USD 0.31–0.33** |

**Margen neto por dossier LATAM: USD 6.67–6.69 (95%)**

---

## 4. Proyecciones de ingresos (realistas)

### Escenario conservador

| Mes | Análisis gratuitos | Conversión | Dossiers vendidos | Ingreso bruto |
|-----|-------------------|------------|-------------------|---------------|
| 1 | 100 | 4% | 4 | USD 28 |
| 2 | 250 | 5% | 12 | USD 84 |
| 3 | 500 | 5% | 25 | USD 175 |
| 6 | 1.500 | 6% | 90 | USD 630 |
| 12 | 3.000 | 7% | 210 | USD 1.470 |

### Escenario con tracción (2-3 videos virales + micro-influencers)

| Mes | Análisis gratuitos | Conversión | Dossiers vendidos | Ingreso bruto |
|-----|-------------------|------------|-------------------|---------------|
| 1 | 400 | 5% | 20 | USD 140 |
| 2 | 1.200 | 6% | 72 | USD 504 |
| 3 | 3.000 | 6% | 180 | USD 1.260 |
| 6 | 8.000 | 7% | 560 | USD 3.920 |
| 12 | 15.000 | 8% | 1.200 | USD 8.400 |

**Punto de equilibrio (break-even):** 2 dossiers vendidos por mes cubren la infraestructura.

---

## 5. Fortalezas

- **Fricción mínima:** sin cuenta, sin email, sin contraseña. Una foto y listo.
- **Costo de operación casi cero a escala pequeña:** margen del 95% por venta.
- **Loop viral incorporado:** la Aura Card es shareable y lleva el link de la app.
- **MercadoPago funcionando:** crítico para LATAM donde las tarjetas internacionales tienen fricción.
- **Producto único en LATAM:** no hay competencia directa en el segmento de identidad visual con IA.
- **Modelo freemium real:** el tier gratuito tiene valor genuino, no es un gancho vacío.
- **Sin dependencia de equipo:** una persona puede operar y escalar hasta varios miles de usuarios.

---

## 6. Debilidades

- **Sin retención:** no hay email, no hay notificaciones, no hay forma de volver a contactar al usuario después de la primera visita. Si no convierte en el momento, se pierde.
- **Servidor gratuito (por ahora):** el primer request después de inactividad tarda 30-60 segundos. Mata conversiones.
- **Sin analítica:** no se sabe de dónde vienen los usuarios, qué arquetipo es el más popular, dónde abandonan.
- **Dependencia de Anthropic:** si Claude sube precios o cae, el producto se detiene. No hay alternativa configurada.
- **LemonSqueezy pendiente:** bloquea ventas fuera de LATAM (España, USA, Europa).
- **Sin sistema de soporte:** si un pago falla o el dossier no llega, no hay canal claro para que el usuario lo reporte.
- **Una sola persona:** marketing, desarrollo y soporte recaen en el mismo lugar. Cuello de botella real.
- **Supabase free tier tiene límites:** 50MB de base de datos y 2GB de ancho de banda. Alcanzable en un escenario de tracción fuerte.

---

## 7. Riesgos y mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| Claude API sube precios | Media | Alto | Márgenes actuales absorben hasta 10x el costo actual |
| Supabase supera free tier | Baja (corto plazo) | Medio | Plan Pro USD 25/mes, se activa si hay ingresos |
| Chargeback en MercadoPago | Baja | Medio | El producto es digital, entregado inmediatamente |
| Competencia de producto similar | Media (6-12 meses) | Alto | Velocidad de lanzamiento y comunidad como ventaja |
| Dossier tarda mucho y usuario abandona | Baja (mitigado) | Alto | Modelo Sonnet + fire-and-forget resuelto |

---

## 8. Modelo de crecimiento a 12 meses

**Fase 1 (meses 1-2):** validación orgánica. Meta: 20 dossiers vendidos totales.

**Fase 2 (meses 2-4):** micro-influencers + contenido propio. Meta: 50 dossiers/mes.

**Fase 3 (meses 4-8):** si hay tracción, activar LemonSqueezy para mercado internacional. Meta: 150 dossiers/mes mixto.

**Fase 4 (meses 8-12):** evaluar sistema de referidos, plan B2B (fotógrafos, estilistas, agencias de contenido). Meta: USD 2.000/mes.

---

## 9. Lo que este plan NO es

- No es una startup de venture capital. No necesita inversión externa.
- No proyecta unicornios. USD 2.000/mes en 12 meses es un objetivo realista y significativo.
- No depende de publicidad paga para funcionar.
- No requiere equipo. Una persona puede llevarlo hasta USD 5.000/mes antes de necesitar ayuda.
