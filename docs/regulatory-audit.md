# Audit Penyebutan Regulator (Bappebti & OJK)

Dokumen ini memuat hasil pencarian seluruh penyebutan `Bappebti` dan `OJK` pada direktori `src/` (`grep -rniE "bappebti|ojk" src`).

> **Catatan**: Sesuai aturan proyek, tidak ada teks klaim regulasi pada `src/` yang diubah sebelum diverifikasi secara langsung oleh pemilik proyek melalui sumber resmi (`ojk.go.id`, `bappebti.go.id`, `kemenkeu.go.id`, serta peraturan terkait UU P2SK / PP peralihan pengawasan aset keuangan digital dan komoditi).

## Daftar Temuan

| Lokasi (`file:baris`) | Kalimat Saat Ini | Regulator yang Tertulis | Status & Tindak Lanjut Pemilik |
| --- | --- | --- | --- |
| `src/lib/recommendation.ts:81` | `source: "TODO(owner): verifikasi — asumsi ilustratif RDPU/SBN Ritel (DJPPR Kemenkeu / OJK)",` | DJPPR Kemenkeu / OJK | `TODO(owner): verifikasi di sumber resmi (ojk.go.id & djppr.kemenkeu.go.id)` |
| `src/lib/recommendation.ts:512` | `specificInstruments: "Emas Batangan (Antam/UBS) atau Emas Digital Berizin Bappebti",` | Bappebti | `TODO(owner): verifikasi di sumber resmi (bappebti.go.id & ojk.go.id) terkait pembagian kewenangan perdagangan fisik emas digital vs kegiatan bullion` |
| `src/data/education.ts:105` | `"Reksa Dana menghimpun dana investor ke dalam Kontrak Investasi Kolektif yang dikelola Manajer Investasi berizin OJK. Nilai portofolionya berubah mengikuti deposito, obligasi, atau saham yang dibeli, sehingga tidak ada jaminan imbal hasil. Baca prospektus dan Fund Fact Sheet untuk melihat mandat investasi, batas risiko, biaya, serta tolok ukurnya."` | OJK | `TODO(owner): verifikasi di sumber resmi (ojk.go.id)` |
| `src/data/education.ts:115` | `"Saat membeli, dana Anda dikonversi menjadi Unit Penyertaan berdasarkan NAB/UP pada tanggal transaksi sesuai cut-off platform. Contoh: Rp3 juta pada NAB/UP Rp1.500 menghasilkan sekitar 2.000 UP sebelum biaya bila ada. Bank Kustodian yang mendapat persetujuan OJK mengadministrasikan kekayaan Reksa Dana dan melakukan pengawasan administratif; mekanisme pemisahan ini berbeda dari menyimpan uang di rekening MI."` | OJK | `TODO(owner): verifikasi di sumber resmi (ojk.go.id)` |
| `src/data/education.ts:143` | `"Pastikan Manajer Investasi, produk, dan Bank Kustodian tercantum pada kanal resmi OJK atau platform berizin."` | OJK | `TODO(owner): verifikasi di sumber resmi (reksadana.ojk.go.id / ojk.go.id)` |
| `src/data/education.ts:631` | `title: "Komparasi Emas Fisik (Antam/UBS), Tabungan Emas Digital (Bappebti) & Kontrak Berjangka",` | Bappebti | `TODO(owner): verifikasi di sumber resmi (bappebti.go.id & ojk.go.id) terkait pengawasan pedagang fisik emas digital dan layanan bank emas/bullion` |
| `src/data/education.ts:1326` | `"Pengawasan aset kripto di Indonesia beralih dari Bappebti ke OJK pada 10 Januari 2025; investor tetap perlu memeriksa status penyelenggara terkini."` | Bappebti, OJK | `TODO(owner): verifikasi di sumber resmi (ojk.go.id & bappebti.go.id) terkait tanggal efektif dan dasar hukum peralihan pengawasan aset kripto` |
| `src/data/education.ts:1347` | `"Gunakan uang dingin, prioritaskan penyelenggara yang statusnya dapat diverifikasi, aktifkan keamanan akun, dan pahami biaya serta implikasi pajak yang berlaku. Sejak transisi pengawasan ke OJK, daftar serta aturan penyelenggara perlu dicek pada sumber resmi terbaru. Hindari leverage futures untuk investasi pemula karena volatilitas BTC saja sudah cukup besar untuk menimbulkan kerugian material."` | OJK | `TODO(owner): verifikasi di sumber resmi (ojk.go.id)` |
| `src/data/education.ts:1370` | `"Periksa status penyelenggara aset kripto pada sumber OJK terkini sebelum deposit."` | OJK | `TODO(owner): verifikasi di sumber resmi (ojk.go.id)` |
