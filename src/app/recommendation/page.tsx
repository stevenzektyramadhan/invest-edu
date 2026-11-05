"use client";

import { useState, useEffect } from "react";
import {
  ASSET_SCENARIO_ASSUMPTIONS,
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
  const recommendation = generateRecommendation(totalScore, macroRegime, answers);
  const hasHardGuardrail =
    answers.emergency_fund === 1 || answers.horizon === 1;
  const worstCaseLossFraction = Math.abs(recommendation.worstCaseDrawdownPct) / 100;
  const worstCaseLossAmount = Math.round(capital * worstCaseLossFraction);
  const worstCaseEndingCapital = Math.max(0, capital - worstCaseLossAmount);

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-panel p-6 sm:p-8">
        <div className="absolute inset-0 bg-grid-workstation opacity-20 pointer-events-none" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/80 px-3 py-1 text-xs font-medium text-neutral-300">
            <Compass className="h-3.5 w-3.5 text-neutral-400" />
            <span>Smart Asset Allocation Engine</span>
          </div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Rekomendasi Portofolio Berbasis Profil Risiko & Ekonomi Makro
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-neutral-400">
            Jawab 5 pertanyaan profil risiko untuk mendapatkan simulasi alokasi
            Saham, Reksa Dana, Emas, dan Kripto yang terukur sesuai kapasitas
            keuangan Anda.
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Column: Questionnaire & Advanced Macro Selector */}
        <div className="space-y-6 lg:col-span-7">
          {/* Risk Questionnaire */}
          <div className="rounded-2xl border border-neutral-800 bg-panel p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <ShieldCheck className="h-4 w-4 text-neutral-400" />
                <span>Kuesioner Profil Risiko Investor</span>
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
                  setMacroRegime("netral");
                  updateState(def, "netral", capital);
                }}
                className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-white"
              >
                <RotateCcw className="h-3 w-3" /> Reset
              </button>
            </div>

            <div className="space-y-5">
              {RISK_QUESTIONS.map((q) => (
                <div
                  key={q.id}
                  className="space-y-2.5 border-b border-neutral-800/80 pb-4 last:border-none last:pb-0"
                >
                  <p className="text-xs font-semibold text-neutral-200 sm:text-sm">
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
                              ? "border-neutral-500 bg-neutral-800/80 text-white font-medium"
                              : "border-neutral-800 bg-neutral-950/70 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200"
                          }`}
                        >
                          <span>{opt.label}</span>
                          <span className="ml-2 rounded border border-neutral-800 bg-neutral-900 px-1.5 py-0.5 text-[10px] text-neutral-400 shrink-0">
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

          {/* Advanced Mode: Macroeconomic Condition Selector (Collapsed by default) */}
          <details className="group rounded-2xl border border-neutral-800 bg-panel p-5 sm:p-6">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-bold text-white">
              <div className="flex items-center gap-2">
                <Globe2 className="h-4 w-4 text-neutral-400" />
                <span>Mode lanjutan: Asumsi Siklus Ekonomi Makro (Opsional)</span>
              </div>
              <span className="rounded-full border border-neutral-800 bg-neutral-900 px-2.5 py-0.5 text-[11px] font-medium text-neutral-300">
                Aktif: {recommendation.macro.label}
              </span>
            </summary>
            <div className="mt-3 space-y-3 border-t border-neutral-800/80 pt-3">
              <p className="text-xs leading-relaxed text-amber-200/90 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2">
                Mayoritas investor pemula sebaiknya tidak menyesuaikan alokasi berdasarkan tebakan kondisi ekonomi. Default disetel ke kondisi netral agar fokus pada disiplin investasi rutin (DCA).
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                {MACRO_REGIMES.map((regime) => {
                  const isSelected = macroRegime === regime.id;
                  return (
                    <button
                      key={regime.id}
                      type="button"
                      onClick={() => {
                        setMacroRegime(regime.id);
                        updateState(answers, regime.id, capital);
                      }}
                      className={`rounded-xl border p-3.5 text-left transition-colors ${
                        isSelected
                          ? "border-neutral-400 bg-neutral-800/60 shadow-md shadow-black/40"
                          : "border-neutral-800 bg-neutral-950/60 hover:border-neutral-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">
                          {regime.label}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="h-4 w-4 text-white shrink-0" />
                        )}
                      </div>
                      <p className="mt-1 text-[11px] text-neutral-400">
                        {regime.subtitle}
                      </p>
                      <div className="mt-2 rounded border border-neutral-800 bg-neutral-900 px-2 py-1 text-[10px] font-mono text-neutral-300">
                        {regime.indicators}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </details>
        </div>

        {/* Right Column: Live Portfolio Recommendation Result */}
        <div className="space-y-6 lg:col-span-5">
          <div className="sticky top-20 space-y-6 rounded-2xl border border-neutral-800 bg-panel p-5 sm:p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div>
                <span className="text-xs font-medium text-neutral-400">
                  Hasil Profil Risiko Anda
                </span>
                <div className="mt-0.5 flex items-center gap-2">
                  <span className="text-2xl font-extrabold text-white">
                    {recommendation.profile}
                  </span>
                  <span className="rounded-full bg-neutral-800 px-2.5 py-0.5 text-xs font-semibold text-neutral-200 border border-neutral-700">
                    Skor {recommendation.score}/15
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-neutral-400 block">
                  Rezim Makro
                </span>
                <span className="text-xs font-semibold text-emerald-400">
                  {recommendation.macro.label}
                </span>
              </div>
            </div>

            {hasHardGuardrail && (
              <div
                role="alert"
                className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3.5 text-xs text-amber-200 space-y-1.5"
              >
                <div className="flex items-center gap-2 font-bold text-amber-300">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
                  <span>Pagar Pengaman Risiko Aktif</span>
                </div>
                {answers.emergency_fund === 1 && (
                  <p className="leading-relaxed">
                    Dana darurat Anda belum mencapai 3× pengeluaran bulanan.
                    Profil dikunci ke <strong>Konservatif</strong> dan alokasi
                    kripto ditetapkan <strong>0%</strong> agar dana kebutuhan
                    darurat tidak terpapar aset bergejolak tinggi.
                  </p>
                )}
                {answers.horizon === 1 && (
                  <p className="leading-relaxed">
                    Horizon investasi Anda kurang dari 2 tahun. Porsi saham
                    dibatasi maksimal <strong>10%</strong> dan kripto{" "}
                    <strong>0%</strong> untuk melindungi modal yang akan segera
                    digunakan.
                  </p>
                )}
              </div>
            )}

            {/* Capital Simulator Input */}
            <div className="space-y-2 rounded-xl border border-neutral-800 bg-neutral-950 p-3.5">
              <div className="flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1.5 font-semibold text-neutral-300">
                  <Wallet className="h-3.5 w-3.5 text-neutral-400" />
                  Simulasi Modal Investasi (Rp)
                </span>
                <span className="font-bold text-white">
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
                className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-sm font-semibold text-white focus:border-neutral-500 focus:outline-none"
              />
              <div className="flex flex-wrap gap-1.5 pt-1">
                {CAPITAL_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => {
                      setCapital(preset);
                      updateState(answers, macroRegime, preset);
                    }}
                    className={`rounded border px-2 py-1 text-[11px] font-medium transition-colors ${
                      capital === preset
                        ? "border-neutral-400 bg-neutral-100 text-neutral-950 font-bold"
                        : "border-neutral-800 bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-white"
                    }`}
                  >
                    {formatIDR(preset)}
                  </button>
                ))}
              </div>
            </div>

            {/* Stacked Visual Allocation Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-300">
                <span>Komposisi Alokasi Portofolio</span>
                <span className="text-neutral-500">Total 100%</span>
              </div>
              <div className="flex h-4 w-full overflow-hidden rounded-full bg-neutral-950 p-0.5 border border-neutral-800">
                {recommendation.instrumentDetails.map(
                  (item) =>
                    item.percentage > 0 && (
                      <div
                        key={item.asset}
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: item.color,
                          transition: "width 300ms ease",
                        }}
                        className="h-full first:rounded-l-full last:rounded-r-full"
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
                    className="rounded-xl border border-neutral-800/90 bg-neutral-950/70 p-3.5"
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
                        <span className="ml-2 text-xs font-semibold text-neutral-400">
                          ({formatIDR(nominal)})
                        </span>
                      </div>
                    </div>
                    <p className="mt-1.5 text-[11px] text-neutral-300">
                      <strong className="text-neutral-400">Instrumen: </strong>
                      {item.specificInstruments}
                    </p>
                    <p className="mt-0.5 text-[11px] text-neutral-500">
                      Fungsi: {item.roleInPortfolio}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="space-y-3">
              <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-3.5 space-y-2.5">
                <div className="flex items-center justify-between gap-2 text-[11px] text-neutral-400">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-neutral-300">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Skenario Hasil Tahunan (Ilustratif)</span>
                  </span>
                  <span className="text-[10px] text-neutral-500">Bukan janji imbal hasil</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg border border-neutral-800/80 bg-neutral-900/60 p-2">
                    <div className="text-[10px] text-neutral-400">Buruk</div>
                    <div
                      className={`mt-0.5 text-xs font-bold ${
                        recommendation.scenarios.badPct < 0
                          ? "text-rose-400"
                          : "text-neutral-200"
                      }`}
                    >
                      {recommendation.scenarios.badPct > 0 ? "+" : ""}
                      {recommendation.scenarios.badPct}%
                    </div>
                  </div>
                  <div className="rounded-lg border border-neutral-800/80 bg-neutral-900/60 p-2">
                    <div className="text-[10px] text-neutral-400">Dasar</div>
                    <div className="mt-0.5 text-xs font-bold text-neutral-100">
                      {recommendation.scenarios.basePct > 0 ? "+" : ""}
                      {recommendation.scenarios.basePct}%
                    </div>
                  </div>
                  <div className="rounded-lg border border-neutral-800/80 bg-neutral-900/60 p-2">
                    <div className="text-[10px] text-neutral-400">Baik</div>
                    <div className="mt-0.5 text-xs font-bold text-emerald-400">
                      +{recommendation.scenarios.goodPct}%
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-3.5 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-300">
                    <AlertTriangle className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                    <span>Perkiraan penurunan terburuk (ilustratif)</span>
                  </div>
                  <span className="text-sm font-extrabold text-rose-400">
                    {recommendation.worstCaseDrawdownPct}%
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-neutral-200">
                  Modal <strong>{formatIDR(capital)}</strong> bisa turun menjadi sekitar{" "}
                  <strong className="text-rose-300">{formatIDR(worstCaseEndingCapital)}</strong>{" "}
                  (penurunan sekitar {formatIDR(worstCaseLossAmount)}) jika pasar mengalami tekanan berat.
                </p>
                <p className="text-[11px] text-neutral-400">
                  Hasil masa lalu bukan jaminan masa depan. Angka dihitung dari bobot alokasi × asumsi stres ilustratif per aset.
                </p>
                <details className="pt-1 text-[11px] text-neutral-400">
                  <summary className="cursor-pointer font-medium text-neutral-300 hover:text-white">
                    Lihat asumsi stres per aset & status verifikasi sumber
                  </summary>
                  <ul className="mt-2 space-y-1.5 border-t border-neutral-800/80 pt-2">
                    {Object.values(ASSET_SCENARIO_ASSUMPTIONS).map((item) => (
                      <li key={item.label} className="text-[10px] leading-relaxed">
                        <strong className="text-neutral-200">{item.label}:</strong> stres{" "}
                        {item.stressDrawdownPct}% (buruk {item.badAnnualPct}% / dasar +
                        {item.baseAnnualPct}% / baik +{item.goodAnnualPct}%) —{" "}
                        <span className="text-neutral-500">
                          {item.source} ({item.period})
                        </span>
                      </li>
                    ))}
                  </ul>
                </details>
              </div>
            </div>

            {/* Tactical Actions */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/80 p-4 space-y-2">
              <div className="text-xs font-semibold text-neutral-200">
                Strategi Eksekusi & Alasan Makro
              </div>
              <p className="text-xs leading-relaxed text-neutral-300">
                {recommendation.rationale}
              </p>
              <ul className="space-y-1.5 pt-1 text-xs text-neutral-300">
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
