# TASKS.md — InvestEdu (`invest-edu`)
> Dibuat: 2026-11-05
> Scope: Perbaikan hasil review menyeluruh — integritas data pasar, keselamatan mesin rekomendasi, keamanan auth, konten edukasi untuk pemula, dan kebersihan proyek.

---

## 📋 Instruksi untuk AI Agent

Kamu adalah AI agent yang mengimplementasikan task di dokumen ini. Baca **seluruh dokumen** (termasuk "Konteks Proyek" dan "Di Luar Scope") sebelum menulis kode.

- Kerjakan dari atas ke bawah. **Selesaikan semua task Fase 1 sebelum Fase 2**, dst., kecuali ada `Dependency` yang menyatakan lain.
- Tandai `[x]` pada acceptance criteria dan Progress Tracker setiap task selesai.
- Jangan mengubah apa pun di luar scope task. Temuan baru → catat di bagian "Catatan Agent" paling bawah, jangan langsung dikerjakan.
- **Jangan mengarang** angka pasar, sumber, regulasi, atau klaim hukum. Jika sebuah fakta tidak bisa diverifikasi dari sumber resmi, tulis `TODO(owner): ...` di kode/konten dan tandai di Progress Tracker agar pemilik proyek memverifikasinya.

### Aturan kerja (wajib)

1. Baca `AGENTS.md` di root repo. Khususnya: Next.js di proyek ini punya perubahan API dari pengetahuan umum, jadi baca `node_modules/next/dist/docs/` sebelum menyentuh API/konvensi Next. Ikuti aturan "Multi Brain" bila folder `.multibrain/` ada di mesin pemilik.
2. Setelah **setiap task**, jalankan berurutan:
   1. `npx tsc --noEmit`
   2. `bun src/lib/recommendation.test.ts`
   3. `bun run lint`
   4. `bun run build` (butuh internet untuk Google Fonts)
3. Satu task = satu commit, pesan konvensional (`fix: ...`, `feat: ...`, `docs: ...`, `chore: ...`).
4. TypeScript strict, tanpa `any`. String UI = Bahasa Indonesia; identifier dan komentar kode = English (mengikuti codebase).
5. Perubahan skema DB hanya **aditif** (tabel/kolom/index baru lewat `SCHEMA_STATEMENTS` di `src/lib/db.ts`). Jangan drop/rename tabel atau kolom yang sudah ada.
6. Boundary yang tidak boleh dilanggar: jangan import `src/app/api/market/route.ts` dari file `"use client"`; `@libsql/client`, `src/lib/db.ts`, `src/lib/auth.ts` tetap server-only.

---

## 🧭 Konteks Proyek

**Tujuan produk**: edukasi investasi untuk orang awam sedini mungkin agar bisa mencapai financial freedom di usia tua. Ide awalnya dari adik pemilik proyek yang ikut berinvestasi, jadi **target utama adalah pemula total**. Tiga fitur inti: (1) modul belajar, (2) rekomendasi alokasi aset berdasarkan profil risiko, (3) dashboard pasar dengan chart TradingView.

**Stack**: Next.js 16 (App Router, Turbopack), React 19, TypeScript strict, Tailwind v4, `lightweight-charts`, Turso/libSQL (`file:investedu.db` lokal), runtime/package manager `bun`.

**Peta file penting**

| Area | File |
|---|---|
| Mesin rekomendasi | `src/lib/recommendation.ts`, `src/lib/recommendation.test.ts`, `src/app/recommendation/page.tsx` |
| Data & API pasar | `src/lib/market-data.ts`, `src/app/api/market/route.ts`, `src/app/market/page.tsx` |
| Chart + alarm harga | `src/components/TradingTerminalModal.tsx` (977 baris; juga berisi `generateOHLCCandles`, `evaluateAlarms`) |
| Auth + user state | `src/lib/auth.ts`, `src/lib/db.ts`, `src/lib/user-state.ts`, `src/lib/user-sync.ts`, `src/app/api/auth/route.ts`, `src/app/api/user-state/route.ts` |
| Konten edukasi | `src/data/education.ts` (18 modul), `src/app/education/page.tsx` |
| Layout/PWA | `src/app/layout.tsx`, `public/sw.js`, `src/app/manifest.ts`, `next.config.ts` |

**Hasil verifikasi saat review**: `tsc --noEmit` bersih, ESLint bersih, `npm audit` (prod) 0 kerentanan. `recommendation.test.ts` belum dijalankan oleh reviewer (butuh `bun`). Fondasi yang sudah baik dan **jangan dirusak**: hash password scrypt + salt + `timingSafeEqual`, SQL berparameter, cookie `httpOnly`/`secure`/`sameSite`, `sanitizeUserState`, validasi panjang input, simulator bunga majemuk di halaman utama, kuis dan red flags per modul.

**Temuan utama yang melatarbelakangi task** (ringkas):

1. Chart "Candle" dan "Garis" di `TradingTerminalModal` dibuat dari **data sintetis** (sparkline 7 titik + gelombang sinus, timestamp tetap), tapi tampil seperti data pasar.
2. Mayoritas data pasar (IHSG, BBCA, BBRI, S&P 500, RDPU, SBN, seluruh indikator makro) adalah **konstanta hardcoded**; hanya BTC/ETH/emas yang live (CoinGecko). Badge "Live Public API" bisa muncul walau separuh data statis.
3. `supportLevel`/`resistanceLevel` dihitung sebagai harga × 0,94 / × 1,06 — **bukan** support/resistance sungguhan.
4. Skor risiko dijumlah tanpa pagar pengaman: jawaban dana darurat = 1 poin tetap bisa menghasilkan total 13 → **Agresif** (55% saham, 15% kripto).
5. Rate limit login bisa dilewati (kunci `ip:email`, IP dari `x-forwarded-for`, Map in-memory); `ensureSchema()` menyimpan promise yang gagal selamanya.

---

# 🔴 FASE 1 — Critical Fixes
> Integritas data dan keselamatan pengguna pemula. Selesaikan semua sebelum Fase 2.

