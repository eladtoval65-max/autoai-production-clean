import { Link } from "wouter";

/** "₪ כמה עולה" logo linking home. `en` switches to the CamaOla wordmark; `href` lets the home page link to #top. */
export function BrandMark({ en = false, href = "/" }: { en?: boolean; href?: string }) {
  const inner = (
    <>
      <span aria-hidden className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-go font-display text-[17px] font-bold text-white">₪</span>
      {en
        ? <span className="font-display text-[21px] font-bold leading-none">Cama<span className="text-go">Ola</span></span>
        : <span className="font-display text-[22px] font-bold leading-none">כמה <span className="text-go">עולה</span></span>}
    </>
  );
  const cls = "flex items-center gap-2 text-ink no-underline";
  return href.startsWith("#")
    ? <a href={href} className={cls} aria-label={en ? "CamaOla" : "כמה עולה"}>{inner}</a>
    : <Link href={href} className={cls} aria-label={en ? "CamaOla" : "כמה עולה"}>{inner}</Link>;
}
