import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowDown, Trophy, ExternalLink } from 'lucide-react';

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
    <section className="min-h-screen flex flex-col items-center justify-start text-center px-4 relative overflow-hidden">
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

      <div className="relative z-10 max-w-4xl mx-auto pt-40 space-y-12 pb-60">


        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold leading-tight tracking-tight">
            <span className="block text-foreground animate-fade-in-up stagger-1">Information Secured by</span>
            <span className="relative inline-block text-gradient-gold text-glow italic animate-fade-in-up stagger-3 font-extrabold px-6">
              Space and Time
              <span className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-blue-600/40 to-cosmic-blue/30 blur-2xl rounded-full -z-10 pointer-events-none animate-pulse" />
            </span>
          </h1>

        {/* Subtitle */}
        {/* Original B2C/B2B subtitle:
        <p className="text-lg md:text-xl lg:text-2xl text-foreground/80 font-medium max-w-4xl mx-auto leading-relaxed animate-pop-in stagger-4 px-4">
          A star-addressed system that binds data to celestial coordinates and time—
          from personal memories to mission-critical satellite commands.
        </p>
        */}
        <p className="text-lg md:text-xl lg:text-2xl text-foreground/80 font-medium max-w-3xl mx-auto leading-relaxed animate-pop-in stagger-5 px-4">
          A star-addressed system that binds data to celestial coordinates and time for mission-critical satellite operations and enterprise security.
        </p>



        {/* Dual CTAs removed per user request */}
        {/* Buttons have been deactivated for future enable */}

        {/* Stats deactivated per user request */}
        {/*
        <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-8 animate-fade-in-up stagger-7 max-w-2xl mx-auto px-4">
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
        */}
      </div>

      {/* Scroll Prompt - Direct child of section for perfect bottom-of-screen alignment */}
      <div className="absolute inset-x-0 bottom-6 md:bottom-10 z-20 flex flex-col items-center pt-4 animate-fade-in-up stagger-6">
        <div className="flex items-center gap-2 sm:gap-3 text-muted-foreground/60 group cursor-pointer" onClick={onLearnMore}>
          <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent via-primary/30 to-transparent group-hover:via-primary/80 transition-all" />
          <span className="text-xs sm:text-sm font-mono uppercase tracking-[0.5em] group-hover:text-primary/80 transition-colors">
            Scroll to Learn More
          </span>
          <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent via-primary/30 to-transparent group-hover:via-primary/80 transition-all" />
        </div>
        <ArrowDown className="w-5 h-5 text-primary/40 animate-bounce mt-2" />
      </div>
    </section>
  );
};
