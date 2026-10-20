import { useEffect, useState, type FormEvent } from "react";
import { field } from "../../../../../shared/styles";
import { Field } from "../../../components/Field";
import { toLocalInput } from "../../../format";
import { LEAD_TYPE, TIMELINE } from "../../../labels";
import { btnGo } from "../../../styles";
import type { Lead } from "../../../types";

type Form = Record<"fullName" | "phone" | "city" | "vehicleLabel" | "budget" | "leadType" | "purchaseTimeline" | "followUpAt", string>;

const formFromLead = (l: Lead): Form => ({
  fullName: l.fullName, phone: l.phone, city: l.city ?? "", vehicleLabel: l.vehicleLabel, budget: l.budget == null ? "" : String(l.budget),
  leadType: l.leadType, purchaseTimeline: l.purchaseTimeline, followUpAt: toLocalInput(l.followUpAt),
});

/** Editable lead details. The server validates every field (phone format, allowed types, etc.). */
export function LeadEditForm({ lead, onSave }: { lead: Lead; onSave: (fields: Record<string, unknown>) => void }) {
  const [form, setForm] = useState<Form>(() => formFromLead(lead));
  useEffect(() => setForm(formFromLead(lead)), [lead]);
  const set = (k: keyof Form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }));
  function submit(e: FormEvent) {
    e.preventDefault();
    onSave({ ...form, followUpAt: form.followUpAt ? new Date(form.followUpAt).toISOString() : null });
  }
  return (
    <form onSubmit={submit} className="space-y-3">
      <h3 className="text-[17px]">פרטי הפנייה</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="שם"><input value={form.fullName} onChange={set("fullName")} className={field} /></Field>
        <Field label="טלפון"><input value={form.phone} onChange={set("phone")} dir="ltr" className={field} /></Field>
        <Field label="עיר"><input value={form.city} onChange={set("city")} className={field} /></Field>
        <Field label="תקציב (₪)"><input value={form.budget} onChange={set("budget")} inputMode="numeric" dir="ltr" className={field} /></Field>
        <Field label="רכב / נושא"><input value={form.vehicleLabel} onChange={set("vehicleLabel")} className={field} /></Field>
        <Field label="סוג פנייה"><select value={form.leadType} onChange={set("leadType")} className={field}>{Object.entries(LEAD_TYPE).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></Field>
        <Field label="מועד רכישה"><select value={form.purchaseTimeline} onChange={set("purchaseTimeline")} className={field}>{Object.entries(TIMELINE).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></Field>
        <Field label="תזכורת (תאריך ושעה)"><input type="datetime-local" value={form.followUpAt} onChange={set("followUpAt")} className={field} /></Field>
      </div>
      <button type="submit" className={btnGo}>שמירת שינויים</button>
    </form>
  );
}
