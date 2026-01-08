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
    <section className="py-24 px-4 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 cosmic-bg pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="font-serif text-4xl md:text-5xl text-foreground">
            Beyond ordinary <span className="text-gradient-gold">time capsules</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Where technology meets the infinite canvas of the universe
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl border border-border/30 bg-card/30 hover:bg-card/50 hover:border-primary/20 transition-all duration-500"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-lg text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
