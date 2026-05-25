import { NextRequest, NextResponse } from "next/server";
import { fetchSheetsData } from "@/lib/sheets";
import { computeDashboard } from "@/lib/compute";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const studentId = searchParams.get("studentId");
  const periodId = searchParams.get("periodId") ?? undefined;

  if (!studentId) {
    return NextResponse.json({ error: "studentId is required" }, { status: 400 });
  }

  try {
    const raw = await fetchSheetsData();

    if (studentId === "list") {
      // FIX: case-insensitive status filter + include all if none match "Active"
      const activeStudents = raw.students.filter(
        (s) => s.status?.toLowerCase() === "active"
      );

      // FIX: jika tidak ada yang active, tampilkan semua (untuk dev/testing)
      const students = activeStudents.length > 0 ? activeStudents : raw.students;

      // FIX: jika tidak ada period active, pakai semua period
      const activePeriods = raw.report_periods.length > 0
        ? raw.report_periods
        : [];

      return NextResponse.json({ students, periods: activePeriods });
    }

    const dashboard = computeDashboard(raw, studentId, periodId);

    if (!dashboard) {
      return NextResponse.json(
        { error: `Student '${studentId}' atau period tidak ditemukan` },
        { status: 404 }
      );
    }

    return NextResponse.json(dashboard);
  } catch (err) {
    console.error("[/api/dashboard]", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
