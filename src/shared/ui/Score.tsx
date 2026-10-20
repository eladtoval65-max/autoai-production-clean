import { useLang } from "../i18n";
import { ten } from "../format";
import { Stars } from "./Stars";

/** Overall match score: big "8.3/10" + stars + a plain word ("very good"). Input is 0–100. */
export function Score({ value, compact }: { value: number; compact?: boolean }) {
  const { t } = useLang();
  const v = ten(value);
  return (
    <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-0.5" aria-label={`${t.matchScore}: ${v.toFixed(1)} ${t.scoreOf10}, ${t.scoreWord(v)}`}>
      <span dir="ltr" className={`num leading-none ${compact ? "text-[20px]" : "text-[24px]"}`} aria-hidden>
        {v.toFixed(1)}<span className="text-[13px] font-semibold text-muted">/10</span>
      </span>
      <Stars value={v} size={compact ? 14 : 17} />
      <span className="text-[14px] font-bold text-ink" aria-hidden>{t.scoreWord(v)}</span>
    </span>
  );
}

/** Inline score for tables: "8.3/10 very good" without stars. Input is 0–100. */
export function ScoreText({ value }: { value: number }) {
  const { t } = useLang();
  const v = ten(value);
  return (
    <span>
      <bdi dir="ltr"><span className="num text-[17px]">{v.toFixed(1)}</span><span className="text-[13px] text-muted">/10</span></bdi>{" "}
      <span className="text-[14px] font-semibold text-muted">{t.scoreWord(v)}</span>
    </span>
  );
}
