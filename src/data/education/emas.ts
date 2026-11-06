import { type EducationModule, PROPOSED_SOURCES_EMAS } from "./types";

export const EMAS_MODULES: EducationModule[] = [
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
];
