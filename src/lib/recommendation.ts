export type RiskProfileType = "Konservatif" | "Moderat" | "Agresif";

export type MacroRegime =
  | "ekspansi"
  | "netral"
  | "bunga_tinggi"
  | "krisis_inflasi";

export interface MacroRegimeInfo {
  id: MacroRegime;
  label: string;
  subtitle: string;
  indicators: string;
  impactSummary: string;
}

export interface AllocationBreakdown {
  reksaDanaPasarUangObligasi: number; // %
  emas: number; // %
  saham: number; // %
  kripto: number; // %
}

export interface PortfolioRecommendation {
  profile: RiskProfileType;
  score: number;
  macro: MacroRegimeInfo;
  allocation: AllocationBreakdown;
  expectedAnnualReturn: string;
  maxHistoricalDrawdown: string;
  rationale: string;
  tacticalActions: string[];
  instrumentDetails: {
    asset: string;
    percentage: number;
    color: string;
    specificInstruments: string;
    roleInPortfolio: string;
  }[];
}

export const MACRO_REGIMES: MacroRegimeInfo[] = [
  {
    id: "netral",
    label: "Ekonomi Stabil / Transisi",
    subtitle: "Inflasi terkendali (2–3.5%), suku bunga stabil",
    indicators: "BI Rate ~5.75% - 6.00% | Pertumbuhan PDB ~5.0%",
    impactSummary:
      "Kondisi ideal untuk alokasi berimbang sesuai profil dasar tanpa deviasi ekstrem.",
  },
  {
    id: "ekspansi",
    label: "Ekspansi & Pemangkasan Bunga",
    subtitle: "Bank sentral menurunkan suku bunga, likuiditas melonggar",
    indicators: "Tren Bunga Turun | Likuiditas M2 Meningkat",
    impactSummary:
      "Positif bagi aset berisiko (Saham & Kripto) serta Obligasi jangka panjang.",
  },
  {
    id: "bunga_tinggi",
    label: "Suku Bunga Tinggi & Ketat",
    subtitle: "Bank sentral menahan bunga tinggi untuk meredam inflasi",
    indicators: "Yield SBN Tinggi | Biaya Modal Korporasi Naik",
    impactSummary:
      "Menguntungkan Reksa Dana Pasar Uang/SBN; menekan valuasi aset spekulatif.",
  },
  {
    id: "krisis_inflasi",
    label: "Gejolak Geopolitik & Inflasi",
    subtitle: "Ketidakpastian global tinggi, harga komoditas berfluktuasi",
    indicators: "VIX Naik | Permintaan Safe-Haven Meningkat",
    impactSummary:
      "Emas dan Kas (RDPU) menjadi benteng utama pelindung nilai portofolio.",
  },
];

export interface RiskQuestion {
  id: string;
  question: string;
  options: {
    label: string;
    points: number;
  }[];
}

export const RISK_QUESTIONS: RiskQuestion[] = [
  {
    id: "horizon",
    question: "1. Berapa lama jangka waktu sebelum dana investasi ini akan Anda gunakan?",
    options: [
      { label: "Kurang dari 1 – 2 tahun (Jangka Pendek)", points: 1 },
      { label: "Antara 3 – 5 tahun (Jangka Menengah)", points: 2 },
      { label: "Lebih dari 5 tahun (Jangka Panjang)", points: 3 },
    ],
  },
  {
    id: "drawdown",
    question:
      "2. Jika nilai portofolio Anda turun 20% dalam waktu 1 bulan karena gejolak pasar, apa tindakan Anda?",
    options: [
      { label: "Langsung menjual seluruh aset agar tidak rugi lebih dalam", points: 1 },
      { label: "Menahan (Hold) dan menunggu pasar pulih sembari evaluasi", points: 2 },
      { label: "Membeli lebih banyak (Average Down) di harga diskon", points: 3 },
    ],
  },
  {
    id: "emergency_fund",
    question: "3. Bagaimana kondisi Dana Darurat Anda saat ini?",
    options: [
      { label: "Belum memiliki dana darurat terpisah (< 3x pengeluaran bulanan)", points: 1 },
      { label: "Sudah memiliki 3 – 6x pengeluaran bulanan di tabungan/RDPU", points: 2 },
      { label: "Sangat aman (> 6 – 12x pengeluaran bulanan) dan bebas utang konsumtif", points: 3 },
    ],
  },
  {
    id: "income",
    question: "4. Seberapa stabil arus penghasilan bulanan Anda untuk menabung rutin?",
    options: [
      { label: "Belum menentu / sering terpakai untuk kebutuhan pokok", points: 1 },
      { label: "Cukup stabil, bisa menyisihkan 10% – 20% penghasilan setiap bulan", points: 2 },
      { label: "Sangat stabil dengan surplus kas > 25% setiap bulan", points: 3 },
    ],
  },
  {
    id: "experience",
    question: "5. Sejauh mana pengalaman Anda berinvestasi di pasar keuangan?",
    options: [
      { label: "Pemula (Baru mengenal deposito, emas, atau reksa dana pasar uang)", points: 1 },
      { label: "Menengah (Pernah berinvestasi di saham Blue Chip atau obligasi)", points: 2 },
      { label: "Berpengalaman (Paham laporan keuangan, siklus makro, dan volatilitas kripto)", points: 3 },
    ],
  },
];

