import { useState, type FormEvent } from "react";
import { field } from "../../../../../shared/styles";
import { Field } from "../../../components/Field";
import { when } from "../../../format";
import { PARTNER_TYPE } from "../../../labels";
import { btnGo, btnLine } from "../../../styles";
import type { Lead, Partner } from "../../../types";

type Run = (action: string, body: Record<string, unknown>, okText: string) => Promise<boolean>;

/** Lead already handed to a partner: consent record, lead price, paid toggle, cancel. */
function AssignedPartner({ lead, run }: { lead: Lead; run: Run }) {
  const [price, setPrice] = useState(lead.partnerPrice == null ? "" : String(lead.partnerPrice));
  return (
    <div className="mt-2 space-y-3 text-[15px]">
      <p>הועבר ל<b>{lead.partnerName}</b> · {when(lead.partnerSentAt)}</p>
      <p className="rounded-xl bg-mist p-3 text-[14px]"><b>תיעוד הסכמה:</b> {lead.partnerConsentNote} <span className="text-muted">({when(lead.partnerConsentAt)})</span></p>
      <div className="flex flex-wrap items-end gap-2">
        <Field label="מחיר הליד (₪)"><input inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} className={`${field} w-32`} dir="ltr" /></Field>
        <button onClick={() => run("leadUpdate", { fields: { partnerPrice: price } }, "המחיר נשמר")} className={btnLine}>שמירה</button>
        <label className="flex min-h-11 items-center gap-2 font-semibold">
          <input type="checkbox" checked={Boolean(Number(lead.partnerPaid))} onChange={(e) => run("leadUpdate", { fields: { partnerPaid: e.target.checked } }, "עודכן")} className="h-5 w-5 accent-[#0a7c59]" />שולם
        </label>
      </div>
      <button onClick={() => run("unassign", {}, "השיוך בוטל")} className="text-[14px] font-bold text-muted underline">ביטול השיוך</button>
    </div>
  );
}

const EMPTY = { partnerId: "", price: "", consent: false, note: "" };

/**
 * Hand-off form. The original form consent covers only CamaOla calling back, so the owner must record the customer's
 * separate, explicit agreement (checkbox + how/when). The server rejects the hand-off without it.
 */
function AssignForm({ partners, run }: { partners: Partner[]; run: Run }) {
  const [form, setForm] = useState(EMPTY);
  const ready = form.consent && form.partnerId && form.note.trim().length >= 5;
  function choosePartner(id: string) {
    const p = partners.find((x) => String(x.id) === id);
    setForm((f) => ({ ...f, partnerId: id, price: p?.pricePerLead == null ? f.price : String(p.pricePerLead) }));
  }
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (await run("assign", { partnerId: Number(form.partnerId), price: form.price, consent: form.consent, consentNote: form.note }, "הועבר לשותף")) setForm(EMPTY);
  }
  return (
    <form onSubmit={submit} className="mt-2 space-y-3">
      <p className="text-[14px] text-muted">הלקוח הסכים רק שנציג ״כמה עולה״ יחזור אליו. לפני העברה לעסק אחר צריך לקבל ממנו הסכמה מפורשת ולתעד אותה כאן.</p>
      <div className="grid gap-3 sm:grid-cols-[1fr_140px]">
        <Field label="שותף">
          <select required value={form.partnerId} onChange={(e) => choosePartner(e.target.value)} className={field}>
            <option value="">בחירה…</option>{partners.map((p) => <option key={p.id} value={p.id}>{p.name} · {PARTNER_TYPE[p.type] ?? p.type}</option>)}
          </select>
        </Field>
        <Field label="מחיר (₪)"><input inputMode="numeric" dir="ltr" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} className={field} /></Field>
      </div>
      <Field label="איך ומתי הלקוח הסכים?">
        <input required minLength={5} maxLength={300} value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))} placeholder="לדוגמה: אישר בשיחה טלפונית 19/10 שהסוכנות תתקשר" className={field} />
      </Field>
      <label className="flex items-start gap-2 text-[15px] font-semibold">
        <input type="checkbox" required checked={form.consent} onChange={(e) => setForm((f) => ({ ...f, consent: e.target.checked }))} className="mt-1 h-5 w-5 accent-[#0a7c59]" />
        אני מאשר/ת שהלקוח הסכים במפורש להעברת פרטיו לשותף הזה
      </label>
      <button type="submit" disabled={!ready} className={btnGo}>העברה לשותף</button>
    </form>
  );
}

/** "Hand off to partner" box: assigned state, empty state, or the consent form. */
export function PartnerSection({ lead, partners, run }: { lead: Lead; partners: Partner[]; run: Run }) {
  return (
    <section className="rounded-2xl border border-line p-4">
      <h3 className="text-[17px]">העברה לשותף</h3>
      {lead.partnerId ? <AssignedPartner lead={lead} run={run} />
        : partners.length === 0 ? <p className="mt-2 text-[15px] text-muted">עוד אין שותפים פעילים. אפשר להוסיף בלשונית ״שותפים״.</p>
          : <AssignForm partners={partners} run={run} />}
    </section>
  );
}
