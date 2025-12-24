import { useState } from 'react';
import { CosmicBackground } from '@/components/CosmicBackground';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { HowItWorks } from '@/components/HowItWorks';
import { Features } from '@/components/Features';
import { MemoryCreator } from '@/components/MemoryCreator';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Index = () => {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="min-h-screen bg-background relative">
      <CosmicBackground />
      
      <div className="relative z-10">
        <Navigation />

        {isCreating ? (
          <main className="pt-24 pb-12 px-4 min-h-screen">
            <div className="max-w-4xl mx-auto mb-8">
              <Button 
                variant="ghost" 
                onClick={() => setIsCreating(false)}
                className="text-muted-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </div>
            <MemoryCreator />
          </main>
        ) : (
          <>
            <HeroSection onStartCreating={() => setIsCreating(true)} />
            
            <div id="how-it-works">
              <HowItWorks />
            </div>
            
            <div id="features">
              <Features />
            </div>

            {/* CTA Section */}
            <section className="py-24 px-4">
              <div className="max-w-3xl mx-auto text-center space-y-8">
                <h2 className="font-serif text-4xl md:text-5xl text-foreground">
                  Ready to send your memory to the <span className="text-gradient-gold">stars</span>?
                </h2>
                <p className="text-muted-foreground text-lg">
                  Create a gift that will be remembered for generations—a moment frozen in time, 
                  waiting among the cosmos.
                </p>
                <Button variant="gold" size="xl" onClick={() => setIsCreating(true)}>
                  Create Your Stellar Vault
                </Button>
              </div>
            </section>

            <Footer />
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
