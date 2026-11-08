import { CarGlyph } from "../../../shared/ui/CarGlyph";

/**
 * Decorative background of the home hero, drawn like the social posts: dusk sky, sun, hills and a road with our car.
 * Pure SVG/CSS (no image request); hidden from screen readers. The car sits on the left so Hebrew text on the right stays clear.
 */
export function PosterScene() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#062b22_0%,#0b3d2e_45%,#1f6b52_100%)]" />
      <div className="absolute left-[8%] top-10 hidden h-36 w-36 rounded-full bg-sun/80 sm:block" />
      <svg viewBox="0 0 1200 200" preserveAspectRatio="none" className="absolute inset-x-0 bottom-16 h-28 w-full opacity-30 sm:h-36">
        <path d="M0 200 L0 120 L180 40 L330 110 L520 20 L700 100 L860 30 L1040 110 L1200 60 L1200 200 Z" fill="#000" />
      </svg>
      <div className="absolute inset-x-0 bottom-0 h-20 bg-[#16201c]">
        <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,.55)_0_48px,transparent_48px_92px)]" />
      </div>
      <CarGlyph body="#ff7a1a" glass="#ffe7d3" className="poster-car absolute bottom-10 left-[6%] h-16 w-auto sm:h-24 lg:left-[10%]" />
    </div>
  );
}
