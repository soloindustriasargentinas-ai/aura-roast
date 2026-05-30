# AURA — Plan de Marketing
**tuaura.com.ar · Mayo 2026**

---

## 1. Quién es el usuario

**Perfil primario:**
- 18-35 años, LATAM (Argentina, México, Colombia principalmente)
- Activo en TikTok e Instagram
- Le interesa la moda, la estética personal, el contenido digital
- Crea contenido o quiere empezar a crearlo
- Busca diferenciarse, tener una "marca personal"

**Perfil secundario:**
- Personas que no crean contenido pero son curiosas sobre su identidad visual
- Fotógrafos, estilistas, asesores de imagen que pueden recomendar la herramienta

**Perfil que NO convierte:**
- Usuarios mayores de 45 sin presencia en redes sociales
- Usuarios sin tarjeta de débito/crédito o cuenta MercadoPago activa

---

## 2. Propuesta de valor por canal

El mensaje cambia según dónde se muestre:

| Canal | Mensaje central |
|-------|----------------|
| TikTok | "La IA analizó mi foto y me dijo exactamente quién soy estéticamente" |
| Instagram Stories | "Descubrí mi Aura — link en bio" |
| WhatsApp | "Probá esto, tarda 30 segundos y es gratis" |
| Twitter/X | "Subí una foto. La IA me dijo que soy [nombre]. ¿Y vos?" |

---

## 3. Estrategia por fase

### Fase 1 — Orgánico puro (semanas 1-4)
**Meta:** 100 análisis gratuitos, 5 dossiers vendidos. Sin presupuesto.

**Acciones concretas:**

1. **Contenido propio en TikTok/Reels (1 video por semana mínimo)**
   - Video 1: screen recording real del proceso completo (subís foto → aparece el aura)
   - Video 2: reacción genuina al resultado ("me describió perfecto / no esperaba esto")
   - Video 3: "3 cosas que cambié cuando entendí mi arquetipo visual"
   - Formato: menos de 60 segundos, subtítulos, sin producción compleja
   - Publicar martes o jueves entre 18hs y 21hs (hora Argentina)

2. **WhatsApp — distribución directa**
   - Grupos de moda, estética, emprendimiento, fotografía
   - Mensaje simple: "Probé esta cosa de IA que analiza tu foto y te dice tu identidad visual. Es gratis. tuaura.com.ar"
   - No vendas. No expliques. Dejá que el producto hable.

3. **Twitter/X — hilo de lanzamiento**
   - "Lancé una app que usa IA para analizar tu identidad visual. Esto es lo que aprendí construyéndola [hilo]"
   - Incluí tu Aura Card como imagen
   - Pedí RTs a tu red

4. **Reddit**
   - r/argentina, r/fotografía, r/moda (si existe), r/buenosaires
   - Post honesto: "Hice una app de IA que analiza tu estética visual. La lancé hoy."

---

### Fase 2 — Micro-influencers (semanas 3-8)
**Meta:** 50 análisis/día, 20 dossiers/mes. Presupuesto: USD 0 (trueque de producto).

**Cómo identificarlos:**
- Cuentas de 3.000 a 50.000 seguidores en Argentina/México/Colombia
- Nicho: moda, lifestyle, estética, contenido personal
- Engagement real (comentarios reales, no solo likes)
- Buscar en TikTok e Instagram con hashtags como #estilopropio #modaargentina #outfitcheck

**Qué ofrecés:**
- Dossier premium gratis (costo real para vos: USD 0.05 de API)
- No pedís nada a cambio formalmente — solo que lo prueben

**Qué pedís (sin presión):**
- Si les gustó, que compartan su Aura Card con el link
- Un video de reacción si quieren (no obligatorio)

**Mensaje de contacto sugerido:**
> "Hola [nombre], hice una app de IA que analiza identidad visual y genera un dossier personalizado con guiones para video, marcas afines y playlist. Me parece que encajaría bien con tu estética. Te regalo el análisis completo sin compromiso — tuaura.com.ar. Si te sirve y querés compartirlo, genial. Si no, igual espero tu feedback."

**Cantidad objetivo:** contactar 30 cuentas → 10 responden → 5 comparten → cada una trae 20-100 nuevos usuarios.

---

### Fase 3 — Loop viral (permanente desde el día 1)
**El producto ya tiene el loop construido:**
- La Aura Card tiene el link de la app incorporado
- El texto "¿Y la de tus amigos?" aparece en el resultado
- El botón de compartir genera una imagen descargable lista para Stories

**Lo que falta activar:**
- Sistema de referidos (pendiente de desarrollo): URL única por usuario, descuento o crédito si traen a alguien que paga
- Esto multiplica el efecto de cada venta

---

## 4. Contenido que funciona vs. contenido que no funciona

