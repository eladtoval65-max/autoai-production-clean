import { useEffect, useState } from "react";
import { useLang } from "../i18n";
import { photoFor, wikiPhotoFor, type VehiclePhoto } from "../vehicleImages";
import { shortName } from "../format";

/**
 * Car photo with graceful fallbacks:
 *   1. the model's Wikipedia lead image (curated by editors, reliably shows the car),
 *   2. a pinned Wikimedia Commons file,
 *   3. a neutral placeholder (optionally labelled with the car name).
 * Every photo carries a credit link to its licence page.
 */
export function CarPhoto({ name, className = "", eager, width, label = false }: { name: string; className?: string; eager?: boolean; width?: number; label?: boolean }) {
  const { t } = useLang();
  const [wiki, setWiki] = useState<VehiclePhoto | null | undefined>(undefined); // undefined = still loading
  const [stage, setStage] = useState(0); // index into candidates; advances when an image fails to load

  useEffect(() => {
    let live = true;
    setWiki(undefined); setStage(0);
    wikiPhotoFor(name, width).then((p) => { if (live) setWiki(p); });
    return () => { live = false; };
  }, [name, width]);

  const candidates = [wiki, photoFor(name, width)].filter(Boolean) as VehiclePhoto[];
  const photo = wiki === undefined ? null : candidates[stage];

  if (!photo) {
    if (wiki === undefined) return <div className={`relative animate-pulse bg-mist ${className}`} />;
    return (
      <div className={`relative bg-gradient-to-b from-[#eef2f6] to-[#e1e7ee] ${className}`}>
        {label && <span className="absolute end-4 top-3 max-w-[70%] text-end font-display text-lg font-semibold leading-tight text-[#6b7a8c]">{shortName(name)}</span>}
      </div>
    );
  }
  return (
    <div className={`relative overflow-hidden bg-mist ${className}`}>
      <img key={photo.src} src={photo.src} alt={shortName(name)} loading={eager ? "eager" : "lazy"} decoding="async" referrerPolicy="no-referrer"
        onError={() => setStage((s) => s + 1)} className="absolute inset-0 h-full w-full object-cover" />
      <a href={photo.credit} target="_blank" rel="noopener noreferrer" className="absolute bottom-2 end-2 rounded-full bg-ink/70 px-2 py-0.5 text-[11px] font-semibold text-white no-underline hover:bg-ink">{t.photoCredit}</a>
    </div>
  );
}
