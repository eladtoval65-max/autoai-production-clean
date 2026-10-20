/**
 * Owner authentication for /api/admin, independent of the Manus OAuth flow.
 * ADMIN_PASSWORD → HMAC-signed, HttpOnly, Secure, SameSite=Strict session cookie (12 h). Login is limited to 5 tries per minute per IP.
 * Never log the password or the cookie.
 */
import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE = "autoai_admin";
export const SESSION_MS = 12 * 60 * 60 * 1000;
const LOGIN_LIMIT_PER_MINUTE = 5;
const attempts = new Map<string, number[]>();

/** The configured admin password ("" when not set). */
export const adminSecret = () => process.env.ADMIN_PASSWORD?.trim() ?? "";

const sign = (exp: number) => createHmac("sha256", `autoai:${adminSecret()}`).update(String(exp)).digest("hex");

/** Constant-time string comparison (avoids timing attacks on the password/signature). */
export function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/** True when this IP has made more than 5 login attempts in the last minute. */
export function loginRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (attempts.get(ip) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  attempts.set(ip, recent);
  return recent.length > LOGIN_LIMIT_PER_MINUTE;
}

/** Valid, unexpired, correctly-signed session cookie on this request? */
export function isAuthenticated(req: any): boolean { // eslint-disable-line @typescript-eslint/no-explicit-any
  if (!adminSecret()) return false;
  const raw = String(req.headers?.cookie ?? "").split(/;\s*/).find((c) => c.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1) ?? "";
  const [expStr, sig] = decodeURIComponent(raw).split(".");
  const exp = Number(expStr);
  return Boolean(exp && sig && exp > Date.now() && safeEqual(sig, sign(exp)));
}

/** Sets (or, with maxAgeSec 0, clears) the session cookie. Scoped to /api/admin only. */
function setCookie(res: any, value: string, maxAgeSec: number) { // eslint-disable-line @typescript-eslint/no-explicit-any
  res.setHeader("Set-Cookie", `${COOKIE}=${encodeURIComponent(value)}; Path=/api/admin; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAgeSec}`);
}

export function startSession(res: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
  const exp = Date.now() + SESSION_MS;
  setCookie(res, `${exp}.${sign(exp)}`, SESSION_MS / 1000);
}
export const endSession = (res: any) => setCookie(res, "", 0); // eslint-disable-line @typescript-eslint/no-explicit-any
