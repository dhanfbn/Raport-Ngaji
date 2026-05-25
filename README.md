# 📘 Ngaji Sore Dashboard — Setup Guide
> Next.js 15 + TypeScript + Tailwind + Google Sheets API → Deploy ke Vercel

<img width="219" height="364" alt="image" src="https://github.com/user-attachments/assets/72148ecc-66bb-43c8-8383-60d93adc998d" /> <img width="166" height="364" alt="image" src="https://github.com/user-attachments/assets/6b98efd4-8d8a-4723-aa20-4b9af2e7ce84" /> <img width="486" height="364" alt="image" src="https://github.com/user-attachments/assets/960620e5-a202-490d-9399-c56ebab1bc6d" />



---

## LANGKAH 1 — Siapkan Google Sheet

### 1a. Buat spreadsheet baru
1. Buka [sheets.google.com](https://sheets.google.com) → **Blank spreadsheet**
2. Rename file → `Ngaji Sore Database`

### 1b. Buat 9 tab sheet (klik `+` di bawah)
Nama tab harus **persis sama** (case-sensitive):

| Tab | Kolom header (baris 1) |
|-----|------------------------|
| `students` | student_id, full_name, gender, birth_date, class_id, parent_name, parent_phone, photo_url, status, created_at |
| `classes` | class_id, class_name, teacher_id, schedule_day, created_at |
| `teachers` | teacher_id, teacher_name, phone, photo_url, status |
| `attendance` | attendance_id, student_id, class_id, attendance_date, status, note, created_by |
| `tilawah_progress` | tilawah_id, student_id, surah_name, ayat_from, ayat_to, fluency_score, tajwid_score, session_date, teacher_note, created_by |
| `memorization_progress` | memorization_id, student_id, surah_name, target_type, progress_percent, status, start_date, target_date, teacher_note |
| `behavior_reports` | behavior_id, student_id, discipline_score, attitude_score, cleanliness_score, note, report_date, created_by |
| `teacher_notes` | note_id, student_id, teacher_id, note, category, note_date |
| `report_periods` | period_id, period_name, start_date, end_date, status |

### 1c. Isi data dari file Excel
Copy-paste data dari `Ngaji_Database.xlsx` ke masing-masing tab.

Format penting:
- Kolom tanggal: format **YYYY-MM-DD** (bukan DD/MM/YYYY)
- Kolom `status` di `attendance`: **Hadir / Sakit / Izin / Alpha** (huruf kapital pertama)
- Kolom `status` di `memorization_progress`: **Ongoing / Complete**
- Kolom `status` di `report_periods`: **active** (huruf kecil)
- Kolom `status` di `students`: **Active**

### 1d. Share spreadsheet
1. Klik **Share** (pojok kanan atas)
2. Ubah ke **"Anyone with the link"** → **Viewer**
3. Klik **Done**

### 1e. Catat Spreadsheet ID
Dari URL browser:
```
https://docs.google.com/spreadsheets/d/  1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms  /edit
                                           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                                           ini adalah SPREADSHEET_ID kamu
```

---

## LANGKAH 2 — Aktifkan Google Sheets API & Buat API Key

### 2a. Buka Google Cloud Console
→ [console.cloud.google.com](https://console.cloud.google.com)

### 2b. Buat atau pilih project
- Klik dropdown project di atas → **New Project** → isi nama → **Create**

### 2c. Enable Google Sheets API
1. Kiri sidebar → **APIs & Services** → **Library**
2. Search: `Google Sheets API`
3. Klik → **Enable**

### 2d. Buat API Key
1. Kiri sidebar → **APIs & Services** → **Credentials**
2. Klik **+ Create Credentials** → **API Key**
3. Key langsung muncul → **Copy**

### 2e. Restrict API Key (opsional tapi recommended)
1. Klik nama key yang baru dibuat → **Edit API key**
2. Di **API restrictions** → **Restrict key** → pilih **Google Sheets API**
3. **Save**

---

## LANGKAH 3 — Setup Project Lokal

### 3a. Clone / copy project
```bash
# Kalau dari GitHub
git clone https://github.com/username/ngaji-sore.git
cd ngaji-sore

# Atau langsung masuk ke folder project yang sudah ada
cd C:\FBNN\ReactJS\ngaji-sore
```

### 3b. Install dependencies
```bash
npm install
```

### 3c. Buat file environment
```bash
# Windows
copy .env.example .env.local

# Mac/Linux
cp .env.example .env.local
```

Edit `.env.local` dengan editor/VS Code:
```env
GOOGLE_SHEETS_API_KEY=AIzaSy...key_kamu_disini
SPREADSHEET_ID=1BxiMV...id_spreadsheet_kamu
```

> ⚠️ `.env.local` sudah ada di `.gitignore` → tidak akan ke-push ke GitHub.

### 3d. Jalankan development server
```bash
npm run dev
```

Buka browser → [http://localhost:3000](http://localhost:3000)

---

## LANGKAH 4 — Deploy ke Vercel

### 4a. Push project ke GitHub
```bash
git init
git add .
git commit -m "feat: initial ngaji sore dashboard"
git remote add origin https://github.com/username/ngaji-sore.git
git push -u origin main
```

### 4b. Import ke Vercel
1. Buka [vercel.com](https://vercel.com) → **Add New Project**
2. **Import Git Repository** → pilih repo `ngaji-sore`
3. Framework: **Next.js** (auto-detected)
4. Jangan klik Deploy dulu!

### 4c. Tambahkan Environment Variables di Vercel
Sebelum deploy, scroll ke bagian **Environment Variables**:

| Name | Value |
|------|-------|
| `GOOGLE_SHEETS_API_KEY` | `AIzaSy...key_kamu` |
| `SPREADSHEET_ID` | `1BxiMV...id_kamu` |

Centang semua environment: **Production, Preview, Development**

### 4d. Deploy
Klik **Deploy** → tunggu ~2 menit → ✅ Live!

---

## LANGKAH 5 — Tambah Data Baru

Data baru langsung aktif setelah 60 detik (ISR revalidate).  
Atau klik tombol **🔄 Refresh** di dashboard untuk update manual.

Cara tambah santri baru:
1. Buka Google Sheet → tab `students`
2. Tambah baris baru dengan student_id unik (misal: `STD0006`)
3. Pastikan class_id merujuk ke class yang ada di tab `classes`

---

## Struktur Project

```
ngaji-sore/
├── .env.example              ← template env vars
├── .env.local                ← local env (gitignored)
├── .gitignore
├── next.config.ts
├── package.json
├── tsconfig.json
└── src/
    ├── types/
    │   └── index.ts          ← semua TypeScript types
    ├── lib/
    │   ├── sheets.ts         ← Google Sheets fetcher (server-only)
    │   └── compute.ts        ← kalkulasi metrik dashboard
    ├── app/
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── page.tsx          ← halaman utama (student selector + loader)
    │   └── api/
    │       └── dashboard/
    │           └── route.ts  ← API endpoint (key tetap server-side)
    └── components/
        ├── Dashboard.tsx     ← layout utama dashboard
        ├── StatCard.tsx      ← kartu stat (kehadiran, tilawah, dll)
        ├── WeeklyChart.tsx   ← grafik garis 4 minggu
        ├── HafalanPanel.tsx  ← panel hafalan + target
        └── CatatanGuru.tsx   ← catatan guru
```

---

## Troubleshooting

| Error | Solusi |
|-------|--------|
| `Missing GOOGLE_SHEETS_API_KEY` | Cek `.env.local` sudah ada dan terisi |
| `Google Sheets API error 403` | Sheet belum di-share ke "anyone with link" |
| `Google Sheets API error 400` | Nama tab sheet salah (cek case-sensitive) |
| `Student not found` | student_id tidak ada di tab `students` |
| Data tidak update | Tunggu 60 detik atau klik tombol Refresh |

---

## Extend / Kustomisasi

- **Tambah periode baru**: tambah baris di tab `report_periods`, set `status = active`
- **Tambah kategori catatan**: edit `CATEGORY_STYLE` di `CatatanGuru.tsx`
- **Ubah interval cache**: edit `revalidate: 60` di `src/lib/sheets.ts`
- **Tambah metrik baru**: edit `computeDashboard()` di `src/lib/compute.ts`
