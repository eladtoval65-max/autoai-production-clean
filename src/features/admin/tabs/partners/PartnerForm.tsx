import { useState, type FormEvent } from "react";
import { card, field } from "../../../../shared/styles";
import { adminApi, errorText } from "../../api";
import { Field } from "../../components/Field";
import { PARTNER_TYPE } from "../../labels";
import { btnGo, btnLine } from "../../styles";
import type { Partner } from "../../types";

export type PartnerDraft = { id: number; name: string; type: string; contactName: string; phone: string; email: string; region: string; pricePerLead: string; active: boolean; notes: string; webhookUrl: string };
export const EMPTY_PARTNER: PartnerDraft = { id: 0, name: "", type: "dealer", contactName: "", phone: "", email: "", region: "", pricePerLead: "", active: true, notes: "", webhookUrl: "" };

/** Existing partner → editable draft (nulls become empty strings). */
export const draftFromPartner = (p: Partner): PartnerDraft => ({
  id: p.id, name: p.name, type: p.type, contactName: p.contactName ?? "", phone: p.phone ?? "", email: p.email ?? "", region: p.region ?? "",
  pricePerLead: p.pricePerLead == null ? "" : String(p.pricePerLead), active: Boolean(Number(p.active)), notes: p.notes ?? "", webhookUrl: p.webhookUrl ?? "",
});

/** Create / edit a partner (business that may receive consented leads). */
export function PartnerForm({ initial, onSaved, onCancel }: { initial: PartnerDraft; onSaved: () => void; onCancel: () => void }) {
  const [draft, setDraft] = useState(initial);
  const [error, setError] = useState("");
  const set = (k: keyof PartnerDraft) => (e: { target: { value: string } }) => setDraft((d) => ({ ...d, [k]: e.target.value }));
  async function submit(e: FormEvent) {
    e.preventDefault();
    const r = await adminApi("partnerSave", { partner: { ...draft, id: draft.id || undefined } });
    if (r.ok) onSaved(); else setError(errorText(r));
  }
  return (
    <form onSubmit={submit} className={`${card} mt-5 grid gap-3 p-5 sm:grid-cols-3`}>
      <Field label="שם העסק"><input required value={draft.name} onChange={set("name")} className={field} /></Field>
      <Field label="סוג"><select value={draft.type} onChange={set("type")} className={field}>{Object.entries(PARTNER_TYPE).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></Field>
      <Field label="אזור"><input value={draft.region} onChange={set("region")} className={field} /></Field>
      <Field label="איש קשר"><input value={draft.contactName} onChange={set("contactName")} className={field} /></Field>
      <Field label="טלפון"><input value={draft.phone} onChange={set("phone")} dir="ltr" className={field} /></Field>
      <Field label="מייל"><input type="email" value={draft.email} onChange={set("email")} dir="ltr" className={field} /></Field>
      <Field label="מחיר לליד (₪)"><input inputMode="numeric" value={draft.pricePerLead} onChange={set("pricePerLead")} dir="ltr" className={field} /></Field>
      <label className="flex min-h-11 items-center gap-2 self-end font-semibold"><input type="checkbox" checked={draft.active} onChange={(e) => setDraft({ ...draft, active: e.target.checked })} className="h-5 w-5 accent-[#0a7c59]" />פעיל</label>
      <Field label="הערות (תנאי הסכם, שעות)"><input value={draft.notes} onChange={set("notes")} className={field} /></Field>
      <div className="sm:col-span-2">
        <Field label="שליחה אוטומטית (Webhook, לא חובה)"><input type="url" value={draft.webhookUrl} onChange={set("webhookUrl")} placeholder="https://…" dir="ltr" className={field} /></Field>
        <p className="mt-1 text-[13px] text-muted">כתובת https שהשותף נותן (מה-CRM שלו, Zapier או Make). כל ליד שמועבר אליו בהסכמה יישלח לשם מיד, עם תעודת ההסכמה.</p>
      </div>
      {error && <p role="alert" className="font-semibold text-alert sm:col-span-3">{error}</p>}
      <div className="flex gap-2 sm:col-span-3"><button type="submit" className={btnGo}>שמירה</button><button type="button" onClick={onCancel} className={btnLine}>ביטול</button></div>
    </form>
  );
}
