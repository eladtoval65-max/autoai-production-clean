/**
 * A neutral round badge with a make's initials (e.g. "T", "LR").
 * Deliberately NOT the manufacturer's logo: logos are trademarks, so we show our own simple mark instead.
 */

/** Calm, readable tones (white text passes contrast on all of them). */
const TONES = ["#0A7C59", "#1F5F8B", "#7A4E9C", "#A1502A", "#2F6F6A", "#8A3B5C", "#4B5D23", "#5B4A8A"];

/** Up to two initials from the English name: "Toyota" → "T", "Land Rover" → "LR", "Mercedes-Benz" → "MB". */
export function makeInitials(name: string): string {
  const parts = name.split(/[\s-]+/).filter((p) => /^[A-Za-z0-9]/.test(p)); // skips "&"
  return parts.slice(0, 2).map((p) => p[0]!.toUpperCase()).join("") || "?";
}

/** The same make always gets the same colour (simple string hash → palette index). */
export function makeTone(id: string): string {
  let h = 0;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return TONES[h % TONES.length]!;
}

export function MakeBadge({ id, name, size = 44 }: { id: string; name: string; size?: number }) {
  const initials = makeInitials(name);
  return (
    <span
      aria-hidden
      dir="ltr"
      className="inline-flex shrink-0 items-center justify-center rounded-full font-display font-bold text-white"
      style={{ width: size, height: size, background: makeTone(id), fontSize: size * (initials.length > 1 ? 0.36 : 0.44) }}
    >
      {initials}
    </span>
  );
}
