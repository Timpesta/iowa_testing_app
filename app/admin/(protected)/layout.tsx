import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSignOut } from "@/components/admin/AdminSignOut";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/schools", label: "Schools" },
  { href: "/admin/cycles", label: "Cycles" },
  { href: "/admin/export", label: "Export" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) redirect("/admin/login");

  const { data: isAdmin } = await supabase.rpc("is_admin", { p_email: user.email });
  if (!isAdmin) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=denied");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col sm:flex-row">
      {/* Sidebar — collapses to top bar on mobile */}
      <aside className="w-full sm:w-56 bg-white border-b sm:border-b-0 sm:border-r border-slate-200 flex flex-col shrink-0">
        <div className="px-4 py-3 sm:py-4 border-b border-slate-200 flex items-center justify-between">
          <Link href="/admin" className="text-lg font-semibold text-slate-900">
            Admin
          </Link>
          <span className="text-xs text-slate-400 truncate max-w-[160px] hidden sm:block">
            {user.email}
          </span>
        </div>

        <nav className="p-2 flex-1">
          {/* Horizontal on mobile, vertical on sm+ */}
          <ul className="flex sm:flex-col gap-0.5 overflow-x-auto sm:overflow-visible">
            {nav.map(({ href, label }) => (
              <li key={href} className="shrink-0">
                <Link
                  href={href}
                  className="block px-3 py-2 rounded-md text-slate-700 hover:bg-slate-100 hover:text-slate-900 text-sm font-medium whitespace-nowrap"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-2 border-t border-slate-200 hidden sm:block">
          <AdminSignOut />
        </div>
      </aside>

      {/* Mobile sign-out (shown below nav strip) */}
      <div className="sm:hidden flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200 text-xs text-slate-500">
        <span className="truncate">{user.email}</span>
        <AdminSignOut />
      </div>

      <main className="flex-1 p-4 sm:p-8 min-w-0">{children}</main>
    </div>
  );
}
