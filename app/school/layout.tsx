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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-navy-800 px-4 sm:px-6 py-0">
        <div className="max-w-5xl mx-auto flex items-center justify-between h-14">
          {/* Logo / school name */}
          <div className="flex items-center gap-3">
            <Link href="/" className="text-white font-bold text-base tracking-tight hover:opacity-90 shrink-0">
              Eagles Edge
            </Link>
            <span className="text-navy-300 hidden sm:inline text-sm">·</span>
            <span className="text-navy-200 text-sm hidden sm:inline truncate max-w-[180px]">
              {school.name}
            </span>
          </div>

          {/* Nav */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/school/dashboard"
              className="px-3 py-1.5 text-sm font-medium text-navy-200 hover:text-white hover:bg-navy-700 rounded-md transition-colors hidden sm:block"
            >
              Dashboard
            </Link>
            <Link
              href="/school/roster"
              className="px-3 py-1.5 text-sm font-medium text-navy-200 hover:text-white hover:bg-navy-700 rounded-md transition-colors"
            >
              Roster
            </Link>
            <Link
              href="/faq"
              className="px-3 py-1.5 text-sm font-medium text-navy-200 hover:text-white hover:bg-navy-700 rounded-md transition-colors hidden sm:block"
            >
              FAQ
            </Link>
            <div className="ml-2 pl-2 border-l border-navy-700">
              <SchoolSignOut />
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  );
}
