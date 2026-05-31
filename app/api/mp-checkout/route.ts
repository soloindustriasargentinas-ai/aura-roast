import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { sessionId, country } = await req.json()
    const accessToken = process.env.MP_ACCESS_TOKEN!
    const baseUrl = process.env.SITE_URL || "https://aura-roast.onrender.com"

    const preference = {
      items: [{
        title: "AURA ROAST — Roast completo",
        quantity: 1,
        unit_price: 3,
        currency_id: "USD"
      }],
      external_reference: sessionId,
      back_urls: {
        success: `${baseUrl}/success?id=${sessionId}`,
        failure: `${baseUrl}/?error=pago_fallido`,
        pending: `${baseUrl}/success?id=${sessionId}`
      },
      auto_return: "approved",
      statement_descriptor: "AURA ROAST"
    }

    const res = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(preference)
    })

    const data = await res.json()
    console.log("MP response:", JSON.stringify(data))

    if (!res.ok) {
      return NextResponse.json({ error: data.message || "MP error", details: data }, { status: 400 })
    }

    const url = data.init_point
    return NextResponse.json({ url })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
