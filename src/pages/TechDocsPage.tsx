import { CosmicBackground } from '@/components/CosmicBackground';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Button } from '@/components/ui/button';
import { Shield, Lock, Binary, Satellite, Activity, Terminal, FileText, Download, ExternalLink, Globe, Cpu, Zap, Clock, Map as MapIcon } from 'lucide-react';
import { ScrollToTop } from '@/components/ScrollToTop';

const TechDocsPage = () => {
    return (
        <div className="min-h-screen relative overflow-hidden bg-background">
            <CosmicBackground />
            <div className="relative z-10">
                <Navigation />

                <main className="pt-32 pb-20 px-4">
                    <div className="max-w-6xl mx-auto space-y-24">
                        {/* Header */}
                        <ScrollReveal>
                            <div className="space-y-8 text-center">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs text-primary font-mono uppercase tracking-widest">
                                    Engineering & Mission Assets
                                </div>
                                <h1 className="font-serif text-5xl md:text-7xl text-foreground">
                                    Technical <span className="text-gradient-gold">Documentation</span>
                                </h1>
                                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                                    Comprehensive technical specifications, research whitepapers, and mission assets for the Starhold orbital infrastructure.
                                </p>
                            </div>
                        </ScrollReveal>

                        {/* Market & Technical Research Section */}
                        <ScrollReveal delay={100}>
                            <div className="grid lg:grid-cols-2 gap-8 items-stretch">
                                <div className="glass p-8 md:p-12 rounded-[3rem] border-white/5 flex flex-col space-y-6">
                                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                        <FileText className="w-7 h-7" />
                                    </div>
                                    <h2 className="text-3xl font-serif">Market & Technical Research</h2>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Our comprehensive research paper detailing the convergence of orbital mechanics, 
                                        astrometric verification, and the future of cosmic information infrastructure.
                                    </p>
                                    
                                    {/* PDF Preview */}
                                    <div className="relative group rounded-2xl overflow-hidden border border-white/5 bg-black/40 aspect-[4/3] flex items-center justify-center mb-4">
                                        <iframe 
                                            src="Starhold Market and Technical Research.pdf#toolbar=0&navpanes=0&scrollbar=0" 
                                            className="w-full h-full border-none pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity"
                                            title="PDF Preview"
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                                    </div>

                                    <div className="flex flex-wrap gap-4 mt-auto">
                                        <Button asChild variant="gold" className="rounded-xl px-6">
                                            <a href="Starhold Market and Technical Research.pdf" download="Starhold Market and Technical Research.pdf">
                                                <Download className="w-4 h-4 mr-2" /> Download PDF
                                            </a>
                                        </Button>
                                        <Button asChild variant="outline" className="rounded-xl px-6 border-white/10 hover:bg-white/5">
                                            <a href="Starhold Market and Technical Research.pdf" target="_blank" rel="noopener noreferrer">
                                                <ExternalLink className="w-4 h-4 mr-2" /> View Fullscreen
                                            </a>
                                        </Button>
                                    </div>
                                </div>

                                <div className="glass p-8 md:p-12 rounded-[3rem] border-white/5 space-y-6">
                                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                        <Globe className="w-7 h-7" />
                                    </div>
                                    <h2 className="text-3xl font-serif">Starhold Onepager</h2>
                                    <p className="text-muted-foreground text-sm">
                                        A high-level overview of the Starhold mission architecture and ecosystem.
                                    </p>
                                    <div className="relative group rounded-2xl overflow-hidden border border-white/5 bg-black/40 aspect-[4/3] flex items-center justify-center">
                                        <img
                                            src="Starhold onepager.png"
                                            alt="Starhold Onepager"
                                            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Button asChild variant="gold" size="sm">
                                                <a href="Starhold onepager.png" target="_blank">Enlarge Image</a>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>

                        {/* Presentation Embed */}
                        <ScrollReveal delay={200}>
                            <div className="space-y-8">
                                <div className="text-center space-y-4">
                                    <h2 className="text-3xl font-serif">Mission Presentation</h2>
                                    <p className="text-muted-foreground">Detailed breakdown of the Starhold vision and technology stack.</p>
                                </div>
                                <div className="relative w-full aspect-video rounded-[2.5rem] overflow-hidden border border-white/5 glass">
                                    <iframe
                                        loading="lazy"
                                        className="absolute inset-0 w-full h-full"
                                        src="https://www.canva.com/design/DAHBrBdN_a0/IWtmPeBhiHUG0_M0sE2YRQ/view?embed"
                                        allowFullScreen
                                        allow="fullscreen"
                                    ></iframe>
                                </div>
                            </div>
                        </ScrollReveal>

                        {/* Protocol Evolution Documentation */}
                        <ScrollReveal delay={300}>
                            <div className="space-y-32 pt-20 border-t border-white/5">
                                <div className="text-center space-y-4">
                                    <h2 className="text-4xl md:text-6xl font-serif text-gradient-gold">Protocol Evolution</h2>
                                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                                        From high-assurance memories to mission-critical orbital command security.
                                    </p>
                                </div>

                                {/* --- START V3.1 SECTION --- */}
                                <div className="space-y-20">
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/10">
                                        <div className="space-y-2">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-mono uppercase tracking-widest border border-blue-500/20">
                                                Latest Protocol
                                            </div>
                                            <h3 className="text-4xl font-serif text-foreground">V3.1: Context-Aware Cryptography</h3>
                                        </div>
                                        <div className="text-right hidden md:block text-xs font-mono text-muted-foreground uppercase tracking-widest">
                                            Deep Space & Terrestrial Support
                                        </div>
                                    </div>

                                    {/* 6-Factor Table */}
                                    <div className="space-y-8">
                                        <h4 className="text-2xl font-serif text-primary">The Multi-Factor Zero-Trust Model</h4>
                                        <div className="overflow-x-auto rounded-2xl border border-white/5 bg-white/[0.02]">
                                            <table className="w-full text-sm text-left border-collapse">
                                                <thead className="bg-white/5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                                                    <tr>
                                                        <th className="p-4 border-b border-white/5">Rank</th>
                                                        <th className="p-4 border-b border-white/5">Factor</th>
                                                        <th className="p-4 border-b border-white/5">Description</th>
                                                        <th className="p-4 border-b border-white/5">Strength</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-muted-foreground">
                                                    {[
                                                        { r: 1, f: "Physical Geometry", d: "Geometric shape of visible stars or optical terrain hash.", s: "EXTREME" },
                                                        { r: 2, f: "Galactic Clock", d: "High-frequency phase of known X-ray pulsars (XNAV).", s: "EXTREME" },
                                                        { r: 3, f: "RF DNA", d: "Unique transmitter harmonics and signal characteristics.", s: "HIGH" },
                                                        { r: 4, f: "Hardware ID", d: "Cryptographic proof of unique silicon ID (TPM/PCR).", s: "HIGH" },
                                                        { r: 5, f: "Spacetime Bound", d: "Strict ±60-second execution window. Anti-replay.", s: "HIGH" },
                                                        { r: 6, f: "Digital Key", d: "AES-GCM Tag. Zero-trust authenticated encryption.", s: "MEDIUM" },
                                                    ].map(row => (
                                                        <tr key={row.r} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                                                            <td className="p-4 font-mono text-primary/60">{row.r}</td>
                                                            <td className="p-4 font-semibold text-foreground">{row.f}</td>
                                                            <td className="p-4 text-xs">{row.d}</td>
                                                            <td className="p-4 text-[10px] font-bold text-emerald-500/80">{row.s}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className="grid lg:grid-cols-2 gap-16">
                                        <div className="space-y-6">
                                            <h4 className="text-2xl font-serif text-primary">Deterministic Unlocking</h4>
                                            <p className="text-muted-foreground leading-relaxed">
                                                V3.1 moves beyond "Yes/No" authentication. Commands are sent mathematically **incomplete**—missing the physical variables of the universe. Decryption only occurs if the receiver captures live physical data that perfectly completes the cryptographic puzzle.
                                            </p>
                                            <div className="glass p-6 rounded-2xl border-white/5 space-y-4">
                                                <h5 className="font-mono text-[10px] uppercase tracking-widest text-primary">Rip-and-Burn Protocol</h5>
                                                <p className="text-xs text-muted-foreground leading-relaxed italic">
                                                    "The moment a command executes, the node triggers a **Secure RAM Purge**, zeroizing key material instantly. The physical 'wristband' required for that packet no longer exists in the universe."
                                                </p>
                                            </div>
                                        </div>
                                        <div className="glass p-8 rounded-[2rem] border-white/10 space-y-6">
                                            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                                    <span className="font-mono text-[10px] text-blue-400 uppercase tracking-widest">Protocol Flow V3.1</span>
                                                </div>
                                                <Terminal className="w-4 h-4 text-blue-400" />
                                            </div>
                                            <div className="space-y-4 font-mono text-[11px] text-slate-400">
                                                <div className="flex gap-4"><span className="text-blue-500/50">01</span><span>Isolation (Sandbox Memory Buffer)</span></div>
                                                <div className="flex gap-4"><span className="text-blue-500/50">02</span><span>TPM Firmware Integrity Check</span></div>
                                                <div className="flex gap-4"><span className="text-blue-500/50">03</span><span>RF DNA (SDR Signal Analysis)</span></div>
                                                <div className="flex gap-4"><span className="text-blue-500/50">04</span><span>Astrometric Key Synthesis</span></div>
                                                <div className="flex gap-4 text-emerald-400"><span className="text-emerald-500/50">05</span><span>Cryptographic Convergence (Decrypt)</span></div>
                                                <div className="flex gap-4 text-rose-400"><span className="text-rose-500/50">06</span><span>Secure RAM Purge (Zeroize)</span></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* --- END V3.1 SECTION --- */}

                                {/* --- START V2.7 SECTION --- */}
                                <div className="space-y-24 pt-20 border-t border-white/5 transition-opacity">
                                    <div className="text-center space-y-4">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-mono uppercase tracking-widest border border-primary/20">
                                            Latest Protocol
                                        </div>
                                        <h2 className="text-4xl md:text-5xl font-serif text-foreground">V2.7: SEP Protocol</h2>
                                        <p className="text-muted-foreground max-w-2xl mx-auto">
                                            Detailed hardware-anchored encryption for orbital memory archives.
                                        </p>
                                    </div>

                                    {/* Phase 1: HKDF */}
                                    <div className="grid lg:grid-cols-2 gap-16 items-start">
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-3 text-primary">
                                                <div className="p-2 rounded-lg bg-primary/5"><Binary className="w-6 h-6" /></div>
                                                <h3 className="text-2xl font-serif">1. Tri-Bind HKDF</h3>
                                            </div>
                                            <p className="text-muted-foreground text-sm leading-relaxed">
                                                V2.7 utilized "Tri-Bind" key synthesis using HKDF (SHA-256). Keys are expanded from the concatenation of the Stellar Geometry Seed, Master Secret, and Hardware ID.
                                            </p>
                                            <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 font-mono text-[10px] leading-relaxed">
                                                <div className="text-slate-400">
                                                    ikm = StellarSeed + MASTER_SECRET <br />
                                                    salt = target_time_utc <br />
                                                    sky_key = HKDF(SHA256, salt, ikm)
                                                </div>
                                            </div>
                                        </div>
                                        <div className="glass p-8 rounded-2xl border-white/5 space-y-4">
                                            <h4 className="font-mono text-[10px] text-primary uppercase tracking-widest">Spacetime Bound</h4>
                                            <p className="text-xs text-muted-foreground leading-relaxed">
                                                Enforced the strict ±60-second verification window. If the Earth-bound clock and orbital clock differed by more than 1 minute, the packet remained a "digital brick."
                                            </p>
                                        </div>
                                    </div>

                                    {/* Phase 2: Stellar Geometry */}
                                    <div className="space-y-12">
                                        <div className="max-w-3xl space-y-6">
                                            <div className="flex items-center gap-3 text-primary">
                                                <div className="p-2 rounded-lg bg-primary/5"><Satellite className="w-6 h-6" /></div>
                                                <h3 className="text-2xl font-serif">2. Stellar Geometry & Fuzzy Binning</h3>
                                            </div>
                                            <p className="text-muted-foreground text-sm leading-relaxed">
                                                The RA/Dec coordinates and relative distances of the 5 brightest stars form a unique 10-point geometric vector.
                                            </p>
                                        </div>
                                        <div className="grid md:grid-cols-3 gap-8">
                                            {[
                                                { icon: Binary, title: "Unforgeable Seed", desc: "Dependent on exact satellite orientation, impossible to spoof terrestrially." },
                                                { icon: Activity, title: "Fuzzy Binning", desc: "Resilient to minor atmospheric jitter by dividing space into 0.5° increments." },
                                                { icon: Lock, title: "Deterministic Convergence", desc: "Ground Station and Satellite converge perfectly on the same mathematical seed." }
                                            ].map(item => (
                                                <div key={item.title} className="p-8 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                                                    <item.icon className="w-5 h-5 text-primary" />
                                                    <h4 className="font-serif text-lg text-foreground">{item.title}</h4>
                                                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Phase 3: AES-GCM */}
                                    <div className="p-12 rounded-[3rem] bg-white/5 border border-white/5">
                                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                                            <div className="space-y-6">
                                                <h4 className="text-2xl font-serif">3. AES-GCM Authentication</h4>
                                                <p className="text-muted-foreground text-sm leading-relaxed">
                                                    Authenticated Encryption with Associated Data (AEAD) ensures that any tampering with the memory archive results in an InvalidTag exception.
                                                </p>
                                            </div>
                                            <div className="bg-black/40 p-8 rounded-2xl font-mono text-[10px] space-y-1 text-primary/40">
                                                <div>CIPHER_SUITE: AES_256_GCM</div>
                                                <div>AUTH_MODE: ZERO_TRUST_TAG_VALIDATION</div>
                                                <div className="text-emerald-500 mt-2">// V2.7 COMPLIANT</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* --- END V2.7 SECTION --- */}

                                {/* Final CTA */}
                                <div className="text-center space-y-8 py-20 border-t border-white/5">
                                    <h2 className="font-serif text-3xl md:text-4xl text-foreground">
                                        Continuing the <span className="text-gradient-gold italic">Mission</span>
                                    </h2>
                                    <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
                                        The Stellar Protocol is constantly evolving as our satellites push deeper into orbital astrometry.
                                        Return to the simulator to see V3.1 in active deployment.
                                    </p>
                                    <div className="flex justify-center gap-4">
                                        <Button
                                            variant="gold"
                                            size="xl"
                                            className="px-12 py-8 text-lg rounded-2xl"
                                            onClick={() => window.location.href = '/b2b-simulator'}
                                        >
                                            <Zap className="w-5 h-5 mr-3" /> Execute Mission Simulator
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </main>

                <Footer />
                <ScrollToTop />
            </div>
        </div>
    );
};

export default TechDocsPage;
