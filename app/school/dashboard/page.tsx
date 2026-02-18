import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getActiveCycle, formatCycleLabel } from "@/lib/cycles";

export default async function SchoolDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const [schoolRes, activeCycle] = await Promise.all([
    supabase
      .from("schools")
      .select("name")
      .eq("contact_email", user!.email!)
      .eq("status", "approved")
      .single(),
    getActiveCycle(),
  ]);
  const school = schoolRes.data;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900 mb-2">
        Welcome, {school?.name}
      </h1>
      <p className="text-slate-600 mb-4">
        Manage your students and testing cycles from here.{" "}
        <Link href="/faq" className="text-slate-700 hover:text-slate-900 underline">
          FAQ
        </Link>
      </p>
      {activeCycle && (
        <div className="bg-slate-900 text-white rounded-lg px-4 py-3 mb-8">
          <p className="text-sm text-slate-300">Current cycle</p>
          <p className="text-xl font-semibold">{formatCycleLabel(activeCycle)}</p>
        </div>
      )}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-lg font-medium text-slate-900 mb-2">
          Roster management
        </h2>
        <p className="text-slate-500 text-sm mb-4">
          Add and edit students for testing.
        </p>
        <Link
          href="/school/roster"
          className="text-sm font-medium text-slate-700 hover:text-slate-900"
        >
          Open roster →
        </Link>
      </div>
    </div>
  );
}
