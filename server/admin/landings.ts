/**
 * Owner-editable campaign landing pages (/go/:slug). Content only — leads still go through the consented form.
 */
import { LEAD_TYPES } from "./constants";
import { fail, optStr, str, type Action } from "./http";

const MAX_BULLETS = 6;

/** GET landings — each page with its lead count and visits (anonymous "visit" events on go:<slug>). */
export const listLandings: Action = async ({ pool }) => {
  const [result] = await pool.query(`SELECT lp.*,
      (SELECT COUNT(*) FROM leads l WHERE l.landingSlug = lp.slug) AS leadCount,
      (SELECT COUNT(*) FROM site_events e WHERE e.name = 'visit' AND e.page = CONCAT('go:', lp.slug)) AS visits
    FROM landing_pages lp ORDER BY lp.updatedAt DESC`);
  return { landings: result };
};

/** POST landingSave {landing} — upsert by slug. Bullets are stored as a JSON array. */
export const saveLanding: Action = async ({ pool, body }) => {
  const lp = body.landing ?? {};
  const slug = str(lp.slug, 60).toLowerCase();
  const title = str(lp.title, 160);
  const leadType = lp.leadType ?? "vehicle";
  if (!/^[a-z0-9-]{2,60}$/.test(slug) || title.length < 3 || !LEAD_TYPES.includes(leadType)) fail("bad_landing");
  const bullets = Array.isArray(lp.bullets) ? lp.bullets.map((b: unknown) => str(b, 160)).filter(Boolean).slice(0, MAX_BULLETS) : [];
  const values = [title, optStr(lp.subtitle, 400), JSON.stringify(bullets), optStr(lp.ctaText, 80), leadType, lp.active === false ? 0 : 1];
  await pool.query(`INSERT INTO landing_pages (slug, title, subtitle, bullets, ctaText, leadType, active) VALUES (?,?,?,?,?,?,?)
    ON DUPLICATE KEY UPDATE title=VALUES(title), subtitle=VALUES(subtitle), bullets=VALUES(bullets), ctaText=VALUES(ctaText), leadType=VALUES(leadType), active=VALUES(active)`, [slug, ...values]);
  return { ok: true, slug };
};
