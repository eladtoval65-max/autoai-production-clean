/**
 * Youngest-driver adjustment of the INSURANCE estimate (the rest of the monthly cost doesn't change).
 * Israeli insurers price young (under 24) and newly licensed drivers much higher; these factors are our estimate
 * of that surcharge — shown as an estimate, never as a quote. Base estimates assume an experienced driver.
 */
import type { Car, Driver } from "../types";

export const DRIVER_INSURANCE_FACTOR: Record<Driver, number> = { young: 1.8, new: 1.25, experienced: 1 };
const NOTE: Record<Driver, string> = {
  young: "הביטוח מותאם לנהג/ת צעיר/ה או חדש/ה (הערכה: בערך פי 1.8 מנהג ותיק).",
  new: "הביטוח מותאם לנהג/ת עם ותק של 2–5 שנים (הערכה: בערך פי 1.25 מנהג ותיק).",
  experienced: "",
};

/** The car with its insurance (and totals) scaled for the driver profile. */
export function withDriver(car: Car, driver: Driver): Car {
  const f = DRIVER_INSURANCE_FACTOR[driver];
  if (f === 1) return car;
  const r = (n: number | undefined) => (n == null ? n : Math.round(n * f));
  const extra = (ins: number | undefined) => (ins == null ? 0 : Math.round(ins * (f - 1)));
  const bands = car.bands && (Object.fromEntries(Object.entries(car.bands).map(([km, b]) => [km, { ...b, insurance: Math.round(b.insurance * f), total: b.total + extra(b.insurance) }])) as Car["bands"]);
  return {
    ...car, bands,
    insuranceMonthlyAmt: r(car.insuranceMonthlyAmt), insuranceMin: r(car.insuranceMin), insuranceMax: r(car.insuranceMax),
    ownershipMonthly: car.ownershipMonthly == null ? car.ownershipMonthly : car.ownershipMonthly + extra(car.insuranceMonthlyAmt ?? (car.bands ? car.bands[15000].insurance : undefined)),
    dataNote: [car.dataNote, NOTE[driver]].filter(Boolean).join(" "),
  };
}
