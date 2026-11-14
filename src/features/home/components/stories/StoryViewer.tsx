import { X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { sendEvent } from "../../../../shared/analytics";
import { CarGlyph } from "../../../../shared/ui/CarGlyph";
import type { Story } from "./stories";

const SLIDE_MS = 5000;

/**
 * Full-screen story player: progress bars, auto-advance every 5s (paused while pressed or for reduced motion),
 * tap the left half for next / right half for back (RTL), arrows and Esc on the keyboard. Moves to the next story at the end.
 */
export function StoryViewer({ stories, start, onClose }: { stories: Story[]; start: number; onClose: () => void }) {
  const [si, setSi] = useState(start);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const slides = useMemo(() => stories[si].build(), [stories, si]);
  const reduced = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

  const next = useCallback(() => {
    if (i < slides.length - 1) setI(i + 1);
    else if (si < stories.length - 1) { setSi(si + 1); setI(0); }
    else onClose();
  }, [i, si, slides.length, stories.length, onClose]);
  const prev = useCallback(() => { if (i > 0) setI(i - 1); else if (si > 0) { setSi(si - 1); setI(0); } }, [i, si]);

  useEffect(() => { sendEvent("story_view", stories[si].id, false); }, [si, stories]);
  useEffect(() => {
    if (paused || reduced) return;
    const t = setTimeout(next, SLIDE_MS);
    return () => clearTimeout(t);
  }, [i, si, paused, reduced, next]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); else if (e.key === "ArrowLeft") next(); else if (e.key === "ArrowRight") prev(); };
    addEventListener("keydown", onKey); document.body.style.overflow = "hidden";
    return () => { removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [next, prev, onClose]);

  const s = slides[i];
  return (
    <div role="dialog" aria-modal="true" aria-label={stories[si].label} className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90" dir="rtl">
      <div className="relative flex h-full max-h-[860px] w-full max-w-[480px] flex-col overflow-hidden bg-[linear-gradient(180deg,#062b22_0%,#0b3d2e_55%,#1f6b52_100%)] text-white sm:rounded-3xl"
        onPointerDown={() => setPaused(true)} onPointerUp={() => setPaused(false)} onPointerLeave={() => setPaused(false)}>
        <div className="flex gap-1 px-3 pt-3" aria-hidden>
          {slides.map((_, k) => (
            <span key={k} className="h-1 flex-1 overflow-hidden rounded-full bg-white/30">
              <span className={`block h-full bg-white ${k < i ? "w-full" : k > i ? "w-0" : ""}`}
                style={k === i ? { width: reduced ? "100%" : undefined, animation: reduced ? undefined : `story-progress ${SLIDE_MS}ms linear forwards`, animationPlayState: paused ? "paused" : "running" } : undefined} key={`${si}-${i}-${k}`} />
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between px-4 pt-3">
          <span className="flex items-center gap-2 rounded-full bg-mint px-3 py-1 text-[14px] font-bold text-deep"><CarGlyph className="h-3.5 w-auto" />{stories[si].label}</span>
          <button onClick={onClose} aria-label="סגירה" className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-white/10"><X className="h-6 w-6" /></button>
        </div>
        <div className="relative flex flex-1 flex-col justify-end px-6 pb-10" aria-live="polite">
          {/* Tap zones: right = back, left = next (Hebrew reading direction). */}
          <button aria-label="הקודם" onClick={prev} className="absolute inset-y-0 right-0 w-1/3" />
          <button aria-label="הבא" onClick={next} className="absolute inset-y-0 left-0 w-2/3" />
          <span className="relative w-fit rounded-full bg-pop px-4 py-1 text-[15px] font-extrabold text-ink">{s.kicker}</span>
          {s.big && <p className="num relative mt-4 text-[clamp(3.2rem,15vw,5rem)] leading-none text-sun">{s.big}</p>}
          <h2 className="relative mt-3 text-[clamp(1.8rem,7vw,2.4rem)] leading-tight">{s.title}</h2>
          {s.sub && <p className="relative mt-3 text-[17px] leading-7 text-white/85">{s.sub}</p>}
          {s.cta && <Link href={s.cta.href} onClick={onClose} className="relative z-10 mt-6 inline-flex min-h-13 items-center justify-center rounded-full bg-pop px-6 text-[17px] font-extrabold text-ink no-underline">{s.cta.text} ←</Link>}
          <p className="relative mt-6 text-[12px] text-white/60">הערכה בלבד · ביטוח אינו הצעת מחיר</p>
        </div>
      </div>
    </div>
  );
}
