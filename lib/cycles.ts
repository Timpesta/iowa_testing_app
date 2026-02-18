import { supabase } from "@/lib/supabase";

export type Cycle = {
  id: string;
  type: string;
  year: number;
  status: string;
  created_at: string;
};

export async function getActiveCycle(): Promise<Cycle | null> {
  const { data } = await supabase
    .from("cycles")
    .select("id, type, year, status, created_at")
    .eq("status", "active")
    .maybeSingle();
  return data;
}

export async function getCyclesHistory(): Promise<Cycle[]> {
  const { data } = await supabase
    .from("cycles")
    .select("id, type, year, status, created_at")
    .eq("status", "closed")
    .order("year", { ascending: false })
    .order("type", { ascending: false });
  return data ?? [];
}

export function formatCycleLabel(cycle: { type: string; year: number }): string {
  const typeLabel = cycle.type === "fall" ? "Fall" : "Spring";
  return `${typeLabel} ${cycle.year}`;
}
