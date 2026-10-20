/**
 * Row definitions for the comparison table. Each row knows how to read a value from a car,
 * how to display it, and whether lower or higher wins.
 */
import type { ReactNode } from "react";
import { shekel, useLang } from "../../../../shared/i18n";
import { CodeChip } from "../../../../shared/ui/CodeChip";
import { Score, ScoreText } from "../../../../shared/ui/Score";
import { bandAt } from "../../model/cost";
import type { Better } from "../../model/compare";
import { FUEL_EN } from "../../model/fuel";
import type { Ladder, Ranked } from "../../types";

export type CompareRow = {
  key: string;
  label: string;
  /** Numeric value used to decide the winner (null = unknown / not comparable). */
  get: (car: Ranked, i: number) => number | null;
  show: (value: number | null, car: Ranked) => ReactNode;
  better?: Better;
};

type Ctx = { t: ReturnType<typeof useLang>["t"]; lang: string; nf: Intl.NumberFormat; km: number; ladders: (Ladder | undefined)[] };

const missing = <CodeChip code="miss" />;

/** Builds every row. Keys are stable so verdicts can refer to rows by key, not by position. */
export function buildCompareRows({ t, lang, nf, km, ladders }: Ctx): CompareRow[] {
  const he = lang === "he";
  const month = (c: Ranked) => bandAt(c, km);
  const money = (v: number | null) => (v == null ? missing : <span className="num">{shekel(v, nf)}</span>);
  const score = (v: number | null) => (v == null ? missing : <ScoreText value={v} />);
  const plain = (v: number | null) => (v == null ? missing : <span className="num">{nf.format(v)}</span>);
  const kmLabel = nf.format(km);

  return [
    { key: "monthly", label: he ? `עלות חודשית (${kmLabel} ק"מ בשנה)` : `Monthly cost (${kmLabel} km/yr)`, better: "low",
      get: (c) => month(c)?.total ?? c.ownershipMonthly ?? null,
      show: (v) => (v == null ? missing : <span className="num text-[20px] text-go">{shekel(v, nf)}</span>) },
    { key: "price", label: he ? "מחיר מחירון" : "List price", better: "low", get: (c) => c.price, show: money },
    { key: "match", label: t.matchScore, better: "high", get: (c) => c.match, show: (v) => (v == null ? null : <Score value={v} compact />) },
    { key: "fuel", label: t.fuelLine, better: "low", get: (c) => month(c)?.fuel ?? c.fuelMonthly ?? null, show: money },
    { key: "insurance", label: t.insuranceLine, better: "low", get: (c) => month(c)?.insurance ?? c.insuranceMonthlyAmt ?? null, show: money },
    { key: "maintenance", label: t.maintenanceLine, better: "low", get: (c) => month(c)?.maintenance ?? c.maintenanceMonthly ?? null, show: money },
    { key: "depreciation", label: t.depreciationLine, better: "low", get: (c) => month(c)?.depreciation ?? c.depreciationMonthly ?? null, show: money },
    { key: "km7000", label: he ? "בנסיעה מועטה (7,000 ק\"מ)" : "Low mileage (7,000 km)", better: "low", get: (_, i) => ladders[i]?.km7000?.totalMonthly ?? null, show: money },
    { key: "km25000", label: he ? "בנסיעה רבה (25,000 ק\"מ)" : "High mileage (25,000 km)", better: "low", get: (_, i) => ladders[i]?.km25000?.totalMonthly ?? null, show: money },
    { key: "reliability", label: t.reliability, better: "high", get: (c) => c.reliability, show: score },
    { key: "safety", label: t.safety, better: "high", get: (c) => c.safety, show: score },
    { key: "economy", label: he ? "חסכוניות" : "Economy", better: "high", get: (c) => c.economy, show: score },
    { key: "comfort", label: he ? "נוחות" : "Comfort", better: "high", get: (c) => c.comfort, show: score },
    { key: "hp", label: he ? "הספק (כ\"ס)" : "Power (hp)", better: "high", get: (c) => c.spec?.hp ?? null, show: plain },
    { key: "consumption", label: he ? "צריכה (ל' ל-100 ק\"מ)" : "Consumption (L/100 km)", better: "low",
      get: (c) => (c.spec?.ev ? null : c.spec?.cons ?? null),
      show: (v, c) => (c.spec?.ev ? <span className="text-[14px] text-muted">{he ? "חשמלי" : "Electric"}</span> : v == null ? missing : <span className="num">{v}</span>) },
    { key: "seats", label: he ? "מושבים" : "Seats", better: "high", get: (c) => c.spec?.seats ?? null, show: plain },
    { key: "boot", label: he ? "תא מטען (ליטר)" : "Boot (litres)", better: "high", get: (c) => c.spec?.cargo ?? null, show: plain },
    { key: "powertrain", label: t.powertrain, get: () => null, show: (_, c) => <span>{he ? c.fuel : FUEL_EN[c.fuel] ?? c.fuel}</span> },
  ];
}
