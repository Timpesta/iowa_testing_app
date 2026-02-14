import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { ApproveSchoolForm } from "@/components/admin/ApproveSchoolForm";

type PageProps = {
  params: Promise<{ id: string }>;
};

async function getSchool(id: string) {
  const { data, error } = await supabase
    .from("schools")
    .select("id, name, status")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  if (data.status !== "pending") return null;
  return data;
}

export default async function ApproveSchoolPage({ params }: PageProps) {
  const { id } = await params;
  const school = await getSchool(id);
  if (!school) notFound();

  return (
    <div className="max-w-md">
      <Link
        href="/admin/schools?filter=pending"
        className="text-sm text-slate-500 hover:text-slate-700 mb-6 inline-block"
      >
        ← Back to schools
      </Link>
      <h1 className="text-2xl font-semibold text-slate-900 mb-2">
        Approve school
      </h1>
      <p className="text-slate-600 mb-6">
        Assign a unique code for <strong>{school.name}</strong>. The code must be
        2–4 uppercase letters and will be used in student IDs (e.g. AABQ2000).
      </p>
      <ApproveSchoolForm schoolId={school.id} schoolName={school.name} />
    </div>
  );
}
