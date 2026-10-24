import { ExternalLink } from "lucide-react";
import { useEffect } from "react";
import { yad2Search, type Make, type ModelLine } from "../../../data/generations";
import { modelYears, priceText, wikiTitle } from "../model/labels";
import { GenerationCard } from "./GenerationCard";
import { ModelLeadCta } from "./ModelLeadCta";
import { StatusBadge } from "./StatusBadge";
import { UsedCostCalculator } from "./UsedCostCalculator";
import { WikiPhoto } from "./WikiPhoto";

/** Title block: name, status, years, current list price and the Yad2 listings link. */
function ModelHeader({ make, model }: { make: Make; model: ModelLine }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
      <div>
        <h1 className="text-[clamp(2rem,4vw,3rem)] leading-tight">{make.he} {model.he}</h1>
        <p className="mt-1 text-[16px] text-muted" dir="ltr">{make.name} {model.model}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3"><StatusBadge status={model.status} /><span className="text-[15px] text-muted">{modelYears(model)}</span></div>
        <p className="mt-4 text-[18px]">{model.price ? <>מחיר מחירון חדש: <b className="num">{priceText(model.price)}</b></> : "אין מחיר חדש מאומת. בדקו מחירי יד שנייה ביד2 ובמחירון."}</p>
        <a href={yad2Search(make, model)} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-full bg-go px-6 text-[16px] font-bold text-white no-underline hover:bg-go-deep">
          מודעות יד שנייה ביד2 <ExternalLink className="h-4 w-4" aria-hidden />
        </a>
      </div>
      <WikiPhoto title={wikiTitle(make, model)} className="aspect-[16/10] rounded-2xl" />
    </div>
  );
}

/** /cars/:make/:model — every generation since 2010 (newest first) and the used-car monthly cost calculator. */
export function ModelPage({ make, model }: { make: Make; model: ModelLine }) {
  useEffect(() => { document.title = `${make.he} ${model.he} — כל הדורות, מה לבדוק וכמה עולה בחודש | כמה עולה`; }, [make, model]);
  return (
    <>
      <ModelHeader make={make} model={model} />
      <h2 className="mt-12 text-2xl">הדורות מאז 2010</h2>
      <ol className="mt-5 space-y-4">{[...model.gens].reverse().map((g) => <GenerationCard key={g.code} gen={g} makeId={make.id} model={model} />)}</ol>
      <div className="mt-10"><UsedCostCalculator make={make} model={model} /></div>
      <ModelLeadCta make={make} model={model} />
    </>
  );
}