### Task 1.1 — Pagar pengaman klasifikasi risiko (dana darurat & horizon)
**Tujuan**: Mencegah pengguna tanpa dana darurat atau berhorizon sangat pendek mendapat alokasi Agresif/kripto. Ini kasus yang paling berbahaya bagi target pengguna (pemula).
**File yang terdampak**: `src/lib/recommendation.ts`, `src/lib/recommendation.test.ts`, `src/app/recommendation/page.tsx`
**Langkah implementasi**:
1. Periksa tipe `answers` di `recommendation/page.tsx` (kemungkinan `Record<questionId, points>`; id pertanyaan: `horizon`, `drawdown`, `emergency_fund`, `income`, `experience`, poin 1–3).
2. Di `recommendation.ts` tambahkan `classifyRiskProfile(answers)` yang memisahkan **kemampuan** dari **kemauan** dan mengambil yang lebih rendah:
   ```ts
   const capacity  = Math.min(a.horizon, a.emergency_fund, a.income); // 1..3
   const tolerance = Math.round((a.drawdown + a.experience) / 2);     // 1..3
   const level = Math.min(capacity, tolerance);
   // 1 → Konservatif, 2 → Moderat, 3 → Agresif
   ```
3. Tambahkan **aturan keras** setelah alokasi dihitung:
   - `emergency_fund === 1` → profil maksimal Konservatif, `kripto = 0` (apa pun rezim makronya, termasuk `ekspansi`), dan item **pertama** di `tacticalActions` adalah: bangun dana darurat 3–6× pengeluaran bulanan sebelum menambah aset berisiko.
   - `horizon === 1` (< 2 tahun) → `kripto = 0`, `saham` maksimal 10%; kelebihan dipindah ke `reksaDanaPasarUangObligasi`.
4. Ubah `generateRecommendation(totalScore, macroId, answers?)` dengan parameter ketiga **opsional** agar signature lama tetap valid. Bila `answers` ada → pakai logika baru; bila tidak → perilaku lama. Pertahankan `classifyRiskScore` (tandai `@deprecated`).
5. Tambahkan field `reasons: string[]` pada `PortfolioRecommendation` yang menjelaskan jawaban mana yang membatasi/menentukan profil (dipakai Task 3.3).
6. `recommendation/page.tsx`: teruskan `answers` ke `generateRecommendation`; tampilkan pesan peringatan bila aturan keras aktif.
7. Tambahkan test di `recommendation.test.ts` (`node:assert/strict`).
**Acceptance criteria**:
- [x] Jawaban horizon=3, drawdown=3, emergency_fund=1, income=3, experience=3 → profil **Konservatif**, `kripto === 0`, aksi pertama = dana darurat.
- [x] Untuk semua kombinasi 3 profil × 4 rezim makro × (emergency_fund ∈ {1,2,3}) total alokasi tepat 100 dan tidak ada nilai negatif.
- [x] `emergency_fund === 1` → `kripto === 0` di semua rezim makro.
- [x] `horizon === 1` → `saham <= 10` dan `kripto === 0`.
- [x] Test lama yang valid tetap lulus (atau diperbarui dengan alasan jelas di commit message).
**Catatan**: Perilaku ini sengaja membuat lebih banyak pengguna berprofil Konservatif — itu benar untuk target pemula. Jangan melonggarkan aturan demi "tampilan lebih menarik".

### Task 1.2 — Beri label jujur pada chart sintetis, jadikan data asli sebagai default
**Tujuan**: `generateOHLCCandles()` membangun candle palsu dari sparkline + sinus. Pemula yang belajar pola dari data ini akan salah belajar.
**File yang terdampak**: `src/components/TradingTerminalModal.tsx`, `src/lib/market-data.ts`
**Langkah implementasi**:
1. Ubah default `chartStyle` dari `"CANDLE"` menjadi `"TV_LIVE"` (embed TradingView).
2. Rename opsi di UI: "Candle (ilustrasi)", "Garis (ilustrasi)", "TradingView (data asli)". Mode ilustrasi menampilkan badge permanen: **"Ilustrasi — bukan data pasar"**. Readout O/H/L/C dan MA(5) hanya tampil di mode ilustrasi dan ikut berlabel itu.
3. Sembunyikan pemilih timeframe 1D/1W/1M/1Y saat mode `TV_LIVE` (iframe memakai `interval=D` sendiri).
4. Item tanpa simbol TradingView yang valid (mis. `rdpu-index` yang memakai `TVC:ID10Y` — itu simbol yield obligasi, bukan RDPU) → sembunyikan opsi `TV_LIVE` dan tampilkan catatan "Tidak ada grafik pasar langsung untuk instrumen ini".
5. `gold-idr` memakai `OANDA:XAUUSD` (USD/ons) padahal harga yang ditampilkan IDR/gram → beri catatan "Grafik TradingView dalam USD per troy ounce".
6. Verifikasi embed `https://s.tradingview.com/widgetembed/` untuk simbol IDX (`IDX:COMPOSITE`, `IDX:BBCA`, `IDX:BBRI`). Jika tidak tersedia, tampilkan pesan yang jelas dan fallback ke mode ilustrasi **berlabel**.
7. Jangan menyembunyikan atribusi TradingView; cek bahwa opsi `attributionLogo` pada `lightweight-charts` tidak dimatikan.
**Acceptance criteria**:
- [x] Membuka modal untuk BTC langsung menampilkan chart TradingView, bukan candle sintetis.
- [x] Setiap tampilan candle/garis buatan sendiri memiliki badge "Ilustrasi — bukan data pasar".
- [x] Opsi TradingView tidak muncul untuk `rdpu-index`.
- [x] Signature `generateOHLCCandles` tidak berubah (test bergantung padanya).
**Catatan**: Jangan hapus fitur chart ilustrasi; ia berguna sebagai alat bantu belajar jika **berlabel jujur**.

### Task 1.3 — Status data per item (live vs contoh statis)
**Tujuan**: Badge global "Live Public API" menyesatkan karena hanya BTC/ETH/emas yang live; sisanya konstanta.
**File yang terdampak**: `src/lib/market-data.ts`, `src/app/api/market/route.ts`, `src/app/market/page.tsx`
**Langkah implementasi**:
1. Tambahkan ke `MarketItem`: `dataStatus: "live" | "static"` dan `asOf: string` (ISO).
2. Di `FALLBACK_ITEMS` set `dataStatus: "static"` dan `asOf` dari **satu konstanta** `STATIC_SNAPSHOT_AS_OF` di `market-data.ts` (nilai diisi pemilik; jika belum diketahui isi `"TODO(owner)"` dan tampilkan "Data contoh, belum diperbarui").
3. Di `route.ts`, item yang berhasil diganti data CoinGecko diberi `dataStatus: "live"` dan `asOf: new Date().toISOString()`.
4. Jika CoinGecko gagal, cache fallback cukup **10 detik** (bukan 60 detik) agar cepat pulih.
5. `market/page.tsx`: hapus klaim global "Live Public API"; tampilkan pill per baris ("Live" / "Contoh statis"), plus banner ringkas bila ada item statis.
6. Panel indikator makro (`DEFAULT_MACRO_INDICATORS`) diberi label "Data contoh (statis)" dan tanggal `asOf`.
**Acceptance criteria**:
- [x] Saat CoinGecko berhasil: BTC/ETH/emas berlabel Live, IHSG/BBCA/BBRI/S&P/RDPU/SBN berlabel Contoh statis.
- [x] Tidak ada teks "Live" yang berlaku untuk seluruh halaman.
- [x] Panel makro berlabel statis.
**Catatan**: Jangan mengisi angka "terkini" dari ingatan. Mengganti konstanta dengan sumber resmi (BI/BPS/IDX) adalah pekerjaan terpisah (Fase 6).

