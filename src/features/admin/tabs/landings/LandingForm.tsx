import { useState, type FormEvent } from "react";
import { card, field } from "../../../../shared/styles";
import { adminApi, errorText } from "../../api";
import { Field } from "../../components/Field";
import { LEAD_TYPE } from "../../labels";
import { btnGo, btnLine, textarea } from "../../styles";
import type { LandingRow } from "../../types";

export type LandingDraft = { slug: string; title: string; subtitle: string; bullets: string; ctaText: string; leadType: string; active: boolean };
export const EMPTY_LANDING: LandingDraft = { slug: "", title: "", subtitle: "", bullets: "", ctaText: "", leadType: "vehicle", active: true };

/** Saved row → draft. Bullets are stored as a JSON array and edited one per line. */
export function draftFromLanding(r: LandingRow): LandingDraft {
  let bullets: string[] = [];
  try { bullets = JSON.parse(r.bullets || "[]"); } catch { /* malformed → empty */ }
  return { slug: r.slug, title: r.title, subtitle: r.subtitle ?? "", bullets: bullets.join("\n"), ctaText: r.ctaText ?? "", leadType: r.leadType, active: Boolean(Number(r.active)) };
}

/** Create / edit a campaign landing page. The slug (URL) is fixed after creation. */
export function LandingForm({ initial, isNew, onSaved, onCancel }: { initial: LandingDraft; isNew: boolean; onSaved: () => void; onCancel: () => void }) {
  const [draft, setDraft] = useState(initial);
  const [error, setError] = useState("");
  const set = (k: keyof LandingDraft) => (e: { target: { value: string } }) => setDraft((d) => ({ ...d, [k]: e.target.value }));
  async function submit(e: FormEvent) {
    e.preventDefault();
    const bullets = draft.bullets.split("\n").map((b) => b.trim()).filter(Boolean);
    const r = await adminApi("landingSave", { landing: { ...draft, bullets } });
    if (r.ok) onSaved(); else setError(errorText(r));
  }
  return (
    <form onSubmit={submit} className={`${card} mt-5 grid gap-3 p-5 lg:grid-cols-2`}>
      <Field label="כתובת (אנגלית, אותיות קטנות ומקפים)"><input required pattern="[a-z0-9\-]{2,60}" disabled={!isNew} value={draft.slug} onChange={set("slug")} placeholder="hybrid-family" dir="ltr" className={field} /></Field>
      <Field label="סוג הפנייה שייפתח בטופס"><select value={draft.leadType} onChange={set("leadType")} className={field}>{Object.entries(LEAD_TYPE).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></Field>
      <Field label="כותרת ראשית"><input required minLength={3} maxLength={160} value={draft.title} onChange={set("title")} placeholder="רכב משפחתי היברידי שעולה פחות בחודש" className={field} /></Field>
      <Field label="טקסט על הכפתור"><input maxLength={80} value={draft.ctaText} onChange={set("ctaText")} placeholder="רוצים שנחזור אליכם?" className={field} /></Field>
      <Field label="תת-כותרת"><textarea maxLength={400} rows={3} value={draft.subtitle} onChange={set("subtitle")} className={textarea} /></Field>
      <Field label="נקודות (שורה לכל נקודה, עד 6)"><textarea rows={3} value={draft.bullets} onChange={set("bullets")} className={textarea} /></Field>
      <label className="flex min-h-11 items-center gap-2 font-semibold"><input type="checkbox" checked={draft.active} onChange={(e) => setDraft({ ...draft, active: e.target.checked })} className="h-5 w-5 accent-[#0a7c59]" />הדף פעיל</label>
      <p className="self-center text-[13px] text-muted">אין להבטיח מחירים או הנחות שלא אומתו. ביטוח מוצג תמיד כהערכה בלבד.</p>
      {error && <p role="alert" className="font-semibold text-alert lg:col-span-2">{error}</p>}
      <div className="flex gap-2 lg:col-span-2"><button type="submit" className={btnGo}>שמירה ופרסום</button><button type="button" onClick={onCancel} className={btnLine}>ביטול</button></div>
    </form>
  );
}
