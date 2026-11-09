# Status & Handover Progress Proyek: Demo Raya (Oposisi vs Pemerintah)

> **Catatan untuk AI Agent / Developer Selanjutnya:**  
> Dokumen ini mencatat arsitektur, fitur yang telah diimplementasikan, struktur file, dan backlog untuk kelanjutan pengembangan game interaktif TikTok Live ini.

---

## 1. Ringkasan Proyek & Tech Stack
Game interaktif vertikal 9:16 untuk TikTok Live berbasis *1D Horizontal Tug-of-War* (Oposisi 🔵 vs Pemerintah 🔴) dengan 5 zona vertikal dan Control Panel Simulator di samping layar.

- **Framework & Bundler:** React 18 + TypeScript + Vite 5
- **Styling:** Tailwind CSS (v3) + PostCSS + Autoprefixer
- **Animasi:** Framer Motion (v11) untuk animasi panggung cutscene VIP, bentrokan massa, partikel, & floating avatar tap
- **State Management:** Zustand (v4) untuk seluruh game loop (100ms tick), antrean skill cutscene, event rush, streak gratis, dan kalkulasi garis bentrok

---

## 2. Status Implementasi Fitur Saat Ini (Fase 1 - SELESAI ✅)

### A. Viewport 9:16 & Responsiveness (`src/App.tsx`)
- Container resolusi basis **540 × 960 px** (skala otomatis menjaga rasio 9:16 mengikuti tinggi/lebar jendela browser).
- Sidebar kanan **400px** untuk Simulator Panel.
- Banner kemenangan dinamis saat garis bentrokan menyentuh 0 (Pemerintah menang) atau 100 (Oposisi menang), skor ronde bertambah, lalu garis reset ke titik tengah 50.

### B. Implementasi 5 Zona Vertikal PRD
1. **Zona 1: Header & Instruksi (8%) - `src/components/Header.tsx`**
   - Skor ronde live Oposisi 🔵 vs Pemerintah 🔴.
   - Kotak instruksi cepat penonton: `Ketik "1 [Pesan]"` vs `Ketik "2 [Pesan]"`.
2. **Zona 2: Panggung Animasi Utama / Skill Stage (22%) - `src/components/SkillStage.tsx`**
   - State *Idle*: Menampilkan 6 tokoh VIP bergerak halus (floating) mengajak penonton kirim gift.
   - State *Playing*: Cutscene dramatis saat gift/skill dipicu. Avatar VIP berukuran besar (120px) muncul dengan animasi spring, badge pengirim `@username`, nama skill, dan partikel animasi unik per VIP:
     - **Windah:** Ribuan bocil kematian berlari dari kiri ke kanan (`runRight`).
     - **Pandji:** Tawa, mikrofon, roasting naik dari bawah (`rise`).
     - **Ferry:** Data, statistik, grafik popping (`pop`).
     - **Prabowo:** Paket bantuan, tarian gemoy hujan dari atas (`rain`).
     - **Mayor Teddy:** Tameng pelindung baret merah (`pop`).
     - **Bahlil:** Gas melon dan map kebijakan terbang ke kiri (`flyLeft`).
   - Dilengkapi sistem antrean (*queue*) jika beberapa gift masuk bersamaan.
3. **Zona 3: 3 Running Text Komentar (10%) - `src/components/RunningText.tsx`**
   - Baris 1: Marquee biru komentar Oposisi (`1 ...`).
   - Baris 2: Barometer dinamis persentase dorongan (`X% OPOSISI |⚡| Y% PEMERINTAH`).
   - Baris 3: Marquee merah komentar Pemerintah (`2 ...`) reverse direction.
4. **Zona 4: Arena Bentrokan Kiri vs Kanan (30%) - `src/components/Arena.tsx`**
   - Lebar dunia arena dibuat **150%** dari lebar layar dengan *Dynamic Sliding Camera* yang bergeser mengikuti garis dorongan.
   - 6 Tokoh VIP berdiri di barisan belakang (Windah, Pandji, Ferry di kiri; Prabowo, Teddy, Bahlil di kanan). VIP panik/gemetar ketika barisan kubunya terdesak (>70% atau <30%).
   - Barisan massa pendemo (bendera/toa) beradu fisik dengan barisan polisi huru-hara berperisai (riot shield).
   - Efek visual status: Status Kebal (Shield Teddy), Lemah (Debuff Pandji), Lambat (Slow Bahlil).
   - Animasi floating avatar/like kecil saat penonton melakukan tap-tap layar.
5. **Zona 5: HUD Bawah (30%) - `src/components/Hud.tsx`**
   - Sisi Kiri (60%): Latar gelap anti-tabrakan komentar TikTok, menampilkan katalog ringkas harga gift serta Leaderboard Top 3 MVP Gifter.
   - Sisi Kanan (40%): Frame placeholder kamera host/streamer.

