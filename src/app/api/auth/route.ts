/**
 * POST /api/auth
 * Body: { studentId: string, birthDate: string }  → birthDate format: YYYY-MM-DD
 *
 * Returns:
 *   200 { success: true, student: { student_id, full_name, class_id, gender } }
 *   401 { error: "ID santri atau tanggal lahir tidak sesuai." }
 *   400 { error: "..." }
 *   500 { error: "..." }
 *
 * birthDate dibandingkan case-insensitive & trim untuk menghindari masalah format.
 */

import { NextRequest, NextResponse } from "next/server";
import { fetchSheetsData } from "@/lib/sheets";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const studentId: string = (body.studentId ?? "").trim();
    const birthDate: string = (body.birthDate ?? "").trim();

    if (!studentId || !birthDate) {
      return NextResponse.json(
        { error: "student_id dan tanggal lahir wajib diisi." },
        { status: 400 }
      );
    }

    const data = await fetchSheetsData();

    // Normalize birth_date from sheet the same way normalizeStr does
    const match = data.students.find((s) => {
      const idMatch =
        s.student_id.toLowerCase() === studentId.toLowerCase();

      // Support multiple date input formats: YYYY-MM-DD or DD/MM/YYYY or DD-MM-YYYY
      const sheetDate = String(s.birth_date).trim(); // already normalized by sheets.ts
      const inputNorm = normalizeDateInput(birthDate);

      return idMatch && sheetDate === inputNorm;
    });

    if (!match) {
      return NextResponse.json(
        { error: "ID santri atau tanggal lahir tidak sesuai." },
        { status: 401 }
      );
    }

    if (match.status.toLowerCase() !== "active") {
      return NextResponse.json(
        { error: "Akun santri ini tidak aktif. Hubungi ustadz/ustadzah." },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      student: {
        student_id: match.student_id,
        full_name: match.full_name,
        class_id: match.class_id,
        gender: match.gender,
      },
    });
  } catch (err) {
    console.error("[/api/auth]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error." },
      { status: 500 }
    );
  }
}

/**
 * Normalize date input to YYYY-MM-DD.
 * Accepts: "2015-03-14", "14/03/2015", "14-03-2015"
 */
function normalizeDateInput(input: string): string {
  // Already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(input)) return input;

  // DD/MM/YYYY or DD-MM-YYYY
  const parts = input.split(/[-\/]/);
  if (parts.length === 3) {
    const [a, b, c] = parts;
    if (c.length === 4) {
      // DD/MM/YYYY → YYYY-MM-DD
      return `${c}-${b.padStart(2, "0")}-${a.padStart(2, "0")}`;
    }
  }
  return input;
}
