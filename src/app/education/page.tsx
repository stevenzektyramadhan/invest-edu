"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ASSET_OVERVIEW,
  EDUCATION_MODULES,
  getNextRecommendedModule,
  getSequentialLearningModules,
  hasCompletedCategoryPrerequisites,
  type AssetCategory,
  type DifficultyLevel,
  type EducationModule,
} from "@/data/education";
import {
  AlertTriangle,
  Calculator,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Clock,
  Filter,
  HelpCircle,
  ListChecks,
  Search,
  ShieldAlert,
  Sparkles,
  X,
  BookOpen,
} from "lucide-react";
import {
  MODULES_STORAGE_KEY,
  SYNC_EVENT_NAME,
  pushUserStateToCloud,
} from "@/lib/user-sync";

const STORAGE_KEY = MODULES_STORAGE_KEY;
const ASSET_CATEGORIES: AssetCategory[] = ["Dasar", "Reksa Dana", "Emas", "Saham", "Kripto"];
const DIFFICULTY_LEVELS: DifficultyLevel[] = ["Pemula", "Menengah", "Lanjutan"];
const CATEGORY_FILTERS: ("Semua" | AssetCategory)[] = ["Semua", ...ASSET_CATEGORIES];
const LEVEL_FILTERS: ("Semua" | DifficultyLevel)[] = ["Semua", ...DIFFICULTY_LEVELS];

