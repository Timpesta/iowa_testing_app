-- =============================================================================
-- Admin users: restrict /admin routes to specific email addresses
-- =============================================================================
-- Run in Supabase SQL Editor after the main schema.
--
-- HOW TO SET UP ADMIN ACCESS
-- --------------------------
-- 1. Create the user in Supabase Auth:
--      Dashboard → Authentication → Users → Add user
--      Set their email and password (use "Create user" not "Invite").
-- 2. Run this SQL to create the table.
-- 3. Insert the admin email:
--      INSERT INTO admin_users (email) VALUES ('your@email.com');
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Only the service role can read/write admin_users.
-- The anon key used by the app cannot access this table directly;
-- the check is done via a SECURITY DEFINER function below.
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- No policies: service role bypasses RLS; anon key is blocked entirely.

-- Function callable by authenticated users to check if their own email
-- is in admin_users (SECURITY DEFINER runs as the table owner, bypassing RLS).
CREATE OR REPLACE FUNCTION public.is_admin(p_email text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users WHERE email = p_email
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(text) TO anon;
