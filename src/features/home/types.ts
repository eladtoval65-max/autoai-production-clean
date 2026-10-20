/**
 * Types for the home page (questionnaire → ranked recommendations → compare/detail).
 */
import type { LucideIcon } from "lucide-react";
import type { Band as CatalogBand } from "../../data/catalogData";

/** One car as the UI uses it, whether it came from the live database or the static catalog. */
export type Car = {
  id: string;
  make: string;            // display name "Make Model · Trim"
  years: string;           // "2026 · Hybrid · suv"
  price: number;           // list price ₪
  score: number;           // average of the 5 sub-scores (0–100)
  use: string;             // main use it suits: city | family | highway | fun
  fuel: string;            // Hebrew powertrain label (היברידי / בנזין / חשמלי / דיזל)
  reliability: number; safety: number; economy: number; comfort: number; fun: number; // 0–100
  why: string; pros: string[]; cons: string[];
  bodyType?: string;
  insuranceMin?: number; insuranceMax?: number;
  ownershipMonthly?: number;          // total monthly cost at 15,000 km/yr
  fuelMonthly?: number; insuranceMonthlyAmt?: number; maintenanceMonthly?: number; depreciationMonthly?: number;
  marketRange?: string;               // "₪150K–₪175K"
  dataNote?: string; dataStatus?: string; dataConfidence?: number;
  sourceName?: string; sourceUrl?: string; lastVerifiedAt?: string;
  demo?: boolean;                     // true when shown from the static catalog (DB not connected)
  bands?: Record<7000 | 15000 | 25000, CatalogBand>; // monthly cost at three yearly mileages
  confidence?: number;
  spec?: { hp: number | null; seats: number | null; cargo: number | null; cons: number | null; ev: boolean };
};

/** A car with its match score for the current answers (0–100). */
export type Ranked = Car & { match: number };

export type StepKey = "budget" | "use" | "priority" | "fuel" | "annualKm";
export type MultiKey = "use" | "priority" | "fuel";
export type QuizMode = "quick" | "full";

/** Questionnaire answers. use/priority/fuel allow several choices. */
export type Answers = {
  budget: number; use: string[]; priority: string[]; fuel: string[]; family: string;
  annualKm: number; annualKmBand: "low" | "mid" | "high";
};

/** One answer button in the questionnaire. `he`/`en` = [title, subtitle]. */
export type Choice = { value: string | number; icon?: LucideIcon; amount?: string; he: [string, string]; en: [string, string] };

/** Workspace tabs under the questionnaire. */
export type Tab = "results" | "saved" | "compare" | "detail" | "analysis" | "tools";

/** A cost band from the live tRPC `tco.multiBand` endpoint. */
export type LadderBand = {
  totalMonthly: number | null; fuelMonthly?: number | null; insuranceMonthly?: number | null;
  maintenanceMonthly?: number | null; depreciationMonthly?: number | null; isEstimate?: boolean;
} | null | undefined;
export type Ladder = { km7000?: LadderBand; km15000?: LadderBand; km25000?: LadderBand };
export type LadderByTrim = Record<number, Ladder>;
