/**
 * Monthly cost of ownership (TCO) maths. Pure functions, no React.
 * Monthly total = fuel/electricity + insurance (estimate) + maintenance + depreciation + licensing (₪121, official).
 */
import type { Band as CatalogBand } from "../../../data/catalogData";
import type { Provenance } from "../../../shared/ui/CodeChip";
import type { Car, Ladder, LadderBand, LadderByTrim } from "../types";

/** Annual licence fee spread per month (official). */
export const REGISTRATION = 121;

/** Validated categorical colours for the five cost components, in order (fuel, insurance, maintenance, depreciation, licensing). */
export const COST_COLORS = ["#2a78d6", "#eb6834", "#6250d6", "#eda100", "#e87ba4"];

/** Cost components at any yearly km, interpolated between the 7k / 15k / 25k catalog bands. */
export function bandAt(car: Car, km: number): CatalogBand | null {
  if (!car.bands) return null;
  const [lo, hi] = km <= 15000 ? ([7000, 15000] as const) : ([15000, 25000] as const);
  const f = (km - lo) / (hi - lo);
  const L = car.bands[lo], H = car.bands[hi];
  const mix = (k: keyof CatalogBand) => Math.max(0, Math.round(L[k] + (H[k] - L[k]) * f));
  const out = { fuel: mix("fuel"), insurance: mix("insurance"), maintenance: mix("maintenance"), depreciation: mix("depreciation"), total: 0 };
  out.total = out.fuel + out.insurance + out.maintenance + out.depreciation + REGISTRATION;
  return out;
}

/** Total monthly cost at a yearly km. Falls back to scaling the overall estimate, then to a rough formula. */
export function monthlyFor(car: Car | undefined, km: number): number {
  if (!car) return 0;
  const b = bandAt(car, km);
  if (b) return b.total;
  if (car.ownershipMonthly) return Math.round(car.ownershipMonthly * (0.7 + 0.3 * (km / 15000)));
  return Math.round((car.price * 0.08) / 12 + (km / 12) * (car.fuel === "היברידי" ? 0.42 : 0.62) + 500);
}

/** Labels for the five cost lines (passed in from the i18n dictionary). */
export type CostLabels = { fuel: string; insurance: string; maintenance: string; depreciation: string; registration: string };
export type CostRow = { label: string; value?: number; code: Provenance };

/** The five monthly lines with their provenance. Unknown values are marked "missing", never guessed. */
export function tcoRows(car: Car, km: number, l: CostLabels): CostRow[] {
  const b = bandAt(car, km);
  if (b) return [
    { label: l.fuel, value: b.fuel, code: "est" }, { label: l.insurance, value: b.insurance, code: "est" },
    { label: l.maintenance, value: b.maintenance, code: "est" }, { label: l.depreciation, value: b.depreciation, code: "est" },
    { label: l.registration, value: REGISTRATION, code: "off" },
  ];
  const f = km / 15000;
  const fuel = car.fuelMonthly != null ? Math.round(car.fuelMonthly * f) : undefined;
  const ins = car.insuranceMonthlyAmt ?? (car.insuranceMin && car.insuranceMax ? Math.round((car.insuranceMin + car.insuranceMax) / 2) : undefined);
  const rows: CostRow[] = [
    { label: l.fuel, value: fuel, code: "est" }, { label: l.insurance, value: ins, code: "est" },
    { label: l.maintenance, value: car.maintenanceMonthly, code: "est" }, { label: l.depreciation, value: car.depreciationMonthly, code: "est" },
    { label: l.registration, value: REGISTRATION, code: "off" },
  ];
  return rows.map((r) => (r.value == null ? { ...r, code: "miss" } : r));
}

/** Live-DB cars have numeric ids (trim ids); static-catalog cars have slugs. */
export const trimOf = (id: string) => { const n = Number(id); return Number.isFinite(n) && n > 0 ? n : undefined; };

const toLadderBand = (b: CatalogBand): LadderBand => ({ totalMonthly: b.total, fuelMonthly: b.fuel, insuranceMonthly: b.insurance, maintenanceMonthly: b.maintenance, depreciationMonthly: b.depreciation, isEstimate: true });

/** 7k/15k/25k cost ladder: live DB values when available, else the catalog bands. */
export function ladderFor(car: Car, db: LadderByTrim | undefined): Ladder | undefined {
  const id = trimOf(car.id);
  if (id && db?.[id]) return db[id];
  return car.bands ? { km7000: toLadderBand(car.bands[7000]), km15000: toLadderBand(car.bands[15000]), km25000: toLadderBand(car.bands[25000]) } : undefined;
}

/** Approximate energy cost per km by powertrain (used by the savings insight and the fallback formula). */
export const energyPerKm = (fuelHe: string) => (fuelHe === "חשמלי" ? 0.102 : fuelHe === "היברידי" ? 0.32 : 0.497);
