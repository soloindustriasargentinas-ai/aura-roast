-- user_auras: almacena cada análisis de aura generado
create table if not exists public.user_auras (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  email       text,
  tier        text not null default 'free' check (tier in ('free', 'premium')),
  aura_data   jsonb not null,
  dossier_data jsonb,
  image_url   text,
  stripe_session_id text
);

-- Índice para buscar por email (leads)
create index if not exists idx_user_auras_email on public.user_auras (email);

-- RLS: solo lectura pública por ID (para la URL compartida)
alter table public.user_auras enable row level security;

create policy "Lectura pública por ID"
  on public.user_auras for select
  using (true);

-- Solo las Edge Functions (service role) pueden insertar/actualizar
create policy "Service role full access"
  on public.user_auras for all
  using (auth.role() = 'service_role');
