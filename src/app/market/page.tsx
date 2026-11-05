"use client";

import { useState, useEffect, useCallback } from "react";
import {
  FALLBACK_ITEMS,
  DEFAULT_MACRO_INDICATORS,
  type MarketItem,
} from "@/lib/market-data";
import TradingTerminalModal, {
  type PriceAlarm,
  evaluateAlarms,
  formatTargetValue,
} from "@/components/TradingTerminalModal";
import {
  BarChart3,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Globe,
  Info,
  Activity,
  Bell,
  BellRing,
  CandlestickChart,
  Trash2,
  Volume2,
  CheckCircle2,
} from "lucide-react";
import {
  ALARMS_STORAGE_KEY as SYNC_ALARMS_STORAGE_KEY,
  SYNC_EVENT_NAME,
  pushUserStateToCloud,
} from "@/lib/user-sync";

const CATEGORIES = [
  "Semua",
  "Saham & Indeks",
  "Emas & Komoditas",
  "Kripto",
  "Reksa Dana Acuan",
] as const;

const ALARMS_STORAGE_KEY = SYNC_ALARMS_STORAGE_KEY;

// Native Web Audio API chime (zero external asset dependency)
function playAlarmChime() {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const notes = [587.33, 880, 1174.66]; // D5 -> A5 -> D6 chime
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.14);
      gain.gain.setValueAtTime(0.18, ctx.currentTime + idx * 0.14);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + idx * 0.14 + 0.35
      );
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.14);
      osc.stop(ctx.currentTime + idx * 0.14 + 0.36);
    });
  } catch {
    // Ignore audio autoplay block
  }
}

function Sparkline({ data, positive }: { data: number[]; positive: boolean }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 140;
  const height = 42;

  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 8) - 4;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const strokeColor = positive ? "#10b981" : "#f43f5e";

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
    >
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

