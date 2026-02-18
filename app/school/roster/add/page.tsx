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
        className="text-sm text-slate-500 hover:text-slate-700 mb-6 inline-block"
      >
        ← Back to roster
      </Link>
      <h1 className="text-2xl font-semibold text-slate-900 mb-6">Add student</h1>
      <p className="text-slate-600 text-sm mb-6">
        Student ID will be auto-generated when you save (e.g. AABQ2000).
      </p>
      <StudentForm
        gradeOptions={gradeOptions}
        genderOptions={genderOptions}
        mode="add"
      />
    </div>
  );
}
