import { type EducationModule, PROPOSED_SOURCES_REKSADANA } from "./types";

export const REKSA_DANA_MODULES: EducationModule[] = [
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
];
