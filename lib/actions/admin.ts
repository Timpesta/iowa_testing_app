"use server";

import { supabase } from "@/lib/supabase";

const CODE_REGEX = /^[A-Z]{2,4}$/;

export type ApproveState =
  | { success: true }
  | { success: false; message: string };

export async function approveSchool(
  schoolId: string,
  code: string
): Promise<ApproveState> {
  const normalized = code.trim().toUpperCase();
  if (!CODE_REGEX.test(normalized)) {
    return {
      success: false,
      message: "Code must be 2–4 uppercase letters.",
    };
  }

  const { data: existing } = await supabase
    .from("schools")
    .select("id")
    .eq("code", normalized)
    .maybeSingle();

  if (existing) {
    return {
      success: false,
      message: "This code is already in use by another school.",
    };
  }

  const { error } = await supabase
    .from("schools")
    .update({ status: "approved", code: normalized })
    .eq("id", schoolId)
    .eq("status", "pending");

  if (error) {
    return {
      success: false,
      message: "Failed to approve school. Please try again.",
    };
  }

  return { success: true };
}
