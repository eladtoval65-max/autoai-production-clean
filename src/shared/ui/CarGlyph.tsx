/** Original flat side-view car used across the brand (sticker, poster hero, social posts). No real model's features. */
export function CarGlyph({ body = "#0a7c59", glass = "#ffffff", className = "" }: { body?: string; glass?: string; className?: string }) {
  return (
    <svg viewBox="0 0 196 80" className={className} aria-hidden focusable="false">
      <path d="M8 62 Q6 46 20 42 L44 38 L66 18 Q72 12 82 12 L128 12 Q138 12 144 20 L160 38 Q178 40 184 48 Q188 54 188 62 Z" fill={body} />
      <path d="M70 38 L84 20 Q86 18 90 18 L106 18 L106 38 Z" fill={glass} />
      <path d="M112 18 L128 18 Q133 18 136 22 L148 38 L112 38 Z" fill={glass} />
      <circle cx="50" cy="64" r="15" fill="#0e1b2c" /><circle cx="50" cy="64" r="6" fill="#e8eef2" />
      <circle cx="150" cy="64" r="15" fill="#0e1b2c" /><circle cx="150" cy="64" r="6" fill="#e8eef2" />
      <rect x="176" y="46" width="10" height="5" rx="2" fill="#ffd166" />
    </svg>
  );
}
