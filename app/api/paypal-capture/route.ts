import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

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
    const { orderID } = await req.json()
    const base = process.env.PAYPAL_BASE_URL || "https://api-m.paypal.com"
    const token = await getPayPalToken()

    const res = await fetch(`${base}/v2/checkout/orders/${orderID}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })

    const data = await res.json()

    if (data.status !== "COMPLETED") {
      return NextResponse.json({ error: "Pago no completado" }, { status: 400 })
    }

    const sessionId = data.purchase_units?.[0]?.custom_id
    if (!sessionId) return NextResponse.json({ error: "sin session id" }, { status: 400 })

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    await supabase
      .from("roast_sessions")
      .update({ tier: "premium" })
      .eq("id", sessionId)

    return NextResponse.json({ success: true, sessionId })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
