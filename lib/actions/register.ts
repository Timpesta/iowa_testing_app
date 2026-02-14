"use server";

import { supabase } from "@/lib/supabase";

export type RegisterState =
  | { success: true; message: string }
  | { success: false; message: string };

export async function registerSchool(
  _prev: unknown,
  formData: FormData
): Promise<RegisterState> {
  const name = (formData.get("name") as string)?.trim() ?? "";
  const contactName = (formData.get("contact_name") as string)?.trim() ?? "";
  const contactEmail = (formData.get("contact_email") as string)?.trim() ?? "";

  if (!name || !contactName || !contactEmail) {
    return { success: false, message: "All fields are required." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(contactEmail)) {
    return { success: false, message: "Please enter a valid email address." };
  }

  const { error } = await supabase.from("schools").insert({
    name,
    contact_name: contactName,
    contact_email: contactEmail,
    status: "pending",
  });

  if (error) {
    if (error.code === "23505") {
      return {
        success: false,
        message: "A school with this contact email is already registered.",
      };
    }
    return {
      success: false,
      message: "Registration failed. Please try again.",
    };
  }

  return {
    success: true,
    message:
      "Registration submitted! You'll receive an email when your account is approved.",
  };
}
