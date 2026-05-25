import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Ngaji Sore — Laporan Progres",
  description: "Sistem laporan perkembangan santri Ngaji Sore",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={nunito.variable}>
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  );
}
