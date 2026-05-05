import { Star, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="border-t border-border/30 py-12 px-12">
      <div className="w-full">
        <div className="grid md:grid-cols-6 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 flex items-center justify-center">
                <img src="logo-small.svg" alt="Starhold Logo" className="w-full h-full object-contain" />
              </div>
              <img src="/logo2.png" alt="Starhold" className="h-5 sm:h-6 object-contain object-left" />
            </div>
            <p className="text-sm text-foreground/70 font-medium">
              Information Secured by Space and Time. A star-addressed system for personal memories and mission-critical commands.
            </p>
            <div className="flex items-center gap-3 pt-4">
              <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm w-fit">
                <span className="text-[12px] text-foreground font-medium uppercase tracking-[0.2em] whitespace-nowrap">Proudly Made in India</span>
                <svg className="w-8 h-5 rounded-[3px] shadow-sm" viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg">
                  <rect width="900" height="600" fill="#128807" />
                  <rect width="900" height="400" fill="#fff" />
                  <rect width="900" height="200" fill="#FF9933" />
                  <g transform="translate(450 300)">
                    <circle r="92.5" fill="none" stroke="#000080" strokeWidth="6.5" />
                    <circle r="15" fill="#000080" />
                    <g id="spoke">
                      <line y1="15" y2="92.5" stroke="#000080" strokeWidth="5.5" />
                      <path d="M0 92.5L-4.5 50L0 15L4.5 50Z" fill="#000080" />
                    </g>
                    {Array.from({ length: 23 }).map((_, i) => (
                      <g key={i} transform={`rotate(${(i + 1) * 15})`}>
                        <use href="#spoke" />
                      </g>
                    ))}
                  </g>
                </svg>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4 md:pl-20">
            <h4 className="font-serif text-foreground">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/for-you" className="hover:text-foreground transition-colors font-medium text-cosmic-purple/80">For You</Link></li>
              <li><Link to="/for-missions" className="hover:text-foreground transition-colors font-medium text-cosmic-blue/80">For Missions</Link></li>
              <li><Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
              <li><Link to="/techdocs" className="hover:text-foreground transition-colors">Tech Docs</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-serif text-foreground">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/mission" className="hover:text-foreground transition-colors">Our Mission</Link></li>
              <li><Link to="/about" className="hover:text-foreground transition-colors">About</Link></li>
              <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link></li>
            </ul>
          </div>

          <div className="space-y-4 md:col-span-2">
            <h4 className="font-serif text-foreground">Contact Registry</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-widest text-primary/60">Frequency</span>
                <a href="mailto:starhold.co@gmail.com" className="hover:text-foreground transition-colors">starhold.co@gmail.com</a>
              </li>
              <li className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-widest text-pink-500/60">Instagram Feed</span>
                <a href="https://www.instagram.com/starhold.in/?hl=en" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">@starhold.in</a>
              </li>
              <li className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-widest text-cosmic-purple/60">Global Relay</span>
                <span>Support Hours: 0330 to 1530 UTC</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground order-2 sm:order-1">
            © {new Date().getFullYear()} Starhold. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6 order-1 sm:order-2">
            <a 
              href="https://www.instagram.com/starhold.in/?hl=en" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-pink-500 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <p className="text-xs text-muted-foreground">
              Imagery courtesy of NASA/ESA/CSA
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
