import { Star } from "lucide-react";
import type { Generation } from "../../../data/generations";

/** Euro NCAP rating as five stars (+ test year), or "no data" when the rating isn't confirmed. */
export function NcapStars({ gen }: { gen: Generation }) {
  if (gen.ncap == null) return <span className="text-[14px] text-muted">Euro NCAP: אין נתון</span>;
  return (
    <span className="inline-flex items-center gap-1.5 text-[14px]" aria-label={`Euro NCAP ${gen.ncap} כוכבים`}>
      <span className="inline-flex" dir="ltr" aria-hidden>
        {[0, 1, 2, 3, 4].map((i) => <Star key={i} className={`h-4 w-4 ${i < gen.ncap! ? "text-[#f5a524]" : "text-[#d5dbe3]"}`} fill="currentColor" strokeWidth={0} />)}
      </span>
      <span className="text-muted">Euro NCAP{gen.ncapYear ? ` (${gen.ncapYear})` : ""}</span>
    </span>
  );
}
