/**
 * Seller's "monthly cost" card: the choices encoded in a shareable URL, and decoded back with validation.
 * Pure functions, no React. Nothing is stored on our server — the whole card lives in the link.
 */
import type { Generation, Make, ModelLine, Powertrain } from "../../../data/generations";
import { factsFor } from "../../../data/facts";
import { FIRST_YEAR, THIS_YEAR } from "../../browse/model/labels";

export type CardInput = { makeId: string; modelId: string; year: number; pt: Powertrain; price: number; km: number };
export type Card = CardInput & { make: Make; model: ModelLine; gen: Generation };

/** Inputs for the shared used-cost estimate (incl. body type and the generation's sourced maintenance items). */
export const costInputOf = (c: Card) => ({
  gen: c.gen, segment: c.model.segment, year: c.year, powertrain: c.pt, askingPrice: c.price, kmPerYear: c.km,
  body: c.model.body, maintenanceItems: factsFor(c.make.id, c.model.id, c.gen.code).maintenance,
});

const POWERTRAINS: Powertrain[] = ["petrol", "diesel", "hybrid", "phev", "ev"];

/** Every model year a model line covers since 2010, newest first. */
export function yearsOfModel(model: ModelLine): number[] {
  const years = new Set<number>();
  for (const g of model.gens) for (let y = Math.max(FIRST_YEAR, g.from); y <= (g.to ?? THIS_YEAR); y++) years.add(y);
  return [...years].sort((a, b) => b - a);
}

/** The generation that covers a model year (the newer one when two overlap in a changeover year). */
export function genForYear(model: ModelLine, year: number): Generation | undefined {
  return [...model.gens].reverse().find((g) => g.from <= year && (g.to ?? THIS_YEAR) >= year);
}

/** Query string for the shareable card, e.g. "m=toyota&o=corolla&y=2018&e=hybrid&p=65000&k=15000". */
export function encodeCard(c: CardInput): string {
  return new URLSearchParams({ m: c.makeId, o: c.modelId, y: String(c.year), e: c.pt, p: String(c.price), k: String(c.km) }).toString();
}

/** Reads a card from a query string; null when anything is missing, unknown or implausible. */
export function decodeCard(search: string, makes: Make[]): Card | null {
  const q = new URLSearchParams(search);
  const make = makes.find((m) => m.id === q.get("m"));
  const model = make?.models.find((m) => m.id === q.get("o"));
  const year = Number(q.get("y")), price = Number(q.get("p")), km = Number(q.get("k") || 15000);
  const pt = q.get("e") as Powertrain;
  if (!make || !model || !POWERTRAINS.includes(pt)) return null;
  if (!Number.isInteger(year) || !Number.isInteger(price) || price < 5000 || price > 3_000_000 || !(km >= 1000 && km <= 100_000)) return null;
  const gen = genForYear(model, year);
  if (!gen || !gen.pt.includes(pt)) return null;
  return { makeId: make.id, modelId: model.id, year, pt, price, km, make, model, gen };
}

/** Text the seller pastes into the ad description (numbers rounded; clearly an estimate). */
export function adText(name: string, total: number, url: string): string {
  const t = `₪${new Intl.NumberFormat("he-IL").format(Math.round(total / 10) * 10)}`;
  return `כמה הרכב יעלה לך בחודש? לפי מחשבון ״כמה עולה״, ${name} במחיר המבוקש עולה כ־${t} בחודש כולל דלק, ביטוח (הערכה), טיפולים, ירידת ערך ורישוי. הפירוט המלא: ${url}`;
}