### Funciona
- Screen recording real del proceso (autenticidad > producción)
- Reacción genuina al resultado (sorpresa, reconocimiento)
- "POV: hice X y pasó esto"
- Comparar tu Aura con la de alguien conocido
- Mostrar el dossier real (guiones, marcas, playlist)

### No funciona
- "Nueva app de IA revolucionaria" → suena a spam
- Publicidad paga sin validación orgánica previa → presupuesto quemado
- Videos producidos como comerciales → no encajan en el feed de TikTok
- Explicar la tecnología → nadie le importa cómo funciona, les importa el resultado

---

## 5. Métricas a seguir

Sin analítica instalada actualmente, las métricas proxy son:

| Métrica | Cómo medirla |
|---------|-------------|
| Análisis gratuitos | Panel de Supabase (tabla user_auras) |
| Dossiers vendidos | Webhooks de MercadoPago + tabla user_auras con tier=premium |
| Tasa de conversión | (dossiers vendidos / análisis totales) × 100 |
| País de origen | Campo country en user_auras |
| Arquetipo más popular | Consulta en Supabase |

**Acción pendiente:** instalar Plausible Analytics o Umami (open source, gratis, GDPR) para ver tráfico por fuente sin depender de Google Analytics.

---

## 6. Presupuesto de marketing

| Ítem | Mes 1 | Mes 2-3 | Mes 4+ |
|------|-------|---------|--------|
| Publicidad paga | USD 0 | USD 0 | A evaluar si hay conversión orgánica |
| Influencers | USD 0 (trueque) | USD 0 (trueque) | USD 0-50 si se escala |
| Herramientas | USD 0 | USD 0 | USD 0 |
| **Total** | **USD 0** | **USD 0** | **USD 0-50** |

La publicidad paga (Meta Ads, TikTok Ads) no tiene sentido hasta tener:
- Al menos 20-30 ventas orgánicas que validen el producto
- Un CPM y CTR de referencia del mercado
- Suficiente presupuesto para testear (mínimo USD 200/mes para resultados significativos)

---

## 7. Fortalezas del marketing

- **El producto se vende solo:** quien lo prueba gratis ya tiene una experiencia concreta para compartir
- **Costo de adquisición casi cero** en fase orgánica
- **La Aura Card es inherentemente viral:** es una imagen estética lista para Stories
- **Propuesta clara:** "subís una foto, la IA te dice quién sos. Gratis."
- **Timing correcto:** el interés en identidad visual e IA está en su pico

---

## 8. Debilidades del marketing

- **Sin base de contactos propia:** no hay lista de emails, no hay seguidores en la cuenta de la app, no hay comunidad preexistente. Se empieza desde cero.
- **Sin prueba social:** no hay reseñas, testimonios ni casos de éxito todavía. El primer mes es el más difícil.
- **Dependencia de una sola persona:** crear contenido, responder consultas y desarrollar al mismo tiempo es insostenible a mediano plazo.
- **TikTok es impredecible:** un video puede tener 10 vistas o 100.000. No hay forma de garantizar alcance.
- **La tasa de conversión freemium típica es 2-5%:** de cada 100 que prueban gratis, entre 2 y 5 pagan. Hay que generar mucho tráfico gratuito para tener ventas consistentes.
- **Sin sistema de retención:** si el usuario no convierte en la primera visita, no hay forma de recuperarlo. Un email de seguimiento o notificación podría duplicar la conversión pero no está implementado.

---

## 9. Calendario de acciones — Mes 1

| Semana | Acción |
|--------|--------|
| 1 | Publicar hilo de lanzamiento en Twitter/X. Compartir en grupos de WhatsApp. |
| 1 | Grabar y publicar video TikTok/Reels: screen recording del proceso |
| 2 | Contactar 10 micro-influencers. Publicar segundo video: reacción al resultado |
| 2 | Post en Reddit (r/argentina u otros) |
| 3 | Seguimiento a influencers que respondieron. Tercer video: "3 cosas que aprendí" |
| 3 | Revisar datos en Supabase: ¿cuántos análisis? ¿cuántos pagos? ¿qué país? |
| 4 | Ajustar mensaje según lo que funcionó. Contactar 20 influencers más. |
| 4 | Instalar Plausible/Umami para tener analítica real desde el mes 2 |

---

## 10. Cuándo escalar con publicidad paga

Activar Meta Ads o TikTok Ads **solo cuando:**
- Se hayan generado al menos 30 ventas orgánicas (valida que el producto convierte)
- Se conozca la tasa de conversión real (para calcular el CPA máximo viable)
- Haya al menos USD 200/mes de presupuesto publicitario disponible
- Haya al menos un video orgánico con tracción comprobada para usar como creativo

**CPA máximo viable:** con un ticket de USD 7 y margen del 95%, se pueden gastar hasta USD 3-4 en adquirir un cliente pagador y seguir siendo rentable.
