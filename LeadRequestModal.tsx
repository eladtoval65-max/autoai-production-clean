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

  const fieldClass = "w-full min-h-12 border border-seam bg-paint px-3 py-2.5 text-[16px] text-asphalt outline-none focus:border-curb";
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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-asphalt/60 sm:items-center sm:p-5" dir="rtl" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-label="בקשת יצירת קשר" className="relative max-h-[94vh] w-full max-w-[520px] overflow-y-auto border-t-4 border-asphalt bg-concrete p-6 text-asphalt sm:border-4 sm:p-8">
        <button type="button" aria-label="סגירה" onClick={onClose} className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center border border-seam bg-slab hover:border-asphalt"><X size={16} /></button>
        {receivedId === null ? (
          <>
            <h2 className="pl-12 text-[1.7rem] leading-tight">רוצים שנחזור אליכם?</h2>
            <p className="mt-2 text-[15px] leading-6 text-tar">בקשה לגבי {vehicle.make.split(" · ")[0]}. פרטי הקשר יישמרו ב־AutoAI בלבד; בשלב זה אין העברה אוטומטית לגורם מסחרי.</p>
            <form className="mt-6 space-y-4" onSubmit={onSubmit}>
              <label className="block text-[15px] font-semibold">מה מעניין אתכם?
                <select className={`mt-1 ${fieldClass}`} value={leadType} onChange={event => setLeadType(event.target.value as RequestType)}>
                  <option value="vehicle">בירור לגבי רכב</option><option value="used_car">רכב יד־שנייה</option>
                  <option value="financing">מימון</option><option value="insurance">ביטוח</option>
                  <option value="trade_in">טרייד־אין</option><option value="test_drive">נסיעת מבחן</option>
                </select>
              </label>
              <label className="block text-[15px] font-semibold">שם מלא<input className={`mt-1 ${fieldClass}`} autoComplete="name" value={fullName} onChange={event => setFullName(event.target.value)} required minLength={2} maxLength={120} /></label>
              <label className="block text-[15px] font-semibold">טלפון נייד<input className={`mt-1 ${fieldClass}`} dir="ltr" autoComplete="tel" type="tel" inputMode="tel" placeholder="0501234567" pattern="05[0-9]{8}" value={phone} onChange={event => setPhone(event.target.value.replace(/[\s-]/g, ""))} required /></label>
              <label className="block text-[15px] font-semibold">עיר / אזור (לא חובה)<input className={`mt-1 ${fieldClass}`} autoComplete="address-level2" value={city} onChange={event => setCity(event.target.value)} maxLength={80} /></label>
              <label className="block text-[15px] font-semibold">מתי מתכננים לקנות?
                <select className={`mt-1 ${fieldClass}`} value={purchaseTimeline} onChange={event => setPurchaseTimeline(event.target.value as Timeline)}>
                  <option value="unsure">עדיין לא החלטתי</option><option value="now">בקרוב</option>
                  <option value="three_months">בשלושת החודשים הקרובים</option><option value="later">בהמשך השנה</option>
                </select>
              </label>
              <div className="absolute -left-[9999px]" aria-hidden="true"><label>Website<input tabIndex={-1} autoComplete="off" value={website} onChange={event => setWebsite(event.target.value)} /></label></div>
              <label className="flex cursor-pointer items-start gap-3 border-t border-seam pt-4 text-[14px] leading-6 text-tar">
                <input type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)} required className="mt-1 h-5 w-5 shrink-0" />
                <span>{LEAD_CONSENT_TEXT}</span>
              </label>
              <Link href="/privacy" className="inline-block text-[14px] underline">מידע על פרטיות ופניות</Link>
              {create.error && <p role="alert" className="text-[15px] font-semibold text-stop">{create.error.message || "לא הצלחנו לשמור את הפנייה; נסו שוב."}</p>}
              <button type="submit" disabled={!consent || create.isPending} className="min-h-12 w-full bg-curb px-5 text-[17px] font-bold text-paint hover:bg-curb-deep disabled:opacity-50">{create.isPending ? "שומרים פנייה…" : "שליחת בקשה ל־AutoAI"}</button>
            </form>
          </>
        ) : (
          <div className="py-8 text-center"><Check className="mx-auto mb-4 text-curb" size={36} /><h2 className="text-[1.7rem]">הבקשה התקבלה</h2><p className="mt-3 text-[15px] leading-6 text-tar">מספר פנייה {receivedId}. הפרטים נשמרו במערכת AutoAI לטיפול פנימי; אין הבטחה להצעת מחיר או להעברה לסוכנות.</p><button onClick={onClose} className="mt-6 min-h-11 bg-curb px-6 font-bold text-paint hover:bg-curb-deep">סגירה</button></div>
        )}
      </div>
    </div>
  );
}
