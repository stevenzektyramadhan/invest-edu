import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  SESSION_COOKIE_NAME,
  getUserBySessionToken,
  getUserStateFromDb,
  sanitizeUserState,
  saveUserStateToDb,
  type UserStatePayload,
} from "@/lib/auth";
import { isTursoCloud } from "@/lib/db";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseUserStatePatch(input: unknown): Partial<UserStatePayload> | null {
  if (!isRecord(input)) return null;
  const sanitized = sanitizeUserState(input);
  const patch: Partial<UserStatePayload> = {};
  if (Object.hasOwn(input, "completedModules")) {
    patch.completedModules = sanitized.completedModules;
  }
  if (Object.hasOwn(input, "riskState")) patch.riskState = sanitized.riskState;
  if (Object.hasOwn(input, "priceAlarms")) {
    patch.priceAlarms = sanitized.priceAlarms;
  }
  return patch;
}

async function readJsonBody(request: Request): Promise<unknown | null> {
  try {
    return await request.json();
  } catch (error) {
    if (error instanceof SyntaxError) return null;
    throw error;
  }
}

function unauthorized(): NextResponse {
  return NextResponse.json(
    { error: "Silakan masuk terlebih dahulu." },
    { status: 401 }
  );
}

export async function GET() {
  const cookieStore = await cookies();
  const user = await getUserBySessionToken(
    cookieStore.get(SESSION_COOKIE_NAME)?.value
  );
  if (!user) return unauthorized();

  return NextResponse.json({
    ok: true,
    user,
    state: await getUserStateFromDb(user.id),
    storageMode: isTursoCloud() ? "turso-cloud" : "turso-local",
  });
}

export async function PUT(request: Request) {
  const cookieStore = await cookies();
  const user = await getUserBySessionToken(
    cookieStore.get(SESSION_COOKIE_NAME)?.value
  );
  if (!user) return unauthorized();

  const body = parseUserStatePatch(await readJsonBody(request));
  if (!body) {
    return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    state: await saveUserStateToDb(user.id, body),
    storageMode: isTursoCloud() ? "turso-cloud" : "turso-local",
  });
}
