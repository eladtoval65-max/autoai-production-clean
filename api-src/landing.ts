/**
 * GET /api/landing?slug= — public content of an owner-edited landing page (/go/:slug).
 * Returns only active pages and only display fields.
 */
import { getPool } from "../dbConnection";
import { ensureSchema } from "../schemaSetup";

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") return res.status(405).end();
  const slug = String(req.query?.slug ?? "").toLowerCase();
  if (!/^[a-z0-9-]{2,60}$/.test(slug)) return res.status(400).json({ error: "bad_slug" });
  const pool = getPool();
  if (!pool) return res.status(404).json({ error: "not_found" });
  try {
    await ensureSchema(pool);
    const [rows] = await pool.query("SELECT slug, title, subtitle, bullets, ctaText, leadType FROM landing_pages WHERE slug = ? AND active = 1", [slug]);
    const lp = (rows as any[])[0];
    if (!lp) return res.status(404).json({ error: "not_found" });
    let bullets: string[] = [];
    try { bullets = JSON.parse(lp.bullets || "[]"); } catch { /* keep empty */ }
    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json({ ...lp, bullets });
  } catch (e: any) {
    console.error("[Landing] read failed", e?.code ?? e?.name ?? "unknown");
    return res.status(500).json({ error: "db_error" });
  }
}
