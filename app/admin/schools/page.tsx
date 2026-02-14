import Link from "next/link";
import { supabase } from "@/lib/supabase";
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

type PageProps = {
  searchParams: Promise<{ filter?: string }>;
};

export default async function AdminSchoolsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filter = (params.filter === "pending" || params.filter === "approved"
    ? params.filter
    : "all") as Filter;
  const schools = await getSchools(filter);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900 mb-6">Schools</h1>
      <SchoolTable schools={schools} currentFilter={filter} />
    </div>
  );
}
