export type AssetCategory = "Dasar" | "Saham" | "Reksa Dana" | "Emas" | "Kripto";
export type DifficultyLevel = "Pemula" | "Menengah" | "Lanjutan";

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface EducationSource {
  label: string;
  url: string;
}

export interface EducationModule {
  id: string;
  moduleNumber: number;
  subTopic: string;
  plainTitle: string;
  title: string;
  category: AssetCategory;
  level: DifficultyLevel;
  readTime: string;
  riskRating: "Rendah" | "Sedang" | "Tinggi" | "Sangat Tinggi";
  summary: string;
  keyTakeaways: string[];
  sections: {
    heading: string;
    body: string;
  }[];
  caseStudy: {
    title: string;
    scenario: string;
    calculation: string[];
    conclusion: string;
  };
  redFlags: string[];
  actionChecklist: string[];
  quiz: QuizQuestion;
  quizzes: QuizQuestion[];
  lastReviewed?: string;
  sources?: EducationSource[];
}

export const ASSET_OVERVIEW: Record<
  AssetCategory,
  {
    tagline: string;
    expectedReturn: string;
    riskProfile: string;
    horizon: string;
    liquidity: string;
    color: string;
  }
> = {
  Dasar: {
    tagline: "Fondasi keuangan pribadi: tujuan keuangan, dana darurat, inflasi, dan cara terhindar dari jebakan investasi bodong.",
    expectedReturn: "Fondasi Wajib",
    riskProfile: "Rendah",
    horizon: "Sebelum Investasi",
    liquidity: "Sangat Tinggi",
    color: "slate",
  },
  "Reksa Dana": {
    tagline: "Dikelola profesional oleh Manajer Investasi, cocok untuk diversifikasi otomatis.",
    expectedReturn: "4% - 12% / tahun",
    riskProfile: "Rendah - Sedang",
    horizon: "< 1 - 5 Tahun",
    liquidity: "Tinggi (T+1 s/d T+3)",
    color: "emerald",
  },
  Emas: {
    tagline: "Aset safe-haven pelindung nilai kekayaan terhadap inflasi dan krisis geopolitik.",
    expectedReturn: "6% - 10% / tahun",
    riskProfile: "Rendah - Sedang",
    horizon: "> 3 - 5 Tahun",
    liquidity: "Tinggi",
    color: "amber",
  },
  Saham: {
    tagline: "Kepemilikan bisnis nyata dengan potensi capital gain dan dividen jangka panjang.",
    expectedReturn: "10% - 18% / tahun",
    riskProfile: "Tinggi",
    horizon: "> 3 - 10 Tahun",
    liquidity: "Tinggi (Jam Bursa)",
    color: "sky",
  },
  Kripto: {
    tagline: "Aset digital terdesentralisasi berisiko tinggi dengan siklus volatilitas agresif.",
    expectedReturn: "Fluktuatif Tinggi",
    riskProfile: "Sangat Tinggi",
    horizon: "> 4 Tahun (Siklus)",
    liquidity: "Sangat Tinggi (24/7)",
    color: "purple",
  },
};

// TODO(owner): verifikasi draf 3 modul fondasi ("Dasar"), seluruh plainTitle, dan sumber rujukan sebelum dipublikasikan. Jangan isi lastReviewed sebelum ditinjau pemilik.
const PROPOSED_SOURCES_DASAR: EducationSource[] = [
  {
    label: "Sikapi Uangmu (ojk.go.id) — TODO(owner): verifikasi",
    url: "https://sikapiuangmu.ojk.go.id",
  },
];

const PROPOSED_SOURCES_REKSADANA: EducationSource[] = [
  {
    label: "Otoritas Jasa Keuangan (ojk.go.id) — TODO(owner): verifikasi",
    url: "https://www.ojk.go.id",
  },
  {
    label: "DJPPR Kemenkeu RI (djppr.kemenkeu.go.id) — TODO(owner): verifikasi",
    url: "https://www.djppr.kemenkeu.go.id",
  },
];

const PROPOSED_SOURCES_EMAS: EducationSource[] = [
  {
    label: "Otoritas Jasa Keuangan (ojk.go.id) — TODO(owner): verifikasi",
    url: "https://www.ojk.go.id",
  },
];

const PROPOSED_SOURCES_SAHAM: EducationSource[] = [
  {
    label: "Bursa Efek Indonesia (idx.co.id) — TODO(owner): verifikasi",
    url: "https://www.idx.co.id",
  },
  {
    label: "Otoritas Jasa Keuangan (ojk.go.id) — TODO(owner): verifikasi",
    url: "https://www.ojk.go.id",
  },
];

const PROPOSED_SOURCES_KRIPTO: EducationSource[] = [
  {
    label: "Otoritas Jasa Keuangan (ojk.go.id) — TODO(owner): verifikasi",
    url: "https://www.ojk.go.id",
  },
];

