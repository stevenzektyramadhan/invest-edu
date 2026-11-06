import { NextResponse } from "next/server";
import {
  DEFAULT_MACRO_INDICATORS,
  FALLBACK_ITEMS,
  type MarketItem,
  type MacroIndicator,
} from "@/lib/market-data";

export type { MarketItem, MacroIndicator };

function formatIDR(val: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(val);
}

// ponytail: 60s in-memory server cache to avoid blocking every page load on CoinGecko API — upgrade to Redis/Edge KV when horizontally scaled
let cachedMarketPayload: {
  timestamp: number;
  data: {
    updatedAt: string;
    isLive: boolean;
    macroIndicators: MacroIndicator[];
    items: MarketItem[];
  };
} | null = null;

const LIVE_CACHE_TTL_MS = 60_000;
const FALLBACK_CACHE_TTL_MS = 10_000;

let cachedUsdIdr: { rate: number; timestamp: number } = {
  rate: 15850,
  timestamp: 0,
};

async function getUsdIdrRate(): Promise<number> {
  const now = Date.now();
  if (cachedUsdIdr.timestamp > 0 && now - cachedUsdIdr.timestamp < 30 * 60 * 1000) {
    return cachedUsdIdr.rate;
  }

  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      signal: AbortSignal.timeout(1500),
      headers: { Accept: "application/json" },
    });
    if (res.ok) {
      const data = await res.json();
      if (
        data?.rates?.IDR &&
        typeof data.rates.IDR === "number" &&
        Number.isFinite(data.rates.IDR) &&
        data.rates.IDR > 0
      ) {
        cachedUsdIdr = { rate: Math.round(data.rates.IDR), timestamp: now };
        return cachedUsdIdr.rate;
      }
    }
  } catch {
  }
  return cachedUsdIdr.rate;
}

