/**
 * /api/trpc/* and /api/oauth/* — the Express API (catalog, leads, auth) as one Vercel function.
 * Requires DATABASE_URL (and auth env vars) in the Vercel project settings.
 *
 * The router rewrites /api/<path> to /api/trpc?__p=<path>; restore the original
 * path so Express sees the URL the browser requested.
 */
import { createApiApp } from "../app.ts";

const app = createApiApp();

export default function handler(req: any, res: any) {
  const url = new URL(req.url ?? "/", "http://local");
  const original = url.searchParams.get("__p");
  if (original) {
    url.searchParams.delete("__p");
    const query = url.searchParams.toString();
    req.url = `/api/${original}${query ? `?${query}` : ""}`;
  }
  return app(req, res);
}
