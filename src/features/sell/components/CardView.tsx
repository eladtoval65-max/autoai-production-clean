import { CostBars } from "../../browse/components/CostBars";
import { POWERTRAIN_HE, shekel } from "../../browse/model/labels";
import { estimateUsedCost, PRICES } from "../../browse/model/usedCost";
import { card } from "../../../shared/styles";
import { costInputOf, type Card } from "../model/sellCard";

/** The monthly-cost card itself (used both in the seller's preview and on the shared page). */
export function CardView({ c }: { c: Card }) {
  const cost = estimateUsedCost(costInputOf(c));
  if (!cost) return null;
  return (
    <section className={`${card} p-5 sm:p-6`} aria-label="כמה יעלה בחודש">
      <p className="text-[14px] text-muted">{c.make.he} {c.model.he} · {c.year} · {POWERTRAIN_HE[c.pt]} · מחיר מבוקש {shekel(c.price)}</p>
      <div className="mt-3 grid gap-5 sm:grid-cols-[auto_1fr] sm:items-center">
        <div>
          <p className="text-[14px] text-muted">עלות חודשית משוערת</p>
          <p className="num text-[2.6rem] leading-none text-go">{shekel(cost.total)}</p>
          <p className="mt-1 text-[13px] text-muted">לפי {new Intl.NumberFormat("he-IL").format(c.km)} ק״מ בשנה</p>
        </div>
        <CostBars cost={cost} />
      </div>
      <p className="mt-4 text-[13px] text-muted">הערכה בלבד, לפי המחיר שהמוכר ביקש: צריכה ממוצעת לדור, דלק ₪{PRICES.petrolPerL.toFixed(2)} לליטר, ביטוח לפי שווי הרכב (לא הצעת מחיר). ״כמה עולה״ לא בדק את הרכב הזה.</p>
    </section>
  );
}
