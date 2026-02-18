"use server";

import { supabase } from "@/lib/supabase";

export type StartCycleState =
  | { success: true; message: string }
  | { success: false; message: string };

export async function startNewCycle(
  type: "fall" | "spring",
  year: number
): Promise<StartCycleState> {
  const y = Math.floor(Number(year));
  if (y < 2000 || y > 2100) {
    return { success: false, message: "Please enter a valid year." };
  }

  const { data: existing } = await supabase
    .from("cycles")
    .select("id, type, year")
    .eq("type", type)
    .eq("year", y)
    .maybeSingle();

  if (existing) {
    return { success: false, message: `A ${type} ${y} cycle already exists.` };
  }

  const { data: activeCycle } = await supabase
    .from("cycles")
    .select("id, type")
    .eq("status", "active")
    .maybeSingle();

  await supabase.from("cycles").update({ status: "closed" }).eq("status", "active");

  const { data: newCycle, error: insertError } = await supabase
    .from("cycles")
    .insert({ type, year: y, status: "active" })
    .select("id")
    .single();

  if (insertError || !newCycle) {
    return { success: false, message: "Failed to create cycle. Please try again." };
  }

  if (type === "fall") {
    await supabase.from("students").update({ active: false }).eq("active", true).eq("grade", 12);
    await supabase.rpc("increment_student_grades");
  }

  return { success: true, message: `${type.charAt(0).toUpperCase() + type.slice(1)} ${y} cycle started.` };
}