export default function EducationPage() {
  const [selectedCategory, setSelectedCategory] = useState<"Semua" | AssetCategory>("Semua");
  const [selectedLevel, setSelectedLevel] = useState<"Semua" | DifficultyLevel>("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModule, setActiveModule] = useState<EducationModule | null>(null);
  const [quizAnswers, setQuizAnswers] = useState(new Map<number, number>());
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [isProgressReady, setIsProgressReady] = useState(false);

  useEffect(() => {
    const hydrationTimer = window.setTimeout(() => {
      const savedProgress = localStorage.getItem(STORAGE_KEY);

      if (savedProgress) {
        try {
          const parsedProgress: unknown = JSON.parse(savedProgress);

          if (Array.isArray(parsedProgress) && parsedProgress.every((id) => typeof id === "string")) {
            setCompletedIds(parsedProgress);
          } else {
            localStorage.removeItem(STORAGE_KEY);
          }
        } catch {
          localStorage.removeItem(STORAGE_KEY);
        }
      }

      const params = new URLSearchParams(window.location.search);
      const moduleParam = params.get("module");
      if (moduleParam) {
        const matched = EDUCATION_MODULES.find((mod) => mod.id === moduleParam);
        if (matched) {
          setQuizAnswers(new Map());
          setActiveModule(matched);
        }
      }

      setIsProgressReady(true);
    }, 0);

    return () => window.clearTimeout(hydrationTimer);
  }, []);

  useEffect(() => {
    const reloadProgress = () => {
      const savedProgress = localStorage.getItem(STORAGE_KEY);
      if (!savedProgress) {
        setCompletedIds([]);
        return;
      }
      try {
        const parsed: unknown = JSON.parse(savedProgress);
        if (Array.isArray(parsed) && parsed.every((id) => typeof id === "string")) {
          setCompletedIds(parsed);
        }
      } catch {
        setCompletedIds([]);
      }
    };
    window.addEventListener(SYNC_EVENT_NAME, reloadProgress);
    return () => window.removeEventListener(SYNC_EVENT_NAME, reloadProgress);
  }, []);

  useEffect(() => {
    if (!isProgressReady) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completedIds));
  }, [completedIds, isProgressReady]);

  useEffect(() => {
    if (!activeModule) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveModule(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [activeModule]);

  const categoryBreakdown = useMemo(
    () =>
      ASSET_CATEGORIES.map((category) => ({
        category,
        count: EDUCATION_MODULES.filter((module) => module.category === category).length,
      })),
    []
  );

  const levelBreakdown = useMemo(
    () =>
      DIFFICULTY_LEVELS.map((level) => ({
        level,
        count: EDUCATION_MODULES.filter((module) => module.level === level).length,
      })),
    []
  );

  const sequentialModules = useMemo(() => getSequentialLearningModules(), []);
  const nextRecommendedModule = useMemo(
    () => getNextRecommendedModule(completedIds),
    [completedIds]
  );
  const nextRecommendedStepIndex = useMemo(
    () =>
      nextRecommendedModule
        ? sequentialModules.findIndex((mod) => mod.id === nextRecommendedModule.id)
        : -1,
    [nextRecommendedModule, sequentialModules]
  );

  const filteredModules = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return EDUCATION_MODULES.filter((module) => {
      const matchesCategory = selectedCategory === "Semua" || module.category === selectedCategory;
      const matchesLevel = selectedLevel === "Semua" || module.level === selectedLevel;
      const matchesSearch = [module.title, module.subTopic, module.summary, module.category]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);

      return matchesCategory && matchesLevel && matchesSearch;
    });
  }, [searchQuery, selectedCategory, selectedLevel]);

  const activeModuleIndex = activeModule
    ? sequentialModules.findIndex((module) => module.id === activeModule.id)
    : -1;
  const previousModule = activeModuleIndex > 0 ? sequentialModules.at(activeModuleIndex - 1) : undefined;
  const nextModule = activeModuleIndex >= 0 ? sequentialModules.at(activeModuleIndex + 1) : undefined;
  const correctAnswers = activeModule
    ? activeModule.quizzes.reduce(
        (score, question, questionIndex) =>
          quizAnswers.get(questionIndex) === question.correctIndex ? score + 1 : score,
        0
      )
    : 0;
  const hasAnsweredAll = activeModule ? quizAnswers.size === activeModule.quizzes.length : false;

  const openModule = (module: EducationModule) => {
    setQuizAnswers(new Map());
    setActiveModule(module);
  };

  const navigateToModule = (module: EducationModule) => {
    setQuizAnswers(new Map());
    setActiveModule(module);
  };

  const markComplete = (moduleId: string) => {
    setCompletedIds((currentIds) => {
      const nextIds = currentIds.includes(moduleId) ? currentIds : [...currentIds, moduleId];
      if (nextIds !== currentIds) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextIds));
        void pushUserStateToCloud({ completedModules: nextIds });
      }
      return nextIds;
    });
  };

  const answerQuiz = (questionIndex: number, optionIndex: number) => {
    if (!activeModule || quizAnswers.has(questionIndex)) return;

    const nextAnswers = new Map(quizAnswers);
    nextAnswers.set(questionIndex, optionIndex);
    setQuizAnswers(nextAnswers);

    if (nextAnswers.size === activeModule.quizzes.length) {
      markComplete(activeModule.id);
    }
  };

  const finishModule = () => {
    if (!activeModule) return;

    markComplete(activeModule.id);

    if (nextModule) {
      navigateToModule(nextModule);
      return;
    }

    setActiveModule(null);
  };

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-panel p-6 sm:p-8">
        <div className="absolute inset-0 bg-grid-workstation opacity-20 pointer-events-none" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/80 px-3 py-1 text-xs font-medium text-neutral-300">
              <BookOpen className="h-3.5 w-3.5 text-neutral-400" />
              <span>Kurikulum Multi-Aset Terstruktur</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Pusat Edukasi Instrumen Investasi
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-neutral-400">
              Belajar dari fondasi hingga strategi lanjutan dengan studi kasus Rupiah,
              red flags, checklist eksekusi, dan kuis pemahaman pada setiap modul.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-900/60 px-4 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-neutral-400">Progres Belajar</div>
              <div className="text-base font-bold text-white">
                {completedIds.length} / {EDUCATION_MODULES.length} Modul Selesai
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-3 border-t border-neutral-800/80 pt-5 lg:grid-cols-[0.7fr_1.5fr_1.2fr]">
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
            <div className="text-xs font-medium text-neutral-400">Total Kurikulum</div>
            <div className="mt-1 text-3xl font-bold text-white">{EDUCATION_MODULES.length}</div>
            <p className="mt-1 text-xs text-neutral-500">modul mendalam dan berurutan</p>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
            <div className="text-xs font-medium text-neutral-400">Menurut Kelas Aset</div>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
              {categoryBreakdown.map(({ category, count }) => (
                <div key={category} className="rounded-lg bg-neutral-950/80 border border-neutral-800/60 px-2.5 py-2">
                  <div className="text-[11px] text-neutral-400">{category}</div>
                  <div className="mt-0.5 text-sm font-bold text-neutral-100">{count} modul</div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
            <div className="text-xs font-medium text-neutral-400">Menurut Tingkat</div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {levelBreakdown.map(({ level, count }) => (
                <div key={level} className="rounded-lg bg-neutral-950/80 border border-neutral-800/60 px-2.5 py-2">
                  <div className="text-[11px] text-neutral-400">{level}</div>
                  <div className="mt-0.5 text-sm font-bold text-neutral-200">{count} modul</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        aria-label="Mulai dari sini"
        className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 sm:p-6"
      >
        {nextRecommendedModule ? (
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-3 py-0.5 font-semibold text-emerald-300">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{completedIds.length === 0 ? "Mulai dari sini" : "Mulai dari sini · Lanjutkan belajar"}</span>
                </span>
                <span className="rounded-md border border-neutral-800 bg-neutral-900 px-2.5 py-0.5 font-medium text-neutral-300">
                  Langkah {nextRecommendedStepIndex + 1} dari {sequentialModules.length}
                </span>
                <span className="rounded-md border border-neutral-800 bg-neutral-900 px-2.5 py-0.5 font-medium text-neutral-400">
                  Modul #{nextRecommendedModule.moduleNumber} · {nextRecommendedModule.category} ({nextRecommendedModule.level})
                </span>
              </div>
              <h2 className="text-lg font-bold text-white sm:text-xl">
                {nextRecommendedModule.title}
              </h2>
              <p className="max-w-3xl text-xs leading-relaxed text-neutral-300 sm:text-sm">
                {nextRecommendedModule.summary}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-neutral-400">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-emerald-400" />
                  {nextRecommendedModule.readTime}
                </span>
                <span>•</span>
                <span>
                  Jalur belajar berurutan: 3 modul fondasi → Reksa Dana Pemula → Emas Pemula → Saham Pemula → Kripto Pemula → Menengah &amp; Lanjutan
                </span>
              </div>
            </div>

            <div className="shrink-0">
              <button
                type="button"
                onClick={() => openModule(nextRecommendedModule)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-xs font-bold text-neutral-950 shadow-sm transition-colors hover:bg-emerald-400 sm:w-auto"
              >
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                <span>
                  {completedIds.length === 0
                    ? `Mulai Modul #${nextRecommendedModule.moduleNumber}`
                    : `Lanjutkan Modul #${nextRecommendedModule.moduleNumber}`}
                </span>
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-3 py-0.5 text-xs font-semibold text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Seluruh Jalur Belajar Selesai</span>
              </div>
              <h2 className="mt-2 text-lg font-bold text-white">
                Anda telah menyelesaikan seluruh {EDUCATION_MODULES.length} modul kurikulum!
              </h2>
              <p className="mt-1 text-xs text-neutral-300">
                Anda tetap dapat membuka kembali modul mana saja untuk meninjau studi kasus dan kuis kapan pun diperlukan.
              </p>
            </div>
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-neutral-300">
          Fondasi Keuangan &amp; Karakteristik Instrumen Utama
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {ASSET_CATEGORIES.map((asset) => {
            const info = ASSET_OVERVIEW[asset];
            const isSelected = selectedCategory === asset;

            return (
              <button
                key={asset}
                type="button"
                onClick={() => setSelectedCategory(isSelected ? "Semua" : asset)}
                className={`rounded-xl border p-4 text-left transition-colors ${
                  isSelected
                    ? "border-neutral-400 bg-neutral-800/50 shadow-md shadow-black/40"
                    : "border-neutral-800 bg-panel hover:border-neutral-700 hover:bg-neutral-900/80"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-base font-bold text-white">{asset}</span>
                  <span className="rounded-md border border-neutral-800 bg-neutral-900 px-2 py-0.5 text-[11px] font-medium text-neutral-300">
                    Risiko: {info.riskProfile}
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-xs text-neutral-400">{info.tagline}</p>
                <div className="mt-4 grid grid-cols-2 gap-2 border-t border-neutral-800/80 pt-3 text-[11px]">
                  <div>
                    <span className="block text-neutral-500">Target Return</span>
                    <span className="font-semibold text-emerald-400">{info.expectedReturn}</span>
                  </div>
                  <div>
                    <span className="block text-neutral-500">Horizon</span>
                    <span className="font-semibold text-neutral-200">{info.horizon}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-xl border border-neutral-800 bg-panel p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          {CATEGORY_FILTERS.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                selectedCategory === category
                  ? "bg-neutral-100 text-neutral-950 font-bold"
                  : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap items-center gap-1 rounded-lg border border-neutral-800 bg-neutral-950 px-2.5 py-1">
            <Filter className="h-3.5 w-3.5 text-neutral-500" />
            {LEVEL_FILTERS.map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setSelectedLevel(level)}
                className={`rounded px-2 py-0.5 text-xs font-medium transition-colors ${
                  selectedLevel === level
                    ? "bg-neutral-800 text-white font-semibold"
                    : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          <label className="relative flex-1 sm:w-56 sm:flex-initial">
            <span className="sr-only">Cari modul</span>
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-neutral-500" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Cari modul atau topik..."
              className="w-full rounded-lg border border-neutral-800 bg-neutral-950 py-1.5 pl-8 pr-3 text-xs text-white placeholder-neutral-500 focus:border-neutral-500 focus:outline-none"
            />
          </label>
        </div>
      </section>

      <section aria-label="Daftar modul pembelajaran" className="grid gap-4 md:grid-cols-2">
        {filteredModules.map((module) => {
          const isCompleted = completedIds.includes(module.id);
          const isRecommendedNext = nextRecommendedModule?.id === module.id;
          const needsPrerequisiteNotice =
            module.level === "Lanjutan" &&
            !hasCompletedCategoryPrerequisites(module, completedIds);

          return (
            <button
              key={module.id}
              type="button"
              onClick={() => openModule(module)}
              className={`group rounded-2xl border p-5 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 ${
                isRecommendedNext
                  ? "border-emerald-500/40 bg-panel hover:border-emerald-400/60 hover:bg-panel-elevated"
                  : "border-neutral-800 bg-panel hover:border-neutral-600 hover:bg-panel-elevated"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md border border-neutral-700 bg-neutral-800/80 px-2.5 py-0.5 text-xs font-semibold text-neutral-200">
                    Modul #{module.moduleNumber}
                  </span>
                  <span className="rounded-md border border-neutral-800 bg-neutral-900 px-2.5 py-0.5 text-xs font-medium text-neutral-400">
                    {module.category}
                  </span>
                  <span className="rounded-md border border-neutral-800 bg-neutral-900 px-2.5 py-0.5 text-xs font-medium text-neutral-400">
                    {module.level}
                  </span>
                  {isRecommendedNext && (
                    <span className="rounded-md border border-emerald-500/40 bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">
                      {completedIds.length === 0 ? "Mulai dari sini" : "Berikutnya"}
                    </span>
                  )}
                </div>
                {isCompleted && (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" /> Selesai
                  </span>
                )}
              </div>

              <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-neutral-300">
                <Sparkles className="h-3.5 w-3.5 text-neutral-400" />
                <span>{module.subTopic}</span>
              </div>
              <h3 className="mt-1.5 text-lg font-bold leading-snug text-white transition-colors group-hover:text-neutral-200">
                {module.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-neutral-400">{module.summary}</p>

              {needsPrerequisiteNotice && (
                <div className="mt-3 rounded-lg border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-[11px] leading-relaxed text-amber-200">
                  Disarankan menyelesaikan modul Pemula &amp; Menengah di kategori ini terlebih dahulu
                </div>
              )}

              <div className="mt-4 grid gap-2 border-t border-neutral-800/80 pt-3 text-xs sm:grid-cols-2">
                <span className="inline-flex items-center gap-1.5 text-neutral-400">
                  <Clock className="h-3.5 w-3.5 text-neutral-500" />
                  {module.readTime}
                </span>
                <span className="inline-flex items-center gap-1.5 text-neutral-400">
                  <ShieldAlert className="h-3.5 w-3.5 text-neutral-500" />
                  Risiko: <strong className="text-neutral-200">{module.riskRating}</strong>
                </span>
                <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
                  <Calculator className="h-3.5 w-3.5" />
                  Studi Kasus Rupiah
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium text-neutral-400">
                  {module.sections.length} bagian materi · {module.quizzes.length} soal kuis
                </span>
              </div>

              <span className="mt-4 inline-flex items-center gap-1 font-semibold text-white transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none">
                Pelajari Modul <ChevronRight className="h-4 w-4 text-neutral-400" />
              </span>
            </button>
          );
        })}
      </section>

      {filteredModules.length === 0 && (
        <section className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 px-6 py-12 text-center">
          <Search className="mx-auto h-6 w-6 text-slate-500" />
          <h2 className="mt-3 text-base font-bold text-white">Belum ada modul yang cocok</h2>
          <p className="mt-1 text-sm text-slate-400">Ubah kata kunci atau longgarkan filter kelas aset dan tingkat kesulitan.</p>
        </section>
      )}

      {activeModule && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setActiveModule(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="education-dialog-title"
            className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-neutral-800 bg-background shadow-2xl"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="sticky top-0 z-10 border-b border-neutral-800 bg-background/95 px-5 py-4 backdrop-blur sm:px-7">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-md border border-neutral-700 bg-neutral-800 px-2.5 py-0.5 font-semibold text-neutral-200">
                      {activeModule.category}
                    </span>
                    <span className="rounded-md border border-neutral-800 bg-neutral-900 px-2.5 py-0.5 text-neutral-400">
                      Level {activeModule.level}
                    </span>
                    <span className="text-neutral-500">{activeModule.readTime}</span>
                  </div>
                  <div className="mt-2 text-xs font-semibold text-neutral-400">{activeModule.subTopic}</div>
                  <h2 id="education-dialog-title" className="mt-1 text-lg font-bold leading-snug text-white sm:text-xl">
                    Modul #{activeModule.moduleNumber}: {activeModule.title}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModule(null)}
                  className="shrink-0 rounded-lg bg-neutral-900 border border-neutral-800 p-2 text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
                  aria-label="Tutup modul"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 border-t border-neutral-800 pt-3">
                <span className="text-xs font-medium text-neutral-400">
                  Modul {activeModuleIndex + 1} dari {EDUCATION_MODULES.length}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={!previousModule}
                    onClick={() => previousModule && navigateToModule(previousModule)}
                    className="inline-flex items-center gap-1 rounded-lg border border-neutral-800 bg-neutral-900 px-2.5 py-1.5 text-xs font-semibold text-neutral-300 transition-colors hover:border-neutral-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" /> Sebelumnya
                  </button>
                  <button
                    type="button"
                    disabled={!nextModule}
                    onClick={() => nextModule && navigateToModule(nextModule)}
                    className="inline-flex items-center gap-1 rounded-lg border border-neutral-700 bg-neutral-800 px-2.5 py-1.5 text-xs font-semibold text-neutral-100 transition-colors hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Selanjutnya <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-8 px-5 py-6 sm:px-7">
              <section className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-neutral-300">
                  <Sparkles className="h-4 w-4 text-neutral-400" />
                  Intisari Penting (Key Takeaways)
                </div>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-neutral-300">
                  {activeModule.keyTakeaways.map((takeaway) => (
                    <li key={takeaway} className="flex items-start gap-2">
                      <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section aria-labelledby="materi-lengkap">
                <div className="flex items-center gap-2 text-xs font-semibold text-neutral-200">
                  <BookOpen className="h-4 w-4 text-neutral-400" />
                  <h3 id="materi-lengkap">Materi Lengkap</h3>
                </div>
                <div className="mt-4 space-y-4">
                  {activeModule.sections.map((section, sectionIndex) => (
                    <article key={section.heading} className="rounded-xl border border-neutral-800 bg-panel p-4 sm:p-5">
                      <div className="flex items-start gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-800 border border-neutral-700 text-xs font-bold text-neutral-200">
                          {sectionIndex + 1}
                        </span>
                        <div>
                          <h4 className="text-base font-bold text-white">{section.heading}</h4>
                          <p className="mt-2 whitespace-pre-line text-sm leading-7 text-neutral-300">{section.body}</p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 sm:p-5" aria-labelledby="studi-kasus">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                  <Calculator className="h-4 w-4" />
                  <h3 id="studi-kasus">Studi Kasus & Simulasi Hitungan Nyata</h3>
                </div>
                <h4 className="mt-3 text-lg font-bold text-white">{activeModule.caseStudy.title}</h4>
                <p className="mt-2 text-sm leading-7 text-neutral-300">{activeModule.caseStudy.scenario}</p>
                <ol className="mt-4 space-y-2 rounded-lg border border-emerald-500/20 bg-neutral-950/80 p-3 font-mono text-xs leading-6 text-emerald-300 sm:p-4">
                  {activeModule.caseStudy.calculation.map((step, calculationIndex) => (
                    <li key={step} className="flex gap-2">
                      <span className="select-none text-emerald-500">{calculationIndex + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
                <p className="mt-4 border-l-2 border-emerald-400 pl-3 text-sm leading-7 text-emerald-100">
                  <strong className="text-emerald-400">Kesimpulan: </strong>
                  {activeModule.caseStudy.conclusion}
                </p>
              </section>

              <section className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 sm:p-5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-rose-400">
                    <AlertTriangle className="h-4 w-4" />
                    Kesalahan Umum yang Wajib Dihindari
                  </div>
                  <ul className="mt-3 space-y-3 text-sm leading-relaxed text-neutral-300">
                    {activeModule.redFlags.map((redFlag) => (
                      <li key={redFlag} className="flex items-start gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />
                        <span>{redFlag}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 sm:p-5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                    <ListChecks className="h-4 w-4" />
                    Checklist Langkah Praktis
                  </div>
                  <ul className="mt-3 space-y-3 text-sm leading-relaxed text-neutral-300">
                    {activeModule.actionChecklist.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              <section className="rounded-xl border border-neutral-800 bg-panel p-4 sm:p-5" aria-labelledby="uji-pemahaman">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-neutral-200">
                    <HelpCircle className="h-4 w-4 text-neutral-400" />
                    <h3 id="uji-pemahaman">Uji Pemahaman</h3>
                  </div>
                  <div aria-live="polite" className="rounded-full border border-neutral-800 bg-neutral-950 px-3 py-1 text-xs font-semibold text-neutral-300">
                    {correctAnswers} / {activeModule.quizzes.length} Benar
                  </div>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-slate-400">
                  Jawab setiap soal untuk melihat penjelasan langsung. Modul otomatis selesai setelah semua soal terjawab.
                </p>

                <div className="mt-5 space-y-6">
                  {activeModule.quizzes.map((question, questionIndex) => {
                    const selectedOption = quizAnswers.get(questionIndex);
                    const hasAnswered = selectedOption !== undefined;
                    const isCorrect = selectedOption === question.correctIndex;

                    return (
                      <article key={question.question} className="border-t border-slate-800 pt-5 first:border-t-0 first:pt-0">
                        <div className="flex gap-3">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-xs font-bold text-amber-400">
                            {questionIndex + 1}
                          </span>
                          <p className="pt-0.5 text-sm font-semibold leading-relaxed text-white">{question.question}</p>
                        </div>
                        <div className="mt-3 space-y-2">
                          {question.options.map((option, optionIndex) => {
                            const isCorrectOption = optionIndex === question.correctIndex;
                            const isSelectedOption = optionIndex === selectedOption;
                            let optionClass = "border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700";

                            if (hasAnswered && isCorrectOption) {
                              optionClass = "border-emerald-500/50 bg-emerald-500/15 text-emerald-200";
                            } else if (hasAnswered && isSelectedOption) {
                              optionClass = "border-rose-500/50 bg-rose-500/15 text-rose-200";
                            }

                            return (
                              <button
                                key={option}
                                type="button"
                                disabled={hasAnswered}
                                onClick={() => answerQuiz(questionIndex, optionIndex)}
                                className={`w-full rounded-lg border px-3.5 py-2.5 text-left text-xs font-medium transition-colors disabled:cursor-default ${optionClass}`}
                              >
                                <span className="mr-2 font-bold text-slate-500">{String.fromCharCode(65 + optionIndex)}.</span>
                                {option}
                              </button>
                            );
                          })}
                        </div>

                        {hasAnswered && (
                          <div className={`mt-3 rounded-lg border p-3 text-xs leading-relaxed ${
                            isCorrect
                              ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-100"
                              : "border-rose-500/20 bg-rose-500/5 text-rose-100"
                          }`}>
                            <strong className={isCorrect ? "text-emerald-400" : "text-rose-400"}>
                              {isCorrect ? "Tepat. " : "Belum tepat. "}
                            </strong>
                            {question.explanation}
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>

                {hasAnsweredAll && (
                  <div className="mt-5 flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs font-medium text-emerald-200">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                    Semua soal terjawab. Modul ini telah ditandai selesai.
                  </div>
                )}
              </section>

              <div className="flex flex-col-reverse gap-3 border-t border-neutral-800 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => setActiveModule(null)}
                  className="rounded-lg px-4 py-2.5 text-xs font-semibold text-neutral-400 transition-colors hover:bg-neutral-900 hover:text-white"
                >
                  Tutup dan Lanjutkan Nanti
                </button>
                <button
                  type="button"
                  onClick={finishModule}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-neutral-100 px-4 py-2.5 text-xs font-bold text-neutral-950 transition-colors hover:bg-white"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {nextModule ? "Tandai Selesai & Lanjut" : "Tandai Selesai & Tutup"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
