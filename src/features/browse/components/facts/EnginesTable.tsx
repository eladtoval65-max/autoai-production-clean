import type { EngineFact } from "../../../../data/facts";
import { monthlyEnergy } from "../../model/energy";
import { SourceLink } from "./SourceLink";

const KM = 15000;
const consText = (e: EngineFact) =>
  e.unit === "kWh" ? `${e.cons} קוט״ש/100 ק״מ` : `${e.cons} ל׳/100 ק״מ (${Math.round((100 / e.cons) * 10) / 10} ק״מ לליטר)`;

/** Every engine sold in Israel for a generation: real-world consumption and what the fuel/electricity costs per month. */
export function EnginesTable({ engines }: { engines: EngineFact[] }) {
  return (
    <div className="relative mt-4 overflow-x-auto" role="region" aria-label="מנועים וצריכה" tabIndex={0}>
      <table className="w-full min-w-[30rem] text-start text-[14px]">
        <thead className="text-[13px] text-muted">
          <tr><th className="pb-1.5 text-start font-semibold">מנוע</th><th className="pb-1.5 text-start font-semibold">כ״ס</th><th className="pb-1.5 text-start font-semibold">צריכה בפועל</th><th className="pb-1.5 text-start font-semibold">דלק/חשמל בחודש*</th><th /></tr>
        </thead>
        <tbody>
          {engines.map((e) => (
            <tr key={e.name} className="border-t border-line">
              <td className="py-2 font-semibold">{e.name}</td>
              <td className="py-2"><bdi>{e.hp ?? "—"}</bdi></td>
              <td className="py-2">{consText(e)}</td>
              <td className="py-2 font-bold text-go"><bdi>₪{monthlyEnergy(e.cons, e.unit, KM, e.pt).toLocaleString("he-IL")}</bdi></td>
              <td className="py-2 text-end"><SourceLink source={e.source} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-1.5 text-[12px] text-muted">* ב־15,000 ק״מ בשנה, לפי מחיר הדלק והחשמל הרשמי היום. צריכה בפועל לפי ממוצעי נהגים, לא נתון היצרן.</p>
    </div>
  );
}
