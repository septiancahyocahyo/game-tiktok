# Product Requirements Document (PRD) & Game Design Document (GDD)

| Metadata Dokumen | Detail |
| :--- | :--- |
| **Nama Proyek (Working Title)** | Demo Raya: Oposisi vs Pemerintah |
| **Platform Target** | TikTok Live (Orientasi Vertikal 9:16 - Resolusi 1080x1920 px) |
| **Genre / Mekanik Utama** | Interactive Auto-Running 1D Horizontal Tug-of-War (Kiri vs Kanan) |
| **Versi Dokumen** | v2.0 (Pivot ke Desain Kiri vs Kanan, Barisan Perisai, Tokoh VIP, & Layar Animasi Atas) |
| **Status** | Living Document (Aktif & Siap Direvisi) |

---

## 1. Ringkasan Eksekutif & Tujuan Produk

Game interaktif otomatis (*auto-running*) berbasis *Horizontal Tug-of-War* (Kiri vs Kanan) yang dirancang untuk TikTok Live. Di tengah arena, **Barisan Massa Pendemo (Kiri)** berhadapan langsung dan saling dorong melawan **Barisan Polisi Huru-Hara Berperisai Lengkap (Kanan)**. 

Di belakang masing-masing barisan terdapat **Tokoh Penting (VIP)** yang mewakili tiap kubu:
*   **Kubu Oposisi (Kiri - Biru):** Windah Basudara, Pandji Pragiwaksono, dan Ferry Irwandi.
*   **Kubu Pemerintah (Kanan - Merah):** Prabowo, Mayor Teddy, dan Bahlil.

Setiap kali penonton mengirim *gift*, layar khusus di bagian atas (**Panggung Animasi Utama**) akan memutar animasi *skill* khas dari tokoh-tokoh tersebut yang memberikan efek dorongan besar ke barisan lawan.

---

## 2. Spesifikasi Tata Letak Layar Baru (UI/UX Viewport 9:16)

Untuk mengatasi sempitnya layar *portrait* (9:16) saat menampilkan permainan Kiri vs Kanan, layar dibagi menjadi **5 Zona Vertikal** yang terstruktur rapi dari atas ke bawah.

### 2.1. Diagram Tata Letak (Wireframe Blueprint v2.0)

```text
+-------------------------------------------------------+
| [1. HEADER & INSTRUKSI KOMENTAR - 8% ATAS]            |
|  🔵 OPOSISI [ 15 ]        vs        [ 12 ] PEMERINTAH 🔴|
|  ---------------------------------------------------  |
|  💬 Ketik "1 [Pesan]"       | 💬 Ketik "2 [Pesan]"    |
|     Dukung Oposisi 🔵        |    Dukung Pemerintah 🔴 |
+-------------------------------------------------------+
| [2. PANGGUNG ANIMASI UTAMA (SKILL STAGE) - 22% ATAS]  |
|  +-------------------------------------------------+  |
|  |         🎬 LAYAR CUTSCENE & ANIMASI SKILL       |  |
|  |   (Menampilkan animasi besar saat Gift masuk:   |  |
|  |    Misal: Windah panggil Bocil / Mayor Teddy    |  |
|  |    maju / Prabowo joget / Pandji stand-up)      |  |
|  +-------------------------------------------------+  |
+-------------------------------------------------------+
| [3. PITA RUNNING TEXT KOMENTAR - 10% TENGAH-ATAS]     |
|  >> [Running Text Biru (1): "1 Kawal terus!!"]     >> |
|  ======= ⬅️ OPOSISI 48% |⚡| 52% PEMERINTAH ➡️ ======= |
|  << [Running Text Merah (2): "2 Gas lanjutkan!!"]  << |
+-------------------------------------------------------+
| [4. ARENA BENTROKAN KIRI VS KANAN - 30% TENGAH]       |
|                                                       |
|  [VIP OPOSISI]     [GARIS DORONG]    [VIP PEMERINTAH] |
|  • Windah         📢🏃‍♂️🏃‍♂️ 💥 🛡️👮‍♂️👮‍♂️        • Prabowo  |
|  • Pandji         📢🏃‍♂️🏃‍♂️ 💥 🛡️👮‍♂️👮‍♂️        • M. Teddy |
|  • Ferry          📢🏃‍♂️🏃‍♂️ 💥 🛡️👮‍♂️👮‍♂️        • Bahlil   |
|  (Toa & Massa)    (Pendemo vs Polisi)   (Podium/Elit) |
|                                                       |
|  |<--- Geser ke Kiri             Geser ke Kanan --->| |
+-------------------------------------------------------+
| [5. ZONA HUD, LEADERBOARD & HOST - 30% BAWAH]         |
| +-------------------------------+ +-----------------+ |
| | [Area Tertutup Komen TikTok]  | |                 | |
| | (Dark Overlay 75%)            | |  [WAJAH HOST]   | |
| | 🌹 Mawar = Dorong +5          | |  (Tanpa BG /    | |
| | 🍩 Donat = Panggil Skill VIP  | |   Pojok Kanan   | |
| | 🏆 MVP: 1. @Sultan_99         | |   Bawah)        | |
| +-------------------------------+ +-----------------+ |
+-------------------------------------------------------+
```

