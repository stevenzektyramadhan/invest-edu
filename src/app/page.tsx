"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ASSET_OVERVIEW, EDUCATION_MODULES, type AssetCategory } from "@/data/education";
import { generateRecommendation, type MacroRegime } from "@/lib/recommendation";
import { MODULES_STORAGE_KEY, RISK_STORAGE_KEY, SYNC_EVENT_NAME } from "@/lib/user-sync";
import {
  BookOpen,
  Compass,
  BarChart3,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Calculator,
  CheckCircle2,
  Activity,
  Layers,
  Coins,
  Wallet,
} from "lucide-react";

function formatIDR(val: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(val);
}

const LIVE_TICKERS = [
  { symbol: "IHSG", price: "7.243,50", change: "+0,42%", up: true, category: "Indeks" },
  { symbol: "S&P 500", price: "5.864,20", change: "+0,78%", up: true, category: "Global" },
  { symbol: "Emas (PAXG)", price: "Rp 42.150.000", change: "+0,35%", up: true, category: "Komoditas" },
  { symbol: "Bitcoin", price: "Rp 1.485.200.000", change: "+2,15%", up: true, category: "Kripto" },
  { symbol: "USD / IDR", price: "Rp 15.845", change: "-0,12%", up: false, category: "Forex" },
];

const ASSET_ICONS: Record<AssetCategory, typeof Activity> = {
  "Reksa Dana": Layers,
  Emas: Coins,
  Saham: TrendingUp,
  Kripto: Activity,
};

const DCA_PRESETS = [
  { label: "500 Rb", val: 500_000 },
  { label: "1 Jt", val: 1_000_000 },
  { label: "2,5 Jt", val: 2_500_000 },
  { label: "5 Jt", val: 5_000_000 },
];

