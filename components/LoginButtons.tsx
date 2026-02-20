import Link from "next/link";

export function LoginButtons() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Link
        href="/login"
        className="px-8 py-3 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors min-w-[160px] text-center"
      >
        School Login
      </Link>
      <Link
        href="/admin/login"
        className="px-8 py-3 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors min-w-[160px] text-center"
      >
        Admin Login
      </Link>
    </div>
  );
}