### 2.2. Rincian Komponen per Zona

| Zona Layar | Rasio Tinggi | Elemen Komponen | Fungsi & Catatan Teknis |
| :--- | :--- | :--- | :--- |
| **1. Header & Sub-Bar Instruksi** | **8%** | • Skor Ronde (Oposisi Kiri vs Pemerintah Kanan)<br>• Sub-bar instruksi cara ikut komen (`1` dan `2`). | Selalu terlihat di bagian paling atas agar penonton baru langsung paham cara bermain dalam 3 detik. |
| **2. Panggung Animasi Utama (Skill Stage)** | **22%** | • Layar khusus *cutscene* / *highlight* animasi.<br>• Menampilkan foto profil & nama pengirim *Gift* beserta animasi karakter VIP yang sedang beraksi. | Memecahkan masalah karakter kecil di arena bawah. Saat skill aktif, karakter VIP tampil **besar dan jelas** di layar atas ini. |
| **3. Pita 3 Running Text** | **10%** | • **Baris 1 (Biru):** Komentar kubu Oposisi (`1 [pesan]`)<br>• **Baris 2 (Tengah):** Barometer persentase dorongan (`48% vs 52%`)<br>• **Baris 3 (Merah):** Komentar kubu Pemerintah (`2 [pesan]`) | Dibuat memanjang penuh dari kiri ke kanan di atas arena agar teks komentar tetap panjang dan mudah dibaca di layar HP. |
| **4. Arena Bentrokan Utama (Kiri vs Kanan)** | **30%** | • **Kiri:** Tokoh VIP Oposisi + Barisan Pendemo.<br>• **Tengah:** Titik bentrokan fisik Pendemo vs Perisai Polisi.<br>• **Kanan:** Barisan Polisi Huru-Hara + Tokoh VIP Pemerintah. | Menggunakan sistem *Dynamic Sliding Camera* (kamera sedikit menggeser/zoom mengikuti titik bentrokan) agar karakter tidak terlihat terlalu kerdil. |
| **5. HUD, Leaderboard & Host** | **30%** | • **Kiri Bawah (60% lebar):** *Leaderboard* Top Gifter & Daftar Harga Skill Gift.<br>• **Kanan Bawah (40% lebar):** Kamera wajah *streamer*. | Sisi kiri bawah diberi latar gelap agar tulisan komentar bawaan TikTok tidak bertabrakan dengan informasi *Leaderboard*. |

---

## 3. Mekanik Inti Permainan (Horizontal Tug-of-War)

Permainan menggunakan nilai posisi horizontal (**Nilai Garis Bentrokan: `0` di ujung kiri hingga `100` di ujung kanan**).

