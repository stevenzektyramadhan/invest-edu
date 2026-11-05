import assert from "node:assert/strict";
import { scrypt } from "node:crypto";
import { promisify } from "node:util";
import {
  DUMMY_PASSWORD_HASH,
  SESSION_TTL_MS,
  checkAuthAttemptRateLimit,
  checkAuthRateLimit,
  clearAuthRateLimit,
  createSession,
  createUser,
  deleteSession,
  deleteUserAccount,
  getUserBySessionToken,
  getUserStateFromDb,
  hashPassword,
  hashSessionToken,
  mergeUserStates,
  resetAuthRateLimitForTests,
  sanitizeUserState,
  saveUserStateToDb,
  verifyPassword,
} from "./auth";
import { getDb } from "./db";
import {
  ASSET_SCENARIO_ASSUMPTIONS,
  classifyRiskProfile,
  classifyRiskScore,
  generateRecommendation,
  MACRO_REGIMES,
  type RiskAnswers,
} from "./recommendation";
import {
  EDUCATION_MODULES,
  getNextRecommendedModule,
  getSequentialLearningModules,
  hasCompletedCategoryPrerequisites,
} from "../data/education";
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

const noEmergencyFundHighOther: RiskAnswers = {
  horizon: 3,
  drawdown: 3,
  emergency_fund: 1,
  income: 3,
  experience: 3,
};
assert.equal(classifyRiskProfile(noEmergencyFundHighOther), "Konservatif");
for (const regime of MACRO_REGIMES) {
  const rec = generateRecommendation(13, regime.id, noEmergencyFundHighOther);
  assert.equal(rec.profile, "Konservatif");
  assert.equal(
    rec.allocation.kripto,
    0,
    `emergency_fund=1 must force kripto=0 in regime=${regime.id}`
  );
  assert.match(rec.tacticalActions[0], /dana darurat 3–6× pengeluaran bulanan/i);
  assert.ok(rec.reasons.some((r) => r.toLowerCase().includes("dana darurat")));
}

for (const baseLevel of [1, 2, 3]) {
  for (const emergencyFund of [1, 2, 3]) {
    for (const horizon of [1, 2, 3]) {
      for (const regime of MACRO_REGIMES) {
        const answers: RiskAnswers = {
          horizon,
          drawdown: baseLevel,
          emergency_fund: emergencyFund,
          income: baseLevel,
          experience: baseLevel,
        };
        const score =
          answers.horizon! +
          answers.drawdown! +
          answers.emergency_fund! +
          answers.income! +
          answers.experience!;
        const rec = generateRecommendation(score, regime.id, answers);
        const { reksaDanaPasarUangObligasi, emas, saham, kripto } = rec.allocation;
        assert.ok(
          reksaDanaPasarUangObligasi >= 0 && emas >= 0 && saham >= 0 && kripto >= 0,
          `Negative allocation found for regime=${regime.id}, ef=${emergencyFund}, h=${horizon}`
        );
        assert.equal(
          reksaDanaPasarUangObligasi + emas + saham + kripto,
          100,
          `Sum must be 100 for regime=${regime.id}, ef=${emergencyFund}, h=${horizon}`
        );
        if (emergencyFund === 1) {
          assert.equal(rec.profile, "Konservatif");
          assert.equal(kripto, 0);
          assert.ok(rec.reasons.some((r) => r.toLowerCase().includes("dana darurat")));
        }
        if (horizon === 1) {
          assert.ok(saham <= 10, `horizon=1 must cap saham <= 10, got ${saham}`);
          assert.equal(kripto, 0, `horizon=1 must force kripto=0, got ${kripto}`);
          assert.ok(rec.reasons.some((r) => r.toLowerCase().includes("jangka pendek")));
        }
        assert.ok(rec.scenarios.badPct <= rec.scenarios.basePct);
        assert.ok(rec.scenarios.basePct <= rec.scenarios.goodPct);
        assert.ok(!rec.rationale.toLowerCase().includes("mesin alokasi"));
        assert.ok(!rec.rationale.toLowerCase().includes("mengoptimalkan imbal hasil"));
        const stablePct = reksaDanaPasarUangObligasi + emas;
        const growthPct = saham + kripto;
        const joinedTactical = rec.tacticalActions.join(" ");
        assert.ok(
          joinedTactical.includes(`${stablePct}% aset stabil`) &&
            joinedTactical.includes(`${growthPct}% aset pertumbuhan`),
          `Expected tacticalActions to mention ${stablePct}% aset stabil and ${growthPct}% aset pertumbuhan`
        );
        const kriptoDetail = rec.instrumentDetails.find((d) => d.asset === "Aset Kripto");
        if (kripto > 0) {
          assert.ok(
            kriptoDetail?.specificInstruments.toLowerCase().includes("contoh"),
            "Expected kripto specificInstruments to include 'contoh'"
          );
        }
      }
    }
  }
}

