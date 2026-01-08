import { Globe, Shield, Gift, Palette, Clock, Sparkles } from 'lucide-react';

export const Features = () => {
  const features = [
    {
      icon: Globe,
      title: 'Real Celestial Coordinates',
      description: 'Every memory receives genuine Right Ascension and Declination coordinates from observable space regions.',
    },
    {
      icon: Shield,
      title: 'Time-Locked Encryption',
      description: 'Your message remains encrypted until the chosen unlock date, protected by your unique cosmic key.',
    },
    {
      icon: Sparkles,
      title: 'JWST/Hubble Visualization',
      description: 'Upon unlock, receive a stunning visualization of the actual space surrounding your coordinates.',
    },
    {
      icon: Gift,
      title: 'Physical Star Map',
      description: 'A beautifully designed print featuring your constellation and precise coordinates.',
    },
    {
      icon: Palette,
      title: 'Personalized Design',
      description: 'Choose from elegant templates that transform your coordinates into wall-worthy art.',
    },
    {
      icon: Clock,
      title: 'Century-Long Storage',
      description: 'Your memories are preserved for generations, ready to span decades or even centuries.',
    },
  ];

  return (
    <section id="features" className="py-32 px-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cosmic-blue/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-24 space-y-6">
          <h2 className="font-serif text-5xl md:text-6xl text-foreground">
            Beyond Ordinary <br />
            <span className="text-gradient-gold italic">Time Capsules</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Where cutting-edge technology meets the infinite canvas of the universe.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative p-8 rounded-3xl border border-white/5 bg-slate-900/20 backdrop-blur-sm hover:bg-slate-900/40 hover:border-primary/30 transition-all duration-700 hover:-translate-y-2"
            >
              {/* Card Glow */}
              <div className="absolute -inset-px bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />

              <div className="relative space-y-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-500">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-3">
                  <h3 className="font-serif text-2xl text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm group-hover:text-slate-300 transition-colors">
                    {feature.description}
                  </p>
                </div>

                {/* Visual accent */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-white/20">
                  <span>Protocol V.4.2</span>
                  <feature.icon className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
