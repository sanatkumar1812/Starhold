import React from 'react';
import { V2Layout } from '../layout/V2Layout';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Button } from '@/components/ui/button';
import {
    Shield, Lock, Binary, Satellite, Activity, Terminal,
    FileText, Download, ExternalLink, Globe, Cpu, Zap, ChevronRight
} from 'lucide-react';

const V2TechDocs = () => {
    return (
        <V2Layout>
            <main className="pt-32 pb-40 px-6 max-w-7xl mx-auto space-y-32">

                {/* Header */}
                <ScrollReveal>
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-white/5 bg-white/[0.02] text-[10px] text-zinc-500 font-aerospace font-bold uppercase tracking-[0.5em]">
                            <Terminal className="w-4 h-4 text-cyan-500" /> Engineering Command
                        </div>
                        <h1 className="font-aerospace text-6xl md:text-8xl font-bold uppercase tracking-tight leading-[0.9]">
                            Technical <br />
                            <span className="text-cyan-400">Specifications</span>
                        </h1>
                        <p className="max-w-3xl text-xl text-zinc-400 font-technical font-light leading-relaxed">
                            Comprehensive mission architecture, cryptographic protocols, and system assets for the Starhold high-fidelity nexus.
                        </p>
                    </div>
                </ScrollReveal>

                {/* Asset Download Grid */}
                <div className="grid lg:grid-cols-2 gap-8">
                    <ScrollReveal>
                        <div className="bg-[#0A0A12] border border-white/5 p-12 aerospace-border aerospace-border-tl space-y-8 flex flex-col h-full hover:bg-white/[0.02] transition-colors group">
                            <div className="flex justify-between items-start">
                                <div className="w-16 h-16 bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                                    <FileText className="w-8 h-8" />
                                </div>
                                <Activity className="w-5 h-5 text-zinc-800 group-hover:text-cyan-500/20 transition-colors" />
                            </div>
                            <div className="space-y-6 flex-1">
                                <div className="space-y-4">
                                    <h3 className="font-aerospace text-3xl font-bold uppercase tracking-wider">Mission Whitepaper</h3>
                                    <p className="text-zinc-500 text-sm font-technical leading-relaxed">
                                        Advanced analysis of orbital astrometric verification and celestial encryption scalability.
                                        Rev. 2.4 // 2024.
                                    </p>
                                </div>
                                <div className="bg-black/50 border border-white/5 relative aspect-video aerospace-border overflow-hidden">
                                    <iframe
                                        src="Starhold Market and Technical Research.pdf#toolbar=0&navpanes=0&scrollbar=0"
                                        className="w-full h-full opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-4 pt-4">
                                <Button className="bg-cyan-500 hover:bg-cyan-400 text-[#0A0A12] font-aerospace font-bold uppercase tracking-widest text-[10px] h-12 px-8 rounded-none aerospace-border aerospace-border-tl">
                                    <a href="Starhold Market and Technical Research.pdf" download className="flex items-center gap-2">
                                        <Download className="w-4 h-4" /> Download PDF
                                    </a>
                                </Button>
                                <Button variant="outline" className="border-white/10 text-white font-aerospace font-bold uppercase tracking-widest text-[10px] h-12 px-8 rounded-none hover:bg-white/5">
                                    <a href="Starhold Market and Technical Research.pdf" target="_blank" className="flex items-center gap-2">
                                        <ExternalLink className="w-4 h-4" /> View Specs
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal delay={200}>
                        <div className="bg-[#0A0A12] border border-white/5 p-12 aerospace-border aerospace-border-tl space-y-8 flex flex-col h-full hover:bg-white/[0.02] transition-colors group">
                            <div className="flex justify-between items-start">
                                <div className="w-16 h-16 bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                                    <Globe className="w-8 h-8" />
                                </div>
                                <Cpu className="w-5 h-5 text-zinc-800 group-hover:text-cyan-500/20 transition-colors" />
                            </div>
                            <div className="space-y-6 flex-1">
                                <div className="space-y-4">
                                    <h3 className="font-aerospace text-3xl font-bold uppercase tracking-wider">Orbital Onepager</h3>
                                    <p className="text-zinc-500 text-sm font-technical leading-relaxed">
                                        High-level system topology and mission-node distribution map.
                                        Infrastructure Release // Phase 1.
                                    </p>
                                </div>
                                <div className="bg-black/50 border border-white/5 relative aspect-video aerospace-border overflow-hidden p-6 flex items-center justify-center">
                                    <img src="Starhold onepager.png" className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-700" alt="Specs" />
                                </div>
                            </div>
                            <Button variant="outline" className="w-full border-white/10 text-white font-aerospace font-bold uppercase tracking-widest text-[10px] h-12 rounded-none hover:bg-white/5">
                                <a href="Starhold onepager.png" target="_blank" className="flex items-center gap-2">
                                    <ExternalLink className="w-4 h-4" /> Enlarge System Map
                                </a>
                            </Button>
                        </div>
                    </ScrollReveal>
                </div>

                {/* SEP: Stellar Encryption Protocol */}
                <section className="space-y-20 pt-32 border-t border-white/5">
                    <div className="text-center space-y-4">
                        <h2 className="font-aerospace text-4xl md:text-5xl font-bold uppercase tracking-widest text-cyan-400">Stellar Encryption Protocol</h2>
                        <p className="text-zinc-500 font-technical text-sm uppercase tracking-widest">Protocol Type: SEP-V2 // Zenith Hardware-Locked</p>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-12">
                        {/* Side Specs */}
                        <div className="lg:col-span-4 space-y-8">
                            {[
                                { title: "ECI Frame Resolution", value: "SGP4 Model", desc: "Two-Line Element (TLE) ingest for precise orbital node calculation." },
                                { title: "Astrometric Locking", value: "Gaia DR3 Sync", desc: "Geometric constellation hashing from sub-arcsecond star position data." },
                                { title: "Cipher Stack", value: "AES-256-GCM", desc: "Military-grade encryption with zenith-derived temporal salts." }
                            ].map((spec, id) => (
                                <div key={id} className="bg-[#0A0A12] border-l-2 border-cyan-500/30 p-8 space-y-3">
                                    <div className="flex justify-between items-center group">
                                        <h4 className="font-aerospace text-xs text-white uppercase tracking-widest">{spec.title}</h4>
                                        <ChevronRight className="w-3 h-3 text-cyan-500 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                    <div className="font-aerospace text-lg text-cyan-400 uppercase font-bold">{spec.value}</div>
                                    <p className="text-zinc-500 text-xs font-technical leading-relaxed">{spec.desc}</p>
                                </div>
                            ))}
                        </div>

                        {/* Core Protocol Analysis */}
                        <div className="lg:col-span-8 bg-[#0A0A12] border border-white/5 p-12 aerospace-border aerospace-border-tl space-y-10">
                            <div className="flex items-center gap-4 text-emerald-500">
                                <Binary className="w-6 h-6 animate-pulse" />
                                <h3 className="font-aerospace text-2xl font-bold uppercase tracking-widest">Protocol Kernel // SHA-256 Analysis</h3>
                            </div>
                            <div className="bg-black/60 p-8 border border-white/10 font-technical text-sm leading-loose text-zinc-300">
                                <div className="text-zinc-500 mb-6 font-mono text-xs uppercase tracking-widest border-b border-white/5 pb-2">Key Derivation Sequence</div>
                                <p>
                                    1. Satellite resolves RA/Dec coordinates of Zenith Boresight (Ẑ). <br />
                                    2. System fetches top 10 star vectors within current 15° Field of View. <br />
                                    3. Relative magnitudes and angular distances are used as entropy pool. <br />
                                    4. J2000.0 precession corrections are applied to satisfy JDF requirements. <br />
                                    5. Final HMAC-SHA256 key is derived with a 30s TTL window.
                                </p>
                                <div className="mt-8 pt-6 border-t border-white/5 text-[10px] font-mono text-cyan-500/80 break-all bg-white/[0.02] p-4">
                                    ZENITH_KEY_SEED: 0A7B92C1D4E5F6B7A8C9D0E1F2A3B4C5D6E7F8A9B0C1D2E3F4A5B6C7D8E9F0
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final Component CTA */}
                <section className="bg-cyan-500 p-20 aerospace-border aerospace-border-tl flex flex-col items-center text-center space-y-10">
                    <Zap className="w-16 h-16 text-[#0A0A12]" />
                    <div className="space-y-4">
                        <h2 className="font-aerospace text-4xl font-bold uppercase tracking-widest text-[#0A0A12]">Ready for Deployment?</h2>
                        <p className="max-w-xl mx-auto text-[#0A0A12]/80 font-technical font-medium">
                            The technical specifications are now cached in your terminal. You are cleared to execute mission protocols.
                        </p>
                    </div>
                    <Button
                        onClick={() => window.location.href = '#/v2/for-missions'}
                        className="bg-[#0A0A12] text-white hover:bg-zinc-800 font-aerospace font-bold uppercase tracking-[0.3em] px-12 h-16 rounded-none transition-all"
                    >
                        Execute Simulator
                    </Button>
                </section>

            </main>
        </V2Layout>
    );
};

export default V2TechDocs;
