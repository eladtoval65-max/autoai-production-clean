/**
 * Sourced per-generation facts (data-facts/<make>.json): known issues, engines with real-world consumption,
 * Euro NCAP result and the Israeli launch price. Every item carries its source; see data-facts/README.md.
 * Loaded at build time (Vite glob), so pages stay static and fast.
 */
export type Source = { title: string; url: string };
export type IssueLevel = "recall" | "manufacturer" | "widely_reported";
export type Issue = { he: string; level: IssueLevel; scope?: string; source: Source };
export type EngineFact = { name: string; pt?: string; hp?: number; cons: number; unit: "L" | "kWh"; source: Source };
export type NcapFact = { stars: number | null; year?: number; url?: string; note?: string };
export type LaunchPrice = { ils: number; year: number; note?: string; source: Source };
export type GenFacts = { issues?: Issue[]; engines?: EngineFact[]; ncap?: NcapFact | null; launchPrice?: LaunchPrice | null };
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
