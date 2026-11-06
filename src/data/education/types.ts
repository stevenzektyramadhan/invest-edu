export type AssetCategory = "Dasar" | "Saham" | "Reksa Dana" | "Emas" | "Kripto";
export type DifficultyLevel = "Pemula" | "Menengah" | "Lanjutan";

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface EducationSource {
  label: string;
  url: string;
}

export interface EducationModule {
  id: string;
  moduleNumber: number;
  subTopic: string;
  plainTitle: string;
  title: string;
  category: AssetCategory;
  level: DifficultyLevel;
  readTime: string;
  riskRating: "Rendah" | "Sedang" | "Tinggi" | "Sangat Tinggi";
  summary: string;
  keyTakeaways: string[];
  sections: {
    heading: string;
    body: string;
  }[];
  caseStudy: {
    title: string;
    scenario: string;
    calculation: string[];
    conclusion: string;
  };
  redFlags: string[];
  actionChecklist: string[];
  quizzes: QuizQuestion[];
  lastReviewed?: string;
  sources?: EducationSource[];
}

// TODO(owner): verifikasi draf 3 modul fondasi ("Dasar"), seluruh plainTitle, dan sumber rujukan sebelum dipublikasikan. Jangan isi lastReviewed sebelum ditinjau pemilik.
export const PROPOSED_SOURCES_DASAR: EducationSource[] = [
  {
    label: "Sikapi Uangmu (ojk.go.id) — TODO(owner): verifikasi",
    url: "https://sikapiuangmu.ojk.go.id",
  },
];

export const PROPOSED_SOURCES_REKSADANA: EducationSource[] = [
  {
    label: "Otoritas Jasa Keuangan (ojk.go.id) — TODO(owner): verifikasi",
    url: "https://www.ojk.go.id",
  },
  {
    label: "DJPPR Kemenkeu RI (djppr.kemenkeu.go.id) — TODO(owner): verifikasi",
    url: "https://www.djppr.kemenkeu.go.id",
  },
];

export const PROPOSED_SOURCES_EMAS: EducationSource[] = [
  {
    label: "Otoritas Jasa Keuangan (ojk.go.id) — TODO(owner): verifikasi",
    url: "https://www.ojk.go.id",
  },
];

export const PROPOSED_SOURCES_SAHAM: EducationSource[] = [
  {
    label: "Bursa Efek Indonesia (idx.co.id) — TODO(owner): verifikasi",
    url: "https://www.idx.co.id",
  },
  {
    label: "Otoritas Jasa Keuangan (ojk.go.id) — TODO(owner): verifikasi",
    url: "https://www.ojk.go.id",
  },
];

export const PROPOSED_SOURCES_KRIPTO: EducationSource[] = [
  {
    label: "Otoritas Jasa Keuangan (ojk.go.id) — TODO(owner): verifikasi",
    url: "https://www.ojk.go.id",
  },
];
