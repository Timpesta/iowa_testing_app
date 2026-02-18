import { supabase } from "@/lib/supabase";

export type Cycle = {
  id: string;
  type: string;
  year: number;
  status: string;
  created_at: string;
};

/** Fetch all cycles (one query), then split into active and history. */
async function getAllCycles(): Promise<Cycle[]> {
  const { data, error } = await supabase
    .from("cycles")
    .select("id, type, year, status, created_at")
    .order("year", { ascending: false })
    .order("type", { ascending: false });
  if (error) return [];
  return (data ?? []) as Cycle[];
}

export async function getActiveCycle(): Promise<Cycle | null> {
  const all = await getAllCycles();
  return all.find((c) => c.status === "active") ?? null;
}

export async function getCyclesHistory(): Promise<Cycle[]> {
  const all = await getAllCycles();
  return all.filter((c) => c.status === "closed");
}

export function formatCycleLabel(cycle: { type: string; year: number }): string {
  const typeLabel = cycle.type === "fall" ? "Fall" : "Spring";
  return `${typeLabel} ${cycle.year}`;
}
