import { Button } from '@/components/ui/button';
import { Sparkles, ArrowDown } from 'lucide-react';

interface HeroSectionProps {
  onStartCreating: () => void;
}

export const HeroSection = ({ onStartCreating }: HeroSectionProps) => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 relative">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-cosmic-purple/10 blur-3xl animate-drift" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-cosmic-blue/10 blur-3xl animate-drift" style={{ animationDelay: '-10s' }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-muted-foreground animate-fade-in-up">
          <Sparkles className="w-4 h-4 text-primary" />
          <span>Powered by JWST & Hubble imagery</span>
        </div>

        {/* Main headline */}
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light leading-tight animate-fade-in-up stagger-1">
          <span className="text-foreground">Encode your</span>
          <br />
          <span className="text-gradient-gold text-glow">memories</span>
          <br />
          <span className="text-foreground">in the stars</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in-up stagger-2">
          A cosmic time capsule that assigns your most precious moments to unique celestial coordinates—
          waiting among the stars until the perfect moment to be revealed.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-in-up stagger-3">
          <Button variant="gold" size="xl" onClick={onStartCreating}>
            Create Your Starhold
          </Button>
          <Button variant="glass" size="lg">
            Learn how it works
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 pt-12 animate-fade-in-up stagger-4">
          {[
            { value: '∞', label: 'Unique Coordinates' },
            { value: '13.8B', label: 'Light Years of Sky' },
            { value: '100+', label: 'Years of Storage' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl md:text-4xl font-serif text-primary">{stat.value}</p>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ArrowDown className="w-6 h-6 text-muted-foreground" />
      </div>
    </section>
  );
};
