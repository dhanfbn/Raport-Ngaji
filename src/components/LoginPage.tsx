"use client";

import { useState, FormEvent } from "react";

interface LoginResult {
  student_id: string;
  full_name: string;
  class_id: string;
  gender: string;
}

interface Props { onLogin: (student: LoginResult) => void }

export default function LoginPage({ onLogin }: Props) {
  const [studentId, setStudentId] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, birthDate }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Login gagal.");
        setShake(true);
        setTimeout(() => setShake(false), 500);
        return;
      }
      onLogin(json.student);
    } catch {
      setError("Tidak bisa terhubung ke server.");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex flex-col items-center justify-center px-4 py-10 relative overflow-hidden">

      {/* Floating decorations — smaller on mobile */}
      <div className="fixed top-6 left-4 text-4xl md:text-5xl opacity-20 rotate-[-15deg] select-none pointer-events-none">⭐</div>
      <div className="fixed top-12 right-6 text-3xl md:text-4xl opacity-15 rotate-[20deg] select-none pointer-events-none">📖</div>
      <div className="fixed bottom-16 left-6 text-3xl md:text-4xl opacity-15 rotate-[10deg] select-none pointer-events-none">🌙</div>
      <div className="fixed bottom-6 right-4 text-4xl md:text-5xl opacity-20 rotate-[-10deg] select-none pointer-events-none">✨</div>

      {/* Logo */}
      <div className="flex flex-col items-center mb-6 md:mb-8">
        <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-[24px] md:rounded-[28px] shadow-xl shadow-green-100 flex items-center justify-center text-4xl md:text-5xl mb-3 md:mb-4 border-2 border-green-100">
          🕌
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-green-700 tracking-tight">Ngaji Sore</h1>
        <p className="text-green-500 font-bold text-sm md:text-base mt-1">Belajar · Mengaji · Berkah 💚</p>
      </div>

      {/* Card */}
      <div
        className="bg-white rounded-3xl shadow-2xl shadow-green-100 border-2 border-green-100 w-full max-w-sm p-6 md:p-8"
        style={shake ? { animation: "shake .4s ease-in-out" } : {}}
      >
        <div className="text-center mb-6">
          <h2 className="text-xl md:text-2xl font-black text-gray-800">Halo, Santri! 👋</h2>
          <p className="text-gray-400 font-semibold text-sm mt-1">Masuk untuk lihat laporan belajarmu</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:gap-5">
          {/* Student ID */}
          <div>
            <label className="block text-[10px] md:text-xs font-black text-gray-500 uppercase tracking-widest mb-2">ID Santri</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg md:text-xl pointer-events-none">🪪</span>
              <input
                type="text" placeholder="Contoh: STD0001"
                value={studentId} onChange={(e) => setStudentId(e.target.value)}
                required autoComplete="off"
                className="w-full pl-11 pr-4 py-3 md:py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-bold text-gray-700 placeholder:text-gray-300 focus:outline-none focus:border-green-400 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Birth date */}
          <div>
            <label className="block text-[10px] md:text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Tanggal Lahir</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg md:text-xl pointer-events-none">🎂</span>
              <input
                type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 md:py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-bold text-gray-700 focus:outline-none focus:border-green-400 focus:bg-white transition-all cursor-pointer"
              />
            </div>
            <p className="text-gray-400 text-[10px] md:text-[11px] font-semibold mt-1.5 pl-1">
              Sesuai tanggal lahir yang didaftarkan ustadz/ustadzah
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border-2 border-red-100 rounded-2xl px-4 py-3 flex items-center gap-2">
              <span className="text-xl">😅</span>
              <p className="text-red-600 text-xs font-bold leading-snug">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit" disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 active:scale-[.98] text-white font-black text-base py-3.5 md:py-4 rounded-2xl transition-all shadow-lg shadow-green-200 disabled:opacity-60 flex items-center justify-center gap-2 mt-1"
          >
            {loading
              ? <><span className="animate-spin text-xl">⭐</span><span>Memeriksa...</span></>
              : <><span className="text-xl">🚀</span><span>Lihat Laporanku!</span></>
            }
          </button>
        </form>
      </div>

      <p className="text-gray-300 text-xs font-semibold mt-6 md:mt-8 text-center">
        Lupa ID atau tanggal lahir? Tanyakan ke ustadz/ustadzah 😊
      </p>

      <style>{`
        @keyframes shake {
          0%,100%{transform:translateX(0)}
          20%{transform:translateX(-8px)}
          40%{transform:translateX(8px)}
          60%{transform:translateX(-6px)}
          80%{transform:translateX(6px)}
        }
      `}</style>
    </div>
  );
}
