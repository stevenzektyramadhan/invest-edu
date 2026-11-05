import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kebijakan Privasi - InvestEdu",
  description:
    "Informasi mengenai data yang disimpan, tujuan penyimpanan, lokasi penyimpanan, dan cara menghapus akun pada aplikasi InvestEdu.",
};

// TODO(owner): Tinjau draf kebijakan privasi ini bersama pemilik proyek dan penasihat hukum bila aplikasi dipublikasikan secara luas (UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi).
export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 py-4">
      <header className="space-y-2 border-b border-neutral-800 pb-5">
        <span className="inline-block rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-medium text-amber-300">
          Draf Kebijakan Privasi — TODO(owner): Tinjau sebelum publikasi luas
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Kebijakan Privasi &amp; Pengelolaan Data
        </h1>
        <p className="text-sm leading-relaxed text-neutral-400">
          Halaman ini menjelaskan data apa saja yang dikumpulkan dan disimpan oleh
          InvestEdu, tujuan penggunaannya, lokasi penyimpanannya, serta bagaimana
          Anda dapat menghapus akun dan seluruh data Anda kapan saja.
        </p>
      </header>

      <section className="space-y-3 rounded-xl border border-neutral-800 bg-neutral-900/50 p-5">
        <h2 className="text-base font-semibold text-white">
          1. Data yang Disimpan
        </h2>
        <p className="text-sm leading-relaxed text-neutral-300">
          Anda dapat menggunakan InvestEdu tanpa membuat akun (mode tamu). Apabila
          Anda memilih membuat akun sinkronisasi cloud, kami menyimpan data berikut:
        </p>
        <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-neutral-300">
          <li>
            <strong>Data Identitas Akun:</strong> Nama tampilan, alamat email, dan
            hash password (menggunakan algoritma <code>scrypt</code> dengan salt
            acak; kami tidak pernah menyimpan password dalam bentuk teks asli).
          </li>
          <li>
            <strong>Progres Edukasi:</strong> Daftar ID modul pembelajaran yang
            telah Anda selesaikan (<code>completed_modules</code>).
          </li>
          <li>
            <strong>Simulasi Profil Risiko &amp; Modal:</strong> Jawaban kuesioner
            profil risiko, pilihan skenario makroekonomi, dan nominal modal simulasi
            yang Anda masukkan (<code>risk_state</code>).
          </li>
          <li>
            <strong>Alarm Harga:</strong> Daftar pengingat batas harga atas/bawah
            instrumen yang Anda buat di halaman Pasar Live (
            <code>price_alarms</code>).
          </li>
          <li>
            <strong>Data Keamanan &amp; Sesi:</strong> Hash SHA-256 dari token sesi
            login serta pencatatan batas percobaan autentikasi sementara (
            <code>rate_limits</code>) untuk mencegah penyalahgunaan akses.
          </li>
        </ul>
      </section>

      <section className="space-y-3 rounded-xl border border-neutral-800 bg-neutral-900/50 p-5">
        <h2 className="text-base font-semibold text-white">
          2. Tujuan Penggunaan Data
        </h2>
        <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-neutral-300">
          <li>
            Menyinkronkan progres belajar, simulasi alokasi portofolio, dan alarm
            harga Anda di berbagai perangkat.
          </li>
          <li>
            Menjaga keamanan sesi login dan melindungi akun dari percobaan masuk
            tanpa izin (brute-force).
          </li>
          <li>
            Data simulasi keuangan Anda hanya digunakan untuk menampilkan hasil
            edukasi di dalam aplikasi dan tidak dijual atau dibagikan kepada pihak
            ketiga untuk tujuan pemasaran.
          </li>
        </ul>
      </section>

      <section className="space-y-3 rounded-xl border border-neutral-800 bg-neutral-900/50 p-5">
        <h2 className="text-base font-semibold text-white">
          3. Lokasi Penyimpanan Data
        </h2>
        <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-neutral-300">
          <li>
            <strong>Penyimpanan Lokal Peramban (localStorage):</strong> Menyimpan
            progres modul, simulasi profil risiko, dan alarm harga secara langsung
            di perangkat Anda agar aplikasi dapat berjalan tanpa akun.
          </li>
          <li>
            <strong>Basis Data Server (libSQL / Turso):</strong> Apabila Anda masuk
            menggunakan akun, salinan data disinkronkan ke basis data server yang
            terhubung pada lingkungan aplikasi ini. Sesi autentikasi disimpan
            melalui cookie <code>httpOnly</code> bernama{" "}
            <code>investedu_session</code>.
          </li>
        </ul>
      </section>

      <section className="space-y-3 rounded-xl border border-neutral-800 bg-neutral-900/50 p-5">
        <h2 className="text-base font-semibold text-white">
          4. Cara Menghapus Akun &amp; Data
        </h2>
        <p className="text-sm leading-relaxed text-neutral-300">
          Anda memiliki kendali penuh untuk menghapus seluruh data akun yang
          tersimpan di server kapan saja:
        </p>
        <ol className="list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-neutral-300">
          <li>Masuk ke akun Anda melalui tombol akun di bilah navigasi atas.</li>
          <li>
            Klik tombol <strong>&ldquo;Hapus akun&rdquo;</strong> di bilah navigasi
            atas.
          </li>
          <li>
            Masukkan password akun Anda pada dialog konfirmasi, lalu klik{" "}
            <strong>&ldquo;Hapus Akun Permanen&rdquo;</strong>.
          </li>
          <li>
            Sistem akan menghapus seluruh data <code>user_state</code>,{" "}
            <code>sessions</code>, dan <code>users</code> untuk akun Anda dalam
            satu transaksi basis data serta menghapus cookie sesi Anda.
          </li>
        </ol>
        <p className="text-xs leading-relaxed text-neutral-400">
          Catatan: Untuk menghapus data yang tersimpan di peramban lokal perangkat
          Anda (mode tamu), Anda dapat membersihkan data situs (Clear Site Data /
          localStorage) melalui pengaturan peramban Anda.
        </p>
      </section>

      <section className="space-y-2 rounded-xl border border-neutral-800 bg-neutral-900/50 p-5">
        <h2 className="text-base font-semibold text-white">5. Kontak</h2>
        <p className="text-sm leading-relaxed text-neutral-300">
          Untuk pertanyaan atau permintaan terkait privasi dan pelindungan data
          pribadi, silakan hubungi pengelola proyek melalui kanal resmi yang
          ditentukan pemilik proyek (
          <code className="text-amber-300">
            TODO(owner): cantumkan alamat email / kontak resmi pengelola
          </code>
          ).
        </p>
      </section>

      <div className="pt-2">
        <Link
          href="/"
          className="inline-flex items-center rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2 text-xs font-semibold text-neutral-200 hover:bg-neutral-800 hover:text-white"
        >
          &larr; Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
