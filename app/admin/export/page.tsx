import { getActiveCycle, formatCycleLabel } from "@/lib/cycles";
import { getExportRows, getExportCount } from "@/lib/export";
import Link from "next/link";

const PREVIEW_LIMIT = 10;

export default async function AdminExportPage() {
  const [activeCycle, totalCount, previewRows] = await Promise.all([
    getActiveCycle(),
    getExportCount(),
    getExportRows(PREVIEW_LIMIT),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900 mb-6">Export</h1>

      {activeCycle ? (
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-8">
          <p className="text-sm text-slate-500 font-medium">Current cycle</p>
          <p className="text-xl font-semibold text-slate-900 mt-1">
            {formatCycleLabel(activeCycle)}
          </p>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 text-amber-800 text-sm">
          No active cycle. Start a cycle in Cycles to export a roster.
        </div>
      )}

      <div className="bg-white rounded-lg border border-slate-200 p-6 mb-8">
        <p className="text-slate-700 mb-2">
          Export all active students from all approved schools as a CSV for the current cycle.
        </p>
        <p className="text-slate-600 text-sm mb-4">
          <strong>{totalCount}</strong> student{totalCount !== 1 ? "s" : ""} will be exported.
        </p>
        <a
          href={activeCycle ? "/admin/export/csv" : "#"}
          download
          className={`inline-flex rounded-lg px-4 py-2 text-sm font-medium ${
            activeCycle && totalCount > 0
              ? "bg-slate-900 text-white hover:bg-slate-800"
              : "bg-slate-200 text-slate-500 cursor-not-allowed pointer-events-none"
          }`}
        >
          Export All Students
        </a>
      </div>

      {previewRows.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-medium text-slate-900 mb-3">Preview (first 10 rows)</h2>
          <div className="bg-white rounded-lg border border-slate-200 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <th className="text-left font-semibold text-slate-600 px-4 py-2">School/Building</th>
                  <th className="text-left font-semibold text-slate-600 px-4 py-2">School/Building Code</th>
                  <th className="text-left font-semibold text-slate-600 px-4 py-2">Class</th>
                  <th className="text-left font-semibold text-slate-600 px-4 py-2">First Name</th>
                  <th className="text-left font-semibold text-slate-600 px-4 py-2">Last Name</th>
                  <th className="text-left font-semibold text-slate-600 px-4 py-2">Middle Name</th>
                  <th className="text-left font-semibold text-slate-600 px-4 py-2">Unique Student ID</th>
                  <th className="text-left font-semibold text-slate-600 px-4 py-2">Date of Birth</th>
                  <th className="text-left font-semibold text-slate-600 px-4 py-2">Gender</th>
                  <th className="text-left font-semibold text-slate-600 px-4 py-2">Grade</th>
                </tr>
              </thead>
              <tbody>
                {previewRows.map((row, i) => (
                  <tr key={i} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-2 text-slate-900">{row.schoolName}</td>
                    <td className="px-4 py-2 text-slate-700 font-mono">{row.schoolCode}</td>
                    <td className="px-4 py-2 text-slate-700">{row.class}</td>
                    <td className="px-4 py-2 text-slate-900">{row.firstName}</td>
                    <td className="px-4 py-2 text-slate-900">{row.lastName}</td>
                    <td className="px-4 py-2 text-slate-500">{row.middleName || "—"}</td>
                    <td className="px-4 py-2 text-slate-700 font-mono">{row.uniqueStudentId}</td>
                    <td className="px-4 py-2 text-slate-700">{row.dateOfBirth}</td>
                    <td className="px-4 py-2 text-slate-700">{row.gender}</td>
                    <td className="px-4 py-2 text-slate-700">{row.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {totalCount === 0 && activeCycle && (
        <p className="text-slate-500 text-sm">No active students to export.</p>
      )}
    </div>
  );
}
