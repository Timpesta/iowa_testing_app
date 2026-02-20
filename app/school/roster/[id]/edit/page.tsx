import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { StudentForm } from "@/components/roster/StudentForm";
import { getGradeOptions, getGenderOptions, formatDateDisplay } from "@/lib/roster-utils";

type PageProps = { params: Promise<{ id: string }> };

async function getStudent(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) redirect("/login");

  const { data: school } = await supabase
    .from("schools")
    .select("id")
    .eq("contact_email", user.email)
    .eq("status", "approved")
    .single();
  if (!school) redirect("/login?message=pending");

  const { data: student } = await supabase
    .from("students")
    .select("id, student_id, first_name, last_name, date_of_birth, gender, grade")
    .eq("id", id)
    .eq("school_id", school.id)
    .single();

  return student;
}

export default async function EditStudentPage({ params }: PageProps) {
  const { id } = await params;
  const student = await getStudent(id);
  if (!student) notFound();

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
      <h1 className="text-2xl font-bold text-navy-800 mb-6 tracking-tight">Edit student</h1>
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <StudentForm
          gradeOptions={gradeOptions}
          genderOptions={genderOptions}
          mode="edit"
          initial={{
            student_id: student.student_id,
            first_name: student.first_name,
            last_name: student.last_name,
            date_of_birth: formatDateDisplay(student.date_of_birth),
            gender: student.gender,
            grade: student.grade,
          }}
          studentId={student.id}
        />
      </div>
    </div>
  );
}
