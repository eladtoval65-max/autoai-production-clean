/**
 * Formatting helpers for the admin screens. Pure functions.
 */
const nf = new Intl.NumberFormat("he-IL");
export const num = (n: number) => nf.format(n);
export const money = (n: number | null | undefined) => (n == null ? "—" : `₪${nf.format(Number(n))}`);
export const when = (d: string | null) => (d ? new Date(d).toLocaleString("he-IL", { dateStyle: "short", timeStyle: "short" }) : "—");

/** ISO date → value for <input type="datetime-local"> in the browser's local time. */
export function toLocalInput(d: string | null): string {
  if (!d) return "";
  const x = new Date(d);
  return new Date(x.getTime() - x.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

/** Israeli mobile "05X…" → international "9725X…" for WhatsApp links. */
export const intlPhone = (p: string) => (p.startsWith("0") ? `972${p.slice(1)}` : p);

/** True when a follow-up time has passed and the lead is still open. */
export const isOverdue = (followUpAt: string | null, status: string, closed: string[]) =>
  Boolean(followUpAt && new Date(followUpAt).getTime() <= Date.now() && !closed.includes(status));
