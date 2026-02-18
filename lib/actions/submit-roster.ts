"use server";

import { supabase } from "@/lib/supabase";
import { createClient } from "@/lib/supabase/server";
import { getActiveCycle } from "@/lib/cycles";

export type SubmitRosterState =
  | { success: true; message: string }
  | { success: false; message: string };

export async function submitRoster(): Promise<SubmitRosterState> {
  const server = await createClient();
  const { data: { user } } = await server.auth.getUser();
  if (!user?.email) return { success: false, message: "Not signed in." };

  const { data: school } = await supabase
    .from("schools")
    .select("id")
    .eq("contact_email", user.email)
    .eq("status", "approved")
    .single();
  if (!school) return { success: false, message: "School not found or not approved." };

  const activeCycle = await getActiveCycle();
  if (!activeCycle) return { success: false, message: "No active cycle." };

  const { error } = await supabase.from("cycle_submissions").insert({
    school_id: school.id,
    cycle_id: activeCycle.id,
  });

  if (error) {
    if (error.code === "23505") {
      return { success: true, message: `Roster already submitted for ${activeCycle.type === "fall" ? "Fall" : "Spring"} ${activeCycle.year}.` };
    }
    return { success: false, message: "Failed to submit. Please try again." };
  }

  const cycleLabel = activeCycle.type === "fall" ? "Fall" : "Spring";
  return { success: true, message: `Roster submitted for ${cycleLabel} ${activeCycle.year}.` };
}
