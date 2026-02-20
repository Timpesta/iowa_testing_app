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
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-navy-800 mb-1 tracking-tight">
        Welcome, {school?.name}
      </h1>
      <p className="text-slate-500 text-sm mb-8">
        Manage your student roster and submit it for each testing cycle.
      </p>

      {/* Active cycle banner */}
      {activeCycle ? (
        <div className="flex items-center justify-between bg-navy-800 text-white rounded-xl px-5 py-4 mb-6">
          <div>
            <p className="text-navy-200 text-xs font-medium uppercase tracking-wider mb-0.5">
              Current cycle
            </p>
            <p className="text-xl font-bold">{formatCycleLabel(activeCycle)}</p>
          </div>
          <span className="bg-amber-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            Active
          </span>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-6 text-amber-800 text-sm">
          No active cycle at the moment. Check back soon.
        </div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/school/roster"
          className="bg-white rounded-xl border border-slate-200 p-5 hover:border-navy-800 transition-colors group"
        >
          <h2 className="text-base font-semibold text-navy-800 mb-1 group-hover:text-navy-600">
            Student roster
          </h2>
          <p className="text-slate-500 text-sm">
            Add, edit, and submit your students for testing.
          </p>
          <span className="mt-3 inline-block text-sm font-medium text-amber-500 group-hover:text-amber-600">
            Open roster →
          </span>
        </Link>

        <Link
          href="/faq"
          className="bg-white rounded-xl border border-slate-200 p-5 hover:border-navy-800 transition-colors group"
        >
          <h2 className="text-base font-semibold text-navy-800 mb-1 group-hover:text-navy-600">
            Help &amp; FAQ
          </h2>
          <p className="text-slate-500 text-sm">
            Answers to common questions about the portal.
          </p>
          <span className="mt-3 inline-block text-sm font-medium text-amber-500 group-hover:text-amber-600">
            View FAQ →
          </span>
        </Link>
      </div>
    </div>
  );
}
