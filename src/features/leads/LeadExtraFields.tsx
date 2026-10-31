/**
 * Optional details per request type (definitions in leadPolicy.ts → DETAIL_FIELDS): insurance renewal month,
 * the car from its licence plate, trade-in mileage, whether financing / a trade-in is needed, loan details.
 * Nothing here is required; empty fields are not sent. A plate lookup fills the car name and year from the
 * government vehicle registry (the same lookup as the site's plate check).
 */
import { useState } from "react";
import { CONTACT_FIELD, DETAIL_FIELDS, monthHe, type DetailField, type LeadDetails, type LeadType } from "@shared/leadPolicy";
import { lookupPlate, normalizePlate } from "../home/model/plate";

type Props = { leadType: LeadType; value: LeadDetails; onChange: (next: LeadDetails) => void; fieldClass: string };

/** Only the keys that belong to this request type (switching type must not send the previous type's answers). */
export function detailsFor(leadType: LeadType, details: LeadDetails): LeadDetails | undefined {
  const keys = new Set([CONTACT_FIELD.key, ...DETAIL_FIELDS[leadType].map((f) => f.key)]);
  const picked = Object.fromEntries(Object.entries(details).filter(([k, v]) => keys.has(k as keyof LeadDetails) && v !== "" && v != null));
  return Object.keys(picked).length ? (picked as LeadDetails) : undefined;
}

/** "How should we get back to you?" — WhatsApp / call / either, as three buttons (asked for every request type). */
export function ContactViaField({ value, onChange }: { value: LeadDetails; onChange: (next: LeadDetails) => void }) {
  return (
    <fieldset>
      <legend className="text-[15px] font-semibold">{CONTACT_FIELD.label}</legend>
      <div className="mt-1 grid grid-cols-3 gap-2">
        {CONTACT_FIELD.options!.map(([k, label]) => (
          <label key={k} className={`flex min-h-11 cursor-pointer items-center justify-center rounded-full border text-[15px] font-semibold ${value.contactVia === k ? "border-go bg-[#e6f4ee] text-go-deep" : "border-line bg-white"}`}>
            <input type="radio" name="contactVia" value={k} checked={value.contactVia === k} onChange={() => onChange({ ...value, contactVia: k as LeadDetails["contactVia"] })} className="sr-only" />{label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function LeadExtraFields({ leadType, value, onChange, fieldClass }: Props) {
  const fields = DETAIL_FIELDS[leadType];
  if (!fields.length) return null;
  const set = (f: DetailField, raw: string) => {
    const next = { ...value } as Record<string, unknown>;
    if (raw === "") delete next[f.key];
    else next[f.key] = f.kind === "number" || f.kind === "month" ? Number(raw) : raw;
    onChange(next as LeadDetails);
  };
  return (
    <fieldset className="rounded-xl border border-line p-3">
      <legend className="px-1 text-[14px] font-semibold">לא חובה — עוזר לקבל הצעה מדויקת ומהירה יותר</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {fields.map((f) => f.kind === "auto"
          ? value[f.key] ? <p key={f.key} className="self-end text-[14px]"><span className="font-semibold text-muted">{f.label}: </span>{String(value[f.key])}</p> : null
          : f.kind === "plate"
            ? <PlateField key={f.key} field={f} value={value} onChange={onChange} fieldClass={fieldClass} />
            : <label key={f.key} className="block text-[14px] font-semibold">{f.label}<Control field={f} value={value[f.key]} onSet={(raw) => set(f, raw)} fieldClass={fieldClass} /></label>)}
      </div>
    </fieldset>
  );
}

function Control({ field: f, value, onSet, fieldClass }: { field: DetailField; value: unknown; onSet: (raw: string) => void; fieldClass: string }) {
  const v = value == null ? "" : String(value);
  if (f.kind === "claims") return (
    <select className={`mt-1 ${fieldClass}`} value={v} onChange={(e) => onSet(e.target.value)}>
      <option value="">—</option><option value="0">אין</option><option value="1">אחת</option><option value="2+">שתיים או יותר</option>
    </select>);
  if (f.kind === "month") return (
    <select className={`mt-1 ${fieldClass}`} value={v} onChange={(e) => onSet(e.target.value)}>
      <option value="">—</option>{Array.from({ length: 12 }, (_, i) => <option key={i} value={i + 1}>{monthHe(i + 1)}</option>)}
    </select>);
  if (f.kind === "choice") return (
    <select className={`mt-1 ${fieldClass}`} value={v} onChange={(e) => onSet(e.target.value)}>
      <option value="">—</option>{f.options!.map(([k, label]) => <option key={k} value={k}>{label}</option>)}
    </select>);
  return <input className={`mt-1 ${fieldClass}`} type="number" inputMode="numeric" dir="ltr" min={f.min} max={f.max} value={v} onChange={(e) => onSet(e.target.value)} />;
}

/** Plate input + "fill from registry" button: sets plate, car name and year. */
function PlateField({ field, value, onChange, fieldClass }: { field: DetailField; value: LeadDetails; onChange: (next: LeadDetails) => void; fieldClass: string }) {
  const [raw, setRaw] = useState(value.plate ?? "");
  const [msg, setMsg] = useState("");
  async function fill() {
    const plate = normalizePlate(raw);
    if (!plate) { setMsg("מספר רישוי: 7–8 ספרות"); return; }
    setMsg("מחפש…");
    try {
      const r = await lookupPlate(plate);
      if (!r.found) { onChange({ ...value, plate }); setMsg("לא נמצא במאגר — אפשר להמשיך בלי"); return; }
      const year = Number(r.year);
      onChange({ ...value, plate, carName: [r.make, r.model, r.trim].filter(Boolean).join(" ").slice(0, 80), ...(year >= 1990 && year <= 2030 ? { carYear: year } : {}) });
      setMsg("");
    } catch { onChange({ ...value, plate }); setMsg("המאגר לא זמין כרגע — שמרנו את המספר"); }
  }
  return (
    <div className="text-[14px] font-semibold sm:col-span-2">
      <label htmlFor="lead-plate">{field.label}</label>
      <div className="mt-1 flex gap-2">
        <input id="lead-plate" className={`${fieldClass} flex-1`} inputMode="numeric" dir="ltr" maxLength={10} value={raw}
          onChange={(e) => { setRaw(e.target.value); const p = normalizePlate(e.target.value); if (!p) { const n = { ...value }; delete n.plate; onChange(n); } }}
          onBlur={() => { const p = normalizePlate(raw); if (p && p !== value.plate) void fill(); }} />
        <button type="button" onClick={fill} className="min-h-11 shrink-0 rounded-full border border-line bg-white px-4 font-bold hover:border-go">מילוי</button>
      </div>
      {msg && <p role="status" className="mt-1 text-[13px] font-normal text-muted">{msg}</p>}
    </div>
  );
}
