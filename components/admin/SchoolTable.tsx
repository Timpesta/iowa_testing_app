"use client";

import Link from "next/link";
import { formatSubmittedAt } from "@/lib/roster-utils";
import type { Cycle } from "@/lib/cycles";

type School = {
  id: string;
  name: string;
  contact_email: string;
  status: string;
  code: string | null;
  submittedAt: string | null;
};

type Filter = "all" | "pending" | "approved";

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
];

const EMPTY_MESSAGES: Record<Filter, string> = {
  all: "No schools have registered yet.",
  pending: "No schools are pending approval.",
  approved: "No schools have been approved yet.",
};

export function SchoolTable({
  schools,
  currentFilter,
  activeCycle,
}: {
  schools: School[];
  currentFilter: Filter;
  activeCycle: Cycle | null;
}) {
  const colSpan = activeCycle ? 6 : 5;

  return (
    <div>
      <div className="flex gap-1 mb-6 border-b border-slate-200">
        {filters.map(({ value, label }) => (
          <Link
            key={value}
            href={value === "all" ? "/admin/schools" : `/admin/schools?filter=${value}`}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              currentFilter === value
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">
                School name
              </th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">
                Contact email
              </th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">
                Status
              </th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">
                Code
              </th>
              {activeCycle && (
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">
                  Current cycle
                </th>
              )}
              <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {schools.length === 0 ? (
              <tr>
                <td colSpan={colSpan} className="px-4 py-10 text-center text-slate-500 text-sm">
                  {EMPTY_MESSAGES[currentFilter]}
                </td>
              </tr>
            ) : (
              schools.map((school) => (
                <tr
                  key={school.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50"
                >
                  <td className="px-4 py-3 text-slate-900 font-medium">{school.name}</td>
                  <td className="px-4 py-3 text-slate-600">{school.contact_email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                        school.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {school.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 font-mono text-sm">
                    {school.code ?? "—"}
                  </td>
                  {activeCycle && (
                    <td className="px-4 py-3 text-slate-600 text-sm">
                      {school.submittedAt != null ? (
                        <span className="text-green-700 font-medium">
                          Submitted {formatSubmittedAt(school.submittedAt)}
                        </span>
                      ) : (
                        <span className="text-slate-400">Not submitted</span>
                      )}
                    </td>
                  )}
                  <td className="px-4 py-3 text-right">
                    {school.status === "pending" && (
                      <Link
                        href={`/admin/schools/${school.id}/approve`}
                        className="text-sm font-medium text-slate-700 hover:text-slate-900"
                      >
                        Approve
                      </Link>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
