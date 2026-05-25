/**
 * sheets.ts — server-side Google Sheets fetcher
 *
 * Requires:
 *   GOOGLE_SHEETS_API_KEY   = your API key (restricted to Sheets API)
 *   SPREADSHEET_ID          = the ID from your Google Sheet URL
 *
 * The sheet must be publicly shared (anyone with link → Viewer).
 * Tab names must match exactly: students, classes, teachers, attendance,
 * tilawah_progress, memorization_progress, behavior_reports, teacher_notes,
 * report_periods
 */

import type {
  SheetsData,
  Student,
  ClassInfo,
  Teacher,
  AttendanceRecord,
  TilawahProgress,
  MemorizationProgress,
  BehaviorReport,
  TeacherNote,
  ReportPeriod,
} from "@/types";

const API_KEY = process.env.GOOGLE_SHEETS_API_KEY!;
const SPREADSHEET_ID = process.env.SPREADSHEET_ID!;
const BASE_URL = "https://sheets.googleapis.com/v4/spreadsheets";

// Sheet tab names → column ranges (open-ended so new columns are auto-included)
const RANGES = [
  "students!A:J",
  "classes!A:E",
  "teachers!A:E",
  "attendance!A:G",
  "tilawah_progress!A:J",
  "memorization_progress!A:I",
  "behavior_reports!A:H",
  "teacher_notes!A:F",
  "report_periods!A:E",
];

// ─── Normalize string: trim + collapse internal whitespace ───────────────────
// Applied to ALL string values at parse time so downstream code is always clean.
// Inspired by: s.status?.trim().replace(/\s+/g, " ").toLowerCase()

function normalizeStr(raw: string): string {
  return raw.trim().replace(/\s+/g, " ");
}

// ─── Generic row → object mapper ─────────────────────────────────────────────

function rowsToObjects<T>(values: string[][]): T[] {
  if (!values || values.length < 2) return [];
  const [headers, ...rows] = values;
  return rows
    .filter((row) => row.some((cell) => cell.trim() !== ""))
    .map((row) => {
      const obj: Record<string, string | number> = {};
      headers.forEach((header, i) => {
        const raw = normalizeStr(row[i] ?? "");
        // Auto-cast numeric strings; preserve date strings (contain "-")
        const num = Number(raw);
        const isDate = /^\d{4}-\d{2}-\d{2}/.test(raw);
        obj[normalizeStr(header)] = raw !== "" && !isNaN(num) && !isDate ? num : raw;
      });
      return obj as T;
    });
}

// ─── Main fetcher ─────────────────────────────────────────────────────────────

export async function fetchSheetsData(): Promise<SheetsData> {
  if (!API_KEY || !SPREADSHEET_ID) {
    throw new Error(
      "Missing GOOGLE_SHEETS_API_KEY or SPREADSHEET_ID environment variables."
    );
  }

  const rangesParam = RANGES.map((r) => `ranges=${encodeURIComponent(r)}`).join(
    "&"
  );
  const url = `${BASE_URL}/${SPREADSHEET_ID}/values:batchGet?${rangesParam}&key=${API_KEY}`;

  const res = await fetch(url, {
    // Revalidate every 60 seconds (ISR-style caching)
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Google Sheets API error ${res.status}: ${body}`);
  }

  const json = await res.json();
  const valueRanges: { values?: string[][] }[] = json.valueRanges ?? [];

  const [
    studentsRaw,
    classesRaw,
    teachersRaw,
    attendanceRaw,
    tilawahRaw,
    memorizationRaw,
    behaviorRaw,
    notesRaw,
    periodsRaw,
  ] = valueRanges.map((vr) => vr.values ?? []);

  return {
    students: rowsToObjects<Student>(studentsRaw),
    classes: rowsToObjects<ClassInfo>(classesRaw),
    teachers: rowsToObjects<Teacher>(teachersRaw),
    attendance: rowsToObjects<AttendanceRecord>(attendanceRaw),
    tilawah_progress: rowsToObjects<TilawahProgress>(tilawahRaw),
    memorization_progress: rowsToObjects<MemorizationProgress>(memorizationRaw),
    behavior_reports: rowsToObjects<BehaviorReport>(behaviorRaw),
    teacher_notes: rowsToObjects<TeacherNote>(notesRaw),
    report_periods: rowsToObjects<ReportPeriod>(periodsRaw),
  };
}
