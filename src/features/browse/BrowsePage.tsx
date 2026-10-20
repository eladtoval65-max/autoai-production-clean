/**
 * /cars, /cars/:make, /cars/:make/:model — every model of the main makes in Israel, by generation since 2010.
 * Routing only: picks the page from the URL. Data lives in src/data/generations.ts (kept current by the daily market agent).
 */
import { useEffect } from "react";
import { Link, useParams } from "wouter";
import { MAKES } from "../../data/generations";
import { BrowseShell } from "./components/BrowseShell";
import { MakePage } from "./components/MakePage";
import { MakesGrid } from "./components/MakesGrid";
import { ModelPage } from "./components/ModelPage";

function NotFoundNote() {
  return <div className="py-16 text-center"><h1 className="text-2xl">הדגם לא נמצא</h1><Link href="/cars" className="mt-4 inline-block font-bold text-go-deep">לכל היצרנים</Link></div>;
}

export default function BrowsePage() {
  const { make: makeId = "", model: modelId = "" } = useParams<{ make?: string; model?: string }>();
  const make = MAKES.find((x) => x.id === makeId);
  const model = make?.models.find((x) => x.id === modelId);

  useEffect(() => {
    if (!makeId) document.title = "כל הדגמים לפי יצרן, משנת 2010 | כמה עולה";
    window.scrollTo(0, 0);
  }, [makeId, modelId]);

  const page = !makeId ? <MakesGrid />
    : make && model ? <ModelPage make={make} model={model} />
      : make && !modelId ? <MakePage make={make} />
        : <NotFoundNote />;

  return <BrowseShell make={make} model={model}>{page}</BrowseShell>;
}
