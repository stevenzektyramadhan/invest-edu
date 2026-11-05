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

export async function GET() {
  const now = Date.now();
  const cacheTtl = cachedMarketPayload?.data.isLive
    ? LIVE_CACHE_TTL_MS
    : FALLBACK_CACHE_TTL_MS;
  if (cachedMarketPayload && now - cachedMarketPayload.timestamp < cacheTtl) {
    return NextResponse.json(cachedMarketPayload.data);
  }

  const items: MarketItem[] = FALLBACK_ITEMS.map((i) => ({ ...i }));
  let liveSourceUsed = false;
  const liveAsOf = new Date(now).toISOString();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);

    const cgRes = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=idr&ids=bitcoin,ethereum,pax-gold&sparkline=true&price_change_percentage=24h,7d",
      {
        signal: controller.signal,
        headers: { Accept: "application/json" },
      }
    );
    clearTimeout(timeout);

    if (cgRes.ok) {
      const cgData = await cgRes.json();
      if (Array.isArray(cgData)) {
        liveSourceUsed = true;
        for (const coin of cgData) {
          const targetIdx = items.findIndex((item) => item.id === coin.id);
          if (targetIdx !== -1) {
            const prices: number[] = coin.sparkline_in_7d?.price || [];
            const sampled =
              prices.length > 14
                ? prices.filter((_, idx) => idx % Math.ceil(prices.length / 14) === 0)
                : prices;

            const rawPrice = Math.round(coin.current_price);
            items[targetIdx] = {
              ...items[targetIdx],
              rawPrice,
              high24h: Math.round(coin.high_24h ?? rawPrice * 1.018),
              low24h: Math.round(coin.low_24h ?? rawPrice * 0.982),
              supportLevel: Math.round(rawPrice * 0.94),
              resistanceLevel: Math.round(rawPrice * 1.06),
              priceDisplay: formatIDR(rawPrice),
              change24h: Number((coin.price_change_percentage_24h ?? 0).toFixed(2)),
              change7d: Number(
                (coin.price_change_percentage_7d_in_currency ?? 0).toFixed(2)
              ),
              sparkline: sampled.length >= 4 ? sampled : items[targetIdx].sparkline,
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
                  supportLevel: Math.round(perGram * 0.96),
                  resistanceLevel: Math.round(perGram * 1.04),
                  priceDisplay: formatIDR(perGram),
                  change24h: Number((coin.price_change_percentage_24h ?? 0).toFixed(2)),
                  change7d: Number(
                    (coin.price_change_percentage_7d_in_currency ?? 0).toFixed(2)
                  ),
                  sparkline:
                    sampled.length >= 4
                      ? sampled.map((p) => Math.round(p / 31.1035))
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

  const payload = {
    updatedAt: new Date().toISOString(),
    isLive: liveSourceUsed,
    macroIndicators: DEFAULT_MACRO_INDICATORS,
    items,
  };

  cachedMarketPayload = {
    timestamp: now,
    data: payload,
  };

  return NextResponse.json(payload);
}
