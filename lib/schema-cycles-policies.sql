-- =============================================================================
-- Cycles: allow read access so admin and school dashboards can display cycles
-- =============================================================================
-- If Row Level Security (RLS) is enabled on public.cycles, the anon key
-- cannot read rows unless a policy allows it. Run this in Supabase SQL Editor.
-- =============================================================================

-- Drop existing policy if re-running this script
DROP POLICY IF EXISTS "Allow public read cycles" ON public.cycles;

-- Enable RLS if not already (optional; Supabase may have it on by default)
ALTER TABLE public.cycles ENABLE ROW LEVEL SECURITY;

-- Allow anyone (anon + authenticated) to read all cycles
CREATE POLICY "Allow public read cycles"
  ON public.cycles
  FOR SELECT
  USING (true);
