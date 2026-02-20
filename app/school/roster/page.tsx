import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatDateDisplay } from "@/lib/roster-utils";
import { getActiveCycle } from "@/lib/cycles";
import { getSchoolSubmissionForCurrentCycle } from "@/lib/submissions";
import { SubmitRosterBlock } from "@/components/roster/SubmitRosterBlock";

const GENDER_LABELS: Record<string, string> = {
  M: "Male",
  F: "Female",
  U: "Unspecified",
};

async function getSchoolAndStudents() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) redirect("/login");

  const { data: school } = await supabase
    .from("schools")
    .select("id, name")
    .eq("contact_email", user.email)
    .eq("status", "approved")
    .single();
  if (!school) redirect("/login?message=pending");

  const { data: students, error } = await supabase
    .from("students")
    .select("id, student_id, first_name, last_name, date_of_birth, gender, grade")
    .eq("school_id", school.id)
    .eq("active", true)
    .order("student_id");

  if (error) console.error("Error fetching students:", error.message);

  return { school, students: students ?? [] };
}

export default async function RosterPage() {
  const { school, students } = await getSchoolAndStudents();
  const [activeCycle, submission] = await Promise.all([
    getActiveCycle(),
    getSchoolSubmissionForCurrentCycle(school.id),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <h1 className="text-2xl font-bold text-navy-800 tracking-tight">Student roster</h1>
        <Link
          href="/school/roster/add"
          className="rounded-lg bg-navy-800 px-4 py-2 text-white text-sm font-semibold hover:bg-navy-900 transition-colors"
        >
          Add student
        </Link>
      </div>

      <SubmitRosterBlock
        activeCycle={activeCycle}
        submittedAt={submission?.submitted_at ?? null}
      />

      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        {students.length === 0 ? (
          <div className="px-4 py-14 text-center">
            <p className="text-slate-400 text-sm">
              No students added yet.{" "}
              <Link href="/school/roster/add" className="font-semibold text-navy-800 hover:underline">
                Add your first student
              </Link>{" "}
              to begin.
            </p>
          </div>
        ) : (
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">
                  Student ID
                </th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">
                  First name
                </th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">
                  Last name
                </th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">
                  DOB
                </th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">
                  Gender
                </th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">
                  Grade
                </th>
                <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70 transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-sm text-slate-600">{s.student_id}</td>
                  <td className="px-4 py-3 font-medium text-navy-800">{s.first_name}</td>
                  <td className="px-4 py-3 font-medium text-navy-800">{s.last_name}</td>
                  <td className="px-4 py-3 text-slate-500 text-sm">{formatDateDisplay(s.date_of_birth)}</td>
                  <td className="px-4 py-3 text-slate-500 text-sm">{GENDER_LABELS[s.gender] ?? s.gender}</td>
                  <td className="px-4 py-3 text-slate-500 text-sm">{s.grade}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/school/roster/${s.id}/edit`}
                      className="text-sm font-semibold text-amber-500 hover:text-amber-600 transition-colors"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
