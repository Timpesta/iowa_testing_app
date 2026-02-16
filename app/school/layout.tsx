import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

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
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/school/dashboard" className="font-semibold text-slate-900">
            {school.name}
          </Link>
          <nav className="text-sm text-slate-600">
            <Link
              href="/school/dashboard"
              className="hover:text-slate-900"
            >
              Dashboard
            </Link>
          </nav>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
