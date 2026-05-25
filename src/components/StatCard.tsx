"use client";

type Color = "green" | "blue" | "purple" | "yellow";

interface Props {
  label: string;
  value: number;
  sub: string;
  badge: { label: string; emoji: string };
  color: Color;
  icon: string;
}

const COLORS: Record<Color, { card: string; iconBg: string; iconBorder: string; val: string; badge: string; sub: string }> = {
  green:  { card: "border-green-100",  iconBg: "bg-green-100",  iconBorder: "border-green-200",  val: "text-green-500",  badge: "bg-green-100 text-green-800",  sub: "text-green-400" },
  blue:   { card: "border-blue-100",   iconBg: "bg-blue-100",   iconBorder: "border-blue-200",   val: "text-blue-500",   badge: "bg-blue-100 text-blue-800",   sub: "text-blue-400" },
  purple: { card: "border-purple-100", iconBg: "bg-purple-100", iconBorder: "border-purple-200", val: "text-purple-500", badge: "bg-purple-100 text-purple-800", sub: "text-purple-400" },
  yellow: { card: "border-yellow-100", iconBg: "bg-yellow-100", iconBorder: "border-yellow-200", val: "text-yellow-500", badge: "bg-yellow-100 text-yellow-800", sub: "text-yellow-500" },
};

export default function StatCard({ label, value, sub, badge, color, icon }: Props) {
  const c = COLORS[color];
  return (
    <div className={`bg-white ${c.card} rounded-2xl md:rounded-3xl p-4 md:p-5 border-2 shadow-sm flex flex-col gap-2 md:gap-3`}>

      {/* Icon + label */}
      <div className="flex items-center gap-2 md:gap-3">
        <div className={`w-10 h-10 md:w-14 md:h-14 ${c.iconBg} border-2 ${c.iconBorder} rounded-xl md:rounded-2xl flex items-center justify-center text-xl md:text-3xl shrink-0`}>
          {icon}
        </div>
        <span className="font-black text-gray-700 text-xs md:text-sm leading-tight">{label}</span>
      </div>

      {/* Big % */}
      <p className={`font-black ${c.val} leading-none tracking-tight text-4xl md:text-6xl`}>
        {value}<span className="text-xl md:text-3xl">%</span>
      </p>

      <p className={`font-bold text-[10px] md:text-xs ${c.sub} leading-snug`}>{sub}</p>

      <span className={`self-start text-[10px] md:text-xs font-black px-3 md:px-4 py-1 md:py-1.5 rounded-full ${c.badge}`}>
        {badge.label} {badge.emoji}
      </span>
    </div>
  );
}
