import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SchoolSignOut } from "@/components/school/SchoolSignOut";

export default async function SchoolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) redirect("/login");

  const { data: school } = await supabase
    .from("schools")
    .select("id, name")
    .eq("contact_email", user.email)
    .eq("status", "approved")
    .single();
  if (!school) redirect("/login?message=pending");

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link
            href="/school/dashboard"
            className="font-semibold text-slate-900 truncate max-w-[160px] sm:max-w-none"
          >
            {school.name}
          </Link>

          <nav className="flex items-center gap-4 sm:gap-6 text-sm text-slate-600 shrink-0">
            <Link href="/school/dashboard" className="hover:text-slate-900 hidden sm:inline">
              Dashboard
            </Link>
            <Link href="/school/roster" className="hover:text-slate-900">
              Roster
            </Link>
            <Link href="/faq" className="hover:text-slate-900 hidden sm:inline">
              FAQ
            </Link>
            <SchoolSignOut />
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 sm:py-8">{children}</main>
    </div>
  );
}
