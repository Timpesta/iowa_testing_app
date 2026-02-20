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
        className="text-sm text-slate-500 hover:text-navy-800 mb-6 inline-block transition-colors"
      >
        ← Back to schools
      </Link>
      <h1 className="text-2xl font-bold text-navy-800 mb-1 tracking-tight">
        Approve school
      </h1>
      <p className="text-slate-500 text-sm mb-6">
        Assign a unique code for <strong className="text-navy-800">{school.name}</strong>. The code must be
        2–4 uppercase letters and will be used in student IDs (e.g.&nbsp;AABQ2000).
      </p>
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <ApproveSchoolForm schoolId={school.id} schoolName={school.name} />
      </div>
    </div>
  );
}
