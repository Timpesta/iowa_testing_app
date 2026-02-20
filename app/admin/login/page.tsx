import Link from "next/link";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

type PageProps = { searchParams: Promise<{ error?: string }> };

export default async function AdminLoginPage({ searchParams }: PageProps) {
  const { error } = await searchParams;
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-navy-800 px-6 py-4">
        <Link href="/" className="text-white font-bold text-lg tracking-tight hover:opacity-90">
          Eagles Edge
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm bg-white rounded-xl border border-slate-200 p-8">
          <div className="mb-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-500">
              Administrator
            </span>
            <h1 className="text-2xl font-bold text-navy-800 mt-1 tracking-tight">
              Admin login
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Sign in with your admin account.
            </p>
          </div>

          {error === "denied" && (
            <div
              role="alert"
              className="rounded-lg bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm mb-6"
            >
              Access denied. This account does not have admin privileges.
            </div>
          )}

          <AdminLoginForm />
        </div>
      </main>
    </div>
  );
}
