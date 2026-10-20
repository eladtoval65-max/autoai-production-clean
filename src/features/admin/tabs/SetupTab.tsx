import { Check, X } from "lucide-react";
import { useState } from "react";
import { card } from "../../../shared/styles";
import { adminApi, errorText } from "../api";
import { btnGo } from "../styles";
import type { SetupStatus } from "../types";

/** [is it OK?, what it is, how to fix it] for each deployment requirement. */
const checksFor = (s: SetupStatus): [boolean, string, string][] => [
  [s.dbConfigured, "חיבור למסד נתונים", "להוסיף DATABASE_URL ב-Vercel ולבצע Redeploy."],
  [s.dbReachable, "מסד הנתונים זמין", "לבדוק שמחרוזת החיבור נכונה ושה-cluster פעיל."],
  [s.leadsTable, "טבלאות מוכנות", "ללחוץ על ״הכנת מסד הנתונים״ למטה."],
  [s.contactEmail, "מייל לקבלת פניות", "להוסיף AUTOAI_CONTACT_EMAIL ב-Vercel."],
  [s.emailAlerts, "התראה מיידית במייל", "להוסיף RESEND_API_KEY ב-Vercel."],
  [s.chatKey, "מפתח לצ׳אט", "להוסיף ANTHROPIC_API_KEY ב-Vercel."],
];

/** Setup checklist + button that (re)runs the idempotent database upgrade. */
export function SetupTab({ status, onChange }: { status: SetupStatus; onChange: () => Promise<void> }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function prepareDb() {
    setBusy(true); setError("");
    const r = await adminApi("init", {});
    if (!r.ok) setError(errorText(r));
    await onChange();
    setBusy(false);
  }
  return (
    <section className={`${card} p-6`}>
      <h1 className="text-2xl">מצב ההגדרה</h1>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {checksFor(status).map(([ok, label, fix]) => (
          <li key={label} className={`flex gap-3 rounded-xl p-3 ${ok ? "bg-go-soft" : "bg-[#fff4e8]"}`}>
            {ok ? <Check className="mt-0.5 h-5 w-5 shrink-0 text-go" aria-hidden /> : <X className="mt-0.5 h-5 w-5 shrink-0 text-alert" aria-hidden />}
            <span><span className="block font-bold">{label}</span>{!ok && <span className="block text-[14px] text-muted">{fix}</span>}</span>
          </li>
        ))}
      </ul>
      {!!status.schemaErrors?.length && (
        <p role="alert" className="mt-4 rounded-xl bg-[#fff4e8] p-3 text-[14px] text-alert">
          חלק משדרוגי מסד הנתונים לא הצליחו ({status.schemaErrors.join(", ")}). אפשר ללחוץ שוב על הכפתור למטה; אם זה חוזר, לשלוח את הקודים האלה.
        </p>
      )}
      {status.dbReachable && <button onClick={prepareDb} disabled={busy} className={`${btnGo} mt-5`}>הכנת מסד הנתונים / עדכון מבנה</button>}
      {error && <p role="alert" className="mt-3 text-[15px] font-semibold text-alert">{error}</p>}
    </section>
  );
}
