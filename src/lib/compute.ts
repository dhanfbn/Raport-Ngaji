/**
 * compute.ts — transform raw SheetsData into DashboardData
 * All business logic lives here, keeping components pure UI.
 */

import type {
  SheetsData,
  DashboardData,
  WeeklyPoint,
  ReportPeriod,
} from "@/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function avg(nums: number[]): number {
  if (!nums.length) return 0;
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
}

function clamp(v: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(v)));
}

/** Divide a date range into N equal week buckets, return start dates */
function buildWeeks(
  start: string,
  end: string,
  count = 4
): { label: string; from: Date; to: Date }[] {
  const s = new Date(start);
  const e = new Date(end);
  const total = e.getTime() - s.getTime();
  const chunk = total / count;

  return Array.from({ length: count }, (_, i) => {
    const from = new Date(s.getTime() + i * chunk);
    const to = new Date(s.getTime() + (i + 1) * chunk - 1);
    return { label: `Minggu ${i + 1}`, from, to };
  });
}

function inRange(dateStr: string, from: Date, to: Date): boolean {
  const d = new Date(dateStr);
  return d >= from && d <= to;
}

// ─── Grade badges ─────────────────────────────────────────────────────────────

export function getBadge(pct: number): { label: string; emoji: string } {
  if (pct >= 90) return { label: "Hebat!", emoji: "🎉" };
  if (pct >= 80) return { label: "Baik", emoji: "👍" };
  if (pct >= 65) return { label: "Cukup", emoji: "😊" };
  return { label: "Perlu Ditingkatkan", emoji: "💪" };
}

// ─── Main compute function ────────────────────────────────────────────────────

export function computeDashboard(
  data: SheetsData,
  studentId: string,
  periodId?: string
): DashboardData | null {
  // ── Student
  const student = data.students.find((s) => s.student_id === studentId);
  if (!student) return null;

  // ── Period (default: first active)
  const period: ReportPeriod =
    data.report_periods.find((p) =>
      periodId ? p.period_id === periodId : p.status === "active"
    ) ?? data.report_periods[0];

  if (!period) return null;

  // ── Class & Teacher
  const classInfo = data.classes.find((c) => c.class_id === student.class_id);
  const teacher = data.teachers.find(
    (t) => t.teacher_id === classInfo?.teacher_id
  );

  // ── Filter records to this student + period
  const periodStart = period.start_date;
  const periodEnd = period.end_date;

  const att = data.attendance.filter(
    (a) =>
      a.student_id === studentId &&
      a.attendance_date >= periodStart &&
      a.attendance_date <= periodEnd
  );

  const tilawah = data.tilawah_progress.filter(
    (t) =>
      t.student_id === studentId &&
      t.session_date >= periodStart &&
      t.session_date <= periodEnd
  );

  const memorization = data.memorization_progress.filter(
    (m) =>
      m.student_id === studentId &&
      m.start_date >= periodStart
  );

  const behavior = data.behavior_reports.filter(
    (b) =>
      b.student_id === studentId &&
      b.report_date >= periodStart &&
      b.report_date <= periodEnd
  );

  const notes = data.teacher_notes.filter(
    (n) =>
      n.student_id === studentId &&
      n.note_date >= periodStart &&
      n.note_date <= periodEnd
  );

  // ── Kehadiran
  const totalSessions = att.length;
  const hadirCount = att.filter((a) => a.status === "Hadir").length;
  const kehadiranPct = totalSessions > 0 ? clamp((hadirCount / totalSessions) * 100) : 0;

  // ── Tilawah: avg of (fluency + tajwid) / 2 across sessions
  const tilawahScores = tilawah.map(
    (t) => (Number(t.fluency_score) + Number(t.tajwid_score)) / 2
  );
  const tilawahPct = clamp(avg(tilawahScores));

  // ── Hafalan: ongoing surah progress
  const ongoingHafalan = memorization
    .filter((m) => m.status === "Ongoing")
    .sort((a, b) => Number(b.progress_percent) - Number(a.progress_percent));

  const currentHafalan = ongoingHafalan[0] ?? memorization[0];
  const hafalanPct = currentHafalan ? clamp(Number(currentHafalan.progress_percent)) : 0;
  const currentSurah = currentHafalan?.surah_name ?? "-";
  const currentSurahNote = currentHafalan?.teacher_note ?? "";

  // Next surah = second ongoing (or first complete)
  const nextHafalan = ongoingHafalan[1] ?? memorization.find((m) => m.status === "Complete");
  const nextSurah = nextHafalan?.surah_name ?? null;

  // ── Adab & Sikap: avg of 3 scores
  const adabScores = behavior.map((b) =>
    avg([Number(b.discipline_score), Number(b.attitude_score), Number(b.cleanliness_score)])
  );
  const adabPct = clamp(avg(adabScores));

  // ── Weekly chart (4 weeks within period)
  const weeks = buildWeeks(periodStart, periodEnd, 4);

  const weeklyData: WeeklyPoint[] = weeks.map(({ label, from, to }) => {
    // Kehadiran
    const wAtt = att.filter((a) => inRange(a.attendance_date, from, to));
    const wHadir = wAtt.filter((a) => a.status === "Hadir").length;
    const wKehadiran = wAtt.length > 0 ? clamp((wHadir / wAtt.length) * 100) : 0;

    // Tilawah
    const wTil = tilawah.filter((t) => inRange(t.session_date, from, to));
    const wTilScores = wTil.map(
      (t) => (Number(t.fluency_score) + Number(t.tajwid_score)) / 2
    );
    const wTilawah = wTilScores.length > 0 ? clamp(avg(wTilScores)) : 0;

    // Hafalan: interpolate progress across weeks
    // week 1 = 0, week N = current progress
    const weekIdx = weeks.findIndex((w) => w.label === label);
    const progressStep = hafalanPct / (weeks.length - 1 || 1);
    const wHafalan = clamp(Math.round(progressStep * weekIdx));

    // Adab
    const wBeh = behavior.filter((b) => inRange(b.report_date, from, to));
    const wAdabScores = wBeh.map((b) =>
      avg([Number(b.discipline_score), Number(b.attitude_score), Number(b.cleanliness_score)])
    );
    const wAdab = wAdabScores.length > 0 ? clamp(avg(wAdabScores)) : 0;

    return {
      name: label,
      Kehadiran: wKehadiran,
      Tilawah: wTilawah,
      Hafalan: wHafalan,
      "Adab & Sikap": wAdab,
    };
  });

  return {
    student,
    period,
    className: classInfo?.class_name ?? "-",
    teacherName: teacher?.teacher_name ?? "-",
    kehadiranPct,
    kehadiranDetail: `${hadirCount} dari ${totalSessions} pertemuan`,
    tilawahPct,
    hafalanPct,
    currentSurah,
    currentSurahNote,
    nextSurah,
    adabPct,
    weeklyData,
    teacherNotes: notes.map((n) => ({ note: n.note, category: n.category })),
  };
}
