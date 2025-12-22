import { Star } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-border/30 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                <Star className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-serif text-xl text-foreground">Starhold</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm">
              Encode your most precious memories into the cosmos. A unique gift that transcends space and time.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="font-serif text-foreground">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">How it Works</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Gift Cards</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-serif text-foreground">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Starhold. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Imagery courtesy of NASA/ESA/CSA
          </p>
        </div>
      </div>
    </footer>
  );
};
