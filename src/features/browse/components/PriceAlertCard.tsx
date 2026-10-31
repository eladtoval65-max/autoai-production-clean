/**
 * "Tell me when the price drops" for a model on sale. Email + a separate, unticked consent (marketing),
 * stored with its text and version; every email has a one-click unsubscribe. See server/alerts/priceAlerts.ts.
 */
import { BellRing } from "lucide-react";
import { useState } from "react";
import type { Make, ModelLine } from "../../../data/generations";
import { card } from "../../../shared/styles";

export function PriceAlertCard({ make, model }: { make: Make; model: ModelLine }) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  if (!model.price || model.status !== "on_sale") return null;
  const name = `${make.he} ${model.he}`;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) return;
    setState("sending");
    const r = await fetch("/api/alerts", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, makeId: make.id, modelId: model.id, consent: true }) }).catch(() => null);
    setState(r?.ok ? "done" : "error");
  }

  return (
    <section className={`${card} mt-10 p-5 sm:p-6`} aria-labelledby="alert-h">
      <h2 id="alert-h" className="flex items-center gap-2 text-xl"><BellRing className="h-5 w-5 text-go" aria-hidden />עדכון כשהמחיר של {name} יורד</h2>
      {state === "done" ? <p className="mt-2 text-[16px]">נרשמת. נשלח מייל רק אם מחיר המחירון יורד — ואפשר להסיר בלחיצה בכל מייל.</p> : (
        <form onSubmit={submit} className="mt-3 space-y-3">
          <div className="flex flex-wrap gap-2">
            <label className="min-w-[14rem] flex-1"><span className="sr-only">מייל</span>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} dir="ltr" maxLength={160} placeholder="name@example.com"
                className="min-h-12 w-full rounded-full border border-line px-4 text-[16px] outline-none focus:border-go" /></label>
            <button disabled={!consent || state === "sending"} className="min-h-12 rounded-full bg-go px-6 font-bold text-white hover:bg-go-deep disabled:opacity-40">{state === "sending" ? "שולח…" : "עדכנו אותי"}</button>
          </div>
          <label className="flex items-start gap-2 text-[14px]">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-go)]" />
            <span>אני מסכים/ה לקבל מ״כמה עולה״ מייל כשמחיר המחירון של {name} יורד. רק על הדגם הזה, ואפשר להסיר בלחיצה בכל מייל. <a href="/privacy">פרטיות</a></span>
          </label>
          {state === "error" && <p role="alert" className="text-[14px] font-semibold text-alert">לא הצלחנו לרשום כרגע. נסו שוב בעוד דקה.</p>}
        </form>
      )}
    </section>
  );
}
