import { createClient, SupabaseClient } from "@supabase/supabase-js"
import type { RoastSession } from "./types"

let _client: SupabaseClient | null = null

function getClient(): SupabaseClient {
  if (!_client) {
    _client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return _client
}

export async function getRoastById(id: string): Promise<RoastSession | null> {
  const { data, error } = await getClient()
    .from("roast_sessions")
    .select("*")
    .eq("id", id)
    .single()
  if (error) return null
  return data as RoastSession
}

export async function analyzeRoast(
  imageBase64: string,
  imageType: string,
  country: string
): Promise<{ id: string; aura_name: string; free_hook: string; image_url: string | null }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  const res = await fetch(`${supabaseUrl}/functions/v1/analyze-roast`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${supabaseAnonKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ imageBase64, imageType, country })
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Error ${res.status}: ${text}`)
  }

  return await res.json()
}