export const EDUCATION_MODULES: EducationModule[] = [
  {
    id: "dasar-tujuan-dana-darurat",
    moduleNumber: 1,
    subTopic: "Tujuan Keuangan & Dana Darurat",
    plainTitle: "Menentukan tujuan uang dan menyiapkan dana darurat sebelum mulai investasi",
    title: "Menentukan Tujuan Keuangan dan Membangun Dana Darurat Sebelum Berinvestasi",
    category: "Dasar",
    level: "Pemula",
    readTime: "8 menit",
    riskRating: "Rendah",
    sources: PROPOSED_SOURCES_DASAR,
    summary:
      "Sebelum membeli instrumen investasi apa pun, tentukan untuk apa uang Anda dikumpulkan dan amankan dana darurat 3–6 kali pengeluaran bulanan agar Anda tidak terpaksa menjual investasi saat sedang rugi.",
    keyTakeaways: [
      "Uang untuk kebutuhan hidup sehari-hari dan dana darurat wajib dipisahkan dari uang dingin yang siap diinvestasikan.",
      "Dana darurat umumnya ditargetkan sebesar 3 hingga 6 kali pengeluaran rutin bulanan, disimpan di tempat yang mudah dicairkan kapan saja.",
      "Tujuan keuangan yang jelas memiliki tiga komponen: untuk apa uang dipakai, berapa jumlahnya, dan kapan uang tersebut dibutuhkan.",
      "Tanpa dana darurat, keadaan mendadak seperti sakit atau kehilangan pekerjaan dapat memaksa Anda mencairkan investasi di saat harga sedang turun.",
    ],
    sections: [
      {
        heading: "1. Bedakan uang harian, dana darurat, dan uang dingin",
        body:
          "Kesalahan paling sering bagi pemula adalah langsung memasukkan sisa gaji ke instrumen yang nilainya bisa naik-turun tanpa menyisakan cadangan kas. Bagi uang Anda menjadi tiga pos sederhana: pos kebutuhan harian untuk makan, tagihan, dan transportasi bulan ini; pos dana darurat untuk kejadian tak terduga; serta pos uang dingin yang benar-benar tidak akan terpakai dalam waktu dekat. Hanya uang dingin yang boleh masuk ke aset yang nilainya bisa berfluktuasi.",
      },
      {
        heading: "2. Berapa besar dana darurat yang sehat?",
        body:
          "Sebagai patokan umum perencanaan keuangan pribadi, mulailah dari 3 kali pengeluaran wajib bulanan jika Anda belum memiliki tanggungan, atau 6 kali pengeluaran wajib bulanan jika sudah memiliki tanggungan maupun penghasilan yang tidak tetap. Hitung dari pengeluaran wajib (makan, tempat tinggal, listrik, kesehatan, transportasi), bukan dari total gaya hidup. Jika angka 3–6 bulan terasa berat, bangun bertahap mulai dari 1 bulan pengeluaran terlebih dahulu.",
      },
      {
        heading: "3. Di mana menyimpan dana darurat?",
        body:
          "Syarat utama dana darurat bukanlah imbal hasil tinggi, melainkan keamanan nilai pokok dan kemudahan dicairkan saat dibutuhkan mendadak. Simpan bagian paling cepat dipakai di rekening tabungan terpisah tanpa kartu belanja harian, dan sebagian lainnya dapat ditempatkan di deposito atau Reksa Dana Pasar Uang (RDPU) dengan memperhatikan waktu pencairan (umumnya 1–2 hari kerja bursa).",
      },
      {
        heading: "4. Menulis tujuan keuangan secara spesifik",
        body:
          "Jangan sekadar berkata 'ingin punya tabungan banyak'. Ubah menjadi kalimat terukur: tujuan apa, berapa rupiah, dan berapa tahun lagi dipakai. Tujuan di bawah 2 tahun (misalnya biaya kursus atau uang muka dekat) membutuhkan instrumen yang stabil, sedangkan tujuan di atas 5 tahun memiliki ruang waktu lebih panjang untuk menghadapi naik-turunnya pasar.",
      },
    ],
    caseStudy: {
      title: "Menghitung target dana darurat bertahap",
      scenario:
        "Rani memiliki penghasilan Rp6.000.000 per bulan dengan pengeluaran wajib (kos, makan, transportasi, kuota, dan tagihan) Rp3.500.000 per bulan. Saat ini tabungannya baru Rp2.000.000 dan ia mampu menyisihkan Rp1.000.000 setiap bulan (angka ilustrasi).",
      calculation: [
        "Target dana darurat minimal (3x pengeluaran wajib) = 3 x Rp3.500.000 = Rp10.500.000",
        "Kekurangan dana darurat = Rp10.500.000 - Rp2.000.000 = Rp8.500.000",
        "Waktu mengumpulkan dengan setoran Rp1.000.000/bulan = Rp8.500.000 / Rp1.000.000 = sekitar 8,5 bulan",
        "Selama masa ini, Rani memfokuskan setoran ke tabungan terpisah dan instrumen pasar uang, belum membeli saham atau kripto.",
      ],
      conclusion:
        "Dengan menyelesaikan fondasi Rp10.500.000 terlebih dahulu, Rani memiliki sabuk pengaman selama 3 bulan biaya hidup sebelum mulai berinvestasi di instrumen yang lebih berfluktuasi.",
    },
    redFlags: [
      "Menempatkan seluruh dana darurat di saham atau aset kripto yang nilainya bisa turun tajam tepat saat uang dibutuhkan.",
      "Menggabungkan rekening dana darurat dengan rekening belanja harian sehingga saldo terpakai tanpa sadar.",
      "Meminjam uang atau memakai paylater hanya demi ikut membeli investasi yang sedang ramai dibicarakan.",
    ],
    actionChecklist: [
      "Catat pengeluaran wajib bulanan Anda selama satu bulan penuh untuk mengetahui angka biaya hidup inti.",
      "Hitung target dana darurat 3–6 kali pengeluaran wajib dan buka satu rekening atau kantong terpisah khusus dana darurat.",
      "Tulis minimal satu tujuan keuangan lengkap dengan nominal rupiah dan kapan uang tersebut akan digunakan.",
    ],
    quiz: {
      question: "Mengapa dana darurat sebaiknya tidak ditempatkan di instrumen berisiko tinggi seperti saham atau kripto?",
      options: [
        "Karena dana darurat harus bisa dipakai sewaktu-waktu tanpa risiko nilai pokok sedang turun tajam",
        "Karena saham dan kripto dilarang untuk pemula",
        "Karena tabungan bank selalu memberi keuntungan paling tinggi",
        "Karena dana darurat wajib dihabiskan setiap akhir tahun",
      ],
      correctIndex: 0,
      explanation:
        "Fungsi dana darurat adalah perlindungan likuiditas saat kondisi darurat. Jika ditaruh di aset yang sangat berfluktuasi, nilainya bisa sedang turun ketika Anda terpaksa mencairkannya.",
    },
    quizzes: [
      {
        question: "Jika pengeluaran wajib bulanan seseorang adalah Rp4.000.000, berapa kisaran target dana darurat 3 sampai 6 bulan?",
        options: [
          "Rp400.000 sampai Rp800.000",
          "Rp4.000.000 saja",
          "Rp12.000.000 sampai Rp24.000.000",
          "Rp100.000.000",
        ],
        correctIndex: 2,
        explanation: "3 x Rp4.000.000 = Rp12.000.000 dan 6 x Rp4.000.000 = Rp24.000.000.",
      },
      {
        question: "Urutan prioritas keuangan yang paling sehat sebelum membeli aset berisiko tinggi adalah?",
        options: [
          "Penuhi kebutuhan pokok, bangun dana darurat, baru investasikan uang dingin sesuai tujuan",
          "Beli aset berisiko tinggi dulu, dana darurat belakangan dari hasil keuntungan",
          "Gunakan seluruh gaji untuk investasi dan gunakan pinjaman untuk biaya makan",
          "Simpan semua uang di satu aset yang menjanjikan untung cepat",
        ],
        correctIndex: 0,
        explanation: "Fondasi arus kas harian dan dana darurat melindungi Anda agar tidak terpaksa membongkar investasi di waktu yang buruk.",
      },
      {
        question: "Manakah contoh tujuan keuangan yang paling jelas dan terukur?",
        options: [
          "Ingin cepat kaya tahun depan",
          "Mengumpulkan Rp18.000.000 dalam 18 bulan untuk biaya pendidikan lanjutan",
          "Membeli aset apa saja yang sedang viral",
          "Menabung kalau ada sisa di akhir bulan",
        ],
        correctIndex: 1,
        explanation: "Tujuan yang terukur menyebut kegunaan uang, target nominal rupiah, dan jangka waktu pencapaiannya.",
      },
    ],
  },
  {
    id: "dasar-inflasi-bunga-majemuk",
    moduleNumber: 2,
    subTopic: "Inflasi & Efek Bunga Berbunga",
    plainTitle: "Mengapa nilai uang turun karena inflasi dan manfaat menabung rutin sejak dini",
    title: "Mengapa Uang Diam Kalah oleh Inflasi dan Bagaimana Waktu Membantu Investasi Rutin",
    category: "Dasar",
    level: "Pemula",
    readTime: "9 menit",
    riskRating: "Rendah",
    sources: PROPOSED_SOURCES_DASAR,
    summary:
      "Jumlah uang di rekening boleh tetap sama, tetapi barang yang bisa dibeli makin sedikit karena kenaikan harga (inflasi). Pahami cara menjaga daya beli dan bagaimana menabung/investasi rutin bekerja lewat efek waktu.",
    keyTakeaways: [
      "Inflasi adalah kenaikan harga barang dan jasa secara umum dari waktu ke waktu yang membuat daya beli uang menurun.",
      "Tujuan pertama berinvestasi bukanlah menjadi kaya mendadak, melainkan menjaga agar daya beli tabungan tidak tergerus kenaikan harga.",
      "Efek bunga berbunga (compounding) terjadi ketika hasil investasi ikut menghasilkan hasil tambahan pada periode berikutnya.",
      "Konsistensi menyisihkan uang secara rutin dalam waktu panjang jauh lebih menentukan daripada menebak waktu terbaik masuk pasar.",
    ],
    sections: [
      {
        heading: "1. Apa itu inflasi dalam kehidupan sehari-hari?",
        body:
          "Bayangkan seporsi makanan atau biaya sekolah sepuluh tahun lalu dibandingkan dengan hari ini. Dengan lembar uang Rp50.000 yang sama, jumlah barang yang bisa Anda bawa pulang cenderung berkurang. Itulah inflasi: menurunnya daya beli uang karena harga barang dan jasa naik dari tahun ke tahun.",
      },
      {
        heading: "2. Mengapa menabung di celengan saja tidak cukup untuk jangka panjang?",
        body:
          "Menyimpan uang tunai penting untuk transaksi harian dan dana darurat. Namun untuk tujuan 5–10 tahun ke depan, uang yang diam tanpa imbal hasil atau dengan bunga di bawah laju kenaikan harga barang akan kehilangan sebagian daya belinya. Berinvestasi membantu uang Anda bertumbuh setidaknya mengimbangi kenaikan harga tersebut.",
      },
      {
        heading: "3. Cara kerja efek gulungan waktu (bunga berbunga)",
        body:
          "Ketika investasi menghasilkan imbal hasil dan hasil tersebut tidak langsung diambil, maka pada tahun berikutnya modal awal beserta hasil tadi sama-sama bekerja menghasilkan imbal hasil baru. Dalam jangka pendek efeknya terlihat kecil, tetapi setelah bertahun-tahun kurvanya makin terasa karena Anda tidak hanya mengandalkan setoran pokok semata.",
      },
      {
        heading: "4. Disiplin rutin mengalahkan spekulasi sesaat",
        body:
          "Banyak pemula menunda mulai karena merasa modalnya baru Rp100.000 atau Rp500.000 per bulan. Padahal kebiasaan menyisihkan uang secara rutin sejak dini memberi waktu lebih panjang bagi portofolio untuk berkembang, sekaligus melatih disiplin anggaran tanpa harus menebak naik-turunnya harga harian.",
      },
    ],
    caseStudy: {
      title: "Perbandingan uang diam vs investasi rutin ilustratif",
      scenario:
        "Budi membutuhkan dana untuk tujuan 5 tahun lagi. Ia menyisihkan Rp500.000 per bulan selama 60 bulan. Sebagai ilustrasi semata (bukan jaminan hasil), kita bandingkan uang yang disimpan tanpa imbal hasil dengan simulasi imbal hasil bersih rata-rata 5% per tahun.",
      calculation: [
        "Total modal pokok yang disetor selama 60 bulan = 60 x Rp500.000 = Rp30.000.000",
        "Jika disimpan tanpa imbal hasil, nominal tetap Rp30.000.000 sementara harga barang dalam 5 tahun cenderung naik",
        "Dengan simulasi hasil rata-rata 5% per tahun yang diinvestasikan kembali, nilai akhir ilustratif menjadi sekitar Rp34.000.000",
        "Selisih sekitar Rp4.000.000 berasal dari akumulasi hasil yang ikut bertumbuh sepanjang 5 tahun.",
      ],
      conclusion:
        "Waktu dan kedisiplinan setoran bulanan membantu menjaga daya beli modal Budi tanpa perlu mengambil risiko spekulatif yang berlebihan.",
    },
    redFlags: [
      "Berharap efek bunga berbunga membuat modal berlipat ganda hanya dalam hitungan minggu.",
      "Tergiur janji imbal hasil tetap tinggi setiap bulan yang jauh di atas kewajaran instrumen resmi.",
      "Berhenti menyisihkan uang hanya karena hasil tahun pertama terlihat masih kecil.",
    ],
    actionChecklist: [
      "Sisihkan porsi tabungan atau investasi di awal saat menerima penghasilan, bukan menunggu sisa akhir bulan.",
      "Gunakan simulasi investasi rutin di halaman beranda untuk melihat hubungan antara setoran bulanan, waktu, dan imbal hasil realistis.",
      "Sesuaikan target imbal hasil dengan jangka waktu tujuan dan ketenangan tidur Anda.",
    ],
    quiz: {
      question: "Apa dampak inflasi terhadap uang tunai yang disimpan diam dalam jangka panjang?",
      options: [
        "Jumlah lembar uangnya berkurang sendiri",
        "Daya beli uang tersebut menurun karena harga barang dan jasa cenderung naik",
        "Nilai uang otomatis naik dua kali lipat",
        "Uang tidak bisa lagi digunakan untuk berbelanja",
      ],
      correctIndex: 1,
      explanation:
        "Nominal uangnya tetap sama, tetapi jumlah barang atau jasa yang dapat dibeli dengan nominal tersebut berkurang ketika harga-harga naik.",
    },
    quizzes: [
      {
        question: "Apa yang dimaksud dengan efek bunga berbunga (compounding) dalam investasi?",
        options: [
          "Hasil investasi yang diinvestasikan kembali sehingga ikut menghasilkan imbal hasil pada periode berikutnya",
          "Pinjaman yang bunganya naik setiap hari",
          "Jaminan bahwa investasi tidak pernah rugi",
          "Biaya admin yang dipotong dua kali",
        ],
        correctIndex: 0,
        explanation: "Compounding bekerja ketika hasil yang diperoleh tidak ditarik, melainkan menambah modal yang produktif pada periode selanjutnya.",
      },
      {
        question: "Faktor apa yang paling membantu efek bunga berbunga bekerja secara sehat bagi pemula?",
        options: [
          "Konsistensi setoran rutin dan jangka waktu yang panjang",
          "Sering berganti instrumen setiap hari",
          "Memakai uang pinjaman berbunga tinggi",
          "Menunggu sampai punya modal ratusan juta rupiah baru mulai",
        ],
        correctIndex: 0,
        explanation: "Efek akumulasi membutuhkan waktu dan kedisiplinan setoran rutin, bukan transaksi impulsif jangka pendek.",
      },
      {
        question: "Jika harga barang naik rata-rata 4% setahun sedangkan uang disimpan tanpa imbal hasil (0%), maka secara daya beli?",
        options: [
          "Kemampuan beli uang tersebut menyusut dibandingkan harga barang",
          "Daya beli uang meningkat 4%",
          "Tidak ada perubahan daya beli sama sekali",
          "Harga barang otomatis turun kembali",
        ],
        correctIndex: 0,
        explanation: "Ketika imbal hasil simpanan lebih rendah dari kenaikan harga barang, daya beli riil uang tersebut menurun.",
      },
    ],
  },
  {
    id: "dasar-waspada-bodong-pinjol",
    moduleNumber: 3,
    subTopic: "Keamanan & Perlindungan Konsumen",
    plainTitle: "Cara mengenali investasi bodong, pinjol ilegal, dan bahaya berutang demi investasi",
    title: "Mengenali Ciri Investasi Bodong, Pinjol Ilegal, dan Bahaya Utang Konsumtif",
    category: "Dasar",
    level: "Pemula",
    readTime: "9 menit",
    riskRating: "Rendah",
    sources: PROPOSED_SOURCES_DASAR,
    summary:
      "Keuntungan terbaik adalah uang yang tidak hilang karena penipuan. Kenali pola janji untung pasti (ponzi), bahaya berinvestasi dengan uang pinjaman, serta langkah memeriksa izin resmi sebelum mentransfer uang.",
    keyTakeaways: [
      "Prinsip dasar: setiap penawaran yang menjanjikan keuntungan tinggi, tetap, dan 'pasti tanpa risiko' patut dicurigai sebagai penipuan.",
      "Jangan pernah berinvestasi menggunakan uang pinjaman online (pinjol), paylater, atau utang konsumtif karena bunga utang bersifat pasti sedangkan hasil investasi tidak pasti.",
      "Selalu periksa status izin perusahaan dan produk melalui kanal resmi regulator (seperti OJK) sebelum menyetor dana — TODO(owner): verifikasi kontak kanal resmi OJK terkini.",
      "Jangan pernah mentransfer dana investasi ke rekening pribadi perorangan, meskipun mengaku sebagai agen atau pengurus komunitas.",
    ],
    sections: [
      {
        heading: "1. Anatomi investasi bodong dan skema ponzi",
        body:
          "Penipuan berkedok investasi hampir selalu menjual mimpi yang sama: imbal hasil besar dalam waktu singkat, diklaim bebas risiko, dan sering memberi bonus jika Anda mengajak anggota baru. Pada skema ponzi, uang yang dibayarkan kepada anggota lama sebenarnya berasal dari setoran anggota baru, bukan dari kegiatan usaha atau instrumen pasar yang nyata. Begitu aliran anggota baru melambat, skema tersebut runtuh dan dana nasabah hilang.",
      },
      {
        heading: "2. Ciri-ciri penawaran yang wajib langsung ditolak",
        body:
          "Waspadai lima tanda bahaya utama: (1) menjanjikan persentase keuntungan tetap harian atau bulanan tanpa kemungkinan rugi, (2) mendesak Anda segera transfer hari ini dengan alasan kuota terbatas, (3) meminta Anda mengirim uang ke rekening atas nama pribadi, (4) mencatut logo lembaga resmi atau tokoh publik tanpa bukti izin yang dapat diverifikasi mandiri, dan (5) meminta kode OTP, PIN, atau kata sandi akun Anda.",
      },
      {
        heading: "3. Mengapa utang konsumtif dan pinjol merusak masa depan keuangan",
        body:
          "Pinjaman online ilegal dan utang konsumtif berbunga tinggi dapat menyedot penghasilan bulanan lewat bunga serta denda yang menumpuk, ditambah risiko penyalahgunaan data pribadi. Bahkan pada pinjaman berizin sekalipun, meminjam uang untuk membeli saham atau kripto sangat berbahaya: ketika harga pasar turun, nilai aset menyusut sementara cicilan pokok dan bunga utang tetap wajib dibayar penuh.",
      },
      {
        heading: "4. Kebiasaan verifikasi 2L: Legal dan Logis",
        body:
          "Sebelum menaruh uang di aplikasi atau penawaran apa pun, terapkan uji dua langkah sederhana: Legal dan Logis. Legal berarti penyelenggara dan produknya benar-benar terdaftar serta diawasi otoritas berwenang di Indonesia (periksa langsung pada situs/kanal resmi regulator, bukan dari brosur penjual). Logis berarti cara menghasilkan keuntungannya masuk akal dan risikonya dijelaskan secara terbuka.",
      },
    ],
    caseStudy: {
      title: "Menghitung jebakan investasi memakai uang pinjaman",
      scenario:
        "Doni tergoda grup pesan instan yang memamerkan keuntungan cepat. Ia meminjam Rp5.000.000 dengan total beban bunga dan biaya 6% per bulan, lalu membelikan aset spekulatif yang ternyata turun 20% pada bulan pertama (angka ilustrasi).",
      calculation: [
        "Kewajiban pokok + biaya pinjaman bulan pertama = Rp5.000.000 + (Rp5.000.000 x 6%) = Rp5.300.000",
        "Nilai aset setelah turun 20% = Rp5.000.000 x 80% = Rp4.000.000",
        "Selisih lubang kas jika aset dijual untuk menutup utang = Rp5.300.000 - Rp4.000.000 = tekor Rp1.300.000 hanya dalam 1 bulan",
        "Bunga pinjaman berjalan pasti, sedangkan harga aset pasar tidak pernah menjamin keuntungan bulanan.",
      ],
      conclusion:
        "Berinvestasi dengan uang pinjaman melipatgandakan tekanan finansial dan psikologis. Gunakan hanya uang dingin setelah utang berbunga tinggi dilunasi.",
    },
    redFlags: [
      "Klaim 'pasti untung X% per bulan, modal dijamin 100% kembali tanpa risiko'.",
      "Permintaan transfer dana investasi ke rekening bank pribadi atau dompet pribadi admin grup.",
      "Tawaran titip dana (titip trading) di media sosial atau grup chat yang meminta biaya tebusan saat ingin mencairkan uang.",
      "Mengambil pinjaman online atau gesek tunai kartu kredit untuk modal membeli aset investasi.",
    ],
    actionChecklist: [
      "Terapkan prinsip 2L (Legal dan Logis) setiap kali menerima tawaran investasi dari teman, keluarga, maupun media sosial.",
      "Lunasi utang konsumtif berbunga tinggi sebelum mulai mengalokasikan dana ke instrumen berisiko.",
      "Aktifkan autentikasi dua langkah (2FA) dan jangan pernah membagikan kode OTP atau password kepada siapa pun.",
    ],
    quiz: {
      question: "Manakah tanda paling jelas bahwa sebuah tawaran investasi patut dicurigai sebagai investasi bodong?",
      options: [
        "Menjelaskan bahwa nilai investasi bisa naik maupun turun sesuai kondisi pasar",
        "Menjanjikan keuntungan tetap tinggi setiap bulan tanpa risiko rugi dan meminta transfer ke rekening pribadi",
        "Menyediakan dokumen prospektus dan laporan berkala resmi",
        "Mencantumkan biaya transaksi secara transparan",
      ],
      correctIndex: 1,
      explanation:
        "Di pasar keuangan yang sehat, imbal hasil tinggi selalu disertai risiko. Janji untung tinggi yang pasti tanpa risiko dan transfer ke rekening pribadi adalah ciri klasik penipuan.",
    },
    quizzes: [
      {
        question: "Apa arti prinsip 2L sebelum memilih produk keuangan atau investasi?",
        options: [
          "Langsung dan Lunas",
          "Legal (terdaftar/berizin di otoritas resmi) dan Logis (imbal hasil serta risikonya masuk akal)",
          "Cepat Laku dan Lipat Ganda",
          "Tanpa Limit dan Tanpa Laporan",
        ],
        correctIndex: 1,
        explanation: "Pastikan izin penyelenggara dapat diverifikasi pada kanal resmi regulator (Legal) dan janji imbal hasilnya masuk akal (Logis).",
      },
      {
        question: "Mengapa berinvestasi menggunakan uang pinjaman online (pinjol) sangat berbahaya?",
        options: [
          "Karena bunga dan cicilan utang bersifat pasti sedangkan hasil investasi bisa turun atau rugi",
          "Karena aplikasi investasi tidak menerima transfer dari bank",
          "Karena pinjaman membuat harga saham otomatis naik",
          "Karena tidak ada biaya bunga pada pinjaman",
        ],
        correctIndex: 0,
        explanation: "Saat nilai investasi turun, Anda mengalami kerugian ganda: nilai modal menyusut sementara tagihan pokok dan bunga pinjaman tetap harus dibayar.",
      },
      {
        question: "Jika seseorang di grup chat menawarkan 'titip dana pasti untung 20% seminggu', langkah paling tepat adalah?",
        options: [
          "Mencoba kirim Rp500.000 dulu",
          "Menolak, tidak mentransfer uang, dan memeriksa informasi resmi dari regulator",
          "Meminjam uang teman agar untungnya lebih besar",
          "Memberikan KTP dan kode OTP untuk pendaftaran",
        ],
        correctIndex: 1,
        explanation: "Jangan pernah mencoba-coba mengirim uang ke skema titip dana yang menjanjikan keuntungan tidak logis, berapapun nominalnya.",
      },
    ],
  },
  {
    id: "reksadana-dasar",
    moduleNumber: 4,
    subTopic: "Dasar & Pajak",
    plainTitle: "Mengenal apa itu reksa dana, jenis-jenisnya, dan mengapa hasilnya tidak dipotong pajak lagi",
    title: "Mengenal 4 Jenis Reksa Dana, NAB/UP, Kustodian KSEI & Keunggulan Bebas Pajak",
    category: "Reksa Dana",
    level: "Pemula",
    readTime: "10 menit",
    riskRating: "Rendah",
    sources: PROPOSED_SOURCES_REKSADANA,
    summary:
      "Bangun fondasi sebelum membeli: pahami empat jenis Reksa Dana, bagaimana NAB/UP bergerak, peran Manajer Investasi dan Bank Kustodian, serta perlakuan pajaknya bagi investor Indonesia.",
    keyTakeaways: [
      "RDPU umumnya cocok untuk kebutuhan di bawah satu tahun; RDPT, campuran, dan saham membutuhkan horizon yang makin panjang.",
      "Nilai investasi dihitung dari Unit Penyertaan x NAB/UP, bukan dari janji return tetap.",
      "Manajer Investasi mengelola portofolio, sedangkan Bank Kustodian mengadministrasikan dan menyimpan aset secara terpisah.",
      "Keuntungan dan pencairan Reksa Dana pada umumnya bukan objek PPh di tangan investor, tetapi kepemilikannya tetap dilaporkan di SPT.",
    ],
    sections: [
      {
        heading: "1. Reksa Dana adalah wadah, bukan deposito",
        body:
          "Reksa Dana menghimpun dana investor ke dalam Kontrak Investasi Kolektif yang dikelola Manajer Investasi berizin OJK. Nilai portofolionya berubah mengikuti deposito, obligasi, atau saham yang dibeli, sehingga tidak ada jaminan imbal hasil. Baca prospektus dan Fund Fact Sheet untuk melihat mandat investasi, batas risiko, biaya, serta tolok ukurnya.",
      },
      {
        heading: "2. Empat jenis dan kecocokan horizon",
        body:
          "RDPU berinvestasi pada instrumen pasar uang dan surat utang berjatuh tempo pendek, sehingga paling relevan untuk dana yang segera dipakai. RDPT berfokus pada obligasi dan dapat turun saat yield naik; Reksa Dana Campuran mengombinasikan aset; Reksa Dana Saham memiliki eksposur saham dominan dan membutuhkan horizon biasanya lebih dari lima tahun. Pilih berdasarkan tanggal kebutuhan uang, bukan berdasarkan return tertinggi bulan lalu.",
      },
      {
        heading: "3. Membaca NAB/UP dan peran Bank Kustodian",
        body:
          "Saat membeli, dana Anda dikonversi menjadi Unit Penyertaan berdasarkan NAB/UP pada tanggal transaksi sesuai cut-off platform. Contoh: Rp3 juta pada NAB/UP Rp1.500 menghasilkan sekitar 2.000 UP sebelum biaya bila ada. Bank Kustodian yang mendapat persetujuan OJK mengadministrasikan kekayaan Reksa Dana dan melakukan pengawasan administratif; mekanisme pemisahan ini berbeda dari menyimpan uang di rekening MI.",
      },
      {
        heading: "4. Pajak dan administrasi investor",
        body:
          "Menurut ketentuan PPh, penghasilan dari Reksa Dana bagi investor merupakan penghasilan bukan objek pajak; pajak atas aset di dalam portofolio telah diperlakukan pada tingkat instrumennya. Ini tidak berarti investasi tidak perlu dicatat: Unit Penyertaan tetap dicantumkan sebagai harta dan hasilnya sebagai penghasilan bukan objek pajak pada SPT Tahunan. Simpan bukti transaksi dan laporan kepemilikan dari platform atau Bank Kustodian.",
      },
    ],
    caseStudy: {
      title: "Dana pendidikan yang tidak boleh ikut berfluktuasi liar",
      scenario:
        "Nadia memiliki Rp12.000.000 yang akan dipakai membayar kursus dalam 10 bulan. Ia mempertimbangkan RDPU dengan NAB/UP Rp1.200 dan estimasi imbal hasil tahunan 4,5% sebagai ilustrasi, bukan janji return.",
      calculation: [
        "Unit Penyertaan awal = Rp12.000.000 / Rp1.200 = 10.000 UP",
        "Estimasi hasil 10 bulan = Rp12.000.000 x 4,5% x 10 / 12 = Rp450.000",
        "Nilai ilustratif sebelum perubahan NAB dan biaya = Rp12.000.000 + Rp450.000 = Rp12.450.000",
        "Jika kebutuhan pasti pada bulan ke-10, Nadia menempatkan dana di RDPU, bukan Reksa Dana Saham yang dapat turun saat uang dibutuhkan.",
      ],
      conclusion:
        "Kecocokan instrumen datang dari horizon dan kebutuhan likuiditas. Bahkan pada RDPU, cek waktu cut-off dan settlement pencairan agar uang tersedia sebelum jatuh tempo pembayaran.",
    },
    redFlags: [
      "Menganggap semua Reksa Dana aman seperti tabungan dan mengabaikan risiko NAB turun pada RDPT, campuran, atau saham.",
      "Memilih produk hanya karena return satu bulan atau satu tahun tanpa melihat mandat, benchmark, dan horizon pribadi.",
      "Mengirim dana ke rekening pribadi tenaga pemasaran, bukan melalui kanal resmi yang mencatat transaksi.",
    ],
    actionChecklist: [
      "Tulis tujuan, nominal, dan tanggal kebutuhan uang sebelum menyaring produk.",
      "Pastikan Manajer Investasi, produk, dan Bank Kustodian tercantum pada kanal resmi OJK atau platform berizin.",
      "Unduh prospektus, Fund Fact Sheet terbaru, serta simpan laporan kepemilikan untuk rekonsiliasi dan SPT.",
    ],
    quiz: {
      question: "Untuk kebutuhan biaya sekolah yang pasti dipakai delapan bulan lagi, pilihan paling selaras dengan tujuan likuiditas adalah?",
      options: ["Reksa Dana Saham", "Reksa Dana Pasar Uang", "Saham lapis tiga", "Kripto futures"],
      correctIndex: 1,
      explanation:
        "RDPU umumnya memiliki risiko dan fluktuasi lebih rendah untuk horizon pendek, walaupun waktu pencairan tetap perlu diperhitungkan.",
    },
    quizzes: [
      {
        question: "Jika investasi Rp6.000.000 masuk saat NAB/UP Rp1.500, berapa Unit Penyertaan yang diperoleh sebelum biaya?",
        options: ["400 UP", "4.000 UP", "6.000 UP", "9.000 UP"],
        correctIndex: 1,
        explanation: "Rp6.000.000 dibagi Rp1.500 menghasilkan 4.000 Unit Penyertaan.",
      },
      {
        question: "Pernyataan yang tepat tentang Bank Kustodian adalah?",
        options: [
          "Menjanjikan return bulanan kepada investor",
          "Mengadministrasikan aset Reksa Dana secara terpisah dari Manajer Investasi",
          "Menentukan harga saham di BEI",
          "Menggantikan kewajiban investor melaporkan harta di SPT",
        ],
        correctIndex: 1,
        explanation:
          "Bank Kustodian memiliki fungsi penyimpanan dan administrasi aset sesuai struktur Reksa Dana, bukan pemberi jaminan return atau pengganti administrasi pajak investor.",
      },
    ],
  },
  {
    id: "reksadana-seleksi",
    moduleNumber: 5,
    subTopic: "Analisis Fund Fact Sheet",
    plainTitle: "Cara membaca laporan bulanan reksa dana sebelum memilih produk",
    title: "Bedah Fund Fact Sheet: AUM, Expense Ratio, Max Drawdown & Sharpe Ratio",
    category: "Reksa Dana",
    level: "Menengah",
    readTime: "12 menit",
    riskRating: "Sedang",
    sources: PROPOSED_SOURCES_REKSADANA,
    summary:
      "Jangan menyaring Reksa Dana dari return saja. Bandingkan skala dana kelolaan, biaya, komposisi, drawdown, konsistensi terhadap benchmark, dan kompensasi return terhadap risiko.",
    keyTakeaways: [
      "AUM menunjukkan skala dana, tetapi bukan stempel kualitas; lihat pula konsentrasi aset dan arus dana keluar.",
      "Expense ratio menggerus hasil bersih, terutama bila dibandingkan pada produk dengan strategi serupa.",
      "Max drawdown memperlihatkan seberapa dalam penurunan historis dari puncak ke dasar, bukan batas kerugian masa depan.",
      "Sharpe ratio berguna saat membandingkan return relatif terhadap volatilitas dan aset bebas risiko yang digunakan dalam perhitungan.",
    ],
    sections: [
      {
        heading: "1. Mulai dari mandat, benchmark, dan komposisi",
        body:
          "Fund Fact Sheet bulanan menjelaskan ke mana uang ditempatkan, bukan sekadar grafik return. Bandingkan kategori produk dengan benchmark yang masuk akal: RD saham seharusnya dibandingkan dengan indeks saham relevan, bukan RDPU. Periksa sepuluh efek terbesar, proporsi kas, kualitas obligasi, dan apakah portofolio benar-benar sesuai mandat yang Anda beli.",
      },
      {
        heading: "2. AUM dan likuiditas bukan angka pajangan",
        body:
          "Dana kelolaan atau AUM yang memadai dapat membantu diversifikasi dan biaya operasional, tetapi AUM besar tetap bisa menghadapi redemption besar atau konsentrasi saham yang tinggi. AUM kecil tidak otomatis buruk, namun investor perlu memahami risiko skala, kesinambungan produk, dan kemampuan MI mengeksekusi transaksi. Lihat perubahan AUM beberapa periode, bukan satu angka di bulan ini.",
      },
      {
        heading: "3. Biaya dan return bersih investor",
        body:
          "Expense ratio mencakup biaya pengelolaan dan biaya operasional di tingkat Reksa Dana; dampaknya sudah tercermin dalam NAB, tetapi tetap perlu dibandingkan. Jangan menyamakan biaya pembelian, penjualan, switching, dan expense ratio karena mekanismenya berbeda. Produk dengan return bruto serupa dapat memberi hasil bersih yang berbeda jika biaya dan turnover portofolionya tidak sama.",
      },
      {
        heading: "4. Risiko: drawdown, volatilitas, dan Sharpe",
        body:
          "Max drawdown menjawab pertanyaan praktis: seberapa besar penurunan historis terburuk yang pernah perlu ditahan investor. Sharpe ratio mencoba menilai apakah tambahan return sepadan dengan volatilitas, tetapi hasilnya bergantung pada periode dan metode. Gunakan keduanya bersama profil risiko, bukan sebagai skor tunggal untuk memprediksi pemenang berikutnya.",
      },
    ],
    caseStudy: {
      title: "Memilih dua RD saham yang tampak sama bagus",
      scenario:
        "Dimas membandingkan Dana A dan Dana B untuk Rp20.000.000. Keduanya mencatat return bruto 14% dalam satu tahun, tetapi Dana A memiliki expense ratio 1,2%, max drawdown 18%, dan Sharpe 0,75; Dana B 2,4%, drawdown 29%, dan Sharpe 0,42.",
      calculation: [
        "Return bruto ilustratif = Rp20.000.000 x 14% = Rp2.800.000",
        "Beban indikatif Dana A = Rp20.000.000 x 1,2% = Rp240.000",
        "Beban indikatif Dana B = Rp20.000.000 x 2,4% = Rp480.000",
        "Selisih biaya indikatif = Rp480.000 - Rp240.000 = Rp240.000; Dana A juga memiliki drawdown historis lebih dangkal pada data contoh.",
      ],
      conclusion:
        "Dimas tidak otomatis membeli Dana A, tetapi punya alasan terukur untuk memeriksa benchmark, holding, dan konsistensi sebelum mengambil keputusan. Return masa lalu bukan jaminan return berikutnya.",
    },
    redFlags: [
      "Mengejar peringkat return jangka pendek tanpa membandingkan benchmark dan periode pasar yang ditempuh.",
      "Menganggap AUM paling besar selalu paling aman tanpa memeriksa konsentrasi, arus redemption, dan strategi.",
      "Membaca Sharpe ratio atau drawdown dari periode berbeda lalu menyimpulkan perbandingan yang tidak setara.",
    ],
    actionChecklist: [
      "Bandingkan minimal tiga Fund Fact Sheet pada kategori dan horizon yang sama.",
      "Catat benchmark, AUM, biaya, top holdings, max drawdown, dan kinerja tiga sampai lima tahun bila tersedia.",
      "Tanyakan apakah penurunan historis yang tercatat masih bisa Anda tahan tanpa menjual panik.",
    ],
    quiz: {
      question: "Metode paling tepat menggunakan max drawdown adalah?",
      options: [
        "Sebagai jaminan bahwa kerugian masa depan tidak melebihi angka itu",
        "Sebagai ukuran penurunan historis dari puncak ke titik terendah",
        "Sebagai biaya pembelian Reksa Dana",
        "Sebagai jumlah minimal investasi",
      ],
      correctIndex: 1,
      explanation:
        "Max drawdown adalah rekam jejak penurunan historis. Ia membantu mengukur toleransi risiko, tetapi bukan batas kerugian masa depan.",
    },
    quizzes: [
      {
        question: "Dua dana memberi return bruto sama. Dana mana yang ceteris paribus memberi biaya tahunan lebih rendah untuk modal Rp10 juta: expense ratio 1% atau 2,5%?",
        options: ["1%, karena beban indikatif Rp100.000", "2,5%, karena AUM lebih besar", "Keduanya sama", "Tidak bisa dibandingkan sama sekali"],
        correctIndex: 0,
        explanation: "Pada modal Rp10 juta, 1% setara ilustrasi Rp100.000 sedangkan 2,5% Rp250.000 per tahun.",
      },
      {
        question: "Mengapa benchmark perlu diperiksa sebelum memuji return 12% sebuah Reksa Dana?",
        options: [
          "Karena benchmark menunjukkan konteks apakah strategi mengungguli atau tertinggal dari pasar relevan",
          "Karena benchmark menjamin return tahun depan",
          "Karena benchmark menggantikan prospektus",
          "Karena semua Reksa Dana harus mengalahkan IHSG",
        ],
        correctIndex: 0,
        explanation: "Return bermakna ketika dibandingkan dengan risiko dan benchmark yang sesuai mandat, bukan angka tunggal yang berdiri sendiri.",
      },
    ],
  },
  {
    id: "reksadana-sbn-ritel",
    moduleNumber: 6,
    subTopic: "SBN Ritel (ORI/SR/SBR/ST)",
    plainTitle: "Mengenal surat utang negara (ORI, SR, SBR, ST) dan cara menghitung kupon bersihnya",
    title: "Panduan Lengkap SBN Ritel: ORI, SR, SBR, ST, Kupon Fixed vs Floating with Floor & Pajak 10%",
    category: "Reksa Dana",
    level: "Menengah",
    readTime: "13 menit",
    riskRating: "Rendah",
    sources: PROPOSED_SOURCES_REKSADANA,
    summary:
      "Pahami SBN Ritel sebagai instrumen pemerintah: perbedaan tradable dan non-tradable, kupon fixed atau floating with floor, risiko harga, fitur early redemption, serta pajak final kupon 10%.",
    keyTakeaways: [
      "ORI dan SR dapat diperdagangkan di pasar sekunder; SBR dan ST umumnya tidak, tetapi memiliki mekanisme early redemption sesuai ketentuan seri.",
      "Kupon fixed tetap sepanjang tenor, sedangkan floating with floor dapat berubah mengikuti acuan namun tidak turun melewati batas minimum.",
      "Pembayaran pokok dan kupon SBN pemerintah dijamin undang-undang, tetapi harga seri tradable di pasar sekunder tetap dapat naik atau turun.",
      "Kupon dan capital gain obligasi bagi investor domestik dikenai PPh final 10%, dipotong sesuai mekanisme penyelenggara.",
    ],
    sections: [
      {
        heading: "1. SBN Ritel adalah pinjaman kepada negara",
        body:
          "Saat membeli ORI, SR, SBR, atau ST, investor membiayai APBN dan menerima pembayaran kupon periodik sesuai memorandum informasi seri. SBN Ritel bukan Reksa Dana, tetapi sering menjadi pembanding RDPT karena sama-sama terkait pasar obligasi. Baca tanggal penawaran, settlement, tenor, minimum pembelian, dan jadwal pembayaran pada seri yang sedang ditawarkan.",
      },
      {
        heading: "2. ORI/SR versus SBR/ST",
        body:
          "ORI dan SR bersifat tradable, sehingga dapat dijual sebelum jatuh tempo di pasar sekunder dengan harga pasar yang bisa berbeda dari harga beli. SBR dan ST biasanya non-tradable, namun menawarkan fasilitas early redemption dengan porsi dan jendela waktu yang ditetapkan penerbit. Pilihan bukan soal mana lebih baik, melainkan apakah Anda membutuhkan fleksibilitas pasar sekunder atau kepastian mekanisme penebusan awal.",
      },
      {
        heading: "3. Fixed rate dan floating with floor",
        body:
          "Kupon fixed tidak berubah sampai jatuh tempo, sehingga investor dapat menghitung arus kas lebih mudah. Kupon floating with floor dievaluasi berkala mengikuti acuan yang disebutkan pada memorandum, tetapi memiliki floor sehingga tidak turun di bawah minimum seri. Jangan menganggap kupon floating pasti naik; arah BI Rate dan formula seri menentukan perubahan berikutnya.",
      },
      {
        heading: "4. Pajak, harga pasar, dan tujuan uang",
        body:
          "PPh final 10% atas kupon membuat investor menerima nilai bersih setelah pemotongan. Untuk ORI/SR, kebutuhan menjual sebelum jatuh tempo membawa risiko harga: ketika yield pasar naik, harga obligasi lama berkupon lebih rendah cenderung tertekan. Jika tujuan Anda membutuhkan nominal pasti pada tanggal tertentu, rencanakan tenor dan jangan mengandalkan penjualan pasar sekunder sebagai satu-satunya jalan keluar.",
      },
    ],
    caseStudy: {
      title: "Menghitung kupon bersih SBN Ritel",
      scenario:
        "Raka membeli SBN Ritel senilai Rp50.000.000 dengan kupon fixed 6,40% per tahun dan pembayaran bulanan. Angka ini hanya simulasi; seri aktual memiliki syarat masing-masing.",
      calculation: [
        "Kupon bruto setahun = Rp50.000.000 x 6,40% = Rp3.200.000",
        "Kupon bruto per bulan = Rp3.200.000 / 12 = Rp266.667",
        "PPh final 10% per bulan = Rp266.667 x 10% = sekitar Rp26.667",
        "Kupon bersih per bulan = sekitar Rp266.667 - Rp26.667 = Rp240.000",
      ],
      conclusion:
        "Raka dapat merencanakan arus kas kupon bersih, tetapi tetap perlu menyisihkan uang pokok sampai jatuh tempo dan memahami risiko harga bila memilih menjual ORI/SR lebih awal.",
    },
    redFlags: [
      "Menganggap ORI atau SR pasti bisa dijual kapan pun tepat di harga beli.",
      "Membeli tenor panjang dengan dana yang mungkin dibutuhkan sebelum tanggal jatuh tempo.",
      "Membandingkan kupon bruto SBN dengan bunga deposito bersih tanpa memasukkan pajak masing-masing instrumen.",
    ],
    actionChecklist: [
      "Baca memorandum informasi seri untuk tenor, kupon, tanggal bayar, dan fitur early redemption.",
      "Tentukan apakah Anda memerlukan instrumen tradable atau non-tradable sebelum masa penawaran berakhir.",
      "Hitung kupon bersih setelah pajak dan buat rencana reinvestasi atau penggunaan kuponnya.",
    ],
    quiz: {
      question: "Karakteristik yang paling membedakan SBR/ST dari ORI/SR adalah?",
      options: [
        "SBR/ST umumnya non-tradable dengan early redemption sesuai ketentuan seri",
        "SBR/ST tidak memiliki kupon",
        "ORI/SR tidak diterbitkan pemerintah",
        "ORI/SR bebas dari seluruh risiko harga dan pajak",
      ],
      correctIndex: 0,
      explanation:
        "SBR/ST umumnya tidak diperdagangkan di pasar sekunder, tetapi memiliki fasilitas early redemption yang diatur dalam seri. ORI/SR dapat diperdagangkan dan karenanya memiliki risiko harga pasar.",
    },
    quizzes: [
      {
        question: "Berapa kupon bersih setahun dari nominal Rp20 juta dan kupon 6% bila PPh final 10%?",
        options: ["Rp1.080.000", "Rp1.200.000", "Rp1.320.000", "Rp2.000.000"],
        correctIndex: 0,
        explanation: "Kupon bruto Rp1.200.000, pajak Rp120.000, sehingga kupon bersih Rp1.080.000.",
      },
      {
        question: "Apa arti floating with floor pada kupon SBN Ritel?",
        options: [
          "Kupon selalu lebih tinggi daripada inflasi",
          "Kupon dapat berubah mengikuti acuan, tetapi tidak melewati minimum seri",
          "Harga SBN selalu naik di pasar sekunder",
          "Pajak kupon menjadi nol",
        ],
        correctIndex: 1,
        explanation: "Floating with floor berarti kupon dapat dievaluasi mengikuti acuan, namun ada batas minimum yang disebutkan dalam ketentuan seri.",
      },
    ],
  },
  {
    id: "reksadana-obligasi-lanjutan",
    moduleNumber: 7,
    subTopic: "Strategi Ladder & Siklus Bunga",
    plainTitle: "Bagaimana naik-turunnya suku bunga bank sentral memengaruhi harga obligasi",
    title: "Strategi Durasi Obligasi, Yield Curve & Manuver Saat Suku Bunga BI/Fed Berbalik Arah (Pivot)",
    category: "Reksa Dana",
    level: "Lanjutan",
    readTime: "14 menit",
    riskRating: "Sedang",
    sources: PROPOSED_SOURCES_REKSADANA,
    summary:
      "Naik-turunnya suku bunga tidak berdampak sama pada semua obligasi. Pelajari durasi, yield curve, ladder, risiko kredit, dan mengapa pivot bank sentral dapat mengubah peluang sekaligus risiko RDPT.",
    keyTakeaways: [
      "Durasi mengukur sensitivitas harga obligasi terhadap perubahan yield; durasi lebih panjang umumnya lebih sensitif.",
      "Harga obligasi dan yield bergerak berlawanan arah, tetapi perubahan spread kredit dan likuiditas dapat mengganggu pola sederhana itu.",
      "Strategi ladder menyebar jatuh tempo agar sebagian dana dapat diinvestasikan kembali secara berkala.",
      "Pivot BI atau The Fed bukan sinyal beli otomatis: investor perlu melihat inflasi, kurva yield, kurs, dan kualitas penerbit.",
    ],
    sections: [
      {
        heading: "1. Durasi adalah sensitivitas, bukan tenor saja",
        body:
          "Tenor adalah waktu sampai jatuh tempo, sedangkan durasi memperkirakan kepekaan harga terhadap perubahan yield dengan mempertimbangkan arus kas kupon. Secara kasar, obligasi berdurasi 5 dapat turun sekitar 5% saat yield naik 1%, sebelum efek convexity dan perubahan spread. RDPT tidak memiliki jatuh tempo tunggal seperti satu obligasi karena manajer dapat membeli dan menjual portofolio.",
      },
      {
        heading: "2. Membaca yield curve dan risiko reinvestasi",
        body:
          "Yield curve menggambarkan yield untuk berbagai tenor. Kurva yang menanjak, datar, atau terbalik memberi informasi mengenai ekspektasi suku bunga dan pertumbuhan, bukan kepastian. Saat obligasi pendek jatuh tempo, investor menghadapi risiko reinvestasi jika kupon baru lebih rendah; saat memegang obligasi panjang, investor memikul sensitivitas harga yang lebih besar.",
      },
      {
        heading: "3. Ladder untuk mengurangi keputusan all-in",
        body:
          "Ladder membagi dana ke beberapa jatuh tempo atau eksposur durasi agar tidak seluruh modal terkunci pada satu titik suku bunga. Misalnya, sebagian jatuh tempo satu, dua, dan tiga tahun dapat diperbarui bergilir. Dalam Reksa Dana, Anda tidak menyusun obligasi satu per satu, tetapi dapat mengombinasikan RDPU, RDPT durasi berbeda, dan SBN sesuai kebutuhan likuiditas.",
      },
      {
        heading: "4. Saat bank sentral berputar arah",
        body:
          "Ketika pasar memperkirakan BI Rate atau Fed Funds Rate turun, obligasi berdurasi lebih panjang sering diuntungkan karena yield turun menaikkan harga. Namun inflasi yang kembali naik, rupiah melemah, atau spread kredit melebar dapat mengubah hasilnya. Tetap lihat fakta di Fund Fact Sheet: durasi, peringkat kredit, eksposur SBN versus korporasi, dan drawdown sebelumnya.",
      },
    ],
    caseStudy: {
      title: "Mengukur dampak sederhana kenaikan yield",
      scenario:
        "Portofolio obligasi ilustratif milik Sinta bernilai Rp80.000.000 dan memiliki durasi efektif 4,5. Yield pasar naik 0,75% setelah data inflasi lebih tinggi dari harapan.",
      calculation: [
        "Perkiraan perubahan harga = -durasi x perubahan yield",
        "= -4,5 x 0,75% = -3,375%",
        "Perkiraan perubahan nilai = Rp80.000.000 x -3,375% = sekitar -Rp2.700.000",
        "Nilai ilustratif setelah perubahan = sekitar Rp77.300.000, sebelum kupon, convexity, biaya, dan perubahan kredit.",
      ],
      conclusion:
        "Durasi membantu Sinta membayangkan skala risiko. Ia tidak menjual otomatis, melainkan membandingkan kerugian sementara tersebut dengan horizon, kebutuhan kas, dan tesis suku bunga awalnya.",
    },
    redFlags: [
      "Masuk seluruh dana ke RDPT berdurasi panjang hanya karena mendengar rumor pemangkasan bunga.",
      "Mengabaikan risiko kredit obligasi korporasi dan hanya memusatkan perhatian pada kupon tinggi.",
      "Menganggap durasi 4,5 menjamin harga pasti turun tepat 4,5% untuk setiap yield naik 1%.",
    ],
    actionChecklist: [
      "Baca durasi efektif, kualitas kredit, dan top holdings RDPT sebelum menambah eksposur.",
      "Pisahkan dana jangka pendek di RDPU atau kas dari dana yang siap menahan volatilitas obligasi.",
      "Evaluasi ulang alokasi saat tesis suku bunga berubah, bukan berdasarkan satu berita bank sentral.",
    ],
    quiz: {
      question: "Jika yield naik, hubungan paling umum dengan harga obligasi adalah?",
      options: ["Harga cenderung naik", "Harga cenderung turun", "Tidak ada hubungan", "Kupon masa lalu berubah"],
      correctIndex: 1,
      explanation: "Secara umum harga obligasi bergerak berlawanan arah dengan yield, walau hasil aktual dipengaruhi durasi, convexity, kredit, dan likuiditas.",
    },
    quizzes: [
      {
        question: "Portofolio berdurasi 3 secara kasar menghadapi perubahan harga berapa bila yield naik 0,5%?",
        options: ["Sekitar -1,5%", "Sekitar +1,5%", "Sekitar -3%", "Tidak berubah"],
        correctIndex: 0,
        explanation: "Pendekatan sederhana adalah -3 x 0,5% = -1,5%, sebelum faktor lain.",
      },
      {
        question: "Tujuan utama strategi ladder adalah?",
        options: [
          "Menebak satu tanggal paling tepat untuk membeli obligasi",
          "Menyebar jatuh tempo agar risiko reinvestasi dan penguncian satu titik suku bunga berkurang",
          "Menghilangkan seluruh risiko kredit",
          "Membuat kupon bebas pajak",
        ],
        correctIndex: 1,
        explanation: "Ladder membantu menyebar waktu jatuh tempo dan keputusan reinvestasi, bukan menghapus semua risiko obligasi.",
      },
    ],
  },
  {
    id: "emas-safe-haven",
    moduleNumber: 8,
    subTopic: "Safe Haven & Inflasi",
    plainTitle: "Mengapa emas dipakai untuk menjaga daya beli jangka panjang",
    title: "Emas sebagai Safe Haven: Pelindung Daya Beli Terhadap Inflasi & Krisis Geopolitik",
    category: "Emas",
    level: "Pemula",
    readTime: "10 menit",
    riskRating: "Rendah",
    sources: PROPOSED_SOURCES_EMAS,
    summary:
      "Emas dapat berperan sebagai diversifier dan cadangan nilai, tetapi bukan mesin return tetap. Kenali hubungannya dengan inflasi, ketidakpastian geopolitik, suku bunga riil, dan spread harga.",
    keyTakeaways: [
      "Emas tidak menghasilkan kupon atau dividen; return datang dari perubahan harga dan dipengaruhi biaya serta spread.",
      "Harga emas dapat menolong diversifikasi saat ketidakpastian meningkat, tetapi tidak selalu naik setiap kali inflasi naik.",
      "Suku bunga riil, dolar AS, permintaan global, dan kurs rupiah ikut memengaruhi harga emas domestik.",
      "Horizon beberapa tahun lebih masuk akal daripada trading sangat pendek karena spread beli-buyback dapat lebar.",
    ],
    sections: [
      {
        heading: "1. Safe haven tidak sama dengan bebas risiko",
        body:
          "Emas sering dicari ketika investor khawatir terhadap perang, inflasi, atau tekanan sistem keuangan karena tidak bergantung pada arus kas satu perusahaan. Namun harga emas tetap berfluktuasi dan dapat turun tajam pada periode tertentu. Perannya lebih tepat sebagai salah satu penyeimbang portofolio, bukan pengganti dana darurat atau seluruh investasi produktif.",
      },
      {
        heading: "2. Daya beli dan inflasi berjalan dalam horizon panjang",
        body:
          "Kenaikan harga kebutuhan sehari-hari tidak otomatis membuat emas naik pada bulan yang sama. Dalam jangka lebih panjang, emas sering dipertimbangkan untuk menjaga daya beli ketika mata uang dan kebijakan moneter tertekan, tetapi jalurnya tidak lurus. Investor perlu membedakan antara lindung nilai jangka panjang dan klaim bahwa emas selalu mengalahkan inflasi setiap tahun.",
      },
      {
        heading: "3. Faktor global bertemu kurs rupiah",
        body:
          "Harga emas lokal dipengaruhi harga XAU/USD internasional, USD/IDR, premi produk, serta kondisi permintaan domestik. Saat harga emas dunia datar tetapi rupiah melemah, harga gram dalam rupiah masih dapat meningkat. Karena itu, baca harga beli dan buyback dari penyedia yang sama pada tanggal yang sama sebelum membuat keputusan.",
      },
      {
        heading: "4. Tempatkan emas sesuai fungsi portofolio",
        body:
          "Alokasi emas yang moderat dapat membantu diversifikasi, terutama bila portofolio terlalu bergantung pada aset berisiko atau rupiah. Ukuran alokasi harus mengikuti kebutuhan kas, target, dan toleransi volatilitas Anda. Jangan menambah emas dengan utang atau menjual aset produktif hanya karena satu headline geopolitik.",
      },
    ],
    caseStudy: {
      title: "Apakah kenaikan harga sudah menutup spread?",
      scenario:
        "Arif membeli 10 gram emas fisik pada harga Rp1.500.000 per gram. Pada hari pembelian, harga buyback penyedia hanya Rp1.365.000 per gram. Delapan belas bulan kemudian, harga buyback naik ke Rp1.560.000 per gram.",
      calculation: [
        "Modal beli = 10 x Rp1.500.000 = Rp15.000.000",
        "Nilai buyback awal = 10 x Rp1.365.000 = Rp13.650.000",
        "Nilai buyback 18 bulan kemudian = 10 x Rp1.560.000 = Rp15.600.000",
        "Laba kotor saat buyback = Rp15.600.000 - Rp15.000.000 = Rp600.000, sebelum biaya atau ketentuan pajak transaksi tertentu.",
      ],
      conclusion:
        "Kenaikan harga papan tidak cukup; harga buyback adalah angka yang menentukan hasil jika Arif menjual. Spread menjelaskan mengapa emas fisik kurang cocok untuk kebutuhan mingguan.",
    },
    redFlags: [
      "Menganggap emas pasti menang terhadap inflasi pada setiap horizon bulanan atau tahunan.",
      "Membeli ketika euforia tanpa membandingkan harga beli dan buyback pada penyedia yang sama.",
      "Menyimpan fisik bernilai besar tanpa rencana keamanan, bukti kepemilikan, atau asuransi sesuai kebutuhan.",
    ],
    actionChecklist: [
      "Tentukan fungsi emas: diversifikasi jangka panjang, bukan dana pembayaran minggu depan.",
      "Catat harga beli, harga buyback, gramasi, nomor seri, dan bukti transaksi.",
      "Atur batas alokasi dan rebalancing agar emas tidak mendominasi portofolio setelah harga melonjak.",
    ],
    quiz: {
      question: "Mengapa emas fisik kurang ideal untuk trading harian bagi pemula?",
      options: [
        "Tidak bisa dijual", "Spread beli-buyback dapat menghapus pergerakan harga kecil", "Dilarang regulator", "Tidak memiliki harga global"],
      correctIndex: 1,
      explanation: "Selisih harga beli dan buyback membuat kenaikan kecil belum tentu menghasilkan laba setelah dijual kembali.",
    },
    quizzes: [
      {
        question: "Jika harga dunia emas tetap tetapi rupiah melemah terhadap dolar AS, apa yang dapat terjadi pada harga emas dalam rupiah?",
        options: ["Dapat naik", "Pasti nol", "Pasti tidak berubah", "Tidak boleh diperdagangkan"],
        correctIndex: 0,
        explanation: "Harga lokal dipengaruhi XAU/USD dan USD/IDR, sehingga pelemahan rupiah dapat menaikkan harga gram domestik.",
      },
      {
        question: "Peran yang lebih realistis untuk emas dalam portofolio adalah?",
        options: ["Pengganti seluruh dana darurat", "Diversifier dan penjaga daya beli jangka panjang", "Jaminan return bulanan", "Cara cepat menggandakan modal"],
        correctIndex: 1,
        explanation: "Emas dapat melengkapi diversifikasi, tetapi tidak menjamin hasil dan tidak menggantikan kas untuk kebutuhan segera.",
      },
    ],
  },
  {
    id: "emas-spread-pajak",
    moduleNumber: 9,
    subTopic: "Spread & Pajak PMK 48/2023",
    plainTitle: "Menghitung selisih harga beli-jual emas, memilih ukuran gram, dan aturan pajaknya",
    title: "Matematika Spread Buyback (8-11%), Gramasi Optimal & Pajak Emas (PMK 48/2023)",
    category: "Emas",
    level: "Menengah",
    readTime: "12 menit",
    riskRating: "Sedang",
    sources: PROPOSED_SOURCES_EMAS,
    summary:
      "Keputusan emas yang baik dimulai dari matematika: hitung break-even spread, pahami trade-off gramasi kecil versus besar, dan ketahui konteks pajak emas batangan menurut PMK 48/2023.",
    keyTakeaways: [
      "Spread adalah selisih harga beli dan buyback; hitung persentasenya dari angka nyata penyedia, bukan asumsi umum.",
      "Gramasi kecil biasanya lebih mudah dicicil dan dijual sebagian, tetapi premium per gram dapat lebih tinggi.",
      "Penjualan emas batangan kepada konsumen akhir dikecualikan dari pemungutan PPh Pasal 22 menurut PMK 48/2023; kondisi buyback dapat berbeda.",
      "Bukti transaksi, identitas produk, dan syarat penyedia menentukan kelancaran jual kembali lebih dari sekadar harga papan.",
    ],
    sections: [
      {
        heading: "1. Hitung spread sebelum bicara target harga",
        body:
          "Spread persentase sederhana dapat dihitung sebagai (harga beli - harga buyback) / harga beli. Bila spread 10%, harga buyback harus naik sekitar 11,1% dari titik buyback awal untuk menyamai harga beli, karena basis perhitungannya berbeda. Gunakan tabel harga pada hari yang sama dan jangan mencampur harga beli satu merek dengan buyback merek lain.",
      },
      {
        heading: "2. Gramasi adalah keputusan likuiditas",
        body:
          "Batangan 0,5 sampai 5 gram memberi fleksibilitas bila Anda kelak hanya perlu menjual sebagian, sedangkan gramasi besar dapat memiliki premium per gram lebih efisien. Sebaliknya, menjual satu batangan 100 gram untuk kebutuhan Rp2 juta menciptakan masalah likuiditas karena tidak dapat dipotong. Rancang gramasi berdasarkan kemungkinan kebutuhan kas, bukan sekadar harga per gram termurah.",
      },
      {
        heading: "3. Memahami PMK 48/2023 tanpa menyederhanakan berlebihan",
        body:
          "PMK 48/2023 mengatur pemungutan PPh Pasal 22 atas penjualan emas batangan; penjualan oleh pengusaha kepada konsumen akhir termasuk yang dikecualikan dari pemungutan tersebut. Dalam praktik buyback, dokumen, nilai transaksi, status pihak, dan aturan penyedia dapat memengaruhi proses serta pungutan yang relevan. Konfirmasi ketentuan terkini kepada penjual atau konsultan pajak untuk transaksi material, karena pendidikan ini bukan nasihat pajak personal.",
      },
      {
        heading: "4. Harga papan bukan hasil bersih",
        body:
          "Hasil bersih dapat berubah karena spread, biaya cetak atau pengiriman, penyimpanan, kondisi fisik kemasan, dan prosedur verifikasi. Emas tanpa sertifikat atau kemasan yang rusak mungkin tetap bernilai, tetapi proses dan harga buyback dapat berbeda. Bandingkan total biaya kepemilikan dari pembelian sampai penjualan, bukan hanya harga beli terendah.",
      },
    ],
    caseStudy: {
      title: "Break-even 10 gram dengan spread 10%",
      scenario:
        "Maya membeli 10 gram seharga Rp1.600.000 per gram. Harga buyback pada hari itu Rp1.440.000 per gram, sehingga ia ingin mengetahui berapa harga buyback minimal agar balik modal.",
      calculation: [
        "Modal = 10 x Rp1.600.000 = Rp16.000.000",
        "Nilai buyback saat beli = 10 x Rp1.440.000 = Rp14.400.000",
        "Harga buyback break-even per gram = Rp16.000.000 / 10 = Rp1.600.000",
        "Kenaikan buyback dari Rp1.440.000 ke Rp1.600.000 = Rp160.000 atau 11,11% dari harga buyback awal.",
      ],
      conclusion:
        "Maya perlu memantau harga buyback, bukan hanya kenaikan harga jual toko. Menyimpan 2 gram dan 8 gram terpisah juga dapat memberi fleksibilitas bila ia perlu menjual sebagian nanti.",
    },
    redFlags: [
      "Menghitung laba dari harga beli toko hari ini dibanding harga beli toko bulan lalu, bukan harga buyback aktual.",
      "Membeli seluruh nominal dalam gramasi sangat besar tanpa memikirkan kebutuhan menjual sebagian.",
      "Membuat kesimpulan pajak dari unggahan media sosial tanpa memeriksa PMK dan syarat transaksi yang berlaku.",
    ],
    actionChecklist: [
      "Buat spreadsheet sederhana untuk harga beli, buyback, biaya, gramasi, dan tanggal transaksi.",
      "Pilih kombinasi gramasi sesuai kebutuhan likuiditas, misalnya beberapa pecahan kecil dan satu pecahan besar.",
      "Simpan sertifikat atau kemasan sesuai panduan penyedia dan tanyakan prosedur buyback sebelum membeli.",
    ],
    quiz: {
      question: "Jika harga beli Rp1.500.000 dan buyback Rp1.350.000 per gram, berapa spread sederhana terhadap harga beli?",
      options: ["1%", "5%", "10%", "15%"],
      correctIndex: 2,
      explanation: "(Rp1.500.000 - Rp1.350.000) / Rp1.500.000 = 10%.",
    },
    quizzes: [
      {
        question: "Mengapa gramasi kecil bisa berguna meskipun premium per gramnya lebih tinggi?",
        options: [
          "Karena selalu bebas risiko",
          "Karena memungkinkan penjualan sebagian saat kebutuhan kas kecil",
          "Karena tidak perlu bukti pembelian",
          "Karena harga dunia tidak memengaruhi emas kecil",
        ],
        correctIndex: 1,
        explanation: "Pecahan kecil meningkatkan fleksibilitas likuiditas, meski investor tetap perlu membandingkan premium dan spread.",
      },
      {
        question: "Pernyataan hati-hati terkait PMK 48/2023 adalah?",
        options: [
          "Semua transaksi emas tidak pernah memiliki implikasi pajak",
          "Penjualan emas batangan kepada konsumen akhir dikecualikan dari PPh 22, sementara proses buyback perlu dicek pada kondisi transaksi",
          "PMK membuat harga emas selalu naik",
          "Pajak menghapus kebutuhan menyimpan bukti transaksi",
        ],
        correctIndex: 1,
        explanation: "Aturan membedakan konteks transaksi. Untuk nilai material, konfirmasi ketentuan aktual kepada penyedia atau profesional pajak.",
      },
    ],
  },
  {
    id: "emas-fisik-vs-digital",
    moduleNumber: 10,
    subTopic: "Fisik vs Digital vs ETF",
    plainTitle: "Membandingkan emas batangan fisik, tabungan emas digital, dan risiko kontrak berjangka",
    title: "Komparasi Emas Fisik (Antam/UBS), Tabungan Emas Digital (Bappebti) & Kontrak Berjangka",
    category: "Emas",
    level: "Menengah",
    readTime: "13 menit",
    riskRating: "Sedang",
    sources: PROPOSED_SOURCES_EMAS,
    summary:
      "Bentuk emas menentukan risiko Anda: kepemilikan fisik, risiko kustodian platform digital, paparan pasar melalui produk bursa, dan risiko leverage kontrak berjangka bukanlah hal yang sama.",
    keyTakeaways: [
      "Emas fisik memberi penguasaan langsung tetapi membawa biaya penyimpanan, autentikasi, dan risiko kehilangan.",
      "Emas digital bergantung pada kualitas penyelenggara, mekanisme penjaminan fisik, biaya, serta prosedur penarikan atau cetak.",
      "Produk ETF atau kontrak berjangka memberi eksposur harga yang berbeda dari memegang batangan di tangan.",
      "Kontrak berjangka dapat memakai margin dan leverage, sehingga tidak cocok disamakan dengan tabungan emas untuk pemula.",
    ],
    sections: [
      {
        heading: "1. Emas fisik: kepemilikan dan tanggung jawab langsung",
        body:
          "Batangan Antam, UBS, atau produk lain memberi investor kontrol atas barang fisik dan pilihan menyimpan sendiri atau menggunakan layanan tertentu. Keuntungannya adalah tidak bergantung pada aplikasi untuk mengakses kepemilikan, tetapi risiko berpindah ke keamanan rumah, brankas, asuransi, dan autentikasi. Cek reputasi penjual, kondisi kemasan, nomor seri, dan kebijakan buyback sebelum transaksi.",
      },
      {
        heading: "2. Emas digital: baca struktur kustodi",
        body:
          "Pada emas digital, investor biasanya membeli pecahan gram yang dicatat oleh platform dan dapat memiliki syarat minimum untuk cetak atau tarik fisik. Periksa izin dan pengawasan yang relevan, lokasi atau mekanisme penyimpanan emas, biaya administrasi, spread, audit, dan prosedur saat platform bermasalah. Regulasi serta daftar penyelenggara dapat berubah, jadi verifikasi langsung pada kanal regulator dan penyedia sebelum menyetor dana.",
      },
      {
        heading: "3. Produk pasar modal dan derivatif bukan batangan",
        body:
          "ETF emas, bila tersedia melalui pasar yang diakses investor, memberi eksposur pada harga melalui unit dana dan tetap memiliki biaya pengelolaan serta risiko mata uang atau pasar. Kontrak berjangka emas menggunakan perjanjian dengan margin; perubahan harga kecil dapat memperbesar untung atau rugi karena leverage. Jangan memilih produk hanya karena semuanya memiliki kata emas di namanya.",
      },
      {
        heading: "4. Cocokkan bentuk dengan kebutuhan",
        body:
          "Investor yang menginginkan kepemilikan jangka panjang dan sanggup mengelola penyimpanan bisa mempertimbangkan fisik. Investor yang ingin akumulasi pecahan kecil perlu menghitung total biaya dan risiko penyelenggara digital. Trader profesional dengan rencana risiko ketat mungkin menggunakan derivatif, tetapi itu kategori risiko berbeda dan tidak boleh dibiayai dana tujuan penting.",
      },
    ],
    caseStudy: {
      title: "Membandingkan cicilan emas digital dengan batangan",
      scenario:
        "Bayu menabung Rp500.000 per bulan selama 12 bulan. Harga rata-rata emas ilustratif Rp1.500.000 per gram. Platform digital mengenakan biaya cetak Rp150.000 saat ia ingin menarik fisik, sedangkan toko menawarkan batangan 4 gram seharga Rp6.100.000.",
      calculation: [
        "Total setoran digital = 12 x Rp500.000 = Rp6.000.000",
        "Gram ilustratif sebelum spread/biaya = Rp6.000.000 / Rp1.500.000 = 4 gram",
        "Jika dicetak, biaya Rp150.000 membuat total ekonomi = Rp6.150.000",
        "Bayu membandingkan Rp6.150.000 dengan harga fisik Rp6.100.000 sambil mempertimbangkan fleksibilitas cicilan dan syarat penarikan.",
      ],
      conclusion:
        "Bentuk digital dapat memudahkan disiplin bulanan, tetapi biaya cetak dan ketentuan penarikan harus masuk perhitungan sebelum Bayu menyimpulkan mana yang lebih murah.",
    },
    redFlags: [
      "Menyamakan saldo emas digital, ETF, dan kontrak futures sebagai kepemilikan fisik dengan risiko identik.",
      "Menyetor ke platform tanpa memeriksa status penyelenggara, biaya, dan mekanisme penarikan fisik.",
      "Memakai margin futures untuk mengejar kerugian dari harga emas fisik.",
    ],
    actionChecklist: [
      "Pilih satu tujuan utama: kepemilikan fisik, akumulasi gram, atau eksposur pasar; jangan campurkan tanpa alasan.",
      "Bandingkan biaya all-in, termasuk spread, cetak, penarikan, penyimpanan, dan pengiriman.",
      "Jika memakai platform digital, dokumentasikan saldo, kebijakan kustodi, dan jalur layanan pelanggan resmi.",
    ],
    quiz: {
      question: "Risiko khas kontrak berjangka emas yang tidak ada pada batangan tanpa utang adalah?",
      options: ["Margin dan leverage", "Harga berfluktuasi", "Kebutuhan memahami spread", "Nilai dapat berubah"],
      correctIndex: 0,
      explanation: "Futures dapat memakai margin dan leverage sehingga pergerakan harga kecil bisa menimbulkan untung atau rugi besar dan margin call.",
    },
    quizzes: [
      {
        question: "Hal pertama yang perlu diperiksa sebelum menabung emas digital adalah?",
        options: [
          "Warna aplikasi",
          "Izin atau pengawasan relevan, mekanisme kustodi, biaya, dan penarikan",
          "Prediksi harga media sosial",
          "Jumlah pengikut influencer",
        ],
        correctIndex: 1,
        explanation: "Struktur penyelenggara dan biaya menentukan risiko operasional serta hasil bersih investor.",
      },
      {
        question: "Mengapa biaya cetak perlu dimasukkan saat membandingkan emas digital dengan fisik?",
        options: ["Karena mengubah total biaya untuk menerima batangan fisik", "Karena mengubah harga XAU/USD", "Karena menghapus spread", "Karena membuat emas bebas risiko"],
        correctIndex: 0,
        explanation: "Biaya cetak menambah total ekonomi jika tujuan akhirnya adalah memegang batangan fisik.",
      },
    ],
  },
  {
    id: "emas-makro-hedging",
    moduleNumber: 11,
    subTopic: "Hedging & Rasio XAU/USD",
    plainTitle: "Faktor global dan kurs rupiah yang menggerakkan harga emas serta cara menjaga porsinya",
    title: "Korelasi XAU/USD, DXY, Real Yield US Treasury & Strategi Rebalancing Portofolio",
    category: "Emas",
    level: "Lanjutan",
    readTime: "15 menit",
    riskRating: "Sedang",
    sources: PROPOSED_SOURCES_EMAS,
    summary:
      "Naik-turunnya emas dipengaruhi banyak penggerak makro. Pelajari rasio harga global ke rupiah, DXY, real yield US Treasury, korelasi yang tidak stabil, dan rebalancing sebagai disiplin alih-alih ramalan.",
    keyTakeaways: [
      "Harga gram domestik kira-kira dipengaruhi XAU/USD x USD/IDR dibagi 31,1035 gram per troy ounce, lalu ditambah premi produk.",
      "Real yield yang naik sering menjadi hambatan bagi emas karena opportunity cost memegang aset tanpa kupon meningkat.",
      "DXY dan emas sering bergerak berlawanan, tetapi hubungan itu tidak tetap dan tidak cukup untuk satu sinyal transaksi.",
      "Hedging berarti mengurangi dampak risiko tertentu, bukan menjamin portofolio tidak pernah rugi.",
    ],
    sections: [
      {
        heading: "1. Dari XAU/USD menjadi rupiah per gram",
        body:
          "XAU/USD menyatakan harga satu troy ounce emas dalam dolar AS. Untuk memperkirakan nilai dasar per gram di Indonesia, kalikan XAU/USD dengan USD/IDR lalu bagi 31,1035; setelah itu masih ada premi, biaya logistik, dan spread penyedia. Rumus ini membantu memahami arah, bukan menggantikan harga resmi produk yang benar-benar bisa dibeli atau dijual.",
      },
      {
        heading: "2. DXY dan real yield sebagai konteks",
        body:
          "DXY mengukur kekuatan dolar terhadap sekeranjang mata uang, sedangkan real yield mengurangi ekspektasi inflasi dari yield nominal Treasury. Ketika real yield naik, memegang obligasi berpotensi lebih menarik dibanding aset tanpa arus kas seperti emas, sehingga emas sering tertekan. Namun krisis, pembelian bank sentral, dan permintaan safe haven dapat membuat hubungan itu tidak bekerja dalam jangka pendek.",
      },
      {
        heading: "3. Korelasi bukan sebab-akibat tetap",
        body:
          "Korelasi berubah menurut rezim pasar. Emas bisa bergerak searah dengan saham ketika likuiditas global melimpah, lalu berlawanan saat stres pasar. Jangan membangun hedge dari satu grafik enam bulan; periksa sumber risiko yang hendak dilindungi, seperti inflasi rupiah, gejolak geopolitik, atau konsentrasi aset domestik.",
      },
      {
        heading: "4. Rebalancing mengubah emosi menjadi aturan",
        body:
          "Investor dapat menetapkan target, misalnya emas 10% dari portofolio, lalu menyeimbangkan ulang berdasarkan ambang tertentu atau jadwal berkala. Saat emas melonjak, sebagian keuntungan dapat dipindahkan ke aset yang tertinggal; saat turun tetapi tesis dan kebutuhan kas tidak berubah, investor menilai apakah bobotnya kembali ke target. Ini bukan prediksi harga, melainkan pengelolaan risiko konsentrasi.",
      },
    ],
    caseStudy: {
      title: "Dua penggerak harga emas dalam rupiah",
      scenario:
        "Harga global ilustratif naik dari US$2.300 ke US$2.350 per troy ounce, sementara USD/IDR naik dari Rp15.700 ke Rp16.000. Investor ingin melihat estimasi dasar per gram sebelum premi.",
      calculation: [
        "Nilai awal = US$2.300 x Rp15.700 / 31,1035 = sekitar Rp1.160.000 per gram",
        "Nilai baru = US$2.350 x Rp16.000 / 31,1035 = sekitar Rp1.209.000 per gram",
        "Kenaikan estimasi dasar = sekitar Rp49.000 per gram atau sekitar 4,2%",
        "Harga produk riil dapat berbeda karena premi dan spread, tetapi kedua penggerak sama-sama mendorong naik.",
      ],
      conclusion:
        "Investor Indonesia tidak cukup melihat XAU/USD. Pergerakan rupiah dapat memperkuat atau mengurangi dampak perubahan harga global.",
    },
    redFlags: [
      "Menganggap korelasi historis DXY dan emas sebagai aturan mekanis untuk trading harian.",
      "Menggunakan emas untuk menutup seluruh risiko portofolio tanpa menetapkan risiko mana yang ingin dikurangi.",
      "Menambah alokasi setelah harga melonjak sehingga bobot emas jauh melampaui target tanpa rencana rebalancing.",
    ],
    actionChecklist: [
      "Tetapkan bobot target emas dan ambang rebalancing yang realistis untuk portofolio Anda.",
      "Pantau XAU/USD, USD/IDR, dan harga buyback lokal sebagai tiga data yang berbeda.",
      "Tuliskan alasan kepemilikan emas dan kondisi yang membuat alasan itu perlu ditinjau ulang.",
    ],
    quiz: {
      question: "Mengapa harga emas lokal dapat naik saat XAU/USD datar?",
      options: ["Karena rupiah dapat melemah terhadap dolar AS", "Karena emas tidak memiliki harga global", "Karena harga buyback selalu sama dengan harga beli", "Karena DXY tidak pernah berubah"],
      correctIndex: 0,
      explanation: "Konversi ke rupiah memasukkan USD/IDR. Pelemahan rupiah dapat menaikkan nilai gram domestik meski XAU/USD tidak berubah.",
    },
    quizzes: [
      {
        question: "Apa dampak yang sering diasosiasikan dengan kenaikan real yield AS terhadap emas?",
        options: ["Menambah opportunity cost memegang emas", "Menjamin emas naik", "Menghapus spread fisik", "Membuat rupiah tetap"],
        correctIndex: 0,
        explanation: "Yield riil lebih tinggi dapat meningkatkan daya tarik aset berkupon relatif terhadap emas, walau banyak faktor lain tetap berperan.",
      },
      {
        question: "Portofolio Rp100 juta menargetkan emas 10%, tetapi emas tumbuh menjadi Rp14 juta sementara total portofolio Rp104 juta. Apa fungsi rebalancing?",
        options: ["Mengevaluasi pengurangan bobot dari 13,5% menuju target", "Menjamin profit", "Menghapus pajak", "Memprediksi XAU/USD minggu depan"],
        correctIndex: 0,
        explanation: "Rp14 juta / Rp104 juta sekitar 13,5%, sehingga rebalancing dapat mengelola konsentrasi terhadap target 10%.",
      },
    ],
  },
  {
    id: "saham-fundamental",
    moduleNumber: 12,
    subTopic: "Fundamental & Lot BEI",
    plainTitle: "Langkah awal membeli saham di Bursa Efek Indonesia: rekening, satuan lot, dan biaya transaksi",
    title: "Dasar Investasi Saham di BEI: Lot, RDN, KSEI, Capital Gain, Dividen & Klasifikasi Lapis Saham",
    category: "Saham",
    level: "Pemula",
    readTime: "12 menit",
    riskRating: "Tinggi",
    sources: PROPOSED_SOURCES_SAHAM,
    summary:
      "Saham adalah kepemilikan bisnis yang diperdagangkan di BEI. Pahami RDN, 1 lot = 100 lembar, penyimpanan melalui KSEI, dua sumber return, biaya transaksi, dan pajak penjualan saham.",
    keyTakeaways: [
      "Membeli saham berarti membeli bagian kepemilikan emiten, bukan sekadar kode yang bergerak di layar.",
      "Satu lot di BEI setara 100 lembar, sehingga nilai order = harga x 100 x jumlah lot sebelum fee.",
      "RDN menampung dana transaksi dan kepemilikan efek tercatat secara scripless melalui infrastruktur KSEI.",
      "Penjualan saham di bursa dikenai PPh final 0,1% dari nilai bruto penjualan, terpisah dari fee broker dan pungutan transaksi.",
    ],
    sections: [
      {
        heading: "1. Dari RDN ke kepemilikan efek",
        body:
          "Investor membuka rekening efek pada perusahaan sekuritas dan Rekening Dana Nasabah untuk arus dana. Setelah order tereksekusi di BEI, kepemilikan tercatat secara tanpa warkat dalam infrastruktur KSEI. Periksa konfirmasi transaksi dan laporan kepemilikan secara berkala; jangan membagikan kredensial aplikasi atau kode OTP kepada siapa pun.",
      },
      {
        heading: "2. Lot, harga, dan biaya transaksi",
        body:
          "Satuan perdagangan reguler adalah satu lot atau 100 lembar. Saham Rp1.000 tidak berarti modal minimum Rp1.000, melainkan sekitar Rp100.000 untuk satu lot sebelum biaya. Fee beli dan jual ditetapkan broker, sementara penjualan juga mengalami PPh final 0,1% atas nilai bruto jual meski posisi Anda rugi; hitung biaya ini ketika menetapkan target transaksi.",
      },
      {
        heading: "3. Capital gain, dividen, dan risiko bisnis",
        body:
          "Capital gain muncul bila harga jual lebih tinggi daripada harga beli; dividen adalah bagian laba yang diputuskan dalam RUPS dan tidak pernah dijamin. Harga saham mencerminkan ekspektasi laba, kondisi ekonomi, sentimen, serta likuiditas, sehingga perusahaan bagus pun dapat mengalami penurunan harga. Evaluasi total return setelah biaya dan pajak, bukan hanya kenaikan grafik.",
      },
      {
        heading: "4. Lapis saham bukan label kualitas resmi",
        body:
          "Istilah blue chip, second liner, dan third liner sering dipakai pasar untuk menggambarkan ukuran dan likuiditas, tetapi bukan klasifikasi risiko resmi dari BEI. Kapitalisasi besar dapat mengurangi risiko likuiditas relatif, bukan menghapus risiko valuasi atau bisnis. Pemula dapat mulai dari emiten yang bisnisnya dipahami, laporan keuangannya tersedia, dan likuiditasnya memadai.",
      },
    ],
    caseStudy: {
      title: "Menghitung biaya satu transaksi saham",
      scenario:
        "Lina membeli 5 lot saham pada Rp7.500 per lembar dan menjualnya kemudian pada Rp8.100. Asumsikan fee beli 0,15%, fee jual 0,25%, dan PPh final jual 0,1% untuk simulasi.",
      calculation: [
        "Nilai beli = 5 x 100 x Rp7.500 = Rp3.750.000",
        "Fee beli = Rp3.750.000 x 0,15% = Rp5.625",
        "Nilai jual = 5 x 100 x Rp8.100 = Rp4.050.000",
        "Fee jual + PPh final = Rp4.050.000 x (0,25% + 0,10%) = Rp14.175; laba bersih ilustratif = Rp4.050.000 - Rp14.175 - Rp3.750.000 - Rp5.625 = Rp280.200",
      ],
      conclusion:
        "Capital gain kotor Rp300.000 tidak sama dengan laba bersih. Lina perlu memasukkan fee dan PPh final pada setiap rencana jual.",
    },
    redFlags: [
      "Membeli karena grup chat menyebut saham akan naik tanpa membaca bisnis, laporan, dan likuiditasnya.",
      "Menganggap harga nominal rendah berarti saham murah secara valuasi atau risikonya rendah.",
      "Melupakan fee dan PPh final 0,1% pada nilai jual ketika menghitung target keuntungan.",
    ],
    actionChecklist: [
      "Pastikan sekuritas terdaftar dan akun RDN serta akses KSEI Anda aktif melalui kanal resmi.",
      "Hitung nilai per lot dan biaya transaksi sebelum memasukkan order pertama.",
      "Buat catatan tesis sederhana: bisnis apa yang dibeli, alasan membeli, batas alokasi, dan horizon.",
    ],
    quiz: {
      question: "Berapa lembar saham dalam satu lot pada papan reguler BEI?",
      options: ["10", "50", "100", "1.000"],
      correctIndex: 2,
      explanation: "Satu lot pada perdagangan reguler BEI setara dengan 100 lembar saham.",
    },
    quizzes: [
      {
        question: "Berapa nilai beli sebelum fee untuk 3 lot saham seharga Rp2.000?",
        options: ["Rp6.000", "Rp60.000", "Rp600.000", "Rp6.000.000"],
        correctIndex: 2,
        explanation: "3 x 100 x Rp2.000 = Rp600.000.",
      },
      {
        question: "PPh final 0,1% pada saham BEI dikenakan atas apa?",
        options: ["Nilai bruto penjualan", "Laba bersih saja", "Nilai pembelian", "Dividen saja"],
        correctIndex: 0,
        explanation: "PPh final saham dipotong atas nilai bruto transaksi penjualan, terlepas dari posisi untung atau rugi.",
      },
    ],
  },
  {
    id: "saham-valuasi",
    moduleNumber: 13,
    subTopic: "Valuasi PER, PBV, ROE, DER",
    plainTitle: "Cara membaca laporan keuangan perusahaan untuk menilai apakah harga saham wajar",
    title: "Analisis Fundamental & Valuasi: Membedah ROE, NPM, DER, PER & Mean PBV Standard Deviation",
    category: "Saham",
    level: "Menengah",
    readTime: "15 menit",
    riskRating: "Tinggi",
    sources: PROPOSED_SOURCES_SAHAM,
    summary:
      "Rasio tidak memberi jawaban instan, tetapi membantu mengubah laporan keuangan menjadi pertanyaan yang tepat tentang profitabilitas, utang, valuasi, siklus laba, dan kualitas bisnis.",
    keyTakeaways: [
      "ROE dan NPM perlu dibaca bersama kualitas laba, arus kas, dan struktur modal; angka tinggi sesaat belum tentu berkelanjutan.",
      "DER harus dibandingkan dengan model bisnis dan sektor, terutama karena bank serta perusahaan pembiayaan memakai struktur neraca berbeda.",
      "PER dan PBV hanya bermakna jika dibandingkan dengan pertumbuhan, risiko, siklus, dan perusahaan sejenis.",
      "Mean PBV standard deviation adalah alat konteks historis, bukan sinyal otomatis bahwa harga pasti kembali ke rata-rata.",
    ],
    sections: [
      {
        heading: "1. Mulai dari bisnis dan laporan keuangan",
        body:
          "Laporan laba rugi menunjukkan pendapatan dan laba, neraca menunjukkan aset, utang, serta ekuitas, sementara arus kas menguji apakah laba berubah menjadi kas. Bandingkan minimal beberapa tahun untuk mencari tren margin, pertumbuhan, dan kebutuhan modal kerja. Satu kuartal yang hebat dapat berasal dari harga komoditas, kurs, atau keuntungan nonberulang; baca catatan laporan, bukan angka ringkas saja.",
      },
      {
        heading: "2. Profitabilitas: ROE dan NPM",
        body:
          "ROE menghitung laba bersih terhadap ekuitas dan menunjukkan efisiensi modal pemegang saham, sedangkan NPM mengukur berapa laba bersih dari setiap rupiah penjualan. ROE tinggi bisa datang dari bisnis unggul, tetapi juga dari ekuitas kecil akibat utang tinggi atau buyback, sehingga DER dan arus kas perlu diperiksa. Bandingkan perusahaan dalam sektor serupa agar model bisnis tidak tercampur.",
      },
      {
        heading: "3. Neraca: utang, likuiditas, dan ketahanan",
        body:
          "DER membandingkan total utang dengan ekuitas dan berguna untuk menilai beban pendanaan pada perusahaan non-keuangan. Sektor properti, infrastruktur, dan komoditas dapat memiliki kebutuhan utang berbeda; bank lebih tepat dianalisis dengan rasio perbankan seperti CAR, NPL, dan CASA. Kenaikan beban bunga saat suku bunga tinggi dapat mengubah laba cepat, jadi jangan membaca DER tanpa jadwal jatuh tempo utang.",
      },
      {
        heading: "4. Valuasi: PER, PBV, dan deviasi historis",
        body:
          "PER adalah harga dibagi laba per saham dan PBV adalah harga dibagi nilai buku per saham. PER rendah bisa berarti murah, tetapi juga bisa menandakan laba sedang di puncak siklus atau bisnis bermasalah; PBV rendah pada bank perlu dibaca bersama ROE dan kualitas aset. Mean PBV standard deviation membantu melihat posisi terhadap sejarah sendiri, tetapi sejarah tidak mewajibkan harga kembali ke rata-rata jika fundamental berubah.",
      },
    ],
    caseStudy: {
      title: "Murah secara rasio, mahal secara risiko?",
      scenario:
        "Saham X dihargai Rp4.000, memiliki EPS Rp400, BVPS Rp2.500, laba bersih Rp120 miliar, ekuitas Rp800 miliar, dan utang Rp1.200 miliar. Investor membandingkannya dengan kompetitor sebelum membeli.",
      calculation: [
        "PER = Rp4.000 / Rp400 = 10x",
        "PBV = Rp4.000 / Rp2.500 = 1,6x",
        "ROE = Rp120 miliar / Rp800 miliar = 15%",
        "DER = Rp1.200 miliar / Rp800 miliar = 1,5x; investor lalu memeriksa apakah utang dan bunga sesuai karakter sektor.",
      ],
      conclusion:
        "Rasio 10x PER tidak cukup untuk menyebut Saham X murah. Investor perlu membandingkan kualitas laba, pertumbuhan, utang, dan valuasi kompetitor pada sektor yang sama.",
    },
    redFlags: [
      "Membeli PER rendah tanpa menyelidiki apakah laba berada di puncak siklus atau ada masalah tata kelola.",
      "Membandingkan DER bank dengan perusahaan manufaktur lalu menyimpulkan salah satu pasti lebih berisiko.",
      "Menggunakan bandarmologi atau rumor order book sebagai pengganti laporan keuangan auditan dan keterbukaan informasi BEI.",
    ],
    actionChecklist: [
      "Unduh laporan keuangan tahunan dan kuartalan dari BEI atau situs emiten, lalu lihat tren minimal tiga tahun.",
      "Bandingkan ROE, margin, utang, PER, dan PBV dengan dua sampai tiga emiten sejenis.",
      "Tulis alasan mengapa rasio rendah adalah peluang atau justru peringatan sebelum membeli.",
    ],
    quiz: {
      question: "Rasio yang mengukur laba bersih relatif terhadap ekuitas pemegang saham adalah?",
      options: ["ROE", "DER", "PBV", "Current ratio"],
      correctIndex: 0,
      explanation: "ROE = laba bersih / ekuitas. Rasio ini perlu dibaca bersama struktur utang dan kualitas laba.",
    },
    quizzes: [
      {
        question: "Saham seharga Rp3.000 dengan EPS Rp300 memiliki PER berapa?",
        options: ["0,1x", "1x", "10x", "100x"],
        correctIndex: 2,
        explanation: "PER = harga / EPS = Rp3.000 / Rp300 = 10x.",
      },
      {
        question: "Mengapa PBV di bawah rata-rata historis bukan sinyal beli otomatis?",
        options: [
          "Karena fundamental, ROE, risiko aset, atau model bisnis dapat berubah",
          "Karena PBV tidak pernah berguna",
          "Karena harga selalu kembali ke rata-rata besok",
          "Karena PBV adalah pajak transaksi",
        ],
        correctIndex: 0,
        explanation: "Deviasi dari rata-rata hanya konteks. Investor tetap perlu menguji apakah penurunan valuasi disebabkan peluang atau penurunan kualitas bisnis.",
      },
    ],
  },
  {
    id: "saham-dividen-trap",
    moduleNumber: 14,
    subTopic: "Dividen Investing & Yield Trap",
    plainTitle: "Memahami pembagian dividen saham dan cara menghindari jebakan dividen semu",
    title: "Strategi Dividend Investing: Cum Date, Ex Date, Payout Ratio & Cara Menghindari Dividend Trap",
    category: "Saham",
    level: "Menengah",
    readTime: "13 menit",
    riskRating: "Tinggi",
    sources: PROPOSED_SOURCES_SAHAM,
    summary:
      "Yield tinggi belum tentu pendapatan berkualitas. Pelajari timeline dividen, payout ratio, keberlanjutan arus kas, total return, PPh dividen, dan bahaya membeli hanya demi cum date.",
    keyTakeaways: [
      "Cum date menentukan hak menerima dividen, sedangkan ex date adalah saat saham diperdagangkan tanpa hak dividen berikutnya.",
      "Harga saham secara teori dapat menyesuaikan sekitar nilai dividen pada ex date, sehingga dividen bukan uang gratis.",
      "Payout ratio, laba, arus kas, utang, dan kebutuhan ekspansi lebih penting daripada dividend yield satu tahun.",
      "Bagi WPOP domestik, dividen umumnya PPh final 10% kecuali memenuhi persyaratan investasi kembali dan pelaporan yang berlaku.",
    ],
    sections: [
      {
        heading: "1. Urutan tanggal dividen",
        body:
          "Setelah RUPS memutuskan dividen, emiten mengumumkan cum date, ex date, recording date, dan payment date melalui keterbukaan informasi. Investor harus memiliki saham sampai ketentuan cum date agar tercatat sebagai pihak yang berhak. Jangan membeli berdasarkan jadwal dari unggahan lama; gunakan pengumuman resmi emiten atau BEI karena tanggal dapat berubah.",
      },
      {
        heading: "2. Dividen bukan uang gratis",
        body:
          "Ketika nilai perusahaan mengeluarkan kas untuk dividen, harga saham pada ex date dapat menyesuaikan sekitar jumlah dividen, meski pergerakan pasar aktual dipengaruhi banyak hal. Membeli sebelum cum date lalu menjual sesudahnya tidak otomatis menghasilkan keuntungan. Fokus pada total return: perubahan harga ditambah dividen, lalu kurangi fee dan pajak yang relevan.",
      },
      {
        heading: "3. Payout ratio dan kualitas dividen",
        body:
          "Payout ratio membandingkan dividen dengan laba. Rasio yang tinggi tidak selalu salah, tetapi perlu dijelaskan oleh arus kas, siklus bisnis, utang, dan kebutuhan belanja modal. Yield sangat tinggi dapat muncul karena harga saham jatuh akibat masalah bisnis; inilah dividend trap ketika investor melihat yield tetapi mengabaikan penyebab penurunan harga.",
      },
      {
        heading: "4. Pajak dan rencana reinvestasi",
        body:
          "PPh final dividen domestik bagi wajib pajak orang pribadi dalam negeri pada umumnya 10%. Ada fasilitas pengecualian bila dividen diinvestasikan kembali sesuai instrumen, jangka waktu, dan pelaporan realisasi yang disyaratkan ketentuan perpajakan. Jangan mengklaim bebas pajak tanpa memastikan seluruh syarat dan dokumentasi terpenuhi; untuk situasi pribadi, konfirmasi ke sumber DJP atau profesional pajak.",
      },
    ],
    caseStudy: {
      title: "Membedakan yield dengan total return",
      scenario:
        "Tara membeli 10 lot saham pada Rp5.000. Emiten membagikan dividen Rp250 per saham. Setelah ex date, harga pasar berada di Rp5.050. Asumsikan PPh dividen 10% dan abaikan fee untuk menyederhanakan contoh.",
      calculation: [
        "Modal beli = 10 x 100 x Rp5.000 = Rp5.000.000",
        "Dividen bruto = 10 x 100 x Rp250 = Rp250.000",
        "PPh dividen ilustratif = Rp250.000 x 10% = Rp25.000; dividen bersih = Rp225.000",
        "Capital gain = 10 x 100 x (Rp5.050 - Rp5.000) = Rp50.000; total return bersih ilustratif = (Rp225.000 + Rp50.000) / Rp5.000.000 = 5,5% sebelum fee jual.",
      ],
      conclusion:
        "Yield 5% bruto tidak menjelaskan hasil penuh. Tara perlu memantau harga setelah ex date, pajak, fee, dan terutama kemampuan emiten menjaga laba serta arus kas.",
    },
    redFlags: [
      "Membeli saham hanya sehari sebelum cum date lalu berharap dividen menjadi keuntungan tanpa risiko harga ex date.",
      "Mengejar dividend yield dua digit tanpa memeriksa laba, arus kas, utang, dan alasan harga saham jatuh.",
      "Menganggap dividen otomatis bebas pajak tanpa memenuhi persyaratan investasi kembali dan pelaporan bila ingin memakai fasilitas tersebut.",
    ],
    actionChecklist: [
      "Baca pengumuman RUPS dan jadwal dividen dari sumber resmi sebelum mengambil keputusan.",
      "Hitung payout ratio dan bandingkan dividen dengan arus kas operasi serta belanja modal beberapa tahun.",
      "Gunakan total return setelah pajak dan fee sebagai metrik evaluasi, bukan yield saja.",
    ],
    quiz: {
      question: "Mengapa membeli sebelum cum date tidak menjamin keuntungan?",
      options: [
        "Harga dapat menyesuaikan pada ex date dan ada biaya serta pajak",
        "Dividen selalu dibatalkan",
        "Saham tidak bisa dijual setelah cum date",
        "Payout ratio tidak pernah relevan",
      ],
      correctIndex: 0,
      explanation: "Hak dividen tidak menghapus risiko harga. Harga dapat menyesuaikan, dan hasil investor tetap dipengaruhi fee serta pajak.",
    },
    quizzes: [
      {
        question: "Apa sinyal awal dividend trap yang perlu diteliti?",
        options: ["Yield tinggi karena harga turun tajam bersamaan dengan laba atau arus kas memburuk", "Pembayaran dividen tercatat di RUPS", "Emiten mengumumkan laporan keuangan", "Harga saham memiliki kode empat huruf"],
        correctIndex: 0,
        explanation: "Yield dapat tampak tinggi karena penyebutnya, yaitu harga saham, jatuh akibat masalah fundamental.",
      },
      {
        question: "Dividen bruto Rp100.000 dengan PPh final 10% menghasilkan nilai bersih ilustratif berapa?",
        options: ["Rp80.000", "Rp90.000", "Rp100.000", "Rp110.000"],
        correctIndex: 1,
        explanation: "Pajak Rp10.000 sehingga dividen bersih ilustratif Rp90.000.",
      },
    ],
  },
  {
    id: "saham-teknikal-sr",
    moduleNumber: 15,
    subTopic: "Support, Resistance & Volume; Bandarmologi & Laporan Keuangan",
    plainTitle: "Membaca arah grafik harga saham, volume transaksi, dan batas penggunaannya",
    title: "Analisis Teknikal Praktis: Struktur Market, Support & Resistance, Moving Average & Konfirmasi Volume",
    category: "Saham",
    level: "Menengah",
    readTime: "14 menit",
    riskRating: "Tinggi",
    sources: PROPOSED_SOURCES_SAHAM,
    summary:
      "Teknikal yang disiplin menempatkan harga, struktur tren, level, volume, dan risiko dalam satu rencana. Ia tidak menggantikan laporan keuangan, keterbukaan informasi, atau manajemen posisi.",
    keyTakeaways: [
      "Support dan resistance adalah zona probabilitas berbasis respons harga, bukan garis yang pasti menahan atau menembus harga.",
      "Struktur higher high/higher low atau lower high/lower low memberi konteks tren sebelum memakai indikator tambahan.",
      "Volume membantu menilai partisipasi pada breakout, tetapi lonjakan volume saja bukan bukti arah berkelanjutan.",
      "Bandarmologi dan order book tidak boleh diperlakukan sebagai bukti kepastian atau pengganti laporan keuangan serta keterbukaan informasi.",
    ],
    sections: [
      {
        heading: "1. Mulai dari struktur pasar",
        body:
          "Sebelum menggambar indikator, lihat urutan swing: tren naik cenderung mencetak higher high dan higher low, sedangkan tren turun sebaliknya. Struktur membantu menentukan apakah Anda mengikuti tren, menunggu pembalikan, atau menghindari pasar yang tidak jelas. Gunakan timeframe yang sesuai horizon; sinyal lima menit tidak cocok untuk tesis investasi enam bulan.",
      },
      {
        heading: "2. Support, resistance, dan rencana invalidasi",
        body:
          "Support adalah area tempat permintaan sebelumnya muncul, sementara resistance adalah area penawaran sebelumnya menahan harga. Area tersebut dapat gagal, sehingga order perlu memiliki titik invalidasi dan ukuran posisi yang telah dihitung. Hindari menggambar terlalu banyak garis hingga setiap harga tampak sebagai level penting; prioritaskan zona yang berulang dan dekat dengan struktur pasar.",
      },
      {
        heading: "3. Moving average dan volume sebagai konfirmasi",
        body:
          "Moving average merangkum harga historis dan dapat membantu membaca tren atau area dinamis, tetapi tertinggal dari harga dan mudah memberi whipsaw saat pasar datar. Breakout yang disertai volume di atas rata-rata dapat meningkatkan kualitas setup, bukan menjamin keberhasilan. Perhatikan pula likuiditas, bid-ask spread, dan kemungkinan slippage pada saham yang tipis.",
      },
      {
        heading: "4. Batas bandarmologi dan order book",
        body:
          "Data broker summary, order book, atau narasi akumulasi sering menarik, tetapi order dapat dibatalkan dan transaksi tidak menjelaskan motif ekonomi seluruh pelaku. Gunakan informasi itu paling jauh sebagai observasi tambahan, bukan alasan tunggal membeli. Untuk investasi, laporan keuangan auditan, keterbukaan informasi, aksi korporasi, dan tata kelola tetap menjadi dasar yang lebih dapat diuji.",
      },
    ],
    caseStudy: {
      title: "Breakout dengan ukuran risiko yang terukur",
      scenario:
        "Andi melihat resistance saham likuid di Rp2.000 dan berencana membeli jika penutupan valid di atasnya dengan volume menguat. Ia menetapkan invalidasi di Rp1.920 dan hanya mau kehilangan maksimal Rp400.000.",
      calculation: [
        "Risiko per lembar = Rp2.000 - Rp1.920 = Rp80",
        "Ukuran maksimum teoritis = Rp400.000 / Rp80 = 5.000 lembar",
        "Konversi lot = 5.000 / 100 = 50 lot",
        "Nilai posisi = 5.000 x Rp2.000 = Rp10.000.000, sebelum fee dan risiko gap yang dapat membuat eksekusi lebih buruk dari Rp1.920.",
      ],
      conclusion:
        "Level teknikal baru berguna jika disertai invalidasi dan ukuran posisi. Volume memperkuat konteks, tetapi Andi tetap menerima kemungkinan breakout gagal.",
    },
    redFlags: [
      "Menganggap satu candle atau satu indikator sebagai bukti pasti harga akan naik.",
      "Membeli saham sangat tidak likuid tanpa menghitung spread dan slippage ketika harus keluar.",
      "Menjadikan rumor bandar atau antrean order sebagai pengganti riset fundamental dan manajemen risiko.",
    ],
    actionChecklist: [
      "Tulis timeframe, area entry, invalidasi, target, dan ukuran posisi sebelum order dimasukkan.",
      "Periksa rata-rata volume, spread, dan nilai transaksi harian untuk menilai kualitas eksekusi.",
      "Simpan screenshot atau jurnal setup untuk menilai proses, bukan hanya hasil satu transaksi.",
    ],
    quiz: {
      question: "Fungsi paling sehat dari support dan resistance adalah?",
      options: [
        "Zona untuk merencanakan probabilitas, entry, dan invalidasi",
        "Jaminan harga tidak akan melewatinya",
        "Pengganti laporan keuangan",
        "Cara menentukan pajak saham",
      ],
      correctIndex: 0,
      explanation: "Support dan resistance adalah area respons harga historis yang membantu perencanaan, bukan kepastian.",
    },
    quizzes: [
      {
        question: "Mengapa breakout dengan volume lebih tinggi dari rata-rata bisa diperhatikan?",
        options: ["Dapat menunjukkan partisipasi lebih besar, tetapi tetap bukan jaminan", "Menjamin target tercapai", "Menghapus slippage", "Menggantikan stop loss"],
        correctIndex: 0,
        explanation: "Volume dapat menjadi konfirmasi tambahan, bukan penghapus risiko false breakout atau perubahan kondisi pasar.",
      },
      {
        question: "Jika entry Rp1.000, invalidasi Rp950, dan risiko maksimal Rp250.000, ukuran posisi teoritis adalah?",
        options: ["500 lembar", "2.500 lembar", "5.000 lembar", "25.000 lembar"],
        correctIndex: 2,
        explanation: "Risiko per lembar Rp50; Rp250.000 / Rp50 = 5.000 lembar atau 50 lot.",
      },
    ],
  },
  {
    id: "saham-manajemen-risiko",
    moduleNumber: 16,
    subTopic: "Manajemen Risiko & Position Sizing",
    plainTitle: "Membatasi kerugian maksimal di saham dan mengatur emosi saat pasar bergejolak",
    title: "Manajemen Risiko & Psikologi Trading: Position Sizing (1-2% Rule), Risk/Reward Ratio & Cut Loss Disiplin",
    category: "Saham",
    level: "Lanjutan",
    readTime: "15 menit",
    riskRating: "Tinggi",
    sources: PROPOSED_SOURCES_SAHAM,
    summary:
      "Keunggulan jangka panjang datang dari bertahan. Pelajari risiko per transaksi, ukuran posisi, risk/reward, gap risk, korelasi portofolio, dan cara menulis aturan agar emosi tidak mengendalikan keputusan.",
    keyTakeaways: [
      "Aturan 1-2% membatasi nilai yang bersedia dipertaruhkan per transaksi, bukan persentase modal yang pasti diinvestasikan.",
      "Ukuran posisi ditentukan dari jarak entry ke invalidasi dan risiko rupiah maksimum, lalu disesuaikan lot serta likuiditas.",
      "Risk/reward positif tidak menjamin profit; ia perlu dipadukan dengan probabilitas setup dan disiplin eksekusi.",
      "Cut loss adalah keputusan saat tesis invalid, bukan hukuman; gap dapat membuat kerugian aktual melampaui rencana.",
    ],
    sections: [
      {
        heading: "1. Pisahkan risiko rupiah dari nilai posisi",
        body:
          "Portofolio Rp50 juta dengan risiko 1% berarti kerugian rencana maksimum Rp500.000 per transaksi. Bila jarak entry ke invalidasi hanya Rp50 per lembar, posisi dapat lebih besar dibanding setup dengan jarak Rp200, tetapi tetap harus dibatasi likuiditas dan konsentrasi. Ini mencegah investor memasang nominal sama pada setiap saham tanpa memikirkan seberapa jauh harga dapat bergerak melawan tesis.",
      },
      {
        heading: "2. Risk/reward dan probabilitas",
        body:
          "Risk/reward 1:3 berarti target potensial tiga kali risiko yang direncanakan, bukan peluang menang tiga kali lebih besar. Setup dengan target jauh bisa memiliki probabilitas rendah; sebaliknya setup dengan win rate tinggi dapat tetap rugi bila kerugian rata-rata terlalu besar. Catat hasil puluhan transaksi untuk melihat expectancy, bukan menilai sistem dari satu kemenangan.",
      },
      {
        heading: "3. Risiko yang tidak terlihat di chart",
        body:
          "Gap pembukaan, suspensi, auto rejection, berita material, dan saham tidak likuid dapat membuat order stop tereksekusi jauh dari harga rencana atau tidak segera tereksekusi. Korelasi juga penting: memegang lima saham bank bukan diversifikasi penuh ketika seluruh sektor bereaksi terhadap satu kebijakan. Sisakan kas dan hindari memaksakan posisi di pasar yang tidak dapat dieksekusi dengan wajar.",
      },
      {
        heading: "4. Psikologi adalah sistem yang tertulis",
        body:
          "FOMO, averaging down tanpa tesis, revenge trading, dan menjual pemenang terlalu cepat sering muncul ketika aturan tidak jelas. Buat pre-trade checklist, batas kerugian harian atau mingguan, dan jeda setelah pelanggaran aturan. Tujuannya bukan menghilangkan emosi, melainkan membuat keputusan tetap dapat diaudit saat emosi hadir.",
      },
    ],
    caseStudy: {
      title: "Mengubah batas rugi menjadi jumlah lot",
      scenario:
        "Reno memiliki modal trading Rp60.000.000 dan membatasi risiko 1% per transaksi. Ia ingin entry saham di Rp2.400 dengan invalidasi Rp2.280 serta target Rp2.760.",
      calculation: [
        "Risiko maksimum = Rp60.000.000 x 1% = Rp600.000",
        "Risiko per lembar = Rp2.400 - Rp2.280 = Rp120",
        "Ukuran teoritis = Rp600.000 / Rp120 = 5.000 lembar = 50 lot",
        "Nilai posisi = 5.000 x Rp2.400 = Rp12.000.000; potensi reward per lembar Rp360 sehingga risk/reward = 1:3 sebelum biaya dan gap risk.",
      ],
      conclusion:
        "Reno tidak memilih 50 lot karena yakin harga naik; ia memilihnya agar salah satu ide tidak mengancam seluruh modal. Ia tetap dapat mengecilkan posisi bila likuiditas atau volatilitas memburuk.",
    },
    redFlags: [
      "Menggandakan lot setelah rugi untuk segera balik modal tanpa perubahan kualitas setup.",
      "Menganggap stop order menjamin harga keluar persis pada level yang direncanakan saat pasar gap atau tidak likuid.",
      "Memegang banyak saham dari sektor yang sama lalu menyebutnya diversifikasi.",
    ],
    actionChecklist: [
      "Tentukan risiko rupiah per transaksi dan batas paparan per sektor sebelum jam bursa.",
      "Hitung ukuran posisi dari entry dan invalidasi, lalu bulatkan ke lot yang tidak melebihi batas risiko.",
      "Jurnal alasan entry, kondisi exit, hasil, dan apakah aturan dipatuhi untuk evaluasi bulanan.",
    ],
    quiz: {
      question: "Portofolio Rp40 juta memakai risiko 1% per transaksi. Berapa risiko rupiah maksimalnya?",
      options: ["Rp40.000", "Rp400.000", "Rp4.000.000", "Rp40.000.000"],
      correctIndex: 1,
      explanation: "1% x Rp40.000.000 = Rp400.000. Ini adalah batas risiko rencana, bukan nilai posisi.",
    },
    quizzes: [
      {
        question: "Apa arti risk/reward 1:2?",
        options: ["Target potensi dua kali risiko rencana", "Peluang menang pasti 200%", "Kerugian tidak mungkin terjadi", "Modal wajib dua kali lipat"],
        correctIndex: 0,
        explanation: "Risk/reward membandingkan potensi target dengan risiko; ia tidak menjamin probabilitas kemenangan.",
      },
      {
        question: "Mengapa gap risk perlu dipertimbangkan pada cut loss?",
        options: ["Harga dapat melewati level stop sehingga eksekusi lebih buruk", "Gap selalu menguntungkan", "Gap menghapus fee", "Gap hanya terjadi di kripto"],
        correctIndex: 0,
        explanation: "Pada pembukaan atau berita material, harga dapat meloncat melewati level rencana dan memperbesar kerugian aktual.",
      },
    ],
  },
  {
    id: "makro-siklus-ekonomi",
    moduleNumber: 17,
    subTopic: "Rotasi Aset & Siklus Makro",
    plainTitle: "Menyesuaikan porsi aset saat kondisi ekonomi dan suku bunga berubah",
    title: "Strategi Rotasi Aset Multi-Siklus: Kuadran Makroekonomi, BI Rate, Arus Dana Asing (Foreign Flow) & Rebalancing",
    category: "Saham",
    level: "Lanjutan",
    readTime: "16 menit",
    riskRating: "Sedang",
    sources: PROPOSED_SOURCES_SAHAM,
    summary:
      "Kondisi makro mengubah biaya modal, laba, kurs, dan selera risiko. Pelajari kuadran pertumbuhan-inflasi, BI Rate, foreign flow, serta rebalancing agar tidak mengubah berita menjadi taruhan all-in.",
    keyTakeaways: [
      "Pertumbuhan dan inflasi dapat bergerak dalam empat kuadran yang memberi tekanan berbeda pada saham, obligasi, kas, emas, dan aset berisiko.",
      "BI Rate memengaruhi biaya dana, valuasi, kurs, dan preferensi aset, tetapi dampaknya berbeda menurut sektor dan sudah dapat tercermin di harga.",
      "Foreign flow adalah data konteks, bukan sinyal pasti; arus dapat berbalik cepat dan tidak menjelaskan kualitas satu emiten.",
      "Rebalancing berbasis target membantu investor membeli atau menjual secara disiplin tanpa perlu menebak titik puncak dan dasar.",
    ],
    sections: [
      {
        heading: "1. Empat kuadran makro",
        body:
          "Pertumbuhan naik dengan inflasi terkendali sering mendukung laba dan aset berisiko, sedangkan inflasi tinggi dapat menaikkan biaya dan menekan valuasi. Perlambatan dengan inflasi tinggi atau stagflasi biasanya menuntut kehati-hatian lebih besar, sementara pemulihan setelah pelonggaran dapat mendukung obligasi dan sektor sensitif bunga. Ini kerangka berpikir, bukan kalender yang selalu memberi urutan sama.",
      },
      {
        heading: "2. BI Rate, Fed, dan nilai rupiah",
        body:
          "Perubahan BI Rate memengaruhi bunga pinjaman, deposito, biaya pendanaan, serta ekspektasi pasar obligasi. Kebijakan The Fed juga relevan karena memengaruhi dolar, arus modal, dan sentimen global; namun Indonesia memiliki inflasi, neraca perdagangan, dan kebijakan domestik sendiri. Jangan menyimpulkan satu sektor pasti menang hanya dari satu keputusan suku bunga.",
      },
      {
        heading: "3. Foreign flow perlu dibaca dengan neraca lain",
        body:
          "Arus dana asing ke BEI dapat menggerakkan saham berkapitalisasi besar karena likuiditasnya tinggi, tetapi pergerakan harian tidak menyatakan nilai intrinsik. Periksa juga earnings, valuasi, kurs, harga komoditas, dan posisi investor domestik. Membeli hanya karena asing net buy dapat membuat Anda masuk terlambat setelah harga sudah mencerminkan berita.",
      },
      {
        heading: "4. Rebalancing dan skenario, bukan ramalan",
        body:
          "Buat alokasi target berdasarkan profil risiko, lalu tentukan kapan akan ditinjau, misalnya enam bulan sekali atau ketika bobot bergeser beberapa poin persentase. Skenario membantu: apa yang dilakukan bila inflasi naik, bila BI Rate turun, atau bila saham jatuh 20%? Aturan ini lebih kuat daripada merombak seluruh portofolio setiap kali ada data ekonomi baru.",
      },
    ],
    caseStudy: {
      title: "Rebalancing setelah saham menguat",
      scenario:
        "Portofolio awal Niko Rp200.000.000 ditargetkan 50% saham, 30% RDPU/RDPT, dan 20% emas. Setelah beberapa bulan, saham menjadi Rp120 juta, RDPU/RDPT Rp60 juta, dan emas Rp40 juta sehingga total berubah menjadi Rp220 juta.",
      calculation: [
        "Target saham baru = 50% x Rp220.000.000 = Rp110.000.000",
        "Target RDPU/RDPT baru = 30% x Rp220.000.000 = Rp66.000.000",
        "Target emas baru = 20% x Rp220.000.000 = Rp44.000.000",
        "Aksi rebalancing ilustratif = kurangi saham Rp10.000.000, tambah RDPU/RDPT Rp6.000.000, tambah emas Rp4.000.000 sebelum mempertimbangkan biaya dan pajak.",
      ],
      conclusion:
        "Niko menjual sebagian aset yang melebihi target bukan karena yakin pasar besok turun, melainkan untuk mengembalikan risiko portofolio ke rencana awal.",
    },
    redFlags: [
      "Merotasi seluruh portofolio dari satu aset ke aset lain hanya dari satu berita BI Rate atau foreign flow harian.",
      "Menganggap dana asing selalu lebih tahu sehingga tidak perlu melakukan riset emiten sendiri.",
      "Mengabaikan biaya, pajak, dan horizon saat rebalancing terlalu sering.",
    ],
    actionChecklist: [
      "Tuliskan alokasi target dan rentang toleransi untuk setiap kelas aset.",
      "Buat dua atau tiga skenario makro yang relevan, lalu tentukan respons alokasi yang terbatas dan rasional.",
      "Tinjau kinerja, bobot, dan alasan kepemilikan secara periodik dengan data yang lebih luas dari headline harian.",
    ],
    quiz: {
      question: "Fungsi paling disiplin dari rebalancing adalah?",
      options: ["Mengembalikan bobot risiko ke target", "Menjamin mengalahkan pasar", "Menebak harga tertinggi", "Menghapus volatilitas"],
      correctIndex: 0,
      explanation: "Rebalancing mengelola penyimpangan bobot dari target; ia tidak menjamin hasil atau menghapus risiko pasar.",
    },
    quizzes: [
      {
        question: "Mengapa kenaikan BI Rate dapat menekan valuasi saham pertumbuhan?",
        options: ["Diskonto atas laba masa depan dapat meningkat dan biaya modal naik", "Karena saham berhenti diperdagangkan", "Karena dividen otomatis nol", "Karena emas tidak ada"],
        correctIndex: 0,
        explanation: "Suku bunga lebih tinggi dapat meningkatkan tingkat diskonto dan biaya pendanaan, walau dampaknya berbeda antar perusahaan.",
      },
      {
        question: "Mengapa foreign flow tidak cukup menjadi alasan tunggal membeli saham?",
        options: ["Arus dapat berubah dan tidak menggantikan analisis laba, valuasi, serta risiko", "Karena data itu selalu salah", "Karena hanya berlaku untuk kripto", "Karena tidak ada saham besar di BEI"],
        correctIndex: 0,
        explanation: "Arus modal adalah satu data pasar. Tesis investasi tetap perlu didukung kualitas bisnis dan valuasi.",
      },
    ],
  },
  {
    id: "kripto-fundamental",
    moduleNumber: 18,
    subTopic: "Bitcoin, Halving & Likuiditas M2",
    plainTitle: "Mengenal cara kerja Bitcoin, kelangkaan suplainya, dan tingginya risiko naik-turun harga",
    title: "Memahami Bitcoin, Mekanisme Halving 4 Tahunan & Siklus Likuiditas Makro (Global M2)",
    category: "Kripto",
    level: "Pemula",
    readTime: "13 menit",
    riskRating: "Sangat Tinggi",
    sources: PROPOSED_SOURCES_KRIPTO,
    summary:
      "Bitcoin memiliki aturan suplai dan jaringan yang berbeda dari saham atau emas, tetapi tetap sangat volatil. Pelajari halving, likuiditas global, alokasi uang dingin, dan status pengawasan aset kripto di Indonesia.",
    keyTakeaways: [
      "Bitcoin memiliki batas suplai 21 juta BTC dan reward blok yang berkurang melalui halving sekitar setiap empat tahun.",
      "Halving mengurangi laju penerbitan baru, bukan jaminan harga akan naik pada tanggal tertentu.",
      "Likuiditas global, suku bunga, dolar, arus ETF, dan sentimen dapat memengaruhi siklus kripto bersama faktor jaringan.",
      "Pengawasan aset kripto di Indonesia beralih dari Bappebti ke OJK pada 10 Januari 2025; investor tetap perlu memeriksa status penyelenggara terkini.",
    ],
    sections: [
      {
        heading: "1. Bitcoin, jaringan, dan kepemilikan",
        body:
          "Bitcoin adalah aset digital pada jaringan blockchain terbuka yang menggunakan proof-of-work untuk mengamankan riwayat transaksi. Memiliki BTC berarti mengendalikan hak atas output transaksi melalui kunci privat atau mempercayakan kustodi kepada platform. Harga Bitcoin tidak didukung dividen atau kupon, sehingga valuasi dan permintaannya sangat dipengaruhi adopsi, likuiditas, narasi, serta risiko regulasi.",
      },
      {
        heading: "2. Halving mengubah suplai baru, bukan hukum harga",
        body:
          "Setiap sekitar 210.000 blok, imbalan bagi penambang berkurang setengah sehingga laju suplai baru BTC turun. Pasar sudah mengetahui jadwal ini, sehingga dampak harga dapat tercermin lebih awal, tertunda, atau tertutup oleh kondisi makro. Hindari membeli secara agresif hanya karena tanggal halving; ukur alokasi terhadap kemampuan Anda menahan penurunan besar.",
      },
      {
        heading: "3. M2 dan likuiditas global sebagai konteks",
        body:
          "Ukuran uang beredar seperti Global M2 sering dipakai sebagai proksi likuiditas, tetapi definisi, jeda data, dan hubungan sebab-akibatnya tidak sederhana. Kondisi suku bunga, penguatan dolar, leverage, dan arus modal dapat membuat harga kripto bergerak berlawanan dengan grafik M2 untuk periode tertentu. Gunakan data makro sebagai konteks risiko, bukan indikator buy-sell tunggal.",
      },
      {
        heading: "4. Aturan bertahan bagi investor Indonesia",
        body:
          "Gunakan uang dingin, prioritaskan penyelenggara yang statusnya dapat diverifikasi, aktifkan keamanan akun, dan pahami biaya serta implikasi pajak yang berlaku. Sejak transisi pengawasan ke OJK, daftar serta aturan penyelenggara perlu dicek pada sumber resmi terbaru. Hindari leverage futures untuk investasi pemula karena volatilitas BTC saja sudah cukup besar untuk menimbulkan kerugian material.",
      },
    ],
    caseStudy: {
      title: "Mengukur alokasi kecil terhadap volatilitas besar",
      scenario:
        "Dewi memiliki portofolio Rp100.000.000 dan menetapkan alokasi Bitcoin maksimal 3%. Ia membeli Rp3.000.000 BTC saat harga Rp1.000.000.000 per BTC, lalu harga turun 35%.",
      calculation: [
        "Kepemilikan BTC = Rp3.000.000 / Rp1.000.000.000 = 0,003 BTC",
        "Nilai setelah turun 35% = Rp3.000.000 x 65% = Rp1.950.000",
        "Kerugian pada posisi BTC = Rp3.000.000 - Rp1.950.000 = Rp1.050.000",
        "Dampak terhadap total portofolio awal = Rp1.050.000 / Rp100.000.000 = 1,05% sebelum fee dan pajak.",
      ],
      conclusion:
        "Penurunan 35% tetap tidak nyaman, tetapi batas alokasi membuat satu aset sangat volatil tidak merusak seluruh rencana keuangan Dewi.",
    },
    redFlags: [
      "Menganggap halving menjamin reli harga sehingga memakai utang atau dana kebutuhan hidup.",
      "Mengikuti sinyal Global M2 sebagai indikator tunggal tanpa memeriksa kondisi leverage dan risiko pasar.",
      "Menggunakan platform atau tautan investasi yang tidak dapat diverifikasi melalui kanal regulator dan perusahaan resmi.",
    ],
    actionChecklist: [
      "Tentukan batas persentase kripto dari portofolio dan sumber dana yang benar-benar uang dingin.",
      "Periksa status penyelenggara aset kripto pada sumber OJK terkini sebelum deposit.",
      "Aktifkan 2FA dan buat catatan harga rata-rata beli, biaya, serta alasan alokasi.",
    ],
    quiz: {
      question: "Apa yang dilakukan Bitcoin halving secara langsung?",
      options: ["Mengurangi reward blok baru", "Menjamin harga naik", "Menambah batas suplai di atas 21 juta", "Menghapus volatilitas"],
      correctIndex: 0,
      explanation: "Halving mengurangi reward blok sehingga laju suplai baru turun. Harga tetap ditentukan oleh banyak faktor pasar.",
    },
    quizzes: [
      {
        question: "Investasi Rp2 juta pada harga BTC Rp1 miliar per BTC setara berapa BTC sebelum biaya?",
        options: ["0,0002 BTC", "0,002 BTC", "0,02 BTC", "2 BTC"],
        correctIndex: 1,
        explanation: "Rp2.000.000 / Rp1.000.000.000 = 0,002 BTC.",
      },
      {
        question: "Mengapa Global M2 tidak tepat dipakai sebagai sinyal beli tunggal untuk kripto?",
        options: ["Definisi, jeda data, suku bunga, dolar, dan leverage juga memengaruhi harga", "Karena M2 tidak pernah berubah", "Karena BTC memiliki dividen", "Karena halving menghapus makro"],
        correctIndex: 0,
        explanation: "Likuiditas adalah salah satu konteks makro, bukan hubungan mekanis yang menjamin arah harga kripto.",
      },
    ],
  },
  {
    id: "kripto-tokenomics",
    moduleNumber: 19,
    subTopic: "Tokenomics, FDV & On-Chain",
    plainTitle: "Memeriksa jumlah koin kripto yang beredar agar tidak terjebak harga terlihat murah",
    title: "Bedah Tokenomics Altcoin: Market Cap vs FDV, Jadwal Cliff/Vesting Unlock & Risiko Inflasi Suplai",
    category: "Kripto",
    level: "Menengah",
    readTime: "15 menit",
    riskRating: "Sangat Tinggi",
    sources: PROPOSED_SOURCES_KRIPTO,
    summary:
      "Altcoin dapat memiliki teknologi menarik tetapi struktur suplai buruk. Pelajari market cap, FDV, circulating supply, cliff, vesting, unlock, likuiditas, dan data on-chain tanpa melupakan risiko proyek.",
    keyTakeaways: [
      "Market cap memakai suplai beredar, sedangkan FDV memakai total atau maksimum suplai; selisih besar dapat menunjukkan potensi dilusi.",
      "Cliff menunda pelepasan token, sementara vesting mengalirkannya bertahap setelah periode tersebut.",
      "Unlock tidak otomatis membuat harga turun, tetapi menambah suplai potensial yang perlu dibandingkan dengan permintaan dan likuiditas.",
      "Data on-chain, GitHub, pengguna, pendapatan protokol, dan distribusi holder harus dipakai sebagai bukti pelengkap, bukan kosmetik dashboard.",
    ],
    sections: [
      {
        heading: "1. Market cap dan FDV menjawab pertanyaan berbeda",
        body:
          "Market cap dihitung dari harga token dikali circulating supply, sedangkan fully diluted valuation menggunakan total atau maksimum suplai. Token dengan market cap kecil tetapi FDV raksasa dapat terlihat murah pada layar padahal banyak token belum beredar. Baca definisi suplai tiap proyek karena burn, emissions, dan mekanisme staking dapat membuat angka berubah.",
      },
      {
        heading: "2. Cliff, vesting, dan tekanan dilusi",
        body:
          "Cliff adalah periode saat token investor, tim, atau ekosistem belum dapat dibuka; setelahnya, vesting dapat melepas token secara bulanan atau kuartalan. Kalender unlock membantu investor mengukur risiko pasokan tambahan, terutama pada order book tipis. Yang penting bukan hanya persentase unlock, melainkan siapa penerimanya, apakah mereka punya insentif menjual, dan seberapa besar likuiditas pasar.",
      },
      {
        heading: "3. Cari utilitas dan bukti penggunaan",
        body:
          "Token bernilai bukan hanya karena narasi. Tanyakan apakah token diperlukan untuk biaya jaringan, keamanan, governance yang bermakna, atau pembagian nilai yang jelas; kemudian uji dengan data pengguna aktif, volume organik, pendapatan, developer, dan kompetisi. Metrik on-chain dapat dimanipulasi atau tidak relevan untuk beberapa desain, jadi jangan memilih satu angka favorit.",
      },
      {
        heading: "4. Risiko proyek tetap lebih besar dari spreadsheet",
        body:
          "Tokenomics yang rapi tidak meniadakan risiko smart contract, bridge, governance capture, regulasi, custody, atau tim yang berhenti membangun. Hindari proyek yang hanya menjual APR tinggi tanpa sumber yield yang transparan. Untuk alokasi altcoin, ukuran posisi harus jauh lebih kecil daripada keyakinan Anda terhadap narasinya.",
      },
    ],
    caseStudy: {
      title: "Mengapa market cap kecil belum tentu murah",
      scenario:
        "Token ABC diperdagangkan Rp2.000. Circulating supply-nya 1 miliar token, sementara total suplai 10 miliar token. Sebanyak 1,5 miliar token akan unlock dalam dua belas bulan berikutnya.",
      calculation: [
        "Market cap = Rp2.000 x 1 miliar = Rp2 triliun",
        "FDV = Rp2.000 x 10 miliar = Rp20 triliun",
        "Unlock 12 bulan = 1,5 miliar / 1 miliar circulating = tambahan potensial 150% dari suplai beredar saat ini",
        "Investor perlu menilai apakah permintaan dan likuiditas mampu menyerap pasokan tersebut, bukan hanya melihat harga token Rp2.000.",
      ],
      conclusion:
        "Harga per token tidak memberi ukuran murah atau mahal. Perbedaan Rp18 triliun antara FDV dan market cap menuntut pemeriksaan jadwal unlock dan utilitas yang jauh lebih ketat.",
    },
    redFlags: [
      "Menyebut token murah hanya karena harga per keping rendah tanpa menghitung suplai dan FDV.",
      "Mengabaikan cliff dan jadwal unlock milik tim atau investor awal.",
      "Mengejar APR tinggi tanpa memahami sumber yield, risiko smart contract, dan inflasi token.",
    ],
    actionChecklist: [
      "Catat circulating supply, total supply, FDV, dan tanggal unlock terdekat dari sumber proyek serta pihak independen.",
      "Uji narasi token dengan data pemakaian, keamanan, kompetitor, dan distribusi holder.",
      "Batasi nominal altcoin sebagai porsi spekulatif yang dapat turun sangat dalam atau menjadi nol.",
    ],
    quiz: {
      question: "Apa perbedaan inti market cap dan FDV?",
      options: [
        "Market cap memakai suplai beredar, FDV memakai total atau maksimum suplai",
        "FDV selalu lebih kecil dari market cap",
        "Keduanya hanya menghitung volume trading",
        "Keduanya menjamin nilai token",
      ],
      correctIndex: 0,
      explanation: "Market cap menilai token yang beredar sekarang, sementara FDV memperhitungkan seluruh suplai yang berpotensi beredar.",
    },
    quizzes: [
      {
        question: "Token harga Rp100 dengan 50 juta token beredar memiliki market cap berapa?",
        options: ["Rp5 juta", "Rp500 juta", "Rp5 miliar", "Rp50 miliar"],
        correctIndex: 2,
        explanation: "Rp100 x 50.000.000 = Rp5.000.000.000 atau Rp5 miliar.",
      },
      {
        question: "Mengapa unlock besar perlu dievaluasi?",
        options: ["Dapat menambah suplai potensial yang perlu diserap pasar", "Pasti membuat harga naik", "Menghapus risiko smart contract", "Membuat token menjadi Bitcoin"],
        correctIndex: 0,
        explanation: "Unlock tidak menentukan harga secara pasti, tetapi perubahan suplai dan pihak penerima penting untuk menilai risiko dilusi serta tekanan jual.",
      },
    ],
  },
  {
    id: "kripto-onchain-siklus",
    moduleNumber: 20,
    subTopic: "Siklus On-Chain, BTC.D & Altseason",
    plainTitle: "Membaca tanda-tanda euforia pasar kripto agar tidak terbawa suasana",
    title: "Indikator Siklus Kripto: Bitcoin Dominance (BTC.D), MVRV Z-Score, Fear & Greed & Rotasi Altseason",
    category: "Kripto",
    level: "Lanjutan",
    readTime: "16 menit",
    riskRating: "Sangat Tinggi",
    sources: PROPOSED_SOURCES_KRIPTO,
    summary:
      "Indikator siklus membantu mengatur ekspektasi, bukan memanggil puncak atau dasar. Pelajari BTC dominance, MVRV Z-Score, Fear & Greed, rotasi altcoin, dan bagaimana menggabungkan sinyal yang saling bertentangan.",
    keyTakeaways: [
      "BTC dominance mengukur porsi kapitalisasi Bitcoin terhadap total pasar kripto, bukan ukuran kepastian altseason.",
      "MVRV membandingkan nilai pasar dengan nilai realisasi dan lebih berguna sebagai konteks rezim daripada level jual otomatis.",
      "Fear & Greed menggambarkan sentimen agregat yang dapat bertahan ekstrem lebih lama dari ekspektasi investor.",
      "Rotasi dari BTC ke ETH dan altcoin tidak selalu terjadi, tidak selalu merata, dan banyak altcoin dapat tetap tertinggal atau gagal.",
    ],
    sections: [
      {
        heading: "1. Bitcoin dominance dan kepemimpinan pasar",
        body:
          "BTC dominance atau BTC.D dihitung dari kapitalisasi pasar Bitcoin dibanding kapitalisasi total aset kripto. Dominance yang naik dapat berarti Bitcoin memimpin atau altcoin turun lebih cepat; dominance yang turun dapat berarti altcoin menguat relatif atau suplai stablecoin berubah. Karena pembilang dan penyebutnya bergerak, jangan mengartikan satu arah tanpa melihat harga absolut serta komposisi pasar.",
      },
      {
        heading: "2. MVRV Z-Score dan nilai realisasi",
        body:
          "MVRV membandingkan market value dengan realized value, sementara Z-Score menstandardisasi jaraknya untuk memberi gambaran kondisi relatif terhadap sejarah. Indikator ini bisa menunjukkan euforia atau kapitulasinya pasar pada rezim tertentu, tetapi metodologi, data entitas, dan struktur pasar berubah dari siklus ke siklus. Gunakan sebagai penambah konteks untuk rencana take-profit atau akumulasi bertahap, bukan tombol tunggal.",
      },
      {
        heading: "3. Sentimen dan jebakan narasi altseason",
        body:
          "Fear & Greed mengompilasi data sentimen seperti volatilitas, momentum, dan pencarian, sehingga ekstrem greed memperingatkan risiko euforia namun tidak memberi tanggal balik arah. Narasi altseason sering membuat investor menurunkan standar due diligence dan masuk token berlikuiditas tipis. Kenaikan indeks altcoin tidak melindungi Anda dari dilusi, rug pull, atau risiko exchange pada token tertentu.",
      },
      {
        heading: "4. Bangun proses multi-sinyal",
        body:
          "Gabungkan data siklus dengan ukuran posisi, likuiditas, tokenomics, keamanan kustodi, dan target personal. Misalnya, ketika beberapa indikator menunjukkan euforia, investor dapat meninjau ulang bobot kripto yang melebihi target dan merealisasikan sebagian laba bertahap. Tujuan proses bukan menjual tepat puncak, tetapi mencegah satu periode euforia mengubah portofolio menjadi taruhan tanpa batas.",
      },
    ],
    caseStudy: {
      title: "Menjaga alokasi ketika euforia meningkat",
      scenario:
        "Portofolio awal Indra Rp150.000.000 menargetkan kripto 5% atau Rp7.500.000. Karena reli, nilai kriptonya menjadi Rp18.000.000 dan total portofolio menjadi Rp160.500.000. Ia melihat BTC.D menurun dan Fear & Greed sangat tinggi.",
      calculation: [
        "Bobot kripto saat ini = Rp18.000.000 / Rp160.500.000 = sekitar 11,2%",
        "Target kripto baru = 5% x Rp160.500.000 = Rp8.025.000",
        "Kelebihan terhadap target = Rp18.000.000 - Rp8.025.000 = Rp9.975.000",
        "Indra dapat membuat rencana bertahap untuk mengurangi sebagian risiko, bukan menganggap indikator menjamin puncak harga hari ini.",
      ],
      conclusion:
        "Data siklus memperkuat alasan meninjau risiko, tetapi keputusan Indra tetap berangkat dari target alokasi dan kebutuhan keuangannya sendiri.",
    },
    redFlags: [
      "Membeli altcoin apa pun karena BTC.D turun dan menyebutnya bukti altseason pasti terjadi.",
      "Menjual seluruh kepemilikan hanya karena satu indikator on-chain menyentuh area historis ekstrem.",
      "Membiarkan keuntungan kripto mengubah profil risiko portofolio dua kali lipat tanpa rebalancing.",
    ],
    actionChecklist: [
      "Pilih beberapa indikator dengan metodologi yang Anda pahami dan tulis apa yang masing-masing tidak bisa jelaskan.",
      "Tetapkan level atau jadwal rebalancing kripto sebelum kondisi greed ekstrem muncul.",
      "Periksa tokenomics, likuiditas, dan keamanan setiap aset altcoin meski indeks pasar terlihat kuat.",
    ],
    quiz: {
      question: "Apa yang diukur BTC dominance?",
      options: [
        "Porsi kapitalisasi Bitcoin terhadap total kapitalisasi pasar kripto", "Harga Bitcoin dalam rupiah", "Jumlah dompet Bitcoin", "Biaya gas Ethereum"],
      correctIndex: 0,
      explanation: "BTC.D adalah rasio kapitalisasi Bitcoin terhadap total pasar kripto. Interpretasinya perlu melihat perubahan pembilang dan penyebut.",
    },
    quizzes: [
      {
        question: "Mengapa Fear & Greed ekstrem tidak cukup menjadi sinyal jual otomatis?",
        options: ["Sentimen ekstrem dapat bertahan dan indikator tidak menentukan tanggal pembalikan", "Karena sentimen tidak pernah berubah", "Karena menghapus volatilitas", "Karena hanya mengukur obligasi"],
        correctIndex: 0,
        explanation: "Sentimen berguna sebagai konteks risiko, tetapi pasar dapat tetap euforia atau takut lebih lama dari ekspektasi.",
      },
      {
        question: "Jika kripto Rp12 juta dalam portofolio Rp120 juta dengan target 5%, tindakan disiplin yang mungkin adalah?",
        options: ["Meninjau pengurangan karena bobot 10% melebihi target", "Menambah tanpa batas", "Menghapus semua aset lain", "Mengabaikan bobot karena harga naik"],
        correctIndex: 0,
        explanation: "Bobot aktual 10% dua kali target 5%, sehingga rebalancing dapat mengelola risiko konsentrasi.",
      },
    ],
  },
  {
    id: "kripto-keamanan-wallet",
    moduleNumber: 21,
    subTopic: "Self-Custody, Cold Wallet & Siklus Altseason",
    plainTitle: "Cara mengamankan dompet kripto, menjaga kode pemulihan, dan bahaya utang lipat ganda (leverage)",
    title: "Keamanan Aset Digital & Manajemen Risiko: Exchange (CEX) vs Cold Wallet, Seed Phrase & Bahaya Leverage Futures",
    category: "Kripto",
    level: "Lanjutan",
    readTime: "16 menit",
    riskRating: "Sangat Tinggi",
    sources: PROPOSED_SOURCES_KRIPTO,
    summary:
      "Keamanan adalah bagian dari return. Bandingkan risiko kustodi CEX dan self-custody, lindungi seed phrase, uji transfer kecil, dan pahami mengapa leverage futures dapat melikuidasi modal sebelum tesis Anda terbukti benar.",
    keyTakeaways: [
      "CEX memberi kemudahan dan likuiditas, tetapi investor memikul risiko pihak lawan, pembatasan penarikan, dan keamanan akun.",
      "Self-custody memberi kontrol atas kunci privat sekaligus memindahkan tanggung jawab backup, phishing, dan kesalahan transfer kepada pengguna.",
      "Seed phrase dan private key tidak boleh dibagikan, difoto, diunggah ke cloud, atau dimasukkan ke situs yang tidak diverifikasi.",
      "Leverage futures memperbesar perubahan nilai dan dapat memicu likuidasi; ia berbeda secara mendasar dari pembelian spot dengan uang dingin.",
    ],
    sections: [
      {
        heading: "1. CEX versus cold wallet: dua profil risiko",
        body:
          "Centralized exchange memudahkan rupiah masuk-keluar, pencocokan order, dan pemulihan akun, tetapi Anda mempercayakan aset serta operasi kepada pihak ketiga. Cold wallet menyimpan kunci dalam perangkat atau metode offline sehingga mengurangi sebagian risiko online, namun kehilangan seed phrase dapat berarti kehilangan akses permanen. Tidak ada pilihan universal; ukuran aset, kemampuan operasional, dan kebutuhan likuiditas harus menentukan desain kustodi.",
      },
      {
        heading: "2. Seed phrase adalah kunci pemulihan penuh",
        body:
          "Seed phrase dapat memulihkan wallet pada perangkat lain, sehingga siapa pun yang memilikinya dapat mengambil aset tanpa membutuhkan ponsel Anda. Simpan offline pada media yang tahan, terpisah dari perangkat, dan jangan pernah memasukkannya ke formulir, DM, atau situs bantuan palsu. Uji proses pemulihan dengan jumlah kecil dan dokumentasi aman sebelum memindahkan nominal besar.",
      },
      {
        heading: "3. Transfer blockchain tidak seperti salah kirim bank",
        body:
          "Alamat, jaringan, memo, dan jenis token harus cocok. Transaksi blockchain umumnya tidak dapat dibatalkan setelah dikonfirmasi, sehingga satu karakter alamat atau jaringan yang salah dapat membuat aset sulit atau mustahil dipulihkan. Gunakan address book, verifikasi beberapa karakter awal-akhir, lakukan test transfer kecil, dan waspadai malware clipboard yang mengganti alamat tujuan.",
      },
      {
        heading: "4. Leverage futures dapat menghancurkan manajemen risiko",
        body:
          "Pada futures, margin mengendalikan posisi yang lebih besar dari modal sehingga penurunan kecil dapat menghapus margin melalui likuidasi. Funding rate, biaya, slippage, dan volatilitas 24/7 menambah risiko bahkan jika arah jangka panjang Anda benar. Bagi investor pendidikan, spot dengan alokasi kecil dan tanpa utang jauh lebih mudah diaudit daripada mencoba memulihkan kerugian dengan leverage.",
      },
    ],
    caseStudy: {
      title: "Mengapa leverage 10x mengubah risiko",
      scenario:
        "Fajar memiliki Rp5.000.000. Pada pembelian spot, ia membeli BTC senilai Rp5.000.000. Pada alternatif futures long 10x, ia memakai Rp5.000.000 sebagai margin untuk mengendalikan posisi Rp50.000.000. Harga kemudian turun 8%.",
      calculation: [
        "Kerugian spot 8% = Rp5.000.000 x 8% = Rp400.000; nilai tersisa sekitar Rp4.600.000 sebelum biaya",
        "Kerugian nominal posisi futures = Rp50.000.000 x 8% = Rp4.000.000 sebelum funding dan biaya",
        "Kerugian futures menghabiskan sekitar 80% margin Rp5.000.000 dan dapat mendekati likuidasi tergantung maintenance margin serta harga eksekusi",
        "Dua posisi memiliki pandangan harga sama, tetapi jalur bertahan modal sangat berbeda.",
      ],
      conclusion:
        "Leverage tidak membuat risiko lebih kecil; ia mempercepat dampak volatilitas. Fajar memilih spot atau tidak masuk ketika tidak dapat menjelaskan skenario rugi terburuknya.",
    },
    redFlags: [
      "Memberikan seed phrase, private key, kode 2FA, atau OTP kepada pihak yang mengaku dukungan pelanggan.",
      "Mengirim seluruh saldo ke alamat baru tanpa test transfer dan verifikasi jaringan.",
      "Membuka futures berleverage untuk mengejar kerugian spot atau karena yakin altseason pasti datang.",
      "Menyimpan seluruh aset di satu tempat tanpa memahami risiko pihak lawan maupun risiko kehilangan self-custody.",
    ],
    actionChecklist: [
      "Aktifkan password unik, authenticator-based 2FA, anti-phishing code, dan withdrawal whitelist bila tersedia.",
      "Buat rencana kustodi tertulis: nominal di CEX untuk likuiditas dan nominal self-custody yang benar-benar mampu Anda amankan.",
      "Lakukan test transfer kecil, periksa network dan address, lalu tunggu konfirmasi sebelum mengirim nominal besar.",
      "Tolak leverage sampai Anda mampu menghitung liquidation risk, biaya, dan batas kerugian tanpa mengganggu keuangan inti.",
    ],
    quiz: {
      question: "Informasi mana yang tidak boleh dibagikan kepada siapa pun?",
      options: ["Alamat publik wallet", "Seed phrase", "Nama jaringan", "Hash transaksi publik"],
      correctIndex: 1,
      explanation: "Seed phrase dapat memulihkan dan mengendalikan wallet. Siapa pun yang memilikinya dapat mengambil aset Anda.",
    },
    quizzes: [
      {
        question: "Mengapa test transfer kecil dianjurkan sebelum mengirim nominal besar?",
        options: ["Untuk memverifikasi alamat, jaringan, dan proses penerimaan", "Untuk menghapus semua fee", "Untuk menjamin harga naik", "Untuk mengubah seed phrase"],
        correctIndex: 0,
        explanation: "Transaksi blockchain umumnya tidak dapat dibatalkan, sehingga test transfer mengurangi risiko kesalahan operasional yang mahal.",
      },
      {
        question: "Pada posisi long futures 10x, penurunan harga 8% terutama berbahaya karena?",
        options: ["Kerugian dihitung atas posisi yang jauh lebih besar dari margin", "Harga spot tidak bergerak", "Seed phrase menjadi publik", "Pajak otomatis nol"],
        correctIndex: 0,
        explanation: "Leverage memperbesar eksposur; penurunan 8% pada posisi 10x dapat menyerap sebagian besar margin dan mendekatkan likuidasi.",
      },
      {
        question: "Perbedaan utama self-custody dibanding menyimpan aset di CEX adalah?",
        options: ["Kontrol kunci privat sekaligus tanggung jawab penuh atas backup dan keamanan", "Tidak ada risiko apa pun", "Tidak perlu memahami alamat", "Selalu lebih likuid dari CEX"],
        correctIndex: 0,
        explanation: "Self-custody mengurangi ketergantungan pada pihak ketiga tetapi memindahkan risiko kehilangan kunci dan kesalahan operasional kepada pengguna.",
      },
    ],
  },
];

