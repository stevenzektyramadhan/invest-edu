"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import type { MarketItem } from "@/lib/market-data";
import {
  createChart,
  ColorType,
  CrosshairMode,
  LineStyle,
  CandlestickSeries,
  LineSeries,
  AreaSeries,
  type UTCTimestamp,
} from "lightweight-charts";
import {
  X,
  Bell,
  BellRing,
  TrendingUp,
  TrendingDown,
  CandlestickChart,
  LineChart,
  ExternalLink,
  Trash2,
  Volume2,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";

export type AlarmCondition = "BELOW" | "ABOVE";

export interface PriceAlarm {
  id: string;
  assetId: string;
  symbol: string;
  assetName: string;
  condition: AlarmCondition;
  targetPrice: number;
  unitPrefix: string;
  unitSuffix: string;
  note: string;
  triggered: boolean;
  triggeredAt?: string;
  createdAt: string;
}

export interface OHLCCandle {
  time: UTCTimestamp;
  label: string;
  open: number;
  high: number;
  low: number;
  close: number;
  ma5: number;
}

export function formatTargetValue(
  val: number,
  unitPrefix: string,
  unitSuffix: string
): string {
  const decimals = val < 100 ? 2 : 0;
  const formatted = new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(val);
  return `${unitPrefix}${formatted}${unitSuffix}`;
}

export function formatCompactAxisPrice(val: number): string {
  if (val >= 1_000_000_000) {
    return `${(val / 1_000_000_000).toFixed(2)}M`;
  }
  if (val >= 1_000_000) {
    return `${(val / 1_000_000).toFixed(2)}Jt`;
  }
  const decimals = val < 100 ? 2 : 0;
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(val);
}

// ponytail: deterministic OHLC derivation from sparkline & timeframe — upgrade to real OHLC websocket when paid broker feed is connected
export function generateOHLCCandles(
  item: MarketItem,
  timeframe: "1D" | "1W" | "1M" | "1Y"
): OHLCCandle[] {
  const baseSeries =
    item.sparkline && item.sparkline.length >= 4
      ? item.sparkline
      : [
          item.rawPrice * 0.985,
          item.rawPrice * 0.99,
          item.rawPrice * 0.995,
          item.rawPrice,
        ];

  const count = 36;
  const tfMultiplier =
    timeframe === "1D"
      ? 0.35
      : timeframe === "1W"
      ? 1
      : timeframe === "1M"
      ? 2.0
      : 3.5;

  const stepSeconds =
    timeframe === "1D"
      ? 1800
      : timeframe === "1W"
      ? 14400
      : timeframe === "1M"
      ? 86400
      : 604800;

  const baseTimestamp = 1762214400; // Fixed anchor timestamp for deterministic rendering
  const candles: OHLCCandle[] = [];
  const lastSpark = baseSeries[baseSeries.length - 1] || item.rawPrice;
  const scaleFactor = item.rawPrice / lastSpark;
  const decimals = item.rawPrice < 100 ? 2 : 0;

  for (let i = 0; i < count; i++) {
    const ratio = i / (count - 1);
    const sparkIdx = ratio * (baseSeries.length - 1);
    const lowIdx = Math.floor(sparkIdx);
    const highIdx = Math.min(baseSeries.length - 1, Math.ceil(sparkIdx));
    const frac = sparkIdx - lowIdx;

    const interpolated =
      (baseSeries[lowIdx] * (1 - frac) + baseSeries[highIdx] * frac) *
      scaleFactor;

    const wave =
      Math.sin(i * 1.15 + item.symbol.charCodeAt(0)) *
      0.0065 *
      tfMultiplier *
      item.rawPrice;

    const close =
      i === count - 1
        ? item.rawPrice
        : Number((interpolated + wave).toFixed(decimals));

    const prevClose =
      i === 0 ? close * (1 - 0.003 * tfMultiplier) : candles[i - 1].close;
    const open = Number(prevClose.toFixed(decimals));
    const wickSpan = Math.max(
      Math.abs(close - open) * 0.65,
      item.rawPrice * 0.003 * tfMultiplier
    );
    const high = Number((Math.max(open, close) + wickSpan).toFixed(decimals));
    const low = Number((Math.min(open, close) - wickSpan).toFixed(decimals));

    const sliceStart = Math.max(0, i - 4);
    const prevCloses = candles.slice(sliceStart, i).map((c) => c.close);
    const allForMa = [...prevCloses, close];
    const ma5 = Number(
      (allForMa.reduce((a, b) => a + b, 0) / allForMa.length).toFixed(decimals)
    );

    const time = (baseTimestamp - (count - 1 - i) * stepSeconds) as UTCTimestamp;
    const label =
      timeframe === "1D"
        ? `${String(9 + Math.floor((i * 8) / count)).padStart(2, "0")}:${
            i % 2 === 0 ? "00" : "30"
          }`
        : timeframe === "1W"
        ? `H-${count - 1 - i}`
        : timeframe === "1M"
        ? `D-${count - 1 - i}`
        : `W-${count - 1 - i}`;

    candles.push({ time, label, open, high, low, close, ma5 });
  }

  return candles;
}

export function evaluateAlarms(
  alarms: PriceAlarm[],
  currentPrices: Record<string, number>
): { updated: PriceAlarm[]; newlyTriggered: PriceAlarm[] } {
  const newlyTriggered: PriceAlarm[] = [];
  const updated = alarms.map((alarm) => {
    const current = currentPrices[alarm.assetId];
    if (current === undefined || alarm.triggered) return alarm;

    const hit =
      (alarm.condition === "BELOW" && current <= alarm.targetPrice) ||
      (alarm.condition === "ABOVE" && current >= alarm.targetPrice);

    if (hit) {
      const triggeredAlarm: PriceAlarm = {
        ...alarm,
        triggered: true,
        triggeredAt: new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      };
      newlyTriggered.push(triggeredAlarm);
      return triggeredAlarm;
    }
    return alarm;
  });

  return { updated, newlyTriggered };
}

interface TradingTerminalModalProps {
  item: MarketItem;
  alarms: PriceAlarm[];
  onClose: () => void;
  onAddAlarm: (alarm: Omit<PriceAlarm, "id" | "triggered" | "createdAt">) => void;
  onDeleteAlarm: (id: string) => void;
  onSimulatePriceHit: (assetId: string, simulatedPrice: number) => void;
}

export default function TradingTerminalModal({
  item,
  alarms,
  onClose,
  onAddAlarm,
  onDeleteAlarm,
  onSimulatePriceHit,
}: TradingTerminalModalProps) {
  const [timeframe, setTimeframe] = useState<"1D" | "1W" | "1M" | "1Y">("1W");
  const [chartStyle, setChartStyle] = useState<"CANDLE" | "LINE" | "TV_LIVE">(
    "CANDLE"
  );

  const [condition, setCondition] = useState<AlarmCondition>("BELOW");
  const [targetInput, setTargetInput] = useState<string>(
    String(
      item.rawPrice < 100
        ? Number((item.rawPrice * 0.98).toFixed(2))
        : Math.round(item.rawPrice * 0.98)
    )
  );
  const [noteInput, setNoteInput] = useState<string>(
    "Cicil beli bertahap (Buy on Dip -2%)"
  );

  const assetAlarms = useMemo(
    () => alarms.filter((a) => a.assetId === item.id),
    [alarms, item.id]
  );

  const candles = useMemo(
    () => generateOHLCCandles(item, timeframe),
    [item, timeframe]
  );

  const latestCandle = candles[candles.length - 1];
  const [hoveredCandle, setHoveredCandle] = useState<OHLCCandle | null>(null);
  const displayCandle = hoveredCandle || latestCandle;

  const chartContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    if (chartStyle === "TV_LIVE") return;
    const container = chartContainerRef.current;
    if (!container) return;

    let chartInstance: ReturnType<typeof createChart> | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let rafId = 0;

    const initChart = () => {
      if (!container) return;
      const width = container.clientWidth || 680;
      const height = Math.max(container.clientHeight, 420);

      chartInstance = createChart(container, {
        width,
        height,
        layout: {
          background: { type: ColorType.Solid, color: "#131722" },
          textColor: "#d1d4dc",
          fontFamily: "monospace",
          fontSize: 11,
        },
        grid: {
          vertLines: { color: "#1e222d" },
          horzLines: { color: "#1e222d" },
        },
        crosshair: {
          mode: CrosshairMode.Normal,
        },
        rightPriceScale: {
          borderColor: "#2a2e39",
          scaleMargins: {
            top: 0.14,
            bottom: 0.12,
          },
        },
        timeScale: {
          borderColor: "#2a2e39",
          timeVisible: timeframe === "1D" || timeframe === "1W",
          secondsVisible: false,
          rightOffset: 3,
          barSpacing: 12,
        },
      });

      const candleByTime = new Map<number, OHLCCandle>();
      for (const c of candles) {
        candleByTime.set(Number(c.time), c);
      }

      if (chartStyle === "CANDLE") {
        const candleSeries = chartInstance.addSeries(CandlestickSeries, {
          upColor: "#26a69a",
          downColor: "#ef5350",
          borderVisible: false,
          wickUpColor: "#26a69a",
          wickDownColor: "#ef5350",
        });

        candleSeries.setData(
          candles.map((c) => ({
            time: c.time,
            open: c.open,
            high: c.high,
            low: c.low,
            close: c.close,
          }))
        );

        candleSeries.createPriceLine({
          price: item.supportLevel,
          color: "#26a69a",
          lineWidth: 1,
          lineStyle: LineStyle.Dashed,
          axisLabelVisible: true,
          title: "Support",
        });

        candleSeries.createPriceLine({
          price: item.resistanceLevel,
          color: "#f59e0b",
          lineWidth: 1,
          lineStyle: LineStyle.Dashed,
          axisLabelVisible: true,
          title: "Resistance",
        });

        for (const alarm of assetAlarms) {
          candleSeries.createPriceLine({
            price: alarm.targetPrice,
            color: alarm.condition === "BELOW" ? "#06b6d4" : "#a855f7",
            lineWidth: 2,
            lineStyle: LineStyle.Dashed,
            axisLabelVisible: true,
            title:
              alarm.condition === "BELOW" ? "⏰ Target Beli" : "⏰ Target Jual",
          });
        }
      } else {
        const areaSeries = chartInstance.addSeries(AreaSeries, {
          lineColor: "#2962ff",
          topColor: "rgba(41, 98, 255, 0.28)",
          bottomColor: "rgba(41, 98, 255, 0.02)",
          lineWidth: 2,
        });

        areaSeries.setData(
          candles.map((c) => ({
            time: c.time,
            value: c.close,
          }))
        );

        areaSeries.createPriceLine({
          price: item.supportLevel,
          color: "#26a69a",
          lineWidth: 1,
          lineStyle: LineStyle.Dashed,
          axisLabelVisible: true,
          title: "Support",
        });

        areaSeries.createPriceLine({
          price: item.resistanceLevel,
          color: "#f59e0b",
          lineWidth: 1,
          lineStyle: LineStyle.Dashed,
          axisLabelVisible: true,
          title: "Resistance",
        });

        for (const alarm of assetAlarms) {
          areaSeries.createPriceLine({
            price: alarm.targetPrice,
            color: alarm.condition === "BELOW" ? "#06b6d4" : "#a855f7",
            lineWidth: 2,
            lineStyle: LineStyle.Dashed,
            axisLabelVisible: true,
            title:
              alarm.condition === "BELOW" ? "⏰ Target Beli" : "⏰ Target Jual",
          });
        }
      }

      const maSeries = chartInstance.addSeries(LineSeries, {
        color: "#f59e0b",
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: true,
        title: "MA(5)",
      });

      maSeries.setData(
        candles.map((c) => ({
          time: c.time,
          value: c.ma5,
        }))
      );

      let lastHoveredTime: number | null = null;
      chartInstance.subscribeCrosshairMove((param) => {
        const nextTime = param && param.time ? Number(param.time) : null;
        if (nextTime === lastHoveredTime) return;
        lastHoveredTime = nextTime;
        if (nextTime === null) {
          setHoveredCandle(null);
          return;
        }
        const matched = candleByTime.get(nextTime);
        setHoveredCandle(matched || null);
      });

      chartInstance.timeScale().fitContent();

      let prevW = width;
      let prevH = height;
      resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const nextW = Math.floor(entry.contentRect.width);
          const nextH = Math.max(Math.floor(entry.contentRect.height), 420);
          if (
            nextW > 0 &&
            chartInstance &&
            (nextW !== prevW || nextH !== prevH)
          ) {
            prevW = nextW;
            prevH = nextH;
            chartInstance.applyOptions({ width: nextW, height: nextH });
          }
        }
      });
      resizeObserver.observe(container);
    };

    rafId = window.requestAnimationFrame(initChart);

    return () => {
      window.cancelAnimationFrame(rafId);
      if (resizeObserver) resizeObserver.disconnect();
      if (chartInstance) chartInstance.remove();
    };
  }, [candles, chartStyle, timeframe, item.supportLevel, item.resistanceLevel, assetAlarms]);

  const handleApplyPreset = (
    cond: AlarmCondition,
    priceVal: number,
    defaultNote: string
  ) => {
    setCondition(cond);
    const rounded =
      item.rawPrice < 100 ? Number(priceVal.toFixed(2)) : Math.round(priceVal);
    setTargetInput(String(rounded));
    setNoteInput(defaultNote);
  };

  const handleSubmitAlarm = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = Number(targetInput);
    if (!Number.isFinite(parsed) || parsed <= 0) return;

    onAddAlarm({
      assetId: item.id,
      symbol: item.symbol,
      assetName: item.name,
      condition,
      targetPrice: parsed,
      unitPrefix: item.unitPrefix,
      unitSuffix: item.unitSuffix,
      note:
        noteInput.trim() ||
        (condition === "BELOW"
          ? "Target Akumulasi Beli"
          : "Target Ambil Untung"),
    });
  };

  const isUp = item.change24h >= 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-2 sm:p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        style={{ maxHeight: "92vh", width: "min(1200px, 96vw)" }}
        className="flex flex-col rounded-xl border border-[#2a2e39] bg-[#131722] text-[#d1d4dc] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="shrink-0 flex flex-wrap items-center justify-between gap-2 border-b border-[#2a2e39] bg-[#1e222d] px-4 py-2.5">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 pr-3 border-r border-[#2a2e39]">
              <span className="text-base font-extrabold tracking-tight text-white">
                {item.symbol}
              </span>
              <span className="rounded bg-[#2a2e39] px-1.5 py-0.5 text-[10px] font-semibold text-[#9598a1]">
                {item.category}
              </span>
            </div>

            <div className="flex items-baseline gap-2 pr-3 border-r border-[#2a2e39]">
              <span className="text-base font-extrabold font-mono text-white">
                {item.priceDisplay}
              </span>
              <span
                className={`inline-flex items-center gap-0.5 text-xs font-bold font-mono ${
                  isUp ? "text-[#26a69a]" : "text-[#ef5350]"
                }`}
              >
                {isUp ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {isUp ? "+" : ""}
                {item.change24h}%
              </span>
            </div>

            <div className="flex items-center gap-1 pr-3 border-r border-[#2a2e39]">
              {(["1D", "1W", "1M", "1Y"] as const).map((tf) => (
                <button
                  key={tf}
                  type="button"
                  onClick={() => setTimeframe(tf)}
                  disabled={chartStyle === "TV_LIVE"}
                  className={`rounded px-2 py-1 text-xs font-bold transition-colors ${
                    timeframe === tf && chartStyle !== "TV_LIVE"
                      ? "bg-[#2962ff] text-white"
                      : "text-[#9598a1] hover:bg-[#2a2e39] hover:text-white disabled:opacity-35"
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-1">
              <button
                type="button"
                onClick={() => setChartStyle("CANDLE")}
                className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-semibold transition-colors ${
                  chartStyle === "CANDLE"
                    ? "bg-[#2a2e39] text-white"
                    : "text-[#9598a1] hover:bg-[#2a2e39]/60 hover:text-white"
                }`}
              >
                <CandlestickChart className="h-3.5 w-3.5 text-[#26a69a]" />
                <span>Candlestick</span>
              </button>
              <button
                type="button"
                onClick={() => setChartStyle("LINE")}
                className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-semibold transition-colors ${
                  chartStyle === "LINE"
                    ? "bg-[#2a2e39] text-white"
                    : "text-[#9598a1] hover:bg-[#2a2e39]/60 hover:text-white"
                }`}
              >
                <LineChart className="h-3.5 w-3.5 text-[#2962ff]" />
                <span>Line</span>
              </button>
              <button
                type="button"
                onClick={() => setChartStyle("TV_LIVE")}
                className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-semibold transition-colors ${
                  chartStyle === "TV_LIVE"
                    ? "bg-[#2962ff] text-white"
                    : "text-[#9598a1] hover:bg-[#2a2e39]/60 hover:text-white"
                }`}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>TradingView Embed</span>
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#9598a1] hover:bg-[#2a2e39] hover:text-white transition-colors"
            aria-label="Tutup"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="tv-modal-grid">
            <div className="tv-modal-chart-pane">
              <div
                style={{ minHeight: "420px" }}
                className="relative w-full h-[440px] bg-[#131722] select-none overflow-hidden"
              >
                {chartStyle !== "TV_LIVE" && displayCandle && (
                  <div className="pointer-events-none absolute top-2.5 left-3 z-20 flex flex-wrap items-center gap-x-3 gap-y-1 rounded bg-[#131722]/90 px-2.5 py-1 text-[11px] font-mono border border-[#2a2e39]/90 shadow">
                    <span className="font-sans font-bold text-white">
                      {item.name} ({ timeframe })
                    </span>
                    <span className="text-[#9598a1]">
                      O{" "}
                      <strong className="text-white">
                        {formatCompactAxisPrice(displayCandle.open)}
                      </strong>
                    </span>
                    <span className="text-[#9598a1]">
                      H{" "}
                      <strong className="text-[#26a69a]">
                        {formatCompactAxisPrice(displayCandle.high)}
                      </strong>
                    </span>
                    <span className="text-[#9598a1]">
                      L{" "}
                      <strong className="text-[#ef5350]">
                        {formatCompactAxisPrice(displayCandle.low)}
                      </strong>
                    </span>
                    <span className="text-[#9598a1]">
                      C{" "}
                      <strong
                        className={
                          displayCandle.close >= displayCandle.open
                            ? "text-[#26a69a]"
                            : "text-[#ef5350]"
                        }
                      >
                        {formatCompactAxisPrice(displayCandle.close)}
                      </strong>
                    </span>
                    <span className="text-[#f59e0b] font-semibold">
                      MA(5) {formatCompactAxisPrice(displayCandle.ma5)}
                    </span>
                  </div>
                )}

                {chartStyle === "TV_LIVE" ? (
                  <iframe
                    title={`TradingView ${item.symbol}`}
                    src={`https://s.tradingview.com/widgetembed/?symbol=${encodeURIComponent(
                      item.tradingViewSymbol
                    )}&interval=D&theme=dark&style=1&timezone=Asia%2FJakarta&withdateranges=1&hide_side_toolbar=0`}
                    className="h-full w-full border-0"
                    style={{ minHeight: "420px" }}
                    allowFullScreen
                  />
                ) : (
                  <div
                    ref={chartContainerRef}
                    style={{ minHeight: "420px", height: "440px", width: "100%" }}
                    className="w-full h-[440px]"
                  />
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-[#2a2e39] bg-[#1e222d] text-xs divide-y sm:divide-y-0 sm:divide-x divide-[#2a2e39]">
                <div className="px-3.5 py-2.5 flex items-center justify-between gap-2">
                  <span className="text-[#9598a1]">24h High</span>
                  <span className="font-mono font-bold text-[#26a69a]">
                    {formatCompactAxisPrice(item.high24h)}
                  </span>
                </div>
                <div className="px-3.5 py-2.5 flex items-center justify-between gap-2">
                  <span className="text-[#9598a1]">24h Low</span>
                  <span className="font-mono font-bold text-[#ef5350]">
                    {formatCompactAxisPrice(item.low24h)}
                  </span>
                </div>
                <div className="px-3.5 py-2.5 flex items-center justify-between gap-2">
                  <span className="text-[#9598a1]">Support Beli</span>
                  <span className="font-mono font-bold text-[#26a69a]">
                    {formatCompactAxisPrice(item.supportLevel)}
                  </span>
                </div>
                <div className="px-3.5 py-2.5 flex items-center justify-between gap-2">
                  <span className="text-[#9598a1]">Resistance</span>
                  <span className="font-mono font-bold text-[#f59e0b]">
                    {formatCompactAxisPrice(item.resistanceLevel)}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 border-t border-[#2a2e39] bg-[#131722] px-4 py-3 text-xs text-[#9598a1]">
                <ShieldAlert className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Analisis Edukasi:</strong>{" "}
                  {item.educationalNote}
                </div>
              </div>
            </div>

            <div className="tv-modal-alarm-pane">
              <form
                onSubmit={handleSubmitAlarm}
                className="rounded-lg border border-[#2a2e39] bg-[#131722] p-3.5 space-y-3.5"
              >
                <div className="flex items-center gap-2 border-b border-[#2a2e39] pb-2.5">
                  <Bell className="h-4 w-4 text-amber-400 shrink-0" />
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
                    Mode Alarm Target Harga
                  </h3>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#9598a1] mb-1.5">
                    Pilih Arah Trigger
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleApplyPreset(
                          "BELOW",
                          item.rawPrice * 0.98,
                          "Cicil beli bertahap (Buy on Dip -2%)"
                        )
                      }
                      className={`rounded-lg border p-2.5 text-left transition-all ${
                        condition === "BELOW"
                          ? "border-[#26a69a] bg-[#26a69a]/15 text-white"
                          : "border-[#2a2e39] bg-[#1e222d] text-[#9598a1] hover:text-white"
                      }`}
                    >
                      <div className="text-xs font-bold text-[#26a69a]">
                        Target Beli (≤)
                      </div>
                      <div className="mt-0.5 text-[10px] text-[#9598a1]">
                        Saat harga diskon
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleApplyPreset(
                          "ABOVE",
                          item.rawPrice * 1.03,
                          "Take Profit / Rebalancing"
                        )
                      }
                      className={`rounded-lg border p-2.5 text-left transition-all ${
                        condition === "ABOVE"
                          ? "border-[#a855f7] bg-[#a855f7]/15 text-white"
                          : "border-[#2a2e39] bg-[#1e222d] text-[#9598a1] hover:text-white"
                      }`}
                    >
                      <div className="text-xs font-bold text-[#c084fc]">
                        Target Jual (≥)
                      </div>
                      <div className="mt-0.5 text-[10px] text-[#9598a1]">
                        Saat harga naik
                      </div>
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] text-[#9598a1] mb-1.5">
                    <span>Quick-Pick Level:</span>
                    <span className="font-mono text-white">
                      Now: {formatCompactAxisPrice(item.rawPrice)}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        handleApplyPreset(
                          "BELOW",
                          item.rawPrice * 0.98,
                          "Akumulasi diskon -2%"
                        )
                      }
                      className="flex-1 min-w-[68px] rounded border border-[#2a2e39] bg-[#1e222d] px-2 py-1.5 text-[11px] font-semibold text-sky-400 hover:border-sky-500/50"
                    >
                      Diskon -2%
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleApplyPreset(
                          "BELOW",
                          item.rawPrice * 0.95,
                          "Buy the Dip -5%"
                        )
                      }
                      className="flex-1 min-w-[68px] rounded border border-[#2a2e39] bg-[#1e222d] px-2 py-1.5 text-[11px] font-semibold text-sky-400 hover:border-sky-500/50"
                    >
                      Diskon -5%
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleApplyPreset(
                          "BELOW",
                          item.supportLevel,
                          "Beli di Support Kuat"
                        )
                      }
                      className="flex-1 min-w-[68px] rounded border border-[#2a2e39] bg-[#1e222d] px-2 py-1.5 text-[11px] font-semibold text-[#26a69a] hover:border-[#26a69a]/50"
                    >
                      Support
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleApplyPreset(
                          "ABOVE",
                          item.resistanceLevel,
                          "Take Profit di Resistance"
                        )
                      }
                      className="flex-1 min-w-[68px] rounded border border-[#2a2e39] bg-[#1e222d] px-2 py-1.5 text-[11px] font-semibold text-amber-400 hover:border-amber-500/50"
                    >
                      Resistance
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#9598a1] mb-1">
                    Nominal Target ({item.unitPrefix.trim() || item.unitSuffix.trim() || "Harga"})
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={targetInput}
                    onChange={(e) => setTargetInput(e.target.value)}
                    className="w-full rounded-lg border border-[#2a2e39] bg-[#1e222d] px-3 py-2 text-sm font-mono font-bold text-white focus:border-[#2962ff] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#9598a1] mb-1">
                    Catatan Rencana
                  </label>
                  <input
                    type="text"
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    placeholder="Contoh: Cicil beli 30% dana kas"
                    className="w-full rounded-lg border border-[#2a2e39] bg-[#1e222d] px-3 py-2 text-xs text-white focus:border-[#2962ff] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#2962ff] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#1e53e5] transition-colors shadow"
                >
                  <Bell className="h-4 w-4 shrink-0" />
                  <span>Pasang Alarm Target Sekarang</span>
                </button>
              </form>

              <div className="rounded-lg border border-[#2a2e39] bg-[#131722] p-3.5 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white">
                    <BellRing className="h-3.5 w-3.5 text-amber-400" />
                    <span>Alarm {item.symbol} ({assetAlarms.length})</span>
                  </span>
                  {assetAlarms.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const first = assetAlarms[0];
                        onSimulatePriceHit(item.id, first.targetPrice);
                      }}
                      className="inline-flex items-center gap-1 rounded bg-amber-500/20 border border-amber-500/40 px-2 py-1 text-[10px] font-semibold text-amber-300 hover:bg-amber-500/30"
                    >
                      <Volume2 className="h-3 w-3" />
                      <span>Uji Alarm</span>
                    </button>
                  )}
                </div>

                {assetAlarms.length === 0 ? (
                  <div className="rounded border border-dashed border-[#2a2e39] bg-[#1e222d]/50 p-4 text-center">
                    <p className="text-xs text-[#9598a1]">
                      Belum ada alarm aktif untuk {item.symbol}.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                    {assetAlarms.map((alarm) => (
                      <div
                        key={alarm.id}
                        className={`flex items-center justify-between gap-2 rounded-lg border p-2.5 text-xs ${
                          alarm.triggered
                            ? "border-[#26a69a] bg-[#26a69a]/15"
                            : "border-[#2a2e39] bg-[#1e222d]"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5 font-mono font-bold text-white">
                            <span
                              className={
                                alarm.condition === "BELOW"
                                  ? "text-cyan-400"
                                  : "text-purple-400"
                              }
                            >
                              {alarm.condition === "BELOW" ? "BELI ≤" : "JUAL ≥"}
                            </span>
                            <span>
                              {formatTargetValue(
                                alarm.targetPrice,
                                alarm.unitPrefix,
                                alarm.unitSuffix
                              )}
                            </span>
                            {alarm.triggered && (
                              <span className="inline-flex items-center gap-0.5 rounded bg-[#26a69a] px-1.5 py-0.5 font-sans text-[9px] font-extrabold text-white">
                                <CheckCircle2 className="h-2.5 w-2.5" />
                                HIT
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#9598a1] truncate mt-0.5">
                            {alarm.note}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => onDeleteAlarm(alarm.id)}
                          className="shrink-0 rounded p-1.5 text-[#9598a1] hover:bg-[#ef5350]/15 hover:text-[#ef5350]"
                          title="Hapus Alarm"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
