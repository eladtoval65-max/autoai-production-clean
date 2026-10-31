/**
 * Sends an email to the site owner (AUTOAI_CONTACT_EMAIL) through Resend's HTTP API.
 * No-op when RESEND_API_KEY or the address is missing. Never logs content — only the HTTP status on failure.
 */
export async function sendOwnerEmail(subject: string, html: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY?.trim();
  const to = process.env.AUTOAI_CONTACT_EMAIL?.trim();
  if (!key || !to) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({ from: process.env.LEAD_EMAIL_FROM?.trim() || "CamaOla <onboarding@resend.dev>", to: [to], subject, html }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error("[Email] send failed", res.status);
    return res.ok;
  } catch (error) {
    console.error("[Email] send error", error instanceof Error ? error.name : "unknown");
    return false;
  }
}

/** True when a verified sender domain is configured (LEAD_EMAIL_FROM). Resend's shared test sender only reaches the account owner. */
export const canEmailCustomers = () => /@/.test(process.env.LEAD_EMAIL_FROM ?? "") && !/resend\.dev/.test(process.env.LEAD_EMAIL_FROM ?? "");

/** Email to a customer (price alerts). Requires RESEND_API_KEY and a verified LEAD_EMAIL_FROM. Never logs the address. */
export async function sendCustomerEmail(to: string, subject: string, html: string, unsubscribeUrl?: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key || !canEmailCustomers()) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({ from: process.env.LEAD_EMAIL_FROM!.trim(), to: [to], subject, html,
        ...(unsubscribeUrl ? { headers: { "List-Unsubscribe": `<${unsubscribeUrl}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" } } : {}) }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error("[Email] customer send failed", res.status);
    return res.ok;
  } catch (error) {
    console.error("[Email] customer send error", error instanceof Error ? error.name : "unknown");
    return false;
  }
}
