import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

type PageProps = { searchParams: Promise<{ error?: string }> };

export default async function AdminLoginPage({ searchParams }: PageProps) {
  const { error } = await searchParams;
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-slate-900 mb-1 tracking-tight">
          Admin login
        </h1>
        <p className="text-slate-600 text-sm mb-8">
          Sign in with your admin account.
        </p>
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
  );
}
