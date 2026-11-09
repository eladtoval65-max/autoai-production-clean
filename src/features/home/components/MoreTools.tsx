import { ChevronDown, Hash, Info, MessageCircle } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLang } from "../../../shared/i18n";

/**
 * One collapsed tool on the home page. Closed by default so the page stays short for first-time visitors;
 * it opens by itself when the URL hash points at it (the header links #plate / #legend / #advisor).
 */
function Tool({ id, icon, title, sub, children }: { id: string; icon: ReactNode; title: string; sub: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const sync = () => { if (location.hash === `#${id}`) { setOpen(true); setTimeout(() => ref.current?.scrollIntoView({ block: "start" }), 30); } };
    sync(); addEventListener("hashchange", sync);
    return () => removeEventListener("hashchange", sync);
  }, [id]);
  return (
    <div ref={ref} className="scroll-mt-20 overflow-hidden rounded-2xl border border-line bg-white">
      <button onClick={() => setOpen((v) => !v)} aria-expanded={open} className="flex w-full items-center gap-4 px-5 py-4 text-start hover:bg-mist/60">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mint text-go">{icon}</span>
        <span className="min-w-0 flex-1"><span className="block text-[17px] font-bold">{title}</span><span className="block text-[14px] text-muted">{sub}</span></span>
        <ChevronDown className={`h-5 w-5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>
      {open && <div className="border-t border-line">{children}</div>}
    </div>
  );
}

/** "More tools" at the bottom of the home page: plate check, how to read the numbers, AI advisor — each one tap away. */
export function MoreTools({ plate, legend, advisor }: { plate: ReactNode; legend: ReactNode; advisor: ReactNode }) {
  const { lang } = useLang();
  const he = lang === "he";
  return (
    <section className="mx-auto max-w-[860px] px-4 pb-16 pt-4 sm:px-8">
      <h2 className="text-[clamp(1.4rem,2.4vw,1.8rem)]">{he ? "עוד כלים" : "More tools"}</h2>
      <div className="mt-4 grid gap-3">
        <Tool id="plate" icon={<Hash className="h-5 w-5" />} title={he ? "בדיקת רכב לפי מספר רישוי" : "Check a car by plate"} sub={he ? "רכב יד שנייה? מקלידים מספר ורואים עלות חודשית" : "Used car? Type the plate, see the monthly cost"}>{plate}</Tool>
        <Tool id="advisor" icon={<MessageCircle className="h-5 w-5" />} title={he ? "יש שאלה? שאלו את היועץ" : "Ask the advisor"} sub={he ? "עונה בעברית פשוטה, 24/7" : "Plain answers, any time"}>{advisor}</Tool>
        <Tool id="legend" icon={<Info className="h-5 w-5" />} title={he ? "איך אנחנו מחשבים" : "How we calculate"} sub={he ? "מאיפה כל מספר מגיע: רשמי, אומדן או חסר" : "Where every number comes from"}>{legend}</Tool>
      </div>
    </section>
  );
}
