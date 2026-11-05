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
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Calculator,
  CheckCircle2,
} from "lucide-react";

function formatIDR(val: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(val);
}

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
          const sum = Object.values(savedRisk.answers).reduce(
            (a, b) => a + b,
            0
          );
          setSavedScore(sum);
        }
        if (savedRisk.macroRegime) {
          setSavedMacro(savedRisk.macroRegime);
        }
      }
    } catch {
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

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-sky-950/60 p-6 sm:p-10">
        <div className="max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3.5 py-1 text-xs font-semibold text-sky-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Platform Edukasi & Strategi Investasi Multi-Aset</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Bangun Portofolio Cerdas Sesuai{" "}
            <span className="text-sky-400">Profil Risiko</span> &{" "}
            <span className="text-emerald-400">Siklus Ekonomi</span>
          </h1>

          <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
            Pelajari fundamental <strong>Saham, Reksa Dana, Emas, dan Kripto</strong>,
            temukan komposisi alokasi aset paling optimal untuk kondisi makro
            hari ini, dan pantau pergerakan pasar secara real-time.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/recommendation"
              className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-sky-500/25 hover:bg-sky-400 transition-colors"
            >
              <Compass className="h-4 w-4" />
              <span>Simulasi Rekomendasi Portofolio</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/education"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/90 px-5 py-3 text-sm font-semibold text-slate-200 hover:border-slate-600 hover:bg-slate-800 transition-colors"
            >
              <BookOpen className="h-4 w-4 text-sky-400" />
              <span>Mulai Belajar ({EDUCATION_MODULES.length} Modul)</span>
            </Link>
            <Link
              href="/market"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm font-semibold text-emerald-400 hover:border-emerald-500/40 transition-colors"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Pantau Pasar Live</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Personalized Status Strip */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Profil Risiko Aktif</span>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-xl font-extrabold text-white">
                {rec.profile}
              </span>
              <span className="rounded bg-sky-500/15 px-2 py-0.5 text-[11px] font-semibold text-sky-400">
                Target {rec.expectedAnnualReturn}
              </span>
            </div>
            <Link
              href="/recommendation"
              className="mt-2 inline-block text-xs font-semibold text-sky-400 hover:underline"
            >
              Ubah Kuesioner & Makro →
            </Link>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-400">
            <ShieldCheck className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Alokasi Disarankan</span>
            <div className="mt-1 text-xs font-semibold text-slate-200 space-x-2">
              <span className="text-emerald-400">
                RD: {rec.allocation.reksaDanaPasarUangObligasi}%
              </span>
              <span className="text-amber-400">Emas: {rec.allocation.emas}%</span>
              <span className="text-sky-400">Saham: {rec.allocation.saham}%</span>
              <span className="text-purple-400">
                Kripto: {rec.allocation.kripto}%
              </span>
            </div>
            <p className="mt-2 text-[11px] text-slate-400">
              Rezim: {rec.macro.label}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
            <TrendingUp className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Kurikulum Edukasi</span>
            <div className="mt-1 text-xl font-extrabold text-white">
              {completedCount} / {EDUCATION_MODULES.length} Selesai
            </div>
            <Link
              href="/education"
              className="mt-2 inline-block text-xs font-semibold text-emerald-400 hover:underline"
            >
              Lanjutkan Belajar →
            </Link>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>
      </section>

      {/* 4 Core Asset Classes */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">
              4 Instrumen Utama yang Wajib Dipahami
            </h2>
            <p className="text-xs text-slate-400">
              Setiap kelas aset memiliki peran berbeda dalam menjaga dan
              menumbuhkan kekayaan.
            </p>
          </div>
          <Link
            href="/education"
            className="text-xs font-semibold text-sky-400 hover:underline"
          >
            Lihat Semua Materi →
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(Object.keys(ASSET_OVERVIEW) as AssetCategory[]).map((asset) => {
            const item = ASSET_OVERVIEW[asset];
            return (
              <Link
                key={asset}
                href="/education"
                className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-5 transition-all hover:border-sky-500/50 hover:bg-slate-900"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white group-hover:text-sky-400 transition-colors">
                    {asset}
                  </h3>
                  <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-300">
                    {item.riskProfile}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">
                  {item.tagline}
                </p>
                <div className="mt-4 space-y-1 border-t border-slate-800/80 pt-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Estimasi Return:</span>
                    <span className="font-semibold text-emerald-400">
                      {item.expectedReturn}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Horizon Ideal:</span>
                    <span className="font-medium text-slate-300">
                      {item.horizon}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Likuiditas:</span>
                    <span className="font-medium text-slate-300">
                      {item.liquidity}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Interactive DCA & Compounding Calculator */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="space-y-4 lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
              <Calculator className="h-3.5 w-3.5" />
              <span>Kalkulator Bunga Majemuk (DCA)</span>
            </div>
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              Simulasi Pertumbuhan Investasi Rutin Bulanan
            </h2>
            <p className="text-xs leading-relaxed text-slate-400">
              Konsistensi menabung setiap bulan (Dollar Cost Averaging) dipadukan
              dengan efek compounding mampu melipatgandakan nilai portofolio Anda
              dalam jangka panjang.
            </p>

            <div className="grid gap-4 sm:grid-cols-3 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Investasi / Bulan (Rp)
                </label>
                <input
                  type="number"
                  min={100000}
                  step={250000}
                  value={monthlySave}
                  onChange={(e) =>
                    setMonthlySave(Math.max(0, Number(e.target.value)))
                  }
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm font-bold text-white focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Durasi ({years} Tahun)
                </label>
                <input
                  type="range"
                  min={1}
                  max={25}
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full accent-sky-500 mt-2"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>1 Thn</span>
                  <span>10 Thn</span>
                  <span>25 Thn</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Target Return ({annualReturn}% / thn)
                </label>
                <input
                  type="range"
                  min={4}
                  max={20}
                  step={1}
                  value={annualReturn}
                  onChange={(e) => setAnnualReturn(Number(e.target.value))}
                  className="w-full accent-emerald-500 mt-2"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>4% (RDPU)</span>
                  <span>10% (Moderat)</span>
                  <span>20% (Agresif)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 lg:col-span-5">
            <div>
              <span className="text-xs text-slate-400">
                Estimasi Nilai Akhir Portofolio ({years} Tahun)
              </span>
              <div className="mt-1 text-2xl font-extrabold text-emerald-400 sm:text-3xl">
                {formatIDR(Math.round(futureValue))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-slate-800 pt-3 text-xs">
              <div>
                <span className="text-slate-500 block">Total Modal Disetor</span>
                <span className="font-bold text-slate-200">
                  {formatIDR(Math.round(totalPrincipal))}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">
                  Hasil Bunga Majemuk
                </span>
                <span className="font-bold text-sky-400">
                  +{formatIDR(Math.round(totalProfit))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
