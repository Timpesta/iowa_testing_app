import Link from "next/link";
import { LoginButtons } from "@/components/LoginButtons";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
      <h1 className="text-3xl font-semibold text-slate-900 mb-8 tracking-tight">
        Iowa Testing Portal
      </h1>
      <LoginButtons />
      <Link
        href="/faq"
        className="mt-8 text-sm text-slate-500 hover:text-slate-700"
      >
        FAQ
      </Link>
    </main>
  );
}
