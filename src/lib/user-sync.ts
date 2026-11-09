"use client";

export const MODULES_STORAGE_KEY = "investedu_completed_modules";
export const RISK_STORAGE_KEY = "investedu_risk_state";
export const ALARMS_STORAGE_KEY = "investedu_price_alarms_v1";
export const SYNC_EVENT_NAME = "investedu:state-synced";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface RiskStateData {
  answers?: Record<string, number>;
  macroRegime?: "ekspansi" | "netral" | "bunga_tinggi" | "krisis_inflasi";
  capital?: number;
}

export interface UserStateData {
  completedModules: string[];
  riskState: RiskStateData | null;
  priceAlarms: unknown[];
  updatedAt?: string;
}

export function readLocalUserState(): Partial<UserStateData> {
  if (typeof window === "undefined") return {};

  const state: Partial<UserStateData> = {};
  try {
    const modules = localStorage.getItem(MODULES_STORAGE_KEY);
    if (modules) {
      const parsed: unknown = JSON.parse(modules);
      if (Array.isArray(parsed) && parsed.every((id) => typeof id === "string")) {
        state.completedModules = parsed;
      }
    }

    const risk = localStorage.getItem(RISK_STORAGE_KEY);
    if (risk) {
      const parsed: unknown = JSON.parse(risk);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        state.riskState = parsed as RiskStateData;
      }
    }

    const alarms = localStorage.getItem(ALARMS_STORAGE_KEY);
    if (alarms) {
      const parsed: unknown = JSON.parse(alarms);
      if (Array.isArray(parsed)) state.priceAlarms = parsed;
    }
  } catch {
    return state;
  }

  return state;
}

export function applyCloudStateToLocal(state: UserStateData | null | undefined): void {
  if (typeof window === "undefined" || !state) return;

  try {
    localStorage.setItem(MODULES_STORAGE_KEY, JSON.stringify(state.completedModules));
    localStorage.setItem(RISK_STORAGE_KEY, JSON.stringify(state.riskState));
    localStorage.setItem(ALARMS_STORAGE_KEY, JSON.stringify(state.priceAlarms));
  } catch (error) {
    console.warn("Failed to cache cloud state locally:", error);
  }

  window.dispatchEvent(new CustomEvent(SYNC_EVENT_NAME, { detail: state }));
}

export async function pushUserStateToCloud(
  partial: Partial<UserStateData>
): Promise<void> {
  try {
    const response = await fetch("/api/user-state", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(partial),
    });

    // 401 = guest mode; localStorage already holds the state.
    if (!response.ok && response.status !== 401) {
      console.warn(`Cloud sync failed: HTTP ${response.status}`);
    }
  } catch (error) {
    console.warn("Cloud sync failed:", error);
  }
}
