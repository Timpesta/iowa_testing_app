import Link from "next/link";
import { MagicLinkForm } from "@/components/MagicLinkForm";

type PageProps = {
  searchParams: Promise<{ message?: string }>;
};

export default async function LoginPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const pendingMessage = params.message === "pending";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 flex flex-col items-center">
      <Link href="/" className="text-sm text-slate-500 hover:text-slate-700 mb-8">
        ← Back to home
      </Link>
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-semibold text-slate-900 mb-2 tracking-tight">
          School login
        </h1>
        <p className="text-slate-600 text-sm mb-6">
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
          <Link href="/register" className="text-slate-700 hover:text-slate-900 font-medium">
            Register your school
          </Link>
        </p>
      </div>
    </main>
  );
}