const BASE_ALLOCATION: Record<RiskProfileType, AllocationBreakdown> = {
  Konservatif: {
    reksaDanaPasarUangObligasi: 65,
    emas: 25,
    saham: 10,
    kripto: 0,
  },
  Moderat: {
    reksaDanaPasarUangObligasi: 40,
    emas: 20,
    saham: 35,
    kripto: 5,
  },
  Agresif: {
    reksaDanaPasarUangObligasi: 15,
    emas: 15,
    saham: 55,
    kripto: 15,
  },
};

// ponytail: deterministic tactical tilt table; upgrade to dynamic covariance optimizer only if historical backtester is requested
const MACRO_TILT: Record<MacroRegime, AllocationBreakdown> = {
  netral: { reksaDanaPasarUangObligasi: 0, emas: 0, saham: 0, kripto: 0 },
  ekspansi: { reksaDanaPasarUangObligasi: -10, emas: -5, saham: +10, kripto: +5 },
  bunga_tinggi: { reksaDanaPasarUangObligasi: +10, emas: 0, saham: -5, kripto: -5 },
  krisis_inflasi: { reksaDanaPasarUangObligasi: +5, emas: +10, saham: -10, kripto: -5 },
};

export function classifyRiskScore(totalScore: number): RiskProfileType {
  if (totalScore <= 8) return "Konservatif";
  if (totalScore <= 12) return "Moderat";
  return "Agresif";
}

