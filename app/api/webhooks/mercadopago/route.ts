import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const paymentId = body.data?.id
    if (body.type !== "payment" || !paymentId) {
      return NextResponse.json({ received: true })
    }

    const accessToken = process.env.MP_ACCESS_TOKEN!
    const paymentRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })

    if (!paymentRes.ok) return NextResponse.json({ received: true })

    const payment = await paymentRes.json()
    if (payment.status !== "approved") return NextResponse.json({ received: true })

    const sessionId = payment.external_reference
    if (!sessionId) return NextResponse.json({ received: true })

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    await supabase
      .from("roast_sessions")
      .update({ tier: "premium" })
      .eq("id", sessionId)

    return NextResponse.json({ received: true, action: "unlocked" })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
