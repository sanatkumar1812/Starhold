import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LogIn, Compass, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UserNav } from './UserNav';

export const Navigation = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavLinks = () => (
    <>
      <Link to="/for-you" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-cosmic-purple hover:text-cosmic-purple/80 transition-colors">
        For You
      </Link>
      <Link to="/for-missions" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-cosmic-blue hover:text-cosmic-blue/80 transition-colors">
        For Missions
      </Link>
      <Link to="/pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
        Pricing
      </Link>
      <Link to="/techdocs" onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
        Tech Docs
      </Link>
      <Link to="/4d" onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium flex items-center gap-1">
        Simulator <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-sm">SIM</span>
      </Link>
      <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
        About
      </Link>
      <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
        Contact
      </Link>
      <Link to="/privacy" onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
        Privacy
      </Link>
      <Link to="/terms" onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
        Terms
      </Link>
    </>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="w-full px-6 py-4 flex items-center justify-between">

        {/* Left Section: Mobile Menu + Logo + Nav */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-foreground p-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity md:mr-6">
            <div className="w-10 h-10 flex items-center justify-center">
              <img src="logo-small.svg" alt="Starhold Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="font-serif text-xl font-semibold text-foreground">
                Starhold
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Secured by Space and Time
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLinks />
          </nav>
        </div>

        {/* Right Section / CTA */}
        {/* Commented out as requested
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <UserNav />
          ) : (
            <Link to="/auth">
              <Button variant="gold" size="sm">
                <LogIn className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Login / Sign Up</span>
                <span className="sm:hidden">Login</span>
              </Button>
            </Link>
          )}
        </div>
        */}
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 border-b border-white/10 p-6 animate-in slide-in-from-top-5">
          <nav className="flex flex-col space-y-6 text-center">
            <NavLinks />
          </nav>
        </div>
      )}
    </header>
  );
};
