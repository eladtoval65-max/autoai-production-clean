/**
 * Pros and cons of a used generation, built ONLY from data already on the page (Euro NCAP, real-world consumption,
 * sourced issues and maintenance items, body, segment, power). No opinions are invented; each line says what it rests on.
 * Pure function, no React.
 */
import type { Generation, ModelLine } from "../../../data/generations";
import type { GenFacts } from "../../../data/facts";
import { maxHp } from "./usedCost";

export type ProsCons = { pros: string[]; cons: string[] };

const kmPerL = (l: number) => Math.round((100 / l) * 10) / 10;

export function prosConsFor(model: ModelLine, gen: Generation, f: GenFacts): ProsCons {
  const pros: string[] = [];
  const cons: string[] = [];
  const ev = gen.pt[0] === "ev";

  // Safety — Euro NCAP stars (sourced facts first, then the generation's confirmed rating).
  const stars = f.ncap?.stars ?? gen.ncap;
  const ncapYear = f.ncap?.year ?? gen.ncapYear;
  if (stars === 5) pros.push(`5 כוכבי Euro NCAP${ncapYear ? ` (${ncapYear})` : ""}`);
  else if (stars != null && stars <= 3) cons.push(`${stars} כוכבי Euro NCAP בלבד${ncapYear ? ` (${ncapYear})` : ""}`);

  // Running cost — real-world consumption of the most economical engine.
  const engines = (f.engines ?? []).filter((e) => e.unit === (ev ? "kWh" : "L"));
  const cons100 = engines.length ? Math.min(...engines.map((e) => e.cons)) : gen.cons;
  if (ev) pros.push("עלות נסיעה נמוכה (חשמלי, בטעינה ביתית)");
  else if (cons100 <= 5.2) pros.push(`חסכוני בדלק: כ-${kmPerL(cons100)} ק"מ לליטר בפועל`);
  else if (cons100 >= 9) cons.push(`צריכת דלק גבוהה: כ-${kmPerL(cons100)} ק"מ לליטר בפועל`);
  if (gen.pt.includes("hybrid") && !ev) pros.push("הנעה היברידית: חיסכון בעיקר בנסיעה עירונית");

  // Practicality and performance.
  if (model.body === "suv7" || model.body === "mpv") pros.push("7 מקומות או יותר");
  if (maxHp(gen.hp) >= 250) pros.push(`ביצועים חזקים: עד ${maxHp(gen.hp)} כ"ס`);
  if (model.segment === "premium") cons.push("מותג פרימיום: טיפולים, חלפים וביטוח יקרים יותר");

  // Reliability signals — official recalls and costly known items.
  const recalls = (f.issues ?? []).filter((i) => i.level === "recall").length;
  const reported = (f.issues ?? []).filter((i) => i.level !== "recall").length;
  if (recalls >= 2) cons.push(`${recalls} קריאות שירות רשמיות: לוודא שבוצעו`);
  if (reported >= 3) cons.push(`${reported} בעיות מוכרות מתועדות (פירוט למטה)`);
  const risky = (f.maintenance ?? []).filter((m) => m.kind === "risk" && m.costIls[1] >= 8000);
  if (risky.length) cons.push(`תקלה יקרה אפשרית: ${risky[0].he.split(/[,:—–(]/)[0].trim()}`);
  if (gen.to != null && gen.to <= 2014) cons.push("דור ותיק: פחות מערכות בטיחות ועזר מתקדמות");

  return { pros: pros.slice(0, 4), cons: cons.slice(0, 4) };
}