const recUserA = generateRecommendation(10, "netral", {
  horizon: 3,
  drawdown: 2,
  emergency_fund: 2,
  income: 2,
  experience: 1,
});
const recUserB = generateRecommendation(10, "netral", {
  horizon: 2,
  drawdown: 2,
  emergency_fund: 2,
  income: 2,
  experience: 2,
});
assert.notDeepEqual(recUserA.reasons, recUserB.reasons);
assert.notEqual(recUserA.rationale, recUserB.rationale);

for (const assumption of Object.values(ASSET_SCENARIO_ASSUMPTIONS)) {
  assert.ok(assumption.source.length > 0);
  assert.ok(assumption.period.length > 0);
}

for (const regime of MACRO_REGIMES) {
  const konservatif = generateRecommendation(5, regime.id, {
    horizon: 1,
    drawdown: 1,
    emergency_fund: 1,
    income: 1,
    experience: 1,
  });
  const moderat = generateRecommendation(10, regime.id, {
    horizon: 2,
    drawdown: 2,
    emergency_fund: 2,
    income: 2,
    experience: 2,
  });
  const agresif = generateRecommendation(15, regime.id, {
    horizon: 3,
    drawdown: 3,
    emergency_fund: 3,
    income: 3,
    experience: 3,
  });
  assert.ok(
    Math.abs(agresif.worstCaseDrawdownPct) >= Math.abs(moderat.worstCaseDrawdownPct),
    `Expected |Agresif drawdown| >= |Moderat drawdown| in regime=${regime.id}`
  );
  assert.ok(
    Math.abs(moderat.worstCaseDrawdownPct) >= Math.abs(konservatif.worstCaseDrawdownPct),
    `Expected |Moderat drawdown| >= |Konservatif drawdown| in regime=${regime.id}`
  );
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
    priceDisplay: "Rp 9.850",
    change24h: 0.77,
    change7d: 2.08,
    sparkline: [9650, 9700, 9675, 9750, 9800, 9825, 9850],
    educationalNote: "",
    source: "Test",
    dataStatus: "static",
    asOf: "TODO(owner)",
  },
  "1W"
);
assert.equal(candles.length, 36);
assert.equal(candles[candles.length - 1].close, 9850);

const passwordHash = await hashPassword("rahasia-aman");
assert.equal(await verifyPassword("rahasia-aman", passwordHash), true);
assert.equal(await verifyPassword("password-salah", passwordHash), false);
assert.equal(await verifyPassword("a".repeat(200), passwordHash), false);
assert.equal(await verifyPassword("rahasia-aman", DUMMY_PASSWORD_HASH), false);
await assert.rejects(() => hashPassword("1234567"), RangeError);

const scryptTestAsync = promisify(scrypt);
const legacySalt = "0123456789abcdef0123456789abcdef";
const legacyDerived = (await scryptTestAsync("123456", legacySalt, 64)) as Buffer;
const legacyHash = `${legacySalt}:${legacyDerived.toString("hex")}`;
assert.equal(await verifyPassword("123456", legacyHash), true);
assert.equal(await verifyPassword("654321", legacyHash), false);

await resetAuthRateLimitForTests();
const rateLimitNow = 1_700_000_000_000;
for (let attempt = 0; attempt < 10; attempt++) {
  assert.equal(
    (await checkAuthRateLimit("127.0.0.1:rate-limit@example.com", rateLimitNow))
      .allowed,
    true
  );
}
const blockedAttempt = await checkAuthRateLimit(
  "127.0.0.1:rate-limit@example.com",
  rateLimitNow
);
assert.equal(blockedAttempt.allowed, false);
assert.ok(blockedAttempt.retryAfterSeconds > 0);

await resetAuthRateLimitForTests();
for (let attempt = 0; attempt < 20; attempt++) {
  const res = await checkAuthAttemptRateLimit(
    "203.0.113.10",
    `attacker-${attempt}@example.com`,
    rateLimitNow
  );
  assert.equal(res.allowed, true);
}
const ipBlocked = await checkAuthAttemptRateLimit(
  "203.0.113.10",
  "attacker-20@example.com",
  rateLimitNow
);
assert.equal(ipBlocked.allowed, false);
assert.ok(ipBlocked.retryAfterSeconds > 0);

await resetAuthRateLimitForTests();
for (let attempt = 0; attempt < 5; attempt++) {
  const res = await checkAuthAttemptRateLimit(
    `198.51.100.${attempt + 1}`,
    "victim@example.com",
    rateLimitNow
  );
  assert.equal(res.allowed, true);
}
const emailBlocked = await checkAuthAttemptRateLimit(
  "198.51.100.99",
  "victim@example.com",
  rateLimitNow
);
assert.equal(emailBlocked.allowed, false);
assert.ok(emailBlocked.retryAfterSeconds > 0);

await clearAuthRateLimit("email:victim@example.com");
const afterLoginClear = await checkAuthAttemptRateLimit(
  "198.51.100.100",
  "victim@example.com",
  rateLimitNow
);
assert.equal(afterLoginClear.allowed, true);
await resetAuthRateLimitForTests();