export default function MarketDashboardPage() {
  const [items, setItems] = useState<MarketItem[]>(FALLBACK_ITEMS);
  const [macroIndicators, setMacroIndicators] = useState<
    { label: string; value: string; status: string }[]
  >(DEFAULT_MACRO_INDICATORS);
  const [selectedCat, setSelectedCat] = useState<string>("Semua");
  const [loading, setLoading] = useState<boolean>(false);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [updatedAt, setUpdatedAt] = useState<string>("");

  const [activeTerminalId, setActiveTerminalId] = useState<string | null>(null);
  const handleCloseTerminal = useCallback(() => setActiveTerminalId(null), []);

  // Price Alarms state persisted in localStorage
  const [alarms, setAlarms] = useState<PriceAlarm[]>([]);
  const [triggeredBanner, setTriggeredBanner] = useState<PriceAlarm | null>(
    null
  );

  useEffect(() => {
    const hydrationTimer = window.setTimeout(() => {
      try {
        const saved = localStorage.getItem(ALARMS_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setAlarms(parsed);
        }
      } catch {
      }
    }, 0);
    return () => window.clearTimeout(hydrationTimer);
  }, []);

  useEffect(() => {
    const reloadAlarms = () => {
      try {
        const saved = localStorage.getItem(ALARMS_STORAGE_KEY);
        const parsed: unknown = saved ? JSON.parse(saved) : [];
        if (Array.isArray(parsed)) setAlarms(parsed as PriceAlarm[]);
      } catch {
        setAlarms([]);
      }
    };
    window.addEventListener(SYNC_EVENT_NAME, reloadAlarms);
    return () => window.removeEventListener(SYNC_EVENT_NAME, reloadAlarms);
  }, []);

  const saveAlarms = useCallback((nextAlarms: PriceAlarm[]) => {
    setAlarms(nextAlarms);
    try {
      localStorage.setItem(ALARMS_STORAGE_KEY, JSON.stringify(nextAlarms));
      void pushUserStateToCloud({ priceAlarms: nextAlarms });
    } catch {
    }
  }, []);

  const checkAlarmsAgainstItems = useCallback(
    (marketItems: MarketItem[], currentAlarms: PriceAlarm[]) => {
      if (currentAlarms.length === 0 || marketItems.length === 0) return;
      const priceMap: Record<string, number> = {};
      for (const it of marketItems) {
        priceMap[it.id] = it.rawPrice;
      }

      const { updated, newlyTriggered } = evaluateAlarms(
        currentAlarms,
        priceMap
      );
      if (newlyTriggered.length > 0) {
        saveAlarms(updated);
        setTriggeredBanner(newlyTriggered[0]);
        playAlarmChime();

        if (
          typeof window !== "undefined" &&
          "Notification" in window &&
          Notification.permission === "granted"
        ) {
          const first = newlyTriggered[0];
          new Notification(`⏰ Alarm Harga ${first.symbol} Tercapai!`, {
            body: `Target ${
              first.condition === "BELOW" ? "Beli ≤" : "Jual ≥"
            } ${formatTargetValue(
              first.targetPrice,
              first.unitPrefix,
              first.unitSuffix
            )} telah tersentuh (${first.note}).`,
          });
        }
      }
    },
    [saveAlarms]
  );

  const fetchMarket = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/market", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        const fetchedItems: MarketItem[] = data.items || [];
        setItems(fetchedItems);
        setMacroIndicators(data.macroIndicators || []);
        setIsLive(Boolean(data.isLive));
        setUpdatedAt(
          new Date(data.updatedAt || Date.now()).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
        );
        const storedRaw = localStorage.getItem(ALARMS_STORAGE_KEY);
        const currentAlarms: PriceAlarm[] = storedRaw
          ? JSON.parse(storedRaw)
          : [];
        checkAlarmsAgainstItems(fetchedItems, currentAlarms);
      }
    } catch {
      // ignore error
    } finally {
      setLoading(false);
    }
  }, [checkAlarmsAgainstItems]);

  useEffect(() => {
    const fetchTimer = window.setTimeout(() => void fetchMarket(), 0);
    return () => window.clearTimeout(fetchTimer);
  }, [fetchMarket]);

  const handleAddAlarm = (
    newAlarmData: Omit<PriceAlarm, "id" | "triggered" | "createdAt">
  ) => {
    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "default"
    ) {
      Notification.requestPermission().catch(() => {});
    }

    const created: PriceAlarm = {
      ...newAlarmData,
      id: `alm-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      triggered: false,
      createdAt: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const next = [created, ...alarms];
    saveAlarms(next);
    checkAlarmsAgainstItems(items, next);
  };

  const handleDeleteAlarm = (id: string) => {
    const next = alarms.filter((a) => a.id !== id);
    saveAlarms(next);
    if (triggeredBanner?.id === id) {
      setTriggeredBanner(null);
    }
  };

  const handleSimulatePriceHit = (assetId: string, simulatedPrice: number) => {
    const updatedItems = items.map((it) => {
      if (it.id !== assetId) return it;
      return {
        ...it,
        rawPrice: simulatedPrice,
        priceDisplay: formatTargetValue(
          simulatedPrice,
          it.unitPrefix,
          it.unitSuffix
        ),
      };
    });
    setItems(updatedItems);

    const resetForSimulation = alarms.map((a) =>
      a.assetId === assetId ? { ...a, triggered: false } : a
    );
    checkAlarmsAgainstItems(updatedItems, resetForSimulation);
  };

  const filtered = items.filter(
    (item) => selectedCat === "Semua" || item.category === selectedCat
  );

  const activeTerminalItem =
    items.find((it) => it.id === activeTerminalId) || null;

  return (
    <div className="space-y-8">
      {/* Triggered Alarm Notification Banner */}
      {triggeredBanner && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border-2 border-amber-400 bg-amber-500/15 p-4 sm:p-5 shadow-lg shadow-amber-500/10 animate-pulse">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-slate-950">
              <BellRing className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-amber-400 px-2 py-0.5 text-[10px] font-extrabold uppercase text-slate-950">
                  ALARM TARGET TERCAPAI!
                </span>
                <span className="text-sm font-extrabold text-white">
                  {triggeredBanner.symbol} ({triggeredBanner.assetName})
                </span>
              </div>
              <p className="mt-1 text-xs text-amber-200">
                Harga telah menyentuh target{" "}
                <strong>
                  {triggeredBanner.condition === "BELOW"
                    ? "Beli (≤)"
                    : "Jual (≥)"}{" "}
                  {formatTargetValue(
                    triggeredBanner.targetPrice,
                    triggeredBanner.unitPrefix,
                    triggeredBanner.unitSuffix
                  )}
                </strong>{" "}
                • Rencana: <em>{triggeredBanner.note}</em>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTerminalId(triggeredBanner.assetId)}
              className="rounded-xl bg-amber-400 px-3.5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-300"
            >
              Buka Grafik {triggeredBanner.symbol}
            </button>
            <button
              onClick={() => setTriggeredBanner(null)}
              className="rounded-xl border border-amber-400/40 px-3 py-2 text-xs font-semibold text-amber-200 hover:bg-amber-500/20"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950/40 p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-400 border border-sky-500/20">
              <Activity className="h-3.5 w-3.5" />
              <span>Multi-Asset Market Monitor & Price Alert</span>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Dashboard Pergerakan Pasar Hari Ini
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-400">
              Klik salah satu instrumen di bawah untuk membuka{" "}
              <strong className="text-sky-400">
                Grafik Terminal ala TradingView
              </strong>{" "}
              dan memasang{" "}
              <strong className="text-amber-400">
                Alarm Target Harga Beli / Jual
              </strong>
              .
            </p>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-2">
            <button
              onClick={fetchMarket}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-xs font-semibold text-white shadow hover:bg-sky-500 disabled:opacity-50 transition-colors"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
              />
              <span>{loading ? "Memuat Data..." : "Perbarui Harga"}</span>
            </button>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span
                className={`h-2 w-2 rounded-full ${
                  isLive ? "bg-emerald-400" : "bg-amber-400"
                }`}
              />
              <span>
                {isLive ? "Live Public API" : "Market Proxy Snapshot"} •{" "}
                {updatedAt || "--:--"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Price Alarms Bar */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <Bell className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                Mode Alarm Target Harga ({alarms.length} Terpasang)
              </h2>
              <p className="text-xs text-slate-400">
                Pasang target harga beli saat diskon (Buy the Dip) atau target
                ambil untung pada aset pilihan Anda.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={playAlarmChime}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-amber-500/40 hover:text-amber-300"
          >
            <Volume2 className="h-3.5 w-3.5 text-amber-400" />
            <span>Tes Suara Alarm</span>
          </button>
        </div>

        {alarms.length > 0 && (
          <div className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {alarms.map((alarm) => (
              <div
                key={alarm.id}
                className={`flex items-center justify-between gap-3 rounded-xl border p-3 transition-all ${
                  alarm.triggered
                    ? "border-emerald-500/50 bg-emerald-500/10"
                    : "border-slate-800 bg-slate-950/60"
                }`}
              >
                <div
                  onClick={() => setActiveTerminalId(alarm.assetId)}
                  className="cursor-pointer flex-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-white">
                      {alarm.symbol}
                    </span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                        alarm.condition === "BELOW"
                          ? "bg-sky-500/20 text-sky-400"
                          : "bg-purple-500/20 text-purple-400"
                      }`}
                    >
                      {alarm.condition === "BELOW" ? "Beli ≤" : "Jual ≥"}{" "}
                      {formatTargetValue(
                        alarm.targetPrice,
                        alarm.unitPrefix,
                        alarm.unitSuffix
                      )}
                    </span>
                    {alarm.triggered && (
                      <span className="inline-flex items-center gap-0.5 rounded bg-emerald-500 px-1.5 py-0.5 text-[9px] font-extrabold text-slate-950">
                        <CheckCircle2 className="h-2.5 w-2.5" />
                        AKTIF
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400 line-clamp-1">
                    {alarm.note}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  {!alarm.triggered && (
                    <button
                      type="button"
                      onClick={() =>
                        handleSimulatePriceHit(alarm.assetId, alarm.targetPrice)
                      }
                      className="rounded-lg bg-amber-500/15 px-2 py-1 text-[10px] font-semibold text-amber-300 hover:bg-amber-500/25"
                      title="Simulasikan harga menyentuh target ini"
                    >
                      Uji
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDeleteAlarm(alarm.id)}
                    className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-500/10 hover:text-rose-400"
                    title="Hapus Alarm"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Macroeconomic Indicators Strip */}
      <section className="space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <Globe className="h-3.5 w-3.5 text-sky-400" />
          <span>Indikator Makroekonomi Acuan</span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {macroIndicators.map((ind) => (
            <div
              key={ind.label}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-4"
            >
              <div className="text-xs text-slate-400">{ind.label}</div>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-lg font-extrabold text-white">
                  {ind.value}
                </span>
                <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-sky-400">
                  {ind.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Category Filter */}
      <div className="flex flex-wrap items-center gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors ${
              selectedCat === cat
                ? "bg-sky-500 text-white"
                : "border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Market Cards Grid (Clickable to open TradingView Terminal) */}
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((item) => {
          const isUp = item.change24h >= 0;
          const itemAlarmsCount = alarms.filter(
            (a) => a.assetId === item.id
          ).length;

          return (
            <div
              key={item.id}
              onClick={() => setActiveTerminalId(item.id)}
              className="group cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/50 p-5 transition-all hover:border-sky-500/60 hover:bg-slate-900/90 hover:shadow-lg hover:shadow-sky-500/5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-base font-extrabold text-white group-hover:text-sky-400 transition-colors">
                      {item.symbol}
                    </span>
                    <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-300">
                      {item.category}
                    </span>
                    {itemAlarmsCount > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                        <BellRing className="h-3 w-3" />
                        {itemAlarmsCount} Alarm
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-slate-400">{item.name}</p>
                </div>

                <div className="text-right">
                  <div className="text-lg font-extrabold text-white">
                    {item.priceDisplay}
                  </div>
                  <div className="mt-0.5 flex items-center justify-end gap-2 text-xs font-semibold">
                    <span
                      className={`inline-flex items-center gap-0.5 ${
                        isUp ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {isUp ? (
                        <TrendingUp className="h-3.5 w-3.5" />
                      ) : (
                        <TrendingDown className="h-3.5 w-3.5" />
                      )}
                      {isUp ? "+" : ""}
                      {item.change24h}% (24h)
                    </span>
                    <span className="text-slate-500">•</span>
                    <span
                      className={
                        item.change7d >= 0
                          ? "text-emerald-400/80"
                          : "text-rose-400/80"
                      }
                    >
                      {item.change7d >= 0 ? "+" : ""}
                      {item.change7d}% (7d)
                    </span>
                  </div>
                </div>
              </div>

              {/* Sparkline & Note */}
              <div className="mt-4 flex flex-col gap-3 border-t border-slate-800/80 pt-3.5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-2 text-xs text-slate-400 max-w-xs">
                  <Info className="h-3.5 w-3.5 text-sky-400 shrink-0 mt-0.5" />
                  <span>{item.educationalNote}</span>
                </div>
                <div className="flex flex-col items-end shrink-0">
                  <Sparkline
                    data={item.sparkline}
                    positive={item.change7d >= 0}
                  />
                  <span className="text-[10px] text-slate-500">
                    Tren 7 Hari ({item.source})
                  </span>
                </div>
              </div>

              {/* Action Bar for TradingView & Alarm */}
              <div className="mt-3.5 flex items-center justify-between rounded-xl bg-slate-950/70 px-3.5 py-2 text-xs border border-slate-800/80 group-hover:border-sky-500/30">
                <span className="inline-flex items-center gap-1.5 font-semibold text-sky-400">
                  <CandlestickChart className="h-3.5 w-3.5" />
                  <span>Buka Grafik TradingView & Support/Resistance</span>
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-amber-400">
                  <Bell className="h-3.5 w-3.5" />
                  <span>Pasang Alarm</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Educational Insight Box */}
      <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-5 sm:p-6">
        <div className="flex items-center gap-2 text-sm font-bold text-sky-400">
          <BarChart3 className="h-4 w-4" />
          <span>Cara Membaca Dashboard Pasar untuk Investor Jangka Panjang</span>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-slate-300">
          Fluktuasi harian (24 jam) adalah hal wajar di pasar modal. Gunakan
          fitur <strong>Mode Alarm Target Harga</strong> dengan mengklik salah
          satu aset di atas untuk memasang pengingat beli di area{" "}
          <strong>Support (Diskon)</strong>, sehingga Anda bisa melakukan
          akumulasi bertahap <strong>Dollar Cost Averaging (DCA)</strong> secara
          disiplin sesuai{" "}
          <a
            href="/recommendation"
            className="font-semibold text-sky-400 underline hover:text-sky-300"
          >
            Rekomendasi Profil Risiko
          </a>{" "}
          Anda.
        </p>
      </div>

      {activeTerminalItem && (
        <TradingTerminalModal
          item={activeTerminalItem}
          alarms={alarms}
          onClose={handleCloseTerminal}
          onAddAlarm={handleAddAlarm}
          onDeleteAlarm={handleDeleteAlarm}
          onSimulatePriceHit={handleSimulatePriceHit}
        />
      )}
    </div>
  );
}
