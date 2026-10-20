import { MessageCircle, Phone } from "lucide-react";
import { intlPhone } from "../format";

/** Round call + WhatsApp buttons (and optionally the number). Clicks don't bubble to the row. */
export function ContactButtons({ phone, showNumber = true }: { phone: string; showNumber?: boolean }) {
  return (
    <span className="flex items-center gap-2" dir="ltr" onClick={(e) => e.stopPropagation()}>
      <a href={`tel:${phone}`} aria-label="התקשרות" className="flex h-9 w-9 items-center justify-center rounded-full bg-go text-white"><Phone className="h-4 w-4" /></a>
      <a href={`https://wa.me/${intlPhone(phone)}`} target="_blank" rel="noopener noreferrer" aria-label="וואטסאפ" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25d366] text-white"><MessageCircle className="h-4 w-4" /></a>
      {showNumber && <span>{phone}</span>}
    </span>
  );
}
