import { RECOMMENDATION_ASSET_MODULE_MAP } from "@/data/education";

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

export interface RiskAnswers {
  horizon?: number;
  drawdown?: number;
  emergency_fund?: number;
  income?: number;
  experience?: number;
  [key: string]: number | undefined;
}

export interface AssetScenarioAssumption {
  label: string;
  badAnnualPct: number;
  baseAnnualPct: number;
  goodAnnualPct: number;
  stressDrawdownPct: number;
  source: string;
  period: string;
}

export interface ReturnScenarios {
  badPct: number;
  basePct: number;
  goodPct: number;
}

export interface PortfolioRecommendation {
  profile: RiskProfileType;
  score: number;
  macro: MacroRegimeInfo;
  allocation: AllocationBreakdown;
  scenarios: ReturnScenarios;
  worstCaseDrawdownPct: number;
  expectedAnnualReturn: string;
  maxHistoricalDrawdown: string;
  rationale: string;
  reasons: string[];
  tacticalActions: string[];
  instrumentDetails: {
    asset: string;
    percentage: number;
    color: string;
    specificInstruments: string;
    roleInPortfolio: string;
    relatedModuleIds: string[];
  }[];
}

// ponytail: static illustrative scenario & stress table; TODO(owner) to verify official historical series
export const ASSET_SCENARIO_ASSUMPTIONS: Record<
  keyof AllocationBreakdown,
  AssetScenarioAssumption
> = {
  reksaDanaPasarUangObligasi: {
    label: "Reksa Dana Pasar Uang & SBN",
    badAnnualPct: 2,
    baseAnnualPct: 5,
    goodAnnualPct: 7,
    stressDrawdownPct: -3,
    source: "TODO(owner): verifikasi — asumsi ilustratif RDPU/SBN Ritel (DJPPR Kemenkeu / OJK)",
    period: "TODO(owner): verifikasi periode acuan",
  },
  emas: {
    label: "Emas",
    badAnnualPct: -8,
    baseAnnualPct: 6,
    goodAnnualPct: 15,
    stressDrawdownPct: -15,
    source: "TODO(owner): verifikasi — asumsi ilustratif emas IDR (Logam Mulia / LBMA)",
    period: "TODO(owner): verifikasi periode acuan",
  },
  saham: {
    label: "Saham",
    badAnnualPct: -20,
    baseAnnualPct: 9,
    goodAnnualPct: 18,
    stressDrawdownPct: -35,
    source: "TODO(owner): verifikasi — asumsi ilustratif indeks saham domestik (BEI / IDX)",
    period: "TODO(owner): verifikasi periode acuan",
  },
  kripto: {
    label: "Aset Kripto",
    badAnnualPct: -55,
    baseAnnualPct: 15,
    goodAnnualPct: 45,
    stressDrawdownPct: -75,
    source: "TODO(owner): verifikasi — asumsi ilustratif aset kripto utama BTC/ETH",
    period: "TODO(owner): verifikasi periode acuan",
  },
};

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

function roundOneDecimal(value: number): number {
  return Math.round(value * 10) / 10;
}

function formatSignedPercent(value: number): string {
  const prefix = value > 0 ? "+" : "";
  return `${prefix}${value}%`;
}

export function computePortfolioScenarios(allocation: AllocationBreakdown): {
  scenarios: ReturnScenarios;
  worstCaseDrawdownPct: number;
} {
  const keys = Object.keys(ASSET_SCENARIO_ASSUMPTIONS) as (keyof AllocationBreakdown)[];
  let bad = 0;
  let base = 0;
  let good = 0;
  let stress = 0;

  for (const key of keys) {
    const weight = allocation[key] / 100;
    const assumption = ASSET_SCENARIO_ASSUMPTIONS[key];
    bad += weight * assumption.badAnnualPct;
    base += weight * assumption.baseAnnualPct;
    good += weight * assumption.goodAnnualPct;
    stress += weight * assumption.stressDrawdownPct;
  }

  return {
    scenarios: {
      badPct: roundOneDecimal(bad),
      basePct: roundOneDecimal(base),
      goodPct: roundOneDecimal(good),
    },
    worstCaseDrawdownPct: roundOneDecimal(stress),
  };
}

