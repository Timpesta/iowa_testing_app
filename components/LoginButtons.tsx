import Link from "next/link";

export function LoginButtons() {
  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      <Link
        href="/login"
        className="px-8 py-3 rounded-lg bg-amber-500 text-white font-semibold hover:bg-amber-600 transition-colors min-w-[160px] text-center"
      >
        School Login
      </Link>
      <Link
        href="/admin/login"
        className="px-8 py-3 rounded-lg border-2 border-navy-800 text-navy-800 font-semibold hover:bg-navy-50 transition-colors min-w-[160px] text-center"
      >
        Admin Login
      </Link>
    </div>
  );
}
