import { NextResponse } from "next/server";
import { getActiveCycle } from "@/lib/cycles";
import { getExportRows, buildCsv } from "@/lib/export";
import { getLastExportForCycle, logExport } from "@/lib/exports-log";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const exportType = searchParams.get("type") === "new" ? "new" : "full";

  const activeCycle = await getActiveCycle();
  if (!activeCycle) {
    return new NextResponse("No active cycle", { status: 400 });
  }

  // For "new students only", filter to students created after the last export.
  let since: string | undefined;
  if (exportType === "new") {
    const lastExport = await getLastExportForCycle(activeCycle.id);
    if (!lastExport) {
      return new NextResponse("No previous export found for this cycle", { status: 400 });
    }
    since = lastExport.exported_at;
  }

  const rows = await getExportRows(undefined, since);
  const csv = buildCsv(rows);

  // Log the export so the next "new students" request has a baseline.
  await logExport(activeCycle.id, exportType, rows.length);

  const cycleType = activeCycle.type ?? "fall";
  const year = activeCycle.year ?? new Date().getFullYear();
  const suffix = exportType === "new" ? "_late_additions" : "";
  const filename = `iowa_test_${cycleType}_roster_${year}${suffix}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
