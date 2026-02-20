import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getActiveCycle, formatCycleLabel } from "@/lib/cycles";
import { getSubmissionStats } from "@/lib/submissions";

export const dynamic = "force-dynamic";

async function getCounts() {
  const [schoolsRes, pendingRes, approvedRes, studentsRes] = await Promise.all([
    supabase.from("schools").select("id", { count: "exact", head: true }),
    supabase.from("schools").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("schools").select("id", { count: "exact", head: true }).eq("status", "approved"),
    supabase.from("students").select("id", { count: "exact", head: true }),
  ]);

  return {
    totalSchools: schoolsRes.count ?? 0,
    pendingSchools: pendingRes.count ?? 0,
    approvedSchools: approvedRes.count ?? 0,
    totalStudents: studentsRes.count ?? 0,
  };
}

export default async function AdminDashboardPage() {
  const [counts, activeCycle, submissionStats] = await Promise.all([
    getCounts(),
    getActiveCycle(),
    getSubmissionStats(),
  ]);

  const notSubmittedIds = submissionStats.notSubmittedSchoolIds;
  const notSubmittedSchools =
    notSubmittedIds.length > 0
      ? await supabase.from("schools").select("id, name").in("id", notSubmittedIds).order("name")
      : { data: [] as { id: string; name: string }[] };
  const notSubmittedList = notSubmittedSchools.data ?? [];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900 mb-8">Dashboard</h1>

      {activeCycle ? (
        <div className="bg-slate-900 text-white rounded-lg px-4 py-3 mb-8">
          <p className="text-sm text-slate-300">Current cycle</p>
          <p className="text-xl font-semibold">{formatCycleLabel(activeCycle)}</p>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-amber-800 text-sm mb-8">
          No active cycle. Go to{" "}
          <Link href="/admin/cycles" className="underline font-medium">
            Cycles
          </Link>{" "}
          to start one.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <p className="text-sm text-slate-500 font-medium">Pending schools</p>
          <p className="text-2xl font-semibold text-slate-900 mt-1">{counts.pendingSchools}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <p className="text-sm text-slate-500 font-medium">Approved schools</p>
          <p className="text-2xl font-semibold text-slate-900 mt-1">{counts.approvedSchools}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <p className="text-sm text-slate-500 font-medium">Total students</p>
          <p className="text-2xl font-semibold text-slate-900 mt-1">{counts.totalStudents}</p>
        </div>
      </div>

      {activeCycle && submissionStats.approvedCount > 0 && (
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-8">
          <p className="text-sm text-slate-500 font-medium mb-1">Current cycle submissions</p>
          <p className="text-xl font-semibold text-slate-900">
            {submissionStats.submittedCount} of {submissionStats.approvedCount} schools have submitted
          </p>
          {submissionStats.submittedCount === 0 ? (
            <p className="mt-2 text-sm text-slate-500">No schools have submitted for this cycle yet.</p>
          ) : notSubmittedList.length > 0 ? (
            <div className="mt-4">
              <p className="text-sm text-slate-600 font-medium mb-2">Still waiting on</p>
              <ul className="text-sm text-slate-700 list-disc list-inside space-y-0.5">
                {notSubmittedList.map((s) => (
                  <li key={s.id}>{s.name}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="mt-2 text-sm text-green-700 font-medium">All schools have submitted.</p>
          )}
        </div>
      )}

      {activeCycle && counts.approvedSchools === 0 && (
        <p className="text-slate-500 text-sm mb-4">No schools have registered yet.</p>
      )}

      {counts.pendingSchools > 0 && (
        <Link
          href="/admin/schools?filter=pending"
          className="inline-flex items-center text-slate-700 font-medium hover:text-slate-900"
        >
          View pending schools →
        </Link>
      )}
    </div>
  );
}
