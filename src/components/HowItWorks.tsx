import { Pen, Star, Lock, Telescope, Globe, MapPin } from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    {
      icon: Pen,
      title: 'Digitize Your Essence',
      description: 'Encode your memories—letters, photos, or voice notes—into a secure digital artifact that transcends physical storage.',
    },
    {
      icon: Star,
      title: 'Celestial Anchoring',
      description: 'Your memory is assigned to a specific star system with fixed RA (Right Ascension) and Dec (Declination) coordinates.',
    },
    {
      icon: Lock,
      title: 'Temporal Lockdown',
      description: 'Encrypt your vault with a target "reveal date." It remains invisible and protected until the exact moment of unveiling.',
    },
    {
      icon: Telescope,
      title: 'Astronomic Reveal',
      description: 'At the appointed time, travel through light-years to your memory via a stunning visualization of deep space imagery.',
    },
  ];

  return (
    <section className="py-32 px-4 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-gradient-radial from-cosmic-purple/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20 space-y-6">
          <h2 className="font-serif text-5xl md:text-6xl text-foreground">
            The Science of <span className="text-gradient-gold italic">Stellar Persistence</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            We bridge the gap between human emotion and cosmic permanence through a unique
            celestial mapping protocol.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="glass group p-8 rounded-3xl space-y-6 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 relative"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <step.icon className="w-7 h-7 text-primary" />
              </div>
              <div className="space-y-3">
                <h3 className="font-serif text-2xl text-foreground group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {step.description}
                </p>
              </div>
              <div className="absolute top-4 right-6 text-4xl font-serif text-primary/5 group-hover:text-primary/10 transition-colors italic">
                0{index + 1}
              </div>
            </div>
          ))}
        </div>

        {/* Technical Deep Dive Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center border-t border-white/5 pt-32">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs text-primary font-mono uppercase tracking-widest">
              Technical Protocol
            </div>
            <h3 className="font-serif text-4xl md:text-5xl text-foreground leading-tight">
              A Permanent Address <br />
              <span className="text-muted-foreground">in the Infinite</span>
            </h3>

            <div className="space-y-6">
              {[
                {
                  title: "Right Ascension (α)",
                  desc: "The celestial equivalent of longitude, measured eastwards from the First Point of Aries along the celestial equator."
                },
                {
                  title: "Declination (δ)",
                  desc: "The celestial equivalent of latitude, measuring the angle north or south of the celestial equator to the object's position."
                },
                {
                  title: "J2000 Period Epoch",
                  desc: "All coordinates are corrected for the precession of the Earth's axis, ensuring your memory stays locked to its star across centuries."
                }
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0 shadow-[0_0_10px_hsl(var(--gold))]" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coordinate System Visualization */}
          <div className="relative aspect-square glass rounded-3xl overflow-hidden flex items-center justify-center group p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(60,100,255,0.1)_0%,transparent_70%)] animate-pulse" />

            {/* Simple SVG Coordinate Diagram */}
            <svg viewBox="0 0 400 400" className="w-full h-full relative z-10 opacity-80 group-hover:opacity-100 transition-opacity duration-700">
              {/* Celestial Sphere */}
              <circle cx="200" cy="200" r="160" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4 4" />
              <ellipse cx="200" cy="200" rx="160" ry="40" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

              {/* Axes */}
              <line x1="200" y1="40" x2="200" y2="360" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              <line x1="40" y1="200" x2="360" y2="200" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

              {/* Rotating Element */}
              <g className="animate-drift" style={{ transformOrigin: '200px 200px' }}>
                {/* Star Marker */}
                <circle cx="280" cy="120" r="4" fill="#EAB308" className="animate-twinkle">
                  <title>Coordinate Point</title>
                </circle>
                <line x1="200" y1="200" x2="280" y2="120" stroke="#EAB308" strokeWidth="0.5" strokeDasharray="2 2" />

                {/* RA Arc */}
                <path d="M 200 160 A 160 40 0 0 1 280 185" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" />

                {/* Dec Line */}
                <path d="M 280 185 L 280 120" fill="none" stroke="#F472B6" strokeWidth="2" strokeLinecap="round" />
              </g>

              {/* Legend */}
              <text x="50" y="380" className="text-[10px] font-mono" fill="#60A5FA">α Right Ascension</text>
              <text x="250" y="380" className="text-[10px] font-mono" fill="#F472B6">δ Declination</text>
            </svg>

            {/* UI Overlays */}
            <div className="absolute top-8 right-8 text-right space-y-1">
              <div className="text-[10px] font-mono text-primary animate-pulse">LOCKING SOURCE...</div>
              <div className="text-xs font-mono text-white/40 uppercase">Ep. J2000.0</div>
            </div>

            <div className="absolute bottom-8 left-8 flex items-center gap-3">
              <div className="w-10 h-10 rounded shadow-lg bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center">
                <Globe className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-[10px] text-white/40 uppercase tracking-tighter">Star ID</div>
                <div className="text-xs font-mono text-white">HIP-74395</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