### Task 1.4 — Hapus support/resistance palsu
**Tujuan**: `supportLevel = harga×0,94` dan `resistanceLevel = harga×1,06` mengajarkan konsep yang salah dan bertentangan dengan modul `saham-teknikal-sr`. Label "Support Beli" juga terbaca seperti sinyal beli.
**File yang terdampak**: `src/lib/market-data.ts`, `src/app/api/market/route.ts`, `src/components/TradingTerminalModal.tsx`, `src/app/market/page.tsx`
**Langkah implementasi**:
1. `grep -rn "supportLevel\|resistanceLevel" src` untuk menemukan semua pemakaian.
2. Hapus kedua field dari `MarketItem`, `FALLBACK_ITEMS`, dan pengali di `route.ts`.
3. Ganti dua sel UI di modal dengan "Terendah 7 hari" dan "Tertinggi 7 hari" yang dihitung dari `sparkline` (`Math.min`/`Math.max`); untuk item `static` tambahkan label "contoh".
**Acceptance criteria**:
- [x] `grep` untuk `supportLevel|resistanceLevel` tidak menemukan apa pun di `src`.
- [x] Teks "Support Beli" tidak ada lagi di UI.
- [x] `tsc` bersih; modul edukasi `saham-teknikal-sr` tidak diubah.

### Task 1.5 — Perbaiki bug cache promise di `ensureSchema()`
**Tujuan**: Jika koneksi DB gagal sekali, promise yang gagal tersimpan di `schemaPromise` selamanya sehingga seluruh request auth/state gagal sampai server restart.
**File yang terdampak**: `src/lib/db.ts`
**Langkah implementasi**:
1. Reset `schemaPromise` saat gagal:
   ```ts
   schemaPromise ??= getDb()
     .batch([...SCHEMA_STATEMENTS], "write")
     .then(() => undefined)
     .catch((error) => { schemaPromise = undefined; throw error; });
   return schemaPromise;
   ```
**Acceptance criteria**:
- [x] Setelah `batch` gagal sekali, panggilan `ensureSchema()` berikutnya mencoba lagi.
- [x] Perilaku normal (sukses) tidak berubah.

### Task 1.6 — Alarm harga yang jujur
**Tujuan**: Nama "alarm" menjanjikan pemberitahuan di latar belakang, padahal pengecekan hanya terjadi saat halaman `/market` terbuka (setahu reviewer tidak ada polling — verifikasi dulu).
**File yang terdampak**: `src/app/market/page.tsx`, `src/components/TradingTerminalModal.tsx`
**Langkah implementasi**:
1. Tambahkan polling `fetchMarket` tiap 60 detik **hanya saat** `document.visibilityState === "visible"`, dengan cleanup interval di `useEffect`.
2. Tambahkan teks di panel alarm: "Alarm hanya aktif selama halaman ini terbuka."
3. Jangan mengubah `evaluateAlarms` (dites).
**Acceptance criteria**:
- [x] Tidak ada interval yang bocor setelah pindah halaman (cleanup berjalan).
- [x] Teks keterbatasan alarm terlihat di UI.
- [x] Tidak ada fetch beruntun saat tab tidak terlihat.
**Catatan**: Notifikasi push sungguhan butuh service worker yang proper — lihat Fase 6.

---

# 🟡 FASE 2 — Keamanan & Ketahanan
> Dependency fase: Fase 1 selesai. Fondasi auth sudah baik; task di bawah menutup celah yang tersisa.

### Task 2.1 — Rate limit auth yang tidak bisa dilewati dan persisten
**Tujuan**: Kunci saat ini `${ip}:${email}` dengan IP dari `x-forwarded-for` (bisa dipalsukan) dan `Map` in-memory (reset per instance serverless). Penyerang cukup mengganti email/header tiap percobaan.
**File yang terdampak**: `src/lib/auth.ts`, `src/lib/db.ts`, `src/app/api/auth/route.ts`
**Langkah implementasi**:
1. Tanyakan/tentukan platform deploy. Jika Vercel, ambil IP klien dari header yang disediakan platform (`x-real-ip` / `x-vercel-forwarded-for`), bukan elemen pertama `x-forwarded-for` buatan klien.
2. Pisahkan **dua** kunci: per-IP (mis. 20 percobaan/menit) dan per-email (mis. 5 percobaan gagal/15 menit). Tolak jika salah satu terlampaui.
3. Simpan penghitung di Turso: tabel baru `rate_limits(key TEXT PRIMARY KEY, count INTEGER NOT NULL, reset_at INTEGER NOT NULL)` lewat `SCHEMA_STATEMENTS`, dengan upsert atomik. Hapus baris kedaluwarsa secara berkala.
4. Pertahankan nama dan signature `checkAuthRateLimit` / `resetAuthRateLimitForTests` jika dipakai test (cek isi `recommendation.test.ts` sebelum mengubah).
5. Respons 429 + header `Retry-After` tetap.
**Acceptance criteria**:
- [x] Mengganti email di tiap request dari IP yang sama tetap terkena limit per-IP.
- [x] Banyak percobaan ke satu email dari IP berbeda tetap terkena limit per-email.
- [x] Counter bertahan antar request/instance (disimpan di DB).
- [x] Login normal tidak terdampak.
**Catatan**: Jangan mempercayai header IP dari klien. Jika platform deploy tidak jelas, tandai `TODO(owner)`.

