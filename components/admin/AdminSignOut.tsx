"use client";

import { adminSignOut } from "@/lib/actions/admin-auth";

export function AdminSignOut() {
  return (
    <form action={adminSignOut}>
      <button
        type="submit"
        className="w-full text-left px-3 py-2 rounded-md text-navy-300 hover:bg-navy-800 hover:text-white text-sm transition-colors"
      >
        Sign out
      </button>
    </form>
  );
}
