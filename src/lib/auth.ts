import {
  randomBytes,
  randomUUID,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
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
export const MIN_PASSWORD_LENGTH = 6;
export const MAX_PASSWORD_LENGTH = 128;

const PASSWORD_KEY_LENGTH = 64;
const AUTH_RATE_LIMIT_WINDOW_MS = 60_000;
const AUTH_RATE_LIMIT_MAX_ATTEMPTS = 10;
const authRateLimits = new Map<string, { count: number; resetAt: number }>();

function readString(row: Row | undefined, column: string): string | null {
  if (!row) return null;
  const value = row[column];
  return typeof value === "string" ? value : null;
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

export function hashPassword(password: string): string {
  if (
    password.length < MIN_PASSWORD_LENGTH ||
    password.length > MAX_PASSWORD_LENGTH
  ) {
    throw new RangeError("Password length out of bounds");
  }

  const salt = randomBytes(16).toString("hex");
  const hashHex = scryptSync(password, salt, PASSWORD_KEY_LENGTH).toString("hex");
  return `${salt}:${hashHex}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  if (password.length > MAX_PASSWORD_LENGTH) return false;

  const [salt, hashHex, ...extra] = storedHash.split(":");
  if (!salt || !hashHex || extra.length > 0 || !/^[a-f\d]{128}$/i.test(hashHex)) {
    return false;
  }

  const expectedHash = Buffer.from(hashHex, "hex");
  const actualHash = scryptSync(password, salt, PASSWORD_KEY_LENGTH);
  return (
    expectedHash.length === actualHash.length &&
    timingSafeEqual(expectedHash, actualHash)
  );
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function pruneExpiredAuthRateLimits(now: number): void {
  if (authRateLimits.size <= 500) return;
  for (const [key, entry] of authRateLimits) {
    if (entry.resetAt <= now) authRateLimits.delete(key);
  }
}

export function checkAuthRateLimit(
  key: string,
  now = Date.now()
): { allowed: boolean; retryAfterSeconds: number } {
  pruneExpiredAuthRateLimits(now);

  const entry = authRateLimits.get(key);
  if (!entry || entry.resetAt <= now) {
    authRateLimits.set(key, { count: 1, resetAt: now + AUTH_RATE_LIMIT_WINDOW_MS });
    pruneExpiredAuthRateLimits(now);
    return { allowed: true, retryAfterSeconds: 0 };
  }

  entry.count += 1;
  if (entry.count <= AUTH_RATE_LIMIT_MAX_ATTEMPTS) {
    return { allowed: true, retryAfterSeconds: 0 };
  }

  return {
    allowed: false,
    retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
  };
}

export function resetAuthRateLimitForTests(): void {
  authRateLimits.clear();
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

export async function createSession(userId: string): Promise<string> {
  await ensureSchema();
  const token = randomUUID();
  await getDb().execute({
    sql: "INSERT INTO sessions (token, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)",
    args: [token, userId, Date.now() + SESSION_TTL_MS, new Date().toISOString()],
  });
  return token;
}

export async function deleteSession(token: string): Promise<void> {
  await ensureSchema();
  await getDb().execute({ sql: "DELETE FROM sessions WHERE token = ?", args: [token] });
}

export async function getUserBySessionToken(
  token: string | undefined
): Promise<{ id: string; email: string; name: string } | null> {
  if (!token) return null;
  await ensureSchema();
  const result = await getDb().execute({
    sql: `SELECT users.id, users.email, users.name
      FROM sessions
      JOIN users ON users.id = sessions.user_id
      WHERE sessions.token = ? AND sessions.expires_at > ?
      LIMIT 1`,
    args: [token, Date.now()],
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
  const current = await getUserStateFromDb(userId);
  const incoming = sanitizeUserState(partial);
  const updatedAt = new Date().toISOString();
  const state: UserStatePayload & { updatedAt: string } = {
    completedModules:
      partial.completedModules === undefined
        ? current.completedModules
        : incoming.completedModules,
    riskState:
      partial.riskState === undefined ? current.riskState : incoming.riskState,
    priceAlarms:
      partial.priceAlarms === undefined
        ? current.priceAlarms
        : incoming.priceAlarms,
    updatedAt,
  };

  await getDb().execute({
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
  return state;
}
