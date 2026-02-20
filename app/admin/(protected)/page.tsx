import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getActiveCycle, formatCycleLabel } from "@/lib/cycles";
import { getSubmissionStats } from "@/lib/submissions";

export const dynamic = "force-dynamic";

async function getCounts() {
  const [pendingRes, approvedRes, studentsRes] = await Promise.all([
    supabase.from("schools").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("schools").select("id", { count: "exact", head: true }).eq("status", "approved"),
    supabase.from("students").select("id", { count: "exact", head: true }),
  ]);

  return {
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
      <h1 className="text-2xl font-bold text-navy-800 mb-6 tracking-tight">Dashboard</h1>

      {/* Active cycle banner */}
      {activeCycle ? (
        <div className="flex items-center justify-between bg-navy-800 text-white rounded-xl px-5 py-4 mb-8">
          <div>
            <p className="text-navy-200 text-xs font-medium uppercase tracking-wider mb-0.5">
              Current cycle
            </p>
            <p className="text-xl font-bold">{formatCycleLabel(activeCycle)}</p>
          </div>
          <span className="bg-amber-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            Active
          </span>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-8 text-amber-800 text-sm">
          No active cycle. Go to{" "}
          <Link href="/admin/cycles" className="underline font-medium">
            Cycles
          </Link>{" "}
          to start one.
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Pending schools
          </p>
          <p className="text-3xl font-bold text-navy-800">{counts.pendingSchools}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Approved schools
          </p>
          <p className="text-3xl font-bold text-navy-800">{counts.approvedSchools}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Total students
          </p>
          <p className="text-3xl font-bold text-navy-800">{counts.totalStudents}</p>
        </div>
      </div>

      {/* Submission stats */}
      {activeCycle && submissionStats.approvedCount > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Cycle submissions
          </p>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-bold text-navy-800">
              {submissionStats.submittedCount}
            </span>
            <span className="text-slate-500 text-sm">
              of {submissionStats.approvedCount} schools submitted
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 rounded-full h-2 mt-3 mb-4">
            <div
              className="bg-amber-500 h-2 rounded-full transition-all"
              style={{
                width: `${submissionStats.approvedCount > 0
                  ? Math.round((submissionStats.submittedCount / submissionStats.approvedCount) * 100)
                  : 0}%`,
              }}
            />
          </div>

          {submissionStats.submittedCount === 0 ? (
            <p className="text-slate-500 text-sm">No schools have submitted for this cycle yet.</p>
          ) : notSubmittedList.length > 0 ? (
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Still waiting on:</p>
              <ul className="text-sm text-slate-600 list-disc list-inside space-y-0.5">
                {notSubmittedList.map((s) => (
                  <li key={s.id}>{s.name}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-sm font-medium text-green-700">All schools have submitted.</p>
          )}
        </div>
      )}

      {activeCycle && counts.approvedSchools === 0 && (
        <p className="text-slate-500 text-sm mb-4">No schools have registered yet.</p>
      )}

      {counts.pendingSchools > 0 && (
        <Link
          href="/admin/schools?filter=pending"
          className="inline-flex items-center text-sm font-semibold text-amber-500 hover:text-amber-600 transition-colors"
        >
          View {counts.pendingSchools} pending school{counts.pendingSchools !== 1 ? "s" : ""} →
        </Link>
      )}
    </div>
  );
}
