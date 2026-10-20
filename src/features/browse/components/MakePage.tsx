import { useEffect } from "react";
import { Link } from "wouter";
import type { Make, ModelLine } from "../../../data/generations";
import { card } from "../../../shared/styles";
import { modelYears, priceText, wikiTitle } from "../model/labels";
import { StatusBadge } from "./StatusBadge";
import { WikiPhoto } from "./WikiPhoto";

/** One model tile on the make page. */
function ModelTile({ make, model }: { make: Make; model: ModelLine }) {
  return (
    <Link href={`/cars/${make.id}/${model.id}`} className={`${card} block overflow-hidden text-ink no-underline hover:border-go`}>
      <WikiPhoto title={wikiTitle(make, model)} className="aspect-[16/9]" />
      <div className="p-5">
        <div className="flex items-start justify-between gap-2"><h2 className="text-xl">{model.he}</h2><StatusBadge status={model.status} /></div>
        <p className="text-[14px] text-muted">{modelYears(model)} · {model.gens.length} {model.gens.length === 1 ? "דור" : "דורות"}</p>
        <p className="mt-2 text-[15px] font-semibold">{model.price ? <>חדש: {priceText(model.price)}</> : "יד שנייה בלבד / מחיר לא אומת"}</p>
      </div>
    </Link>
  );
}

/** /cars/:make — all models of one make. */
export function MakePage({ make }: { make: Make }) {
  useEffect(() => { document.title = `${make.he} — כל הדגמים והדורות מ-2010 | כמה עולה`; }, [make]);
  return (
    <>
      <h1 className="text-[clamp(2rem,4vw,3rem)] leading-tight">{make.he} <span className="text-muted" dir="ltr">{make.name}</span></h1>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {make.models.map((m) => <li key={m.id}><ModelTile make={make} model={m} /></li>)}
      </ul>
    </>
  );
}