export default function HomePage() {
  const [completedCount, setCompletedCount] = useState(0);
  const [savedScore, setSavedScore] = useState<number>(10);
  const [savedMacro, setSavedMacro] = useState<MacroRegime>("netral");
  const [monthlySave, setMonthlySave] = useState<number>(1_000_000);
  const [years, setYears] = useState<number>(5);
  const [annualReturn, setAnnualReturn] = useState<number>(10);

  const readSavedState = () => {
    try {
      const mods = localStorage.getItem(MODULES_STORAGE_KEY);
      if (mods) {
        const parsed: unknown = JSON.parse(mods);
        if (Array.isArray(parsed)) setCompletedCount(parsed.length);
      } else {
        setCompletedCount(0);
      }

      const risk = localStorage.getItem(RISK_STORAGE_KEY);
      if (risk) {
        const parsed: unknown = JSON.parse(risk);
        if (!parsed || typeof parsed !== "object") return;
        const savedRisk = parsed as { answers?: Record<string, number>; macroRegime?: MacroRegime };
        if (savedRisk.answers) {
          const sum = Object.values(savedRisk.answers).reduce((a, b) => a + b, 0);
          setSavedScore(sum);
        }
        if (savedRisk.macroRegime) {
          setSavedMacro(savedRisk.macroRegime);
        }
      }
    } catch {
      // Ignored: fallback to defaults
    }
  };

  useEffect(() => {
    const hydrationTimer = window.setTimeout(readSavedState, 0);
    window.addEventListener(SYNC_EVENT_NAME, readSavedState);
    return () => {
      window.clearTimeout(hydrationTimer);
      window.removeEventListener(SYNC_EVENT_NAME, readSavedState);
    };
  }, []);

  const rec = generateRecommendation(savedScore, savedMacro);

  // Compounding DCA calculation
  const months = years * 12;
  const monthlyRate = annualReturn / 100 / 12;
  const totalPrincipal = monthlySave * months;
  const futureValue =
    monthlyRate > 0
      ? monthlySave * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)
      : totalPrincipal;
  const totalProfit = Math.max(0, futureValue - totalPrincipal);
  const profitPercentage = totalPrincipal > 0 ? (totalProfit / totalPrincipal) * 100 : 0;
  const principalShare = futureValue > 0 ? (totalPrincipal / futureValue) * 100 : 100;
  const completionPercent = Math.min(100, Math.round((completedCount / EDUCATION_MODULES.length) * 100));

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Live Market Ticker Strip */}
      <section aria-label="Ticker pasar real-time" className="rounded-lg border border-neutral-800 bg-panel p-2 sm:p-2.5">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-none text-xs">
          <div className="flex items-center gap-2 px-2.5 py-1 shrink-0 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 font-medium text-[11px]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse motion-reduce:animate-none" aria-hidden="true" />
            <span>Pantauan Pasar</span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            {LIVE_TICKERS.map((ticker) => (
              <div key={ticker.symbol} className="flex items-center gap-2">
                <span className="font-semibold text-neutral-200">{ticker.symbol}</span>
                <span className="text-neutral-400 text-[11px]">{ticker.price}</span>
                <span className={`inline-flex items-center text-[11px] font-semibold ${ticker.up ? "text-emerald-400" : "text-rose-400"}`}>
                  {ticker.change}
                </span>
              </div>
            ))}
          </div>
          <Link
            href="/market"
            className="ml-auto shrink-0 inline-flex items-center gap-1 text-[11px] font-medium text-neutral-400 hover:text-neutral-100 px-2 py-0.5 rounded hover:bg-neutral-800 active:scale-95 transition-colors"
          >
            <span>Buka Terminal Pasar</span>
            <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* Hero Section: Technical Minimalist */}
      <section className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-panel p-6 sm:p-10 lg:p-12 bg-grid-workstation">
        <div className="relative max-w-3xl space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 rounded-md border border-neutral-700 bg-neutral-800/80 px-3 py-1 text-xs font-medium text-neutral-300">
              <Sparkles className="h-3.5 w-3.5 text-neutral-400" aria-hidden="true" />
              <span>InvestEdu Intelligent Engine v2.4</span>
            </div>
            <span className="rounded-md border border-neutral-800 bg-neutral-900 px-3 py-1 text-xs text-neutral-400">
              Rezim Makro: {rec.macro.label}
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-neutral-100 sm:text-4xl lg:text-5xl leading-tight">
            Alokasi Aset Presisi Berbasis Profil Risiko &amp; Siklus Makroekonomi
          </h1>

          <p className="text-sm leading-relaxed text-neutral-400 sm:text-base">
            Pelajari karakteristik fundamental instrumen keuangan global dan domestik. Dapatkan formula alokasi terukur untuk menjaga daya beli serta mengoptimalkan imbal hasil jangka panjang.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/recommendation"
              className="inline-flex items-center gap-2 rounded-md bg-neutral-100 px-5 py-2.5 text-xs font-semibold text-neutral-950 shadow-sm hover:bg-white transition-colors"
            >
              <Compass className="h-4 w-4" aria-hidden="true" />
              <span>Simulasi Rekomendasi Portofolio</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>

            <Link
              href="/education"
              className="inline-flex items-center gap-2 rounded-md border border-neutral-800 bg-neutral-900/90 px-5 py-2.5 text-xs font-medium text-neutral-300 hover:border-neutral-700 hover:bg-neutral-800 hover:text-white transition-colors"
            >
              <BookOpen className="h-4 w-4 text-neutral-400" aria-hidden="true" />
              <span>Mulai Belajar ({EDUCATION_MODULES.length} Modul)</span>
            </Link>

            <Link
              href="/market"
              className="inline-flex items-center gap-2 rounded-md border border-neutral-800 bg-neutral-900/50 px-4 py-2.5 text-xs font-medium text-neutral-300 hover:border-neutral-700 hover:bg-neutral-900 transition-colors"
            >
              <BarChart3 className="h-4 w-4 text-neutral-400" aria-hidden="true" />
              <span>Pantau Pasar Live</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Cockpit Status Strip: Bento Style */}
      <section aria-label="Status portofolio dan edukasi" className="grid gap-4 md:grid-cols-3">
        {/* Card 1: Profil Risiko */}
        <div className="relative rounded-xl border border-neutral-800 bg-panel p-5 flex flex-col justify-between hover:border-neutral-700 transition-colors">
          <div>
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span>Profil Risiko Personal</span>
              <ShieldCheck className="h-4 w-4 text-neutral-400" aria-hidden="true" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-neutral-100">{rec.profile}</span>
              <span className="rounded bg-neutral-800 px-2 py-0.5 text-[11px] font-medium text-neutral-300">
                Skor: {savedScore}/20
              </span>
            </div>
            <p className="mt-1 text-xs text-neutral-400">
              Ekspektasi Return: <span className="font-semibold text-emerald-400">{rec.expectedAnnualReturn}</span>
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-neutral-800">
            <Link
              href="/recommendation"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-300 hover:text-white transition-colors"
            >
              <span>Ubah Parameter Kuesioner &amp; Makro</span>
              <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Card 2: Alokasi Aset Ideal */}
        <div className="relative rounded-xl border border-neutral-800 bg-panel p-5 flex flex-col justify-between hover:border-neutral-700 transition-colors">
          <div>
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span>Alokasi Disarankan</span>
              <TrendingUp className="h-4 w-4 text-neutral-400" aria-hidden="true" />
            </div>
            <div className="mt-3">
              {/* Visual Segmented Bar */}
              <div className="flex h-2.5 w-full overflow-hidden rounded bg-neutral-800">
                <div style={{ width: `${rec.allocation.reksaDanaPasarUangObligasi}%` }} className="bg-neutral-500" title={`Reksa Dana ${rec.allocation.reksaDanaPasarUangObligasi}%`} />
                <div style={{ width: `${rec.allocation.emas}%` }} className="bg-amber-600/80" title={`Emas ${rec.allocation.emas}%`} />
                <div style={{ width: `${rec.allocation.saham}%` }} className="bg-neutral-300" title={`Saham ${rec.allocation.saham}%`} />
                <div style={{ width: `${rec.allocation.kripto}%` }} className="bg-neutral-600" title={`Kripto ${rec.allocation.kripto}%`} />
              </div>
              <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1 text-xs font-medium">
                <span className="inline-flex items-center gap-1 text-neutral-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-neutral-500" aria-hidden="true" />
                  RD {rec.allocation.reksaDanaPasarUangObligasi}%
                </span>
                <span className="inline-flex items-center gap-1 text-amber-400/90">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" aria-hidden="true" />
                  Emas {rec.allocation.emas}%
                </span>
                <span className="inline-flex items-center gap-1 text-neutral-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-neutral-300" aria-hidden="true" />
                  Saham {rec.allocation.saham}%
                </span>
                <span className="inline-flex items-center gap-1 text-neutral-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-neutral-600" aria-hidden="true" />
                  Kripto {rec.allocation.kripto}%
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
            <span>Rezim: {rec.macro.label}</span>
            <Link href="/recommendation" className="font-medium text-neutral-300 hover:text-white">
              Detail Alokasi
            </Link>
          </div>
        </div>

        {/* Card 3: Progres Belajar */}
        <div className="relative rounded-xl border border-neutral-800 bg-panel p-5 flex flex-col justify-between hover:border-neutral-700 transition-colors">
          <div>
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span>Kurikulum Edukasi</span>
              <CheckCircle2 className="h-4 w-4 text-neutral-400" aria-hidden="true" />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <div className="text-2xl font-bold text-neutral-100">
                {completedCount} <span className="text-sm font-normal text-neutral-400">/ {EDUCATION_MODULES.length} Selesai</span>
              </div>
              <span className="text-xs font-semibold text-neutral-300">{completionPercent}%</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded bg-neutral-800">
              <div
                className="h-full rounded bg-neutral-300"
                style={{ width: `${completionPercent}%`, transition: "width 500ms ease" }}
              />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-neutral-800">
            <Link
              href="/education"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-300 hover:text-white transition-colors"
            >
              <span>{completedCount > 0 ? "Lanjutkan Pembelajaran" : "Mulai Modul Pertama"}</span>
              <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4 Core Asset Classes: Modern Bento Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-neutral-100 sm:text-2xl">
              4 Pilar Instrumen Keuangan
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              Pahami profil risiko, likuiditas, dan peran masing-masing instrumen dalam portofolio Anda.
            </p>
          </div>
          <Link
            href="/education"
            className="inline-flex items-center gap-1 text-xs font-medium text-neutral-400 hover:text-white transition-colors"
          >
            <span>Buka Silabus Lengkap</span>
            <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(Object.keys(ASSET_OVERVIEW) as AssetCategory[]).map((asset) => {
            const item = ASSET_OVERVIEW[asset];
            const Icon = ASSET_ICONS[asset];
            return (
              <Link
                key={asset}
                href="/education"
                className="group relative flex flex-col justify-between rounded-xl border border-neutral-800 bg-panel p-5 hover:border-neutral-700 hover:bg-panel-elevated transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-neutral-800 text-neutral-300 group-hover:bg-neutral-700 transition-colors">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </div>
                      <h3 className="text-sm font-bold text-neutral-100 group-hover:text-white transition-colors">
                        {asset}
                      </h3>
                    </div>
                    <span className="rounded border border-neutral-800 bg-neutral-900 px-2 py-0.5 text-[10px] font-medium text-neutral-400">
                      {item.riskProfile}
                    </span>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-neutral-400">
                    {item.tagline}
                  </p>
                </div>

                <div className="mt-5 space-y-2 border-t border-neutral-800 pt-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-500 text-[11px]">Ekspektasi Return</span>
                    <span className="font-semibold text-emerald-400">{item.expectedReturn}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-500 text-[11px]">Horizon Investasi</span>
                    <span className="font-medium text-neutral-300">{item.horizon}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-500 text-[11px]">Likuiditas</span>
                    <span className="font-medium text-neutral-300">{item.liquidity}</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-end text-[11px] font-medium text-neutral-400 group-hover:text-white transition-colors">
                  <span className="inline-flex items-center gap-1">
                    Pelajari Modul
                    <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Interactive DCA & Compounding Simulator */}
      <section className="rounded-2xl border border-neutral-800 bg-panel p-6 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          {/* Controls Left Column */}
          <div className="space-y-5 lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-md bg-neutral-800 px-3 py-1 text-xs font-medium text-neutral-300 border border-neutral-700">
              <Calculator className="h-3.5 w-3.5 text-neutral-400" aria-hidden="true" />
              <span>Simulasi Dollar Cost Averaging (DCA)</span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-neutral-100 sm:text-2xl">
                Kekuatan Bunga Majemuk dalam Investasi Rutin
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-neutral-400 sm:text-sm">
                Disiplin menyisihkan modal setiap bulan dengan return tahunan yang realistis menciptakan efek bola salju untuk portofolio Anda.
              </p>
            </div>

            <div className="space-y-4 pt-1">
              {/* Input 1: Modal Bulanan */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="dca-monthly" className="text-xs font-medium text-neutral-300">
                    Investasi Rutin Bulanan
                  </label>
                  <span className="text-xs font-semibold text-neutral-100">{formatIDR(monthlySave)}</span>
                </div>
                <div className="flex gap-2">
                  <input
                    id="dca-monthly"
                    type="number"
                    min={100000}
                    step={250000}
                    value={monthlySave}
                    onChange={(e) => setMonthlySave(Math.max(0, Number(e.target.value)))}
                    className="w-full rounded-md border border-neutral-800 bg-background px-3 py-2 text-sm font-semibold text-white focus:border-neutral-600 focus:outline-none"
                  />
                </div>
                {/* Presets */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[11px] text-neutral-500">Preset:</span>
                  {DCA_PRESETS.map((preset) => (
                    <button
                      key={preset.val}
                      type="button"
                      onClick={() => setMonthlySave(preset.val)}
                      className={`rounded px-2.5 py-1 text-[11px] font-medium transition-colors ${
                        monthlySave === preset.val
                          ? "bg-neutral-100 text-neutral-950 font-semibold"
                          : "border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-neutral-200"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sliders */}
              <div className="grid gap-4 sm:grid-cols-2 pt-2">
                {/* Slider Durasi */}
                <div className="space-y-1.5 rounded-lg border border-neutral-800 bg-background p-3">
                  <div className="flex justify-between items-center">
                    <label htmlFor="dca-years" className="text-xs font-medium text-neutral-300">
                      Jangka Waktu
                    </label>
                    <span className="text-xs font-semibold text-neutral-100">{years} Tahun</span>
                  </div>
                  <input
                    id="dca-years"
                    type="range"
                    min={1}
                    max={25}
                    value={years}
                    onChange={(e) => setYears(Number(e.target.value))}
                    className="w-full accent-neutral-300"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-500">
                    <span>1 Thn</span>
                    <span>10 Thn</span>
                    <span>25 Thn</span>
                  </div>
                </div>

                {/* Slider Return */}
                <div className="space-y-1.5 rounded-lg border border-neutral-800 bg-background p-3">
                  <div className="flex justify-between items-center">
                    <label htmlFor="dca-return" className="text-xs font-medium text-neutral-300">
                      Ekspektasi Return
                    </label>
                    <span className="text-xs font-semibold text-emerald-400">{annualReturn}% / thn</span>
                  </div>
                  <input
                    id="dca-return"
                    type="range"
                    min={4}
                    max={20}
                    step={1}
                    value={annualReturn}
                    onChange={(e) => setAnnualReturn(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-500">
                    <span>4% (Konservatif)</span>
                    <span>10% (Moderat)</span>
                    <span>20% (Agresif)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Visual Card Right Column */}
          <div className="rounded-xl border border-neutral-800 bg-background p-6 space-y-5 lg:col-span-5 shadow-lg">
            <div>
              <span className="text-xs font-medium text-neutral-400">
                Proyeksi Nilai Akumulasi ({years} Tahun)
              </span>
              <div className="mt-1 text-3xl font-bold text-neutral-100 sm:text-4xl">
                {formatIDR(Math.round(futureValue))}
              </div>
              <p className="mt-1 text-xs text-neutral-400">
                Pertumbuhan modal: <span className="font-semibold text-emerald-400">+{profitPercentage.toFixed(1)}%</span> dari modal awal
              </p>
            </div>

            {/* Split Visual Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-medium text-neutral-400">
                <span>Porsi Modal Pokok ({principalShare.toFixed(0)}%)</span>
                <span>Porsi Bunga Majemuk ({(100 - principalShare).toFixed(0)}%)</span>
              </div>
              <div className="flex h-3 w-full overflow-hidden rounded bg-neutral-800">
                <div style={{ width: `${principalShare}%` }} className="bg-neutral-600" title="Modal Disetor" />
                <div style={{ width: `${100 - principalShare}%` }} className="bg-emerald-500" title="Bunga Majemuk" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-neutral-800 pt-4 text-xs">
              <div className="rounded-lg border border-neutral-800 bg-panel p-3">
                <div className="flex items-center gap-1.5 text-neutral-400 text-[11px]">
                  <Wallet className="h-3 w-3" aria-hidden="true" />
                  <span>Total Modal Disetor</span>
                </div>
                <div className="mt-1.5 font-semibold text-neutral-200 text-sm">
                  {formatIDR(Math.round(totalPrincipal))}
                </div>
              </div>

              <div className="rounded-lg border border-neutral-800 bg-panel p-3">
                <div className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
                  <TrendingUp className="h-3 w-3" aria-hidden="true" />
                  <span>Hasil Bunga Majemuk</span>
                </div>
                <div className="mt-1.5 font-semibold text-emerald-400 text-sm">
                  +{formatIDR(Math.round(totalProfit))}
                </div>
              </div>
            </div>

            <Link
              href="/recommendation"
              className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-neutral-900 border border-neutral-800 py-2.5 text-xs font-medium text-neutral-300 hover:border-neutral-700 hover:text-white transition-colors"
            >
              <span>Sesuaikan dengan Portofolio Rekomendasi</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
