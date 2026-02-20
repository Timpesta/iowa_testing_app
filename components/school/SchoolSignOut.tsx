"use client";

import { schoolSignOut } from "@/lib/actions/school-auth";

export function SchoolSignOut() {
  return (
    <form action={schoolSignOut}>
      <button
        type="submit"
        className="text-sm text-slate-500 hover:text-slate-700"
      >
        Sign out
      </button>
    </form>
  );
}
