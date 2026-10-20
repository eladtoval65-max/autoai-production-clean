import { AlarmClock } from "lucide-react";
import { when } from "../../../format";

/** Date `days` from now at 10:00 local time (a sensible call-back hour). */
function inDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(10, 0, 0, 0);
  return d.toISOString();
}

const QUICK: [number, string][] = [[1, "מחר"], [3, "בעוד 3 ימים"], [7, "בעוד שבוע"]];

/** Follow-up reminder: quick buttons, the current reminder, and cancel. */
export function FollowUp({ current, onSet }: { current: string | null; onSet: (iso: string | null, okText: string) => void }) {
  return (
    <section className="rounded-2xl bg-mist p-4">
      <h3 className="flex items-center gap-2 text-[17px]"><AlarmClock className="h-4 w-4" />תזכורת לחזור</h3>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {QUICK.map(([d, label]) => (
          <button key={d} onClick={() => onSet(inDays(d), "נקבעה תזכורת")} className="min-h-10 rounded-full border border-line bg-white px-3.5 text-[14px] font-bold hover:border-ink">{label}</button>
        ))}
        {current && (
          <>
            <span className="text-[14px] text-muted">נקבע: <b className="text-ink">{when(current)}</b></span>
            <button onClick={() => onSet(null, "התזכורת בוטלה")} className="text-[14px] font-bold text-muted underline">ביטול</button>
          </>
        )}
      </div>
    </section>
  );
}
