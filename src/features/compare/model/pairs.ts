/**
 * "A מול B" comparison pages for the recommendation catalog. Pure functions, no React — also bundled by
 * scripts/build-seo.mjs so the sitemap and per-page titles list exactly the pairs the site shows.
 * A pair = two catalog cars whose list prices are close (people cross-shop within a price band).
 */
import { STATIC_CATALOG, type CatalogCar } from "../../../data/catalogData";
import { MAKES } from "../../../data/generations";

export type Pair = { slug: string; a: CatalogCar; b: CatalogCar };

const FUEL_HE: Record<string, string> = { Hybrid: "היברידי", Electric: "חשמלי", "Plug-in Hybrid": "פלאג־אין", Diesel: "דיזל" };

/** Hebrew display name: make + model from the browse data (longest model-name match), plus the powertrain when not petrol. */
export function hebrewName(c: CatalogCar): string {
  const make = MAKES.find((m) => m.name.toLowerCase() === c.make.toLowerCase() || m.id === c.make.toLowerCase());
  const model = c.model.toLowerCase();
  const line = make?.models
    .filter((m) => model.startsWith(m.model.toLowerCase()) || model.startsWith(`${make.name} ${m.model}`.toLowerCase()))
    .sort((x, y) => y.model.length - x.model.length)[0];
  // Model name without powertrain words (the Hebrew powertrain is appended below).
  const bareModel = c.model.replace(/\b(Hybrid|Electric|EV|PHEV|DM-i)\b/gi, "").replace(/\s+/g, " ").trim();
  const base = make && line
    ? (line.he.startsWith(make.he) ? line.he : `${make.he} ${line.he}`)
    : `${make?.he ?? c.make} ${bareModel.toLowerCase().startsWith((make?.name ?? c.make).toLowerCase()) ? bareModel.slice((make?.name ?? c.make).length).trim() : bareModel}`;
  const fuel = FUEL_HE[c.fuelType];
  return fuel && !base.includes(fuel) ? `${base} ${fuel}` : base;
}

/** Canonical slug: the two ids in alphabetical order, so "a-vs-b" and "b-vs-a" are one page. */
export const pairSlug = (x: string, y: string) => (x < y ? `${x}-vs-${y}` : `${y}-vs-${x}`);

const NEIGHBOURS = 3;     // comparisons per car
const PRICE_BAND = 0.3;   // ±30% of list price

/** All comparison pairs: each car with its closest-priced neighbours within the band. Sorted by slug. */
export function comparePairs(cars: CatalogCar[] = STATIC_CATALOG): Pair[] {
  const bySlug = new Map<string, Pair>();
  for (const a of cars) {
    const near = cars
      .filter((b) => b.id !== a.id && Math.abs(b.price - a.price) <= a.price * PRICE_BAND)
      .sort((b1, b2) => Math.abs(b1.price - a.price) - Math.abs(b2.price - a.price))
      .slice(0, NEIGHBOURS);
    for (const b of near) {
      const slug = pairSlug(a.id, b.id);
      if (!bySlug.has(slug)) bySlug.set(slug, a.id < b.id ? { slug, a, b } : { slug, a: b, b: a });
    }
  }
  return [...bySlug.values()].sort((p, q) => p.slug.localeCompare(q.slug));
}

/** The pair for a URL slug, or null. */
export function findPair(slug: string, pairs = comparePairs()): Pair | null {
  return pairs.find((p) => p.slug === slug) ?? null;
}

/** Monthly totals at a yearly mileage (7k / 15k / 25k catalog bands, interpolated in between). */
export function monthlyAt(c: CatalogCar, km: number) {
  const [lo, hi] = km <= 15000 ? ([7000, 15000] as const) : ([15000, 25000] as const);
  const f = (km - lo) / (hi - lo);
  const L = c.bands[lo], H = c.bands[hi];
  const mix = (k: "fuel" | "insurance" | "maintenance" | "depreciation") => Math.round(L[k] + (H[k] - L[k]) * f);
  const parts = { fuel: mix("fuel"), insurance: mix("insurance"), maintenance: mix("maintenance"), depreciation: mix("depreciation"), licence: 121 };
  return { ...parts, total: parts.fuel + parts.insurance + parts.maintenance + parts.depreciation + parts.licence };
}

/** Page title and description (shared by the page and the build's per-page HTML). */
export function pairMeta(p: Pair) {
  const [na, nb] = [hebrewName(p.a), hebrewName(p.b)];
  const [ta, tb] = [monthlyAt(p.a, 15000).total, monthlyAt(p.b, 15000).total];
  const cheaper = ta <= tb ? na : nb;
  const nf = new Intl.NumberFormat("he-IL");
  return {
    title: `${na} מול ${nb}: מה עולה פחות בחודש? | כמה עולה`,
    description: `השוואת עלות חודשית משוערת: ${na} מול ${nb} — דלק, ביטוח (הערכה), טיפולים, ירידת ערך ורישוי. ב־15,000 ק״מ בשנה ${cheaper} זול בכ־₪${nf.format(Math.abs(ta - tb))} בחודש.`,
  };
}
