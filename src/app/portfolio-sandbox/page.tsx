"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  FALLBACK_ITEMS,
  evaluatePaperPortfolio,
  type MarketItem,
  type PaperPosition,
} from "@/lib/market-data";
import { RISK_STORAGE_KEY } from "@/lib/user-sync";
import { generateRecommendation, type MacroRegime } from "@/lib/recommendation";
import {
  FlaskConical,
  RefreshCw,
  RotateCcw,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Wallet,
  Plus,
  Trash2,
  Compass,
} from "lucide-react";

// ponytail: client localStorage sandbox; upgrade to /api/user-state column when cross-device paper trading is needed
const SANDBOX_STORAGE_KEY = "investedu_paper_sandbox_v1";
const INITIAL_CASH = 10_000_000;

interface SandboxState {
  cashIdr: number;
  positions: PaperPosition[];
}

function formatIDR(val: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(val);
}

const INVESTABLE_IDS = ["rdpu-index", "gold-idr", "bbca", "bbri", "bitcoin", "ethereum"];
const VALID_MACRO_REGIMES = new Set<MacroRegime>([
  "ekspansi",
  "netral",
  "bunga_tinggi",
  "krisis_inflasi",
]);

function isValidPaperPosition(raw: unknown): raw is PaperPosition {
  if (!raw || typeof raw !== "object") return false;
  const p = raw as Record<string, unknown>;
  return (
    typeof p.id === "string" &&
    p.id.length > 0 &&
    typeof p.assetId === "string" &&
    p.assetId.length > 0 &&
    typeof p.symbol === "string" &&
    typeof p.name === "string" &&
    typeof p.units === "number" &&
    Number.isFinite(p.units) &&
    p.units > 0 &&
    typeof p.avgEntryPrice === "number" &&
    Number.isFinite(p.avgEntryPrice) &&
    p.avgEntryPrice > 0 &&
    typeof p.investedIdr === "number" &&
    Number.isFinite(p.investedIdr) &&
    p.investedIdr >= 0
  );
}

