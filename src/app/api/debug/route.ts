/**
 * GET /api/debug
 * Endpoint khusus untuk troubleshooting — hapus setelah production!
 * Buka di browser: http://localhost:3000/api/debug
 */

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
  const spreadsheetId = process.env.SPREADSHEET_ID;

  // Cek env vars
  const envCheck = {
    GOOGLE_SHEETS_API_KEY: apiKey
      ? `✅ Ada (${apiKey.slice(0, 8)}...)`
      : "❌ TIDAK ADA — buat .env.local!",
    SPREADSHEET_ID: spreadsheetId
      ? `✅ Ada (${spreadsheetId})`
      : "❌ TIDAK ADA — buat .env.local!",
  };

  if (!apiKey || !spreadsheetId) {
    return NextResponse.json({
      status: "❌ ENV VARS MISSING",
      envCheck,
      fix: "Buat file .env.local di root project dengan isi:\nGOOGLE_SHEETS_API_KEY=AIzaSy...\nSPREADSHEET_ID=1BxiMV...",
    });
  }

  // Test koneksi ke Google Sheets — cuma ambil tab students dulu
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/students!A:J?key=${apiKey}`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    const json = await res.json();

    if (!res.ok) {
      return NextResponse.json({
        status: "❌ GOOGLE SHEETS API ERROR",
        envCheck,
        httpStatus: res.status,
        googleError: json.error,
        commonFixes: {
          403: "Sheet belum di-share ke 'anyone with link → Viewer'",
          400: "Nama tab 'students' tidak ditemukan atau Spreadsheet ID salah",
          401: "API Key tidak valid atau Sheets API belum di-enable",
        },
      });
    }

    const values: string[][] = json.values ?? [];
    const headers = values[0] ?? [];
    const rows = values.slice(1);

    return NextResponse.json({
      status: "✅ KONEKSI OK",
      envCheck,
      sheetsResponse: {
        totalRows: rows.length,
        headers,
        sampleRow: rows[0] ?? "— tidak ada data —",
        allStudentNames: rows.map((r) => `${r[0]} — ${r[1]} — status: ${r[8]}`),
      },
      hint:
        rows.length === 0
          ? "⚠️ Tab 'students' kosong! Isi data dulu."
          : rows.every((r) => r[8] !== "Active")
          ? `⚠️ Kolom 'status' tidak ada yang bernilai 'Active'. Nilai yang ada: ${[...new Set(rows.map((r) => r[8]))].join(", ")}`
          : "Data OK. Kalau dropdown masih kosong, cek di /api/debug/all",
    });
  } catch (err) {
    return NextResponse.json({
      status: "❌ FETCH ERROR",
      envCheck,
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
