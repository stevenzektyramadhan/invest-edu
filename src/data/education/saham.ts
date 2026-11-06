import { type EducationModule, PROPOSED_SOURCES_SAHAM } from "./types";

export const SAHAM_MODULES: EducationModule[] = [
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
];
