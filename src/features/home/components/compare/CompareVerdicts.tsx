import { shekel, useLang } from "../../../../shared/i18n";
import { shortName } from "../../../../shared/format";
import { card } from "../../../../shared/styles";
import type { Ranked } from "../../types";

/** Headline cards ("cheapest per month", "safest"…) and the monthly saving sentence. */
export function CompareVerdicts({ cars, winnerByKey, gap }: { cars: Ranked[]; winnerByKey: Record<string, number>; gap: number }) {
  const { lang, nf } = useLang();
  const he = lang === "he";
  const verdicts: [string, number][] = [
    [he ? "הכי זול לחודש" : "Cheapest per month", winnerByKey.monthly],
    [he ? "הכי אמין" : "Most reliable", winnerByKey.reliability],
    [he ? "הכי בטוח" : "Safest", winnerByKey.safety],
    [he ? "הכי מתאים לך" : "Best match for you", winnerByKey.match],
  ];
  const cheapest = winnerByKey.monthly;
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {verdicts.map(([title, i]) => (
          <div key={title} className={`${card} p-4`}>
            <p className="text-[14px] text-muted">{title}</p>
            <p className="mt-1 font-display text-[1.15rem] font-bold leading-tight">{i >= 0 ? shortName(cars[i].make) : he ? "תיקו" : "Tie"}</p>
          </div>
        ))}
      </div>
      {gap > 0 && cheapest >= 0 && (
        <p className="rounded-xl bg-go-soft px-4 py-3 text-[16px] font-semibold text-go-deep">
          {he
            ? `${shortName(cars[cheapest].make)} חוסך עד ${shekel(gap, nf)} בחודש, כ-${shekel(gap * 36, nf)} בשלוש שנים.`
            : `${shortName(cars[cheapest].make)} saves up to ${shekel(gap, nf)} a month, about ${shekel(gap * 36, nf)} over three years.`}
        </p>
      )}
    </>
  );
}
