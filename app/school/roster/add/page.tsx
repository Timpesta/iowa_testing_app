import Link from "next/link";
import { StudentForm } from "@/components/roster/StudentForm";
import { getGradeOptions, getGenderOptions } from "@/lib/roster-utils";

export default async function AddStudentPage() {
  const gradeOptions = getGradeOptions();
  const genderOptions = getGenderOptions();

  return (
    <div>
      <Link
        href="/school/roster"
        className="text-sm text-slate-500 hover:text-navy-800 mb-6 inline-block transition-colors"
      >
        ← Back to roster
      </Link>
      <h1 className="text-2xl font-bold text-navy-800 mb-1 tracking-tight">Add student</h1>
      <p className="text-slate-500 text-sm mb-6">
        Student ID will be auto-generated when you save (e.g.&nbsp;AABQ2000).
      </p>
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <StudentForm
          gradeOptions={gradeOptions}
          genderOptions={genderOptions}
          mode="add"
        />
      </div>
    </div>
  );
}
