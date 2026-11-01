/**
 * Exact budget, for when the brackets are too coarse ("I want under ₪50K" / "exactly ₪135K").
 * A slider plus a typed amount; "Continue" saves it and moves to the next question.
 */
import { useState } from "react";
import type { Answers } from "../types";

const RANGE = { used: [15000, 250000], new: [80000, 450000], any: [15000, 450000] } as const;

export function BudgetSlider({ condition, budget, onChoose }: { condition: Answers["condition"]; budget: number; onChoose: (value: number) => void }) {
  const [min, max] = RANGE[condition];
  const [value, setValue] = useState(Math.min(max, Math.max(min, budget)));
  const nf = new Intl.NumberFormat("he-IL");
  return (
    <div className="mt-4 rounded-2xl border border-line bg-white p-4">
      <label htmlFor="budget-range" className="text-[15px] font-bold">או סכום מדויק: <bdi className="text-go">₪{nf.format(value)}</bdi></label>
      <input id="budget-range" type="range" min={min} max={max} step={5000} value={value} onChange={(e) => setValue(Number(e.target.value))}
        className="mt-3 w-full accent-[var(--color-go)]" dir="ltr" aria-valuetext={`₪${nf.format(value)}`} />
      <div className="mt-1 flex justify-between text-[13px] text-muted" dir="ltr"><span>₪{nf.format(min)}</span><span>₪{nf.format(max)}</span></div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <label className="flex-1 text-[14px] font-semibold text-muted"><span className="sr-only">תקציב בש״ח</span>
          <input inputMode="numeric" dir="ltr" value={nf.format(value)} onChange={(e) => { const n = Number(e.target.value.replace(/[^\d]/g, "")); if (n) setValue(Math.min(3000000, n)); }}
            className="min-h-11 w-full rounded-full border border-line px-4 text-[16px] text-ink outline-none focus:border-go" /></label>
        <button type="button" onClick={() => onChoose(value)} className="min-h-11 rounded-full bg-go px-6 text-[15px] font-bold text-white hover:bg-go-deep">המשך עם ₪{nf.format(value)}</button>
      </div>
    </div>
  );
}
