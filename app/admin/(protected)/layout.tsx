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
      {/* Sidebar */}
      <aside className="w-full sm:w-56 bg-navy-900 flex flex-col shrink-0">
        {/* Logo */}
        <div className="px-4 py-4 border-b border-navy-800">
          <Link href="/admin" className="text-white font-bold text-base tracking-tight hover:opacity-90 block">
            Eagles Edge Testing
          </Link>
          <span className="text-xs text-navy-300 font-medium uppercase tracking-wider mt-0.5 block">
            Admin
          </span>
        </div>

        {/* Nav links */}
        <nav className="p-2 flex-1">
          <ul className="flex sm:flex-col gap-0.5 overflow-x-auto sm:overflow-visible">
            {nav.map(({ href, label }) => (
              <li key={href} className="shrink-0">
                <Link
                  href={href}
                  className="block px-3 py-2 rounded-md text-navy-200 hover:bg-navy-800 hover:text-white text-sm font-medium whitespace-nowrap transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer: email + sign out */}
        <div className="p-3 border-t border-navy-800 hidden sm:block">
          <p className="text-xs text-navy-400 truncate mb-2 px-1">{user.email}</p>
          <AdminSignOut />
        </div>
      </aside>

      {/* Mobile: email + sign out strip */}
      <div className="sm:hidden flex items-center justify-between px-4 py-2 bg-navy-950 text-xs text-navy-300">
        <span className="truncate">{user.email}</span>
        <AdminSignOut />
      </div>

      <main className="flex-1 p-4 sm:p-8 min-w-0">{children}</main>
    </div>
  );
}
