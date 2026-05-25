"use client";

interface Props {
  currentSurah: string;
  currentProgress: number;
  currentNote: string;
  nextSurah: string | null;
}

export default function HafalanPanel({ currentSurah, currentProgress, currentNote, nextSurah }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-3">

      {/* ── Hafalan Saat Ini ── */}
      <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-5 border-2 border-purple-100 shadow-sm flex flex-col gap-3 md:gap-4">

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 md:w-9 md:h-9 bg-purple-100 border-2 border-purple-200 rounded-xl flex items-center justify-center text-lg md:text-xl">📍</div>
          <h2 className="font-black text-gray-700 text-xs md:text-sm">Hafalan Saat Ini</h2>
        </div>

        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-black text-gray-800 text-lg md:text-xl leading-tight">{currentSurah}</p>
            <p className="text-purple-400 font-bold text-xs mt-1">Target: Hafal</p>
            {currentNote && <p className="text-gray-400 text-xs mt-1 italic leading-snug">{currentNote}</p>}
          </div>
          <div className="w-12 h-12 md:w-14 md:h-14 bg-purple-100 border-2 border-purple-200 rounded-xl md:rounded-2xl flex items-center justify-center text-2xl md:text-3xl shrink-0">🏅</div>
        </div>

        <div>
          <div className="w-full bg-purple-100 rounded-full h-3 md:h-4 overflow-hidden">
            <div className="h-full rounded-full bg-purple-500 transition-all duration-700" style={{ width: `${currentProgress}%` }} />
          </div>
          <p className="text-right text-xs md:text-sm text-purple-500 font-black mt-1.5">{currentProgress}%</p>
        </div>
      </div>

      {/* ── Target Selanjutnya ── */}
      {nextSurah && (
        <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-5 border-2 border-green-100 shadow-sm flex flex-col gap-3 md:gap-4">

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 md:w-9 md:h-9 bg-green-100 border-2 border-green-200 rounded-xl flex items-center justify-center text-lg md:text-xl">🎯</div>
            <h2 className="font-black text-gray-700 text-xs md:text-sm">Target Selanjutnya</h2>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-amber-50 border-2 border-amber-200 rounded-xl md:rounded-2xl flex items-center justify-center text-3xl md:text-4xl shrink-0">📕</div>
            <div>
              <p className="font-black text-gray-800 text-lg md:text-xl leading-tight">{nextSurah}</p>
              <p className="text-green-400 font-bold text-xs mt-1">Target: Hafal</p>
              <span className="inline-block mt-2 text-xs font-black bg-green-100 text-green-800 px-3 md:px-4 py-1 md:py-1.5 rounded-full">Semangat! 💪</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
