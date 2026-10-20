/**
 * Side-by-side monthly cost table for two cars. The lower value in each row is marked (bold + "✓ זול יותר"),
 * never by colour alone. All numbers are estimates except licensing.
 */
import { shekel } from "../../browse/model/labels";
import type { Pair } from "../model/pairs";
import { hebrewName, monthlyAt } from "../model/pairs";

const ROWS: [string, "fuel" | "insurance" | "maintenance" | "depreciation" | "licence" | "total"][] = [
  ["דלק / חשמל", "fuel"], ["ביטוח (הערכה)", "insurance"], ["טיפולים ותיקונים", "maintenance"], ["ירידת ערך", "depreciation"], ["רישוי", "licence"], ["סה״כ בחודש", "total"],
];

function Cell({ value, other }: { value: number; other: number }) {
  const better = value < other;
  return <td className={`p-2.5 text-start num sm:p-3 ${better ? "font-bold text-go-deep" : ""}`}><bdi>{shekel(value)}</bdi>{better && <span className="block text-[12px] font-semibold">✓ זול יותר</span>}</td>;
}

export function CompareTable({ pair, km }: { pair: Pair; km: number }) {
  const [a, b] = [monthlyAt(pair.a, km), monthlyAt(pair.b, km)];
  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-white" tabIndex={0} role="region" aria-label="טבלת השוואת עלויות">
      <table className="w-full text-[14px] sm:text-[15px]">
        <thead><tr className="border-b border-line text-[14px] text-muted">
          <th className="p-3 text-start font-semibold"> </th>
          <th className="p-3 text-start font-semibold text-ink">{hebrewName(pair.a)}</th>
          <th className="p-3 text-start font-semibold text-ink">{hebrewName(pair.b)}</th>
        </tr></thead>
        <tbody>
          <tr className="border-b border-line"><th scope="row" className="p-3 text-start font-semibold">מחיר מחירון</th><td className="p-2.5 num sm:p-3"><bdi>{shekel(pair.a.price)}</bdi></td><td className="p-2.5 num sm:p-3"><bdi>{shekel(pair.b.price)}</bdi></td></tr>
          {ROWS.map(([label, key]) => (
            <tr key={key} className={`border-b border-line last:border-0 ${key === "total" ? "bg-mist text-[16px]" : ""}`}>
              <th scope="row" className="p-2.5 text-start font-semibold sm:p-3">{label}</th>
              <Cell value={a[key]} other={b[key]} /><Cell value={b[key]} other={a[key]} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
