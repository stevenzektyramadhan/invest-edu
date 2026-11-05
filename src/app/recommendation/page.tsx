"use client";

import { useState, useEffect } from "react";
import {
  MACRO_REGIMES,
  RISK_QUESTIONS,
  generateRecommendation,
  type MacroRegime,
} from "@/lib/recommendation";
import {
  Compass,
  Globe2,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Wallet,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import {
  RISK_STORAGE_KEY,
  SYNC_EVENT_NAME,
  pushUserStateToCloud,
} from "@/lib/user-sync";

const CAPITAL_PRESETS = [1_000_000, 10_000_000, 50_000_000, 100_000_000];

function formatIDR(val: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(val);
}

export default function RecommendationPage() {
  const [answers, setAnswers] = useState<Record<string, number>>({
    horizon: 2,
    drawdown: 2,
    emergency_fund: 2,
    income: 2,
    experience: 2,
  });
  const [macroRegime, setMacroRegime] = useState<MacroRegime>("netral");
  const [capital, setCapital] = useState<number>(10_000_000);

  useEffect(() => {
    const reloadRiskState = () => {
      try {
        const saved = localStorage.getItem(RISK_STORAGE_KEY);
        if (!saved) return;
        const parsed = JSON.parse(saved);
        if (parsed.answers) setAnswers(parsed.answers);
        if (parsed.macroRegime) setMacroRegime(parsed.macroRegime);
        if (parsed.capital) setCapital(parsed.capital);
      } catch {
      }
    };
    const hydrationTimer = window.setTimeout(reloadRiskState, 0);
    window.addEventListener(SYNC_EVENT_NAME, reloadRiskState);
    return () => {
      window.clearTimeout(hydrationTimer);
      window.removeEventListener(SYNC_EVENT_NAME, reloadRiskState);
    };
  }, []);

  const updateState = (
    nextAnswers: Record<string, number>,
    nextMacro: MacroRegime,
    nextCapital: number
  ) => {
    try {
      localStorage.setItem(
        RISK_STORAGE_KEY,
        JSON.stringify({
          answers: nextAnswers,
          macroRegime: nextMacro,
          capital: nextCapital,
        })
      );
      void pushUserStateToCloud({
        riskState: { answers: nextAnswers, macroRegime: nextMacro, capital: nextCapital },
      });
    } catch {
    }
  };

  const totalScore = Object.values(answers).reduce((acc, v) => acc + v, 0);
  const recommendation = generateRecommendation(totalScore, macroRegime);

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30 p-6 sm:p-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
          <Compass className="h-3.5 w-3.5" />
          <span>Smart Asset Allocation Engine</span>
        </div>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Rekomendasi Portofolio Berbasis Profil Risiko & Ekonomi Makro
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-400">
          Jawab 5 pertanyaan profil risiko dan pilih kondisi ekonomi makro saat
          ini untuk mendapatkan simulasi alokasi Saham, Reksa Dana, Emas, dan
          Kripto yang terukur.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Column: Questionnaire & Macro Selector */}
        <div className="space-y-6 lg:col-span-7">
          {/* Macroeconomic Condition Selector */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 sm:p-6">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Globe2 className="h-4 w-4 text-sky-400" />
              <span>Langkah 1: Pilih Kondisi Ekonomi Makro Saat Ini</span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Siklus suku bunga dan inflasi menentukan bobot taktis portofolio
              Anda.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {MACRO_REGIMES.map((regime) => {
                const isSelected = macroRegime === regime.id;
                return (
                  <button
                    key={regime.id}
                    onClick={() => {
                      setMacroRegime(regime.id);
                      updateState(answers, regime.id, capital);
                    }}
                    className={`rounded-xl border p-3.5 text-left transition-all ${
                      isSelected
                        ? "border-sky-500 bg-sky-500/10 shadow-md shadow-sky-500/10"
                        : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">
                        {regime.label}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="h-4 w-4 text-sky-400 shrink-0" />
                      )}
                    </div>
                    <p className="mt-1 text-[11px] text-slate-400">
                      {regime.subtitle}
                    </p>
                    <div className="mt-2 rounded bg-slate-900 px-2 py-1 text-[10px] font-mono text-sky-300">
                      {regime.indicators}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Risk Questionnaire */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Langkah 2: Kuesioner Profil Risiko Investor</span>
              </div>
              <button
                onClick={() => {
                  const def = {
                    horizon: 2,
                    drawdown: 2,
                    emergency_fund: 2,
                    income: 2,
                    experience: 2,
                  };
                  setAnswers(def);
                  updateState(def, macroRegime, capital);
                }}
                className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white"
              >
                <RotateCcw className="h-3 w-3" /> Reset
              </button>
            </div>

            <div className="space-y-5">
              {RISK_QUESTIONS.map((q) => (
                <div
                  key={q.id}
                  className="space-y-2.5 border-b border-slate-800/80 pb-4 last:border-none last:pb-0"
                >
                  <p className="text-xs font-semibold text-slate-200 sm:text-sm">
                    {q.question}
                  </p>
                  <div className="space-y-2">
                    {q.options.map((opt) => {
                      const active = answers[q.id] === opt.points;
                      return (
                        <button
                          key={opt.points}
                          onClick={() => {
                            const next = { ...answers, [q.id]: opt.points };
                            setAnswers(next);
                            updateState(next, macroRegime, capital);
                          }}
                          className={`flex w-full items-center justify-between rounded-lg border px-3.5 py-2.5 text-left text-xs transition-colors ${
                            active
                              ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-200 font-medium"
                              : "border-slate-800 bg-slate-950/70 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                          }`}
                        >
                          <span>{opt.label}</span>
                          <span className="ml-2 rounded bg-slate-900 px-1.5 py-0.5 text-[10px] text-slate-400 shrink-0">
                            {opt.points} poin
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Portfolio Recommendation Result */}
        <div className="space-y-6 lg:col-span-5">
          <div className="sticky top-20 space-y-6 rounded-2xl border border-sky-500/30 bg-slate-900/80 p-5 sm:p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-medium text-slate-400">
                  Hasil Profil Risiko Anda
                </span>
                <div className="mt-0.5 flex items-center gap-2">
                  <span className="text-2xl font-extrabold text-white">
                    {recommendation.profile}
                  </span>
                  <span className="rounded-full bg-sky-500/15 px-2.5 py-0.5 text-xs font-semibold text-sky-400 border border-sky-500/30">
                    Skor {recommendation.score}/15
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">
                  Rezim Makro
                </span>
                <span className="text-xs font-semibold text-emerald-400">
                  {recommendation.macro.label}
                </span>
              </div>
            </div>

            {/* Capital Simulator Input */}
            <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950 p-3.5">
              <div className="flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1.5 font-semibold text-slate-300">
                  <Wallet className="h-3.5 w-3.5 text-sky-400" />
                  Simulasi Modal Investasi (Rp)
                </span>
                <span className="font-bold text-sky-400">
                  {formatIDR(capital)}
                </span>
              </div>
              <input
                type="number"
                min={100000}
                step={500000}
                value={capital}
                onChange={(e) => {
                  const val = Math.max(0, Number(e.target.value));
                  setCapital(val);
                  updateState(answers, macroRegime, val);
                }}
                className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white focus:border-sky-500 focus:outline-none"
              />
              <div className="flex flex-wrap gap-1.5 pt-1">
                {CAPITAL_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => {
                      setCapital(preset);
                      updateState(answers, macroRegime, preset);
                    }}
                    className={`rounded px-2 py-1 text-[11px] font-medium transition-colors ${
                      capital === preset
                        ? "bg-sky-600 text-white"
                        : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    {formatIDR(preset)}
                  </button>
                ))}
              </div>
            </div>

            {/* Stacked Visual Allocation Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span>Komposisi Alokasi Portofolio</span>
                <span>Total 100%</span>
              </div>
              <div className="flex h-4 w-full overflow-hidden rounded-full bg-slate-950 p-0.5 border border-slate-800">
                {recommendation.instrumentDetails.map(
                  (item) =>
                    item.percentage > 0 && (
                      <div
                        key={item.asset}
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: item.color,
                        }}
                        className="h-full transition-all duration-300 first:rounded-l-full last:rounded-r-full"
                        title={`${item.asset}: ${item.percentage}%`}
                      />
                    )
                )}
              </div>
            </div>

            {/* Detailed Asset Breakdown */}
            <div className="space-y-3">
              {recommendation.instrumentDetails.map((item) => {
                const nominal = (capital * item.percentage) / 100;
                return (
                  <div
                    key={item.asset}
                    className="rounded-xl border border-slate-800/90 bg-slate-950/70 p-3.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-3 w-3 rounded-full shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-xs font-bold text-white">
                          {item.asset}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-extrabold text-white">
                          {item.percentage}%
                        </span>
                        <span className="ml-2 text-xs font-semibold text-sky-400">
                          ({formatIDR(nominal)})
                        </span>
                      </div>
                    </div>
                    <p className="mt-1.5 text-[11px] text-slate-300">
                      <strong className="text-slate-400">Instrumen: </strong>
                      {item.specificInstruments}
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      Fungsi: {item.roleInPortfolio}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Expected Return & Max Drawdown */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Estimasi Imbal Hasil</span>
                </div>
                <div className="mt-1 text-sm font-bold text-emerald-400">
                  {recommendation.expectedAnnualReturn}
                </div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                  <span>Risiko Fluktuasi</span>
                </div>
                <div className="mt-1 text-sm font-bold text-amber-400">
                  {recommendation.maxHistoricalDrawdown}
                </div>
              </div>
            </div>

            {/* Tactical Actions */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-sky-400">
                Strategi Eksekusi & Alasan Makro
              </div>
              <p className="text-xs leading-relaxed text-slate-300">
                {recommendation.rationale}
              </p>
              <ul className="space-y-1.5 pt-1 text-xs text-slate-300">
                {recommendation.tacticalActions.map((act, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
