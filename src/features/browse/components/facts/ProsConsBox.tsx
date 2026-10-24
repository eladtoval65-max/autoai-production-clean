import { Check, Minus } from "lucide-react";
import type { ProsCons } from "../../model/prosCons";

/** Pros / cons derived from the sourced data on the page (see model/prosCons.ts). */
export function ProsConsBox({ pc }: { pc: ProsCons }) {
  if (!pc.pros.length && !pc.cons.length) return null;
  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      {pc.pros.length > 0 && (
        <div className="rounded-xl bg-[#eef8f1] p-4">
          <p className="text-[15px] font-bold">יתרונות</p>
          <ul className="mt-2 space-y-1.5 text-[15px]">{pc.pros.map((p) => <li key={p} className="flex gap-2"><Check className="mt-1 h-4 w-4 shrink-0 text-go" aria-hidden />{p}</li>)}</ul>
        </div>
      )}
      {pc.cons.length > 0 && (
        <div className="rounded-xl bg-[#fdf1ef] p-4">
          <p className="text-[15px] font-bold">חסרונות</p>
          <ul className="mt-2 space-y-1.5 text-[15px]">{pc.cons.map((c) => <li key={c} className="flex gap-2"><Minus className="mt-1 h-4 w-4 shrink-0 text-alert" aria-hidden />{c}</li>)}</ul>
        </div>
      )}
      <p className="text-[12px] text-muted sm:col-span-2">היתרונות והחסרונות מחושבים מהנתונים שבעמוד (Euro NCAP, צריכה בפועל, קריאות שירות ובעיות מתועדות) — לא חוות דעת.</p>
    </div>
  );
}
