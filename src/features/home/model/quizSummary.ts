/**
 * One readable Hebrew line of the visitor's questionnaire answers, attached to their lead (only if they send one).
 * The partner then knows condition, driver, km, fuel and use without the form asking again — more lead quality, zero extra fields.
 */
import { CHOICES } from "./questions";
import type { Answers, StepKey } from "../types";

const label = (step: StepKey, value: string | number) => CHOICES[step]?.find((c) => String(c.value) === String(value))?.he[0];

export function quizSummary(a: Answers): string {
  const parts = [
    label("condition", a.condition),
    label("driver", a.driver),
    `${a.annualKm.toLocaleString("he-IL")} ק״מ בשנה`,
    a.fuel.map((f) => label("fuel", f)).filter(Boolean).join(", ") || undefined,
    a.use.map((u) => label("use", u)).filter(Boolean).join(", ") || undefined,
  ];
  return parts.filter(Boolean).join(" · ").slice(0, 300);
}
