"use client";

import { schoolSignOut } from "@/lib/actions/school-auth";

export function SchoolSignOut() {
  return (
    <form action={schoolSignOut}>
      <button
        type="submit"
        className="px-3 py-1.5 text-sm font-medium text-navy-200 hover:text-white hover:bg-navy-700 rounded-md transition-colors"
      >
        Sign out
      </button>
    </form>
  );
}
