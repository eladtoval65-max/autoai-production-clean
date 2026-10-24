import { Wrench } from "lucide-react";
import { MAINTENANCE_KIND_HE, type MaintenanceItem } from "../../../../data/facts";
import { numberHe, shekel } from "../../model/labels";
import { SourceLink } from "./SourceLink";

const when = (it: MaintenanceItem) => [it.intervalKm && `כל ${numberHe(it.intervalKm)} ק"מ`, it.intervalYears && `כל ${it.intervalYears} שנים`].filter(Boolean).join(" או ");

/** Costly maintenance items of a generation with sourced price ranges — what to budget for, and what to ask the seller. */
export function MaintenanceList({ items }: { items: MaintenanceItem[] }) {
  if (!items.length) return null;
  return (
    <div className="mt-4 rounded-xl bg-mist/60 p-4">
      <p className="flex items-center gap-2 text-[15px] font-bold"><Wrench className="h-4 w-4" aria-hidden />טיפולים ותיקונים יקרים שכדאי לתקצב</p>
      <ul className="mt-3 space-y-2.5">
        {items.map((it) => (
          <li key={it.he} className="text-[15px] leading-relaxed">
            <span className="me-2 inline-block rounded-full bg-white px-2 py-0.5 text-[12px] font-bold">{MAINTENANCE_KIND_HE[it.kind]}</span>
            {it.he}
            {it.scope && <span className="text-muted"> ({it.scope})</span>}
            {" · "}<bdi className="font-semibold">{it.costIls[0] === it.costIls[1] ? shekel(it.costIls[0]) : `${shekel(it.costIls[0])} עד ${shekel(it.costIls[1])}`}</bdi>
            {when(it) && <span className="text-muted"> · {when(it)}</span>}{" "}
            <SourceLink source={it.source} />
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[12px] text-muted">טווחי מחיר משוערים לפי המקור (מוסך מורשה / מחירון יבואן כשיש). כדאי לשאול את המוכר אם הטיפול כבר בוצע ולבקש קבלה. טיפולים מתוכננים ובלאי צפוי נכללים בחישוב העלות החודשית; תקלות אפשריות לא.</p>
    </div>
  );
}
