import Link from "next/link";
import { supabase } from "@/lib/supabase";

async function getCounts() {
  const [schoolsRes, pendingRes, approvedRes, studentsRes] = await Promise.all([
    supabase.from("schools").select("id", { count: "exact", head: true }),
    supabase
      .from("schools")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("schools")
      .select("id", { count: "exact", head: true })
      .eq("status", "approved"),
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
  const counts = await getCounts();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900 mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <p className="text-sm text-slate-500 font-medium">Pending schools</p>
          <p className="text-2xl font-semibold text-slate-900 mt-1">
            {counts.pendingSchools}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <p className="text-sm text-slate-500 font-medium">Approved schools</p>
          <p className="text-2xl font-semibold text-slate-900 mt-1">
            {counts.approvedSchools}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <p className="text-sm text-slate-500 font-medium">Total students</p>
          <p className="text-2xl font-semibold text-slate-900 mt-1">
            {counts.totalStudents}
          </p>
        </div>
      </div>
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
