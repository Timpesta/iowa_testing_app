import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getActiveCycle } from "@/lib/cycles";
import { SchoolTable } from "@/components/admin/SchoolTable";

type Filter = "all" | "pending" | "approved";

async function getSchools(filter: Filter) {
  let query = supabase
    .from("schools")
    .select("id, name, contact_email, status, code")
    .order("created_at", { ascending: false });

  if (filter === "pending") query = query.eq("status", "pending");
  if (filter === "approved") query = query.eq("status", "approved");

  const { data, error } = await query;
  if (error) return [];
  return data ?? [];
}

async function getSubmissionBySchool(cycleId: string) {
  const { data } = await supabase
    .from("cycle_submissions")
    .select("school_id, submitted_at")
    .eq("cycle_id", cycleId);
  const map = new Map<string, string>();
  (data ?? []).forEach((r) => map.set(r.school_id, r.submitted_at));
  return map;
}

type PageProps = {
  searchParams: Promise<{ filter?: string }>;
};

export default async function AdminSchoolsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filter = (params.filter === "pending" || params.filter === "approved"
    ? params.filter
    : "all") as Filter;
  const [rawSchools, activeCycle] = await Promise.all([
    getSchools(filter),
    getActiveCycle(),
  ]);
  const submissionMap = activeCycle
    ? await getSubmissionBySchool(activeCycle.id)
    : new Map<string, string>();

  const schools = rawSchools.map((s) => ({
    ...s,
    submittedAt: submissionMap.get(s.id) ?? null,
  }));

  if (filter === "approved" && activeCycle) {
    schools.sort((a, b) => {
      const aDone = a.submittedAt != null ? 1 : 0;
      const bDone = b.submittedAt != null ? 1 : 0;
      if (aDone !== bDone) return aDone - bDone;
      return (a.name ?? "").localeCompare(b.name ?? "");
    });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy-800 mb-6 tracking-tight">Schools</h1>
      <SchoolTable
        schools={schools}
        currentFilter={filter}
        activeCycle={activeCycle}
      />
    </div>
  );
}
