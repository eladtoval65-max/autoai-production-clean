/**
 * Sourced per-generation facts (data-facts/<make>.json): known issues, engines with real-world consumption,
 * Euro NCAP result, the Israeli launch price and costly maintenance items. Every item carries its source; see data-facts/README.md.
 * Bundled at build time (Vite glob), one chunk per make, loaded on demand.
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

/**
 * Each make's file is its own small chunk, fetched on demand (a model page loads one make; the questionnaire and
 * guides load all in the background), so the first page load stays light. factsFor() is synchronous and returns {}
 * until the make is loaded — pages call useFacts() to load and re-render.
 */
const loaders = import.meta.glob<MakeFile>("../../data-facts/[a-z]*.json", { import: "default" });
const BY_MAKE: Record<string, MakeFile> = {};
const pending = new Map<string, Promise<void>>();
const listeners = new Set<() => void>();
const pathOf = (makeId: string) => `../../data-facts/${makeId}.json`;

/** Loads one make's facts (no-op when already loaded or unknown). */
export function loadMakeFacts(makeId: string): Promise<void> {
  if (BY_MAKE[makeId]) return Promise.resolve();
  const loader = loaders[pathOf(makeId)];
  if (!loader) return Promise.resolve();
  if (!pending.has(makeId)) {
    pending.set(makeId, loader().then((f) => { BY_MAKE[f.make] = f; listeners.forEach((l) => l()); }).catch(() => { pending.delete(makeId); }));
  }
  return pending.get(makeId)!;
}

/** Loads every make (questionnaire, guides). */
export const loadAllFacts = () => Promise.all(Object.keys(loaders).map((p) => loadMakeFacts(p.split("/").pop()!.replace(".json", "")))).then(() => undefined);

export const factsLoaded = (makeId?: string) => (makeId ? Boolean(BY_MAKE[makeId]) || !loaders[pathOf(makeId)] : Object.keys(BY_MAKE).length >= Object.keys(loaders).length);

/** Subscribe to "more facts arrived" (used by the useFacts hook). */
export function onFactsLoaded(cb: () => void): () => void { listeners.add(cb); return () => { listeners.delete(cb); }; }

/** Facts for one generation, or an empty object when none were collected (or loaded) yet. */
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
