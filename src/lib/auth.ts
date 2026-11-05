import {
  createHash,
  randomBytes,
  randomUUID,
  scrypt,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";
import type { Row } from "@libsql/client";
import { ensureSchema, getDb } from "./db";
import { emptyUserState, sanitizeUserState } from "./user-state";
import type { UserStatePayload } from "./user-state";

export {
  mergeUserStates,
  sanitizeUserState,
} from "./user-state";
export type { RiskStatePayload, UserStatePayload } from "./user-state";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface UserWithPassword extends AuthUser {
  passwordHash: string;
}

interface NewUser {
  email: string;
  name: string;
  passwordHash: string;
}

export const SESSION_COOKIE_NAME = "investedu_session";
export const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 128;

const PASSWORD_KEY_LENGTH = 64;
const scryptAsync = promisify(scrypt);
export const DUMMY_PASSWORD_HASH = `${randomBytes(16).toString("hex")}:${randomBytes(PASSWORD_KEY_LENGTH).toString("hex")}`;
const AUTH_RATE_LIMIT_WINDOW_MS = 60_000;
const AUTH_RATE_LIMIT_MAX_ATTEMPTS = 10;
export const AUTH_IP_RATE_LIMIT_WINDOW_MS = 60_000;
export const AUTH_IP_RATE_LIMIT_MAX_ATTEMPTS = 20;
export const AUTH_EMAIL_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
export const AUTH_EMAIL_RATE_LIMIT_MAX_ATTEMPTS = 5;
let lastRateLimitPruneAt = 0;

function readString(row: Row | undefined, column: string): string | null {
  if (!row) return null;
  const value = row[column];
  return typeof value === "string" ? value : null;
}

function readNumber(row: Row | undefined, column: string): number | null {
  if (!row) return null;
  const value = row[column];
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "bigint") return Number(value);
  return null;
}

function readAuthUser(row: Row | undefined): AuthUser | null {
  const id = readString(row, "id");
  const email = readString(row, "email");
  const name = readString(row, "name");
  if (id === null || email === null || name === null) return null;
  return { id, email, name };
}

function parseStoredJson(value: string | null): unknown {
  if (value === null) return undefined;
  try {
    return JSON.parse(value);
  } catch (error) {
    if (error instanceof SyntaxError) return undefined;
    throw error;
  }
}

function serialize(value: unknown): string {
  return JSON.stringify(value) ?? "null";
}

export async function hashPassword(password: string): Promise<string> {
  if (
    password.length < MIN_PASSWORD_LENGTH ||
    password.length > MAX_PASSWORD_LENGTH
  ) {
    throw new RangeError("Password length out of bounds");
  }

  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scryptAsync(
    password,
    salt,
    PASSWORD_KEY_LENGTH
  )) as Buffer;
  const hashHex = derivedKey.toString("hex");
  return `${salt}:${hashHex}`;
}

export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  if (password.length < 1 || password.length > MAX_PASSWORD_LENGTH) return false;

  const [salt, hashHex, ...extra] = storedHash.split(":");
  if (!salt || !hashHex || extra.length > 0 || !/^[a-f\d]{128}$/i.test(hashHex)) {
    return false;
  }

  const expectedHash = Buffer.from(hashHex, "hex");
  const actualHash = (await scryptAsync(
    password,
    salt,
    PASSWORD_KEY_LENGTH
  )) as Buffer;
  return (
    expectedHash.length === actualHash.length &&
    timingSafeEqual(expectedHash, actualHash)
  );
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

async function pruneExpiredAuthRateLimits(now: number): Promise<void> {
  if (Math.abs(now - lastRateLimitPruneAt) < AUTH_RATE_LIMIT_WINDOW_MS) return;
  lastRateLimitPruneAt = now;
  await getDb().execute({
    sql: "DELETE FROM rate_limits WHERE reset_at <= ?",
    args: [now],
  });
}

