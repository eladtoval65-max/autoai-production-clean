/**
 * "Know which car you want?" — search any model on the site (Hebrew or English name) and jump straight to its
 * monthly cost (/cars/<make>/<model>#cost). Keyboard: ↑/↓ to move, Enter to open, Escape to close.
 */
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { MAKES } from "../../data/generations";

const norm = (s: string) => s.toLowerCase().replace(/[\s\-־'׳"״]/g, "");

export function CarSearch({ className = "" }: { className?: string }) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const [, navigate] = useLocation();
  const hits = useMemo(() => {
    const n = norm(q);
    if (n.length < 2) return [];
    const all = MAKES.flatMap((mk) => mk.models.map((m) => ({ href: `/cars/${mk.id}/${m.id}#cost`, he: `${mk.he} ${m.he}`, en: `${mk.name} ${m.model}`, key: norm(`${mk.he}${m.he}${mk.name}${m.model}${m.he}${m.model}`), model: norm(`${m.he}${m.model}`) })));
    return all.filter((x) => x.key.includes(n)).sort((a, b) => Number(!a.model.startsWith(n)) - Number(!b.model.startsWith(n))).slice(0, 8);
  }, [q]);
  const go = (href: string) => navigate(href); // the model page scrolls to #cost itself once loaded

  return (
    <div className={`relative ${className}`}>
      <label className="block">
        <span className="text-[15px] font-bold">יודעים איזה רכב? בדקו כמה הוא עולה בחודש</span>
        <span className="relative mt-2 block">
          <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" aria-hidden />
          <input value={q} onChange={(e) => { setQ(e.target.value); setActive(0); }} role="combobox" aria-expanded={hits.length > 0} aria-controls="car-search-list" aria-autocomplete="list"
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, hits.length - 1)); }
              else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
              else if (e.key === "Enter" && hits[active]) { e.preventDefault(); go(hits[active].href); }
              else if (e.key === "Escape") setQ("");
            }}
            placeholder="קורולה, טוסון, מאזדה 3, Model Y…" className="min-h-14 w-full rounded-full border border-line bg-white ps-12 pe-5 text-[17px] shadow-[var(--shadow-card)] outline-none focus:border-go" />
        </span>
      </label>
      {hits.length > 0 && (
        <ul id="car-search-list" role="listbox" className="absolute inset-x-0 z-30 mt-2 overflow-hidden rounded-2xl border border-line bg-white shadow-[var(--shadow-float)]">
          {hits.map((h, i) => (
            <li key={h.href} role="option" aria-selected={i === active}>
              <a href={h.href} onClick={(e) => { e.preventDefault(); go(h.href); }} onMouseEnter={() => setActive(i)}
                className={`flex items-center justify-between gap-3 px-5 py-3 text-[16px] text-ink no-underline ${i === active ? "bg-mist" : ""}`}>
                <span className="font-semibold">{h.he}</span><span className="text-[13px] text-muted" dir="ltr">{h.en}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
