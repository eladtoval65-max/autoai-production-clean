import { useEffect, useState } from "react";
import { wikiPhotoByTitle, type VehiclePhoto } from "../../../shared/vehicleImages";

/** Lead image of a Wikipedia article, with loading shimmer, neutral fallback, and a credit link. */
export function WikiPhoto({ title, className = "" }: { title: string; className?: string }) {
  const [photo, setPhoto] = useState<VehiclePhoto | null | undefined>(undefined); // undefined = loading
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    let live = true;
    setPhoto(undefined); setBroken(false);
    wikiPhotoByTitle(title).then((p) => live && setPhoto(p));
    return () => { live = false; };
  }, [title]);

  if (photo === undefined) return <div className={`animate-pulse bg-mist ${className}`} />;
  if (!photo || broken) return <div className={`bg-gradient-to-b from-[#eef2f6] to-[#e1e7ee] ${className}`} />;
  return (
    <div className={`relative overflow-hidden bg-mist ${className}`}>
      <img src={photo.src} alt="" loading="lazy" decoding="async" referrerPolicy="no-referrer" onError={() => setBroken(true)} className="absolute inset-0 h-full w-full object-cover" />
      <a href={photo.credit} target="_blank" rel="noopener noreferrer" className="absolute bottom-2 end-2 rounded-full bg-ink/70 px-2 py-0.5 text-[11px] font-semibold text-white no-underline hover:bg-ink">צילום: ויקיפדיה</a>
    </div>
  );
}
