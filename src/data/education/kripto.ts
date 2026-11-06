import { type EducationModule, PROPOSED_SOURCES_KRIPTO } from "./types";

export const KRIPTO_MODULES: EducationModule[] = [
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
