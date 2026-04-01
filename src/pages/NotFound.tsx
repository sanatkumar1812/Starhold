import { useNavigate } from 'react-router-dom';
import { CosmicBackground } from '@/components/CosmicBackground';
import { Button } from '@/components/ui/button';
import { Telescope, Home } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden bg-background flex flex-col items-center justify-center text-center px-4">
      <CosmicBackground />

      <div className="relative z-10 space-y-10 max-w-2xl mx-auto">

        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shadow-[0_0_40px_hsl(38_70%_55%_/_0.15)] animate-pulse">
            <Telescope className="w-10 h-10 text-primary" />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-4">
          <p className="text-xs font-mono uppercase tracking-[0.4em] text-muted-foreground">
            Error · 404
          </p>
          <h1 className="font-serif text-6xl md:text-8xl font-light text-gradient-gold text-glow">
            Universe
          </h1>
          <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground/80">
            Not Found
          </h2>
          <p className="text-muted-foreground leading-relaxed max-w-md mx-auto text-base">
            The coordinates you've entered don't correspond to any known sector of the cosmos. This region of space remains uncharted.
          </p>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Button
            variant="gold"
            size="lg"
            className="px-8 py-6 text-base rounded-xl shadow-[0_0_30px_rgba(234,179,8,0.2)] hover:shadow-[0_0_50px_rgba(234,179,8,0.35)] transition-all"
            onClick={() => navigate('/')}
          >
            <Home className="w-4 h-4 mr-2" />
            Return to Home
          </Button>
        </div>

        {/* Footer tag */}
        <p className="font-mono text-xs text-muted-foreground/30 uppercase tracking-widest pt-8">
          ~ STARHOLD ~
        </p>
      </div>
    </div>
  );
};

export default NotFound;
