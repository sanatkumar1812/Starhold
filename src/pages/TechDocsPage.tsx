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

                        {/* Primary Technical Resources */}
                        <ScrollReveal delay={100}>
                            <div className="grid lg:grid-cols-3 gap-8 items-stretch">
                                {/* V3.1 Whitepaper (NEW) */}
                                <div className="glass p-8 rounded-[2rem] border-blue-500/20 bg-blue-500/5 flex flex-col space-y-6">
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <h2 className="text-2xl font-serif">V3.1 Whitepaper</h2>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        The official specification for the 6-factor zero-trust framework, detailing pulsar-anchored cryptography.
                                    </p>
                                    <div className="flex gap-3 mt-auto">
                                        <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-500 rounded-lg">
                                            <a href="/starhold_v3.1_whitepaper.md" download>
                                                <Download className="w-4 h-4 mr-2" /> MD
                                            </a>
                                        </Button>
                                        <Button asChild size="sm" variant="outline" className="rounded-lg border-white/10">
                                            <a href="/starhold_v3.1_whitepaper.md" target="_blank">
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        </Button>
                                    </div>
                                </div>

                                {/* Market & Technical Research Section */}
                                <div className="glass p-8 rounded-[2rem] border-white/5 flex flex-col space-y-6">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <h2 className="text-2xl font-serif">Market Research</h2>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Research paper detailing the convergence of orbital mechanics and cosmic infrastructure.
                                    </p>
                                    <div className="flex gap-3 mt-auto">
                                        <Button asChild size="sm" variant="gold" className="rounded-lg">
                                            <a href="Starhold Market and Technical Research.pdf" download>
                                                <Download className="w-4 h-4 mr-2" /> PDF
                                            </a>
                                        </Button>
                                    </div>
                                </div>

                                {/* Starhold Onepager */}
                                <div className="glass p-8 rounded-[2rem] border-white/5 space-y-6">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <Globe className="w-6 h-6" />
                                    </div>
                                    <h2 className="text-2xl font-serif">Onepager</h2>
                                    <p className="text-sm text-muted-foreground text-sm">
                                        High-level overview of the Starhold mission architecture and ecosystem.
                                    </p>
                                    <Button asChild size="sm" variant="outline" className="w-fit rounded-lg border-white/10 mt-auto">
                                        <a href="Starhold onepager.png" target="_blank">
                                            <ExternalLink className="w-4 h-4 mr-2" /> View PNG
                                        </a>
                                    </Button>
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
                                <div className="space-y-16">
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/10">
                                        <div className="space-y-2">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-mono uppercase tracking-widest border border-blue-500/20">
                                                Latest Release
                                            </div>
                                            <h3 className="text-4xl font-serif text-foreground">V3.1: Hexa-Factor Auth (HFA)</h3>
                                        </div>
                                        <div className="text-right hidden md:block">
                                            <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Release Date</div>
                                            <div className="text-foreground">May 2026</div>
                                        </div>
                                    </div>

                                    <div className="grid lg:grid-cols-2 gap-16 items-start">
                                        <div className="space-y-8">
                                            <div className="space-y-4">
                                                <h4 className="text-2xl font-serif text-primary">The Spacetime Root of Trust</h4>
                                                <p className="text-muted-foreground leading-relaxed">
                                                    V3.1 introduces the **Hexa-Factor Auth (HFA)** engine, establishing a security framework that is immune to ground-based signal spoofing by requiring six independent variables to be validated:
                                                </p>
                                            </div>

                                            <div className="grid sm:grid-cols-2 gap-6">
                                                {[
                                                    { icon: Clock, title: "Pulsar Chronometry", desc: "Real-time temporal sync using precise rotation of designated pulsars." },
                                                    { icon: Cpu, title: "RF DNA Fingerprinting", desc: "Analysis of physical transmitter harmonics and oscillator drift." },
                                                    { icon: Map, title: "Celestial Anchoring", desc: "RA/Dec coordinate sector validation against NASA/ESA catalogs." },
                                                    { icon: Shield, title: "Independent Gating", desc: "Cross-validation with onboard star trackers for orientation matching." },
                                                ].map(i => (
                                                    <div key={i.title} className="space-y-2">
                                                        <div className="flex items-center gap-2 text-primary">
                                                            <i.icon className="w-4 h-4" />
                                                            <span className="font-semibold text-sm">{i.title}</span>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground leading-relaxed">{i.desc}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="relative group">
                                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-primary opacity-20 blur group-hover:opacity-30 transition duration-1000"></div>
                                            <div className="relative glass p-8 rounded-[2rem] border-white/10 space-y-6">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                                        <span className="font-mono text-xs text-blue-400 uppercase tracking-widest">Protocol Logic V3.1</span>
                                                    </div>
                                                    <Terminal className="w-4 h-4 text-blue-400" />
                                                </div>
                                                <div className="font-mono text-[13px] leading-relaxed space-y-2 text-slate-300">
                                                    <div className="text-blue-400">// Starhold V3.1 Verification Logic</div>
                                                    <div>bool <span className="text-primary">validateCommand</span>(CommandPacket pkt) &#123;</div>
                                                    <div className="pl-4">if (!PulsarSync::<span className="text-emerald-400">verify</span>(pkt.time)) return false;</div>
                                                    <div className="pl-4">if (!RFDNA::<span className="text-emerald-400">match</span>(pkt.sig)) return false;</div>
                                                    <div className="pl-4">if (!Celestial::<span className="text-emerald-400">isAuth</span>(pkt.coord)) return false;</div>
                                                    <div className="pl-4 mt-2">return Cryptography::<span className="text-emerald-400">decrypt</span>(pkt.payload);</div>
                                                    <div>&#125;</div>
                                                </div>
                                                <div className="pt-4 border-t border-white/5">
                                                    <p className="text-[11px] text-muted-foreground italic">
                                                        Pulsar Chronometry provides a strict +/- 60-second window, immune to NTP spoofing.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* --- END V3.1 SECTION --- */}

                                {/* --- START V2.7 SECTION (LEGACY) --- */}
                                <div className="space-y-16 pt-20 border-t border-white/5 opacity-80 hover:opacity-100 transition-opacity">
                                    <div className="flex items-center gap-3">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-muted-foreground text-[10px] font-mono uppercase tracking-widest border border-white/10">
                                            Legacy Protocol
                                        </div>
                                        <h3 className="text-3xl font-serif text-foreground/70">V2.7: Tri-Bind HKDF</h3>
                                    </div>

                                    <div className="grid lg:grid-cols-2 gap-16 items-start">
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-3 text-primary/70">
                                                <div className="p-2 rounded-lg bg-primary/5"><Binary className="w-6 h-6" /></div>
                                                <h4 className="text-2xl font-serif">Tri-Bind Key Synthesis</h4>
                                            </div>
                                            <p className="text-muted-foreground leading-relaxed">
                                                V2.7 introduced the "Tri-Bind" key synthesis using HKDF (HMAC-based Key Derivation Function). Raw stellar inputs are extracted and expanded into a cryptographically strong key bound to three distinct pillars:
                                            </p>
                                            <ul className="space-y-3 pt-2">
                                                <li className="flex gap-3 text-sm text-muted-foreground/80">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 shrink-0" />
                                                    <span><strong>Entropy Source:</strong> The concatenation of the Stellar Geometry Seed and the MASTER_SECRET.</span>
                                                </li>
                                                <li className="flex gap-3 text-sm text-muted-foreground/80">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 shrink-0" />
                                                    <span><strong>Temporal Context:</strong> Target Time UTC guarantees keys rotate per minute.</span>
                                                </li>
                                            </ul>
                                        </div>

                                        <div className="bg-slate-900/50 p-8 rounded-3xl border border-white/5 font-mono text-[11px] leading-relaxed">
                                            <div className="text-[10px] text-primary/40 mb-4 uppercase tracking-widest font-bold">KDF Calculation (V2.7)</div>
                                            <div className="text-slate-400">
                                                ikm = StellarGeometrySeed + MASTER_SECRET <br />
                                                salt = target_time_utc <br />
                                                info = HARDWARE_ID <br />
                                                sky_key = HKDF(algorithm=SHA256, length=32, salt, info, ikm)
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-12 rounded-[3rem] bg-white/5 border border-white/5">
                                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                                            <div className="space-y-6">
                                                <h4 className="text-2xl font-serif">AES-GCM Authentication</h4>
                                                <p className="text-muted-foreground text-sm leading-relaxed">
                                                    Introduced Authenticated Encryption with Associated Data (AEAD) to the Starhold network, pairing confidentiality with tamper-evidence for personal memory packets.
                                                </p>
                                            </div>
                                            <div className="bg-black/40 p-8 rounded-2xl font-mono text-[10px] space-y-1 text-primary/40">
                                                <div>CIPHER_SUITE: AES_256_GCM</div>
                                                <div>AUTH_MODE: ZERO_TRUST_TAG_VALIDATION</div>
                                                <div className="text-emerald-500/50 mt-2">// V2.7 COMPLIANT</div>
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
