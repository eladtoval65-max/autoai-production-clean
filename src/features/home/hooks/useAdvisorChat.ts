/**
 * Advisor chat state and the call to /api/chat (Anthropic, server-side key).
 * Errors are turned into plain-language messages, including the provider's own reason when it rejects a request.
 */
import { useState } from "react";
import { useLang } from "../../../shared/i18n";
import { formatTime } from "../../../shared/format";

export type ChatMessage = { from: "ai" | "user"; text: string; time: string };
type Dict = ReturnType<typeof useLang>["t"];

/** Error codes thrown inside `send` and mapped to user-facing text. */
function errorText(code: string, providerMessage: string, t: Dict): string {
  if (code === "CFG") return t.chatNotConfigured;
  if (code === "RATE") return t.chatRate;
  if (code.startsWith("PROVIDER")) {
    const [, status = "", ...type] = code.split("_");
    const base = t.chatProviderCode(status, type.join("_"));
    return providerMessage ? `${base}\n\nAnthropic: ${providerMessage}` : base;
  }
  return t.chatFail(code.startsWith("HTTP_") ? code.slice(5) : "");
}

/** HTTP status → error code. */
const codeForStatus = (status: number, data: { providerStatus?: number; providerError?: string } | null) =>
  status === 503 ? "CFG" : status === 502 ? `PROVIDER_${data?.providerStatus ?? ""}_${data?.providerError ?? ""}` : status === 429 ? "RATE" : `HTTP_${status}`;

export function useAdvisorChat() {
  const { lang, t } = useLang();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const reply = (text: string) => setMessages((p) => [...p, { from: "ai", text, time: formatTime(lang) }]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || loading) return;
    const next: ChatMessage[] = [...messages, { from: "user", text: q, time: formatTime(lang) }];
    setMessages(next);
    setLoading(true);
    let providerMessage = "";
    try {
      const res = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.map((m) => ({ role: m.from === "user" ? "user" : "assistant", content: m.text })) }),
      });
      const data = await res.json().catch(() => { throw new Error(`HTTP_${res.status}`); });
      providerMessage = typeof data?.providerMessage === "string" ? data.providerMessage : "";
      if (!res.ok) throw new Error(codeForStatus(res.status, data));
      reply(data.reply || t.chatEmpty);
    } catch (err) {
      reply(errorText(err instanceof Error ? err.message : "", providerMessage, t));
    } finally {
      setLoading(false);
    }
  }

  return { messages, loading, send };
}
