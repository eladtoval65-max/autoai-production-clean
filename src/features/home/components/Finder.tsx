import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { useLang } from "../../../shared/i18n";
import { btnPrimary, card } from "../../../shared/styles";
import type { Quiz } from "../hooks/useQuiz";
import { CHOICES, MULTI_STEPS } from "../model/questions";
import type { MultiKey, StepKey } from "../types";
import { ChoiceOption } from "./ChoiceOption";

/** Header row: "step 2 of 5", quick/full switch, restart button, and the progress bar. */
function FinderProgress({ quiz }: { quiz: Quiz }) {
  const { t } = useLang();
  const { step, order, done, mode, switchMode, reset } = quiz;
  const pct = Math.round((Math.min(step, order.length) / order.length) * 100);
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-[15px] font-bold text-muted">{done ? t.doneTitle : t.stepOf(step + 1, order.length)}</span>
        <div className="flex items-center gap-2">
          <div role="group" aria-label={t.modeLabel} className="flex rounded-full bg-mist p-0.5 text-[14px] font-bold">
            {(["quick", "full"] as const).map((m) => (
              <button key={m} onClick={() => switchMode(m)} aria-pressed={mode === m}
                className={`min-h-8 rounded-full px-3 ${mode === m ? "bg-white text-ink shadow-[var(--shadow-card)]" : "text-muted hover:text-ink"}`}>{m === "quick" ? t.quick : t.full}</button>
            ))}
          </div>
          <button onClick={reset} aria-label={t.restart} title={t.restart} className="flex h-9 w-9 items-center justify-center rounded-full border border-line hover:border-ink"><RotateCcw className="h-4 w-4" /></button>
        </div>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-mist" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={t.stepOf(Math.min(step + 1, order.length), order.length)}>
        <div className="h-full rounded-full bg-go transition-[width] duration-500 ease-out" style={{ width: `${pct}%` }} />
      </div>
    </>
  );
}

/** The current question with its options, back button and (for multi-choice) the Continue button. */
function FinderQuestion({ quiz, stepKey }: { quiz: Quiz; stepKey: StepKey }) {
  const { t, dir } = useLang();
  const { answers, step, setStep, chooseSingle, toggleMulti, continueMulti } = quiz;
  const multi = MULTI_STEPS.has(stepKey);
  const titles: Record<StepKey, string> = { budget: t.qBudget, use: t.qUse, priority: t.qPriority, fuel: t.qFuel, annualKm: t.qKm };
  const hint = multi ? t.pickMany : stepKey === "budget" ? t.hintBudget : stepKey === "annualKm" ? t.hintKm : t.hintDefault;
  const selected: string[] = multi ? answers[stepKey as MultiKey] : [String(stepKey === "annualKm" ? answers.annualKmBand : answers.budget)];
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const options = CHOICES[stepKey];

  return (
    <div key={stepKey} className="swap">
      <h2 className="mt-5 text-[clamp(1.35rem,2.3vw,1.7rem)] leading-tight">{titles[stepKey]}</h2>
      <p className="mt-1 text-[15px] text-muted">{hint}</p>
      <ul className={`mt-4 grid gap-2.5 ${options.length === 4 ? "sm:grid-cols-2" : ""}`}>
        {options.map((c) => {
          const v = String(c.value);
          return (
            <li key={v}>
              <ChoiceOption choice={c} multi={multi} active={selected.includes(v)}
                onSelect={() => (multi ? toggleMulti(stepKey as MultiKey, v) : chooseSingle(stepKey as "budget" | "annualKm", c.value))} />
            </li>
          );
        })}
      </ul>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        {step > 0 ? <button onClick={() => setStep(step - 1)} className="min-h-11 rounded-full px-3 text-[15px] font-bold text-muted hover:text-ink">{t.back}</button> : <span />}
        {multi && (
          <div className="flex items-center gap-3">
            {selected.length > 0 && <span className="text-[14px] font-semibold text-muted">{t.picked(selected.length)}</span>}
            <button onClick={() => continueMulti(stepKey as MultiKey)} disabled={!selected.length} className={`${btnPrimary} min-h-12 px-7 text-[16px] disabled:opacity-40`}>
              {t.next}<Arrow className="h-5 w-5" aria-hidden />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/** Final state: short summary and the "show my matches" button. */
function FinderDone({ quiz, onResults }: { quiz: Quiz; onResults: () => void }) {
  const { t, dir } = useLang();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  return (
    <div className="swap mt-5">
      <p className="max-w-[52ch] text-[17px] text-muted">{t.doneSub}</p>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button onClick={onResults} disabled={!quiz.complete} className={`${btnPrimary} min-h-12 px-7 text-[17px] disabled:opacity-40`}>{t.showMatches}<Arrow className="h-5 w-5" aria-hidden /></button>
        <button onClick={() => quiz.setStep(quiz.order.length - 1)} className="min-h-11 rounded-full px-3 text-[15px] font-bold text-muted hover:text-ink">{t.back}</button>
      </div>
    </div>
  );
}

/** The questionnaire card in the hero. */
export function Finder({ quiz, onResults }: { quiz: Quiz; onResults: () => void }) {
  const stepKey = quiz.order[Math.min(quiz.step, quiz.order.length - 1)];
  return (
    <div className={`${card} mt-8 p-5 sm:p-6`}>
      <FinderProgress quiz={quiz} />
      {quiz.done ? <FinderDone quiz={quiz} onResults={onResults} /> : <FinderQuestion quiz={quiz} stepKey={stepKey} />}
    </div>
  );
}
