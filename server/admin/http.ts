/**
 * Small HTTP helpers shared by the admin action handlers.
 * Handlers throw `HttpError` for client mistakes; the router turns it into a JSON response.
 */
import type { Pool } from "mysql2/promise";

/** Everything an action handler needs. `query` = URL params (GET), `body` = JSON body (POST). */
export type ActionContext = { pool: Pool; query: Record<string, any>; body: Record<string, any> }; // eslint-disable-line @typescript-eslint/no-explicit-any
export type ActionResult = Record<string, unknown>;
export type Action = (ctx: ActionContext) => Promise<ActionResult>;

/** A 4xx answer with a machine-readable code (translated to Hebrew in the admin UI). */
export class HttpError extends Error {
  constructor(public code: string, public status = 400) { super(code); }
}
export const fail = (code: string, status = 400): never => { throw new HttpError(code, status); };

/** Trimmed string capped at `max` chars ("" for non-strings). */
export const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
/** Like `str`, but empty → null (for nullable columns). */
export const optStr = (v: unknown, max: number) => str(v, max) || null;
/** Rounded integer or null. */
export const int = (v: unknown) => { const n = Number(v); return Number.isFinite(n) ? Math.round(n) : null; };
/** "" / null / undefined → null, otherwise `int`. For optional numeric form fields. */
export const optInt = (v: unknown) => (v === "" || v == null ? null : int(v));

/** Parses a Vercel request body that may arrive as a string or already-parsed object. */
export function parseBody(req: any): Record<string, any> | null { // eslint-disable-line @typescript-eslint/no-explicit-any
  try { return typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body ?? {}; } catch { return null; }
}

/** First IP from x-forwarded-for (Vercel sets it). */
export function clientIp(req: any): string { // eslint-disable-line @typescript-eslint/no-explicit-any
  const f = req.headers?.["x-forwarded-for"];
  return (Array.isArray(f) ? f[0] : typeof f === "string" ? f.split(",")[0] : "unknown").trim();
}

/** Rows from a mysql2 query result. */
export const rows = <T = any>(result: unknown) => (result as [T[], unknown])[0]; // eslint-disable-line @typescript-eslint/no-explicit-any
