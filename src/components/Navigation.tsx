import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

interface NavigationProps {
  onStartCreating: () => void;
}

export const Navigation = ({ onStartCreating }: NavigationProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
            <Star className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-semibold text-foreground">
              Stellar Vault
            </h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Cosmic Memory Archive
            </p>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            How it Works
          </a>
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </a>
        </nav>

        {/* CTA */}
        <Button variant="gold" size="sm" onClick={onStartCreating}>
          Create Memory
        </Button>
      </div>
    </header>
  );
};
