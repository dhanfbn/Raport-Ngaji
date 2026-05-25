"use client";

import type { DashboardData } from "@/types";
import { getBadge } from "@/lib/compute";
import StatCard from "./StatCard";
import WeeklyChart from "./WeeklyChart";
import HafalanPanel from "./HafalanPanel";
import CatatanGuru from "./CatatanGuru";

interface Props { data: DashboardData; onRefresh: () => void; }

export default function Dashboard({ data, onRefresh }: Props) {
  const { student, period, className, teacherName } = data;

  return (
    <div className="flex flex-col gap-4 md:gap-5">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

        {/* Title */}
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-yellow-100 border-2 border-yellow-200 rounded-2xl md:rounded-3xl flex items-center justify-center text-2xl md:text-4xl shrink-0">
            📗
          </div>
          <div>
            <h1 className="text-base md:text-2xl font-black text-gray-800 leading-tight">
              Laporan Progres Belajar Ngaji
            </h1>
            <p className="text-gray-400 font-bold text-xs md:text-sm mt-0.5">
              Belajar rutin, hafal bertambah, hati bertambah dekat dengan Allah 💚
            </p>
          </div>
        </div>

        {/* Student card — hidden on mobile (shown in top bar) */}
        <div className="hidden sm:flex items-center gap-3 md:gap-4 bg-white rounded-2xl md:rounded-3xl px-4 md:px-6 py-3 md:py-4 border-2 border-blue-100 shadow-sm shrink-0">
          <div className="w-10 h-10 md:w-14 md:h-14 bg-blue-100 border-2 border-blue-200 rounded-full flex items-center justify-center text-2xl md:text-4xl shrink-0">
            {student.gender?.toLowerCase() === "perempuan" ? "👧" : "👦"}
          </div>
          <div>
            <p className="font-black text-gray-800 text-sm md:text-base">{student.full_name}</p>
            <p className="text-gray-400 font-bold text-xs mt-0.5 flex items-center gap-1">
              <span>👥</span> {className}
            </p>
            <p className="text-gray-400 font-bold text-xs mt-0.5 flex items-center gap-1">
              <span>📅</span> {period.period_name}
            </p>
          </div>
        </div>
      </div>

      {/* ── Stat cards: 2×2 mobile → 4×1 desktop ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard label="Kehadiran"   value={data.kehadiranPct} sub={data.kehadiranDetail}              badge={getBadge(data.kehadiranPct)} color="green"  icon="✅" />
        <StatCard label="Tilawah"     value={data.tilawahPct}   sub="Lancar & Tartil"                   badge={getBadge(data.tilawahPct)}   color="blue"   icon="📘" />
        <StatCard label="Hafalan"     value={data.hafalanPct}   sub={data.currentSurah}                 badge={getBadge(data.hafalanPct)}   color="purple" icon="⭐" />
        <StatCard label="Adab & Sikap" value={data.adabPct}    sub="Disiplin, Sikap & Kebersihan"      badge={getBadge(data.adabPct)}      color="yellow" icon="💛" />
      </div>

      {/* ── Middle: chart full-width mobile → 2/3 + 1/3 desktop ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        <div className="md:col-span-2">
          <WeeklyChart data={data.weeklyData} />
        </div>
        <HafalanPanel
          currentSurah={data.currentSurah}
          currentProgress={data.hafalanPct}
          currentNote={data.currentSurahNote}
          nextSurah={data.nextSurah}
        />
      </div>

      {/* ── Catatan Guru ── */}
      <CatatanGuru notes={data.teacherNotes} teacherName={teacherName} onRefresh={onRefresh} />

    </div>
  );
}
