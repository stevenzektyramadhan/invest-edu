import { createClient } from "@libsql/client";
import type { Client } from "@libsql/client";

const databaseUrl =
  process.env.TURSO_DATABASE_URL?.trim() || "file:investedu.db";
const authToken = process.env.TURSO_AUTH_TOKEN?.trim() || undefined;

const SCHEMA_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    expires_at INTEGER NOT NULL,
    created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS user_state (
    user_id TEXT PRIMARY KEY,
    completed_modules TEXT NOT NULL DEFAULT '[]',
    risk_state TEXT NOT NULL DEFAULT '{}',
    price_alarms TEXT NOT NULL DEFAULT '[]',
    updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS rate_limits (
    key TEXT PRIMARY KEY,
    count INTEGER NOT NULL,
    reset_at INTEGER NOT NULL
  )`,
] as const;

let db: Client | undefined;
let schemaPromise: Promise<void> | undefined;

export function getDb(): Client {
  db ??= createClient({ url: databaseUrl, authToken });
  return db;
}

export function isTursoCloud(): boolean {
  return Boolean(
    process.env.TURSO_DATABASE_URL?.trim() &&
      !process.env.TURSO_DATABASE_URL.trim().startsWith("file:")
  );
}

export function ensureSchema(): Promise<void> {
  // ponytail: additive DDL is enough for the initial schema; add versioned migrations when a change needs data transforms.
  schemaPromise ??= getDb()
    .batch([...SCHEMA_STATEMENTS], "write")
    .then(() => undefined)
    .catch((error) => {
      schemaPromise = undefined;
      throw error;
    });
  return schemaPromise;
}