function getRateLimitPolicy(key: string): {
  maxAttempts: number;
  windowMs: number;
} {
  if (key.startsWith("ip:")) {
    return {
      maxAttempts: AUTH_IP_RATE_LIMIT_MAX_ATTEMPTS,
      windowMs: AUTH_IP_RATE_LIMIT_WINDOW_MS,
    };
  }
  if (key.startsWith("email:")) {
    return {
      maxAttempts: AUTH_EMAIL_RATE_LIMIT_MAX_ATTEMPTS,
      windowMs: AUTH_EMAIL_RATE_LIMIT_WINDOW_MS,
    };
  }
  return {
    maxAttempts: AUTH_RATE_LIMIT_MAX_ATTEMPTS,
    windowMs: AUTH_RATE_LIMIT_WINDOW_MS,
  };
}

export async function checkAuthRateLimit(
  key: string,
  now = Date.now()
): Promise<{ allowed: boolean; retryAfterSeconds: number }> {
  await ensureSchema();
  await pruneExpiredAuthRateLimits(now);

  const policy = getRateLimitPolicy(key);
  const nextResetAt = now + policy.windowMs;
  const result = await getDb().execute({
    sql: `INSERT INTO rate_limits (key, count, reset_at)
      VALUES (?, 1, ?)
      ON CONFLICT(key) DO UPDATE SET
        count = CASE WHEN rate_limits.reset_at <= ? THEN 1 ELSE rate_limits.count + 1 END,
        reset_at = CASE WHEN rate_limits.reset_at <= ? THEN excluded.reset_at ELSE rate_limits.reset_at END
      RETURNING count, reset_at`,
    args: [key, nextResetAt, now, now],
  });

  const row = result.rows[0];
  const count = readNumber(row, "count") ?? 1;
  const resetAt = readNumber(row, "reset_at") ?? nextResetAt;

  if (count <= policy.maxAttempts) {
    return { allowed: true, retryAfterSeconds: 0 };
  }

  return {
    allowed: false,
    retryAfterSeconds: Math.max(1, Math.ceil((resetAt - now) / 1000)),
  };
}

export async function checkAuthAttemptRateLimit(
  clientIp: string,
  email: string,
  now = Date.now()
): Promise<{ allowed: boolean; retryAfterSeconds: number }> {
  const normalizedIp = clientIp.trim() || "local";
  const normalizedEmail = normalizeEmail(email);

  const ipResult = await checkAuthRateLimit(`ip:${normalizedIp}`, now);
  const emailResult = normalizedEmail
    ? await checkAuthRateLimit(`email:${normalizedEmail}`, now)
    : { allowed: true, retryAfterSeconds: 0 };

  if (!ipResult.allowed || !emailResult.allowed) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(
        ipResult.retryAfterSeconds,
        emailResult.retryAfterSeconds
      ),
    };
  }

  return { allowed: true, retryAfterSeconds: 0 };
}

export async function clearAuthRateLimit(key: string): Promise<void> {
  await ensureSchema();
  await getDb().execute({
    sql: "DELETE FROM rate_limits WHERE key = ?",
    args: [key],
  });
}

export async function resetAuthRateLimitForTests(): Promise<void> {
  await ensureSchema();
  lastRateLimitPruneAt = 0;
  await getDb().execute("DELETE FROM rate_limits");
}

export async function getUserByEmail(
  email: string
): Promise<UserWithPassword | null> {
  await ensureSchema();
  const result = await getDb().execute({
    sql: "SELECT id, email, name, password_hash FROM users WHERE email = ? LIMIT 1",
    args: [email],
  });
  const user = readAuthUser(result.rows[0]);
  const passwordHash = readString(result.rows[0], "password_hash");
  if (!user || passwordHash === null) return null;
  return { ...user, passwordHash };
}

export async function createUser(input: NewUser): Promise<AuthUser> {
  await ensureSchema();
  const user: AuthUser = {
    id: randomUUID(),
    email: input.email,
    name: input.name,
  };
  await getDb().execute({
    sql: "INSERT INTO users (id, email, name, password_hash, created_at) VALUES (?, ?, ?, ?, ?)",
    args: [
      user.id,
      user.email,
      user.name,
      input.passwordHash,
      new Date().toISOString(),
    ],
  });
  return user;
}

