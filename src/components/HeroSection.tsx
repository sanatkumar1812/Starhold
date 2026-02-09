import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowDown } from 'lucide-react';

interface HeroSectionProps {
  onStartCreating: () => void;
  onLearnMore: () => void;
}

export const HeroSection = ({ onStartCreating, onLearnMore }: HeroSectionProps) => {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
      {/* Floating decorative elements with parallax */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] rounded-full bg-cosmic-purple/10 blur-[120px] animate-drift"
          style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[50rem] h-[50rem] rounded-full bg-cosmic-blue/10 blur-[150px] animate-drift"
          style={{
            animationDelay: '-10s',
            transform: `translate(${-mousePos.x * 1.5}px, ${-mousePos.y * 1.5}px)`
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto pt-32 space-y-10">


        {/* Main headline */}
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light leading-tight animate-fade-in-up stagger-1">
          <span className="text-foreground">Information Secured by</span>
          <br />
          <span className="text-gradient-gold text-glow italic">Space and Time</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base md:text-lg lg:text-xl xl:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in-up stagger-2 px-4">
          A star-addressed system that binds data to celestial coordinates and time—
          from personal memories to mission-critical satellite commands.
        </p>

        {/* Dual CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-10 animate-fade-in-up stagger-3">
          <Button
            variant="gold"
            size="lg"
            onClick={() => navigate('/for-you')}
            className="px-8 py-6 text-lg rounded-xl shadow-[0_0_30px_rgba(234,179,8,0.2)] hover:shadow-[0_0_50px_rgba(234,179,8,0.4)] transition-all duration-500"
          >
            For Personal Memories
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/for-missions')}
            className="px-8 py-6 text-lg rounded-xl border-cosmic-blue/30 text-cosmic-blue hover:bg-cosmic-blue/10 transition-all duration-500"
          >
            For Mission Systems
          </Button>
        </div>

        {/* Scroll Prompt */}
        <div className="flex flex-col items-center justify-center gap-3 pt-6 animate-fade-in-up stagger-4">
          <div className="flex items-center gap-2 sm:gap-3 text-muted-foreground/60 group cursor-pointer" onClick={onLearnMore}>
            <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent via-primary/30 to-transparent group-hover:via-primary/60 transition-all" />
            <span className="text-xs sm:text-sm font-mono uppercase tracking-[0.3em] group-hover:text-primary/80 transition-colors">
              Learn More
            </span>
            <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent via-primary/30 to-transparent group-hover:via-primary/60 transition-all" />
          </div>
          <ArrowDown className="w-5 h-5 text-primary/40 animate-bounce" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-12 animate-fade-in-up stagger-5 max-w-2xl mx-auto px-4">
          {[
            { value: '∞', label: 'Celestial Addresses' },
            { value: 'RA/Dec', label: 'Coordinate System' },
            { value: '24/7', label: 'Sky Coverage' },
          ].map((stat) => (
            <div key={stat.label} className="text-center group">
              <p className="text-3xl md:text-4xl lg:text-5xl font-serif text-primary group-hover:scale-110 transition-transform">{stat.value}</p>
              <p className="text-xs md:text-sm lg:text-base text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
