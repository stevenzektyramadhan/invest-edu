<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Multi Brain (MANDATORY)

- Read `.multibrain/session.md` before starting work.
- Use `.multibrain/session.md` as the master index only.
- Open only the `.multibrain/indexes/*.md` bucket files that match the current task.
- Open `.multibrain/context/*.md` only when the selected bucket points to deeper context that matters.
- After meaningful work, update the relevant named bucket and refresh the master index if needed.

## Commands & Verification

- **Package manager**: `bun` (`bun@1.4.4`, `bun.lock`)
- **Dev server**: `bun run dev` (`next dev` with Turbopack on `http://localhost:3000`; `serverExternalPackages: ["@libsql/client", "libsql"]` in `next.config.ts` keeps both `@tailwindcss/turbopack` CSS compilation and `@libsql/client` working)
- **Verification order**:
  1. `npx tsc --noEmit` — typecheck (`tsconfig.json` strict mode)
  2. `bun src/lib/recommendation.test.ts` — `node:assert/strict` self-check for portfolio allocation (`generateRecommendation`), price alarm evaluation (`evaluateAlarms`), and OHLC candle generation (`generateOHLCCandles`)
  3. `bun run lint` — ESLint (`eslint-config-next/core-web-vitals` + `typescript`)
  4. `bun run build` — production Next.js build

## Architecture & Module Boundaries

- **Client vs. Server data boundary**: Shared market types and fallback constants (`MarketItem`, `MacroIndicator`, `FALLBACK_ITEMS`, `DEFAULT_MACRO_INDICATORS`) live in `src/lib/market-data.ts`. Never import from `src/app/api/market/route.ts` inside `"use client"` files (`src/app/market/page.tsx`, `src/components/TradingTerminalModal.tsx`), or Turbopack will bundle `next/server` into client chunks.
- **Market API (`src/app/api/market/route.ts`)**: Uses a 60s in-memory cache (`cachedMarketPayload`) and 2000ms `AbortSignal.timeout` against CoinGecko (`BTC`, `ETH`, `PAXG` gold proxy), merging live crypto/gold prices into `FALLBACK_ITEMS`. Client state in `src/app/market/page.tsx` initializes directly from `FALLBACK_ITEMS` and `DEFAULT_MACRO_INDICATORS` for 0ms first paint.
- **User persistence & Multi-User Auth (`src/lib/db.ts`, `src/lib/auth.ts`, `src/lib/user-sync.ts`)**: Client pages retain immediate `localStorage` state for 0ms guest mode and sync authenticated user state through `/api/auth` (register/login/logout/me with `node:crypto` `scryptSync` + `httpOnly` cookie `investedu_session`) and `/api/user-state` (`GET`/`PUT`) to Turso/libSQL (`TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN`, defaulting to `file:investedu.db` locally). Keep `@libsql/client`, `src/lib/db.ts`, and `src/lib/auth.ts` server-only.
  - `investedu_completed_modules`: `string[]` of completed module IDs from `src/data/education.ts` (synced between `/` and `/education`)
  - `investedu_risk_state`: `{ answers, macroRegime, capital }` (synced between `/` and `/recommendation`)
  - `investedu_price_alarms_v1`: `PriceAlarm[]` (managed in `/market` and `src/components/TradingTerminalModal.tsx`)

## Toolchain & Styling Gotchas

- **Next.js config (`next.config.ts`)**: Uses `@tailwindcss/turbopack` loader for `*.css`. Do **not** enable `cacheComponents` or `partialPrefetching` — they cache stale SSR output in `.next/dev` and trigger React hydration mismatches on `"use client"` routes.
- **Tailwind v4 CSS specificity (`src/app/globals.css`)**: `@import "tailwindcss";` places utilities inside `@layer utilities`. Unlayered rules on `html, body` in `globals.css` override Tailwind classes like `bg-slate-950`, so keep `background-color: #020617` in `globals.css` matched with `src/app/layout.tsx`.
- **Trading terminal layout (`src/components/TradingTerminalModal.tsx`)**: Relies on `.tv-modal-grid`, `.tv-modal-chart-pane`, and `.tv-modal-alarm-pane` in `src/app/globals.css` (`minmax(0, 1fr) 340px` at `@media (min-width: 900px)`) and deduplicated `lightweight-charts` crosshair/ResizeObserver callbacks to prevent 60Hz React re-render stalls.
- **Service Worker killer (`public/sw.js` & `src/app/layout.tsx`)**: The inline cleanup script in `src/app/layout.tsx` runs only when `process.env.NODE_ENV === "development"` to unregister stale `localhost:3000` Service Workers (`labkom-pwa-*`) and clear `CacheStorage`, while `public/sw.js` and `Clear-Site-Data: "cache"` on `/sw.js` in `next.config.ts` remain in place as a safety net. Do not replace with a Service Worker that caches `/_next/static/*`, as caching `/_next/static/*` breaks Turbopack chunks and hydration.
