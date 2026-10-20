/**
 * Small, pure formatting helpers shared across features. No React in here.
 */
import type { Lang } from "./i18n";

/** Car display names are stored as "Make Model · Trim"; most UI shows only the part before " · ". */
export const shortName = (make: string) => make.split(" · ")[0];

/** All scores are stored 0–100 and shown on one 1–10 scale with one decimal (8.3), like leading review sites. */
export const ten = (v: number) => Math.round(v) / 10;

/** Current clock time for chat bubbles, in the active language. */
export const formatTime = (lang: Lang) =>
  new Date().toLocaleTimeString(lang === "he" ? "he-IL" : "en-US", { hour: "2-digit", minute: "2-digit" });

/** "a עד b" (or a single value when equal). Words read correctly in RTL, unlike "a–b" which the browser may flip. */
export const rangeText = (a: string | number, b: string | number) => (a === b ? String(a) : `${a} עד ${b}`);
