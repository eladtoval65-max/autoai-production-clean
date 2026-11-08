import { Link } from "wouter";
import { CarGlyph } from "./CarGlyph";

/**
 * The "כמה עולה?" sticker logo linking home — the same mint badge as on the social posts, so the site and the
 * posts read as one brand. `en` switches to the CamaOla wordmark; `href` lets the home page link to #top.
 */
export function BrandMark({ en = false, href = "/" }: { en?: boolean; href?: string }) {
  const inner = (
    <span className="flex items-center gap-1.5 rounded-full border-2 border-white bg-mint py-1 pe-3 ps-2 shadow-[0_3px_10px_-3px_rgba(6,43,34,.35)]">
      <CarGlyph className="h-[18px] w-auto" />
      <span className="font-brand text-[19px] font-semibold leading-none text-deep">
        {en ? <>Cama<span className="text-go">Ola</span></> : <>כמה עולה<span className="text-pop">?</span></>}
      </span>
    </span>
  );
  const cls = "flex items-center text-ink no-underline";
  return href.startsWith("#")
    ? <a href={href} className={cls} aria-label={en ? "CamaOla" : "כמה עולה"}>{inner}</a>
    : <Link href={href} className={cls} aria-label={en ? "CamaOla" : "כמה עולה"}>{inner}</Link>;
}
