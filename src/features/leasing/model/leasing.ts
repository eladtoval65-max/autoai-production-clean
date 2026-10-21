/**
 * Private leasing vs buying, over the same period. Pure functions, no React.
 * Fuel/electricity is the same either way, so it is left out of both sides.
 *
 *   Leasing  = down payment + monthly payment × months
 *              + insurance and maintenance the lease does NOT include.
 *   Buying   = what the car loses in value over the period (price − resale)
 *              + loan interest (if financed) + insurance + maintenance.
 * The buyer ends the period owning a car worth `resale`; that's why its value loss — not the price — is the cost.
 * All inputs are the visitor's own numbers or labelled estimates; nothing here is an offer.
 */
export type LeaseInput = {
  price: number;            // car list price ₪
  months: number;           // period compared (24 / 36 / 48)
  leaseDown: number;        // leasing down payment ₪
  leaseMonthly: number;     // monthly leasing payment ₪ (from the visitor's offer)
  leaseIncludesInsurance: boolean;
  leaseIncludesMaintenance: boolean;
  buyDown: number;          // down payment when buying ₪ (price − buyDown is financed)
  loanRate: number;         // yearly interest % on the financed part (0 = cash)
  depreciationRate: number; // yearly value loss %, e.g. 12
  insuranceMonthly: number; // estimate ₪/month
  maintenanceMonthly: number; // estimate ₪/month
};

export type LeaseResult = {
  lease: { total: number; monthly: number; extras: number };
  buy: { total: number; monthly: number; valueLoss: number; interest: number; running: number; resale: number; payment: number };
  cheaper: "lease" | "buy" | "same";
  difference: number;       // total difference over the period ₪
};

/** Monthly payment of a standard (שפיצר) loan. */
export function loanPayment(principal: number, yearlyRatePct: number, months: number): number {
  if (principal <= 0 || months <= 0) return 0;
  const r = yearlyRatePct / 100 / 12;
  return r === 0 ? principal / months : (principal * r) / (1 - (1 + r) ** -months);
}

/** Starting estimates for a car of this price (the visitor can change them). Same insurance rule as the used-car calculator. */
export function defaultsFor(price: number) {
  return { insuranceMonthly: Math.round((1700 + 1000 + price * 0.022) / 12), maintenanceMonthly: 200, depreciationRate: 12 };
}

export function compareLease(i: LeaseInput): LeaseResult {
  const running = (i.insuranceMonthly + i.maintenanceMonthly) * i.months;
  const extras = ((i.leaseIncludesInsurance ? 0 : i.insuranceMonthly) + (i.leaseIncludesMaintenance ? 0 : i.maintenanceMonthly)) * i.months;
  const leaseTotal = i.leaseDown + i.leaseMonthly * i.months + extras;

  const resale = i.price * (1 - i.depreciationRate / 100) ** (i.months / 12);
  const financed = Math.max(0, i.price - i.buyDown);
  const payment = loanPayment(financed, i.loanRate, i.months);
  const interest = Math.max(0, payment * i.months - financed);
  const valueLoss = i.price - resale;
  const buyTotal = valueLoss + interest + running;

  const diff = Math.round(leaseTotal - buyTotal);
  return {
    lease: { total: Math.round(leaseTotal), monthly: Math.round(leaseTotal / i.months), extras: Math.round(extras) },
    buy: { total: Math.round(buyTotal), monthly: Math.round(buyTotal / i.months), valueLoss: Math.round(valueLoss), interest: Math.round(interest), running: Math.round(running), resale: Math.round(resale), payment: Math.round(payment) },
    cheaper: Math.abs(diff) < 500 ? "same" : diff > 0 ? "buy" : "lease",
    difference: Math.abs(diff),
  };
}