export function generateRecommendation(
  totalScore: number,
  macroId: MacroRegime
): PortfolioRecommendation {
  const profile = classifyRiskScore(totalScore);
  const base = BASE_ALLOCATION[profile];
  const tilt = MACRO_TILT[macroId];
  const macro = MACRO_REGIMES.find((m) => m.id === macroId) || MACRO_REGIMES[0];

  let rd = Math.max(5, base.reksaDanaPasarUangObligasi + tilt.reksaDanaPasarUangObligasi);
  const emas = Math.max(5, base.emas + tilt.emas);
  const saham = Math.max(0, base.saham + tilt.saham);
  let kripto = Math.max(0, base.kripto + tilt.kripto);

  // If conservative, cap crypto at 0 unless expansion where max 5%
  if (profile === "Konservatif" && macroId !== "ekspansi") {
    rd += kripto;
    kripto = 0;
  }

  // Normalize so sum is exactly 100%
  const sum = rd + emas + saham + kripto;
  if (sum !== 100) {
    rd += 100 - sum;
  }

  const allocation: AllocationBreakdown = {
    reksaDanaPasarUangObligasi: rd,
    emas,
    saham,
    kripto,
  };

  const expectedReturnMap: Record<RiskProfileType, string> = {
    Konservatif: "6% – 8.5% / tahun",
    Moderat: "9% – 13% / tahun",
    Agresif: "14% – 22% / tahun",
  };

  const drawdownMap: Record<RiskProfileType, string> = {
    Konservatif: "-2% s/d -5%",
    Moderat: "-8% s/d -15%",
    Agresif: "-20% s/d -35%",
  };

  const rationale = `Berdasarkan skor risiko Anda (${totalScore}/15), profil Anda adalah ${profile}. Dalam rezim ekonomi "${macro.label}", mesin alokasi melakukan penyesuaian taktis untuk mengoptimalkan imbal hasil sekaligus menjaga ketahanan modal.`;

  const tacticalActions: string[] = [
    profile === "Konservatif"
      ? "Prioritaskan keamanan modal pokok pada Reksa Dana Pasar Uang (RDPU), SBN Ritel (ORI/SR/ST), dan Emas."
      : profile === "Moderat"
      ? "Gunakan strategi Core-Satellite: 60% aset stabil (RDPT/Emas) dan 40% aset pertumbuhan (Saham Blue Chip & Bitcoin)."
      : "Fokus pada akumulasi bertahap (DCA) di Saham berfundamental kuat dan Bitcoin, sambil tetap menyisihkan 15%–30% kas/emas untuk amunisi saat koreksi.",
    macroId === "ekspansi"
      ? "Kondisi suku bunga melandai mendukung peningkatan porsi Saham sensitif bunga (Perbankan/Teknologi) dan Reksa Dana Pendapatan Tetap."
      : macroId === "bunga_tinggi"
      ? "Kunci kupon tinggi pada SBN/RDPU dan hindari perusahaan dengan rasio utang (DER) tinggi."
      : macroId === "krisis_inflasi"
      ? "Tingkatkan porsi Emas sebagai pelindung nilai (hedging) terhadap inflasi dan depresiasi mata uang."
      : "Pertahankan disiplin Dollar Cost Averaging (DCA) setiap bulan dan lakukan rebalancing setiap 6 bulan.",
  ];

  const instrumentDetails = [
    {
      asset: "Reksa Dana (RDPU & Obligasi/SBN)",
      percentage: allocation.reksaDanaPasarUangObligasi,
      color: "#10b981", // emerald-500
      specificInstruments:
        profile === "Konservatif"
          ? "RD Pasar Uang, SBN Ritel (SBR/ST), RD Pendapatan Tetap"
          : "RD Pendapatan Tetap (Obligasi Negara/Korporasi) & Kas RDPU",
      roleInPortfolio: "Penjaga likuiditas, arus kas kupon stabil & peredam volatilitas",
    },
    {
      asset: "Emas (Safe Haven)",
      percentage: allocation.emas,
      color: "#f59e0b", // amber-500
      specificInstruments: "Emas Batangan (Antam/UBS) atau Emas Digital Berizin Bappebti",
      roleInPortfolio: "Pelindung daya beli terhadap inflasi & asuransi risiko geopolitik",
    },
    {
      asset: "Saham (Ekuitas)",
      percentage: allocation.saham,
      color: "#0ea5e9", // sky-500
      specificInstruments:
        profile === "Konservatif"
          ? "Reksa Dana Indeks IDX30 / Saham Big Banks Dividen"
          : "Saham Blue Chip LQ45, Perbankan, Consumer & Sektor Komoditas",
      roleInPortfolio: "Mesin pertumbuhan modal jangka panjang (Capital Gain & Dividen)",
    },
    {
      asset: "Aset Kripto",
      percentage: allocation.kripto,
      color: "#a855f7", // purple-500
      specificInstruments:
        allocation.kripto > 0
          ? "Mayoritas Bitcoin (BTC) 80% + Ethereum (ETH) 20% (Tanpa Leverage)"
          : "Tidak disarankan untuk profil risiko & kondisi makro saat ini",
      roleInPortfolio: "Akselerator imbal hasil asimetris dengan manajemen risiko ketat",
    },
  ];

  return {
    profile,
    score: totalScore,
    macro,
    allocation,
    expectedAnnualReturn: expectedReturnMap[profile],
    maxHistoricalDrawdown: drawdownMap[profile],
    rationale,
    tacticalActions,
    instrumentDetails,
  };
}
