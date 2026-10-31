import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LangProvider } from "./src/shared/i18n";
import HomePage from "./src/features/home/HomePage";
import { CookieBanner } from "./src/shared/ui/CookieBanner";
import { FeedbackButton } from "./src/shared/ui/FeedbackButton";
import { lazy, Suspense } from "react";

// Every page except the home page is its own chunk, loaded when visited (keeps the first load light on phones).
const AdminPage = lazy(() => import("./src/features/admin/AdminPage"));
const PrivacyPage = lazy(() => import("./src/features/legal/PrivacyPage"));
const TermsPage = lazy(() => import("./src/features/legal/TermsPage"));
const AccessibilityPage = lazy(() => import("./src/features/legal/AccessibilityPage"));
const AboutPage = lazy(() => import("./src/features/legal/AboutPage"));
const SellPage = lazy(() => import("./src/features/sell/SellPage"));
const SellCardPage = lazy(() => import("./src/features/sell/SellCardPage"));
const PartnerPortalPage = lazy(() => import("./src/features/partner/PartnerPortalPage"));
const ComparePage = lazy(() => import("./src/features/compare/ComparePage"));
const CompareIndexPage = lazy(() => import("./src/features/compare/CompareIndexPage"));
const LeasingPage = lazy(() => import("./src/features/leasing/LeasingPage"));
const LandingPage = lazy(() => import("./src/features/landing/LandingPage"));
const BrowsePage = lazy(() => import("./src/features/browse/BrowsePage"));
const GuidePage = lazy(() => import("./src/features/guides/GuidePage").then((m) => ({ default: m.GuidePage })));
const GuidesIndexPage = lazy(() => import("./src/features/guides/GuidePage").then((m) => ({ default: m.GuidesIndexPage })));
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Suspense fallback={<div className="min-h-screen bg-mist" aria-busy="true" />}>
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/admin/leads" component={AdminPage} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/partner" component={PartnerPortalPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/accessibility" component={AccessibilityPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/compare/:slug" component={ComparePage} />
      <Route path="/compare" component={CompareIndexPage} />
      <Route path="/leasing" component={LeasingPage} />
      <Route path="/guides/:slug" component={GuidePage} />
      <Route path="/guides" component={GuidesIndexPage} />
      <Route path="/sell/card" component={SellCardPage} />
      <Route path="/sell" component={SellPage} />
      <Route path="/go/:slug" component={LandingPage} />
      <Route path="/cars/:make/:model" component={BrowsePage} />
      <Route path="/cars/:make" component={BrowsePage} />
      <Route path="/cars" component={BrowsePage} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
    </Suspense>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <LangProvider>
          <TooltipProvider>
            <Toaster position="top-center" toastOptions={{ style: { borderRadius: 999, background: "#0e1b2c", color: "#ffffff", border: "none", fontFamily: "Assistant, sans-serif", fontSize: 15 } }} />
            <Router />
            <CookieBanner />
            <FeedbackButton />
          </TooltipProvider>
        </LangProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
