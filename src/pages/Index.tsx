import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { CosmicBackground } from '@/components/CosmicBackground';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { UnifiedInfrastructure } from '@/components/UnifiedInfrastructure';
import { UniversalFeatures } from '@/components/UniversalFeatures';
import { WhatWeDoSection } from '@/components/WhatWeDoSection';
import { RecognitionSection } from '@/components/RecognitionSection';
import { ScrollReveal } from '@/components/ScrollReveal';
import { ScrollToTop } from '@/components/ScrollToTop';
import { Footer } from '@/components/Footer';
import { Quote } from 'lucide-react';
import { ForMissionsSection } from '@/components/ForMissionsSection';

const Index = () => {
  const navigate = useNavigate();

  const scrollToHowItWorks = () => {
    const element = document.getElementById('for-missions');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <CosmicBackground />

      <div className="relative z-10">
        <Navigation />

        <HeroSection
          onStartCreating={() => {
            navigate('/techdocs');
          }}
          onLearnMore={scrollToHowItWorks}
        />

        {/* Universal capabilities deactivated per user request */}
        {/*
        <UniversalFeatures />
        */}

        {/* WhatWeDoSection deactivated (commented out) per B2C removal request */}
        {/*
        <ScrollReveal>
          <WhatWeDoSection />
        </ScrollReveal>
        */}

        <ForMissionsSection />

        <ScrollReveal>
          <RecognitionSection />
        </ScrollReveal>

        <div id="unified-infra">
          <ScrollReveal>
            <UnifiedInfrastructure />
          </ScrollReveal>
        </div>

        {/* Testimonials / Quote Section */}
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
      </div>
    </div>
  );
};

export default Index;
