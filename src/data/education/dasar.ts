import { type EducationModule, PROPOSED_SOURCES_DASAR } from "./types";

export const DASAR_MODULES: EducationModule[] = [
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
];
