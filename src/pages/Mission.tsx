import { CosmicBackground } from '@/components/CosmicBackground';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Shield, Globe, Trophy, ExternalLink } from 'lucide-react';
import { ScrollToTop } from '@/components/ScrollToTop';
import { Link } from 'react-router-dom';

const Mission = () => {
    return (
        <div className="min-h-screen relative overflow-hidden bg-background">
            <CosmicBackground />
            <div className="relative z-10">
                <Navigation />

                <main className="pt-32 pb-20 px-4">
                    <div className="max-w-4xl mx-auto space-y-20">
                        {/* Hero Section */}
                        <ScrollReveal>
                            <div className="text-center space-y-6">
                                <h1 className="font-serif text-5xl md:text-7xl text-foreground">A Dual Legacy</h1>
                                <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                                    Bridging the gap between eternal human sentiment and the uncompromising security of deep-space mission systems.
                                </p>
                            </div>
                        </ScrollReveal>

                        {/* Content Sections */}
                        <div className="grid gap-20">
                            {/* B2C Section */}
                            <ScrollReveal delay={200}>
                                <section className="grid md:grid-cols-2 gap-12 items-center">
                                    <div className="space-y-6">
                                        <div className="w-12 h-12 flex items-center justify-center">
                                            <img src="logo-small.svg" alt="Starhold Logo" className="w-full h-full object-contain" />
                                        </div>
                                        <h2 className="font-serif text-3xl text-foreground">The Memory Registry</h2>
                                        <p className="text-muted-foreground leading-relaxed">
                                            For individuals, Starhold is a celestial time capsule. We encode personal messages, photographs, and emotional artifacts into unique celestial coordinates. By tethering data to the stars, we ensure it survives digital obsolescence and physical decay.
                                        </p>
                                    </div>
                                    <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 flex items-center justify-center p-8 group">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 group-hover:scale-175 transition-transform duration-500" />
                                            <img src="logo-small.svg" alt="Starhold Logo" className="w-32 h-32 object-contain relative animate-float" />
                                        </div>
                                    </div>
                                </section>
                            </ScrollReveal>

                            {/* B2B / Mission Systems Section */}
                            <ScrollReveal delay={400}>
                                <section className="grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
                                    <div className="md:order-2 space-y-6">
                                        <div className="w-12 h-12 rounded-2xl bg-cosmic-blue/20 border border-cosmic-blue/30 flex items-center justify-center">
                                            <Shield className="w-6 h-6 text-cosmic-blue" />
                                        </div>
                                        <h2 className="font-serif text-3xl text-foreground">Mission-Critical Assurance</h2>
                                        <p className="text-muted-foreground leading-relaxed">
                                            For aerospace and defense, we provide the **Starhold Protocol V3.1**—a 6-factor zero-trust framework for satellite command and control. Utilizing Pulsar Chronometry and RF DNA fingerprinting, we protect mission-critical maneuvers from sensor degradation and sophisticated signal hijacking.
                                        </p>
                                    </div>
                                    <div className="md:order-1 aspect-square rounded-3xl bg-gradient-to-tr from-cosmic-blue/10 to-cosmic-blue/5 border border-cosmic-blue/20 flex items-center justify-center p-8 group">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-cosmic-blue/20 blur-3xl rounded-full scale-150 group-hover:scale-175 transition-transform duration-500" />
                                            <Globe className="w-32 h-32 text-cosmic-blue relative animate-drift" />
                                        </div>
                                    </div>
                                </section>
                            </ScrollReveal>

                            {/* Unified Infrastructure */}
                            <ScrollReveal delay={600}>
                                <section className="text-center glass p-12 rounded-[3rem] border-white/5 space-y-6">
                                    <h2 className="font-serif text-3xl text-foreground">One Network, Infinite Security</h2>
                                    <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                                        Our infrastructure leverages the same celestial coordinate system to anchor both a child's letter to the future and a trillion-dollar satellite's corrective burn. Whether it's a personal legacy or a national security asset, the Stars provide the ultimate, immutable reference point.
                                    </p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 text-xs font-mono uppercase tracking-widest text-primary/60">
                                        <div className="p-4 border border-white/5 rounded-xl bg-white/[0.02]">AES-GCM 256</div>
                                        <div className="p-4 border border-white/5 rounded-xl bg-white/[0.02]">HKDF Derived Keys</div>
                                        <div className="p-4 border border-white/5 rounded-xl bg-white/[0.02]">J2000 Epoch</div>
                                        <div className="p-4 border border-white/5 rounded-xl bg-white/[0.02]">Zero-Trust</div>
                                    </div>
                                </section>
                            </ScrollReveal>
                        </div>
                    </div>
                </main>

                <main className="pb-20 px-4">
                    <div className="max-w-4xl mx-auto space-y-12">

                        {/* Competition Context */}
                        <ScrollReveal delay={650}>
                            <div className="glass p-10 rounded-[3rem] border border-amber-500/10 space-y-6">
                                <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                                    <div className="space-y-2">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-mono uppercase tracking-widest">
                                            <Trophy className="w-3 h-3" />
                                            HolySpace Challenge — 1st Place
                                        </div>
                                        <h3 className="font-serif text-3xl text-foreground">Science Accelerator 2026</h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed max-w-xl">
                                            Starhold's B2C product won first place in the HolySpace Challenge — part of the
                                            <strong className="text-foreground"> Science Accelerator Class of 2026</strong> by
                                            Out of the Box Aerospace, a global programme for young space entrepreneurs aged 14–18.
                                            We are now <strong className="text-foreground">finalizing our dual-use platform</strong> with a clear goal: 
                                            to win the upcoming finals and transition this project into a full-scale orbital infrastructure venture.
                                        </p>
                                    </div>
                                    <div className="shrink-0 text-center glass px-6 py-5 rounded-2xl border border-amber-500/10">
                                        <p className="text-4xl font-serif text-amber-400">1st</p>
                                        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-1">Place · HolySpace</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-3 pt-2">
                                    {["B2C Product", "Deep-Space Cryptography", "Star-Addressed Memory", "Advancing to Finals"].map(tag => (
                                        <span key={tag} className="px-3 py-1 rounded-full border border-white/5 bg-white/[0.03] text-xs font-mono text-muted-foreground/60 uppercase tracking-wider">{tag}</span>
                                    ))}
                                </div>
                                <a
                                    href="https://outoftheboxedu.space"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-sm text-amber-400/70 hover:text-amber-400 transition-colors"
                                >
                                    Out of the Box Aerospace <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                            </div>
                        </ScrollReveal>

                        {/* Vision Quote */}
                        <ScrollReveal delay={700}>
                            <div className="flex flex-col md:flex-row gap-8 items-center glass p-10 rounded-[3rem] border-white/5">
                                <div className="space-y-4 flex-1 text-center md:text-left">
                                    <h3 className="font-serif text-3xl">Technical Brief</h3>
                                    <p className="text-muted-foreground text-sm">Deep-dive into the STARHOLD V3.1 cryptographic architecture and Pulsar-based verification systems.</p>
                                    <Link to="/techdocs" className="inline-block px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors mt-2">View Specs</Link>
                                </div>
                                <div className="w-px h-20 bg-white/10 hidden md:block" />
                                <div className="space-y-4 flex-1 text-center md:text-left">
                                    <h3 className="font-serif text-3xl">International Growth</h3>
                                    <p className="text-muted-foreground text-sm">Our vision extends far beyond the competition. We are building the foundations to become a legitimate international aerospace startup, providing high-assurance security for the next generation of space assets.</p>
                                    <Link to="/about" className="inline-block px-8 py-3 rounded-full glass border-white/10 text-foreground font-semibold hover:bg-white/5 transition-colors mt-2">Meet the Team</Link>
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

export default Mission;
