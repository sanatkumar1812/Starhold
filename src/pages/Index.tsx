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
import { ArrowLeft, Quote, Star, Zap, Shield, Satellite, ChevronRight } from 'lucide-react';

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
                    <p className="text-xs font-mono uppercase tracking-[0.4em] text-muted-foreground">Access Tiers</p>
                    <h2 className="font-serif text-4xl md:text-5xl text-foreground">
                      Choose Your <span className="text-gradient-gold italic">Orbit</span>
                    </h2>
                    <p className="text-muted-foreground max-w-lg mx-auto text-sm leading-relaxed">
                      From personal cosmic memories to mission-critical aerospace security — every tier is built on physics-based trust.
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { name: 'Observer', price: 'Free', tag: 'Personal', icon: Star, color: 'text-muted-foreground', border: 'border-border/30 hover:border-border/60' },
                      { name: 'Navigator', price: '$29/mo', tag: 'Enthusiast', icon: Zap, color: 'text-cosmic-purple', border: 'border-cosmic-purple/20 hover:border-cosmic-purple/50 hover:shadow-[0_0_30px_hsl(270_60%_45%_/_0.1)]' },
                      { name: 'Sentinel', price: '$99/mo', tag: 'Most Popular', icon: Shield, color: 'text-primary', border: 'border-primary/30 hover:border-primary/60 hover:shadow-[0_0_30px_rgba(234,179,8,0.12)] ring-1 ring-primary/20' },
                      { name: 'Orbital', price: 'Custom', tag: 'Enterprise', icon: Satellite, color: 'text-cosmic-blue', border: 'border-cosmic-blue/20 hover:border-cosmic-blue/50 hover:shadow-[0_0_30px_hsl(220_70%_35%_/_0.1)]' },
                    ].map((tier) => {
                      const Icon = tier.icon;
                      return (
                        <div key={tier.name} className={`glass-strong rounded-2xl border p-6 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 cursor-pointer ${tier.border}`} onClick={() => navigate('/pricing')}>
                          <div className="flex items-center justify-between">
                            <Icon className={`w-5 h-5 ${tier.color}`} />
                            <span className={`text-[10px] font-mono uppercase tracking-widest ${tier.color}`}>{tier.tag}</span>
                          </div>
                          <div>
                            <h3 className="font-serif text-xl text-foreground">{tier.name}</h3>
                            <p className={`font-serif text-2xl mt-1 ${tier.color}`}>{tier.price}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-10 text-center">
                    <Button variant="outline" className="rounded-xl border-border/40" onClick={() => navigate('/pricing')}>
                      View full plans & features <ChevronRight className="w-4 h-4 ml-1" />
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
