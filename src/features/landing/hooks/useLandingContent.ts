/**
 * Loads a landing page's content by slug, remembers UTM parameters, and logs the visit (anonymous funnel).
 * Returns undefined while loading, null when the page doesn't exist / is switched off.
 */
import { useEffect, useState } from "react";
import { getUtm, sendEvent } from "../../../shared/analytics";
import type { LandingContent } from "../types";

export function useLandingContent(slug: string) {
  const [page, setPage] = useState<LandingContent | null | undefined>(undefined);

  useEffect(() => {
    getUtm(); // read utm_* from the URL now, so the lead form can attach them later
    let live = true;
    fetch(`/api/landing?slug=${encodeURIComponent(slug)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (live) setPage(d); })
      .catch(() => { if (live) setPage(null); });
    sendEvent("visit", `go:${slug}`);
    return () => { live = false; };
  }, [slug]);

  useEffect(() => { if (page?.title) document.title = `${page.title} | כמה עולה`; }, [page]);
  return page;
}
