/**
 * Every model on the site as a questionnaire candidate — not only the 49 fully-researched catalog cars.
 *
 *  - newFromModels(): every model on sale today with a verified list price that isn't already in the rich catalog.
 *  - usedFromGenerations(budget): every generation since 2012 at the newest model year whose ESTIMATED used price
 *    fits the budget. The estimate starts from the sourced Israeli launch price (data-facts) — or today's list price
 *    for the current generation — and applies our yearly depreciation curve. It is labelled as an estimate
 *    everywhere it is shown; generations without a sourced starting price are left out rather than guessed.
 *
 * Sub-scores for these cars come from partial data (Euro NCAP, consumption, number of recalls/known issues,
 * body and segment) and are flagged `estimatedScores`.
 */
import { factsFor } from "../../../data/facts";
import { MAKES, type Generation, type Make, type ModelLine, type Powertrain } from "../../../data/generations";
import { THIS_YEAR } from "../../browse/model/labels";
import { depreciationRate, estimateUsedCost } from "../../browse/model/usedCost";
import type { Car } from "../types";

const FIRST_USED_YEAR = 2012;
const KM_BANDS = [7000, 15000, 25000] as const;

const BODY_TO_TYPE: Record<ModelLine["body"], string> = { city: "hatchback", hatch: "hatchback", sedan: "sedan", suv: "suv", suv7: "suv", wagon: "wagon", pickup: "pickup", mpv: "minivan" };
const PT_HE: Record<Powertrain, string> = { petrol: "בנזין", diesel: "דיזל", hybrid: "היברידי", phev: "היברידי", ev: "חשמלי" };
const USE_BY_BODY: Record<ModelLine["body"], string> = { city: "city", hatch: "city", sedan: "highway", suv: "family", suv7: "family", wagon: "highway", pickup: "family", mpv: "family" };

/** Real-world consumption of the generation's main engine: per-engine facts when collected, else the generation estimate. */
function mainConsumption(make: Make, model: ModelLine, gen: Generation): number {
  const engines = factsFor(make.id, model.id, gen.code).engines ?? [];
  return engines.length ? Math.min(...engines.map((e) => e.cons)) : gen.cons;
}

/** 0–100 sub-scores from what we actually know. */
function scoresFor(make: Make, model: ModelLine, gen: Generation) {
  const f = factsFor(make.id, model.id, gen.code);
  const stars = f.ncap?.stars ?? gen.ncap;
  const safety = stars == null ? 65 : [30, 40, 52, 64, 78, 90][stars];
  const serious = (f.issues ?? []).filter((i) => i.level !== "widely_reported").length;
  const reported = (f.issues ?? []).filter((i) => i.level === "widely_reported").length;
  const reliability = Math.max(50, 82 - serious * 4 - reported * 3);
  const cons = mainConsumption(make, model, gen);
  const ev = gen.pt[0] === "ev";
  const economy = ev ? 88 : Math.max(40, Math.min(92, Math.round(110 - cons * 8)));
  const comfort = model.segment === "premium" ? 86 : model.body === "suv7" || model.body === "mpv" ? 78 : model.body === "city" ? 64 : 72;
  const hp = Number(String(gen.hp).split(/[–-]/).pop()) || 120;
  const fun = Math.max(45, Math.min(92, Math.round(40 + hp / 5)));
  return { safety, reliability, economy, comfort, fun };
}

/** Monthly cost bands at 7k / 15k / 25k km for a car of this price and model year. */
function bandsFor(model: ModelLine, gen: Generation, year: number, price: number) {
  const pt = gen.pt[0];
  const bands = {} as NonNullable<Car["bands"]>;
  for (const km of KM_BANDS) {
    const c = estimateUsedCost({ gen, segment: model.segment, year, powertrain: pt, askingPrice: price, kmPerYear: km });
    if (!c) return undefined;
    const r = (n: number) => Math.round(n);
    bands[km] = { fuel: r(c.fuel), insurance: r(c.insurance), maintenance: r(c.maintenance), depreciation: r(c.depreciation), total: r(c.total) };
  }
  return bands;
}

