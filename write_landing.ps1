$content = @'
import React from 'react';
import { Button } from '@/components/ui/button';
import { V2Layout } from '../layout/V2Layout';
import { ScrollReveal } from '@/components/ScrollReveal';
import { useNavigate } from 'react-router-dom';
import {
    ChevronRight, CheckCircle2, AlertTriangle, Lock, Satellite, Star, Shield
} from 'lucide-react';

const roadmapPhases = [
    { label: 'Concept & Architecture', short: 'CONCEPT &\nARCHITECTURE', status: 'done', date: 'Q1 2024', phase: '01', desc: 'Physics model, patent filing, MVP scoping' },
    { label: 'B2C Product Development', short: 'B2C PRODUCT\nDEVELOPMENT', status: 'done', date: 'Q3 2024', phase: '02', desc: 'Cosmic Memory Registry, observatory UX' },
    { label: 'B2B Research & Development', short: 'B2B RESEARCH\n& DEVELOPMENT', status: 'ongoing', date: 'Q1 2025', phase: '03', desc: 'Star-tracker auth, aerospace partnerships' },
    { label: 'Advanced Validation & Partnership', short: 'ADVANCED VALIDATION\n& PARTNERSHIP', status: 'pending', date: '2026', phase: '04', desc: 'DoD/ESA pilot programs, integration testing' },
    { label: 'Global Rollout & Expansion', short: 'GLOBAL ROLLOUT\n& EXPANSION', status: 'pending', date: '2028-2030', phase: '05', desc: 'Commercial licensing, constellation-scale' },
];

