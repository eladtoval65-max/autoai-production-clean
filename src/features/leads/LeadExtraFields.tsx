/**
 * Optional pricing details for insurance / financing requests (definitions in leadPolicy.ts → DETAIL_FIELDS).
 * Nothing here is required; an empty field is simply not sent. Hidden for other request types.
 */
import { DETAIL_FIELDS, type LeadDetails, type LeadType } from "@shared/leadPolicy";

type Props = { leadType: LeadType; value: LeadDetails; onChange: (next: LeadDetails) => void; fieldClass: string };

export function LeadExtraFields({ leadType, value, onChange, fieldClass }: Props) {
  if (leadType !== "insurance" && leadType !== "financing") return null;
  const fields = DETAIL_FIELDS[leadType];
  const set = (key: keyof LeadDetails, raw: string) => {
    const next = { ...value };
    if (raw === "") delete next[key];
    else (next as Record<string, unknown>)[key] = key === "claims3y" ? raw : Number(raw);
    onChange(next);
  };
  return (
    <fieldset className="rounded-xl border border-line p-3">
      <legend className="px-1 text-[14px] font-semibold">לא חובה — עוזר לקבל הצעה מדויקת יותר</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {fields.map((f) => (
          <label key={f.key} className="block text-[14px] font-semibold">{f.label}
            {f.kind === "claims"
              ? <select className={`mt-1 ${fieldClass}`} value={String(value[f.key] ?? "")} onChange={(e) => set(f.key, e.target.value)}>
                  <option value="">—</option><option value="0">אין</option><option value="1">אחת</option><option value="2+">שתיים או יותר</option>
                </select>
              : <input className={`mt-1 ${fieldClass}`} type="number" inputMode="numeric" dir="ltr" min={f.min} max={f.max}
                  value={value[f.key] == null ? "" : String(value[f.key])} onChange={(e) => set(f.key, e.target.value)} />}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
