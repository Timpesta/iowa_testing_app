"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type AdminLoginState =
  | { success: false; message: string }
  | { success: true };

export async function adminLogin(
  _prev: unknown,
  formData: FormData
): Promise<AdminLoginState> {
  const email = (formData.get("email") as string)?.trim() ?? "";
  const password = (formData.get("password") as string) ?? "";

  if (!email || !password) {
    return { success: false, message: "Email and password are required." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { success: false, message: "Invalid email or password." };
  }

  // Verify the logged-in user is in admin_users via the SECURITY DEFINER function.
  const { data: isAdmin } = await supabase.rpc("is_admin", { p_email: email });

  if (!isAdmin) {
    await supabase.auth.signOut();
    return {
      success: false,
      message: "Access denied. This account does not have admin privileges.",
    };
  }

  redirect("/admin");
}

export async function adminSignOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
