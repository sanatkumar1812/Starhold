import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LogIn, Compass, Menu, X, Trophy, ExternalLink } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UserNav } from './UserNav';

export const Navigation = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(isHomePage ? false : true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hasEntered, setHasEntered] = useState(isHomePage ? false : true);

  useEffect(() => {
    if (isHomePage) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        setHasEntered(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isHomePage]);

  useEffect(() => {
    const handleScroll = () => {
      if (!hasEntered) return;
      const currentScrollY = window.scrollY;

      // Hide if scrolling down and scrolled past 50px, otherwise show
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, hasEntered]);

  const NavLinks = () => (
    <>
      <Link to="/techdocs" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
        Protocol Docs
      </Link>
      <Link to="/pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
        Pricing
      </Link>
      <Link to="/mission" onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
        Our Mission
      </Link>
      <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
        About
      </Link>
      <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
        Contact
      </Link>
    </>
  );

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 glass transition-transform duration-300 font-space-mono ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
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
          <Link to="/" className="flex items-center h-10 hover:opacity-80 transition-opacity md:mr-6">
            <img src="/logo2.png" alt="STARHOLD" className="h-5 sm:h-7 object-contain object-left" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLinks />
          </nav>
        </div>

        {/* Right Section / CTA */}
        <div className="flex items-center gap-4">
          <a
            href="https://outoftheboxedu.space"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/15 transition-all duration-300 group"
          >
            <Trophy className="w-3 h-3 text-amber-400" />
            <span className="text-[10px] font-mono text-amber-300 uppercase tracking-widest">1st Place · HolySpace Challenge</span>
            <ExternalLink className="w-3 h-3 text-amber-400/50 group-hover:text-amber-400 transition-colors" />
          </a>
        </div>
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
