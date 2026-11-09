/**
 * Official annual licensing fee (אגרת רישוי) — it depends on the car's price group (price when new) and its model year,
 * so it differs from car to car. Table: src/data/licenceFees.json (Ministry of Transport, valid Apr 2026 – Mar 2027).
 * The price group is approximate when we only know the launch price (prices of the year of first registration decide it).
 */
import TABLE from "./licenceFees.json";

export const LICENCE_TABLE = TABLE;
/** Fallback when a car's price when new is unknown: the second group (₪117K–141K), the most common in Israel. */
const UNKNOWN_PRICE = 130000;

/** Annual fee in ₪ for a private car with this price when new and model year. */
export function licenceYearly(priceNew: number | null | undefined, modelYear: number): number {
  const price = priceNew && priceNew > 0 ? priceNew : UNKNOWN_PRICE;
  const group = TABLE.groups.find((g) => g.maxPrice == null || price <= g.maxPrice)!;
  const idx = TABLE.bracketFromYears.findIndex((from) => modelYear >= from);
  return group.fees[idx === -1 ? TABLE.bracketFromYears.length : idx];
}

/** The same fee spread per month, rounded. */
export const licenceMonthly = (priceNew: number | null | undefined, modelYear: number): number =>
  Math.round(licenceYearly(priceNew, modelYear) / 12);
