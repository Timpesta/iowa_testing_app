"use client";

import { adminSignOut } from "@/lib/actions/admin-auth";

export function AdminSignOut() {
  return (
    <form action={adminSignOut}>
      <button
        type="submit"
        className="w-full text-left px-3 py-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700 text-sm"
      >
        Sign out
      </button>
    </form>
  );
}
