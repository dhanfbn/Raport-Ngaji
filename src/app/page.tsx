"use client";

import { useEffect, useState, useCallback } from "react";
import type { DashboardData, ReportPeriod } from "@/types";
import Dashboard from "@/components/Dashboard";
import LoginPage from "@/components/LoginPage";

interface AuthStudent {
  student_id: string;
  full_name: string;
  class_id: string;
  gender: string;
}

const SESSION_KEY = "ngaji_sore_auth";

export default function Home() {
  const [auth, setAuth] = useState<AuthStudent | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved) setAuth(JSON.parse(saved));
    } catch { /* ignore */ }
    setAuthChecked(true);
  }, []);

  if (!authChecked) return null;
  if (!auth) {
    return <LoginPage onLogin={(s) => {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(s));
      setAuth(s);
    }} />;
  }

  return (
    <DashboardShell
      studentId={auth.student_id}
      studentName={auth.full_name}
      gender={auth.gender}
      onLogout={() => { sessionStorage.removeItem(SESSION_KEY); setAuth(null); }}
    />
  );
}

// ─── Nav items ────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { icon: "🏠", label: "Ringkasan" },
  { icon: "📅", label: "Kehadiran" },
  { icon: "📖", label: "Tilawah" },
  { icon: "⭐", label: "Hafalan" },
  { icon: "💛", label: "Adab & Sikap" },
  { icon: "📋", label: "Catatan Guru" },
];

// ─── Dashboard shell ──────────────────────────────────────────────────────────

interface ShellProps {
  studentId: string;
  studentName: string;
  gender: string;
  onLogout: () => void;
}

function DashboardShell({ studentId, studentName, gender, onLogout }: ShellProps) {
  const [periods, setPeriods] = useState<ReportPeriod[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeNav, setActiveNav] = useState("Ringkasan");
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    fetch("/api/dashboard?studentId=list")
      .then((r) => r.json())
      .then((json) => {
        const all: ReportPeriod[] = json.periods ?? [];
        setPeriods(all);
        const active = all.find((p) => p.status?.toLowerCase() === "active");
        setSelectedPeriod(active?.period_id ?? all[0]?.period_id ?? "");
      })
      .catch((e) => setError(e.message));
  }, []);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ studentId });
      if (selectedPeriod) params.set("periodId", selectedPeriod);
      const res = await fetch(`/api/dashboard?${params}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`);
      setDashboard(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }, [studentId, selectedPeriod]);

  useEffect(() => { if (selectedPeriod) loadDashboard(); }, [selectedPeriod, loadDashboard]);

  // Close drawer on outside click
  const closeDrawer = () => setDrawerOpen(false);

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex flex-col items-center mb-5">
        <div className="w-14 h-14 bg-green-100 border-2 border-green-200 rounded-2xl flex items-center justify-center text-3xl mb-1">🕌</div>
        <span className="text-green-600 font-black text-base">Ngaji Sore</span>
        <span className="text-gray-400 text-[10px] tracking-wide">Belajar • Mengaji • Berkah</span>
      </div>

      {/* Student chip */}
      <div className="bg-green-50 border-2 border-green-100 rounded-2xl px-3 py-2.5 mb-3">
        <p className="text-green-800 font-black text-xs truncate">{studentName}</p>
        <p className="text-green-500 text-[10px] font-semibold mt-0.5">Santri aktif ✅</p>
      </div>

      {/* Period */}
      <div className="mb-4">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Periode</label>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="w-full mt-1 text-xs font-bold text-gray-700 bg-gray-50 border-2 border-gray-100 rounded-xl px-3 py-2 focus:outline-none focus:border-green-300"
        >
          {periods.map((p) => <option key={p.period_id} value={p.period_id}>{p.period_name}</option>)}
        </select>
      </div>

      {/* Nav */}
      {/* <nav className="flex flex-col gap-1 flex-1">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.label}
            onClick={() => { setActiveNav(item.label); closeDrawer(); }}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-black transition-all ${
              activeNav === item.label
                ? "bg-green-500 text-white shadow-md shadow-green-200"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <span className="text-base">{item.icon}</span>{item.label}
          </button>
        ))}
      </nav> */}
      <nav className="flex flex-col gap-1 flex-1">
        {NAV_ITEMS.map((item) => {
          const isLocked = item.label !== "Ringkasan";

          return (
            <button
              key={item.label}
              onClick={() => {
                if (!isLocked) {
                  setActiveNav(item.label);
                }
              }}
              disabled={isLocked}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all ${
                activeNav === item.label
                  ? "bg-green-500 text-white shadow-md shadow-green-200"
                  : "text-gray-500 hover:bg-gray-50"
              } ${
                isLocked
                  ? "opacity-60 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>

              {isLocked && (
                <span className="opacity-70">🔒</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout + thanks */}
      <div className="mt-4 space-y-2">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 text-xs font-black text-gray-400 hover:text-red-500 hover:bg-red-50 py-2 rounded-xl transition-all border-2 border-gray-100 hover:border-red-100"
        >
          🚪 Keluar
        </button>
        <div className="bg-green-50 border-2 border-green-100 rounded-2xl p-3 text-center">
          <div className="text-2xl mb-1">👨‍👩‍👧</div>
          <p className="text-green-800 font-black text-xs">Terima kasih</p>
          <p className="text-green-600 text-[10px] leading-snug mt-1">atas dukungan Ayah Bunda. Semangat ngaji hari ini!</p>
          <span className="text-sm mt-1 block">💚</span>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* ── Desktop sidebar (md+) ── */}
      <aside className="hidden md:flex w-52 bg-white border-r-2 border-gray-100 flex-col py-5 px-3 shrink-0">
        {sidebarContent}
      </aside>

      {/* ── Mobile drawer overlay ── */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={closeDrawer}
        />
      )}

      {/* ── Mobile drawer panel ── */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white z-50 flex flex-col py-5 px-4 shadow-2xl transition-transform duration-300 md:hidden ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button */}
        <button
          onClick={closeDrawer}
          className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-black text-lg"
        >
          ✕
        </button>
        {sidebarContent}
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Mobile top bar */}
        <header className="md:hidden sticky top-0 z-30 bg-white border-b-2 border-gray-100 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setDrawerOpen(true)}
            className="w-10 h-10 bg-green-50 border-2 border-green-100 rounded-xl flex items-center justify-center text-xl"
          >
            ☰
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xl">🕌</span>
            <span className="font-black text-green-600 text-sm">Ngaji Sore</span>
          </div>
          <div className="w-10 h-10 bg-blue-50 border-2 border-blue-100 rounded-full flex items-center justify-center text-xl">
            {gender?.toLowerCase() === "perempuan" ? "👧" : "👦"}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-3 md:p-6">
          {error && (
            <div className="mb-4 bg-red-50 border-2 border-red-100 text-red-700 rounded-2xl px-4 py-3 text-sm font-bold">
              ⚠️ {error}
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center space-y-3">
                <div className="text-4xl animate-spin">⭐</div>
                <p className="text-gray-500 font-bold text-sm">Memuat laporan...</p>
              </div>
            </div>
          )}

          {!loading && dashboard && (
            <div className="fade-in">
              <Dashboard data={dashboard} onRefresh={loadDashboard} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
