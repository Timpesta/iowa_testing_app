import { supabase } from "@/lib/supabase";
import { getActiveCycle } from "@/lib/cycles";
import { formatSubmittedAt } from "@/lib/roster-utils";

export { formatSubmittedAt };

/** Get submission for current school + active cycle (school context). */
export async function getSchoolSubmissionForCurrentCycle(schoolId: string): Promise<{ submitted_at: string } | null> {
  const activeCycle = await getActiveCycle();
  if (!activeCycle) return null;
  const { data } = await supabase
    .from("cycle_submissions")
    .select("submitted_at")
    .eq("school_id", schoolId)
    .eq("cycle_id", activeCycle.id)
    .maybeSingle();
  return data;
}

/** Get counts and list for admin dashboard: submitted count, total approved, and school ids that haven't submitted. */
export async function getSubmissionStats(): Promise<{
  submittedCount: number;
  approvedCount: number;
  notSubmittedSchoolIds: string[];
}> {
  const [activeCycle, approvedRes] = await Promise.all([
    getActiveCycle(),
    supabase.from("schools").select("id").eq("status", "approved"),
  ]);
  const approvedIds = (approvedRes.data ?? []).map((s) => s.id);
  if (approvedIds.length === 0) {
    return { submittedCount: 0, approvedCount: 0, notSubmittedSchoolIds: [] };
  }
  if (!activeCycle) {
    return { submittedCount: 0, approvedCount: approvedIds.length, notSubmittedSchoolIds: approvedIds };
  }
  const { data: submissions } = await supabase
    .from("cycle_submissions")
    .select("school_id")
    .eq("cycle_id", activeCycle.id);
  const approvedSet = new Set(approvedIds);
  const submittedInApproved = (submissions ?? []).filter((s) => approvedSet.has(s.school_id));
  const submittedIds = new Set(submittedInApproved.map((s) => s.school_id));
  const notSubmitted = approvedIds.filter((id) => !submittedIds.has(id));
  return {
    submittedCount: submittedIds.size,
    approvedCount: approvedIds.length,
    notSubmittedSchoolIds: notSubmitted,
  };
}

/** Get school ids that have submitted for the active cycle (for export). */
export async function getSubmittedSchoolIdsForActiveCycle(): Promise<string[]> {
  const activeCycle = await getActiveCycle();
  if (!activeCycle) return [];
  const { data } = await supabase
    .from("cycle_submissions")
    .select("school_id")
    .eq("cycle_id", activeCycle.id);
  return (data ?? []).map((r) => r.school_id);
}
