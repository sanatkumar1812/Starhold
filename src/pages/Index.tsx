import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { CosmicBackground } from '@/components/CosmicBackground';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { HowItWorks } from '@/components/HowItWorks';
import { Features } from '@/components/Features';
import { CosmicTimeline } from '@/components/CosmicTimeline';
import { MemoryCreator } from '@/components/MemoryCreator';
import { ScrollReveal } from '@/components/ScrollReveal';
import { ScrollToTop } from '@/components/ScrollToTop';
import { SciFiHUD } from '@/components/SciFiHUD';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Quote } from 'lucide-react';

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
              onLearnMore={scrollToHowItWorks}
            />

            <div id="how-it-works">
              <ScrollReveal>
                <HowItWorks />
              </ScrollReveal>
            </div>

            <ScrollReveal delay={200}>
              <CosmicTimeline />
            </ScrollReveal>

            <div id="features">
              <ScrollReveal>
                <Features />
              </ScrollReveal>
            </div>

            {/* Testimonials / Legacy Section */}
            <ScrollReveal>
              <section className="py-32 px-4 relative overflow-hidden bg-slate-950/30">
                <div className="max-w-4xl mx-auto text-center space-y-12">
                  <Quote className="w-12 h-12 text-primary/20 mx-auto" />
                  <h2 className="font-serif text-4xl md:text-5xl text-foreground italic">
                    "For my part I know nothing with any certainty, but the sight of the stars makes me dream."
                  </h2>
                  <div className="space-y-2">
                    <p className="font-serif text-xl text-primary">— Vincent van Gogh</p>
                    <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Post-Impressionist Visionary</p>
                  </div>
                </div>
              </section>
            </ScrollReveal>

            {/* CTA Section */}
            <ScrollReveal>
              <section className="py-32 px-4 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
                <div className="max-w-3xl mx-auto text-center space-y-8 relative z-10">
                  <h2 className="font-serif text-5xl md:text-6xl text-foreground leading-tight">
                    Begin Your Journey <br />
                    <span className="text-gradient-gold">to the Infinite</span>
                  </h2>
                  <p className="text-muted-foreground text-lg leading-relaxed max-w-xl mx-auto">
                    Create a gift that will be remembered for generations—a moment frozen in time,
                    waiting among the cosmos.
                  </p>
                  <div className="pt-8">
                    <Button variant="gold" size="xl" onClick={() => {
                      if (!isAuthenticated) {
                        navigate('/auth?redirect=create');
                      } else {
                        setIsCreating(true);
                      }
                    }} className="px-12 py-8 text-xl rounded-2xl shadow-[0_0_30px_rgba(234,179,8,0.2)] hover:shadow-[0_0_50px_rgba(234,179,8,0.4)] transition-all duration-500">
                      Create Your Stellar Vault
                    </Button>
                    <p className="mt-6 text-xs font-mono text-muted-foreground uppercase tracking-widest">No orbital fees for initial digitization</p>
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