### Task 2.2 — Async scrypt, samakan waktu respons, naikkan panjang minimal password
**Tujuan**: `scryptSync` memblokir event loop (rentan DoS). Login ke email yang tidak ada langsung return sehingga email terdaftar bisa ditebak lewat waktu respons. Minimal password 6 terlalu lemah.
**File yang terdampak**: `src/lib/auth.ts`, `src/app/api/auth/route.ts`, komponen form login/register (cari, kemungkinan `src/components/Navbar.tsx`), test terkait
**Langkah implementasi**:
1. Ganti `scryptSync` dengan `scrypt` async (`promisify`); `hashPassword`/`verifyPassword` menjadi async dan semua pemanggil/test ikut disesuaikan.
2. Pada login dengan email yang tidak ditemukan, tetap jalankan `verifyPassword` terhadap **hash dummy** agar durasi respons setara.
3. `MIN_PASSWORD_LENGTH = 8` — **hanya berlaku untuk register**. Login cukup memeriksa batas maksimum.
4. Perbarui teks error/hint di form.
**Acceptance criteria**:
- [x] Tidak ada `scryptSync` tersisa di `src`.
- [x] Register dengan password 7 karakter ditolak; password 8 karakter diterima.
- [x] **Akun lama dengan password 6–7 karakter masih bisa login.**
- [x] Login email tidak terdaftar dan password salah menghasilkan pesan yang sama.
**Catatan**: Gotcha utama — route login saat ini memvalidasi panjang password untuk register **dan** login. Jika `MIN_PASSWORD_LENGTH` dinaikkan tanpa memisahkan, pengguna lama terkunci.

### Task 2.3 — Hardening session
**Tujuan**: Token session disimpan plaintext; jika DB bocor, semua session aktif bisa dibajak. Session kedaluwarsa tidak pernah dihapus.
**File yang terdampak**: `src/lib/auth.ts`, `src/lib/db.ts`
**Langkah implementasi**:
1. Simpan `sha256(token)` di kolom `token` (cookie tetap berisi token asli); hash saat `createSession`, `getUserBySessionToken`, dan `deleteSession`.
2. Hapus session kedaluwarsa (`DELETE FROM sessions WHERE expires_at < ?`) saat login/register.
3. Tambahkan index: `sessions(user_id)` dan `sessions(expires_at)`.
**Acceptance criteria**:
- [ ] Isi tabel `sessions` tidak lagi memuat token yang sama dengan nilai cookie.
- [ ] Login/logout/me tetap berfungsi.
- [ ] Session kedaluwarsa terhapus.
**Catatan**: Session aktif lama menjadi tidak valid (pengguna harus login ulang) — wajar, sebutkan di catatan rilis.

### Task 2.4 — Hilangkan lost update pada user state
**Tujuan**: `saveUserStateToDb` membaca lalu menulis tanpa transaksi, sehingga dua tab/perangkat saling menimpa `completedModules`.
**File yang terdampak**: `src/lib/auth.ts`, `src/lib/user-state.ts`, `src/lib/user-sync.ts`, `src/app/api/user-state/route.ts`
**Langkah implementasi**:
1. Periksa apakah UI pernah **membatalkan** status selesai sebuah modul.
2. Jika tidak pernah: gabungkan `completedModules` sebagai **union** di server di dalam transaksi libSQL (`db.transaction("write")`).
3. Jika pernah: pakai optimistic concurrency — klien mengirim `baseUpdatedAt`, server membalas 409 bila berbeda, klien fetch ulang lalu merge.
4. `riskState` dan `priceAlarms` boleh last-write-wins dengan `updatedAt`.
**Acceptance criteria**:
- [ ] Dua PUT bersamaan yang menambahkan modul berbeda → keduanya tersimpan.
- [ ] Alur login merge (`mergeUserStates`) tetap berjalan.

### Task 2.5 — Security headers: CSP dan HSTS
**Tujuan**: `next.config.ts` baru punya header dasar. Tambahkan CSP untuk membatasi dampak XSS dan HSTS untuk produksi.
**File yang terdampak**: `next.config.ts` (dan `src/app/layout.tsx` bila nonce diperlukan)
**Langkah implementasi**:
1. Mulai dengan `Content-Security-Policy-Report-Only`. Izinkan `frame-src https://s.tradingview.com`, `connect-src 'self'` (CoinGecko dipanggil server-side), dan `img-src 'self' data:`.
2. Script inline di `layout.tsx` (pembersih service worker) dan script inline Next membutuhkan nonce atau `'unsafe-inline'`. Dev membutuhkan `'unsafe-eval'` — jangan bawa ke produksi.
3. Setelah tidak ada pelanggaran di `bun run dev` dan `bun run build && bun run start`, ubah ke mode enforce.
4. Tambahkan `Strict-Transport-Security` hanya untuk produksi.
**Acceptance criteria**:
- [ ] Semua halaman, chart TradingView, dan chart `lightweight-charts` tetap tampil di dev dan prod build.
- [ ] Tidak ada hydration mismatch baru (lihat peringatan di `AGENTS.md`).
- [ ] Header CSP dan HSTS terlihat di respons produksi.
**Catatan**: Jangan mengaktifkan `cacheComponents`/`partialPrefetching` (dilarang di `AGENTS.md`).

### Task 2.6 — Privasi: hapus akun dan halaman kebijakan privasi
**Tujuan**: Aplikasi menyimpan data keuangan pengguna (jawaban profil risiko, modal simulasi, alarm) bersama email/nama. Pengguna perlu tahu apa yang disimpan dan bisa menghapusnya (relevan dengan UU PDP).
**File yang terdampak**: `src/app/api/auth/route.ts`, `src/lib/auth.ts`, halaman baru `src/app/privasi/page.tsx`, `src/components/Navbar.tsx` (atau tempat menu akun), footer di `src/app/layout.tsx`
**Langkah implementasi**:
1. Tambahkan action `delete-account` (wajib sesi valid + konfirmasi password): hapus `user_state`, `sessions`, lalu `users` dalam satu transaksi, dan hapus cookie.
2. Tambahkan tombol "Hapus akun" dengan dialog konfirmasi.
3. Buat halaman `/privasi` berisi: data yang disimpan, tujuan, lokasi penyimpanan, cara hapus akun, kontak. Tautkan dari footer.
**Acceptance criteria**:
- [ ] Setelah hapus akun, tidak ada baris tersisa untuk `user_id` tersebut di `users`, `sessions`, `user_state`.
- [ ] Action tanpa sesi valid atau dengan password salah ditolak.
- [ ] `/privasi` bisa diakses tanpa login.
**Catatan**: Teks kebijakan privasi hanyalah draf — tandai `TODO(owner)` agar ditinjau pemilik (dan ahli hukum bila aplikasi dipublikasikan luas).

---

