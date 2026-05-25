"use client";

interface Props {
  notes: { note: string; category: string }[];
  teacherName: string;
  onRefresh: () => void;
}

const CATEGORY_STYLE: Record<string, { bg: string; text: string; emoji: string }> = {
  perkembangan: { bg: "bg-blue-100",   text: "text-blue-800",   emoji: "🌟" },
  tilawah:      { bg: "bg-green-100",  text: "text-green-800",  emoji: "📖" },
  hafalan:      { bg: "bg-purple-100", text: "text-purple-800", emoji: "⭐" },
  adab:         { bg: "bg-yellow-100", text: "text-yellow-800", emoji: "💛" },
};
const DEFAULT_STYLE = { bg: "bg-gray-100", text: "text-gray-700", emoji: "📝" };

export default function CatatanGuru({ notes, teacherName, onRefresh }: Props) {
  return (
    <div className="relative bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 border-2 border-blue-100 shadow-sm overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between mb-4 md:mb-5">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 border-2 border-blue-200 rounded-xl md:rounded-2xl flex items-center justify-center text-2xl md:text-3xl shrink-0">👤</div>
          <div>
            <h2 className="font-black text-gray-800 text-sm md:text-base">Catatan Guru</h2>
            {teacherName && <p className="text-blue-400 font-bold text-xs mt-0.5">{teacherName}</p>}
          </div>
        </div>
        <button
          onClick={onRefresh}
          className="flex items-center gap-1.5 text-xs font-black text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 border-2 border-green-100 px-3 md:px-4 py-1.5 md:py-2 rounded-full transition-all shrink-0"
        >
          🔄 <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Notes */}
      {notes.length === 0 ? (
        <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-4">
          <span className="text-2xl md:text-3xl">🗒️</span>
          <p className="text-gray-400 text-sm font-bold">Belum ada catatan untuk periode ini.</p>
        </div>
      ) : (
        /* Leave space for the 🧕 illustration on desktop, full width on mobile */
        <div className="space-y-3 pr-0 md:pr-24 max-w-2xl">
          {notes.map((n, i) => {
            const style = CATEGORY_STYLE[n.category?.toLowerCase()] ?? DEFAULT_STYLE;
            return (
              <div key={i} className="flex items-start gap-2 md:gap-3">
                <span className="text-xl md:text-2xl mt-0.5 shrink-0">{style.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-700 text-xs md:text-sm font-bold leading-relaxed">{n.note}</p>
                  {n.category && (
                    <span className={`inline-block mt-1.5 text-[10px] md:text-xs font-black px-3 py-1 rounded-full ${style.bg} ${style.text}`}>
                      {n.category}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Decoration — only on md+ to avoid cramping mobile */}
      <span className="hidden md:block absolute bottom-12 right-16 text-yellow-200 text-2xl select-none pointer-events-none">✨</span>
      <div className="hidden md:block absolute bottom-0 right-6 text-7xl leading-none select-none pointer-events-none">🧕</div>
    </div>
  );
}
