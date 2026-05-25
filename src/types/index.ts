// ─── Raw sheet row types (matching column order in Google Sheets) ─────────────

export interface Student {
  student_id: string;
  full_name: string;
  gender: string;
  birth_date: string;
  class_id: string;
  parent_name: string;
  parent_phone: string;
  photo_url: string;
  status: string;
  created_at: string;
}

export interface ClassInfo {
  class_id: string;
  class_name: string;
  teacher_id: string;
  schedule_day: string;
  created_at: string;
}

export interface Teacher {
  teacher_id: string;
  teacher_name: string;
  phone: string;
  photo_url: string;
  status: string;
}

export interface AttendanceRecord {
  attendance_id: string;
  student_id: string;
  class_id: string;
  attendance_date: string; // YYYY-MM-DD
  status: "Hadir" | "Sakit" | "Izin" | "Alpha" | string;
  note: string;
  created_by: string;
}

export interface TilawahProgress {
  tilawah_id: string;
  student_id: string;
  surah_name: string;
  ayat_from: number;
  ayat_to: number;
  fluency_score: number;
  tajwid_score: number;
  session_date: string; // YYYY-MM-DD
  teacher_note: string;
  created_by: string;
}

export interface MemorizationProgress {
  memorization_id: string;
  student_id: string;
  surah_name: string;
  target_type: string;
  progress_percent: number;
  status: "Ongoing" | "Complete" | string;
  start_date: string;
  target_date: string;
  teacher_note: string;
}

export interface BehaviorReport {
  behavior_id: string;
  student_id: string;
  discipline_score: number;
  attitude_score: number;
  cleanliness_score: number;
  note: string;
  report_date: string; // YYYY-MM-DD
  created_by: string;
}

export interface TeacherNote {
  note_id: string;
  student_id: string;
  teacher_id: string;
  note: string;
  category: string;
  note_date: string;
}

export interface ReportPeriod {
  period_id: string;
  period_name: string;
  start_date: string;
  end_date: string;
  status: string;
}

// ─── Raw data bundle (all sheets) ────────────────────────────────────────────

export interface SheetsData {
  students: Student[];
  classes: ClassInfo[];
  teachers: Teacher[];
  attendance: AttendanceRecord[];
  tilawah_progress: TilawahProgress[];
  memorization_progress: MemorizationProgress[];
  behavior_reports: BehaviorReport[];
  teacher_notes: TeacherNote[];
  report_periods: ReportPeriod[];
}

// ─── Computed dashboard payload ───────────────────────────────────────────────

export interface WeeklyPoint {
  name: string;
  Kehadiran: number;
  Tilawah: number;
  Hafalan: number;
  "Adab & Sikap": number;
}

export interface DashboardData {
  student: Student;
  period: ReportPeriod;
  className: string;
  teacherName: string;
  // Summary stats
  kehadiranPct: number;
  kehadiranDetail: string; // e.g. "9 dari 10 pertemuan"
  tilawahPct: number;
  hafalanPct: number;
  currentSurah: string;
  currentSurahNote: string;
  nextSurah: string | null;
  adabPct: number;
  // Chart
  weeklyData: WeeklyPoint[];
  // Right panel
  teacherNotes: { note: string; category: string }[];
}

// ─── API response wrapper ─────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