const sessionTestEmail = "session-test@example.com";
await getDb().execute({
  sql: "DELETE FROM users WHERE email = ?",
  args: [sessionTestEmail],
});
const sessionUser = await createUser({
  email: sessionTestEmail,
  name: "Session Tester",
  passwordHash,
});
await getDb().execute({
  sql: "DELETE FROM sessions WHERE user_id = ?",
  args: [sessionUser.id],
});

const expiredToken = await createSession(
  sessionUser.id,
  rateLimitNow - SESSION_TTL_MS - 1_000
);
const activeToken = await createSession(sessionUser.id, rateLimitNow);

const rawTokenMatch = await getDb().execute({
  sql: "SELECT token FROM sessions WHERE token = ?",
  args: [activeToken],
});
assert.equal(rawTokenMatch.rows.length, 0);

const hashedTokenMatch = await getDb().execute({
  sql: "SELECT token FROM sessions WHERE token = ?",
  args: [hashSessionToken(activeToken)],
});
assert.equal(hashedTokenMatch.rows.length, 1);

const expiredTokenMatch = await getDb().execute({
  sql: "SELECT token FROM sessions WHERE token = ?",
  args: [hashSessionToken(expiredToken)],
});
assert.equal(expiredTokenMatch.rows.length, 0);

const resolvedSessionUser = await getUserBySessionToken(
  activeToken,
  rateLimitNow
);
assert.deepEqual(resolvedSessionUser, sessionUser);

await deleteSession(activeToken);
assert.equal(await getUserBySessionToken(activeToken, rateLimitNow), null);

await getDb().execute({
  sql: "DELETE FROM user_state WHERE user_id = ?",
  args: [sessionUser.id],
});
await Promise.all([
  saveUserStateToDb(sessionUser.id, { completedModules: ["reksadana-dasar"] }),
  saveUserStateToDb(sessionUser.id, { completedModules: ["emas-safe-haven"] }),
]);
const stateAfterConcurrentSaves = await getUserStateFromDb(sessionUser.id);
assert.equal(
  stateAfterConcurrentSaves.completedModules.includes("reksadana-dasar"),
  true
);
assert.equal(
  stateAfterConcurrentSaves.completedModules.includes("emas-safe-haven"),
  true
);

const deleteAccountSessionToken = await createSession(
  sessionUser.id,
  rateLimitNow
);
assert.equal(
  await deleteUserAccount(sessionUser.id, "wrong-password-123"),
  false
);
assert.equal(await deleteUserAccount("nonexistent-user-id", "rahasia-aman"), false);
assert.deepEqual(
  await getUserBySessionToken(deleteAccountSessionToken, rateLimitNow),
  sessionUser
);

assert.equal(await deleteUserAccount(sessionUser.id, "rahasia-aman"), true);
assert.equal(
  await getUserBySessionToken(deleteAccountSessionToken, rateLimitNow),
  null
);
const remainingUsers = await getDb().execute({
  sql: "SELECT id FROM users WHERE id = ?",
  args: [sessionUser.id],
});
assert.equal(remainingUsers.rows.length, 0);
const remainingSessions = await getDb().execute({
  sql: "SELECT token FROM sessions WHERE user_id = ?",
  args: [sessionUser.id],
});
assert.equal(remainingSessions.rows.length, 0);
const remainingUserState = await getDb().execute({
  sql: "SELECT user_id FROM user_state WHERE user_id = ?",
  args: [sessionUser.id],
});
assert.equal(remainingUserState.rows.length, 0);

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

const sequentialPath = getSequentialLearningModules();
assert.equal(sequentialPath.length, EDUCATION_MODULES.length);
assert.equal(sequentialPath[0]?.id, "dasar-tujuan-dana-darurat");
assert.equal(sequentialPath[1]?.id, "dasar-inflasi-bunga-majemuk");
assert.equal(sequentialPath[2]?.id, "dasar-waspada-bodong-pinjol");
assert.equal(sequentialPath[3]?.id, "reksadana-dasar");
assert.equal(sequentialPath[4]?.id, "emas-safe-haven");
assert.equal(sequentialPath[5]?.id, "saham-fundamental");

const firstRecommended = getNextRecommendedModule([]);
assert.equal(firstRecommended?.id, "dasar-tujuan-dana-darurat");
const secondRecommended = getNextRecommendedModule(["dasar-tujuan-dana-darurat"]);
assert.equal(secondRecommended?.id, "dasar-inflasi-bunga-majemuk");

const lanjutanReksadana = EDUCATION_MODULES.find(
  (m) => m.id === "reksadana-obligasi-lanjutan"
);
assert.ok(lanjutanReksadana);
assert.equal(hasCompletedCategoryPrerequisites(lanjutanReksadana, []), false);
assert.equal(
  hasCompletedCategoryPrerequisites(lanjutanReksadana, [
    "reksadana-dasar",
    "reksadana-seleksi",
    "reksadana-sbn-ritel",
  ]),
  true
);

console.log("self-check passed: allocation, alarms, auth, and user state verified");
