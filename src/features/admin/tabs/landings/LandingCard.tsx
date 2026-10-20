import { ExternalLink } from "lucide-react";
import { card } from "../../../../shared/styles";
import { num } from "../../format";
import { btnLine } from "../../styles";
import type { LandingRow } from "../../types";

/** Visits → leads conversion as a percentage with one decimal, or null with no visits yet. */
const conversion = (r: LandingRow) => (Number(r.visits) > 0 ? Math.round((Number(r.leadCount) / Number(r.visits)) * 1000) / 10 : null);

/** Ready-to-paste ad link that tags leads with the campaign (Facebook by default; change utm_source for Google). */
const campaignLink = (slug: string) => `${window.location.origin}/go/${slug}?utm_source=facebook&utm_medium=cpc&utm_campaign=${slug}`;

/** One landing page: title, URL, visits / leads / conversion, and edit / view / copy-link actions. */
export function LandingCard({ row, onEdit }: { row: LandingRow; onEdit: () => void }) {
  const conv = conversion(row);
  const stats: [string, string][] = [["כניסות", num(Number(row.visits))], ["לידים", num(Number(row.leadCount))], ["המרה", conv == null ? "—" : `${conv}%`]];
  return (
    <article className={`${card} p-5`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0"><h2 className="text-lg">{row.title}</h2><p className="text-[14px] text-muted" dir="ltr">/go/{row.slug}</p></div>
        {!Number(row.active) && <span className="rounded-full bg-mist px-2.5 py-0.5 text-[13px] font-bold text-muted">כבוי</span>}
      </div>
      <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
        {stats.map(([k, v]) => <div key={k} className="rounded-xl bg-mist p-2"><dt className="text-[12px] text-muted">{k}</dt><dd className="num text-xl">{v}</dd></div>)}
      </dl>
      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={onEdit} className={btnLine}>עריכה</button>
        <a href={`/go/${row.slug}`} target="_blank" rel="noopener noreferrer" className={btnLine}><ExternalLink className="h-4 w-4" />צפייה</a>
        <button onClick={() => navigator.clipboard?.writeText(campaignLink(row.slug))} className={btnLine}>העתקת קישור לקמפיין</button>
      </div>
    </article>
  );
}
