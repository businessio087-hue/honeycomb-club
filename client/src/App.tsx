import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Router, Switch, useLocation } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { scrollToTop } from "./lib/scrollToTop";
import Storefront from "./pages/Storefront";
import NotFound from "./pages/NotFound";

function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.history.scrollRestoration = "manual";
    scrollToTop();
  }, [location]);

  return null;
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router
            hook={
              import.meta.env.MODE === "static" ||
              import.meta.env.BASE_URL !== "/"
                ? useHashLocation
                : undefined
            }
          >
            <ScrollToTop />
            <Switch>
              <Route path="/" component={Storefront} />
              <Route path="/shop" component={Storefront} />
              <Route path="/about" component={Storefront} />
              <Route path="/contact" component={Storefront} />
              <Route path="/terms" component={Storefront} />
              <Route path="/account" component={Storefront} />
              <Route path="/checkout" component={Storefront} />
              <Route path="/cart" component={Storefront} />
              <Route path="/product/:slug" component={Storefront} />
              <Route path="/404" component={NotFound} />
              <Route component={NotFound} />
            </Switch>
          </Router>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
