-- =============================================================================
-- Cycles: bump student grades for Fall (new school year) transition
-- =============================================================================
-- Run in Supabase SQL Editor. Used when starting a new Fall cycle:
-- increments grade by 1 for all active students with grade < 12.
-- (Grade 12 students are set inactive in the app before calling this.)
-- =============================================================================

CREATE OR REPLACE FUNCTION increment_student_grades()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE students
  SET grade = grade + 1
  WHERE active = true AND grade < 12;
$$;