export function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(
  userId: string,
  now = Date.now()
): Promise<string> {
  await ensureSchema();
  const token = randomUUID();
  const tokenHash = hashSessionToken(token);
  await getDb().execute({
    sql: "DELETE FROM sessions WHERE expires_at < ?",
    args: [now],
  });
  await getDb().execute({
    sql: "INSERT INTO sessions (token, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)",
    args: [
      tokenHash,
      userId,
      now + SESSION_TTL_MS,
      new Date(now).toISOString(),
    ],
  });
  return token;
}

export async function deleteSession(token: string): Promise<void> {
  await ensureSchema();
  const tokenHash = hashSessionToken(token);
  await getDb().execute({
    sql: "DELETE FROM sessions WHERE token = ?",
    args: [tokenHash],
  });
}

export async function getUserBySessionToken(
  token: string | undefined,
  now = Date.now()
): Promise<{ id: string; email: string; name: string } | null> {
  if (!token) return null;
  await ensureSchema();
  const tokenHash = hashSessionToken(token);
  const result = await getDb().execute({
    sql: `SELECT users.id, users.email, users.name
      FROM sessions
      JOIN users ON users.id = sessions.user_id
      WHERE sessions.token = ? AND sessions.expires_at > ?
      LIMIT 1`,
    args: [tokenHash, now],
  });
  return readAuthUser(result.rows[0]);
}

export async function getUserStateFromDb(
  userId: string
): Promise<UserStatePayload> {
  await ensureSchema();
  const result = await getDb().execute({
    sql: "SELECT completed_modules, risk_state, price_alarms, updated_at FROM user_state WHERE user_id = ? LIMIT 1",
    args: [userId],
  });
  const row = result.rows[0];
  if (!row) return emptyUserState();

  return sanitizeUserState({
    completedModules: parseStoredJson(readString(row, "completed_modules")),
    riskState: parseStoredJson(readString(row, "risk_state")),
    priceAlarms: parseStoredJson(readString(row, "price_alarms")),
    updatedAt: readString(row, "updated_at"),
  });
}

export async function saveUserStateToDb(
  userId: string,
  partial: Partial<UserStatePayload>
): Promise<UserStatePayload> {
  await ensureSchema();
  const incoming = sanitizeUserState(partial);
  const updatedAt = new Date().toISOString();
  const tx = await getDb().transaction("write");
  try {
    const result = await tx.execute({
      sql: "SELECT completed_modules, risk_state, price_alarms, updated_at FROM user_state WHERE user_id = ? LIMIT 1",
      args: [userId],
    });
    const row = result.rows[0];
    const current = row
      ? sanitizeUserState({
          completedModules: parseStoredJson(
            readString(row, "completed_modules")
          ),
          riskState: parseStoredJson(readString(row, "risk_state")),
          priceAlarms: parseStoredJson(readString(row, "price_alarms")),
          updatedAt: readString(row, "updated_at"),
        })
      : emptyUserState();

    const mergedModules =
      partial.completedModules === undefined
        ? current.completedModules
        : sanitizeUserState({
            completedModules: [
              ...new Set([
                ...current.completedModules,
                ...incoming.completedModules,
              ]),
            ],
          }).completedModules;

    const state: UserStatePayload & { updatedAt: string } = {
      completedModules: mergedModules,
      riskState:
        partial.riskState === undefined
          ? current.riskState
          : incoming.riskState,
      priceAlarms:
        partial.priceAlarms === undefined
          ? current.priceAlarms
          : incoming.priceAlarms,
      updatedAt,
    };

    await tx.execute({
      sql: `INSERT INTO user_state (user_id, completed_modules, risk_state, price_alarms, updated_at)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET
          completed_modules = excluded.completed_modules,
          risk_state = excluded.risk_state,
          price_alarms = excluded.price_alarms,
          updated_at = excluded.updated_at`,
      args: [
        userId,
        serialize(state.completedModules),
        serialize(state.riskState),
        serialize(state.priceAlarms),
        state.updatedAt,
      ],
    });
    await tx.commit();
    return state;
  } catch (error) {
    await tx.rollback().catch(() => undefined);
    throw error;
  } finally {
    tx.close();
  }
}
