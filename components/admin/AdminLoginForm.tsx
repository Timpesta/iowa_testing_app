"use client";

import { useFormState } from "react-dom";
import { adminLogin } from "@/lib/actions/admin-auth";

export function AdminLoginForm() {
  const [state, formAction] = useFormState(adminLogin, null);

  return (
    <form action={formAction} className="space-y-4">
      {state && !state.success && (
        <div
          role="alert"
          className="rounded-lg bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm"
        >
          {state.message}
        </div>
      )}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-navy-800 mb-1"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 placeholder-slate-400 focus:border-navy-800 focus:outline-none focus:ring-1 focus:ring-navy-800"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-navy-800 mb-1"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 focus:border-navy-800 focus:outline-none focus:ring-1 focus:ring-navy-800"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-lg bg-navy-800 px-4 py-2.5 text-white font-semibold hover:bg-navy-900 transition-colors"
      >
        Sign in
      </button>
    </form>
  );
}
