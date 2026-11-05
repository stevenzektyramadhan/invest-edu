import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
  SESSION_COOKIE_NAME,
  SESSION_TTL_MS,
  checkAuthRateLimit,
  createSession,
  createUser,
  deleteSession,
  getUserByEmail,
  getUserBySessionToken,
  getUserStateFromDb,
  hashPassword,
  mergeUserStates,
  normalizeEmail,
  sanitizeUserState,
  saveUserStateToDb,
  verifyPassword,
  type UserStatePayload,
} from "@/lib/auth";
import { isTursoCloud } from "@/lib/db";

type AuthAction = "register" | "login" | "logout";

interface AuthRequestBody {
  action: AuthAction;
  email?: string;
  password?: string;
  name?: string;
  initialState?: Partial<UserStatePayload>;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseAuthRequest(input: unknown): AuthRequestBody | null {
  if (!isRecord(input)) return null;
  const action = input["action"];
  if (action !== "register" && action !== "login" && action !== "logout") {
    return null;
  }

  const email = input["email"];
  const password = input["password"];
  const name = input["name"];
  const initialState = input["initialState"];
  return {
    action,
    ...(typeof email === "string" ? { email } : {}),
    ...(typeof password === "string" ? { password } : {}),
    ...(typeof name === "string" ? { name } : {}),
    ...(initialState === undefined
      ? {}
      : { initialState: sanitizeUserState(initialState) }),
  };
}

async function readJsonBody(request: Request): Promise<unknown | null> {
  try {
    return await request.json();
  } catch (error) {
    if (error instanceof SyntaxError) return null;
    throw error;
  }
}

function setSessionCookie(response: NextResponse, token: string): void {
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    maxAge: SESSION_TTL_MS / 1000,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

function invalidRequest(message: string): NextResponse {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function GET() {
  const cookieStore = await cookies();
  const user = await getUserBySessionToken(
    cookieStore.get(SESSION_COOKIE_NAME)?.value
  );
  const state = user ? await getUserStateFromDb(user.id) : null;
  return NextResponse.json({
    user,
    state,
    storageMode: isTursoCloud() ? "turso-cloud" : "turso-local",
  });
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const body = parseAuthRequest(await readJsonBody(request));
  if (!body) return invalidRequest("Permintaan tidak valid.");

  if (body.action === "login" || body.action === "register") {
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "local";
    const rate = checkAuthRateLimit(
      `${clientIp}:${normalizeEmail(body.email ?? "")}`
    );
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Terlalu banyak percobaan. Silakan tunggu sebentar." },
        {
          status: 429,
          headers: { "Retry-After": String(rate.retryAfterSeconds) },
        }
      );
    }

    const email = normalizeEmail(body.email ?? "");
    const password = body.password ?? "";
    const name = body.name?.trim();
    if (email.length > 254) {
      return invalidRequest("Masukkan alamat email yang valid.");
    }
    if (
      password.length < MIN_PASSWORD_LENGTH ||
      password.length > MAX_PASSWORD_LENGTH
    ) {
      return invalidRequest(
        `Password harus memiliki ${MIN_PASSWORD_LENGTH} sampai ${MAX_PASSWORD_LENGTH} karakter.`
      );
    }
    if (name !== undefined && name.length > 100) {
      return invalidRequest("Nama maksimal 100 karakter.");
    }
  }

  switch (body.action) {
    case "logout": {
      const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
      if (token) await deleteSession(token);
      const response = NextResponse.json({
        ok: true,
        user: null,
        storageMode: isTursoCloud() ? "turso-cloud" : "turso-local",
      });
      response.cookies.set(SESSION_COOKIE_NAME, "", {
        httpOnly: true,
        maxAge: 0,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
      return response;
    }
    case "register": {
      const email = normalizeEmail(body.email ?? "");
      const password = body.password ?? "";
      if (!EMAIL_PATTERN.test(email)) {
        return invalidRequest("Masukkan alamat email yang valid.");
      }
      if (await getUserByEmail(email)) {
        return NextResponse.json(
          { error: "Email sudah terdaftar. Silakan masuk." },
          { status: 409 }
        );
      }

      const user = await createUser({
        email,
        name: body.name?.trim() || email,
        passwordHash: hashPassword(password),
      });
      const state = await saveUserStateToDb(
        user.id,
        sanitizeUserState(body.initialState)
      );
      const response = NextResponse.json({
        ok: true,
        user,
        state,
        storageMode: isTursoCloud() ? "turso-cloud" : "turso-local",
      });
      setSessionCookie(response, await createSession(user.id));
      return response;
    }
    case "login": {
      const email = normalizeEmail(body.email ?? "");
      const password = body.password ?? "";
      const user = await getUserByEmail(email);
      if (!user || !verifyPassword(password, user.passwordHash)) {
        return NextResponse.json(
          { error: "Email atau password salah." },
          { status: 401 }
        );
      }

      const cloudState = await getUserStateFromDb(user.id);
      const state = await saveUserStateToDb(
        user.id,
        mergeUserStates(cloudState, body.initialState)
      );
      const response = NextResponse.json({
        ok: true,
        user: { id: user.id, email: user.email, name: user.name },
        state,
        storageMode: isTursoCloud() ? "turso-cloud" : "turso-local",
      });
      setSessionCookie(response, await createSession(user.id));
      return response;
    }
  }
}