# 🟡 FASE 3 — Rekomendasi yang Lebih Jujur dan Mendidik
> Dependency fase: Task 1.1 selesai.

### Task 3.1 — Rezim makro: default netral dan pindah ke mode lanjutan
**Tujuan**: Pemula tidak bisa menilai apakah ekonomi sedang "ekspansi" atau "krisis inflasi", dan memilih rezim bertentangan dengan pesan edukasi (DCA, jangan menebak pasar).
**File yang terdampak**: `src/app/recommendation/page.tsx`
**Langkah implementasi**:
1. Selector rezim makro dipindah ke bagian "Mode lanjutan" yang tertutup (collapsed) secara default.
2. Default tetap `"netral"`; tambahkan teks: "Mayoritas investor pemula sebaiknya tidak menyesuaikan alokasi berdasarkan tebakan kondisi ekonomi."
3. Mesin (`MACRO_TILT`) tidak diubah.
**Acceptance criteria**:
- [ ] Pengguna baru melihat hasil tanpa harus memilih rezim makro.
- [ ] Mode lanjutan masih bisa dibuka dan berfungsi; state `macroRegime` tetap tersinkron (`investedu_risk_state`).

### Task 3.2 — Ganti return/drawdown hardcoded dengan skenario dan kerugian terburuk dalam rupiah
**Tujuan**: "Agresif: 14%–22%/tahun" terbaca seperti janji, dan `maxHistoricalDrawdown` (-20% s/d -35%) berlabel *historical* padahal tidak dihitung dari data — dengan 15% kripto angka itu hampir pasti terlalu optimistis.
**File yang terdampak**: `src/lib/recommendation.ts`, `src/app/recommendation/page.tsx`, `src/lib/recommendation.test.ts`
**Langkah implementasi**:
1. Hapus `expectedReturnMap` sebagai satu angka rentang; ganti dengan skenario **buruk / dasar / baik** yang dihitung dari bobot alokasi × asumsi per aset.
2. Tambahkan tabel asumsi stres per aset (RDPU/SBN, emas, saham, kripto) dengan field `source` dan `period`. Hitung `worstCase = Σ bobot × stres`.
3. Tampilkan kerugian terburuk dalam rupiah memakai `capital` dari state ("Modal Rp10 juta bisa turun menjadi sekitar Rp…").
4. Ganti label menjadi "Perkiraan penurunan terburuk (ilustratif)". Tambahkan kalimat: hasil masa lalu bukan jaminan masa depan.
**Acceptance criteria**:
- [ ] Tidak ada teks "expected return" berupa satu rentang pasti di UI.
- [ ] Worst-case profil Agresif ≥ worst-case Moderat ≥ worst-case Konservatif (diuji).
- [ ] Setiap angka asumsi punya `source`/`period`, atau bertanda `TODO(owner): verifikasi`.
**Catatan**: Agent **tidak boleh mengarang** angka historis. Jika tidak bisa mengambil dari sumber terverifikasi, tandai angka sebagai asumsi ilustratif dan minta pemilik mengisi/memverifikasi sumbernya.

### Task 3.3 — Rasional personal pada hasil rekomendasi
**Tujuan**: `rationale` saat ini kalimat template yang sama untuk semua orang. Alasan personal sekaligus menjadi materi belajar.
**File yang terdampak**: `src/lib/recommendation.ts`, `src/app/recommendation/page.tsx`
**Dependency**: Task 1.1 (field `reasons`)
**Langkah implementasi**:
1. Tampilkan daftar `reasons` dalam bahasa awam, contoh: "Horizon investasi Anda > 5 tahun, sehingga porsi saham bisa lebih besar" atau "Dana darurat belum ada, jadi prioritas pertama adalah membangunnya."
2. Ganti `rationale` template dengan ringkasan satu kalimat yang merujuk `reasons`.
**Acceptance criteria**:
- [ ] Dua pengguna dengan jawaban berbeda melihat alasan yang berbeda.
- [ ] Aturan keras dari Task 1.1 selalu muncul di daftar alasan.

### Task 3.4 — Konsistensi teks rekomendasi
**Tujuan**: Teks statis bisa bertentangan dengan angka yang dihitung.
**File yang terdampak**: `src/lib/recommendation.ts`
**Langkah implementasi**:
1. `tacticalActions` untuk Moderat menyebut "60% aset stabil / 40% pertumbuhan" statis; hitung dari alokasi aktual setelah tilt.
2. Pembagian "Bitcoin 80% + Ethereum 20%" diberi kata "contoh" dan penjelasan bahwa itu ilustrasi, bukan instruksi.
3. Hapus istilah "mesin alokasi ... mengoptimalkan imbal hasil" dari teks pengguna.
**Acceptance criteria**:
- [ ] Persentase yang disebut di teks selalu sama dengan `allocation`.
- [ ] Tidak ada nama produk/sekuritas spesifik yang diposisikan sebagai perintah beli.

### Task 3.5 — Audit penyebutan regulator (Bappebti/OJK)
**Tujuan**: Teks menyebut Bappebti untuk emas digital dan kripto. Setahu reviewer, pengawasan aset kripto dialihkan dari Bappebti ke OJK sejak Januari 2025; status regulator emas digital **belum diverifikasi** reviewer.
**File yang terdampak**: `src/data/education.ts`, `src/lib/recommendation.ts` (hanya hasil audit)
**Langkah implementasi**:
1. `grep -rniE "bappebti|ojk" src` dan kumpulkan semua penyebutan beserta file:baris.
2. **Jangan mengubah isi dulu.** Tulis daftar temuan ke `docs/regulatory-audit.md` dengan kolom: lokasi, kalimat saat ini, regulator yang tertulis, `TODO(owner): verifikasi di sumber resmi`.
3. Setelah pemilik memverifikasi (ojk.go.id, bappebti.go.id, kemenkeu.go.id), perbarui teksnya.
**Acceptance criteria**:
- [ ] `docs/regulatory-audit.md` memuat seluruh penyebutan.
- [ ] Tidak ada teks regulator yang diubah tanpa verifikasi pemilik.

---

# 🟡 FASE 4 — Konten & Pengalaman Belajar untuk Pemula
> Target utama adalah pemula total. Saat ini 18 modul condong ke instrumen/trading (4 modul kripto, analisis teknikal, psikologi trading) dan berjudul penuh jargon. Draf konten oleh agent **wajib direview pemilik** sebelum dipublikasikan.

