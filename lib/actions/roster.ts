"use server";

import { supabase } from "@/lib/supabase";
import { createClient } from "@/lib/supabase/server";
import { parseDateInput } from "@/lib/roster-utils";

export type AddStudentState = { success: true; studentId: string } | { success: false; message: string };
export type UpdateStudentState = { success: true } | { success: false; message: string };

async function getSchoolForUser() {
  const server = await createClient();
  const { data: { user } } = await server.auth.getUser();
  if (!user?.email) return null;
  const { data: school } = await supabase
    .from("schools")
    .select("id, code")
    .eq("contact_email", user.email)
    .eq("status", "approved")
    .single();
  return school;
}

export async function addStudent(_prev: unknown, formData: FormData): Promise<AddStudentState> {
  const school = await getSchoolForUser();
  if (!school?.code) return { success: false, message: "School not found or not approved." };

  const firstName = (formData.get("first_name") as string)?.trim() ?? "";
  const lastName = (formData.get("last_name") as string)?.trim() ?? "";
  const dobInput = (formData.get("date_of_birth") as string)?.trim() ?? "";
  const gender = (formData.get("gender") as string)?.trim();
  const gradeStr = (formData.get("grade") as string)?.trim();

  if (!firstName) return { success: false, message: "First name is required." };
  if (!lastName) return { success: false, message: "Last name is required." };
  const dobIso = parseDateInput(dobInput);
  if (!dobIso) return { success: false, message: "Date of birth is required. Use format MM/DD/YYYY." };
  if (gender !== "M" && gender !== "F" && gender !== "U") return { success: false, message: "Please select a gender." };
  const grade = parseInt(gradeStr ?? "", 10);
  if (!Number.isInteger(grade) || grade < 1 || grade > 12) return { success: false, message: "Please select a grade (1–12)." };

  const { data, error } = await supabase.rpc("create_student_with_next_id", {
    p_school_id: school.id,
    p_first_name: firstName,
    p_last_name: lastName,
    p_date_of_birth: dobIso,
    p_gender: gender,
    p_grade: grade,
  });

  if (error) {
    return { success: false, message: error.message || "Failed to add student." };
  }
  const row = Array.isArray(data) ? data[0] : data;
  const newStudentId = row?.new_student_id;
  if (!newStudentId) return { success: false, message: "Failed to create student ID." };
  return { success: true, studentId: newStudentId };
}

export async function updateStudent(_prev: unknown, formData: FormData): Promise<UpdateStudentState> {
  const studentUuid = (formData.get("student_id") as string)?.trim();
  if (!studentUuid) return { success: false, message: "Missing student." };

  const school = await getSchoolForUser();
  if (!school) return { success: false, message: "School not found." };

  const firstName = (formData.get("first_name") as string)?.trim() ?? "";
  const lastName = (formData.get("last_name") as string)?.trim() ?? "";
  const dobInput = (formData.get("date_of_birth") as string)?.trim() ?? "";
  const gender = (formData.get("gender") as string)?.trim();
  const gradeStr = (formData.get("grade") as string)?.trim();

  if (!firstName) return { success: false, message: "First name is required." };
  if (!lastName) return { success: false, message: "Last name is required." };
  const dobIso = parseDateInput(dobInput);
  if (!dobIso) return { success: false, message: "Date of birth is required. Use format MM/DD/YYYY." };
  if (gender !== "M" && gender !== "F" && gender !== "U") return { success: false, message: "Please select a gender." };
  const grade = parseInt(gradeStr ?? "", 10);
  if (!Number.isInteger(grade) || grade < 1 || grade > 12) return { success: false, message: "Please select a grade (1–12)." };

  const { error } = await supabase
    .from("students")
    .update({
      first_name: firstName,
      last_name: lastName,
      date_of_birth: dobIso,
      gender,
      grade,
    })
    .eq("id", studentUuid)
    .eq("school_id", school.id);

  if (error) return { success: false, message: error.message || "Failed to update student." };
  return { success: true };
}
