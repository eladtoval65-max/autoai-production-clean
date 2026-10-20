/**
 * /sell/card?… — the public card a seller shares in their ad. Buyers land here, see the monthly estimate,
 * and can compare alternatives or ask us for help (consented lead).
 */
import { useEffect, useState } from "react";
import { Link, useSearch } from "wouter";
import { MAKES } from "../../data/generations";
import LeadRequestModal from "../leads/LeadRequestModal";
import { CardView } from "./components/CardView";
import { PageShell as SellShell } from "../../shared/ui/PageShell";
import { decodeCard } from "./model/sellCard";

export default function SellCardPage() {
  const search = useSearch();
  const c = decodeCard(search, MAKES);
  const [lead, setLead] = useState(false);
  const name = c ? `${c.make.he} ${c.model.he} ${c.year}` : "";
  useEffect(() => { document.title = c ? `${name} — כמה יעלה לך בחודש | כמה עולה` : "כרטיס לא נמצא | כמה עולה"; }, [c, name]);

  if (!c) return <SellShell><h1 className="text-2xl">הכרטיס לא תקין או לא שלם</h1><Link href="/sell" className="mt-4 inline-block font-bold text-go-deep">ליצירת כרטיס חדש</Link></SellShell>;
  return (
    <SellShell>
      <h1 className="text-[clamp(1.8rem,4vw,2.6rem)] leading-tight">{name}: כמה יעלה לך בחודש?</h1>
      <p className="mt-2 text-[16px] text-muted">המוכר שיתף את הכרטיס הזה מתוך ״כמה עולה״. המספרים מחושבים לפי המחיר שהוא ביקש.</p>
      <div className="mt-6"><CardView c={c} /></div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href={`/cars/${c.make.id}/${c.model.id}`} className="inline-flex min-h-12 items-center rounded-full border border-line bg-white px-6 text-[16px] font-bold text-ink no-underline hover:border-ink">מה לבדוק ב{c.model.he} הזה</Link>
        <Link href="/" className="inline-flex min-h-12 items-center rounded-full border border-line bg-white px-6 text-[16px] font-bold text-ink no-underline hover:border-ink">השוואה לרכבים אחרים</Link>
        <button onClick={() => setLead(true)} className="inline-flex min-h-12 items-center rounded-full bg-go px-6 text-[16px] font-bold text-white hover:bg-go-deep">רוצים שנעזור לכם להחליט?</button>
      </div>
      <p className="mt-6 text-[14px] text-muted">לפני שמשלמים: לבדוק שרישיון הרכב על שם המוכר, שמספר השלדה תואם, ולעשות בדיקה במכון מורשה.</p>
      {lead && <LeadRequestModal vehicle={{ id: `card-${c.make.id}-${c.model.id}`, make: name, match: 0 }} sourcePage="sell_card" defaultType="used_car" onClose={() => setLead(false)} />}
    </SellShell>
  );
}
