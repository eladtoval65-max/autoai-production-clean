import { lazy, Suspense, useState } from "react";
import { createPortal } from "react-dom";
import { STORIES } from "./stories";

const StoryViewer = lazy(() => import("./StoryViewer").then((m) => ({ default: m.StoryViewer })));

/** Row of round story bubbles (budget tiers + new/used/leasing). Scrolls sideways on small phones. */
export function StoriesStrip() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <>
      <ul aria-label="סטוריז" className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none]">
        {STORIES.map((s, k) => (
          <li key={s.id} className="shrink-0">
            <button onClick={() => setOpen(k)} className="flex w-[76px] flex-col items-center gap-1.5 text-center">
              <span className="rounded-full p-[3px]" style={{ background: `conic-gradient(${s.ring}, #ffc24b, ${s.ring})` }}>
                <span className="flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-deep bg-mint text-[14px] font-extrabold leading-tight text-deep">
                  {s.id.startsWith("b") ? s.label.replace("עד ", "") : "?"}
                </span>
              </span>
              <span className="text-[12px] font-semibold leading-tight text-white">{s.label}</span>
            </button>
          </li>
        ))}
      </ul>
      {/* Portal: the hero is its own stacking context, so the viewer must render at <body> level to cover the header. */}
      {open != null && createPortal(<Suspense fallback={null}><StoryViewer stories={STORIES} start={open} onClose={() => setOpen(null)} /></Suspense>, document.body)}
    </>
  );
}
