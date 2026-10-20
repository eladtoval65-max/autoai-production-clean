/**
 * Local UI event log + anonymous funnel events.
 * Detailed events go to localStorage only; a few map to server funnel steps (no personal data).
 */
import { sendEvent } from "../../../shared/analytics";

/** Local event name → server funnel step. */
const FUNNEL_MAP: Record<string, string> = { quiz_completed: "quiz_complete", results_viewed: "results_view", plate_check: "plate_check" };

export function track(event: string) {
  const funnelStep = event.startsWith("answer_") ? "quiz_start" : FUNNEL_MAP[event];
  if (funnelStep) sendEvent(funnelStep);
  try {
    const log = JSON.parse(localStorage.getItem("carai-events") || "[]");
    log.push({ event, at: new Date().toISOString() });
    localStorage.setItem("carai-events", JSON.stringify(log.slice(-100)));
  } catch { /* storage unavailable (private mode) */ }
}
