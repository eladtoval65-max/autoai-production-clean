import { Search } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { MAKES } from "../../../data/generations";
import { card } from "../../../shared/styles";
import { matchesQuery } from "../model/labels";
import { MakeBadge } from "./MakeBadge";

/** Search box: as the user types, matching models appear as quick links. */
function ModelSearch({ query, setQuery }: { query: string; setQuery: (q: string) => void }) {
  const hits = query ? MAKES.flatMap((mk) => mk.models.filter((m) => matchesQuery(mk, m, query)).map((m) => ({ mk, m }))) : [];
  return (
    <>
      <label className="relative mt-6 block max-w-md">
        <span className="sr-only">חיפוש דגם</span>
        <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="חיפוש: קורולה, טוסון, Model Y…" className="min-h-12 w-full rounded-full border border-line bg-white ps-9 pe-4 text-[16px] outline-none focus:border-go" />
      </label>
      {hits.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {hits.map(({ mk, m }) => (
            <li key={`${mk.id}/${m.id}`}><Link href={`/cars/${mk.id}/${m.id}`} className="inline-flex min-h-10 items-center rounded-full border border-line bg-white px-4 text-[15px] font-semibold no-underline hover:border-go">{mk.he} {m.he}</Link></li>
          ))}
        </ul>
      )}
    </>
  );
}

/** /cars — every make as a card with its model names, plus search. */
export function MakesGrid() {
  const [query, setQuery] = useState("");
  const makes = MAKES.filter((mk) => !query || mk.models.some((m) => matchesQuery(mk, m, query)));
  const modelCount = MAKES.reduce((a, mk) => a + mk.models.length, 0);
  return (
    <>
      <h1 className="text-[clamp(2rem,4vw,3rem)] leading-tight">כל הדגמים, לפי יצרן</h1>
      <p className="mt-2 max-w-[60ch] text-[17px] text-muted">{modelCount} דגמים מ-{MAKES.length} יצרנים, כל דור משנת 2010: מנועים, צריכה בפועל, בטיחות ומה לבדוק לפני שקונים יד שנייה.</p>
      <ModelSearch query={query} setQuery={setQuery} />
      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {makes.map((mk) => (
          <li key={mk.id}>
            <Link href={`/cars/${mk.id}`} className={`${card} flex h-full flex-col p-5 text-ink no-underline hover:border-go`}>
              <span className="flex items-center gap-3">
                <MakeBadge id={mk.id} name={mk.name} />
                <span className="flex min-w-0 flex-col">
                  <span className="font-display text-xl font-bold">{mk.he}</span>
                  <span className="text-[14px] text-muted" dir="ltr">{mk.name}</span>
                </span>
              </span>
              <span className="mt-3 text-[14px] text-muted">{mk.models.map((m) => m.he).join(" · ")}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