*   **Nilai Awal (Start State):** `50` (Pendemo dan Polisi beradu tepat di garis tengah layar).
*   **Arah Dorongan:**
    *   **Kubu Oposisi (Kiri - Biru):** Mendorong barisan polisi ke arah **KANAN** (menuju nilai `100`).
    *   **Kubu Pemerintah (Kanan - Merah):** Mendorong barisan pendemo ke arah **KIRI** (menuju nilai `0`).
*   **Visualisasi Barisan Depan (Frontline):**
    *   **Sisi Kiri:** Kerumunan massa demonstran membawa spanduk, bendera, dan toa.
    *   **Sisi Kanan:** Barisan polisi huru-hara dengan seragam lengkap, helm, dan perisai transparan (*riot shield*) yang merapat menahan dorongan.
*   **Trik Visual Layar Sempit (*Viewport Scrolling*):**
    *   Agar karakter tidak perlu digambar terlalu kecil supaya muat semua di layar HP, lebar total arena dibuat **1.5x lipat lebar layar HP**.
    *   Saat posisi seimbang (`50`), kamera fokus ke bentrokan Pendemo vs Polisi di tengah.
    *   Saat Oposisi mendesak ke kanan (`> 70`), kamera bergeser ke kanan memperlihatkan barisan VIP Pemerintah (Prabowo, Mayor Teddy, Bahlil) yang mulai panik terdesak. Begitu pula sebaliknya.

---

## 4. Daftar Tokoh VIP Awal & Konsep Animasi di Layar Atas

Tokoh VIP berdiri di belakang barisan masing-masing. Saat penonton mengirim *Gift* tertentu, tokoh VIP akan muncul secara dramatis di **Zona 2 (Panggung Animasi Utama)** di bagian atas layar.

### 4.1. Kubu Oposisi (Sisi Kiri - Biru)

| Nama Tokoh | Peran Visual di Arena | Konsep Animasi Utama (Muncul di Layar Atas saat Gift) | Efek ke Barisan |
| :--- | :--- | :--- | :--- |
| **Windah Basudara** | Memegang mic/headset di atas mobil komando belakang pendemo. | **"Panggilan Bocil Kematian / Absen Dulu":** Animasi Windah berteriak heboh memanggil ribuan *bocil* yang berlari menyerbu dari kiri ke kanan. | Menambah jumlah massa pendemo & memberikan dorongan cepat ke kanan. |
| **Pandji Pragiwaksono** | Berdiri memegang mikrofon *stand-up comedy*. | **"Roasting Pedas / Mens Rea":** Animasi Pandji melakukan *stand-up* dengan gelombang tawa dan fakta tajam yang membuat barisan polisi kebingungan. | Melemahkan pertahanan perisai polisi selama beberapa detik (*Debuff*). |
| **Ferry Irwandi** | Berdiri tenang dengan kacamata/kopi dan papan tulis logika. | **"Bedah Logika & Fakta":** Animasi Ferry menjabarkan data dan argumen beruntun yang menembus barikade lawan. | Memberikan dorongan stabil secara terus-menerus (*Damage over Time*) ke arah kanan. |

### 4.2. Kubu Pemerintah (Sisi Kanan - Merah)

| Nama Tokoh | Peran Visual di Arena | Konsep Animasi Utama (Muncul di Layar Atas saat Gift) | Efek ke Barisan |
| :--- | :--- | :--- | :--- |
| **Prabowo** | Berdiri di atas podium negara dengan gaya khasnya. | **"Joget Gemoy / Pidato Berapi-api":** Animasi Prabowo berjoget santai atau berorasi di podium yang memicu hujan paket bantuan/semangat ke barisan kanan. | Dorongan raksasa (*Ultimate Push*) yang menghempaskan pendemo mundur jauh ke kiri. |
| **Mayor Teddy** | Berdiri sigap dengan seragam/baret merah di samping podium. | **"Ajudan Sigap / Barikade Ketat":** Animasi Mayor Teddy memberi komando tegas dan menatap tajam ke arah kamera. | Memperkuat perisai barisan polisi (kebal dorongan *tap-tap* selama beberapa detik) & mendorong balik. |
| **Bahlil** | Berdiri di belakang podium membawa map kebijakan/kursi. | **"Manuver Kebijakan / Gas Melon":** Animasi satir Bahlil mengeluarkan kebijakan mendadak atau melempar rintangan birokrasi ke arah pendemo. | Memperlambat gerakan pendemo dan memberi dorongan menengah ke arah kiri. |

