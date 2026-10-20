import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useLang } from "../../../shared/i18n";
import type { Choice } from "../types";

/**
 * One answer button in the questionnaire.
 * Multi-choice steps render a checkbox square (role="checkbox"); single-choice steps render an arrow.
 */
export function ChoiceOption({ choice, active, multi, onSelect }: { choice: Choice; active: boolean; multi: boolean; onSelect: () => void }) {
  const { lang, dir } = useLang();
  const [label, sub] = choice[lang];
  const Icon = choice.icon;
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  return (
    <button onClick={onSelect} aria-pressed={active} role={multi ? "checkbox" : undefined} aria-checked={multi ? active : undefined}
      className={`group flex h-full w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-start transition-colors ${active ? "border-go bg-go-soft" : "border-line bg-white hover:border-[#9fb0c2]"}`}>
      {choice.amount
        ? <span className="num w-[5.4rem] shrink-0 text-[22px] leading-none text-ink" dir="ltr">{choice.amount}</span>
        : Icon && <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${active ? "bg-go text-white" : "bg-mist text-go"}`}><Icon aria-hidden className="h-5 w-5" strokeWidth={1.9} /></span>}
      <span className="min-w-0 flex-1">
        <span className="block text-[16px] font-bold leading-snug">{label}</span>
        <span className="block text-[14px] leading-snug text-muted">{sub}</span>
      </span>
      {multi
        ? <span aria-hidden className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-[6px] border-2 ${active ? "border-go bg-go text-white" : "border-[#b4bcc7] bg-white"}`}>{active && <Check className="h-4 w-4" strokeWidth={3} />}</span>
        : <Arrow aria-hidden className={`h-5 w-5 shrink-0 ${active ? "text-go" : "text-[#9aa5b3] group-hover:text-go"}`} />}
    </button>
  );
}
