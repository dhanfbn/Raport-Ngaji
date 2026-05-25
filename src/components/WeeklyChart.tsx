"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { WeeklyPoint } from "@/types";

interface Props { data: WeeklyPoint[] }

const LINES = [
  { key: "Kehadiran",    color: "#22c55e" },
  { key: "Tilawah",      color: "#3b82f6" },
  { key: "Hafalan",      color: "#a855f7" },
  { key: "Adab & Sikap", color: "#eab308" },
] as const;

export default function WeeklyChart({ data }: Props) {
  return (
    <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 border-2 border-gray-100 shadow-sm h-full">

      <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-5">
        <div className="w-9 h-9 md:w-10 md:h-10 bg-green-100 border-2 border-green-200 rounded-xl flex items-center justify-center text-xl md:text-2xl">
          📈
        </div>
        <h2 className="font-black text-gray-800 text-sm md:text-base">
          Perkembangan 4 Minggu Terakhir
        </h2>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10, fill: "#9ca3af", fontFamily: "Nunito, sans-serif", fontWeight: 700 }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            domain={[0, 100]} ticks={[0, 25, 50, 75, 100]}
            tick={{ fontSize: 10, fill: "#9ca3af", fontFamily: "Nunito, sans-serif", fontWeight: 700 }}
            axisLine={false} tickLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "14px", border: "2px solid #f0fdf4",
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
              fontSize: "12px", fontFamily: "Nunito, sans-serif", fontWeight: 700,
            }}
            formatter={(val: number) => [`${val}%`]}
          />
          <Legend
            iconType="circle" iconSize={8}
            wrapperStyle={{ fontSize: "11px", fontFamily: "Nunito, sans-serif", fontWeight: 800, paddingTop: "12px" }}
          />
          {LINES.map(({ key, color }) => (
            <Line
              key={key} type="monotone" dataKey={key}
              stroke={color} strokeWidth={2.5}
              dot={{ r: 4, fill: color, strokeWidth: 0 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
