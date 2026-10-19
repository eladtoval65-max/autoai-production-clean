/**
 * POST /api/chat — AutoAI advisor chat (Vercel function).
 *
 * Security rules (do not relax):
 * - Never log the API key, the request body, or any contact data.
 * - Rate limit: 12 requests per minute per IP.
 */
type ChatMessage = { role: "user" | "assistant"; content: string };

const RATE_LIMIT = 12;
const WINDOW_MS = 60_000;
const hits = new Map<string, number[]>();

function clientIp(req: any): string {
  const fwd = req.headers?.["x-forwarded-for"];
  const first = Array.isArray(fwd) ? fwd[0] : typeof fwd === "string" ? fwd.split(",")[0] : "";
  return (first || req.headers?.["x-real-ip"] || req.socket?.remoteAddress || "unknown").toString().trim();
}

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // bound memory on a warm instance
  return recent.length > RATE_LIMIT;
}

const DEFAULT_SYSTEM =
  "אתה היועץ של \"כמה עולה\" (KamaOle), יועץ רכב ישראלי אמין. ענה בעברית פשוטה (או באנגלית אם המשתמש כותב באנגלית), הסבר יתרונות וחסרונות, אל תמציא נתונים, סמן אומדנים כאומדנים, ושאל שאלת המשך כשחסר מידע. ביטוח הוא תמיד הערכה בלבד ולא הצעת מחיר.";

export default async function handler(req: any, res: any) {
  // GET = health check for diagnosing deployments. Reports only whether a key exists, never the key.
  if (req.method === "GET") {
    const key = process.env.ANTHROPIC_API_KEY ?? "";
    return res.status(200).json({
      ok: true,
      keyConfigured: key.trim().length > 0,
      keyLooksValid: /^sk-ant-/.test(key.trim()),
      keyHasWhitespace: key.length > 0 && key !== key.trim(),
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5",
      vercelEnv: process.env.VERCEL_ENV ?? "unknown",
    });
  }
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (rateLimited(clientIp(req))) return res.status(429).json({ error: "Too many requests" });

  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) return res.status(503).json({ error: "AI is not configured" });

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const messages: ChatMessage[] = (Array.isArray(body.messages) ? body.messages : [])
      .filter((m: ChatMessage) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
      .map((m: ChatMessage) => ({ role: m.role, content: m.content.slice(0, 2000) }))
      .slice(-10);
    // Anthropic requires the conversation to start with a user turn.
    while (messages.length && messages[0].role !== "user") messages.shift();
    if (!messages.length) return res.status(400).json({ error: "At least one message is required" });

    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5",
        max_tokens: 900,
        system: DEFAULT_SYSTEM,
        messages,
      }),
    });
    const data: any = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      console.error("[Chat] provider error", upstream.status, data?.error?.type);
      return res.status(502).json({ error: "AI provider rejected the request", providerStatus: upstream.status, providerError: data?.error?.type ?? null });
    }
    const reply = Array.isArray(data?.content)
      ? data.content.filter((item: any) => item?.type === "text").map((item: any) => item.text).join("\n")
      : "";
    return res.status(200).json({ reply: reply || "מצטער, נסה שוב." });
  } catch (error) {
    console.error("[Chat] server error", error instanceof Error ? error.name : "unknown");
    return res.status(500).json({ error: "Server error" });
  }
}