const CATEGORY_LEARNING_ORDER: Record<AssetCategory, number> = {
  Dasar: 0,
  "Reksa Dana": 1,
  Emas: 2,
  Saham: 3,
  Kripto: 4,
};

const LEVEL_LEARNING_ORDER: Record<DifficultyLevel, number> = {
  Pemula: 0,
  Menengah: 1,
  Lanjutan: 2,
};

export function getSequentialLearningModules(): EducationModule[] {
  return [...EDUCATION_MODULES].sort((a, b) => {
    const aIsFoundation = a.category === "Dasar" ? 0 : 1;
    const bIsFoundation = b.category === "Dasar" ? 0 : 1;
    if (aIsFoundation !== bIsFoundation) {
      return aIsFoundation - bIsFoundation;
    }

    const levelDiff = LEVEL_LEARNING_ORDER[a.level] - LEVEL_LEARNING_ORDER[b.level];
    if (levelDiff !== 0) {
      return levelDiff;
    }

    const categoryDiff =
      CATEGORY_LEARNING_ORDER[a.category] - CATEGORY_LEARNING_ORDER[b.category];
    if (categoryDiff !== 0) {
      return categoryDiff;
    }

    return a.moduleNumber - b.moduleNumber;
  });
}

export function getNextRecommendedModule(completedIds: readonly string[]): EducationModule | null {
  const completedSet = new Set(completedIds);
  const ordered = getSequentialLearningModules();
  return ordered.find((mod) => !completedSet.has(mod.id)) ?? null;
}