### Task 4.1 — Modul fondasi "Mulai dari sini"
**Tujuan**: Belum ada modul tentang dasar keuangan pribadi. Pemula perlu memahami tujuan keuangan, dana darurat, inflasi, dan bunga majemuk sebelum instrumen.
**File yang terdampak**: `src/data/education.ts`, `src/app/education/page.tsx`
**Langkah implementasi**:
1. Tambahkan kategori baru `"Dasar"` ke `AssetCategory`. **Gotcha**: `ASSET_OVERVIEW` bertipe `Record<AssetCategory, ...>`, jadi wajib diberi entri `"Dasar"`; periksa juga semua tempat yang memetakan kategori (filter/warna) di `education/page.tsx`.
2. Tambahkan 3 modul level `Pemula` memakai struktur `EducationModule` yang sudah ada (summary, keyTakeaways, sections, caseStudy, redFlags, actionChecklist, quiz/quizzes):
   - `dasar-tujuan-dana-darurat` — menentukan tujuan keuangan dan membangun dana darurat.
   - `dasar-inflasi-bunga-majemuk` — mengapa uang yang diam kalah oleh inflasi dan efek waktu pada investasi rutin.
   - `dasar-waspada-bodong-pinjol` — ciri investasi bodong, pinjol ilegal, dan utang konsumtif.
3. Gunakan bahasa sehari-hari; hindari istilah teknis tanpa penjelasan.
**Acceptance criteria**:
- [ ] Tiga modul tampil di halaman edukasi dengan kategori "Dasar" dan level Pemula.
- [ ] Setiap modul punya kuis, red flags, dan checklist aksi.
- [ ] `tsc` bersih (semua `Record<AssetCategory, ...>` terisi).
**Catatan**: Angka/regulasi di konten harus berasal dari sumber resmi atau diberi `TODO(owner)`. Jangan mengarang statistik.

### Task 4.2 — Jalur belajar berurutan
**Tujuan**: Modul sekarang bisa dibuka acak sehingga pemula bisa langsung ke "MVRV Z-Score".
**File yang terdampak**: `src/app/education/page.tsx`, `src/app/page.tsx`, `src/data/education.ts`
**Dependency**: Task 4.1
**Langkah implementasi**:
1. Definisikan urutan jalur di `education.ts`: modul "Dasar" → instrumen level Pemula → Menengah → Lanjutan.
2. Tampilkan bagian "Mulai dari sini" di `/education` dan kartu "Lanjutkan belajar" di `/` yang menunjuk modul berikutnya yang belum selesai (berdasarkan `investedu_completed_modules`).
3. Gunakan **rekomendasi lunak**, bukan penguncian keras: modul lanjutan tetap bisa dibuka dengan label "Disarankan setelah menyelesaikan dasar".
**Acceptance criteria**:
- [ ] Pengguna baru melihat modul fondasi sebagai langkah pertama.
- [ ] Setelah menyelesaikan satu modul, kartu "Lanjutkan belajar" menunjuk modul berikutnya.
- [ ] Sinkronisasi state guest/akun tetap berjalan.

### Task 4.3 — Judul berbahasa awam
**Tujuan**: Judul seperti "Mean PBV Standard Deviation", "MVRV Z-Score", "Real Yield US Treasury", "Tokenomics" tidak cocok untuk target awam.
**File yang terdampak**: `src/data/education.ts`, `src/app/education/page.tsx`
**Langkah implementasi**:
1. Tambahkan field `plainTitle: string` pada `EducationModule`; isi untuk **semua** modul dengan judul bahasa sehari-hari (contoh: "Cara membaca laporan reksa dana").
2. Tampilkan `plainTitle` sebagai judul utama dan `title` teknis sebagai subjudul. Jangan menghapus/mengubah `title`.
**Acceptance criteria**:
- [ ] Semua modul memiliki `plainTitle` (dipastikan oleh tipe wajib).
- [ ] Daftar modul menampilkan judul awam di atas, istilah teknis di bawah.

### Task 4.4 — Hubungkan hasil rekomendasi ke modul terkait
**Tujuan**: Tiga fitur saat ini berdiri sendiri. Hasil rekomendasi seharusnya menuntun ke materi.
**File yang terdampak**: `src/app/recommendation/page.tsx`, `src/data/education.ts`
**Langkah implementasi**:
1. Buat pemetaan aset → id modul (mis. emas → `emas-safe-haven`; RDPU/SBN → `reksadana-dasar`, `reksadana-sbn-ritel`; saham → `saham-fundamental`; kripto → `kripto-fundamental`, `kripto-keamanan-wallet`; dana darurat → `dasar-tujuan-dana-darurat`).
2. Di kartu instrumen pada hasil rekomendasi, tambahkan tautan `next/link` "Pelajari: …".
**Acceptance criteria**:
- [ ] Setiap aset berporsi > 0 punya tautan ke modul yang valid (id divalidasi oleh tipe/tes).
- [ ] Jika aturan keras dana darurat aktif, tautan ke modul dana darurat muncul paling atas.
**Dependency**: Task 4.1 (untuk modul dana darurat)

### Task 4.5 — Penanda kesegaran dan sumber pada modul
**Tujuan**: Angka pajak, kupon, dan regulasi cepat usang. Pengguna perlu tahu seberapa baru sebuah materi dan di mana memverifikasinya.
**File yang terdampak**: `src/data/education.ts`, `src/app/education/page.tsx`
**Langkah implementasi**:
1. Tambahkan field opsional `lastReviewed?: string` (ISO date) dan `sources?: { label: string; url: string }[]` pada `EducationModule`.
2. Tampilkan di footer modul. Jika `lastReviewed` kosong, tampilkan "Belum diverifikasi ulang".
3. **Jangan mengisi `lastReviewed`** untuk modul yang belum benar-benar diperiksa pemilik. `sources` boleh diusulkan (ojk.go.id, djppr.kemenkeu.go.id, idx.co.id) dan wajib bertanda `TODO(owner): verifikasi`.
**Acceptance criteria**:
- [ ] Footer modul menampilkan tanggal tinjau atau "Belum diverifikasi ulang".
- [ ] Tidak ada tanggal "terverifikasi" yang diisi agent.

---

# 🟢 FASE 5 — Kebersihan Proyek & Engineering Hygiene
> Aman dikerjakan paralel setelah Fase 1–2. Tidak mengubah perilaku pengguna kecuali disebutkan.

