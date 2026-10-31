/** "Asking prices visitors were quoted" per year — shown only for years with enough anonymous reports. */
import { shekel } from "../model/labels";
import type { PriceYear } from "../hooks/usePriceReports";

export function PricesSeen({ years, name }: { years: PriceYear[]; name: string }) {
  if (!years.length) return null;
  return (
    <div className="mt-5 rounded-xl bg-mist p-4">
      <p className="text-[15px] font-bold">מחירים שגולשים קיבלו ל{name} יד שנייה</p>
      <ul className="mt-2 grid gap-1.5 text-[15px] sm:grid-cols-2">
        {years.slice(0, 8).map((y) => (
          <li key={y.year}><b>{y.year}:</b> מחיר אמצעי <bdi>{shekel(y.median)}</bdi> (רוב המחירים <bdi>{shekel(y.low)}</bdi>–<bdi>{shekel(y.high)}</bdi>, {y.n} דיווחים)</li>
        ))}
      </ul>
      <p className="mt-2 text-[12px] text-muted">מחירים מבוקשים שגולשים הכניסו במחשבון, בלי פרטים מזהים — לא מחירי עסקה ולא מחירון. משתנה לפי ק״מ, יד ומצב.</p>
    </div>
  );
}
