import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { CosmicBackground } from '@/components/CosmicBackground';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { UnifiedInfrastructure } from '@/components/UnifiedInfrastructure';
import { UniversalFeatures } from '@/components/UniversalFeatures';
import { MemoryCreator } from '@/components/MemoryCreator';
import { ScrollReveal } from '@/components/ScrollReveal';
import { ScrollToTop } from '@/components/ScrollToTop';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Quote, Star, Satellite, ChevronRight, Type, Sparkles, Calculator } from 'lucide-react';

const Index = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (searchParams.get('create') === 'true') {
      setIsCreating(true);
    }
  }, [searchParams]);

  const scrollToHowItWorks = () => {
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <CosmicBackground />

      <div className="relative z-10">
        <Navigation />

        {isCreating ? (
          <main className="pt-24 pb-12 px-4 min-h-screen">
            <div className="max-w-4xl mx-auto mb-8">
              <Button
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="text-muted-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
            <MemoryCreator />
          </main>
        ) : (
          <>
            <HeroSection
              onStartCreating={() => {
                if (!isAuthenticated) {
                  navigate('/auth?redirect=create');
                } else {
                  setIsCreating(true);
                }
              }}
              onLearnMore={() => {
                const element = document.getElementById('unified-infra');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />

            <UniversalFeatures />

            <div id="unified-infra">
              <ScrollReveal>
                <UnifiedInfrastructure />
              </ScrollReveal>
            </div>

            {/* Pricing Preview */}
            <ScrollReveal>
              <section className="py-24 px-4 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="relative max-w-5xl mx-auto">
                  <div className="text-center mb-14 space-y-3">
                    <p className="text-xs font-mono uppercase tracking-[0.4em] text-muted-foreground">Transparent Data Rates</p>
                    <h2 className="font-serif text-4xl md:text-5xl text-foreground">
                      Pay for Your <span className="text-gradient-gold italic">Payload</span>
                    </h2>
                    <p className="text-muted-foreground max-w-lg mx-auto text-sm leading-relaxed">
                      Scale your cosmic memory efficiently. We charge based on the exact amount of text and media you choose to bind to the stars.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="glass-strong rounded-2xl border border-primary/20 p-8 flex flex-col gap-4 text-center items-center hover:-translate-y-1 transition-transform cursor-pointer" onClick={() => navigate('/pricing')}>
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                        <Type className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-serif text-xl text-foreground">1. Write Your Story</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">Every payload begins with text. From short messages to extensive journals, pay only for what you write.</p>
                      <p className="font-mono text-xs text-primary uppercase mt-auto pt-4">Starting at $5 / ₹200</p>
                    </div>
                    
                    <div className="glass-strong rounded-2xl border border-cosmic-purple/20 p-8 flex flex-col gap-4 text-center items-center hover:-translate-y-1 transition-transform cursor-pointer" onClick={() => navigate('/pricing')}>
                      <div className="w-12 h-12 rounded-full bg-cosmic-purple/10 flex items-center justify-center mb-2">
                        <Sparkles className="w-6 h-6 text-cosmic-purple" />
                      </div>
                      <h3 className="font-serif text-xl text-foreground">2. Attach Media Add-ons</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">Make it vivid. Attach voice notes, video messages, or image galleries to your payload.</p>
                      <p className="font-mono text-xs text-cosmic-purple uppercase mt-auto pt-4">Calculated by min/qty</p>
                    </div>

                    <div className="glass-strong rounded-2xl border border-border/30 bg-slate-950/50 p-8 flex flex-col gap-4 text-center items-center hover:-translate-y-1 transition-transform cursor-pointer" onClick={() => navigate('/pricing')}>
                      <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-2">
                        <Satellite className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <h3 className="font-serif text-xl text-foreground">For Missions (B2B)</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">Custom aerospace-grade verification for CubeSats and commercial assets.</p>
                      <p className="font-mono text-xs text-muted-foreground uppercase mt-auto pt-4">Custom Contract</p>
                    </div>
                  </div>

                  <div className="mt-12 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button variant="gold" className="rounded-xl px-8" onClick={() => navigate('/pricing')}>
                      <Calculator className="w-4 h-4 mr-2" /> Calculate Payload Cost
                    </Button>
                    <Button variant="outline" className="rounded-xl border-border/40" onClick={() => navigate('/pricing')}>
                      View Rate Sheet <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </section>
            </ScrollReveal>

            {/* Testimonials / Legacy Section */}
            <ScrollReveal>
              <section className="py-32 px-4 relative overflow-hidden bg-slate-950/30">
                <div className="max-w-4xl mx-auto text-center space-y-12">
                  <Quote className="w-12 h-12 text-primary/20 mx-auto" />
                  <h2 className="font-serif text-4xl md:text-5xl text-foreground italic">
                    "For my part I know nothing with any certainty, but the sight of the stars makes me dream."
                  </h2>
                  <div className="space-y-2">
                    <p className="font-serif text-xl text-primary">- Vincent van Gogh</p>
                    <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Post-Impressionist Visionary</p>
                  </div>
                </div>
              </section>
            </ScrollReveal>

            <Footer />
            <ScrollToTop />
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
