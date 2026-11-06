import type { UTCTimestamp } from "lightweight-charts";
import type { MarketItem } from "./market-data";

export type ChartTimeframe = "1D" | "1W" | "1M" | "1Y";
export type ChartStyle = "CANDLE" | "LINE" | "TV_LIVE";

export interface OHLCCandle {
  time: UTCTimestamp;
  label: string;
  open: number;
  high: number;
  low: number;
  close: number;
  ma5: number;
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
  timeframe: ChartTimeframe
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
