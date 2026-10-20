/**
 * Shared Tailwind class recipes. Keep visual tokens here so every feature looks the same
 * (colours themselves live as CSS variables in index.css: go, ink, mist, line, muted, alert).
 */

/** White card with the standard border, radius and soft shadow. */
export const card = "rounded-2xl border border-line bg-white shadow-[var(--shadow-card)]";

/** Secondary action: outlined pill. */
export const btnGhost = "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-line bg-white px-4 text-[15px] font-bold text-ink hover:border-ink";

/** Primary action: solid green pill (green is reserved for actions and money). */
export const btnPrimary = "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-go px-5 text-[15px] font-bold text-white hover:bg-go-deep";

/** Standard form field. */
export const field = "mt-1 block min-h-11 w-full rounded-xl border border-line bg-white px-3 text-[16px] outline-none focus:border-go";