### Task 5.1 — README sungguhan
**Tujuan**: `README.md` masih boilerplate `create-next-app`.
**File yang terdampak**: `README.md`
**Langkah implementasi**:
1. Tulis: tujuan proyek, fitur, tech stack, cara menjalankan (`bun install`, `.env` dari `.env.example`, `bun run dev`), variabel environment (`TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`), perintah verifikasi, disclaimer ("edukasi, bukan nasihat keuangan"), dan roadmap singkat.
2. Tambahkan 1–2 screenshot (tempatkan di `docs/`, bukan `tmp/`).
**Acceptance criteria**:
- [ ] Orang baru bisa menjalankan proyek hanya dengan mengikuti README.
- [ ] Tidak ada teks boilerplate "bootstrapped with create-next-app".

### Task 5.2 — Script `test`/`typecheck` dan CI
**Tujuan**: Test hanya dijalankan manual lewat `bun src/lib/recommendation.test.ts` dan tidak ada CI.
**File yang terdampak**: `package.json`, `.github/workflows/ci.yml` (baru)
**Langkah implementasi**:
1. Tambahkan script: `"typecheck": "tsc --noEmit"`, `"test": "bun src/lib/recommendation.test.ts"`.
2. Buat workflow GitHub Actions (push & pull request): setup bun → `bun install --frozen-lockfile` → `bun run typecheck` → `bun run test` → `bun run lint` → `bun run build`.
**Acceptance criteria**:
- [ ] `bun run typecheck` dan `bun run test` berjalan lokal.
- [ ] Workflow CI hijau di GitHub.
**Catatan**: `next build` mengambil Google Fonts, jadi runner butuh internet (default GitHub Actions sudah punya).

### Task 5.3 — Pindahkan logika murni keluar dari file komponen
**Tujuan**: `evaluateAlarms`, `generateOHLCCandles`, dan helper format hidup di `TradingTerminalModal.tsx` (977 baris, `"use client"`), padahal test mengimpornya dari sana.
**File yang terdampak**: `src/components/TradingTerminalModal.tsx`, file baru `src/lib/alarms.ts` dan `src/lib/chart-data.ts`, `src/app/market/page.tsx`, `src/lib/recommendation.test.ts`
**Dependency**: Task 1.2, 1.4, 1.6 selesai (menyentuh file yang sama)
**Langkah implementasi**:
1. Pindahkan fungsi murni + tipe terkait (`PriceAlarm`, `OHLCCandle`, `evaluateAlarms`, `generateOHLCCandles`, `formatCompactAxisPrice`) ke `src/lib/`.
2. Perbarui semua import (komponen, halaman market, test). Isi fungsi **tidak berubah**.
**Acceptance criteria**:
- [ ] Modal hanya berisi logika UI.
- [ ] Test lulus dengan import baru.
- [ ] `tsc` dan build bersih; tidak ada import `next/server` yang masuk bundle client.

### Task 5.4 — Bersihkan file yang tidak terpakai
**Tujuan**: Ada file sisa yang membingungkan.
**File yang terdampak**: `tmp/img.png`, `public/{next,vercel,file,window,globe}.svg`, `.gitignore`/`AGENTS.md`
**Langkah implementasi**:
1. `grep` untuk memastikan setiap file benar-benar tidak direferensikan, lalu hapus.
2. `AGENTS.md` tercantum di `.gitignore` tetapi ter-commit. **Jangan memutuskan sendiri**: tanyakan pemilik apakah ingin dihapus dari `.gitignore` (tetap di repo) atau dikeluarkan dari repo.
**Acceptance criteria**:
- [ ] Build dan semua halaman tetap bekerja setelah penghapusan.
- [ ] Keputusan `AGENTS.md` dicatat dari jawaban pemilik, bukan asumsi.

### Task 5.5 — Batasi pembersih service worker hanya untuk development ⚠️ butuh persetujuan pemilik
**Tujuan**: Script inline di `layout.tsx` dan `public/sw.js` meng-unregister semua service worker, menghapus cache, dan dapat me-reload halaman sampai 2 kali **di setiap load, termasuk produksi**. Tujuan awalnya membersihkan SW lama di `localhost:3000`. Akibatnya aplikasi tidak bisa menjadi PWA sungguhan.
**File yang terdampak**: `src/app/layout.tsx`, `AGENTS.md` (bagian "Service Worker killer")
**Langkah implementasi**:
1. **Minta persetujuan eksplisit pemilik terlebih dahulu** — task ini mengubah aturan yang tertulis di `AGENTS.md` ("Do not remove or replace with a caching Service Worker").
2. Jalankan script pembersih hanya bila `process.env.NODE_ENV !== "production"` (atau hostname localhost). Pertahankan `public/sw.js` dan header `Clear-Site-Data`-nya apa adanya.
3. **Jangan** menambahkan service worker yang meng-cache `/_next/static/*` (merusak chunk Turbopack dan hydration, sesuai `AGENTS.md`).
4. Perbarui bagian terkait di `AGENTS.md` agar mencerminkan perubahan.
**Acceptance criteria**:
- [ ] Build produksi tidak menyertakan script pembersih dan tidak memaksa reload.
- [ ] Dev di `localhost:3000` tetap membersihkan SW lama.
- [ ] `AGENTS.md` diperbarui; tidak ada hydration mismatch.

### Task 5.6 — Rapikan struktur data dan file besar (prioritas rendah)
**Tujuan**: `src/data/education.ts` 1.657 baris; setiap modul memiliki `quiz` (tunggal) **dan** `quizzes` (array) yang tumpang tindih.
**File yang terdampak**: `src/data/education.ts` (+ file kategori baru), `src/app/education/page.tsx`
**Langkah implementasi**:
1. Periksa pemakaian `quiz` vs `quizzes` di `education/page.tsx`; satukan menjadi satu field bila memungkinkan tanpa mengubah perilaku.
2. Pecah `education.ts` per kategori (`src/data/education/saham.ts`, dst.) dengan satu `index.ts` yang mengekspor semuanya.
**Acceptance criteria**:
- [ ] Refactor murni: halaman edukasi menampilkan konten identik sebelum dan sesudah.
- [ ] `tsc` bersih dan semua id modul tetap sama.

---

# 🔵 FASE 6 — Nice to Have (jangan dikerjakan kecuali diminta eksplisit)

