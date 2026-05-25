import { User, Satellite, Star, Lock } from 'lucide-react';

export const WhatWeDoSection = () => {
    return (
        <section id="two-frontiers" className="py-28 px-4 relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(96,80,220,0.05)_0%,transparent_70%)] pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">

                {/* Header */}
                <div className="text-center mb-20 space-y-3">
                    <p className="text-xs font-mono uppercase tracking-[0.4em] text-muted-foreground">What We Do</p>
                    <h2 className="font-serif text-4xl md:text-5xl text-foreground">
                        One Protocol.{' '}
                        <span className="text-gradient-gold italic">Two Frontiers.</span>
                    </h2>
                    <p className="text-muted-foreground max-w-lg mx-auto text-base leading-relaxed">
                        Starhold uses stellar coordinates as cryptographic anchors — for memories that last forever,
                        and missions that demand absolute trust.
                    </p>
                </div>

                {/* Cards + Central Graphic */}
                <div className="grid lg:grid-cols-[1fr_220px_1fr] gap-6 items-center">

                    {/* ── B2C Card (Deactivated for B2B) ── */}
                    {/*
                    <div className="glass p-8 rounded-[2.5rem] border border-primary/10 hover:border-primary/25 transition-all duration-300 hover:-translate-y-1 space-y-6 h-full">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                <Star className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-[11px] font-mono uppercase tracking-widest text-primary">For You — B2C</p>
                                <h3 className="font-serif text-3xl text-foreground leading-snug">Personal Legacy</h3>
                            </div>
                        </div>

                        <ul className="space-y-3.5">
                            {[
                                "Dedicate a real star to someone you love",
                                "Bind a memory — message, photo, or voice — to its exact stellar coordinates",
                                "Cryptographically sealed and verifiable by anyone, forever",
                                "A timeless tribute written into the fabric of the universe",
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-base text-muted-foreground leading-relaxed">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-[0.45rem] shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    */}

                    {/* ── Central Orbital Graphic ── */}
                    <div className="hidden lg:flex items-center justify-center">
                        <div className="relative w-[220px] h-[340px]">
                            <svg
                                viewBox="0 0 220 340"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-full h-full"
                            >
                                {/* Vertical spine */}
                                <line x1="110" y1="30" x2="110" y2="310" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="5 5" />

                                {/* Outer orbit ring */}
                                <ellipse cx="110" cy="170" rx="72" ry="72" stroke="rgba(139,92,246,0.15)" strokeWidth="1" />

                                {/* Inner orbit ring */}
                                <ellipse cx="110" cy="170" rx="44" ry="44" stroke="rgba(96,165,250,0.12)" strokeWidth="1" />

                                {/* Branch line to B2C (left) */}
                                <path
                                    d="M 82 148 C 60 130 10 115 0 100"
                                    stroke="rgba(139,92,246,0.3)"
                                    strokeWidth="1.2"
                                    strokeDasharray="4 3"
                                />
                                {/* Branch line to B2B (right) */}
                                <path
                                    d="M 138 148 C 160 130 210 115 220 100"
                                    stroke="rgba(96,165,250,0.3)"
                                    strokeWidth="1.2"
                                    strokeDasharray="4 3"
                                />

                                {/* Orbiting dot — B2C side */}
                                <circle cx="66" cy="140" r="3" fill="rgba(139,92,246,0.7)">
                                    <animate
                                        attributeName="cx"
                                        values="66;154;66"
                                        dur="6s"
                                        repeatCount="indefinite"
                                        calcMode="spline"
                                        keySplines="0.4 0 0.6 1;0.4 0 0.6 1"
                                    />
                                    <animate
                                        attributeName="cy"
                                        values="140;170;200;170;140"
                                        dur="6s"
                                        repeatCount="indefinite"
                                        calcMode="spline"
                                        keySplines="0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1"
                                    />
                                </circle>

                                {/* Orbiting dot — B2B side */}
                                <circle cx="154" cy="200" r="3" fill="rgba(96,165,250,0.7)">
                                    <animate
                                        attributeName="cx"
                                        values="154;66;154"
                                        dur="6s"
                                        repeatCount="indefinite"
                                        calcMode="spline"
                                        keySplines="0.4 0 0.6 1;0.4 0 0.6 1"
                                    />
                                    <animate
                                        attributeName="cy"
                                        values="200;170;140;170;200"
                                        dur="6s"
                                        repeatCount="indefinite"
                                        calcMode="spline"
                                        keySplines="0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1"
                                    />
                                </circle>

                                {/* Center glow */}
                                <circle cx="110" cy="170" r="22" fill="rgba(139,92,246,0.06)" />
                                <circle cx="110" cy="170" r="14" fill="rgba(139,92,246,0.1)" />

                                {/* Center star */}
                                <circle cx="110" cy="170" r="7" fill="rgba(255,220,100,0.9)">
                                    <animate attributeName="r" values="7;9;7" dur="3s" repeatCount="indefinite" />
                                    <animate attributeName="fill-opacity" values="0.9;1;0.9" dur="3s" repeatCount="indefinite" />
                                </circle>

                                {/* Four-point star lines */}
                                <line x1="110" y1="158" x2="110" y2="152" stroke="rgba(255,220,100,0.6)" strokeWidth="1" />
                                <line x1="110" y1="182" x2="110" y2="188" stroke="rgba(255,220,100,0.6)" strokeWidth="1" />
                                <line x1="98" y1="170" x2="92" y2="170" stroke="rgba(255,220,100,0.6)" strokeWidth="1" />
                                <line x1="122" y1="170" x2="128" y2="170" stroke="rgba(255,220,100,0.6)" strokeWidth="1" />

                                {/* Top label */}
                                <text x="110" y="22" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="8" fontFamily="monospace" letterSpacing="2">
                                    STARHOLD
                                </text>
                                {/* Bottom label */}
                                <text x="110" y="326" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="7" fontFamily="monospace" letterSpacing="1.5">
                                    PROTOCOL v4.2
                                </text>
                            </svg>
                        </div>
                    </div>

                    {/* ── B2B Card ── */}
                    <div className="glass p-8 rounded-[2.5rem] border border-cosmic-blue/10 hover:border-cosmic-blue/25 transition-all duration-300 hover:-translate-y-1 space-y-6 h-full">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-cosmic-blue/10 flex items-center justify-center shrink-0">
                                <Satellite className="w-5 h-5 text-cosmic-blue" />
                            </div>
                            <div>
                                <p className="text-[11px] font-mono uppercase tracking-widest text-cosmic-blue">For Missions — B2B</p>
                                <h3 className="font-serif text-3xl text-foreground leading-snug">Space Security</h3>
                            </div>
                        </div>

                        <ul className="space-y-3.5">
                            {[
                                "Authenticate satellite commands using stars as cryptographic anchors",
                                "Zero-trust framework: stellar position + pulsar timing + RF fingerprinting",
                                "Anti-replay, time-locked verification for mission-critical maneuvers",
                                "Built for CubeSats, deep-space assets, and commercial operators",
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-base text-muted-foreground leading-relaxed">
                                    <div className="w-1.5 h-1.5 rounded-full bg-cosmic-blue/50 mt-[0.45rem] shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Connector strip */}
                <div className="mt-14 flex items-center justify-center gap-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-500/30" />
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                        <Lock className="w-3 h-3 text-amber-400/80" />
                        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-amber-400/80">Celestial Coordinates · Cryptographic Binding · Immutable Record</span>
                        <Lock className="w-3 h-3 text-amber-400/80" />
                    </div>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-500/30" />
                </div>
            </div>
        </section>
    );
};
