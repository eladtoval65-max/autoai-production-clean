/**
 * Lead call-to-action on /cars/:make/:model. These pages bring search traffic ("טויוטה קורולה 2018 כמה עולה"),
 * so they get the same consented lead form as the home page: used-car help by default, new-car if it's on sale.
 */
import { useState } from "react";
import type { Make, ModelLine } from "../../../data/generations";
import LeadRequestModal from "../../leads/LeadRequestModal";
import { sendEvent } from "../../../shared/analytics";

export function ModelLeadCta({ make, model }: { make: Make; model: ModelLine }) {
  const [open, setOpen] = useState(false);
  const onSale = model.status === "on_sale";
  const name = `${make.he} ${model.he}`;
  function start() { sendEvent("lead_open", "model_page", false); setOpen(true); }
  return (
    <section className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-ink p-6 text-white">
      <div>
        <h2 className="text-[1.4rem]">מתלבטים לגבי {name}?</h2>
        <p className="mt-1 text-[15px] text-[#c3cbd6]">נחזור אליכם לעזור עם {onSale ? "חדש או יד שנייה" : "רכב יד שנייה"}: מה לבדוק, כמה זה יעלה בחודש, ומה האלטרנטיבות.</p>
      </div>
      <button onClick={start} className="inline-flex min-h-12 items-center rounded-full bg-[#5fd3a7] px-6 text-[16px] font-bold text-ink hover:bg-[#7fe0bb]">רוצים שנחזור אליכם?</button>
      {open && (
        <LeadRequestModal vehicle={{ id: `model-${make.id}-${model.id}`, make: name, match: 0 }} sourcePage="model_page"
          defaultType={onSale ? "vehicle" : "used_car"} onClose={() => setOpen(false)} />
      )}
    </section>
  );
}