function normalizeAnswerPoint(value: number | undefined): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return 2;
  return Math.min(3, Math.max(1, Math.round(value)));
}

export function classifyRiskProfile(answers: RiskAnswers): RiskProfileType {
  const a = {
    horizon: normalizeAnswerPoint(answers.horizon),
    drawdown: normalizeAnswerPoint(answers.drawdown),
    emergency_fund: normalizeAnswerPoint(answers.emergency_fund),
    income: normalizeAnswerPoint(answers.income),
    experience: normalizeAnswerPoint(answers.experience),
  };
  const capacity = Math.min(a.horizon, a.emergency_fund, a.income);
  const tolerance = Math.round((a.drawdown + a.experience) / 2);
  const level = Math.min(capacity, tolerance);
  if (level <= 1) return "Konservatif";
  if (level === 2) return "Moderat";
  return "Agresif";
}

function buildProfileReasons(
  profile: RiskProfileType,
  totalScore: number,
  answers?: RiskAnswers
): string[] {
  if (!answers) {
    return [`Profil ${profile} ditentukan dari total skor kuesioner (${totalScore}/15).`];
  }

  const reasons: string[] = [];
  const horizon = normalizeAnswerPoint(answers.horizon);
  const drawdown = normalizeAnswerPoint(answers.drawdown);
  const emergencyFund = normalizeAnswerPoint(answers.emergency_fund);
  const income = normalizeAnswerPoint(answers.income);
  const experience = normalizeAnswerPoint(answers.experience);

  if (emergencyFund === 1) {
    reasons.push(
      "Dana darurat belum ada (< 3× pengeluaran bulanan), jadi prioritas pertama adalah membangunnya; profil dibatasi maksimal Konservatif dan porsi kripto dikunci 0%."
    );
  } else if (emergencyFund === 2) {
    reasons.push(
      "Dana darurat sudah tersedia (3–6× pengeluaran bulanan) sebagai penyangga kebutuhan mendadak."
    );
  } else {
    reasons.push(
      "Dana darurat sangat aman (> 6× pengeluaran bulanan) dan bebas utang konsumtif, sehingga fondasi kas keluarga terjaga."
    );
  }

  if (horizon === 1) {
    reasons.push(
      "Horizon investasi Anda jangka pendek (< 2 tahun), sehingga porsi saham dibatasi maksimal 10% dan kripto 0% agar modal pokok tidak tergerus volatilitas."
    );
  } else if (horizon === 2) {
    reasons.push(
      "Horizon investasi Anda menengah (3–5 tahun), sehingga portofolio memadukan aset stabil dan aset pertumbuhan secara berimbang."
    );
  } else {
    reasons.push(
      "Horizon investasi Anda > 5 tahun, sehingga porsi saham bisa lebih besar karena ada waktu untuk melewati naik-turun pasar."
    );
  }

  if (income === 1) {
    reasons.push(
      "Arus penghasilan bulanan belum menentu, sehingga kemampuan menanggung risiko dibatasi pada level Konservatif."
    );
  } else if (income === 2) {
    reasons.push(
      "Arus penghasilan bulanan cukup stabil (bisa menyisihkan 10%–20%), mendukung cicilan investasi berkala."
    );
  } else {
    reasons.push(
      "Arus penghasilan bulanan sangat stabil (surplus kas > 25%), memberi ruang kapasitas risiko yang lebih longgar."
    );
  }

  if (drawdown === 1) {
    reasons.push(
      "Jika portofolio turun 20% Anda cenderung langsung menjual, sehingga porsi aset bergejolak ditekan agar tidak memicu jual panik."
    );
  } else if (drawdown === 2) {
    reasons.push(
      "Saat pasar turun 20% Anda memilih menahan dan mengevaluasi, sesuai dengan fluktuasi portofolio tingkat menengah."
    );
  } else {
    reasons.push(
      "Saat pasar turun 20% Anda siap menambah muatan di harga diskon, menunjukkan toleransi fluktuasi yang tinggi."
    );
  }

  if (experience === 1) {
    reasons.push(
      "Pengalaman investasi masih di tahap pemula (deposito, emas, atau RDPU), sehingga instrumen yang mudah dipahami lebih diutamakan."
    );
  } else if (experience === 2) {
    reasons.push(
      "Anda sudah mengenal saham blue chip atau obligasi, sehingga siap mengelola kombinasi aset pasar modal."
    );
  } else {
    reasons.push(
      "Anda sudah memahami laporan keuangan dan siklus pasar, mendukung pengelolaan porsi aset agresif."
    );
  }

  return reasons;
}