export function hasCompletedCategoryPrerequisites(
  module: EducationModule,
  completedIds: readonly string[]
): boolean {
  if (module.level !== "Lanjutan") {
    return true;
  }
  const completedSet = new Set(completedIds);
  const prerequisites = EDUCATION_MODULES.filter(
    (candidate) =>
      candidate.category === module.category &&
      (candidate.level === "Pemula" || candidate.level === "Menengah")
  );
  return prerequisites.every((prereq) => completedSet.has(prereq.id));
}

export const EMERGENCY_FUND_MODULE_ID = "dasar-tujuan-dana-darurat";

export const RECOMMENDATION_ASSET_MODULE_MAP: Record<
  "reksaDanaPasarUangObligasi" | "emas" | "saham" | "kripto",
  string[]
> = {
  reksaDanaPasarUangObligasi: ["reksadana-dasar", "reksadana-sbn-ritel"],
  emas: ["emas-safe-haven"],
  saham: ["saham-fundamental"],
  kripto: ["kripto-fundamental", "kripto-keamanan-wallet"],
};

export function getEducationModulesByIds(ids: readonly string[]): EducationModule[] {
  const byId = new Map(EDUCATION_MODULES.map((mod) => [mod.id, mod]));
  return ids
    .map((id) => byId.get(id))
    .filter((mod): mod is EducationModule => Boolean(mod));
}


