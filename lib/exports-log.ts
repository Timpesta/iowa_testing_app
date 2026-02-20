import { supabase } from "@/lib/supabase";

export type ExportLog = {
  id: string;
  cycle_id: string;
  type: "full" | "new";
  exported_at: string;
  student_count: number;
};

/** Returns the most recent export record for a given cycle, or null if none. */
export async function getLastExportForCycle(cycleId: string): Promise<ExportLog | null> {
  const { data } = await supabase
    .from("exports")
    .select("id, cycle_id, type, exported_at, student_count")
    .eq("cycle_id", cycleId)
    .order("exported_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data as ExportLog | null;
}

/** Records a new export event. Call after the CSV bytes are generated. */
export async function logExport(
  cycleId: string,
  type: "full" | "new",
  studentCount: number
): Promise<void> {
  await supabase.from("exports").insert({
    cycle_id: cycleId,
    type,
    student_count: studentCount,
  });
}

/** Format an ISO timestamp for display, e.g. "Jan 15, 2025 at 2:34 PM" */
export function formatExportedAt(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
