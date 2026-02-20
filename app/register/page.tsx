import Link from "next/link";
import { SchoolRegistrationForm } from "@/components/SchoolRegistrationForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-navy-800 px-6 py-4">
        <Link href="/" className="text-white font-bold text-lg tracking-tight hover:opacity-90">
          Eagles Edge
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-xl border border-slate-200 p-8">
          <h1 className="text-2xl font-bold text-navy-800 mb-1 tracking-tight">
            Register your school
          </h1>
          <p className="text-slate-500 text-sm mb-8">
            Submit your school&apos;s information below. We&apos;ll review your request
            and email you when your account is approved.
          </p>
          <SchoolRegistrationForm />
          <p className="mt-6 text-center text-sm text-slate-500">
            Already registered?{" "}
            <Link href="/login" className="text-navy-800 hover:text-navy-600 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
