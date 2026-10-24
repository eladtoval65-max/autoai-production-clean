/**
 * Sourced per-generation facts (data-facts/<make>.json): known issues, engines with real-world consumption,
 * Euro NCAP result, the Israeli launch price and costly maintenance items. Every item carries its source; see data-facts/README.md.
 * Loaded at build time (Vite glob), so pages stay static and fast.
 */
export type Source = { title: string; url: string };
export type IssueLevel = "recall" | "manufacturer" | "widely_reported";
export type Issue = { he: string; level: IssueLevel; scope?: string; source: Source };
export type EngineFact = { name: string; pt?: string; hp?: number; cons: number; unit: "L" | "kWh"; source: Source };
export type NcapFact = { stars: number | null; year?: number; url?: string; note?: string };
export type LaunchPrice = { ils: number; year: number; note?: string; source: Source };
/**
 * A maintenance cost a used buyer should budget for, with a sourced price range in ₪ (Israeli garage / importer price when available).
 *  - scheduled: done every intervalKm and/or intervalYears (timing belt, DSG oil, spark plugs) → spread into the monthly cost;
 *  - wear: typical replacement at around intervalKm (clutch, brakes on heavy cars) → spread into the monthly cost;
 *  - risk: a known expensive failure that may or may not happen (hybrid battery, injectors) → shown, not added to the monthly cost.
 */
export type MaintenanceKind = "scheduled" | "wear" | "risk";
export type MaintenanceItem = { he: string; kind: MaintenanceKind; intervalKm?: number; intervalYears?: number; costIls: [number, number]; scope?: string; source: Source };
export type GenFacts = { issues?: Issue[]; engines?: EngineFact[]; ncap?: NcapFact | null; launchPrice?: LaunchPrice | null; maintenance?: MaintenanceItem[] };
type MakeFile = { make: string; updated?: string; models: Record<string, Record<string, GenFacts>> };

const files = import.meta.glob<MakeFile>("../../data-facts/[a-z]*.json", { eager: true, import: "default" });
const BY_MAKE: Record<string, MakeFile> = Object.fromEntries(Object.values(files).map((f) => [f.make, f]));

/** Facts for one generation, or an empty object when none were collected yet. */
export function factsFor(makeId: string, modelId: string, code: string): GenFacts {
  return BY_MAKE[makeId]?.models?.[modelId]?.[code] ?? {};
}

/** Date the make's facts were last updated (shown next to the sources). */
export const factsUpdated = (makeId: string) => BY_MAKE[makeId]?.updated;

/** Hebrew label for each issue level — never presented as a diagnosis. */
export const ISSUE_LEVEL_HE: Record<IssueLevel, string> = {
  recall: "קריאת שירות",
  manufacturer: "מוכר ע״י היצרן",
  widely_reported: "דווח בהרחבה",
};

/** Hebrew label for each maintenance kind. */
export const MAINTENANCE_KIND_HE: Record<MaintenanceKind, string> = {
  scheduled: "טיפול מתוכנן",
  wear: "בלאי צפוי",
  risk: "תקלה יקרה אפשרית",
};
