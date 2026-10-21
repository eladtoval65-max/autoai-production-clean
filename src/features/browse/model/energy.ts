/**
 * Monthly energy cost from a real-world consumption figure. Pure function.
 * Prices come from src/data/energyPrices.json (official petrol 95 maximum price, home electricity tariff).
 */
import ENERGY from "../../../data/energyPrices.json";

/** ₪ per month: consumption per 100 km × km per year ÷ 12 × price per litre / kWh. Diesel uses the diesel estimate. */
export function monthlyEnergy(cons: number, unit: "L" | "kWh", kmPerYear: number, pt?: string): number {
  const price = unit === "kWh" ? ENERGY.electricityPerKwh : pt === "diesel" ? ENERGY.dieselPerL : ENERGY.petrolPerL;
  return Math.round(((cons / 100) * kmPerYear * price) / 12);
}

export const ENERGY_PRICES = ENERGY;
