import { CosmicBackground } from '@/components/CosmicBackground';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Button } from '@/components/ui/button';
import { Shield, Lock, Binary, Satellite, Activity, Terminal, FileText, Download, ExternalLink, Globe, Cpu, Zap } from 'lucide-react';
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

                        {/* Ultra-Detailed Protocol Documentation */}
                        <ScrollReveal delay={300}>
                            <div className="space-y-24 pt-20 border-t border-white/5">
                                <div className="text-center space-y-4">
                                    <h2 className="text-4xl md:text-5xl font-serif text-gradient-gold">SEP: Stellar Encryption Protocol</h2>
                                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                                        Hardware-anchored celestial encryption using real-time orbital astrometry.
                                    </p>
                                </div>

                                {/* Detailed Phase 1 */}
                                <div className="grid lg:grid-cols-2 gap-16 items-start">
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 text-primary">
                                            <div className="p-2 rounded-lg bg-primary/10"><Satellite className="w-6 h-6" /></div>
                                            <h3 className="text-2xl font-serif">Phase 1: SGP4 Orbital Propagation</h3>
                                        </div>
                                        <p className="text-muted-foreground leading-relaxed">
                                            The protocol begins by resolving the satellite's exact position index in the Earth-Centered Inertial (ECI) frame.
                                            Using the <strong>Simplified General Perturbations (SGP4)</strong> model, we ingest NASA/NORAD Two-Line Element (TLE) sets
                                            to calculate the Zenith Boresight—a vector pointing directly away from Earth's center through the optical sensor.
                                        </p>
                                        <div className="bg-slate-950/50 p-6 rounded-2xl border border-white/5 font-mono text-xs space-y-2 overflow-hidden">
                                            <div className="text-primary/40 border-b border-white/5 pb-2 mb-4">ORBITAL PROPAGATION VECTOR</div>
                                            <div className="text-cyan-500">t_epoch = [2460368.5] // Julian Date</div>
                                            <div className="text-cyan-500">r_eci = [6781.2, -452.1, 1205.4] // km</div>
                                            <div className="text-cyan-500">v_eci = [0.45, 7.52, -1.23] // km/s</div>
                                            <div className="pt-4 text-xs text-muted-foreground/60 italic">
                                                // Precession, nutation, and polar motion corrections applied
                                            </div>
                                        </div>
                                    </div>
                                    <div className="glass p-8 rounded-[2rem] border-white/5 space-y-4">
                                        <h4 className="font-mono text-xs text-primary uppercase tracking-tighter tracking-widest">Zenith Boresight Logic</h4>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            Encryption keys are tied to the <strong>Zenith Vector (Ẑ)</strong>. At any given millisecond, only the specific satellite
                                            at its designated orbital node has the "Line of Sight" required to authenticate the star pattern.
                                            This creates a unique "Time-Space Dual Lock" that cannot be replicated from any other point in Earth orbit.
                                        </p>
                                        <div className="h-40 flex items-center justify-center opacity-40">
                                            <Globe className="w-32 h-32 animate-pulse text-primary/20" />
                                        </div>
                                    </div>
                                </div>

                                {/* Detailed Phase 2 */}
                                <div className="space-y-12">
                                    <div className="max-w-3xl space-y-6">
                                        <div className="flex items-center gap-3 text-primary">
                                            <div className="p-2 rounded-lg bg-primary/10"><Binary className="w-6 h-6" /></div>
                                            <h3 className="text-2xl font-serif">Phase 2: Gaia DR3 Astrometric Locking</h3>
                                        </div>
                                        <p className="text-muted-foreground leading-relaxed text-lg">
                                            Once the Zenith coordinate (RA/Dec) is established, the satellite syncs with the <strong>Gaia DR3 Star Catalog</strong>.
                                            The protocol identifies the unique geometric constellation of the 10 brightest bodies in the current Field of View.
                                        </p>
                                    </div>
                                    <div className="grid md:grid-cols-3 gap-8">
                                        {[
                                            { icon: Binary, title: "Deterministic Hashing", desc: "The relative distances and magnitudes of the stars are hashed to create a 256-bit entropy pool." },
                                            { icon: Activity, title: "Astrometric Noise", desc: "Sub-arcsecond variations in star position (parallax) act as a natural random number generator." },
                                            { icon: Lock, title: "Temporal Vaulting", desc: "The keys expire the moment the satellite moves 500 meters beyond its calculated orbital point." }
                                        ].map(item => (
                                            <div key={item.title} className="p-8 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                                                <item.icon className="w-5 h-5 text-primary" />
                                                <h4 className="font-serif text-lg">{item.title}</h4>
                                                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="max-w-3xl mx-auto bg-slate-900/50 p-8 rounded-3xl border border-white/5 font-mono text-sm leading-relaxed">
                                        <div className="text-xs text-primary/40 mb-4 uppercase tracking-widest font-bold">Key Derivation Function (KDF)</div>
                                        <div className="text-slate-300">
                                            stars = Gaia.fetch(RA, Dec, FOV=15°) <br />
                                            p_seeds = stars.map(s {'=>'} hash(s.id + s.mag)) <br />
                                            master_key = HMAC_SHA256(p_seeds, t_epoch)
                                        </div>
                                        <div className="mt-6 p-4 bg-black/60 rounded-lg text-xs text-emerald-400/80 border border-emerald-500/20 break-all">
                                            0x7f4e2c88d8b9a1...1e2f3d4c5b6a789 // Final Derived Mission Key
                                        </div>
                                    </div>
                                </div>

                                {/* Detailed Phase 3 */}
                                <div className="p-12 md:p-16 rounded-[4rem] bg-gradient-to-br from-primary/10 via-transparent to-transparent border border-primary/20">
                                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                                        <div className="space-y-8">
                                            <h3 className="text-3xl font-serif">Phase 3: AES-256-GCM Cryptographic Stack</h3>
                                            <p className="text-muted-foreground leading-relaxed">
                                                The generated astrometric hash is used as an additional authentication factor in our
                                                <strong>AES-256-GCM</strong> cipher stack. This ensures that even if a message is intercepted,
                                                it cannot be decrypted without the real-time telemetry from the Starhold satellite network.
                                            </p>
                                            <ul className="grid sm:grid-cols-2 gap-4 pt-4">
                                                {[
                                                    "Galois/Counter Mode security",
                                                    "Nadir-uplinked IV salts",
                                                    "Zenith-derived entropy",
                                                    "Hardware-Locked decrypt"
                                                ].map(i => (
                                                    <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                                                        {i}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="bg-black/40 p-10 rounded-[3rem] font-mono text-center relative overflow-hidden group">
                                            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <div className="text-primary mb-6 animate-pulse"><Terminal className="w-10 h-10 mx-auto" /></div>
                                            <div className="text-[11px] text-primary/60 border-t border-white/10 pt-6 space-y-2">
                                                <div>CIPHER_SUITE: AES_256_GCM_CELESTIAL</div>
                                                <div>AUTH_MODE: HARDWARE_ZENITH_LOCKED</div>
                                                <div>ENTROPY_SOURCE: ASTROMETRIC_GAIA_DR3</div>
                                                <div className="text-emerald-500 font-bold mt-4">// SECURITY STATUS: VALID</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Final CTA */}
                                <div className="text-center space-y-8 py-20 border-t border-white/5">
                                    <h2 className="font-serif text-3xl md:text-4xl text-foreground">
                                        Continuing the <span className="text-gradient-gold italic">Mission</span>
                                    </h2>
                                    <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
                                        The Stellar Protocol is constantly evolving as our satellites push deeper into orbital astrometry.
                                        Return to the simulator to see the protocol in active deployment.
                                    </p>
                                    <div className="flex justify-center gap-4">
                                        <Button
                                            variant="gold"
                                            size="xl"
                                            className="px-12 py-8 text-lg rounded-2xl"
                                            onClick={() => window.location.href = '#/4d'}
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
