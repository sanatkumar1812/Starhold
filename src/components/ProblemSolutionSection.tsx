import { ScrollReveal } from './ScrollReveal';
import { ShieldAlert, CheckCircle2, ShieldCheck, Flame, Radio, Target, Zap, Cpu } from 'lucide-react';

export const ProblemSolutionSection = () => {
  const problems = [
    {
      icon: Flame,
      title: "GPS Jamming & Spoofing",
      desc: "Signals travel long distances and arrive weak. A cheap $130 device can override them entirely, causing massive systemic failures.",
      highlight: "1,100+ ships lost GPS in a single day; EU President's plane unable to land in Bulgaria."
    },
    {
      icon: Radio,
      title: "Replay & Spoofing Attacks",
      desc: "Adversaries broadcast fake signals indistinguishable from real ground stations. Intercepted commands are re-transmitted, and spacecraft execute them unconditionally.",
      highlight: "Zero fraud detection on legacy command pipelines."
    },
    {
      icon: ShieldAlert,
      title: "Blind Trust Vulnerability",
      desc: "Spacecraft have zero physical verification. They trust digital cryptographic keys unconditionally, making them highly vulnerable to terrestrial server breaches.",
      highlight: "13+ nations now developing active capabilities to hijack adversary satellites."
    }
  ];

  const solutions = [
    {
      icon: Cpu,
      title: "Star Tracker as Validator",
      desc: "Repurposes existing onboard star trackers as zero-trust physical authentication engines. No new hardware required.",
    },
    {
      icon: Target,
      title: "Sky-Key Binding",
      desc: "AES-256 commands decrypt strictly when the onboard sensor observes a precise star pattern at predicted time (t) and orbital coordinates (x, y, z).",
    },
    {
      icon: ShieldCheck,
      title: "Gaia Database of Truth",
      desc: "Leverages the Gaia DR3 catalog's 1.8 billion stars as an un-spoofable, immutable database of physical truth that cannot be faked from Earth.",
    }
  ];

  const badges = [
    "Physics-Based Trust",
    "Zero-Trust Architecture",
    "GPS-Independent",
    "No New Hardware",
    "EW-Resilient",
    "AES-256 Encrypted"
  ];

  return (
    <section id="problem-statement" className="py-32 px-6 relative overflow-hidden bg-slate-950/20 border-t border-white/5">
      {/* Decorative tactical background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto space-y-24 relative z-10">
        
        {/* ── PROBLEM VS SOLUTION GRID ── */}
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Column: The Threat */}
          <ScrollReveal>
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-xs font-mono text-red-400 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                The Threat Landscape
              </div>
              <h2 className="font-serif text-4xl md:text-5xl text-foreground font-bold">
                Why Legacy Space <br />
                <span className="text-red-500">Security is Failing</span>
              </h2>
              
              <div className="space-y-6 pt-4">
                {problems.map((prob, i) => (
                  <div key={i} className="group relative p-6 rounded-2xl border border-red-500/10 bg-red-500/5 hover:bg-red-500/10 transition-all duration-300">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
                        <prob.icon className="w-5 h-5 text-red-400" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-lg font-bold font-serif text-foreground">{prob.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{prob.desc}</p>
                        <div className="text-xs font-mono text-red-400/80 border-l border-red-500/30 pl-3 py-0.5 mt-2">
                          ⚠️ {prob.highlight}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Right Column: The Solution */}
          <ScrollReveal delay={100}>
            <div className="space-y-8 lg:mt-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-xs font-mono text-emerald-400 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                The Physics-Based Defense
              </div>
              <h2 className="font-serif text-4xl md:text-5xl text-foreground font-bold">
                Starhold Zero-Trust <br />
                <span className="text-gradient-gold italic text-glow">Stellar Anchorage</span>
              </h2>

              <div className="space-y-6 pt-4">
                {solutions.map((sol, i) => (
                  <div key={i} className="group relative p-6 rounded-2xl border border-emerald-500/10 bg-emerald-500/5 hover:bg-emerald-500/10 transition-all duration-300">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                        <sol.icon className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-lg font-bold font-serif text-foreground">{sol.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{sol.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* ── INTRODUCING PROCLAMATION & BADGES ── */}
        <ScrollReveal delay={200}>
          <div className="relative rounded-[3rem] border border-cosmic-blue/20 bg-slate-950/40 p-12 text-center space-y-8 overflow-hidden">
            {/* Ambient background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cosmic-blue/10 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="space-y-4 relative z-10">
              <p className="text-xs font-mono uppercase tracking-[0.4em] text-cosmic-blue">High-Assurance Infrastructure</p>
              <h3 className="font-serif text-3xl md:text-5xl lg:text-6xl text-foreground font-light leading-tight">
                Introducing <span className="font-extrabold text-gradient-gold text-glow">Stellar-Referenced</span> <br />
                <span className="italic font-bold text-cosmic-blue text-glow">Command Authorization</span>
              </h3>
              <p className="text-muted-foreground text-base md:text-lg max-w-4xl mx-auto leading-relaxed pt-2">
                Unlike vulnerable, purely software-based key management, Starhold anchors spacecraft security directly into the physical geometry of the galaxy. By observing immutable stellar constants, satellites can verify their location and authorize critical maneuvers independent of ground contact or GPS signals.
              </p>
            </div>

            {/* Value Proposition Badges */}
            <div className="flex flex-wrap justify-center gap-3 pt-6 relative z-10 max-w-4xl mx-auto">
              {badges.map((badge, idx) => (
                <span 
                  key={idx} 
                  className="px-4 py-2 rounded-xl text-xs font-mono font-medium border border-white/5 bg-white/5 text-foreground/80 hover:text-foreground hover:border-cosmic-blue/30 transition-all duration-300"
                >
                  📡 {badge}
                </span>
              ))}
            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};
