import Link from "next/link";
import { LoginButtons } from "@/components/LoginButtons";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top bar */}
      <header className="bg-navy-800 px-6 py-4">
        <span className="text-white font-bold text-lg tracking-tight">
          Eagles Edge Testing
        </span>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full text-center">
          <div className="inline-block bg-amber-500 text-white text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-6">
            Iowa Standardized Testing
          </div>
          <h1 className="text-4xl font-bold text-navy-800 mb-4 tracking-tight leading-tight">
            Eagles Edge<br />Testing Portal
          </h1>
          <p className="text-slate-500 text-base mb-10 leading-relaxed">
            Roster management for Iowa standardized testing.
            Register your school, manage student records, and submit
            rosters each cycle — all in one place.
          </p>
          <LoginButtons />
        </div>

        {/* Divider + links */}
        <div className="mt-16 flex items-center gap-6 text-sm text-slate-400">
          <Link href="/faq" className="hover:text-navy-800 transition-colors">
            Frequently asked questions
          </Link>
          <span>·</span>
          <Link href="/register" className="hover:text-navy-800 transition-colors">
            Register a school
          </Link>
        </div>
      </main>

      <footer className="text-center text-xs text-slate-400 py-6">
        Eagles Edge Testing Portal
      </footer>
    </div>
  );
}
