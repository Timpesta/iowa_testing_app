import { getActiveCycle, formatCycleLabel } from "@/lib/cycles";
import { getExportRows, getExportCount } from "@/lib/export";
import Link from "next/link";

const PREVIEW_LIMIT = 10;

export default async function AdminExportPage() {
  const [activeCycle, exportCount, previewRows] = await Promise.all([
    getActiveCycle(),
    getExportCount(),
    getExportRows(PREVIEW_LIMIT),
  ]);

  const { studentCount, schoolCount } = exportCount;

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy-800 mb-6 tracking-tight">Export</h1>

      {/* Cycle status */}
      {activeCycle ? (
        <div className="flex items-center justify-between bg-navy-800 text-white rounded-xl px-5 py-4 mb-6">
          <div>
            <p className="text-navy-200 text-xs font-medium uppercase tracking-wider mb-0.5">
              Current cycle
            </p>
            <p className="text-xl font-bold">{formatCycleLabel(activeCycle)}</p>
          </div>
          <span className="bg-amber-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            Active
          </span>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-amber-800 text-sm">
          No active cycle.{" "}
          <Link href="/admin/cycles" className="underline font-medium">
            Start a cycle
          </Link>{" "}
          before exporting.
        </div>
      )}

      {/* Export card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
          Roster export
        </h2>
        <p className="text-slate-600 text-sm mb-1">
          Exports active students from schools that have submitted for the current cycle.
        </p>
        <p className="text-2xl font-bold text-navy-800 mb-1">
          {studentCount}{" "}
          <span className="text-base font-normal text-slate-500">
            student{studentCount !== 1 ? "s" : ""} from {schoolCount} school{schoolCount !== 1 ? "s" : ""}
          </span>
        </p>

        <a
          href={activeCycle ? "/admin/export/csv" : "#"}
          download
          className={`mt-4 inline-flex rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors ${
            activeCycle && studentCount > 0
              ? "bg-amber-500 text-white hover:bg-amber-600"
              : "bg-slate-100 text-slate-400 cursor-not-allowed pointer-events-none"
          }`}
        >
          Export all students
        </a>

        {activeCycle && studentCount === 0 && (
          <p className="mt-3 text-xs text-slate-400">
            No students to export. Only schools that have submitted for the current cycle are included.
          </p>
        )}
      </div>

      {/* Preview table */}
      {previewRows.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Preview — first {previewRows.length} rows
          </h2>
          <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">School/Building</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">Code</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">Class</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">First Name</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">Last Name</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">Middle</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">Student ID</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">DOB</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">Gender</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">Grade</th>
                </tr>
              </thead>
              <tbody>
                {previewRows.map((row, i) => (
                  <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-2.5 text-navy-800 font-medium">{row.schoolName}</td>
                    <td className="px-4 py-2.5 font-mono text-slate-600">{row.schoolCode}</td>
                    <td className="px-4 py-2.5 text-slate-600">{row.class}</td>
                    <td className="px-4 py-2.5 text-slate-800">{row.firstName}</td>
                    <td className="px-4 py-2.5 text-slate-800">{row.lastName}</td>
                    <td className="px-4 py-2.5 text-slate-400">{row.middleName || "—"}</td>
                    <td className="px-4 py-2.5 font-mono text-slate-600">{row.uniqueStudentId}</td>
                    <td className="px-4 py-2.5 text-slate-600">{row.dateOfBirth}</td>
                    <td className="px-4 py-2.5 text-slate-600">{row.gender}</td>
                    <td className="px-4 py-2.5 text-slate-600">{row.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