function lowerFirstUnlessPronoun(text: string): string {
  if (text.startsWith("Anda ")) return text;
  return text.charAt(0).toLowerCase() + text.slice(1);
}

function buildProfileRationale(
  profile: RiskProfileType,
  macroLabel: string,
  reasons: string[]
): string {
  const clauses = reasons.map((reason) => {
    const firstClause = reason.split(",")[0].replace(/\.$/, "").trim();
    return lowerFirstUnlessPronoun(firstClause);
  });
  if (clauses.length <= 1) {
    return `Profil ${profile} direkomendasikan karena ${clauses[0] ?? "jawaban kuesioner Anda"} pada asumsi "${macroLabel}".`;
  }
  return `Profil ${profile} direkomendasikan karena ${clauses.slice(0, -1).join("; ")}; serta ${clauses[clauses.length - 1]} (asumsi siklus: "${macroLabel}").`;
}

/**
 * @deprecated Use classifyRiskProfile(answers) to separate risk capacity from risk tolerance.
 */
export function classifyRiskScore(totalScore: number): RiskProfileType {
  if (totalScore <= 8) return "Konservatif";
  if (totalScore <= 12) return "Moderat";
  return "Agresif";
}

export function generateRecommendation(
  totalScore: number,
  macroId: MacroRegime,
  answers?: RiskAnswers
): PortfolioRecommendation {
  let profile = answers ? classifyRiskProfile(answers) : classifyRiskScore(totalScore);
  if (answers?.emergency_fund === 1) {
    profile = "Konservatif";
  }

  const base = BASE_ALLOCATION[profile];
  const tilt = MACRO_TILT[macroId];
  const macro = MACRO_REGIMES.find((m) => m.id === macroId) || MACRO_REGIMES[0];

  let rd = Math.max(5, base.reksaDanaPasarUangObligasi + tilt.reksaDanaPasarUangObligasi);
  const emas = Math.max(5, base.emas + tilt.emas);
  let saham = Math.max(0, base.saham + tilt.saham);
  let kripto = Math.max(0, base.kripto + tilt.kripto);

  // If conservative, cap crypto at 0 unless expansion where max 5%
  if (profile === "Konservatif" && macroId !== "ekspansi") {
    rd += kripto;
    kripto = 0;
  }

  if (answers?.emergency_fund === 1) {
    rd += kripto;
    kripto = 0;
  }

  if (answers?.horizon === 1) {
    rd += kripto;
    kripto = 0;
    if (saham > 10) {
      rd += saham - 10;
      saham = 10;
    }
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

  const { scenarios, worstCaseDrawdownPct } = computePortfolioScenarios(allocation);
  const expectedAnnualReturn = `Skenario ilustratif: Buruk ${formatSignedPercent(scenarios.badPct)} · Dasar ${formatSignedPercent(scenarios.basePct)} · Baik ${formatSignedPercent(scenarios.goodPct)} / tahun`;
  const maxHistoricalDrawdown = `Sekitar ${worstCaseDrawdownPct}% (ilustratif)`;

  const reasons = buildProfileReasons(profile, totalScore, answers);
  const rationale = buildProfileRationale(profile, macro.label, reasons);
  const stablePct = allocation.reksaDanaPasarUangObligasi + allocation.emas;
  const growthPct = allocation.saham + allocation.kripto;
  const growthDetail =
    allocation.kripto > 0
      ? `Saham ${allocation.saham}% + Kripto ${allocation.kripto}%`
      : `Saham ${allocation.saham}%`;

  const tacticalActions: string[] = [
    ...(answers?.emergency_fund === 1
      ? [
          "Bangun dana darurat 3–6× pengeluaran bulanan di tabungan terpisah atau RDPU sebelum menambah aset berisiko.",
        ]
      : []),
    profile === "Konservatif"
      ? `Prioritaskan keamanan modal pokok dengan ${stablePct}% aset stabil (RDPU/Obligasi ${allocation.reksaDanaPasarUangObligasi}% + Emas ${allocation.emas}%) dan ${growthPct}% aset pertumbuhan (${growthDetail}).`
      : profile === "Moderat"
      ? `Gunakan strategi Core-Satellite: ${stablePct}% aset stabil (RDPU/Obligasi ${allocation.reksaDanaPasarUangObligasi}% + Emas ${allocation.emas}%) dan ${growthPct}% aset pertumbuhan (${growthDetail}).`
      : `Fokus pada akumulasi bertahap (DCA) pada ${growthPct}% aset pertumbuhan (${growthDetail}), sambil tetap menyisihkan ${stablePct}% aset stabil (RDPU/Obligasi ${allocation.reksaDanaPasarUangObligasi}% + Emas ${allocation.emas}%) untuk penyangga saat koreksi.`,
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
          ? "Contoh kategori: RD Pasar Uang, SBN Ritel (SBR/ST), RD Pendapatan Tetap"
          : "Contoh kategori: RD Pendapatan Tetap (Obligasi Negara/Korporasi) & Kas RDPU",
      roleInPortfolio: "Penjaga likuiditas, arus kas kupon stabil & peredam volatilitas",
      relatedModuleIds: RECOMMENDATION_ASSET_MODULE_MAP.reksaDanaPasarUangObligasi,
    },
    {
      asset: "Emas (Safe Haven)",
      percentage: allocation.emas,
      color: "#f59e0b", // amber-500
      specificInstruments: "Emas Batangan (Antam/UBS) atau Emas Digital Berizin Bappebti",
      roleInPortfolio: "Pelindung daya beli terhadap inflasi & asuransi risiko geopolitik",
      relatedModuleIds: RECOMMENDATION_ASSET_MODULE_MAP.emas,
    },
    {
      asset: "Saham (Ekuitas)",
      percentage: allocation.saham,
      color: "#0ea5e9", // sky-500
      specificInstruments:
        profile === "Konservatif"
          ? "Contoh kategori: Reksa Dana Indeks IDX30 / Saham Big Banks Dividen"
          : "Contoh kategori: Saham Blue Chip LQ45, Perbankan, Consumer & Sektor Komoditas",
      roleInPortfolio: "Mesin pertumbuhan modal jangka panjang (Capital Gain & Dividen)",
      relatedModuleIds: RECOMMENDATION_ASSET_MODULE_MAP.saham,
    },
    {
      asset: "Aset Kripto",
      percentage: allocation.kripto,
      color: "#a855f7", // purple-500
      specificInstruments:
        allocation.kripto > 0
          ? "Contoh ilustrasi pembagian (bukan instruksi beli): Bitcoin (BTC) 80% + Ethereum (ETH) 20% (Tanpa Leverage)"
          : "Tidak disarankan untuk profil risiko & kondisi makro saat ini",
      roleInPortfolio: "Akselerator imbal hasil asimetris dengan manajemen risiko ketat",
      relatedModuleIds: RECOMMENDATION_ASSET_MODULE_MAP.kripto,
    },
  ];

  return {
    profile,
    score: totalScore,
    macro,
    allocation,
    scenarios,
    worstCaseDrawdownPct,
    expectedAnnualReturn,
    maxHistoricalDrawdown,
    rationale,
    reasons,
    tacticalActions,
    instrumentDetails,
  };
}
