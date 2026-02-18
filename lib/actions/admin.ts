"use server";

import { supabase } from "@/lib/supabase";

const CODE_REGEX = /^[A-Z]{2,4}$/;

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export type ApproveState =
  | { success: true; message: string }
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

  const { data: school } = await supabase
    .from("schools")
    .select("contact_email")
    .eq("id", schoolId)
    .eq("status", "pending")
    .single();

  if (!school?.contact_email) {
    return {
      success: false,
      message: "School not found or already approved.",
    };
  }

  const contactEmail = school.contact_email;

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

  const { error: otpError } = await supabase.auth.signInWithOtp({
    email: contactEmail,
    options: {
      emailRedirectTo: `${APP_URL}/auth/callback`,
    },
  });

  if (otpError) {
    return {
      success: true,
      message: `School approved. Login link could not be sent to ${contactEmail}; they can request one at the login page.`,
    };
  }

  return {
    success: true,
    message: `School approved. Login link sent to ${contactEmail}.`,
  };
}
