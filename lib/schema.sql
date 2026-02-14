-- =============================================================================
-- Iowa Testing Portal – Supabase Database Schema
-- =============================================================================
--
-- HOW TO RUN THIS SCHEMA IN SUPABASE
-- ---------------------------------
-- 1. Open your project at https://supabase.com/dashboard
-- 2. In the left sidebar, go to "SQL Editor"
-- 3. Click "New query"
-- 4. Paste this entire file into the editor
-- 5. Click "Run" (or press Cmd/Ctrl + Enter)
--
-- The tables will be created in the public schema. You can verify them under
-- "Table Editor" in the sidebar.
--
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. schools
-- -----------------------------------------------------------------------------
-- Schools register with the portal. `code` is set when status becomes
-- 'approved'. `next_student_number` is used to generate student_id values.
-- -----------------------------------------------------------------------------
CREATE TABLE schools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE,  -- null until approved
  contact_name text NOT NULL,
  contact_email text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved')),
  next_student_number integer NOT NULL DEFAULT 2000,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- 2. students
-- -----------------------------------------------------------------------------
-- Students belong to a school. `student_id` is the human-readable ID
-- (e.g. "AABQ2000"). Gender is 'M', 'F', or 'U'. Grade is 1–12.
-- -----------------------------------------------------------------------------
CREATE TABLE students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  student_id text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  date_of_birth date NOT NULL,
  gender text NOT NULL CHECK (gender IN ('M', 'F', 'U')),
  grade integer NOT NULL CHECK (grade >= 1 AND grade <= 12),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_students_school_id ON students(school_id);
CREATE INDEX idx_students_student_id ON students(student_id);

-- -----------------------------------------------------------------------------
-- 3. cycles
-- -----------------------------------------------------------------------------
-- Testing cycles (e.g. fall 2025, spring 2026). Status controls whether
-- submissions are still accepted.
-- -----------------------------------------------------------------------------
CREATE TABLE cycles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('fall', 'spring')),
  year integer NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_cycles_type_year ON cycles(type, year);

-- -----------------------------------------------------------------------------
-- 4. cycle_submissions
-- -----------------------------------------------------------------------------
-- One row per school per cycle when that school submits for that cycle.
-- Unique on (school_id, cycle_id) so a school can only submit once per cycle.
-- -----------------------------------------------------------------------------
CREATE TABLE cycle_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  cycle_id uuid NOT NULL REFERENCES cycles(id) ON DELETE CASCADE,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(school_id, cycle_id)
);

CREATE INDEX idx_cycle_submissions_school_id ON cycle_submissions(school_id);
CREATE INDEX idx_cycle_submissions_cycle_id ON cycle_submissions(cycle_id);
