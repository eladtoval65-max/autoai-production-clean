/**
 * "How much will THIS car cost me a month?" — the answer for a specific model without a questionnaire:
 * new (list price) and every model year since 2012 at an estimated used price (or visitors' reported prices when
 * there are enough), with the total monthly cost at the chosen yearly mileage. "פירוט" fills the calculator below.
 */
import { factsFor } from "../../../data/facts";
import type { Make, ModelLine } from "../../../data/generations";
import { card } from "../../../shared/styles";
import type { PriceYear } from "../hooks/usePriceReports";
import { POWERTRAIN_HE, shekel, THIS_YEAR } from "../model/labels";
import { estimateUsedCost } from "../model/usedCost";
import { estimatedValue, genForYear } from "../model/usedValue";

export type Pick = { genCode: string; year: number; price: number };
type Row = Pick & { label: string; source: "list" | "reported" | "estimate"; monthly: number; pt: string };

const KMS = [7000, 15000, 25000];
const FIRST = 2012;

export function rowsFor(make: Make, model: ModelLine, km: number, reported: PriceYear[]): Row[] {
  const rows: Row[] = [];
  const cost = (genCode: string, year: number, price: number) => {
    const gen = model.gens.find((g) => g.code === genCode)!;
    return estimateUsedCost({ gen, segment: model.segment, year, powertrain: gen.pt[0], askingPrice: price, kmPerYear: km, body: model.body, maintenanceItems: factsFor(make.id, model.id, gen.code).maintenance })?.total ?? 0;
  };
  const current = model.gens[model.gens.length - 1];
  if (model.status === "on_sale" && model.price && current.to == null) {
    rows.push({ label: `חדש ${THIS_YEAR}`, genCode: current.code, year: THIS_YEAR, price: model.price[0], source: "list", monthly: cost(current.code, THIS_YEAR, model.price[0]), pt: POWERTRAIN_HE[current.pt[0]] });
  }
  for (let year = THIS_YEAR - 1; year >= FIRST; year--) {
    const gen = genForYear(model, year);
    if (!gen) continue;
    const rep = reported.find((r) => r.year === year);
    const price = rep?.median ?? estimatedValue(make, model, gen, year);
    if (!price) continue;
    rows.push({ label: String(year), genCode: gen.code, year, price, source: rep ? "reported" : "estimate", monthly: cost(gen.code, year, price), pt: POWERTRAIN_HE[gen.pt[0]] });
  }
  return rows;
}

const SOURCE_HE = { list: "מחירון", reported: "מחירים שגולשים קיבלו", estimate: "הערכה" } as const;

export function MonthlyAtAGlance({ make, model, km, setKm, reported, onPick }: {
  make: Make; model: ModelLine; km: number; setKm: (km: number) => void; reported: PriceYear[]; onPick: (p: Pick) => void;
}) {
  const rows = rowsFor(make, model, km, reported);
  if (!rows.length) return null;
  return (
    <section id="cost" className={`${card} mt-8 scroll-mt-6 p-5 sm:p-6`} aria-labelledby="glance-h">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="glance-h" className="text-[1.45rem]">כמה {make.he} {model.he} עולה בחודש?</h2>
          <p className="mt-1 text-[15px] text-muted">עלות כוללת: דלק, ביטוח (הערכה), טיפולים, ירידת ערך ורישוי — לפי שנת ייצור.</p>
        </div>
        <div className="flex gap-1 rounded-full border border-line bg-white p-1" role="group" aria-label="ק״מ בשנה">
          {KMS.map((k) => <button key={k} onClick={() => setKm(k)} aria-pressed={km === k} className={`min-h-9 rounded-full px-3 text-[14px] font-bold ${km === k ? "bg-ink text-white" : "text-muted"}`}>{(k / 1000).toLocaleString("he-IL")} אלף ק״מ</button>)}
        </div>
      </div>
      <table className="mt-4 w-full text-[15px]">
        <thead><tr className="border-b border-line text-[13px] text-muted"><th className="py-2 pe-2 text-start font-semibold">שנה</th><th className="py-2 pe-2 text-start font-semibold">בחודש</th><th className="py-2 pe-2 text-start font-semibold">מחיר</th><th className="py-2"><span className="sr-only">פירוט</span></th></tr></thead>
        <tbody>
          {rows.slice(0, 15).map((r) => (
            <tr key={r.label} className="border-b border-line last:border-0">
              <td className="py-2 pe-2 font-bold">{r.label}<span className="block text-[12px] font-normal text-muted" dir="ltr">{r.genCode}</span></td>
              <td className="py-2 pe-2 text-[17px] font-bold text-go"><bdi>{shekel(r.monthly)}</bdi></td>
              <td className="py-2 pe-2"><bdi>{shekel(r.price)}</bdi><span className="block text-[12px] text-muted">{SOURCE_HE[r.source]}</span></td>
              <td className="py-2 text-end"><a href="#calc-h" onClick={() => onPick(r)} className="whitespace-nowrap text-[14px] font-bold text-go-deep">פירוט</a></td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-[12px] text-muted">מחיר יד שנייה הוא הערכה לפי מחיר ההשקה וירידת ערך ממוצעת (או מחירים שגולשים דיווחו, כשיש מספיק). המחיר בפועל תלוי בק״מ, יד ומצב — ב״פירוט״ אפשר להכניס את המחיר שקיבלתם.</p>
    </section>
  );
}
