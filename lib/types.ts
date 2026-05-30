export interface RoastData {
  aura_name: string
  free_hook: string
  roast_completo: string
  paleta_colores: string[]
  consejo_estatutario: string
}

export interface RoastSession {
  id: string
  created_at: string
  tier: "free" | "premium"
  aura_name: string
  free_hook: string
  roast_data: RoastData | null
  image_url: string | null
  country: string | null
}