### C. Mekanik Game & Plan B (`src/store.ts`)
- **Garis Bentrokan:** 0 s/d 100 (Default 50).
- **Komentar:** +0.5 (Oposisi) / -0.5 (Pemerintah).
- **Tap-tap (Like):** +0.2 / -0.2 poin per like dengan animasi avatar terapung.
- **Plan B - Jam Rawan Demo:** Mode sirine merah darurat setiap 3 menit (atau via tombol manual), menggandakan kekuatan komen & tap sebesar 5x lipat selama 20 detik.
- **Plan B - Skill Gratis via 50 Komentar Beruntun:** Jika satu kubu mengumpulkan 50 komentar berturut-turut tanpa diselingi lawan, otomatis memicu skill VIP ringan di panggung atas.
- **DoT (Damage over Time) & Status Effects:**
  - Ferry Irwandi memicu dorongan bertahap 1.5 poin/detik selama 10 detik.
  - Mayor Teddy mengaktifkan tameng kebal tap & komen selama 8 detik.
  - Pandji memberikan debuff pertahanan lawan selama 8 detik.
  - Bahlil memperlambat laju pendemo selama 8 detik.

### D. Control Panel Simulator Lengkap (`src/components/SimulatorPanel.tsx`)
- Ganti/Acak username penonton.
- Input komentar custom atau tombol cepat `1` & `2` serta spam ×10.
- Tap layar satuan atau massal (×1, ×10, ×50) serta toggle *Auto tap-spam*.
- Trigger 6 Gift VIP + Gift Mawar (+5 push) + Tombol uji coba "Antre semua 6 skill".
- Trigger Jam Rawan Demo & Fast-forward Streak 50.
- Slider manual posisi garis bentrokan & tombol reset.

---

## 3. Struktur File Proyek

```
c:\xampp\htdocs\game-tiktok\
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── prd.md                    # Dokumen PRD/GDD acuan v2.0
├── PROGRESS.md               # Dokumen ini (Handover guide)
├── .gitignore
├── src/
│   ├── main.tsx              # Entry point React
│   ├── index.css             # Tailwind & custom keyframe animasi (marquee, siren)
│   ├── App.tsx               # Root component: 9:16 viewport + layout wrapper
│   ├── data.ts               # Data tokoh VIP, konfigurasi gift, daftar user dummy
│   ├── store.ts              # Zustand store (game loop, state garis, event, buff)
│   └── components/
│       ├── VipAvatar.tsx     # Komponen reusable avatar VIP (emoji + gradient + glow)
│       ├── Header.tsx        # Zona 1: Skor ronde & instruksi komentar
│       ├── SkillStage.tsx    # Zona 2: Panggung cutscene animasi VIP saat gift
│       ├── RunningText.tsx   # Zona 3: 3 Baris running text & barometer
│       ├── Arena.tsx         # Zona 4: Arena bentrokan geser 150%, massa vs polisi, VIP
│       ├── Hud.tsx           # Zona 5: Leaderboard MVP, harga gift, slot kamera host
│       └── SimulatorPanel.tsx# Sidebar panel simulasi & testing interaksi
```

---

## 4. Cara Menjalankan & Membangun

1. **Jalankan Development Server:**
   ```powershell
   npm run dev
   ```
   Buka browser di URL lokal yang tertera (biasanya `http://localhost:5173`).

2. **Cek Type & Build Production:**
   ```powershell
   npm run build
   ```
   Output build berada di folder `dist/`.

---

## 5. Backlog & Rencana Pengembangan Selanjutnya (Fase 2)

Bagi agen/developer yang melanjutkan:
1. **Asset Grafis & Audio (High Priority):**
   - Mengganti visual placeholder emoji/SVG sederhana dengan asset sprite/karakter 2D ilustrasi asli untuk 6 tokoh VIP (Windah, Pandji, Ferry, Prabowo, Teddy, Bahlil), pendemo, dan polisi huru-hara.
   - Menambahkan efek suara (*SFX*): teriakan orasi, sirine Jam Rawan Demo, benturan tameng polisi `clank`, suara khas tokoh VIP saat cutscene muncul.
2. **Integrasi TikTok Live Connector (Backend / WebSocket):**
   - Mengintegrasikan modul Node.js / library `tiktok-live-connector` (atau WebSocket server bridge) untuk menangkap event real live TikTok: `chat` (1 & 2), `like`, dan `gift`.
   - Menggantikan atau melengkapi `SimulatorPanel` dengan saklar sumber data: *Simulator Mode* vs *Live TikTok Mode*.
3. **Kustomisasi & Penyesuaian Kebutuhan Streamer:**
   - Memungkinkan penggantian slot kamera streamer (Zona 5 kanan) dengan input OBS Browser Source transparan (*chroma key* atau latar transparan).
   - Opsi penyesuaian nilai koin gift dan katalog gift sesuai event TikTok yang sedang aktif.

noa