export async function GET() {
  const now = Date.now();
  const cacheTtl = cachedMarketPayload?.data.isLive
    ? LIVE_CACHE_TTL_MS
    : FALLBACK_CACHE_TTL_MS;
  if (cachedMarketPayload && now - cachedMarketPayload.timestamp < cacheTtl) {
    return NextResponse.json(cachedMarketPayload.data);
  }

  const usdIdrRate = await getUsdIdrRate();
  const macroIndicators = DEFAULT_MACRO_INDICATORS.map((macro) => {
    if (macro.label.includes("USD/IDR")) {
      return {
        ...macro,
        value: `Rp ${usdIdrRate.toLocaleString("id-ID")}`,
        status: usdIdrRate > 16200 ? "Waspada" : "Fluktuatif",
      };
    }
    return macro;
  });

  const items: MarketItem[] = FALLBACK_ITEMS.map((i) => ({ ...i }));
  let liveSourceUsed = false;
  const liveAsOf = new Date(now).toISOString();

  try {
    const cgRes = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=idr&ids=bitcoin,ethereum,pax-gold&sparkline=true&price_change_percentage=24h,7d",
      {
        signal: AbortSignal.timeout(2000),
        headers: { Accept: "application/json" },
      }
    );

    if (cgRes.ok) {
      const cgData = await cgRes.json();
      if (Array.isArray(cgData)) {
        liveSourceUsed = true;
        for (const coin of cgData) {
          const targetIdx = items.findIndex((item) => item.id === coin.id);
          if (targetIdx !== -1) {
            const prices: number[] = coin.sparkline_in_7d?.price || [];
            const step = Math.max(1, Math.ceil(prices.length / 14));
            const sampled =
              prices.length > 14
                ? prices.filter(
                    (_, idx) => idx % step === 0 || idx === prices.length - 1
                  )
                : prices;

            const rawPrice = Math.round(coin.current_price);
            const lastSpark = prices.length > 0 ? prices[prices.length - 1] : 0;
            const sparkScale =
              lastSpark > 0 && rawPrice > lastSpark * 100
                ? rawPrice / lastSpark
                : 1;
            const sampledIdr = sampled.map((p) => Math.round(p * sparkScale));

            items[targetIdx] = {
              ...items[targetIdx],
              rawPrice,
              high24h: Math.round(coin.high_24h ?? rawPrice * 1.018),
              low24h: Math.round(coin.low_24h ?? rawPrice * 0.982),
              priceDisplay: formatIDR(rawPrice),
              change24h: Number((coin.price_change_percentage_24h ?? 0).toFixed(2)),
              change7d: Number(
                (coin.price_change_percentage_7d_in_currency ?? 0).toFixed(2)
              ),
              sparkline:
                sampledIdr.length >= 4 ? sampledIdr : items[targetIdx].sparkline,
              source: "CoinGecko API",
              dataStatus: "live",
              asOf: liveAsOf,
            };

            if (coin.id === "pax-gold" && coin.current_price) {
              const goldGramIdx = items.findIndex((item) => item.id === "gold-idr");
              if (goldGramIdx !== -1) {
                const perGram = Math.round(coin.current_price / 31.1035);
                items[goldGramIdx] = {
                  ...items[goldGramIdx],
                  rawPrice: perGram,
                  high24h: Math.round((coin.high_24h ?? coin.current_price * 1.012) / 31.1035),
                  low24h: Math.round((coin.low_24h ?? coin.current_price * 0.988) / 31.1035),
                  priceDisplay: formatIDR(perGram),
                  change24h: Number((coin.price_change_percentage_24h ?? 0).toFixed(2)),
                  change7d: Number(
                    (coin.price_change_percentage_7d_in_currency ?? 0).toFixed(2)
                  ),
                  sparkline:
                    sampledIdr.length >= 4
                      ? sampledIdr.map((p) => Math.round(p / 31.1035))
                      : items[goldGramIdx].sparkline,
                  source: "Spot Gold (XAU/IDR via CoinGecko)",
                  dataStatus: "live",
                  asOf: liveAsOf,
                };
              }
            }
          }
        }
      }
    }
  } catch {
    // Fallback data remains intact if offline or rate-limited
  }

  if (!liveSourceUsed && cachedUsdIdr.timestamp > 0) {
    const goldGramIdx = items.findIndex((item) => item.id === "gold-idr");
    const paxGoldIdx = items.findIndex((item) => item.id === "pax-gold");
    if (goldGramIdx !== -1 && paxGoldIdx !== -1) {
      const ratio = usdIdrRate / 15850;
      const adjustedPax = Math.round(items[paxGoldIdx].rawPrice * ratio);
      const adjustedGram = Math.round(adjustedPax / 31.1035);
      items[paxGoldIdx] = {
        ...items[paxGoldIdx],
        rawPrice: adjustedPax,
        priceDisplay: formatIDR(adjustedPax),
        high24h: Math.round(adjustedPax * 1.008),
        low24h: Math.round(adjustedPax * 0.992),
        sparkline: items[paxGoldIdx].sparkline.map((p) => Math.round(p * ratio)),
        source: `Estimasi Spot XAU × Kurs Rp ${usdIdrRate.toLocaleString("id-ID")}`,
        asOf: liveAsOf,
      };
      items[goldGramIdx] = {
        ...items[goldGramIdx],
        rawPrice: adjustedGram,
        priceDisplay: formatIDR(adjustedGram),
        high24h: Math.round(adjustedGram * 1.008),
        low24h: Math.round(adjustedGram * 0.992),
        sparkline: items[goldGramIdx].sparkline.map((p) => Math.round(p * ratio)),
        source: `Estimasi Spot XAU × Kurs Rp ${usdIdrRate.toLocaleString("id-ID")}`,
        asOf: liveAsOf,
      };
    }
  }

  const payload = {
    updatedAt: new Date().toISOString(),
    isLive: liveSourceUsed,
    macroIndicators,
    items,
  };

  cachedMarketPayload = {
    timestamp: now,
    data: payload,
  };

  return NextResponse.json(payload);
}
