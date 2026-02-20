import Link from "next/link";
import { getActiveCycle, formatCycleLabel } from "@/lib/cycles";
import { getExportRows, getExportCount } from "@/lib/export";
import { getLastExportForCycle, formatExportedAt } from "@/lib/exports-log";

export const dynamic = "force-dynamic";

const PREVIEW_LIMIT = 10;

export default async function AdminExportPage() {
  const activeCycle = await getActiveCycle();

  const [allCount, lastExport, preview] = await Promise.all([
    getExportCount(),
    activeCycle ? getLastExportForCycle(activeCycle.id) : Promise.resolve(null),
    getExportRows(PREVIEW_LIMIT),
  ]);

  // Count new students only after we know the lastExport timestamp
  const newCount = lastExport
    ? await getExportCount(lastExport.exported_at)
    : null;

  const { studentCount, schoolCount } = allCount;
  const newStudentCount = newCount?.studentCount ?? 0;

  const hasExported = lastExport !== null;
  const canExport = !!activeCycle && studentCount > 0;

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

      {/* Export cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">

        {/* Full export */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Full roster export
          </p>
          <p className="text-3xl font-bold text-navy-800 mb-0.5">{studentCount}</p>
          <p className="text-sm text-slate-500 mb-4">
            student{studentCount !== 1 ? "s" : ""} from {schoolCount} school{schoolCount !== 1 ? "s" : ""}
          </p>

          {hasExported && lastExport && (
            <p className="text-xs text-slate-400 mb-4">
              Last exported {formatExportedAt(lastExport.exported_at)}
              {" "}({lastExport.student_count} student{lastExport.student_count !== 1 ? "s" : ""})
            </p>
          )}

          <a
            href={canExport ? "/admin/export/csv" : "#"}
            download
            className={`inline-flex rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              canExport
                ? "bg-amber-500 text-white hover:bg-amber-600"
                : "bg-slate-100 text-slate-400 cursor-not-allowed pointer-events-none"
            }`}
          >
            Export all students
          </a>

          {activeCycle && studentCount === 0 && (
            <p className="mt-3 text-xs text-slate-400">
              No students to export. Schools must submit their roster first.
            </p>
          )}
        </div>

        {/* Late additions export — only shown after at least one prior export */}
        {hasExported && lastExport && (
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Late additions
            </p>
            <p className="text-3xl font-bold text-navy-800 mb-0.5">{newStudentCount}</p>
            <p className="text-sm text-slate-500 mb-4">
              new student{newStudentCount !== 1 ? "s" : ""} since last export
            </p>
            <p className="text-xs text-slate-400 mb-4">
              Students added after {formatExportedAt(lastExport.exported_at)}
            </p>

            <a
              href={newStudentCount > 0 ? "/admin/export/csv?type=new" : "#"}
              download
              className={`inline-flex rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                newStudentCount > 0
                  ? "bg-navy-800 text-white hover:bg-navy-900"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed pointer-events-none"
              }`}
            >
              Export new students only
            </a>

            {newStudentCount === 0 && (
              <p className="mt-3 text-xs text-slate-400">
                No new students have been added since the last export.
              </p>
            )}
          </div>
        )}

        {/* Placeholder when no exports yet — show hint in place of the second card */}
        {!hasExported && activeCycle && (
          <div className="bg-slate-50 rounded-xl border border-dashed border-slate-200 p-6 flex items-center justify-center">
            <p className="text-slate-400 text-sm text-center">
              &quot;Export new students only&quot; will appear here after your first full export.
            </p>
          </div>
        )}
      </div>

      {/* Preview table */}
      {preview.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Preview — first {preview.length} rows
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
                {preview.map((row, i) => (
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
