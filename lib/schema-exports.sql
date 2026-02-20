-- =============================================================================
-- Exports log: track when admin exports rosters
-- =============================================================================
-- Run in Supabase SQL Editor (Dashboard → SQL Editor → New query → Run).
--
-- This table records every CSV export so the portal can show "last exported"
-- and offer a "new students only" export filtered to students added after
-- the most recent export.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.exports (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  cycle_id      uuid        NOT NULL REFERENCES public.cycles(id),
  type          text        NOT NULL DEFAULT 'full', -- 'full' or 'new'
  exported_at   timestamptz NOT NULL DEFAULT now(),
  student_count integer     NOT NULL DEFAULT 0
);

ALTER TABLE public.exports ENABLE ROW LEVEL SECURITY;

-- Public read so the server-side anon client can query last export dates.
CREATE POLICY "Allow public read exports"
  ON public.exports FOR SELECT USING (true);

-- Allow insert from the anon key (admin route handler).
CREATE POLICY "Allow anon insert exports"
  ON public.exports FOR INSERT WITH CHECK (true);