const V2LandingPage = () => {
    const navigate = useNavigate();

    return (
        <V2Layout>
            <main>

                {/* ══════════════════════════════════════════════
                    SECTION 1 : HERO
                ══════════════════════════════════════════════ */}
                <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
                    {/* Background earth night photo */}
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072')] bg-cover bg-center opacity-40 mix-blend-screen" />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#040814]/85 via-[#040814]/50 to-[#040814]" />
                    {/* Coloured ambient blobs */}
                    <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[160px] pointer-events-none" />
                    <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-700/10 rounded-full blur-[160px] pointer-events-none" />

                    <div className="relative z-10 w-full max-w-7xl mx-auto px-4 text-center space-y-12">
                        <ScrollReveal>
                            <h1 className="font-aerospace text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-cyan-400/80">
                                Information Secured by <br />
                                <span className="text-cyan-400">Space</span> and <span className="text-purple-400">Time</span>
                            </h1>
                        </ScrollReveal>
                        <ScrollReveal delay={200}>
                            <p className="max-w-3xl mx-auto text-lg md:text-xl text-zinc-400 leading-relaxed font-light font-technical">
                                The world's first celestial-referenced information infrastructure, turning stars into unique, un-hackable, physics-based encryption keys for both personal legacy and aerospace security.
                            </p>
                        </ScrollReveal>
                        <ScrollReveal delay={400}>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
                                <Button
                                    onClick={() => navigate('/v2/observatory')}
                                    className="bg-cyan-500 hover:bg-cyan-400 text-[#040814] px-10 py-7 text-lg font-aerospace font-bold uppercase tracking-widest rounded-none aerospace-border aerospace-border-tl shadow-[0_0_30px_rgba(0,224,240,0.2)] transition-all hover:scale-105"
                                >
                                    Initiate Simulation
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => window.open('Starhold Market and Technical Research.pdf', '_blank')}
                                    className="border-white/10 text-white hover:bg-white/5 px-10 py-7 text-lg font-aerospace font-bold uppercase tracking-widest rounded-none transition-all"
                                >
                                    Download Whitepaper
                                </Button>
                            </div>
                        </ScrollReveal>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════
                    SECTION 2 : THE PROBLEM
                ══════════════════════════════════════════════ */}
                <section className="py-32 relative overflow-hidden border-b border-white/5">
                    {/* Background gradient - deep red tones */}
                    <div className="absolute inset-0 bg-[#020508]" />
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-red-700/8 rounded-full blur-[200px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-600/6 rounded-full blur-[180px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />

                    <div className="relative z-10 w-full max-w-6xl mx-auto px-6 space-y-24">
                        <ScrollReveal>
                            <div className="text-center space-y-6">
                                <span className="font-aerospace text-xs font-bold text-red-500 uppercase tracking-[0.4em]">THE CRISIS</span>
                                <h2 className="font-aerospace text-4xl md:text-5xl lg:text-6xl font-black uppercase leading-tight">
                                    Solving the <span className="text-red-500">$500B</span><br />Space Cybersecurity Crisis
                                </h2>
                                <p className="text-xl text-zinc-400 leading-relaxed font-light font-technical max-w-3xl mx-auto">
                                    As humanity's reliance on orbital infrastructure grows, our encryption methods remain anchored to earth-based, hackable digital systems - creating a catastrophic vulnerability gap at the edge of space.
                                </p>
                            </div>
                        </ScrollReveal>

                        {/* Stats Grid */}
                        <ScrollReveal delay={200}>
                            <div className="grid md:grid-cols-3 gap-6">
                                {[
                                    {
                                        stat: '$630B+',
                                        label: 'projected global space economy by 2030',
                                        detail: 'The global space technology market is on track to surpass $630B by 2030, with satellite services, launch infrastructure, and defence contracts at its core - all relying on legacy digital authentication.',
                                        source: 'Space Foundation Space Report, 2025 Q2',
                                        color: 'red',
                                        icon: Satellite,
                                    },
                                    {
                                        stat: '300%',
                                        label: 'surge in satellite cyberattacks since 2020',
                                        detail: 'The Viasat KA-SAT attack (Feb 2022) disrupted Ukrainian military communications. The attacker used only valid credentials - no zero-day exploits were needed. Digital keys alone are not enough.',
                                        source: 'Kratos Space Threat Briefing, 2025',
                                        color: 'orange',
                                        icon: AlertTriangle,
                                    },
                                    {
                                        stat: '75%',
                                        label: 'of commercial ground stations lack physics-layer auth',
                                        detail: 'Commercial satellite ground stations increasingly serve defence missions, yet the vast majority lack any form of physics-layer command verification - making them strategic vulnerabilities.',
                                        source: 'SatNews / Mayer Brown, 2025',
                                        color: 'yellow',
                                        icon: Lock,
                                    },
                                ].map((item, idx) => (
                                    <ScrollReveal key={idx} delay={idx * 150}>
                                        <div className={`h-full p-8 border bg-white/[0.02] backdrop-blur-sm space-y-5 hover:bg-white/[0.04] transition-all hover:-translate-y-1 ${
                                            item.color === 'red' ? 'border-red-500/20 hover:border-red-500/50 hover:shadow-[0_8px_32px_rgba(239,68,68,0.12)]' :
                                            item.color === 'orange' ? 'border-orange-500/20 hover:border-orange-500/50 hover:shadow-[0_8px_32px_rgba(249,115,22,0.12)]' :
                                            'border-yellow-500/20 hover:border-yellow-500/50 hover:shadow-[0_8px_32px_rgba(234,179,8,0.12)]'
                                        }`}>
                                            <item.icon className={`w-8 h-8 ${
                                                item.color === 'red' ? 'text-red-500' :
                                                item.color === 'orange' ? 'text-orange-400' : 'text-yellow-400'
                                            }`} />
                                            <div>
                                                <div className={`font-aerospace text-5xl font-black ${
                                                    item.color === 'red' ? 'text-red-400' :
                                                    item.color === 'orange' ? 'text-orange-400' : 'text-yellow-400'
                                                }`}>{item.stat}</div>
                                                <div className="text-white font-aerospace uppercase tracking-widest text-sm mt-1">{item.label}</div>
                                            </div>
                                            <p className="text-zinc-500 font-technical text-sm leading-relaxed">{item.detail}</p>
                                            <p className="text-zinc-600 font-mono text-xs border-t border-white/5 pt-4">- {item.source}</p>
                                        </div>
                                    </ScrollReveal>
                                ))}
                            </div>
                        </ScrollReveal>

                        {/* Root Cause Detail */}
                        <ScrollReveal delay={300}>
                            <div className="grid lg:grid-cols-2 gap-16 items-center">
                                <div className="space-y-6">
                                    <h3 className="font-aerospace text-2xl md:text-3xl font-black uppercase tracking-widest text-white">
                                        The Root Failure: <span className="text-red-400">Digital-Only Trust</span>
                                    </h3>
                                    <p className="text-zinc-400 font-technical leading-relaxed">
                                        Today's satellite command authentication relies entirely on digital cryptography - private keys, certificate authorities, and ground-station trust chains. These are effective against remote software attacks, but are fundamentally brittle against insider threats, credential theft, or nation-state supply chain attacks.
                                    </p>
                                    <p className="text-zinc-400 font-technical leading-relaxed">
                                        The pivot to Zero Trust architectures addresses software-layer vulnerabilities - but leaves the physics layer entirely unaddressed. No digital system can prevent a physically-present adversary from presenting valid credentials.
                                    </p>
                                    <p className="text-white font-technical leading-relaxed font-medium border-l-2 border-red-500 pl-4">
                                        "The key must be physics - not bytes."
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    {[
                                        { label: 'GPS spoofing incidents tracked (2023)', value: '~10,000+ reported', color: 'red' },
                                        { label: 'Nation-state actors targeting orbital assets', value: '9 confirmed (CISA 2024)', color: 'orange' },
                                        { label: 'Average cost per satellite cyber incident', value: '$12.5M per event', color: 'yellow' },
                                        { label: 'Global digital legacy market by 2034', value: '$8.9B (13.4% CAGR)', color: 'red' },
                                        { label: 'Star tracker accuracy for command auth binding', value: '< 1 arcsecond precision', color: 'orange' },
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-4 border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                                            <span className="font-technical text-sm text-zinc-400">{item.label}</span>
                                            <span className={`font-aerospace font-bold text-sm ml-4 text-right ${
                                                item.color === 'red' ? 'text-red-400' :
                                                item.color === 'orange' ? 'text-orange-400' : 'text-yellow-400'
                                            }`}>{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════
                    SECTION 3 : THE SOLUTION
                ══════════════════════════════════════════════ */}
                <section className="py-32 relative overflow-hidden border-b border-white/5">
                    {/* Background - cyan/teal tones */}
                    <div className="absolute inset-0 bg-[#030a10]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-cyan-600/6 rounded-full blur-[180px] pointer-events-none" />
                    <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-blue-700/8 rounded-full blur-[160px] -translate-x-1/3 -translate-y-1/3 pointer-events-none" />

                    <div className="relative z-10 w-full max-w-6xl mx-auto px-6 space-y-20">
                        <ScrollReveal>
                            <div className="text-center space-y-6">
                                <span className="font-aerospace text-xs font-bold text-cyan-400 uppercase tracking-[0.4em]">THE STARHOLD ANSWER</span>
                                <h2 className="font-aerospace text-4xl md:text-5xl font-black uppercase leading-tight text-white">
                                    Physics as the <span className="text-cyan-400">Key</span>
                                </h2>
                                <p className="text-xl text-zinc-400 leading-relaxed font-light font-technical max-w-3xl mx-auto">
                                    StarHold introduces Environmental Key Derivation (EKD) - binding every command or archive to the immutable, real-time physical state of a designated star. The key does not exist until the moment of execution.
                                </p>
                            </div>
                        </ScrollReveal>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { icon: Star, title: 'Celestial Binding', desc: 'Each command is bound to a specific star catalog ID, spectral signature, and sky position - a physical address as unique as a fingerprint, verified by an onboard star tracker.', color: 'cyan' },
                                { icon: Lock, title: 'Non-Spoofable Keys', desc: 'Star spectral data cannot be faked from the ground. The physics of the sky at that moment acts as a second factor that no adversary can replicate or front-run.', color: 'purple' },
                                { icon: Satellite, title: 'Earth-Independent Auth', desc: 'No reliance on GPS, ground stations, or real-time uplinks. Fully autonomous physics-layer verification suitable for deep-space and denied-comms operations.', color: 'cyan' },
                                { icon: Shield, title: 'Additive to Zero Trust', desc: 'Does not replace Zero Trust, TLS, or PKI. Adds a physics-based authorization layer - making credential theft insufficient to execute commands against protected assets.', color: 'purple' },
                            ].map((item, idx) => (
                                <ScrollReveal key={idx} delay={idx * 100}>
                                    <div className={`h-full p-8 border bg-white/[0.02] space-y-4 hover:bg-white/[0.04] transition-all hover:-translate-y-1 ${
                                        item.color === 'cyan'
                                            ? 'border-cyan-500/20 hover:border-cyan-500/50 hover:shadow-[0_8px_32px_rgba(6,182,212,0.12)]'
                                            : 'border-purple-500/20 hover:border-purple-500/50 hover:shadow-[0_8px_32px_rgba(168,85,247,0.12)]'
                                    }`}>
                                        <div className={`w-12 h-12 flex items-center justify-center ${
                                            item.color === 'cyan' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-purple-500/10 text-purple-400'
                                        }`}>
                                            <item.icon className="w-6 h-6" />
                                        </div>
                                        <h3 className="font-aerospace font-bold uppercase tracking-widest text-white text-base">{item.title}</h3>
                                        <p className="text-zinc-500 font-technical text-sm leading-relaxed">{item.desc}</p>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════
                    SECTION 4 : MISSION ROADMAP (above B2B/B2C)
                ══════════════════════════════════════════════ */}
                <section className="py-28 relative overflow-hidden border-b border-white/5">
                    {/* Background - deep navy / indigo */}
                    <div className="absolute inset-0 bg-[#040814]" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-sky-700/6 rounded-full blur-[200px] -translate-y-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/8 rounded-full blur-[180px] translate-y-1/3 pointer-events-none" />

                    <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
                        <ScrollReveal>
                            <div className="text-center mb-20 space-y-3">
                                <span className="font-aerospace text-xs font-bold text-sky-400 uppercase tracking-[0.4em]">EXECUTION PLAN</span>
                                <h2 className="font-aerospace text-4xl md:text-5xl font-black uppercase tracking-widest text-white">Mission Roadmap</h2>
                                <p className="text-zinc-500 font-mono text-xs uppercase tracking-[0.5em]">Timeline: 2024 - 2030 // Global Deployment</p>
                            </div>
                        </ScrollReveal>

                        {/* ─── DESKTOP TIMELINE ─────────────────────────── */}
                        <ScrollReveal delay={200}>
                            <div className="hidden lg:block relative">

                                {/* Card row */}
                                <div className="grid grid-cols-5 gap-4">
                                    {roadmapPhases.map((item, idx) => {
                                        const isDone    = item.status === 'done';
                                        const isOngoing = item.status === 'ongoing';
                                        const isPending = item.status === 'pending';

                                        return (
                                            <div key={idx} className="flex flex-col">
                                                {/* ── Card ── */}
                                                <div className={`relative p-5 border flex flex-col gap-3 transition-all group hover:-translate-y-1 ${
                                                    isDone    ? 'border-sky-500/30 bg-sky-500/5 hover:border-sky-400/60 hover:shadow-[0_8px_32px_rgba(14,165,233,0.15)]' :
                                                    isOngoing ? 'border-cyan-400/40 bg-cyan-400/5 hover:border-cyan-400/70 hover:shadow-[0_8px_32px_rgba(34,211,238,0.2)]' :
                                                                'border-white/8 bg-white/[0.02] hover:border-white/20'
                                                }`}>
                                                    {/* Top row: phase label + status badge */}
                                                    <div className="flex items-center justify-between">
                                                        <span className={`font-aerospace font-black text-xs tracking-[0.3em] ${
                                                            isDone ? 'text-sky-400' : isOngoing ? 'text-cyan-400' : 'text-zinc-600'
                                                        }`}>PHASE {item.phase}</span>
                                                        {isDone && (
                                                            <span className="flex items-center gap-1 text-sky-400">
                                                                <CheckCircle2 className="w-4 h-4" strokeWidth={2.5} />
                                                            </span>
                                                        )}
                                                        {isOngoing && (
                                                            <span className="relative flex h-3 w-3">
                                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                                                                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-400" />
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Phase name */}
                                                    <h3 className={`font-aerospace font-bold text-[11px] uppercase tracking-widest leading-relaxed ${
                                                        isDone ? 'text-white' : isOngoing ? 'text-cyan-200' : 'text-zinc-500'
                                                    }`}>{item.label}</h3>

                                                    {/* Description */}
                                                    <p className="font-technical text-zinc-600 text-[11px] leading-relaxed flex-1">{item.desc}</p>

                                                    {/* Date / status footer */}
                                                    <div className={`mt-auto pt-3 border-t flex items-center justify-between ${
                                                        isDone ? 'border-sky-500/20' : isOngoing ? 'border-cyan-400/20' : 'border-white/5'
                                                    }`}>
                                                        <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest">{item.date}</span>
                                                        {isOngoing && (
                                                            <span className="font-aerospace font-black text-[9px] text-cyan-400 border border-cyan-400/40 px-2 py-0.5 tracking-[0.2em]">ACTIVE</span>
                                                        )}
                                                        {isDone && (
                                                            <span className="font-aerospace font-black text-[9px] text-sky-500 tracking-[0.2em]">COMPLETE</span>
                                                        )}
                                                    </div>

                                                    {/* Corner accent */}
                                                    {(isDone || isOngoing) && (
                                                        <div className={`absolute top-0 left-0 w-6 h-6 ${isDone ? 'border-t-2 border-l-2 border-sky-400/60' : 'border-t-2 border-l-2 border-cyan-400/60'}`} />
                                                    )}
                                                    {(isDone || isOngoing) && (
                                                        <div className={`absolute bottom-0 right-0 w-6 h-6 ${isDone ? 'border-b-2 border-r-2 border-sky-400/60' : 'border-b-2 border-r-2 border-cyan-400/60'}`} />
                                                    )}
                                                </div>

                                                {/* ── Connector line below card to timeline ── */}
                                                <div className={`mx-auto w-[2px] h-8 ${
                                                    isDone ? 'bg-sky-500/50' : isOngoing ? 'bg-cyan-400/50' : 'bg-white/10'
                                                }`} />

                                                {/* ── Timeline node ── */}
                                                <div className="flex items-center justify-center">
                                                    {isDone && (
                                                        <div className="w-4 h-4 rounded-full bg-sky-500 shadow-[0_0_14px_rgba(14,165,233,0.7)] ring-4 ring-sky-500/20" />
                                                    )}
                                                    {isOngoing && (
                                                        <div className="relative">
                                                            <div className="absolute inset-0 rounded-full bg-cyan-400/30 animate-ping scale-[2]" />
                                                            <div className="relative w-5 h-5 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.8)] ring-4 ring-cyan-400/20" />
                                                        </div>
                                                    )}
                                                    {isPending && (
                                                        <div className="w-4 h-4 rounded-full border-2 border-white/20 bg-[#040814]" />
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Horizontal track - sits behind all nodes at their level */}
                                <div className="relative mt-0">
                                    <div className="absolute left-[10%] right-[10%] top-0 h-[2px] bg-white/8 rounded-full" />
                                    <div className="absolute left-[10%] w-[34%] top-0 h-[2px] bg-gradient-to-r from-sky-500 to-sky-400 rounded-full shadow-[0_0_10px_rgba(14,165,233,0.6)]" />
                                </div>
                            </div>
                        </ScrollReveal>

                        {/* ─── MOBILE TIMELINE ─────────────────────────── */}
                        <div className="lg:hidden space-y-4 mt-8">
                            {roadmapPhases.map((item, idx) => {
                                const isDone    = item.status === 'done';
                                const isOngoing = item.status === 'ongoing';
                                return (
                                    <div key={idx} className={`flex items-start gap-4 p-5 border transition-colors ${
                                        isDone    ? 'border-sky-500/30 bg-sky-500/5' :
                                        isOngoing ? 'border-cyan-400/40 bg-cyan-400/5' :
                                                    'border-white/5 bg-white/[0.02]'
                                    }`}>
                                        <div className="flex-shrink-0 mt-1">
                                            {isDone    && <div className="w-9 h-9 rounded-full bg-sky-500 flex items-center justify-center shadow-[0_0_14px_rgba(14,165,233,0.5)]"><CheckCircle2 className="w-4 h-4 text-white" strokeWidth={2.5} /></div>}
                                            {isOngoing && <div className="w-9 h-9 rounded-full border-2 border-cyan-400 flex items-center justify-center"><div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" /></div>}
                                            {!isDone && !isOngoing && <div className="w-9 h-9 rounded-full border-2 border-white/20" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                <span className={`font-aerospace font-black text-xs tracking-widest ${isDone ? 'text-sky-400' : isOngoing ? 'text-cyan-400' : 'text-zinc-600'}`}>PHASE {item.phase}</span>
                                                <span className="font-mono text-[10px] text-zinc-600">{item.date}</span>
                                            </div>
                                            <p className="font-aerospace text-sm text-white font-bold uppercase tracking-wide">{item.label}</p>
                                            <p className="font-technical text-xs text-zinc-600 mt-1 leading-relaxed">{item.desc}</p>
                                        </div>
                                        {isOngoing && <span className="flex-shrink-0 text-cyan-400 font-aerospace text-[10px] font-black border border-cyan-400/40 px-2 py-1 tracking-widest self-start">ACTIVE</span>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════
                    SECTION 5 : B2C / B2B SPLIT
                ══════════════════════════════════════════════ */}
                <section className="relative overflow-hidden">
                    {/* subtle global gradient to unify both halves */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 via-black to-cyan-900/5 pointer-events-none" />
                    <div className="grid lg:grid-cols-2 relative z-10">
                        {/* ── B2C ── */}
                        <div className="relative group overflow-hidden border-b lg:border-b-0 lg:border-r border-white/5 min-h-[600px]">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1464802686167-b939a6910659?q=80&w=2070')] bg-cover bg-center opacity-25 group-hover:scale-105 transition-transform duration-1000" />
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/70 via-purple-900/30 to-black/90" />
                            {/* ambient glow */}
                            <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[120px] -translate-x-1/3 -translate-y-1/3 pointer-events-none" />
                            <div className="relative p-16 md:p-24 space-y-10 h-full flex flex-col justify-center">
                                <ScrollReveal>
                                    <div className="space-y-4">
                                        <h4 className="font-aerospace text-purple-400 font-bold uppercase tracking-[0.4em] text-xs">B2C ARCHIVE</h4>
                                        <h2 className="font-aerospace text-4xl md:text-5xl font-black uppercase tracking-tighter leading-[0.9] text-white">Cosmic Memory <br />Registry</h2>
                                    </div>
                                </ScrollReveal>
                                <p className="text-zinc-400 text-base leading-relaxed max-w-md font-technical font-light">
                                    An archival data-persistence layer for personal legacy. Anchor memories to the cosmos until their designated time window - tapping a $8.9B digital legacy market growing at 13.4% CAGR.
                                </p>
                                <Button variant="outline" className="w-fit border-purple-500/30 text-purple-400 hover:bg-purple-500/10 font-aerospace uppercase tracking-widest text-xs h-14 px-10 rounded-none transition-all hover:shadow-[0_0_24px_rgba(168,85,247,0.2)]" onClick={() => navigate('/v2/for-you')}>
                                    Explore Personal Archive <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </div>

                        {/* ── B2B ── */}
                        <div className="relative group overflow-hidden min-h-[600px]">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072')] bg-cover bg-center opacity-25 group-hover:scale-105 transition-transform duration-1000" />
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/70 via-cyan-900/30 to-black/90" />
                            {/* ambient glow */}
                            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-600/15 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3 pointer-events-none" />
                            <div className="relative p-16 md:p-24 space-y-10 h-full flex flex-col justify-center">
                                <ScrollReveal>
                                    <div className="space-y-4">
                                        <h4 className="font-aerospace text-cyan-400 font-bold uppercase tracking-[0.4em] text-xs">B2B DEFENSE</h4>
                                        <h2 className="font-aerospace text-4xl md:text-5xl font-black uppercase tracking-tighter leading-[0.9] text-white">Aerospace Command <br />Authorization</h2>
                                    </div>
                                </ScrollReveal>
                                <p className="text-zinc-400 text-base leading-relaxed max-w-md font-technical font-light">
                                    A non-spoofable, star-tracker-anchored security layer for satellite command. Additive to Zero Trust architectures - making credential theft insufficient to execute commands against orbital assets.
                                </p>
                                <Button variant="outline" className="w-fit border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 font-aerospace uppercase tracking-widest text-xs h-14 px-10 rounded-none transition-all hover:shadow-[0_0_24px_rgba(6,182,212,0.2)]" onClick={() => navigate('/v2/for-missions')}>
                                    Review Mission Specs <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

            </main>
        </V2Layout>
    );
};

export default V2LandingPage;
'@

[System.IO.File]::WriteAllText('c:\Users\shalini\starhold\src\v2\pages\V2LandingPage.tsx', $content, [System.Text.Encoding]::UTF8)
Write-Host "Done"
