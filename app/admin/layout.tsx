import Link from "next/link";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/schools", label: "Schools" },
  { href: "/admin/cycles", label: "Cycles" },
  { href: "/admin/export", label: "Export" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-56 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <Link href="/admin" className="text-lg font-semibold text-slate-900">
            Admin
          </Link>
        </div>
        <nav className="p-2 flex-1">
          <ul className="space-y-0.5">
            {nav.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="block px-3 py-2 rounded-md text-slate-700 hover:bg-slate-100 hover:text-slate-900 text-sm font-medium"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
