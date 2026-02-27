import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import StarMapPage from "./pages/StarMapPage";
import SharedMemory from "./pages/SharedMemory";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import StellarAcademy from "./pages/StellarAcademy";
import StellarObservatory from "./pages/StellarObservatory";
import B2CDetailPage from "./pages/B2CDetailPage";
import B2BDetailPage from "./pages/B2BDetailPage";
import B2BSimulator from "./pages/B2BSimulator";
import TechDocsPage from "./pages/TechDocsPage";
import NotFound from "./pages/NotFound";
import ScrollToTopOnMount from "@/components/ScrollToTopOnMount";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <HashRouter>
          <ScrollToTopOnMount />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/starmap" element={<StarMapPage />} />
            <Route path="/memory/:token" element={<SharedMemory />} />
            <Route path="/for-you" element={<B2CDetailPage />} />
            <Route path="/for-missions" element={<B2BDetailPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/academy" element={<StellarAcademy />} />
            <Route path="/observatory" element={<StellarObservatory />} />
            <Route path="/4d" element={<B2BSimulator />} />
            <Route path="/techdocs" element={<TechDocsPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
