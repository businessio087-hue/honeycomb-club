import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Storefront from "./pages/Storefront";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
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
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
