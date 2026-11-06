import {
  type AssetCategory,
  type DifficultyLevel,
  type EducationModule,
  type EducationSource,
  type QuizQuestion,
} from "./education/types";
import { DASAR_MODULES } from "./education/dasar";
import { REKSA_DANA_MODULES } from "./education/reksa-dana";
import { EMAS_MODULES } from "./education/emas";
import { SAHAM_MODULES } from "./education/saham";
import { KRIPTO_MODULES } from "./education/kripto";

export type {
  AssetCategory,
  DifficultyLevel,
  EducationModule,
  EducationSource,
  QuizQuestion,
};

export const ASSET_OVERVIEW: Record<
  AssetCategory,
  {
    tagline: string;
    expectedReturn: string;
    riskProfile: string;
    horizon: string;
    liquidity: string;
    color: string;
  }
> = {
  Dasar: {
    tagline: "Fondasi keuangan pribadi: tujuan keuangan, dana darurat, inflasi, dan cara terhindar dari jebakan investasi bodong.",
    expectedReturn: "Fondasi Wajib",
    riskProfile: "Rendah",
    horizon: "Sebelum Investasi",
    liquidity: "Sangat Tinggi",
    color: "slate",
  },
  "Reksa Dana": {
    tagline: "Dikelola profesional oleh Manajer Investasi, cocok untuk diversifikasi otomatis.",
    expectedReturn: "4% - 12% / tahun",
    riskProfile: "Rendah - Sedang",
    horizon: "< 1 - 5 Tahun",
    liquidity: "Tinggi (T+1 s/d T+3)",
    color: "emerald",
  },
  Emas: {
    tagline: "Aset safe-haven pelindung nilai kekayaan terhadap inflasi dan krisis geopolitik.",
    expectedReturn: "6% - 10% / tahun",
    riskProfile: "Rendah - Sedang",
    horizon: "> 3 - 5 Tahun",
    liquidity: "Tinggi",
    color: "amber",
  },
  Saham: {
    tagline: "Kepemilikan bisnis nyata dengan potensi capital gain dan dividen jangka panjang.",
    expectedReturn: "10% - 18% / tahun",
    riskProfile: "Tinggi",
    horizon: "> 3 - 10 Tahun",
    liquidity: "Tinggi (Jam Bursa)",
    color: "sky",
  },
  Kripto: {
    tagline: "Aset digital terdesentralisasi berisiko tinggi dengan siklus volatilitas agresif.",
    expectedReturn: "Fluktuatif Tinggi",
    riskProfile: "Sangat Tinggi",
    horizon: "> 4 Tahun (Siklus)",
    liquidity: "Sangat Tinggi (24/7)",
    color: "purple",
  },
};

export const EDUCATION_MODULES: EducationModule[] = [
  ...DASAR_MODULES,
  ...REKSA_DANA_MODULES,
  ...EMAS_MODULES,
  ...SAHAM_MODULES,
  ...KRIPTO_MODULES,
];

const CATEGORY_LEARNING_ORDER: Record<AssetCategory, number> = {
  Dasar: 0,
  "Reksa Dana": 1,
  Emas: 2,
  Saham: 3,
  Kripto: 4,
};

const LEVEL_LEARNING_ORDER: Record<DifficultyLevel, number> = {
  Pemula: 0,
  Menengah: 1,
  Lanjutan: 2,
};

export function getSequentialLearningModules(): EducationModule[] {
  return [...EDUCATION_MODULES].sort((a, b) => {
    const aIsFoundation = a.category === "Dasar" ? 0 : 1;
    const bIsFoundation = b.category === "Dasar" ? 0 : 1;
    if (aIsFoundation !== bIsFoundation) {
      return aIsFoundation - bIsFoundation;
    }

    const levelDiff = LEVEL_LEARNING_ORDER[a.level] - LEVEL_LEARNING_ORDER[b.level];
    if (levelDiff !== 0) {
      return levelDiff;
    }

    const categoryDiff =
      CATEGORY_LEARNING_ORDER[a.category] - CATEGORY_LEARNING_ORDER[b.category];
    if (categoryDiff !== 0) {
      return categoryDiff;
    }

    return a.moduleNumber - b.moduleNumber;
  });
}

export function getNextRecommendedModule(completedIds: readonly string[]): EducationModule | null {
  const completedSet = new Set(completedIds);
  const ordered = getSequentialLearningModules();
  return ordered.find((mod) => !completedSet.has(mod.id)) ?? null;
}

export function hasCompletedCategoryPrerequisites(
  module: EducationModule,
  completedIds: readonly string[]
): boolean {
  if (module.level !== "Lanjutan") {
    return true;
  }
  const completedSet = new Set(completedIds);
  const prerequisites = EDUCATION_MODULES.filter(
    (candidate) =>
      candidate.category === module.category &&
      (candidate.level === "Pemula" || candidate.level === "Menengah")
  );
  return prerequisites.every((prereq) => completedSet.has(prereq.id));
}

export const EMERGENCY_FUND_MODULE_ID = "dasar-tujuan-dana-darurat";

export const RECOMMENDATION_ASSET_MODULE_MAP: Record<
  "reksaDanaPasarUangObligasi" | "emas" | "saham" | "kripto",
  string[]
> = {
  reksaDanaPasarUangObligasi: ["reksadana-dasar", "reksadana-sbn-ritel"],
  emas: ["emas-safe-haven"],
  saham: ["saham-fundamental"],
  kripto: ["kripto-fundamental", "kripto-keamanan-wallet"],
};

export function getEducationModulesByIds(ids: readonly string[]): EducationModule[] {
  const byId = new Map(EDUCATION_MODULES.map((mod) => [mod.id, mod]));
  return ids
    .map((id) => byId.get(id))
    .filter((mod): mod is EducationModule => Boolean(mod));
}
