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

export async function GET(req: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://roast.tuaura.com.ar"
  const { searchParams } = new URL(req.url)
  const token = searchParams.get("token")       // PayPal order ID
  const sessionId = searchParams.get("sessionId")

  if (!token || !sessionId) {
    return NextResponse.redirect(`${baseUrl}/?error=pago_fallido`)
  }

  try {
    const ppBase = process.env.PAYPAL_BASE_URL || "https://api-m.paypal.com"
    const ppToken = await getPayPalToken()

    const captureRes = await fetch(`${ppBase}/v2/checkout/orders/${token}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ppToken}`,
        "Content-Type": "application/json"
      }
    })

    const data = await captureRes.json()

    if (data.status !== "COMPLETED") {
      return NextResponse.redirect(`${baseUrl}/?error=pago_fallido`)
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    await supabase
      .from("roast_sessions")
      .update({ tier: "premium" })
      .eq("id", sessionId)

    return NextResponse.redirect(`${baseUrl}/success?id=${sessionId}`)
  } catch (err) {
    console.error("paypal-return error:", err)
    return NextResponse.redirect(`${baseUrl}/?error=pago_fallido`)
  }
}
