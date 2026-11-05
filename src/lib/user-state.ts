import type { MacroRegime } from "./recommendation";

const MAX_COMPLETED_MODULES = 50;
const MAX_MODULE_ID_LENGTH = 64;
const MAX_RISK_ANSWERS = 20;
const MAX_RISK_ANSWER_KEY_LENGTH = 64;
const MAX_CAPITAL = 1_000_000_000_000_000;
const MAX_PRICE_ALARMS = 50;
const MAX_ALARM_ID_LENGTH = 64;
const PRICE_ALARM_STRING_FIELDS = [
  ["assetId", 64],
  ["symbol", 32],
  ["assetName", 120],
  ["unitPrefix", 16],
  ["unitSuffix", 16],
  ["note", 200],
  ["triggeredAt", 64],
  ["createdAt", 64],
] as const;

export interface RiskStatePayload {
  answers?: Record<string, number>;
  macroRegime?: MacroRegime;
  capital?: number;
}

export interface UserStatePayload {
  completedModules: string[];
  riskState: RiskStatePayload | null;
  priceAlarms: unknown[];
  updatedAt?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isMacroRegime(
  value: unknown
): value is RiskStatePayload["macroRegime"] {
  return (
    value === "ekspansi" ||
    value === "netral" ||
    value === "bunga_tinggi" ||
    value === "krisis_inflasi"
  );
}

function sanitizeRiskState(input: unknown): RiskStatePayload | null {
  if (!isRecord(input)) return null;

  const state: RiskStatePayload = {};
  const rawAnswers = input["answers"];
  if (isRecord(rawAnswers)) {
    const answers: Record<string, number> = {};
    let answerCount = 0;
    for (const questionId in rawAnswers) {
      if (!Object.hasOwn(rawAnswers, questionId)) continue;
      if (answerCount >= MAX_RISK_ANSWERS) break;
      answerCount += 1;

      const answer = rawAnswers[questionId];
      if (
        questionId.length <= MAX_RISK_ANSWER_KEY_LENGTH &&
        typeof answer === "number" &&
        Number.isFinite(answer)
      ) {
        answers[questionId] = answer;
      }
    }
    if (Object.keys(answers).length > 0) state.answers = answers;
  }

  const macroRegime = input["macroRegime"];
  if (isMacroRegime(macroRegime)) state.macroRegime = macroRegime;

  const capital = input["capital"];
  if (
    typeof capital === "number" &&
    Number.isFinite(capital) &&
    capital >= 0 &&
    capital <= MAX_CAPITAL
  ) {
    state.capital = capital;
  }

  return Object.keys(state).length > 0 ? state : null;
}

function hasAnswers(riskState: RiskStatePayload | null): boolean {
  return Boolean(riskState?.answers && Object.keys(riskState.answers).length > 0);
}

function getAlarmId(alarm: unknown): string | null {
  if (!isRecord(alarm)) return null;
  const id = alarm["id"];
  return typeof id === "string" && id.trim().length > 0 && id.length <= MAX_ALARM_ID_LENGTH
    ? id
    : null;
}

function sanitizePriceAlarm(input: unknown): Record<string, unknown> | null {
  if (!isRecord(input)) return null;

  const id = getAlarmId(input);
  if (id === null) return null;

  const alarm: Record<string, unknown> = { id };
  for (const [field, maxLength] of PRICE_ALARM_STRING_FIELDS) {
    if (!Object.hasOwn(input, field)) continue;
    const value = input[field];
    if (typeof value !== "string" || value.length > maxLength) return null;
    alarm[field] = value;
  }

  if (Object.hasOwn(input, "condition")) {
    const condition = input["condition"];
    if (condition !== "BELOW" && condition !== "ABOVE") return null;
    alarm["condition"] = condition;
  }

  if (Object.hasOwn(input, "targetPrice")) {
    const targetPrice = input["targetPrice"];
    if (
      typeof targetPrice !== "number" ||
      !Number.isFinite(targetPrice) ||
      targetPrice <= 0
    ) {
      return null;
    }
    alarm["targetPrice"] = targetPrice;
  }

  if (Object.hasOwn(input, "triggered")) {
    const triggered = input["triggered"];
    if (typeof triggered !== "boolean") return null;
    alarm["triggered"] = triggered;
  }

  return alarm;
}

function sanitizePriceAlarms(input: unknown): unknown[] {
  if (!Array.isArray(input)) return [];

  const alarms: unknown[] = [];
  for (const alarm of input.slice(0, MAX_PRICE_ALARMS)) {
    const sanitizedAlarm = sanitizePriceAlarm(alarm);
    if (sanitizedAlarm !== null) alarms.push(sanitizedAlarm);
  }
  return alarms;
}

export function emptyUserState(): UserStatePayload {
  return { completedModules: [], riskState: null, priceAlarms: [] };
}

export function sanitizeUserState(input: unknown): UserStatePayload {
  if (!isRecord(input)) return emptyUserState();

  const rawModules = input["completedModules"];
  const rawAlarms = input["priceAlarms"];
  const updatedAt = input["updatedAt"];
  const completedModules = Array.isArray(rawModules)
    ? [
        ...new Set(
          rawModules
            .slice(0, MAX_COMPLETED_MODULES)
            .filter(
              (module): module is string =>
                typeof module === "string" &&
                module.length > 0 &&
                module.length <= MAX_MODULE_ID_LENGTH
            )
        ),
      ]
    : [];

  return {
    completedModules,
    riskState: sanitizeRiskState(input["riskState"]),
    priceAlarms: sanitizePriceAlarms(rawAlarms),
    ...(typeof updatedAt === "string" ? { updatedAt } : {}),
  };
}

export function mergeUserStates(
  cloud: UserStatePayload,
  local?: Partial<UserStatePayload> | null
): UserStatePayload {
  const alarmIds = new Set<string>();
  for (const alarm of cloud.priceAlarms) {
    const id = getAlarmId(alarm);
    if (id !== null) alarmIds.add(id);
  }

  const priceAlarms = [...cloud.priceAlarms];
  for (const alarm of local?.priceAlarms ?? []) {
    const id = getAlarmId(alarm);
    if (id === null || alarmIds.has(id)) continue;
    alarmIds.add(id);
    priceAlarms.push(alarm);
  }

  const merged = {
    completedModules: [
      ...new Set([...cloud.completedModules, ...(local?.completedModules ?? [])]),
    ],
    riskState: hasAnswers(cloud.riskState)
      ? cloud.riskState
      : (local?.riskState ?? null),
    priceAlarms,
  };

  return cloud.updatedAt === undefined
    ? merged
    : { ...merged, updatedAt: cloud.updatedAt };
}