/** Shared Car fields for a model/generation. */
function baseCar(make: Make, model: ModelLine, gen: Generation, year: number, price: number): Omit<Car, "id" | "years" | "why" | "condition"> {
  const s = scoresFor(make, model, gen);
  const bands = bandsFor(model, gen, year, price);
  const b = bands?.[15000];
  const f = factsFor(make.id, model.id, gen.code);
  return {
    make: `${make.name} ${model.model}`, price, bodyType: BODY_TO_TYPE[model.body], use: USE_BY_BODY[model.body], fuel: PT_HE[gen.pt[0]],
    score: Math.round((s.reliability + s.safety + s.economy + s.comfort + s.fun) / 5),
    reliability: s.reliability, safety: s.safety, economy: s.economy, comfort: s.comfort, fun: s.fun,
    pros: [], cons: (f.issues ?? []).slice(0, 2).map((i) => i.he),
    bands, ownershipMonthly: b?.total, fuelMonthly: b?.fuel, insuranceMonthlyAmt: b?.insurance, maintenanceMonthly: b?.maintenance, depreciationMonthly: b?.depreciation,
    dataStatus: "estimated", estimatedScores: true, href: `/cars/${make.id}/${model.id}`,
    spec: { hp: Number(String(gen.hp).split(/[–-]/)[0]) || null, seats: model.body === "suv7" ? 7 : 5, cargo: null, cons: mainConsumption(make, model, gen), ev: gen.pt[0] === "ev" },
  };
}

/** True when the rich catalog already has this model (so it isn't listed twice). */
function inRichCatalog(rich: Car[], make: Make, model: ModelLine): boolean {
  const name = `${make.name} ${model.model}`.toLowerCase();
  return rich.some((c) => c.make.toLowerCase().startsWith(name));
}

/** Every model on sale with a verified list price, as a new-car candidate. */
export function newFromModels(rich: Car[]): Car[] {
  const out: Car[] = [];
  for (const make of MAKES) for (const model of make.models) {
    if (model.status !== "on_sale" || !model.price || inRichCatalog(rich, make, model)) continue;
    const gen = model.gens[model.gens.length - 1];
    out.push({
      ...baseCar(make, model, gen, THIS_YEAR, model.price[0]),
      id: `new:${make.id}/${model.id}`, condition: "new", years: `${THIS_YEAR} · חדש · ${PT_HE[gen.pt[0]]}`,
      why: `מחיר מחירון מ־₪${model.price[0].toLocaleString("he-IL")}. עלות חודשית משוערת לפי צריכה בפועל, ביטוח לפי שווי (הערכה) וירידת ערך.`,
      dataNote: "נתונים בסיסיים: מחיר מחירון, צריכה ובטיחות. הציונים משוערים — פרטים מלאים בעמוד הדגם.",
    });
  }
  return out;
}

/** Estimated used value of a generation at a model year, from its sourced starting price. Null when unknown. */
export function estimatedValue(make: Make, model: ModelLine, gen: Generation, year: number): number | null {
  const launch = factsFor(make.id, model.id, gen.code).launchPrice;
  const isCurrent = gen === model.gens[model.gens.length - 1] && gen.to == null;
  const start = launch?.ils ?? (isCurrent && model.price ? model.price[0] : null);
  if (!start) return null;
  // Launch price is in the launch year's shekels; a car bought new in `year` cost about that.
  let value = start;
  for (let age = 1; age <= THIS_YEAR - year; age++) value *= 1 - depreciationRate(age, gen.pt[0], model.segment === "premium");
  return Math.round(value / 500) * 500;
}

/** Every generation since 2012, at the newest model year whose estimated price fits the budget. */
export function usedFromGenerations(budget: number): Car[] {
  const out: Car[] = [];
  for (const make of MAKES) for (const model of make.models) for (const gen of model.gens) {
    const last = Math.min(gen.to ?? THIS_YEAR - 1, THIS_YEAR - 1);
    for (let year = last; year >= Math.max(gen.from, FIRST_USED_YEAR); year--) {
      const value = estimatedValue(make, model, gen, year);
      if (value == null) break;
      if (value > budget) continue;
      out.push({
        ...baseCar(make, model, gen, year, value),
        id: `used:${make.id}/${model.id}/${gen.code}`, condition: "used",
        years: `${year} · יד שנייה · ${PT_HE[gen.pt[0]]} · דור ${gen.code}`,
        why: `שנת ${year} במחיר משוער של כ־₪${value.toLocaleString("he-IL")} (הערכה לפי מחיר ההשקה וירידת ערך ממוצעת — המחיר בפועל תלוי בק״מ, יד ומצב).`,
        dataNote: "מחיר יד שנייה משוער בלבד. בדקו מחירים אמיתיים ביד2 והכניסו את המחיר שקיבלתם בעמוד הדגם לחישוב מדויק.",
        marketRange: `≈₪${Math.round(value / 1000)}K`,
      });
      break;
    }
  }
  return out;
}
