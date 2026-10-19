import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LangProvider } from "./i18n";
import Home from "./pages/Home";
import AdminLeads from "./pages/AdminLeads";
import Privacy from "./pages/Privacy";
import Landing from "./Landing";
import Browse from "./Browse";
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin/leads" component={AdminLeads} />
      <Route path="/admin" component={AdminLeads} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/go/:slug" component={Landing} />
      <Route path="/cars/:make/:model" component={Browse} />
      <Route path="/cars/:make" component={Browse} />
      <Route path="/cars" component={Browse} />
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
          </TooltipProvider>
        </LangProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