---

## 5. Sistem Interaksi Penonton & Running Text

| Sumber Event | Aturan Input / Trigger | Efek di Dalam Game |
| :--- | :--- | :--- |
| **Komentar Oposisi** | Mengetik `1 [Pesan]` (Contoh: `"1 Maju terus bang Windah!"`) | • User masuk ke **Kubu Oposisi (Kiri)**.<br>• Komentar muncul berjalan di **Pita Running Text Biru (Baris 1)**.<br>• Pendemo mendorong ke kanan (**+0.5 poin**). |
| **Komentar Pemerintah** | Mengetik `2 [Pesan]` (Contoh: `"2 Pertahankan barisan!"`) | • User masuk ke **Kubu Pemerintah (Kanan)**.<br>• Komentar muncul berjalan di **Pita Running Text Merah (Baris 3)**.<br>• Polisi mendorong ke kiri (**-0.5 poin**). |
| **Tap-Tap Layar (Like)** | Penonton melakukan *tap-tap* di layar HP. | • Memberikan tenaga dorongan tambahan sesuai kubu penonton (**±0.2 poin per like**).<br>• Memunculkan ikon kecil foto profil penonton di atas kepala pendemo/polisi yang sedang mendorong. |
| **Pengiriman Gift** | Penonton mengirim Gift TikTok. | • Memutar *Cutscene* di **Zona 2 (Panggung Animasi Atas)** sesuai tokoh dan nilai gift.<br>• Memberikan dorongan besar secara instan.<br>• Nama pengirim masuk ke **Leaderboard MVP** di kiri bawah. |

---

## 6. Rencana Cadangan (Plan B - Hook Interaksi Gratis)

Jika penonton belum mengirim *Gift*, game tetap hidup dan seru melalui fitur otomatis berikut:
1.  **Event "Jam Rawan Demo" (Otomatis tiap 3 menit):** Sirine berbunyi, dan selama 20 detik kekuatan komentar (`1` / `2`) serta *tap-tap* layar dilipatgandakan 5x lipat.
2.  **Preview Skill Gratis via Target Komentar:** Jika satu kubu berhasil mengumpulkan **50 komentar berturut-turut**, salah satu tokoh VIP (misal Windah atau Mayor Teddy) akan otomatis mengeluarkan *skill* versi ringan di **Panggung Animasi Atas** secara gratis. Ini memberi contoh ke penonton betapa serunya animasi di layar atas sehingga mereka tergerak mengirim *gift* untuk memanggil animasi yang lebih besar.

---

## 7. Daftar Backlog Selanjutnya

*   [x] **Pembuatan Prototipe Visual Awal (HTML5/React Canvas/Vite):** Membangun kerangka layar 9:16 sesuai *wireframe* dengan Vite + React + TypeScript + Tailwind + Framer Motion + Zustand beserta Control Panel Simulator. *(Selesai - lihat PROGRESS.md)*
*   [x] **Pemetaan Katalog Gift Spesifik (Draft Awal):** Menentukan pemetaan 6 gift awal ke 6 VIP (Headset->Windah, Mic->Pandji, Kopi->Ferry, Donat->Prabowo, Baret->Teddy, Melon->Bahlil) dan Mawar (+5). *(Tersedia di src/data.ts)*
*   [ ] **Revisi & Finalisasi Layout v2.0:** Menyesuaikan ukuran tiap zona dan aset visual berdasarkan masukan user/streamer.
*   [ ] **Asset Grafis & Audio Asli:** Mengganti placeholder emoji dengan sprite ilustrasi dan sound effects (SFX).
*   [ ] **Integrasi TikTok Live Connector:** Menghubungkan WebSocket live chat/gift/like nyata dari TikTok.