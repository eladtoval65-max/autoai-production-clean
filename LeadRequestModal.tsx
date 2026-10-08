import { LEAD_CONSENT_TEXT } from "@shared/const";
import { trpc } from "@/lib/trpc";
import { useState, type FormEvent } from "react";
import { Check, X } from "lucide-react";
import { Link } from "wouter";

type RequestType = "vehicle" | "financing" | "insurance" | "trade_in" | "used_car" | "test_drive";
type Timeline = "now" | "three_months" | "later" | "unsure";

export default function LeadRequestModal({
  vehicle,
  budget,
  sourcePage,
  onClose,
}: {
  vehicle: { id: string; make: string; match: number };
  budget: number;
  sourcePage: "recommendations" | "vehicle_details" | "comparison";
  onClose: () => void;
}) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [leadType, setLeadType] = useState<RequestType>("vehicle");
  const [purchaseTimeline, setPurchaseTimeline] = useState<Timeline>("unsure");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(""); // Spam honeypot.
  const [requestId] = useState(() => crypto.randomUUID());
  const [receivedId, setReceivedId] = useState<number | null>(null);
  const create = trpc.leads.create.useMutation();

  const fieldClass = "w-full rounded-lg border border-[#35404c] bg-[#10161d] px-3 py-2.5 text-sm text-white outline-none focus:border-[#79b9ff]";
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!consent) return;
    try {
      const saved = await create.mutateAsync({
        requestId,
        fullName: fullName.trim(),
        phone: phone.replace(/[\s-]/g, ""),
        city: city.trim() || undefined,
        leadType,
        trimId: /^\d+$/.test(vehicle.id) ? Number(vehicle.id) : undefined,
        vehicleLabel: vehicle.make,
        matchScore: vehicle.match,
        budget,
        purchaseTimeline,
        sourcePage,
        consent: true,
        website,
      });
      setReceivedId(saved.id);
    } catch {
      // The server's safe, user-facing message is displayed below.
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3" dir="rtl" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-label="בקשת יצירת קשר" className="relative max-h-[95vh] w-full max-w-[510px] overflow-y-auto border border-[#37414b] bg-[#11161c] p-5 text-white shadow-2xl sm:p-8">
        <button type="button" aria-label="סגירה" onClick={onClose} className="absolute left-4 top-4 p-1 text-[#b8c2ce] hover:text-white"><X size={18} /></button>
        {receivedId === null ? (
          <>
            <p className="text-xs tracking-[.16em] text-[#79b9ff]">AUTOAI / יצירת קשר</p>
            <h2 className="mt-3 pr-1 text-2xl font-semibold">רוצים שנחזור אליכם?</h2>
            <p className="mt-2 text-sm leading-6 text-[#aab6c2]">בקשה לגבי {vehicle.make}. פרטי הקשר יישמרו ב־AutoAI בלבד; בשלב זה אין העברה אוטומטית לגורם מסחרי.</p>
            <form className="mt-6 space-y-4" onSubmit={onSubmit}>
              <label className="block text-sm">מה מעניין אתכם?
                <select className={`mt-1 ${fieldClass}`} value={leadType} onChange={event => setLeadType(event.target.value as RequestType)}>
                  <option value="vehicle">בירור לגבי רכב</option><option value="used_car">רכב יד־שנייה</option>
                  <option value="financing">מימון</option><option value="insurance">ביטוח</option>
                  <option value="trade_in">טרייד־אין</option><option value="test_drive">נסיעת מבחן</option>
                </select>
              </label>
              <label className="block text-sm">שם מלא<input className={`mt-1 ${fieldClass}`} autoComplete="name" value={fullName} onChange={event => setFullName(event.target.value)} required minLength={2} maxLength={120} /></label>
              <label className="block text-sm">טלפון נייד<input className={`mt-1 ${fieldClass}`} dir="ltr" autoComplete="tel" type="tel" inputMode="tel" placeholder="0501234567" pattern="05[0-9]{8}" value={phone} onChange={event => setPhone(event.target.value.replace(/[\s-]/g, ""))} required /></label>
              <label className="block text-sm">עיר / אזור (לא חובה)<input className={`mt-1 ${fieldClass}`} autoComplete="address-level2" value={city} onChange={event => setCity(event.target.value)} maxLength={80} /></label>
              <label className="block text-sm">מתי מתכננים לקנות?
                <select className={`mt-1 ${fieldClass}`} value={purchaseTimeline} onChange={event => setPurchaseTimeline(event.target.value as Timeline)}>
                  <option value="unsure">עדיין לא החלטתי</option><option value="now">בקרוב</option>
                  <option value="three_months">בשלושת החודשים הקרובים</option><option value="later">בהמשך השנה</option>
                </select>
              </label>
              <div className="absolute -left-[9999px]" aria-hidden="true"><label>Website<input tabIndex={-1} autoComplete="off" value={website} onChange={event => setWebsite(event.target.value)} /></label></div>
              <label className="flex cursor-pointer items-start gap-3 border-t border-[#323b45] pt-4 text-xs leading-5 text-[#b8c2ce]">
                <input type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)} required className="mt-1 accent-[#79b9ff]" />
                <span>{LEAD_CONSENT_TEXT}</span>
              </label>
              <Link href="/privacy" className="inline-block text-xs text-[#79b9ff] underline">מידע על פרטיות ופניות</Link>
              {create.error && <p role="alert" className="text-sm text-[#ff9c9c]">{create.error.message || "לא הצלחנו לשמור את הפנייה; נסו שוב."}</p>}
              <button type="submit" disabled={!consent || create.isPending} className="w-full bg-[#79b9ff] px-5 py-3 font-semibold text-[#0b0e12] disabled:cursor-not-allowed disabled:opacity-50">{create.isPending ? "שומרים פנייה…" : "שליחת בקשה ל־AutoAI"}</button>
            </form>
          </>
        ) : (
          <div className="py-8 text-center"><Check className="mx-auto mb-4 text-[#79b9ff]" size={36} /><h2 className="text-2xl font-semibold">הבקשה התקבלה</h2><p className="mt-3 text-sm leading-6 text-[#b8c2ce]">מספר פנייה {receivedId}. הפרטים נשמרו במערכת AutoAI לטיפול פנימי; אין הבטחה להצעת מחיר או להעברה לסוכנות.</p><button onClick={onClose} className="mt-6 bg-[#79b9ff] px-6 py-2.5 font-semibold text-[#0b0e12]">סגירה</button></div>
        )}
      </div>
    </div>
  );
}
