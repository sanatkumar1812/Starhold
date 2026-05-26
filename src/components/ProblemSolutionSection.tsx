import { ScrollReveal } from './ScrollReveal';
import { ArrowDown, Cpu } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

function useCountUp(target: number, duration: number, active: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    const raf = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [target, duration, active]);
  return count;
}

export const ProblemSolutionSection = () => {
    const [active, setActive] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setActive(true); },
            { threshold: 0.15 }
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);

    const market    = useCountUp(646, 2000, active);
    const attacks   = useCountUp(118, 1800, active);

    const stats = [
        {
            value: `$${market}B`,
            label: 'Global Space Economy',
            sub: 'Market size in 2025',
            color: 'text-emerald-400',
            glowBorder: 'hover:border-emerald-500/30',
        },
        {
            value: `+${attacks}%`,
            label: 'Space Cyber Attacks',
            sub: 'Year-over-year increase',
            color: 'text-red-400',
            glowBorder: 'hover:border-red-500/30',
        },
    ];

    const badges = [
        "Physics-Based Trust",
        "Zero-Trust Architecture",
        "GPS-Independent",
        "No New Hardware",
        "EW-Hardened Layer",
        "AES-256 Encrypted"
    ];

    return (
        <section id="problem-statement" className="relative overflow-hidden border-t border-white/5">
            {/* Subtle tactical grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

            {/* ═══════════════════════════════════════
                PART 1 — THE PROBLEM
            ═══════════════════════════════════════ */}
            <div className="pt-32 pb-16 px-6 bg-slate-950/30 relative z-10">
                <div className="max-w-6xl mx-auto space-y-20">

                    {/* Header */}
                    <ScrollReveal>
                        <div className="text-center space-y-5 pt-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-[10px] md:text-xs font-mono text-red-400 uppercase tracking-widest">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                The Threat Landscape
                            </div>
                            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground font-bold leading-tight">
                                Legacy Systems Ask:
                                <br />
                                <span className="text-red-400 italic">"Who are you?"</span>
                            </h2>
                        </div>
                    </ScrollReveal>

                    {/* Legacy flow diagram */}
                    <ScrollReveal delay={100}>
                        <div className="glass p-6 md:p-8 rounded-[2.5rem] border-red-500/10 max-w-4xl mx-auto space-y-6">
                            <p className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-red-400/60 text-center mb-4">Legacy Command Pipeline</p>

                            {/* Flow nodes */}
                            <div className="flex flex-wrap items-center justify-center gap-2">
                                {[
                                    { icon: '💻', label: 'Ground Command',    sub: 'Operator sends instruction' },
                                    null,
                                    { icon: '🔑', label: '"Who are you?"',   sub: 'Software key check only', bad: true },
                                    null,
                                    { icon: '📡', label: 'Uplinked',          sub: 'Standard RF/optical' },
                                    null,
                                    { icon: '🛰️', label: 'Executes',          sub: 'No location verified', bad: true },
                                ].map((node, i) =>
                                    node === null ? (
                                        <div key={i} className="text-red-500/30 text-lg font-mono">→</div>
                                    ) : (
                                        <div key={i} className={`flex flex-col items-center gap-2 px-3 py-3 rounded-xl border text-center min-w-[90px] md:min-w-[110px] ${node.bad ? 'border-red-500/30 bg-red-500/5' : 'border-white/5 bg-white/[0.02]'}`}>
                                            <span className="text-2xl md:text-3xl">{node.icon}</span>
                                            <span className={`text-xs md:text-sm font-bold font-serif ${node.bad ? 'text-red-300' : 'text-foreground'}`}>{node.label}</span>
                                            <span className="text-[10px] text-muted-foreground leading-tight">{node.sub}</span>
                                        </div>
                                    )
                                )}
                            </div>

                            {/* Vulnerability callout */}
                            <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/[0.06] flex items-center gap-3">
                                <span className="text-xl md:text-2xl flex-shrink-0">⚠️</span>
                                <p className="text-red-300/80 text-xs md:text-sm font-mono">
                                    If a key is stolen or a signal replayed — the spacecraft has no way to distinguish a legitimate command from an attack.
                                </p>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Threat infographic tiles */}
                    <ScrollReveal delay={200}>
                        <div className="grid md:grid-cols-2 gap-5">
                            {[
                                {
                                    emoji: '📈',
                                    stat: '118%',
                                    statSub: 'cyber attack surge',
                                    title: '1. Exponential Cyber Warfare',
                                    desc: 'Space is a highly contested domain. Cyber attacks surged 118% in early 2025 as state actors target ground infrastructure.',
                                },
                                {
                                    emoji: '🔑',
                                    stat: 'Who',
                                    statSub: 'identity-based failure',
                                    title: '2. Identity-Based Security Fails',
                                    desc: 'Legacy systems blindly trust digital identities. Stolen credentials become a master key, granting attackers universal access.',
                                },
                                {
                                    emoji: '📡',
                                    stat: 'Spoof',
                                    statSub: 'fragile terrestrial anchors',
                                    title: '3. Fragility of Terrestrial Anchors',
                                    desc: 'Digital signals lack physical verification. Low-cost ground devices can now override GPS and easily replay commands.',
                                },
                                {
                                    emoji: '🛰️',
                                    stat: '1,700+',
                                    statSub: 'legacy vulnerabilities',
                                    title: '4. The "Legacy Hole" & Sovereignty Trap',
                                    desc: '1,700+ older satellites remain entry points. Commercial ground stations also leak operational metadata to host nations.',
                                },
                            ].map((item) => (
                                <div key={item.title} className="p-6 md:p-8 rounded-3xl border border-red-500/15 bg-red-500/[0.03] space-y-3 hover:border-red-500/25 transition-all duration-500">
                                    <div className="flex items-start justify-between gap-2">
                                        <span className="text-3xl md:text-4xl">{item.emoji}</span>
                                        <div className="text-right">
                                            <div className="font-serif text-3xl md:text-4xl font-bold text-red-400 tabular-nums">{item.stat}</div>
                                            <div className="text-[9px] md:text-[10px] font-mono text-red-400/50 uppercase tracking-wider">{item.statSub}</div>
                                        </div>
                                    </div>
                                    <h3 className="font-serif text-xl md:text-2xl text-foreground">{item.title}</h3>
                                    <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </ScrollReveal>
                </div>
            </div>

            {/* ── INTERMEDIATE STATS (Between Problem & Solution) ── */}
            <div className="py-12 px-6 relative z-10" ref={ref}>
                <div className="max-w-4xl mx-auto">
                    <ScrollReveal>
                        <div className="text-center space-y-2 mb-10">
                            <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.4em] text-cosmic-blue">By The Numbers</p>
                            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground">The Scale of the Problem</h2>
                        </div>
                    </ScrollReveal>
                    <ScrollReveal delay={100}>
                        <div className="grid sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
                            {stats.map((s) => (
                                <div
                                    key={s.label}
                                    className={`glass p-6 md:p-8 rounded-3xl border border-white/5 ${s.glowBorder} text-center space-y-2 transition-all duration-500 hover:scale-[1.02]`}
                                >
                                    <div className={`font-serif text-4xl md:text-5xl font-bold tabular-nums ${s.color}`}>{s.value}</div>
                                    <div className="text-foreground font-semibold text-sm md:text-base">{s.label}</div>
                                    <div className="text-muted-foreground text-xs md:text-sm leading-relaxed">{s.sub}</div>
                                </div>
                            ))}
                        </div>
                    </ScrollReveal>
                </div>
            </div>

            {/* ── Transition arrow ── */}
            <div className="flex justify-center py-6 relative z-10">
                <div className="flex flex-col items-center gap-1">
                    <div className="w-px h-16 bg-gradient-to-b from-red-500/30 via-white/10 to-emerald-500/30" />
                    <ArrowDown className="w-5 h-5 text-emerald-400/40" />
                </div>
            </div>

            {/* ═══════════════════════════════════════
                PART 2 — THE SOLUTION
            ═══════════════════════════════════════ */}
            <div className="pt-16 pb-32 px-6 relative z-10">
                <div className="max-w-6xl mx-auto space-y-20">

                    {/* Header */}
                    <ScrollReveal>
                        <div className="text-center space-y-5">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-[10px] md:text-xs font-mono text-emerald-400 uppercase tracking-widest">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                The Physics-Based Defense
                            </div>
                            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground font-bold leading-tight">
                                Starhold Asks:
                                <br />
                                <span className="text-gradient-gold italic text-glow">"Where are you?"</span>
                            </h2>
                        </div>
                    </ScrollReveal>

                    {/* Starhold flow diagram */}
                    <ScrollReveal delay={100}>
                        <div className="glass p-6 md:p-8 rounded-[2.5rem] border-emerald-500/10 max-w-5xl mx-auto space-y-6">
                            <p className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-emerald-400/60 text-center mb-4">Starhold Authorization Pipeline</p>

                            {/* Flow nodes */}
                            <div className="flex flex-wrap items-center justify-center gap-2">
                                {[
                                    { icon: '💻', label: 'Command + Star Coords', sub: 'RA/Dec + TLE + time window' },
                                    null,
                                    { icon: '🔐', label: 'Location Hash', sub: 'Bound to position', good: true },
                                    null,
                                    { icon: '📡', label: 'Encrypted Uplink', sub: 'Standard RF/optical' },
                                    null,
                                    { icon: '⭐', label: 'Star Observed', sub: 'Physical verification', good: true },
                                    null,
                                    { icon: '✅', label: 'Packet Unlocks', sub: 'Only at right position', good: true },
                                ].map((node, i) =>
                                    node === null ? (
                                        <div key={i} className="text-emerald-500/30 text-lg font-mono">→</div>
                                    ) : (
                                        <div key={i} className={`flex flex-col items-center gap-2 px-3 py-3 rounded-xl border text-center min-w-[80px] md:min-w-[110px] ${node.good ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-white/5 bg-white/[0.02]'}`}>
                                            <span className="text-2xl md:text-3xl">{node.icon}</span>
                                            <span className={`text-xs md:text-sm font-bold font-serif leading-tight ${node.good ? 'text-emerald-300' : 'text-foreground'}`}>{node.label}</span>
                                            <span className="text-[10px] text-muted-foreground leading-tight">{node.sub}</span>
                                        </div>
                                    )
                                )}
                            </div>

                            {/* Key insight callout */}
                            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] flex items-center gap-3">
                                <span className="text-xl md:text-2xl flex-shrink-0">⭐</span>
                                <p className="text-emerald-300/80 text-xs md:text-sm font-mono">
                                    You cannot convincingly fake being at the correct orbital position observing the correct star — adding a physical layer that is orders of magnitude harder to spoof than software alone.
                                </p>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Solution infographic tiles */}
                    <ScrollReveal delay={200}>
                        <div className="grid md:grid-cols-3 gap-5">
                            {[
                                {
                                    emoji: '🔭',
                                    stat: '0',
                                    statSub: 'new hardware',
                                    title: 'Star Tracker Repurposed',
                                    desc: 'Existing star trackers become physical authentication engines. No acquisition cost or deployment lag.',
                                },
                                {
                                    emoji: '📍',
                                    stat: 'x,y,z + t',
                                    statSub: 'binding parameters',
                                    title: 'Position-Bound Decryption',
                                    desc: 'Commands are bound to orbital position, predicted attitude, and time window. Location is the key.',
                                },
                                {
                                    emoji: '🌌',
                                    stat: '1.8B',
                                    statSub: 'Gaia DR3 stars',
                                    title: 'Immutable Physical Reference',
                                    desc: 'Star positions are deterministic and verifiable. The geometry of the galaxy cannot be hacked.',
                                },
                            ].map((item) => (
                                <div key={item.title} className="p-6 md:p-8 rounded-3xl border border-emerald-500/15 bg-emerald-500/[0.03] space-y-3 hover:border-emerald-500/25 transition-all duration-500">
                                    <div className="flex items-start justify-between gap-2">
                                        <span className="text-3xl md:text-4xl">{item.emoji}</span>
                                        <div className="text-right">
                                            <div className="font-serif text-3xl md:text-4xl font-bold text-emerald-400 tabular-nums">{item.stat}</div>
                                            <div className="text-[9px] md:text-[10px] font-mono text-emerald-400/50 uppercase tracking-wider">{item.statSub}</div>
                                        </div>
                                    </div>
                                    <h3 className="font-serif text-xl md:text-2xl text-foreground">{item.title}</h3>
                                    <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </ScrollReveal>

                    {/* ── Proclamation block ── */}
                    <ScrollReveal delay={300}>
                        <div className="relative rounded-[3rem] border border-cosmic-blue/20 bg-slate-950/40 p-10 text-center space-y-8 overflow-hidden">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cosmic-blue/10 rounded-full blur-[100px] pointer-events-none" />

                            <div className="space-y-4 relative z-10">
                                <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.4em] text-cosmic-blue">High-Assurance Infrastructure</p>
                                <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground font-light leading-tight">
                                    Introducing <span className="font-extrabold text-gradient-gold text-glow">Stellar-Referenced</span> <br />
                                    <span className="italic font-bold text-cosmic-blue text-glow">Command Authorization</span>
                                </h3>
                            </div>

                            {/* 4 visual spec tiles */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10 max-w-4xl mx-auto pt-4">
                                {[
                                    { emoji: '🔭', value: 'Star Tracker',  sub: 'Already onboard — repurposed as auth engine' },
                                    { emoji: '🔐', value: 'AES-256',       sub: 'Commands bound to RA/Dec + TLE + time window' },
                                    { emoji: '🌌', value: 'Gaia DR3',      sub: '1.8B stars — deterministic physical reference' },
                                    { emoji: '📡', value: 'Zero-Contact',  sub: 'Authorization runs fully onboard, autonomously' },
                                ].map((item) => (
                                    <div key={item.value} className="p-4 rounded-xl border border-white/5 bg-white/[0.03] space-y-1.5 text-center hover:border-cosmic-blue/20 transition-all duration-300">
                                        <div className="text-2xl md:text-3xl">{item.emoji}</div>
                                        <div className="text-sm md:text-base font-bold font-serif text-foreground">{item.value}</div>
                                        <div className="text-[10px] md:text-xs text-muted-foreground leading-tight">{item.sub}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Badge strip */}
                            <div className="flex flex-wrap justify-center gap-2 relative z-10 max-w-3xl mx-auto pt-2">
                                {badges.map((badge, idx) => (
                                    <span
                                        key={idx}
                                        className="px-3 py-1.5 rounded-lg text-xs md:text-sm font-mono font-medium border border-white/5 bg-white/5 text-foreground/70 hover:text-foreground hover:border-cosmic-blue/30 transition-all duration-300"
                                    >
                                        {badge}
                                    </span>
                                ))}
                            </div>


                        </div>
                    </ScrollReveal>

                </div>
            </div>
        </section>
    );
};
