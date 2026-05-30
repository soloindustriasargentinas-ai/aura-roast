# AURA — Setup

## Stack
- Next.js 14 (App Router)
- Supabase (DB + Edge Functions)
- Framer Motion
- Claude claude-opus-4-5 (Vision)
- html-to-image (export de card)
- LemonSqueezy (pagos internacionales, disponible en Argentina)

## 1. Instalar dependencias
```bash
npm install
```

## 2. Variables de entorno
Copiar `.env.local.example` a `.env.local` y completar las 8 variables.

## 3. Base de datos
En Supabase > SQL Editor, correr el contenido de:
`supabase/migrations/001_create_user_auras.sql`

## 4. Edge Functions
```bash
npm install -g supabase

supabase login
supabase link --project-ref TU_PROJECT_REF

# Secrets (server-side, nunca en .env.local)
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=...

supabase functions deploy analyze-aura
supabase functions deploy generate-dossier
```

## 5. LemonSqueezy — configuración paso a paso

### 5.1 Crear cuenta y producto
1. Registrarse en https://lemonsqueezy.com
2. Crear una tienda (Store)
3. Crear un producto: **The Dossier — USD 15**
   - Tipo: Digital product (one-time)
   - Precio: $15 USD
4. Copiar el **Store ID** y el **Variant ID** del producto

### 5.2 Webhook
1. Ir a Settings > Webhooks > Add webhook
2. URL: `https://tu-dominio.com/api/webhooks/lemonsqueezy`
3. Eventos a activar: **order_created**
4. Copiar el **Signing Secret** generado

### 5.3 API Key
1. Ir a Settings > API > Create API Key
2. Copiar la key

### 5.4 Completar .env.local
```
LEMONSQUEEZY_API_KEY=
LEMONSQUEEZY_STORE_ID=
LEMONSQUEEZY_VARIANT_ID=
LEMONSQUEEZY_WEBHOOK_SECRET=
SUPABASE_SERVICE_ROLE_KEY=
```

## 6. Correr en local
```bash
npm run dev
```

Para testear webhooks en local usar [ngrok](https://ngrok.com):
```bash
ngrok http 3000
# Usar la URL pública de ngrok como webhook URL en LemonSqueezy
```

## Flujo de pago completo
```
Usuario sube foto
  → ImageUploader.tsx
  → Edge Function: analyze-aura
    → Claude Vision API
    → INSERT user_auras { tier: "free" }
  → AuraCard 9:16 (descargable + compartible)

Usuario quiere el Dossier completo
  → Botón "Desbloquear — USD 15"
  → POST /api/checkout { auraId, email }
    → LemonSqueezy: crea checkout con custom_data.aura_id
    → Redirige al checkout hosted de LemonSqueezy
  → Pago exitoso
    → LemonSqueezy → POST /api/webhooks/lemonsqueezy
    → Verifica firma HMAC-SHA256
    → Llama a Edge Function: generate-dossier
      → Claude (max_tokens: 4096)
      → UPDATE user_auras { tier: "premium", dossier_data }
  → Redirige a /success?auraId=...
    → Polling cada 2s hasta que dossier esté listo
    → Muestra The Dossier completo
```

## Alternativa: MercadoPago (mercado LATAM)
Si tu mercado objetivo es principalmente Argentina/LATAM, usar MercadoPago Checkout Pro:
1. Reemplazar `app/api/checkout/route.ts` con la SDK de MercadoPago
2. Cambiar `app/api/webhooks/lemonsqueezy/route.ts` por el webhook de MP (IPN)
3. El custom_data equivalente en MP se pasa como `external_reference`
```