export default function PortfolioSandboxPage() {
  const [marketItems, setMarketItems] = useState<MarketItem[]>(FALLBACK_ITEMS);
  const [loadingMarket, setLoadingMarket] = useState(false);
  const [cashIdr, setCashIdr] = useState<number>(INITIAL_CASH);
  const [positions, setPositions] = useState<PaperPosition[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState<string>("gold-idr");
  const [buyAmountIdr, setBuyAmountIdr] = useState<number>(1_000_000);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const persistSandbox = useCallback((next: SandboxState) => {
    setCashIdr(next.cashIdr);
    setPositions(next.positions);
    try {
      localStorage.setItem(SANDBOX_STORAGE_KEY, JSON.stringify(next));
    } catch {
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const raw = localStorage.getItem(SANDBOX_STORAGE_KEY);
        if (raw) {
          const parsed: unknown = JSON.parse(raw);
          if (parsed && typeof parsed === "object") {
            const candidate = parsed as Record<string, unknown>;
            if (
              typeof candidate.cashIdr === "number" &&
              Number.isFinite(candidate.cashIdr) &&
              candidate.cashIdr >= 0 &&
              Array.isArray(candidate.positions)
            ) {
              setCashIdr(candidate.cashIdr);
              setPositions(candidate.positions.filter(isValidPaperPosition));
            }
          }
        }
      } catch {
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const fetchLiveMarket = useCallback(async () => {
    setLoadingMarket(true);
    try {
      const res = await fetch("/api/market", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.items)) {
          setMarketItems(data.items);
        }
      }
    } catch {
    } finally {
      setLoadingMarket(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void fetchLiveMarket(), 0);
    return () => window.clearTimeout(timer);
  }, [fetchLiveMarket]);

  const investableAssets = useMemo(
    () => marketItems.filter((it) => INVESTABLE_IDS.includes(it.id)),
    [marketItems]
  );

  const priceLookup = useMemo(() => {
    const map: Record<string, MarketItem> = {};
    for (const item of marketItems) {
      map[item.id] = item;
    }
    return map;
  }, [marketItems]);

  const portfolioValuation = useMemo(
    () => evaluatePaperPortfolio(positions, marketItems, cashIdr, INITIAL_CASH),
    [positions, marketItems, cashIdr]
  );

  const handleBuyVirtual = () => {
    setErrorMsg("");
    const asset = priceLookup[selectedAssetId];
    if (!asset || asset.rawPrice <= 0) return;

    if (!Number.isFinite(buyAmountIdr) || buyAmountIdr < 50_000) {
      setErrorMsg("Minimal pembelian virtual Rp 50.000.");
      return;
    }
    if (buyAmountIdr > cashIdr) {
      setErrorMsg("Saldo kas virtual tidak mencukupi.");
      return;
    }

    const boughtUnits = buyAmountIdr / asset.rawPrice;
    const existingIdx = positions.findIndex((p) => p.assetId === asset.id);
    let nextPositions: PaperPosition[];

    if (existingIdx !== -1) {
      const prev = positions[existingIdx];
      const combinedUnits = prev.units + boughtUnits;
      const combinedInvested = prev.investedIdr + buyAmountIdr;
      const updatedPos: PaperPosition = {
        ...prev,
        units: combinedUnits,
        investedIdr: combinedInvested,
        avgEntryPrice: combinedInvested / combinedUnits,
      };
      nextPositions = positions.map((p, idx) => (idx === existingIdx ? updatedPos : p));
    } else {
      nextPositions = [
        ...positions,
        {
          id: `pos-${Date.now()}`,
          assetId: asset.id,
          symbol: asset.symbol,
          name: asset.name,
          units: boughtUnits,
          avgEntryPrice: asset.rawPrice,
          investedIdr: buyAmountIdr,
        },
      ];
    }

    persistSandbox({
      cashIdr: cashIdr - buyAmountIdr,
      positions: nextPositions,
    });
  };

  const handleSellPosition = (posId: string) => {
    const target = portfolioValuation.enriched.find((p) => p.id === posId);
    if (!target) return;
    const nextPositions = positions.filter((p) => p.id !== posId);
    persistSandbox({
      cashIdr: cashIdr + target.currentValue,
      positions: nextPositions,
    });
  };

  const handleResetSandbox = () => {
    setErrorMsg("");
    persistSandbox({
      cashIdr: INITIAL_CASH,
      positions: [],
    });
  };

  const handleApplyRecommendation = () => {
    setErrorMsg("");
    let answers: Record<string, number> = {
      horizon: 2,
      drawdown: 2,
      emergency_fund: 2,
      income: 2,
      experience: 2,
    };
    let macroRegime: MacroRegime = "netral";

    try {
      const saved = localStorage.getItem(RISK_STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          const candidate = parsed as Record<string, unknown>;
          if (candidate.answers && typeof candidate.answers === "object") {
            const rawAnswers = candidate.answers as Record<string, unknown>;
            const sanitized: Record<string, number> = { ...answers };
            for (const key of Object.keys(sanitized)) {
              const val = rawAnswers[key];
              if (typeof val === "number" && Number.isFinite(val)) {
                sanitized[key] = Math.min(3, Math.max(1, Math.round(val)));
              }
            }
            answers = sanitized;
          }
          if (
            typeof candidate.macroRegime === "string" &&
            VALID_MACRO_REGIMES.has(candidate.macroRegime as MacroRegime)
          ) {
            macroRegime = candidate.macroRegime as MacroRegime;
          }
        }
      }
    } catch {
    }

    const score = Object.values(answers).reduce((acc, v) => acc + v, 0);
    const rec = generateRecommendation(score, macroRegime, answers);

    const allocationTargets: Array<{ pct: number; targetId: string }> = [
      { pct: rec.allocation.reksaDanaPasarUangObligasi, targetId: "rdpu-index" },
      { pct: rec.allocation.emas, targetId: "gold-idr" },
      { pct: rec.allocation.saham, targetId: "bbca" },
      { pct: rec.allocation.kripto, targetId: "bitcoin" },
    ];

    const generatedPositions: PaperPosition[] = [];
    let allocatedTotal = 0;

    for (const { pct, targetId } of allocationTargets) {
      if (pct <= 0) continue;
      const liveAsset = priceLookup[targetId];
      if (!liveAsset || liveAsset.rawPrice <= 0) continue;

      const amount = Math.round((INITIAL_CASH * pct) / 100);
      if (amount <= 0) continue;

      allocatedTotal += amount;
      generatedPositions.push({
        id: `pos-${targetId}-${Date.now()}`,
        assetId: liveAsset.id,
        symbol: liveAsset.symbol,
        name: liveAsset.name,
        units: amount / liveAsset.rawPrice,
        avgEntryPrice: liveAsset.rawPrice,
        investedIdr: amount,
      });
    }

    persistSandbox({
      cashIdr: Math.max(0, INITIAL_CASH - allocatedTotal),
      positions: generatedPositions,
    });
  };

  const isTotalPositive = portfolioValuation.totalPnlIdr >= 0;

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-panel p-6 sm:p-8">
        <div className="absolute inset-0 bg-grid-workstation opacity-20 pointer-events-none" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
              <FlaskConical className="h-3.5 w-3.5" />
              <span>Paper Trading &amp; Asset Allocation Sandbox</span>
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Simulasi Portofolio Virtual Rp 10.000.000
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-neutral-400">
              Latih disiplin alokasi aset tanpa risiko kehilangan uang asli. Nilai portofolio bergerak mengikuti harga live Emas &amp; Kripto dari pasar nyata.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleApplyRecommendation}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3.5 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Terapkan Profil Risiko Saya</span>
            </button>
            <button
              type="button"
              onClick={fetchLiveMarket}
              disabled={loadingMarket}
              className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-800 px-3.5 py-2 text-xs font-semibold text-neutral-200 hover:border-neutral-500 hover:text-white disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loadingMarket ? "animate-spin" : ""}`} />
              <span>Update Harga</span>
            </button>
            <button
              type="button"
              onClick={handleResetSandbox}
              className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs font-medium text-neutral-400 hover:text-rose-300 hover:border-rose-500/40"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Rp 10 Juta</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-neutral-800 bg-panel p-5">
          <div className="text-xs font-medium text-neutral-400">Total Nilai Portofolio (Ekuitas)</div>
          <div className="mt-1 text-2xl font-extrabold text-white">
            {formatIDR(portfolioValuation.totalEquity)}
          </div>
          <div className="mt-1 text-xs text-neutral-500">Modal awal virtual: {formatIDR(INITIAL_CASH)}</div>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-panel p-5">
          <div className="text-xs font-medium text-neutral-400">Saldo Kas Tersedia (Buying Power)</div>
          <div className="mt-1 text-2xl font-extrabold text-emerald-400">
            {formatIDR(cashIdr)}
          </div>
          <div className="mt-1 text-xs text-neutral-500">
            Teralokasi: {formatIDR(portfolioValuation.holdingsMarketValue)}
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-panel p-5">
          <div className="text-xs font-medium text-neutral-400">Floating Profit / Loss Virtual</div>
          <div
            className={`mt-1 flex items-center gap-1.5 text-2xl font-extrabold ${
              isTotalPositive ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {isTotalPositive ? (
              <TrendingUp className="h-5 w-5" />
            ) : (
              <TrendingDown className="h-5 w-5" />
            )}
            <span>
              {isTotalPositive ? "+" : ""}
              {formatIDR(portfolioValuation.totalPnlIdr)} ({portfolioValuation.totalPnlPct.toFixed(2)}%)
            </span>
          </div>
          <div className="mt-1 text-xs text-neutral-500">Dihitung dari harga pasar terbaru</div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-5 lg:col-span-5">
          <div className="rounded-2xl border border-neutral-800 bg-panel p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Wallet className="h-4 w-4 text-emerald-400" />
              <span>Beli Instrumen Virtual</span>
            </div>

            <div className="space-y-2">
              <label htmlFor="sandbox-asset-select" className="block text-xs font-medium text-neutral-300">
                Pilih Aset Acuan
              </label>
              <select
                id="sandbox-asset-select"
                value={selectedAssetId}
                onChange={(e) => setSelectedAssetId(e.target.value)}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs font-semibold text-white focus:border-neutral-500 focus:outline-none"
              >
                {investableAssets.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.symbol} — {item.name} ({item.priceDisplay}) [{item.dataStatus === "live" ? "LIVE" : "STATIS"}]
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor="sandbox-buy-amount" className="font-medium text-neutral-300">
                  Nominal Pembelian (Rp)
                </label>
                <span className="text-neutral-400">Kas: {formatIDR(cashIdr)}</span>
              </div>
              <input
                id="sandbox-buy-amount"
                type="number"
                inputMode="numeric"
                min={50000}
                step={100000}
                value={buyAmountIdr}
                onChange={(e) => {
                  const next = Number(e.target.value);
                  setBuyAmountIdr(Number.isFinite(next) ? Math.max(0, next) : 0);
                }}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2 text-sm font-bold text-white focus:border-neutral-500 focus:outline-none"
              />
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[500_000, 1_000_000, 2_500_000, 5_000_000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setBuyAmountIdr(Math.min(preset, cashIdr || preset))}
                    className="rounded-lg border border-neutral-800 bg-neutral-900 px-2.5 py-1 text-[11px] font-medium text-neutral-300 hover:border-neutral-600 hover:text-white"
                  >
                    {formatIDR(preset)}
                  </button>
                ))}
              </div>
            </div>

            {errorMsg && (
              <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
                {errorMsg}
              </div>
            )}

            <button
              type="button"
              onClick={handleBuyVirtual}
              disabled={cashIdr < 50_000}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-100 px-4 py-2.5 text-xs font-bold text-neutral-950 hover:bg-white disabled:opacity-40 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Beli ke Portofolio Virtual</span>
            </button>

            <div className="border-t border-neutral-800/80 pt-3 text-[11px] text-neutral-400 leading-relaxed">
              Ingin tahu bobot ideal sebelum membeli? Gunakan{" "}
              <Link href="/recommendation" className="text-emerald-400 underline hover:text-emerald-300 inline-flex items-center gap-1">
                <Compass className="h-3 w-3" /> Kalkulator Profil Risiko
              </Link>{" "}
              lalu klik tombol <strong>Terapkan Profil Risiko Saya</strong> di atas.
            </div>
          </div>
        </div>

        <div className="space-y-4 lg:col-span-7">
          <div className="rounded-2xl border border-neutral-800 bg-panel p-5 sm:p-6">
            <h2 className="text-sm font-bold text-white">
              Daftar Aset dalam Portofolio ({portfolioValuation.enriched.length} Posisi)
            </h2>

            {portfolioValuation.enriched.length === 0 ? (
              <div className="mt-6 rounded-xl border border-dashed border-neutral-800 bg-neutral-950/60 p-8 text-center space-y-2">
                <p className="text-sm font-semibold text-neutral-300">
                  Portofolio virtual Anda masih 100% Kas Tunai.
                </p>
                <p className="text-xs text-neutral-500">
                  Pilih aset di panel kiri atau klik &ldquo;Terapkan Profil Risiko Saya&rdquo; untuk mengisi alokasi otomatis.
                </p>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {portfolioValuation.enriched.map((pos) => {
                  const isUp = pos.pnlIdr >= 0;
                  return (
                    <div
                      key={pos.id}
                      className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-neutral-800 bg-neutral-950/80 p-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{pos.symbol}</span>
                          <span className="text-xs text-neutral-400">{pos.name}</span>
                          <span
                            className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                              pos.dataStatus === "live"
                                ? "bg-emerald-500/20 text-emerald-300"
                                : "bg-amber-500/20 text-amber-300"
                            }`}
                          >
                            {pos.dataStatus === "live" ? "LIVE" : "STATIS"}
                          </span>
                        </div>
                        <div className="text-[11px] text-neutral-400">
                          Modal Beli: <strong>{formatIDR(pos.investedIdr)}</strong> • Harga Rata-rata:{" "}
                          {formatIDR(Math.round(pos.avgEntryPrice))} • Sekarang:{" "}
                          {formatIDR(Math.round(pos.currentPrice))}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm font-extrabold text-white">
                            {formatIDR(pos.currentValue)}
                          </div>
                          <div
                            className={`text-xs font-bold ${
                              isUp ? "text-emerald-400" : "text-rose-400"
                            }`}
                          >
                            {isUp ? "+" : ""}
                            {formatIDR(pos.pnlIdr)} ({pos.pnlPct.toFixed(2)}%)
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSellPosition(pos.id)}
                          title="Jual seluruh posisi ini kembali ke Kas"
                          className="inline-flex items-center gap-1 rounded-lg border border-neutral-800 bg-neutral-900 px-2.5 py-1.5 text-xs font-semibold text-neutral-300 hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-300"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Jual</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
