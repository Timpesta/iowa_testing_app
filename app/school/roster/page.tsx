import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatDateDisplay } from "@/lib/roster-utils";

const GENDER_LABELS: Record<string, string> = {
  M: "Male",
  F: "Female",
  U: "Unspecified",
};

async function getSchoolAndStudents() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) redirect("/login");

  const { data: school } = await supabase
    .from("schools")
    .select("id, name")
    .eq("contact_email", user.email)
    .eq("status", "approved")
    .single();
  if (!school) redirect("/login?message=pending");

  const { data: students } = await supabase
    .from("students")
    .select("id, student_id, first_name, last_name, date_of_birth, gender, grade")
    .eq("school_id", school.id)
    .eq("active", true)
    .order("student_id");

  return { school, students: students ?? [] };
}

export default async function RosterPage() {
  const { students } = await getSchoolAndStudents();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Student roster</h1>
        <Link
          href="/school/roster/add"
          className="rounded-lg bg-slate-900 px-4 py-2 text-white text-sm font-medium hover:bg-slate-800"
        >
          Add student
        </Link>
      </div>
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">
                Student ID
              </th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">
                First name
              </th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">
                Last name
              </th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">
                DOB
              </th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">
                Gender
              </th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">
                Grade
              </th>
              <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500 text-sm">
                  No students yet. Add your first student to get started.
                </td>
              </tr>
            ) : (
              students.map((s) => (
                <tr key={s.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-mono text-slate-900">{s.student_id}</td>
                  <td className="px-4 py-3 text-slate-900">{s.first_name}</td>
                  <td className="px-4 py-3 text-slate-900">{s.last_name}</td>
                  <td className="px-4 py-3 text-slate-600">{formatDateDisplay(s.date_of_birth)}</td>
                  <td className="px-4 py-3 text-slate-600">{GENDER_LABELS[s.gender] ?? s.gender}</td>
                  <td className="px-4 py-3 text-slate-600">{s.grade}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/school/roster/${s.id}/edit`}
                      className="text-sm font-medium text-slate-700 hover:text-slate-900"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
