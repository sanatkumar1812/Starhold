import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import StellarAcademy from "./pages/StellarAcademy";
import StellarObservatory from "./pages/StellarObservatory";
// import B2BDetailPage from "./pages/B2BDetailPage";
import Mission from "./pages/Mission";
import B2BSimulator from "./pages/B2BSimulator";
import TechDocsPage from "./pages/TechDocsPage";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";
import ScrollToTopOnMount from "@/components/ScrollToTopOnMount";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTopOnMount />
          <Routes>
            <Route path="/" element={<Index />} />
            {/* <Route path="/auth" element={<Auth />} /> */}
            {/* <Route path="/dashboard" element={<Dashboard />} /> */}
            {/* <Route path="/for-missions" element={<B2BDetailPage />} /> */}
            <Route path="/mission" element={<Mission />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/techdocs" element={<TechDocsPage />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/4d" element={<B2BSimulator />} />
            <Route path="/not-found" element={<NotFound />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
