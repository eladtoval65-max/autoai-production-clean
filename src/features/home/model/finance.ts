/**
 * Car-loan maths for the cost calculator. Pure functions, no React.
 */

/** Monthly payment of a standard amortised loan (Shpitzer). `annualRatePct` e.g. 4.5; `years` e.g. 5. */
export function loanPayment(principal: number, annualRatePct: number, years: number): number {
  const monthlyRate = annualRatePct / 100 / 12;
  const months = years * 12;
  if (monthlyRate <= 0) return Math.round(principal / months);
  const growth = Math.pow(1 + monthlyRate, months);
  return Math.round((principal * monthlyRate * growth) / (growth - 1));
}

/** Total interest paid over the life of the loan. */
export const totalInterest = (payment: number, years: number, principal: number) => payment * years * 12 - principal;
