import assert from "node:assert/strict";
import {
  checkAuthRateLimit,
  hashPassword,
  mergeUserStates,
  resetAuthRateLimitForTests,
  sanitizeUserState,
  verifyPassword,
} from "./auth";
import { classifyRiskScore, generateRecommendation, MACRO_REGIMES } from "./recommendation";
import {
  evaluateAlarms,
  generateOHLCCandles,
  type PriceAlarm,
} from "../components/TradingTerminalModal";

assert.equal(classifyRiskScore(5), "Konservatif");
assert.equal(classifyRiskScore(10), "Moderat");
assert.equal(classifyRiskScore(15), "Agresif");

for (let score = 5; score <= 15; score++) {
  for (const regime of MACRO_REGIMES) {
    const res = generateRecommendation(score, regime.id);
    const total =
      res.allocation.reksaDanaPasarUangObligasi +
      res.allocation.emas +
      res.allocation.saham +
      res.allocation.kripto;
    assert.equal(
      total,
      100,
      `Allocation must sum to 100% for score=${score}, regime=${regime.id}, got ${total}`
    );
  }
}

const sampleAlarms: PriceAlarm[] = [
  {
    id: "a1",
    assetId: "bbca",
    symbol: "BBCA.JK",
    assetName: "Bank Central Asia",
    condition: "BELOW",
    targetPrice: 9600,
    unitPrefix: "Rp ",
    unitSuffix: "",
    note: "Cicil beli",
    triggered: false,
    createdAt: "10:00",
  },
  {
    id: "a2",
    assetId: "bitcoin",
    symbol: "BTC",
    assetName: "Bitcoin",
    condition: "ABOVE",
    targetPrice: 1500000000,
    unitPrefix: "Rp ",
    unitSuffix: "",
    note: "Take profit",
    triggered: false,
    createdAt: "10:00",
  },
];

const eval1 = evaluateAlarms(sampleAlarms, { bbca: 9550, bitcoin: 1425000000 });
assert.equal(eval1.newlyTriggered.length, 1);
assert.equal(eval1.newlyTriggered[0].id, "a1");
assert.equal(eval1.updated[0].triggered, true);
assert.equal(eval1.updated[1].triggered, false);

const candles = generateOHLCCandles(
  {
    id: "bbca",
    symbol: "BBCA.JK",
    name: "BCA",
    category: "Saham & Indeks",
    rawPrice: 9850,
    unitPrefix: "Rp ",
    unitSuffix: "",
    tradingViewSymbol: "IDX:BBCA",
    high24h: 9925,
    low24h: 9750,
    supportLevel: 9500,
    resistanceLevel: 10200,
    priceDisplay: "Rp 9.850",
    change24h: 0.77,
    change7d: 2.08,
    sparkline: [9650, 9700, 9675, 9750, 9800, 9825, 9850],
    educationalNote: "",
    source: "Test",
  },
  "1W"
);
assert.equal(candles.length, 36);
assert.equal(candles[candles.length - 1].close, 9850);

const passwordHash = hashPassword("rahasia-aman");
assert.equal(verifyPassword("rahasia-aman", passwordHash), true);
assert.equal(verifyPassword("password-salah", passwordHash), false);
assert.doesNotThrow(() => {
  assert.equal(verifyPassword("a".repeat(200), passwordHash), false);
});

resetAuthRateLimitForTests();
const rateLimitNow = 1_700_000_000_000;
for (let attempt = 0; attempt < 10; attempt++) {
  assert.equal(
    checkAuthRateLimit("127.0.0.1:rate-limit@example.com", rateLimitNow).allowed,
    true
  );
}
const blockedAttempt = checkAuthRateLimit(
  "127.0.0.1:rate-limit@example.com",
  rateLimitNow
);
assert.equal(blockedAttempt.allowed, false);
assert.ok(blockedAttempt.retryAfterSeconds > 0);
resetAuthRateLimitForTests();

const sanitizedState = sanitizeUserState({
  completedModules: ["reksadana-dasar", 42, "reksadana-dasar"],
  riskState: {
    answers: { horizon: 2, invalid: "dua" },
    macroRegime: "ekspansi",
    capital: 10_000_000,
  },
  priceAlarms: [{ id: "alarm-guest" }],
});
assert.deepEqual(sanitizedState, {
  completedModules: ["reksadana-dasar"],
  riskState: {
    answers: { horizon: 2 },
    macroRegime: "ekspansi",
    capital: 10_000_000,
  },
  priceAlarms: [{ id: "alarm-guest" }],
});

const sanitizedAlarms = sanitizeUserState({
  priceAlarms: [
    {
      id: "alarm-allowed",
      assetId: "bitcoin",
      condition: "ABOVE",
      targetPrice: 100,
      unknown: "drop me",
    },
    { id: "alarm-invalid-condition", condition: "HACK" },
    { id: "alarm-negative-target", targetPrice: -5 },
  ],
});
assert.deepEqual(sanitizedAlarms.priceAlarms, [
  {
    id: "alarm-allowed",
    assetId: "bitcoin",
    condition: "ABOVE",
    targetPrice: 100,
  },
]);

const cappedAlarms = sanitizeUserState({
  priceAlarms: Array.from({ length: 51 }, (_, index) => ({
    id: `alarm-${index}`,
  })),
});
assert.equal(cappedAlarms.priceAlarms.length, 50);

const mergedState = mergeUserStates(
  {
    completedModules: ["reksadana-dasar"],
    riskState: { answers: { horizon: 3 } },
    priceAlarms: [{ id: "alarm-cloud" }],
  },
  {
    completedModules: ["emas-safe-haven", "reksadana-dasar"],
    riskState: { answers: { horizon: 1 } },
    priceAlarms: [{ id: "alarm-cloud" }, { id: "alarm-guest" }],
  }
);
assert.deepEqual(mergedState, {
  completedModules: ["reksadana-dasar", "emas-safe-haven"],
  riskState: { answers: { horizon: 3 } },
  priceAlarms: [{ id: "alarm-cloud" }, { id: "alarm-guest" }],
});

const guestRiskFallback = mergeUserStates(
  {
    completedModules: [],
    riskState: { answers: {}, macroRegime: "netral" },
    priceAlarms: [],
  },
  { riskState: { answers: { income: 2 } } }
);
assert.deepEqual(guestRiskFallback.riskState, { answers: { income: 2 } });

console.log("self-check passed: allocation, alarms, auth, and user state verified");
