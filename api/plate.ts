/**
 * GET /api/plate?n=<7–8 digit plate> — official vehicle record from the Ministry of Transport
 * open-data registry (data.gov.il, "מספרי רישוי של כלי רכב פרטיים ומסחריים").
 * Security: never log plate numbers or request details; 12 requests/minute/IP.
 */
const RESOURCE_ID = "053cea08-09bc-40ec-8f7a-156f0677aff3";
const RATE_LIMIT = 12;
const WINDOW_MS = 60_000;
const hits = new Map<string, number[]>();
const cache = new Map<string, { at: number; body: unknown }>();

function clientIp(req: any): string {
  const fwd = req.headers?.["x-forwarded-for"];
  const first = Array.isArray(fwd) ? fwd[0] : typeof fwd === "string" ? fwd.split(",")[0] : "";
  return (first || req.headers?.["x-real-ip"] || "unknown").toString().trim();
}
function limited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now); hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > RATE_LIMIT;
}
const pick = (r: Record<string, unknown>, ...keys: string[]) => {
  for (const k of keys) { const v = r[k]; if (v !== undefined && v !== null && String(v).trim() !== "") return String(v).trim(); }
  return null;
};

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  if (limited(clientIp(req))) return res.status(429).json({ error: "Too many requests" });
  const raw = String(req.query?.n ?? new URL(req.url ?? "/", "http://x").searchParams.get("n") ?? "").replace(/\D/g, "");
  if (!/^\d{7,8}$/.test(raw)) return res.status(400).json({ error: "invalid_plate" });

  const hit = cache.get(raw);
  if (hit && Date.now() - hit.at < 3_600_000) return res.status(200).json(hit.body);

  try {
    const url = `https://data.gov.il/api/3/action/datastore_search?resource_id=${RESOURCE_ID}&filters=${encodeURIComponent(JSON.stringify({ mispar_rechev: Number(raw) }))}&limit=1`;
    const upstream = await fetch(url, { headers: { accept: "application/json" }, signal: AbortSignal.timeout(8000) });
    if (!upstream.ok) return res.status(502).json({ error: "registry_unavailable", status: upstream.status });
    const data: any = await upstream.json();
    const r = data?.result?.records?.[0];
    if (!r) {
      const body = { found: false };
      cache.set(raw, { at: Date.now(), body });
      return res.status(200).json(body);
    }
    const body = {
      found: true,
      source: "משרד התחבורה · data.gov.il",
      plate: raw,
      make: pick(r, "tozeret_nm"),
      model: pick(r, "kinuy_mishari", "degem_nm"),
      modelCode: pick(r, "degem_nm"),
      trim: pick(r, "ramat_gimur"),
      year: pick(r, "shnat_yitzur"),
      fuel: pick(r, "sug_delek_nm"),
      color: pick(r, "tzeva_rechev"),
      ownership: pick(r, "baalut"),
      lastTest: pick(r, "mivchan_acharon_dt"),
      licenseValidUntil: pick(r, "tokef_dt"),
      onRoadSince: pick(r, "moed_aliya_lakvish"),
      safetyLevel: pick(r, "ramat_eivzur_betihuty"),
      pollutionGroup: pick(r, "kvutzat_zihum"),
    };
    cache.set(raw, { at: Date.now(), body });
    if (cache.size > 2000) cache.clear();
    return res.status(200).json(body);
  } catch (error) {
    console.error("[Plate] registry error", error instanceof Error ? error.name : "unknown");
    return res.status(502).json({ error: "registry_unavailable" });
  }
}
