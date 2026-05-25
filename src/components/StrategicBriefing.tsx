import { useState } from 'react';
import { ScrollReveal } from './ScrollReveal';
import { Button } from './ui/button';
import { 
  TrendingUp, Shield, BarChart3, Users, Zap, CheckCircle2, 
  Map, Globe, Compass, Landmark, Briefcase, ChevronRight 
} from 'lucide-react';

export const StrategicBriefing = () => {
  const [activeTab, setActiveTab] = useState<'market' | 'business' | 'traction' | 'dualuse'>('market');

  const businessPillars = [
    {
      title: "Hardware Efficiency (Repurpose. Anchor. Secure.)",
      desc: "Our context-based model allows for software-only upgrades to existing star trackers. This requires absolutely zero new onboard hardware, eliminating acquisition friction and deployment lag."
    },
    {
      title: "Industrial & Geopolitical Hardening",
      desc: "We replace spoofable GPS inputs for High-Altitude Long-Endurance (HALE) drone manufacturers with Optical Terrain Mapping and secure financial nodes with unjammable Pulsar Chronometry."
    },
    {
      title: "India-Led Asiatic Expansion",
      desc: "As regional tensions intensify and India accelerates as a global major player in the New Space Race, Starhold is perfectly positioned in the fastest-growing digital asset corridor."
    }
  ];

  const marketDrivers = [
    { label: "Global Space Economy (2025)", value: "$646.9 Billion" },
    { label: "Projected Growth (by 2035)", value: "$1.8 Trillion" },
    { label: "Surge in Space Cyber Attacks", value: "+118% Year-over-Year" }
  ];

  const tractionStats = [
    { title: "Theoretical Feasibility", desc: "Rigorous research validates absolute alignment with real-world EW and spoofing threat models.", status: "Validated" },
    { title: "Onboard Compatibility", desc: "Software-only deployment verified for existing COTS star tracker configurations.", status: "Verified" },
    { title: "Arduino Physical Hardware HIL", desc: "Hardware-in-the-Loop simulator built using real-world microcontrollers, simulating physical thruster locks.", status: "Active Demo" },
    { title: "HolySpace Challenge", desc: "Selected as 1st Place Winners out of elite New Space entries by Out of the Box Aerospace.", status: "1st Place" }
  ];

  const dualUseApplications = [
    {
      sector: "Satellites",
      useCase: "Zero-Trust command & control authorization for commercial, civil, and military orbital assets.",
      icon: Globe
    },
    {
      sector: "UAVs & Drones",
      useCase: "GPS-independent optical coordinate and terrain validation in heavily jammed/EW contested environments.",
      icon: Compass
    },
    {
      sector: "Missile Defense",
      useCase: "Ensures absolute target coordinate verification via star field tracking, preventing spoofing redirection.",
      icon: Shield
    },
    {
      sector: "Critical Infrastructure",
      useCase: "Acts as a physical 'Dead Man's Switch' requiring coordinate-temporal validation on critical power nodes.",
      icon: Landmark
    }
  ];

  return (
    <section className="py-24 px-6 relative overflow-hidden bg-slate-950/40 border-t border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.05),transparent_70%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Title */}
        <ScrollReveal>
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cosmic-blue/30 bg-cosmic-blue/10 text-xs font-mono text-cosmic-blue uppercase tracking-widest">
              💼 Strategic Thesis
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground font-bold">
              Business Strategy & <span className="text-gradient-gold italic text-glow">Market Opportunity</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              How Starhold capitalizes on the $613B global space economy and the massive surge in orbital cybersecurity demands.
            </p>
          </div>
        </ScrollReveal>

        {/* Tactical Terminal Deck */}
        <ScrollReveal delay={150}>
          <div className="glass rounded-[2.5rem] border-white/10 overflow-hidden shadow-2xl bg-black/40">
            {/* Terminal Header */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-b border-white/10 bg-slate-950/80 px-6 py-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/80" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <span className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="font-mono text-xs text-muted-foreground tracking-widest border-l border-white/10 pl-3">
                  STARHOLD_STRATEGY_DECK.SH
                </span>
              </div>
              
              {/* Tab Selector Buttons */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'market', label: '01_MARKET', icon: BarChart3 },
                  { id: 'business', label: '02_BUSINESS', icon: Briefcase },
                  { id: 'traction', label: '03_TRACTION', icon: TrendingUp },
                  { id: 'dualuse', label: '04_DUAL_USE', icon: Shield }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-cosmic-blue text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] border border-cosmic-blue/50'
                        : 'border border-white/5 bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10'
                    }`}
                  >
                    <tab.icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Terminal Content */}
            <div className="p-8 md:p-12 min-h-[420px] flex items-center">
              
              {/* TAB 1: MARKET OPPORTUNITY */}
              {activeTab === 'market' && (
                <div className="grid md:grid-cols-2 gap-12 w-full animate-in fade-in duration-300">
                  <div className="space-y-6">
                    <h3 className="font-serif text-3xl text-foreground font-bold">
                      The Cybersecurity Crisis in Orbit
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      STARHOLD's market opportunity is anchored in a record **$613 Billion** global space economy currently facing a **118% surge in reported cyber incidents** involving space assets, necessitating a move away from legacy "security through obscurity" toward the physical verification STARHOLD provides.
                    </p>
                    <div className="space-y-4 pt-2">
                      <h4 className="font-serif text-lg text-primary">Key Strategic Expansion Corridors:</h4>
                      <ul className="space-y-3 font-mono text-xs text-muted-foreground">
                        <li className="flex items-start gap-2.5">
                          <ChevronRight className="w-4 h-4 text-cosmic-blue flex-shrink-0 mt-0.5" />
                          <span><strong>Orbital Mesh Resilience:</strong> Inter-satellite mesh routing via Optical Inter-Satellite Links (OISL).</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <ChevronRight className="w-4 h-4 text-cosmic-blue flex-shrink-0 mt-0.5" />
                          <span><strong>Star-Addressed Routing:</strong> Routing anchored to fixed celestial constants rather than vulnerable IP addresses.</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Market Stats Grid */}
                  <div className="grid gap-4">
                    {marketDrivers.map((stat, i) => (
                      <div key={i} className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] flex items-center justify-between hover:border-cosmic-blue/20 transition-all duration-300 group">
                        <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground/90 transition-colors">{stat.label}</span>
                        <span className="text-xl font-bold font-mono text-gradient-gold text-glow">{stat.value}</span>
                      </div>
                    ))}
                    <div className="p-6 rounded-2xl border border-dashed border-cosmic-blue/30 bg-cosmic-blue/5 text-center space-y-2">
                      <p className="text-xs font-mono uppercase tracking-widest text-cosmic-blue font-bold">Geopolitical Tailwind</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        The Asiatic region, led by **India**, is the fastest-growing frontier for digital asset protection, driven by rapid digitisation.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: BUSINESS MODEL */}
              {activeTab === 'business' && (
                <div className="w-full animate-in fade-in duration-300 space-y-8">
                  <div className="grid md:grid-cols-3 gap-6">
                    {businessPillars.map((pillar, i) => (
                      <div key={i} className="p-6 rounded-2xl border border-white/5 bg-slate-900/30 space-y-4 hover:border-cosmic-blue/30 transition-all duration-300 group relative">
                        <div className="absolute top-0 right-6 -mt-3 px-3 py-1 rounded-full bg-cosmic-blue/10 border border-cosmic-blue/20 font-mono text-[9px] text-cosmic-blue font-bold">
                          PILLAR 0{i+1}
                        </div>
                        <h4 className="font-serif text-lg font-bold text-foreground group-hover:text-gradient-gold transition-all">{pillar.title}</h4>
                        <p className="text-muted-foreground text-xs leading-relaxed">{pillar.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-8 rounded-[2rem] border border-cosmic-blue/20 bg-cosmic-blue/5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 text-center md:text-left">
                      <h4 className="font-serif text-xl text-white font-bold">Ready to see our Deployment Framework?</h4>
                      <p className="text-xs text-muted-foreground">Download the HolySpace Class of 2026 Technical Briefing and Whitepaper.</p>
                    </div>
                    <Button 
                      onClick={() => window.open('/techdocs')}
                      className="px-6 py-5 bg-cosmic-blue hover:bg-cosmic-blue/80 text-white font-mono text-xs uppercase tracking-widest rounded-xl transition-all"
                    >
                      Access Tech Docs <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}

              {/* TAB 3: TRACTION & VALIDATION */}
              {activeTab === 'traction' && (
                <div className="grid md:grid-cols-2 gap-12 w-full animate-in fade-in duration-300">
                  <div className="space-y-6">
                    <h3 className="font-serif text-3xl text-foreground font-bold">
                      Traction & Validation
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      Our astronomical math, star sensor configurations, and coordinate-derivation cryptography are validated against real-world aerospace architectures.
                    </p>
                    <div className="p-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 space-y-3">
                      <h4 className="font-serif text-sm font-bold text-amber-300 uppercase tracking-wider">💡 Physical Actuation Validation</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        We developed a **Hardware-in-the-Loop (HIL)** prototype utilizing an Arduino actuator setup. It provides physical confirmation via LEDs and telemetry feedback, bridging complex celestial math to physical thuster or command-lock actuation.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {tractionStats.map((item, i) => (
                      <div key={i} className="p-4 rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-between">
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-foreground font-serif">{item.title}</h4>
                          <p className="text-xs text-muted-foreground leading-relaxed max-w-[280px]">{item.desc}</p>
                        </div>
                        <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: DUAL USE SECTORS */}
              {activeTab === 'dualuse' && (
                <div className="w-full animate-in fade-in duration-300 space-y-8">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {dualUseApplications.map((app, i) => {
                      const Icon = app.icon;
                      return (
                        <div key={i} className="p-6 rounded-2xl border border-white/5 bg-slate-900/20 hover:border-cosmic-blue/30 transition-all duration-300 space-y-4">
                          <div className="w-10 h-10 rounded-xl bg-cosmic-blue/10 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-cosmic-blue" />
                          </div>
                          <h4 className="font-serif text-lg font-bold text-foreground">{app.sector}</h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">{app.useCase}</p>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="p-6 rounded-2xl border border-white/5 bg-slate-950/60 font-mono text-xs text-muted-foreground text-center">
                    🔒 Terrestrial Application: Starhold coordinate verification is highly extensible to **Contested Terrestrial Nodes** and **Financial Ledger Clearinghouses**.
                  </div>
                </div>
              )}

            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};
