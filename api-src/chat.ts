type ChatMessage = { role: "user" | "assistant"; content: string };

export const config = {
  api: { bodyParser: true },
};

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(503).json({ error: "AI is not configured" });

  try {
    const body = req.body || {};
    const messages = (Array.isArray(body.messages) ? body.messages : [])
      .filter((m: ChatMessage) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
      .slice(-10);
    if (!messages.length) return res.status(400).json({ error: "At least one message is required" });

    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5",
        max_tokens: 900,
        system: body.system || "You are AutoAI, a helpful Israeli car-buying advisor.",
        messages,
      }),
    });
    const data = await upstream.json();
    if (!upstream.ok) {
      console.error("[Chat] Anthropic error", upstream.status, data?.error?.type, data?.error?.message);
      return res.status(502).json({ error: "AI provider rejected the request", providerStatus: upstream.status });
    }
    const reply = Array.isArray(data?.content) ? data.content.filter((item: any) => item?.type === "text").map((item: any) => item.text).join("\n") : "";
    return res.status(200).json({ reply: reply || "מצטער, נסה שוב." });
  } catch (error) {
    console.error("[Chat] server error", error);
    return res.status(500).json({ error: "Server error" });
  }
}
