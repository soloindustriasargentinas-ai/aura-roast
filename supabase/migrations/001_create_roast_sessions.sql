CREATE TABLE IF NOT EXISTS roast_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  tier TEXT DEFAULT 'free',
  aura_name TEXT,
  free_hook TEXT,
  roast_data JSONB,
  image_url TEXT,
  country TEXT
);

ALTER TABLE roast_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read own" ON roast_sessions FOR SELECT USING (true);
CREATE POLICY "service insert" ON roast_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "service update" ON roast_sessions FOR UPDATE USING (true);
