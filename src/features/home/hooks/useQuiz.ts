/**
 * Questionnaire state machine: mode (quick/full), current step and answers.
 * Single-choice steps auto-advance; multi-choice steps advance on "Continue".
 */
import { useState } from "react";
import type { Answers, MultiKey, QuizMode } from "../types";
import { EMPTY_ANSWERS, FULL_STEPS, KM_FOR_BAND, QUICK_STEPS } from "../model/questions";
import { track } from "../model/tracking";

export function useQuiz() {
  const [mode, setMode] = useState<QuizMode>("full");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(EMPTY_ANSWERS);

  const order = mode === "quick" ? QUICK_STEPS : FULL_STEPS;
  const done = step >= order.length;
  /** Results are meaningful once the required multi-choice answers exist. */
  const complete = done && answers.use.length > 0 && answers.fuel.length > 0;

  const advance = () => setStep((s) => Math.min(s + 1, order.length));

  /** Budget or yearly-km answer; moves on after a short beat so the selection is visible. */
  function chooseSingle(key: "condition" | "budget" | "annualKm", value: string | number) {
    track(`answer_${key}`);
    setAnswers((prev) => {
      if (key === "annualKm") {
        const band = value as Answers["annualKmBand"];
        return { ...prev, annualKmBand: band, annualKm: KM_FOR_BAND[band] };
      }
      if (key === "condition") {
        // Keep the budget sensible for the new condition (used budgets are lower).
        const condition = value as Answers["condition"];
        const budget = condition === "used" ? Math.min(prev.budget, 90000) : condition === "new" ? Math.max(prev.budget, 145000) : prev.budget;
        return { ...prev, condition, budget };
      }
      return { ...prev, budget: Number(value) };
    });
    window.setTimeout(advance, 180);
  }

  /** Toggle one option of a multi-choice step. "Open to anything" (fuel=any) is exclusive with specific fuels. */
  function toggleMulti(key: MultiKey, value: string) {
    track(`answer_${key}`);
    setAnswers((prev) => {
      const cur = prev[key];
      let next = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value];
      if (key === "fuel") next = value === "any" ? (cur.includes("any") ? [] : ["any"]) : next.filter((v) => v !== "any");
      return { ...prev, [key]: next };
    });
  }

  /** "Continue" on a multi-choice step. Quick mode skips the priority question, so default it to reliability. */
  function continueMulti(key: MultiKey) {
    if (mode === "quick" && key === "use") setAnswers((p) => (p.priority.length ? p : { ...p, priority: ["reliable"] }));
    advance();
  }

  function switchMode(m: QuizMode) {
    track(`mode_${m}`);
    setMode(m);
    setStep((s) => Math.min(s, (m === "quick" ? QUICK_STEPS : FULL_STEPS).length));
  }

  function reset() { track("quiz_reset"); setStep(0); setAnswers(EMPTY_ANSWERS); }

  return { mode, step, setStep, answers, setAnswers, order, done, complete, chooseSingle, toggleMulti, continueMulti, switchMode, reset };
}
export type Quiz = ReturnType<typeof useQuiz>;
