export function LoginButtons() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <button
        type="button"
        className="px-8 py-3 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors min-w-[160px]"
      >
        School Login
      </button>
      <button
        type="button"
        className="px-8 py-3 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors min-w-[160px]"
      >
        Admin Login
      </button>
    </div>
  );
}