- Data OHLC **asli** (mis. endpoint OHLC CoinGecko untuk kripto; sumber berlisensi untuk saham IDX) menggantikan chart sintetis sepenuhnya.
- Sumber resmi untuk indikator makro dan harga saham/SBN/RDPU (BI, BPS, IDX, DJPPR) menggantikan konstanta statis.
- PWA sungguhan: service worker (mis. Serwist) tanpa meng-cache `/_next/static/*` + Web Push agar alarm harga jalan di latar belakang.
- Paper trading: portofolio simulasi dengan harga nyata untuk berlatih tanpa risiko.
- Gamifikasi ringan: streak belajar, lencana penyelesaian jalur, pengingat belajar.
- Pengulangan berjarak (spaced repetition) untuk kuis yang sering salah.
- Daftar sesi aktif dan "logout semua perangkat".

---

## ✅ Progress Tracker

| Task | Status | Catatan |
|------|--------|---------|
| 1.1 — Pagar pengaman klasifikasi risiko | ✅ Done | `classifyRiskProfile`, aturan keras `emergency_fund`/`horizon`, field `reasons`, UI warning & test |
| 1.2 — Label chart sintetis, TradingView default | ✅ Done | Default `TV_LIVE`, badge "Ilustrasi — bukan data pasar", sembunyikan TV di `rdpu-index`, catatan `gold-idr` & fallback IDX |
| 1.3 — Status data per item | ✅ Done | `dataStatus` ("live" \| "static"), `asOf` (`STATIC_SNAPSHOT_AS_OF = "TODO(owner)"`), fallback cache 10s, pill per item & label makro statis |
| 1.4 — Hapus support/resistance palsu | ✅ Done | Hapus `supportLevel`/`resistanceLevel` di seluruh `src/`, ganti dengan Terendah/Tertinggi 7 hari dari `sparkline` |
| 1.5 — Fix `ensureSchema` | ✅ Done | Reset `schemaPromise = undefined` di `.catch(...)` saat inisialisasi DB gagal |
| 1.6 — Alarm harga jujur | ✅ Done | Polling 60s saat `document.visibilityState === "visible"` + keterangan "Alarm hanya aktif selama halaman ini terbuka." |
| 2.1 — Rate limit persisten | ✅ Done | Tabel `rate_limits` di Turso, pisah limit per-IP (20/mnt) & per-email (5/15mnt), header IP `x-vercel-forwarded-for`/`x-real-ip` (`TODO(owner)`) |
| 2.2 — Async scrypt + password min 8 | ✅ Done | `promisify(scrypt)`, `DUMMY_PASSWORD_HASH` untuk timing login setara, `MIN_PASSWORD_LENGTH = 8` hanya pada register (akun lama 6–7 karakter tetap bisa login) |
| 2.3 — Hardening session | ⏳ Pending | Session lama jadi tidak valid |
| 2.4 — Atomic merge user state | ⏳ Pending | |
| 2.5 — CSP + HSTS | ⏳ Pending | Mulai Report-Only |
| 2.6 — Hapus akun + privasi | ⏳ Pending | Teks privasi = draf |
| 3.1 — Rezim makro opsional | ⏳ Pending | |
| 3.2 — Skenario & worst-case rupiah | ⏳ Pending | Angka wajib bersumber |
| 3.3 — Rasional personal | ⏳ Pending | Dependency 1.1 |
| 3.4 — Konsistensi teks | ⏳ Pending | |
| 3.5 — Audit regulator | ⏳ Pending | Menunggu verifikasi pemilik |
| 4.1 — Modul fondasi | ⏳ Pending | Konten butuh review pemilik |
| 4.2 — Jalur belajar | ⏳ Pending | Dependency 4.1 |
| 4.3 — Judul awam (`plainTitle`) | ⏳ Pending | |
| 4.4 — Tautan rekomendasi → modul | ⏳ Pending | Dependency 4.1 |
| 4.5 — Kesegaran & sumber modul | ⏳ Pending | |
| 5.1 — README | ⏳ Pending | |
| 5.2 — Scripts + CI | ⏳ Pending | |
| 5.3 — Pindah logika murni | ⏳ Pending | Setelah 1.2, 1.4, 1.6 |
| 5.4 — Bersihkan file | ⏳ Pending | Tanya pemilik soal `AGENTS.md` |
| 5.5 — SW killer dev-only | ⏳ Pending | ⚠️ Butuh persetujuan pemilik |
| 5.6 — Pecah file & satukan quiz | ⏳ Pending | Prioritas rendah |

---

## 🚫 Di Luar Scope

AI agent **tidak boleh** melakukan hal berikut tanpa instruksi eksplisit dari pemilik:

- Mengganti library chart (`lightweight-charts`), framework, atau package manager.
- Mengubah nama cookie `investedu_session`, atau men-drop/rename tabel dan kolom DB yang ada.
- Mengaktifkan `cacheComponents` atau `partialPrefetching`; menambahkan service worker yang meng-cache `/_next/static/*`.
- Mengimpor `src/app/api/market/route.ts` ke file `"use client"`, atau memindahkan `@libsql/client`/`db.ts`/`auth.ts` ke sisi client.
- Menambahkan data pasar, angka historis, sumber, atau klaim regulasi yang tidak diverifikasi.
- Melemahkan atau menghapus disclaimer ("edukasi, bukan nasihat keuangan").
- Menjadikan nama produk/sekuritas spesifik sebagai instruksi beli.
- Merefactor komponen/halaman yang tidak terkait task yang sedang dikerjakan.

---

## 👤 Tugas Manual Pemilik Proyek (bukan untuk AI agent)

1. **Verifikasi regulator** untuk kripto dan emas digital di sumber resmi, lalu putuskan teks akhir (Task 3.5).
2. **Isi/verifikasi angka asumsi stres** dan sumbernya (Task 3.2), serta tanggal snapshot data statis (Task 1.3).
3. **Review semua konten modul baru** dan judul awam sebelum dipublikasikan (Task 4.1, 4.3).
4. **Putuskan** nasib `AGENTS.md` di repo (Task 5.4) dan setujui/tolak Task 5.5.
5. **Uji ke 3–5 orang awam, termasuk adik Anda**: minta mereka menyelesaikan satu modul dan satu rekomendasi tanpa bantuan; catat di mana mereka bingung atau berhenti. Ini masukan yang tidak bisa digantikan review kode.

---

## 📝 Catatan Agent
> Tulis temuan baru di luar scope di sini (jangan langsung dikerjakan).

- `src/app/page.tsx` (baris 78–85 & 100) saat ini hanya menjumlahkan `savedRisk.answers` ke `savedScore` dan memanggil `generateRecommendation(savedScore, savedMacro)` tanpa meneruskan `savedRisk.answers`. Belum diubah pada Task 1.1 karena `src/app/page.tsx` berada di luar daftar file Task 1.1.
