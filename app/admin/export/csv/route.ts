import { NextResponse } from "next/server";
import { getActiveCycle } from "@/lib/cycles";
import { getExportRows, buildCsv } from "@/lib/export";

export async function GET() {
  const activeCycle = await getActiveCycle();
  const rows = await getExportRows();
  const csv = buildCsv(rows);

  const type = activeCycle?.type ?? "fall";
  const year = activeCycle?.year ?? new Date().getFullYear();
  const filename = `iowa_test_${type}_roster_${year}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
