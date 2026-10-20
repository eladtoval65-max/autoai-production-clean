/**
 * /go/:slug — owner-editable campaign landing page. Content is edited in the admin CRM (landing_pages table).
 * Leads go through the same consented form and are tagged with the landing slug and UTM source.
 */
import { useState } from "react";
import { useParams } from "wouter";
import LeadRequestModal from "../leads/LeadRequestModal";
import { sendEvent } from "../../shared/analytics";
import { BrandMark } from "../../shared/ui/BrandMark";
import { LandingHero } from "./components/LandingHero";
import { LandingUnavailable } from "./components/LandingUnavailable";
import { LeadAside } from "./components/LeadAside";
import { useLandingContent } from "./hooks/useLandingContent";

export default function LandingPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const page = useLandingContent(slug);
  const [formOpen, setFormOpen] = useState(false);
  const openForm = () => { setFormOpen(true); sendEvent("lead_open", `go:${slug}`, false); };

  return (
    <div dir="rtl" className="min-h-screen bg-white text-ink">
      <header className="mx-auto flex max-w-[1080px] items-center justify-between px-4 py-5 sm:px-8"><BrandMark href="/" /></header>

      {page === undefined && <main className="mx-auto max-w-[1080px] px-4 py-24 sm:px-8"><div className="h-12 w-2/3 animate-pulse rounded-xl bg-mist" /></main>}
      {page === null && <LandingUnavailable />}
      {page && (
        <main className="mx-auto grid max-w-[1080px] gap-10 px-4 pb-24 pt-8 sm:px-8 lg:grid-cols-[1.15fr_.85fr] lg:pt-16">
          <LandingHero page={page} onCta={openForm} />
          <LeadAside ctaText={page.ctaText} onCta={openForm} />
        </main>
      )}

      {formOpen && page && (
        <LeadRequestModal vehicle={{ id: `landing-${page.slug}`, make: page.title, match: 0 }} sourcePage="landing" landingSlug={page.slug} defaultType={page.leadType} onClose={() => setFormOpen(false)} />
      )}
    </div>
  );
}
