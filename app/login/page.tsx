import Link from "next/link";
import { MagicLinkForm } from "@/components/MagicLinkForm";

type PageProps = {
  searchParams: Promise<{ message?: string }>;
};

export default async function LoginPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const pendingMessage = params.message === "pending";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-navy-800 px-6 py-4">
        <Link href="/" className="text-white font-bold text-lg tracking-tight hover:opacity-90">
          Eagles Edge Testing
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-xl border border-slate-200 p-8">
          <h1 className="text-2xl font-bold text-navy-800 mb-1 tracking-tight">
            School login
          </h1>
          <p className="text-slate-500 text-sm mb-6">
            Enter your school contact email and we&apos;ll send you a login link.
          </p>

          {pendingMessage && (
            <div
              role="alert"
              className="rounded-lg bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 text-sm mb-6"
            >
              Your school registration is pending approval. You&apos;ll receive an
              email when your account is approved.
            </div>
          )}

          <MagicLinkForm />

          <p className="mt-6 text-center text-sm text-slate-500">
            New to the portal?{" "}
            <Link href="/register" className="text-navy-800 hover:text-navy-600 font-medium">
              Register your school
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
