import { Star } from "lucide-react";

/**
 * Five stars for a 0–10 value; each point is half a star.
 * Always rendered left-to-right (dir="ltr") so half stars fill from the correct side in Hebrew pages.
 */
export function Stars({ value, size = 16 }: { value: number; size?: number }) {
  const filled = Math.round(value) / 2;
  return (
    <span className="inline-flex" aria-hidden dir="ltr">
      {[0, 1, 2, 3, 4].map((i) => {
        const part = Math.max(0, Math.min(1, filled - i));
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <Star className="absolute inset-0 text-[#d5dbe3]" style={{ width: size, height: size }} fill="currentColor" strokeWidth={0} />
            {part > 0 && (
              <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${part * 100}%` }}>
                <Star className="absolute left-0 top-0 max-w-none text-[#f5a524]" style={{ width: size, height: size }} fill="currentColor" strokeWidth={0} />
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}
