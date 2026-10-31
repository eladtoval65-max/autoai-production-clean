/**
 * Price-drop email alerts for a model's new-car list price.
 *  - subscribe(): separate, explicit marketing consent (its own checkbox and text, versioned); one row per email+model;
 *  - unsubscribe(): one click from every email (token);
 *  - runAlerts(): daily (from the health cron) — compares today's list price (src/data/generations.ts, updated by
 *    the daily data agent) with the price at subscription / last email, and emails only on a DROP.
 * Sending to customers needs a verified sender domain (LEAD_EMAIL_FROM); until then subscriptions are stored and
 * nothing is sent. Never log email addresses.
 */
import { randomBytes } from "node:crypto";
import type { Pool } from "mysql2/promise";
import { MAKES } from "../../src/data/generations";
import { canEmailCustomers, sendCustomerEmail } from "../email";
import { escapeHtml } from "../public/http";

export const ALERT_CONSENT_VERSION = "2026-10-31";
export const alertConsentText = (modelName: string) =>
  `אני מסכים/ה לקבל מ״כמה עולה״ מייל כשמחיר המחירון של ${modelName} יורד. רק על הדגם הזה, ואפשר להסיר בלחיצה בכל מייל.`;

const rows = <T>(r: unknown) => (r as [T[], unknown])[0];

/** Model + its current lowest list price, or null. */
export function modelOf(makeId: string, modelId: string) {
  const make = MAKES.find((m) => m.id === makeId);
  const model = make?.models.find((m) => m.id === modelId);
  return make && model ? { make, model, name: `${make.he} ${model.he}`, price: model.price?.[0] ?? null } : null;
}

export async function subscribe(pool: Pool, email: string, makeId: string, modelId: string): Promise<"ok" | "no_model"> {
  const m = modelOf(makeId, modelId);
  if (!m) return "no_model";
  const existing = rows<{ id: number }>(await pool.query("SELECT id FROM price_alerts WHERE email = ? AND makeId = ? AND modelId = ?", [email, makeId, modelId]))[0];
  if (existing) {
    await pool.query("UPDATE price_alerts SET unsubscribedAt = NULL, lastPrice = ?, consentVersion = ?, consentText = ? WHERE id = ?",
      [m.price, ALERT_CONSENT_VERSION, alertConsentText(m.name), existing.id]);
  } else {
    await pool.query("INSERT INTO price_alerts (email, makeId, modelId, lastPrice, token, consentVersion, consentText) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [email, makeId, modelId, m.price, randomBytes(24).toString("base64url"), ALERT_CONSENT_VERSION, alertConsentText(m.name)]);
  }
  return "ok";
}

export async function unsubscribe(pool: Pool, token: string): Promise<boolean> {
  if (!/^[\w-]{20,64}$/.test(token)) return false;
  const [res] = await pool.query("UPDATE price_alerts SET unsubscribedAt = NOW() WHERE token = ? AND unsubscribedAt IS NULL", [token]) as unknown as [{ affectedRows: number }];
  return res.affectedRows > 0;
}

const ils = (n: number) => `₪${n.toLocaleString("he-IL")}`;

function alertHtml(name: string, oldP: number, newP: number, page: string, unsub: string) {
  return `<div dir="rtl" style="font-family:Arial,sans-serif;font-size:16px;color:#0e1b2c">
<h2 style="margin:0 0 8px">המחיר של ${escapeHtml(name)} ירד</h2>
<p>מחיר המחירון החדש: <b>${ils(newP)}</b> (היה ${ils(oldP)} — ירידה של ${ils(oldP - newP)}).</p>
<p>המחיר לפי מחירון היבואן כפי שפורסם; המחיר בפועל אצל הסוכנות יכול להיות שונה.</p>
<p><a href="${page}" style="background:#0a7c59;color:#fff;padding:10px 16px;border-radius:999px;text-decoration:none;font-weight:bold">כמה זה יעלה לי בחודש</a></p>
<p style="color:#4d5b6c;font-size:13px;margin-top:24px">קיבלת את המייל כי ביקשת התראה על הדגם הזה באתר ״כמה עולה״. <a href="${unsub}">הסרה מההתראה</a></p></div>`;
}

/** Daily run. Returns counts only (no addresses). */
export async function runAlerts(pool: Pool, siteUrl: string): Promise<{ checked: number; sent: number; waitingForDomain: number }> {
  const active = rows<{ id: number; email: string; makeId: string; modelId: string; lastPrice: number | null; token: string }>(
    await pool.query("SELECT id, email, makeId, modelId, lastPrice, token FROM price_alerts WHERE unsubscribedAt IS NULL LIMIT 5000"));
  let sent = 0, waiting = 0;
  for (const a of active) {
    const m = modelOf(a.makeId, a.modelId);
    if (!m || m.price == null) continue;
    if (a.lastPrice == null || m.price > a.lastPrice) { await pool.query("UPDATE price_alerts SET lastPrice = ? WHERE id = ?", [m.price, a.id]); continue; }
    if (m.price === a.lastPrice) continue;
    // Price dropped.
    if (!canEmailCustomers()) { waiting++; continue; } // keep lastPrice so the email goes out once the domain is verified
    const unsub = `${siteUrl}/api/alerts?unsub=${a.token}`;
    const ok = await sendCustomerEmail(a.email, `המחיר של ${m.name} ירד ל־${ils(m.price)}`, alertHtml(m.name, a.lastPrice, m.price, `${siteUrl}/cars/${a.makeId}/${a.modelId}`, unsub), unsub);
    if (ok) { sent++; await pool.query("UPDATE price_alerts SET lastPrice = ?, lastSentAt = NOW() WHERE id = ?", [m.price, a.id]); }
  }
  return { checked: active.length, sent, waitingForDomain: waiting };
}
