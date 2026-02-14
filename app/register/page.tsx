import Link from "next/link";
import { SchoolRegistrationForm } from "@/components/SchoolRegistrationForm";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 flex flex-col items-center">
      <Link
        href="/"
        className="text-sm text-slate-500 hover:text-slate-700 mb-8"
      >
        ← Back to home
      </Link>
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-semibold text-slate-900 mb-2 tracking-tight">
          School registration
        </h1>
        <p className="text-slate-600 text-sm mb-8">
          Register your school to use the Iowa Testing Portal. We&apos;ll review
          your request and email you when your account is approved.
        </p>
        <SchoolRegistrationForm />
      </div>
    </main>
  );
}
