/**
 * Small helpers shared by the public (no-login) API functions: body parsing, a per-IP limiter, HTML escaping.
 * Never log request bodies, emails or IPs here.
 */
export function bodyOf(req: { body?: unknown }): Record<string, unknown> {
  try { return (typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body as Record<string, unknown>) ?? {}) ?? {}; } catch { return {}; }
}

/** Creates a limiter: at most `max` calls per `windowMs` per key (per server instance). */
export function makeLimiter(max: number, windowMs: number) {
  const hits = new Map<string, number[]>();
  return (key: string, now = Date.now()) => {
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    recent.push(now);
    hits.set(key, recent);
    if (hits.size > 5000) hits.clear();
    return recent.length > max;
  };
}

export const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Plausible email address (or empty). */
export const isEmail = (s: string) => /^[^\s@<>]{1,64}@[^\s@<>]{1,120}\.[a-z]{2,}$/i.test(s);
