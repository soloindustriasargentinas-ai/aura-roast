import { NextRequest, NextResponse } from "next/server"

async function getPayPalToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID!
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET!
  const base = process.env.PAYPAL_BASE_URL || "https://api-m.paypal.com"

  const res = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  })
  const data = await res.json()
  return data.access_token
}

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json()
    const base = process.env.PAYPAL_BASE_URL || "https://api-m.paypal.com"
    const token = await getPayPalToken()

    const res = await fetch(`${base}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{
          amount: { currency_code: "USD", value: "3.00" },
          custom_id: sessionId,
          description: "AURA ROAST — Roast completo"
        }],
        application_context: {
          return_url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://roast.tuaura.com.ar"}/api/paypal-return?sessionId=${sessionId}`,
          cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://roast.tuaura.com.ar"}/?error=pago_cancelado`,
          brand_name: "AURA ROAST",
          user_action: "PAY_NOW"
        }
      })
    })

    const data = await res.json()
    return NextResponse.json({ orderID: data.id })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
