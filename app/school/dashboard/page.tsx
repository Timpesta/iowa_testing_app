import { createClient } from "@/lib/supabase/server";

export default async function SchoolDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: school } = await supabase
    .from("schools")
    .select("name")
    .eq("contact_email", user!.email!)
    .eq("status", "approved")
    .single();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900 mb-2">
        Welcome, {school?.name}
      </h1>
      <p className="text-slate-600 mb-8">
        Manage your students and testing cycles from here.
      </p>
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-lg font-medium text-slate-900 mb-2">
          Roster management
        </h2>
        <p className="text-slate-500 text-sm">
          Roster management coming soon.
        </p>
      </div>
    </div>
  );
}
