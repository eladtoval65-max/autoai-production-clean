import { shekel } from "../model/labels";
import type { UsedCost } from "../model/usedCost";

/** Breakdown bars: each component's share of the monthly total. */
export function CostBars({ cost }: { cost: UsedCost }) {
  const rows: [string, number][] = [["דלק / חשמל", cost.fuel], ["ירידת ערך", cost.depreciation], ["ביטוח (הערכה)", cost.insurance], ["טיפולים ותיקונים", cost.maintenance], ["רישוי", cost.licence]];
  return (
    <ul className="space-y-1.5">
      {rows.map(([k, v]) => (
        <li key={k} className="grid grid-cols-[120px_1fr_72px] items-center gap-2 text-[14px]">
          <span>{k}</span>
          <span className="h-2.5 rounded-full bg-mist"><span className="block h-2.5 rounded-full bg-go" style={{ width: `${(v / cost.total) * 100}%` }} /></span>
          <span className="num text-end">{shekel(v)}</span>
        </li>
      ))}
    </ul>
  );
}

