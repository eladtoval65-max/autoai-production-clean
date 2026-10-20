import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LangProvider } from "./src/shared/i18n";
import HomePage from "./src/features/home/HomePage";
import AdminPage from "./src/features/admin/AdminPage";
import PrivacyPage from "./src/features/legal/PrivacyPage";
import TermsPage from "./src/features/legal/TermsPage";
import AccessibilityPage from "./src/features/legal/AccessibilityPage";
import AboutPage from "./src/features/legal/AboutPage";
import SellPage from "./src/features/sell/SellPage";
import SellCardPage from "./src/features/sell/SellCardPage";
import { CookieBanner } from "./src/shared/ui/CookieBanner";
import LandingPage from "./src/features/landing/LandingPage";
import BrowsePage from "./src/features/browse/BrowsePage";
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/admin/leads" component={AdminPage} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/accessibility" component={AccessibilityPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/sell/card" component={SellCardPage} />
      <Route path="/sell" component={SellPage} />
      <Route path="/go/:slug" component={LandingPage} />
      <Route path="/cars/:make/:model" component={BrowsePage} />
      <Route path="/cars/:make" component={BrowsePage} />
      <Route path="/cars" component={BrowsePage} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
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
          </TooltipProvider>
        </LangProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
