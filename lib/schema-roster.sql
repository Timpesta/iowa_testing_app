-- =============================================================================
-- Roster: atomic student creation with ID generation
-- =============================================================================
-- Run this in Supabase SQL Editor after the main schema. Creates a function
-- that generates the next student_id and increments next_student_number
-- in a single transaction to avoid race conditions.
-- =============================================================================

CREATE OR REPLACE FUNCTION create_student_with_next_id(
  p_school_id uuid,
  p_first_name text,
  p_last_name text,
  p_date_of_birth date,
  p_gender text,
  p_grade integer
)
RETURNS TABLE (new_id uuid, new_student_id text)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_code text;
  v_next integer;
  v_student_id text;
  v_new_id uuid;
BEGIN
  -- Lock school row and read code + next_student_number
  SELECT s.code, s.next_student_number
  INTO v_code, v_next
  FROM schools s
  WHERE s.id = p_school_id
  FOR UPDATE;

  IF v_code IS NULL THEN
    RAISE EXCEPTION 'School has no code (not approved)';
  END IF;

  v_student_id := v_code || v_next::text;

  INSERT INTO students (school_id, student_id, first_name, last_name, date_of_birth, gender, grade)
  VALUES (p_school_id, v_student_id, p_first_name, p_last_name, p_date_of_birth, p_gender, p_grade)
  RETURNING id INTO v_new_id;

  UPDATE schools
  SET next_student_number = next_student_number + 1
  WHERE id = p_school_id;

  new_id := v_new_id;
  new_student_id := v_student_id;
  RETURN NEXT;
END;
$$;

-- Allow the app (anon or authenticated) to call the function:
-- GRANT EXECUTE ON FUNCTION create_student_with_next_id(uuid, text, text, date, text, integer) TO anon;
-- GRANT EXECUTE ON FUNCTION create_student_with_next_id(uuid, text, text, date, text, integer) TO authenticated;
