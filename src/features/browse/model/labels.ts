/**
 * Display helpers for the make/model browser. Pure functions, no React.
 * Ranges are written with "עד" ("to") instead of a dash: a dash between numbers gets visually flipped in RTL text.
 */
import type { Make, ModelLine, Powertrain } from "../../../data/generations";
import { rangeText } from "../../../shared/format";

/** Year the data refers to as "now" (current generations end here for range maths). */
export const THIS_YEAR = 2026;
/** The browser covers generations sold from this year on. */
export const FIRST_YEAR = 2010;

const nf = new Intl.NumberFormat("he-IL");
export const shekel = (n: number) => `₪${nf.format(Math.round(n))}`;
export const numberHe = (n: number) => nf.format(n);

export const POWERTRAIN_HE: Record<Powertrain, string> = { petrol: "בנזין", diesel: "דיזל", hybrid: "היברידי", phev: "פלאג-אין", ev: "חשמלי" };
export const STATUS_HE: Record<ModelLine["status"], string> = { on_sale: "נמכר חדש", discontinued: "לא משווק יותר", not_sold_new: "לא נמכר חדש בישראל", unverified: "מחיר לא אומת" };

/** "₪159,900 עד ₪174,990" (or one price when from = to). */
export const priceText = (p: [number, number]) => rangeText(shekel(p[0]), shekel(p[1]));

/** "122–140" → "122 עד 140"; "186–" → "186 ומעלה". */
export const hpText = (hp: string) => hp.replace(/^(\d+)–(\d+)$/, "$1 עד $2").replace(/^(\d+)–$/, "$1 ומעלה");

/** Years one generation covers in the browser, e.g. "2019 עד היום". */
export const genYears = (from: number, to: number | null) => rangeText(Math.max(FIRST_YEAR, from), to ?? "היום");

/** Years a whole model line covers since 2010, e.g. "2010 עד היום". */
export function modelYears(m: ModelLine): string {
  const from = Math.max(FIRST_YEAR, Math.min(...m.gens.map((g) => g.from)));
  const current = m.gens.some((g) => g.to === null);
  return rangeText(from, current ? "היום" : Math.max(...m.gens.map((g) => g.to ?? THIS_YEAR)));
}

/** Wikipedia article titles where "<Make> <Model>" isn't the article name. */
const WIKI_TITLES: Record<string, string> = {
  "mazda/mazda3": "Mazda3", "mazda/mazda2": "Mazda2", "jaecoo/jaecoo-7": "Jaecoo J7", "jaecoo/jaecoo-8": "Jaecoo J8", "jaecoo/jaecoo-5": "Jaecoo J5",
  "jaecoo/omoda-5": "Omoda 5", "jaecoo/omoda-e5": "Omoda E5", "chery/tiggo-8": "Chery Tiggo 8", "chery/tiggo-7": "Chery Tiggo 7", "chery/tiggo-4": "Chery Tiggo 4",
  "chery/fx": "Chery Tiggo 7", "mg/zs": "MG ZS (SUV)", "mg/zs-ev": "MG ZS EV", "mg/mg4": "MG4 EV", "mg/mg5": "MG5", "geely/geometry-c": "Geometry C",
  "seat/ibiza": "SEAT Ibiza", "seat/arona": "SEAT Arona", "seat/ateca": "SEAT Ateca", "seat/leon": "SEAT León", "seat/tarraco": "SEAT Tarraco",
  "cupra/cupra-leon": "Cupra León", "cupra/cupra-ateca": "SEAT Ateca", "skoda/octavia": "Škoda Octavia", "skoda/kodiaq": "Škoda Kodiaq",
  "skoda/karoq": "Škoda Karoq", "skoda/kamiq": "Škoda Kamiq", "skoda/superb": "Škoda Superb", "mitsubishi/space-star": "Mitsubishi Mirage",
};

/** English Wikipedia article whose lead image represents the model. */
export const wikiTitle = (mk: Make, m: ModelLine) =>
  WIKI_TITLES[`${mk.id}/${m.id}`] ?? `${mk.name === "Omoda & Jaecoo" ? "Jaecoo" : mk.name} ${m.model}`;

/** Free-text match over make and model names in Hebrew and English. */
export const matchesQuery = (mk: Make, m: ModelLine, q: string) => `${m.he} ${m.model} ${mk.he} ${mk.name}`.toLowerCase().includes(q.toLowerCase());
