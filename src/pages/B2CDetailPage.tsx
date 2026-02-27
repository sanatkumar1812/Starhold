import { CosmicBackground } from '@/components/CosmicBackground';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Button } from '@/components/ui/button';
import { Star, Lock, Calendar, Image, Gift, Sparkles, Shield, Radio, Box, Map, Globe, Palette, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ScrollToTop } from '@/components/ScrollToTop';

const B2CDetailPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const handleCreateMemory = () => {
        if (!isAuthenticated) {
            navigate('/auth?redirect=create');
        } else {
            navigate('/?create=true');
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-background">
            <CosmicBackground />
            <div className="relative z-10">
                <Navigation />

                <main className="pt-32 pb-20 px-4">
                    <div className="max-w-6xl mx-auto space-y-32">
                        {/* Hero Section */}
                        <ScrollReveal>
                            <div className="text-center space-y-8">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-sm text-primary font-mono uppercase tracking-widest">
                                    For You
                                </div>
                                <h1 className="font-serif text-5xl md:text-7xl text-foreground leading-tight">
                                    Cosmic Memory Registry
                                </h1>
                                <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                                    Preserve your most precious moments in the stars. Each memory receives a unique celestial address—
                                    encrypted, time-locked, and waiting among the cosmos.
                                </p>
                                <div className="pt-6">
                                    <Button
                                        variant="gold"
                                        size="xl"
                                        onClick={handleCreateMemory}
                                        className="px-12 py-8 text-xl rounded-2xl shadow-[0_0_30px_rgba(234,179,8,0.2)] hover:shadow-[0_0_50px_rgba(234,179,8,0.4)] transition-all duration-500"
                                    >
                                        <Star className="w-6 h-6 mr-3" />
                                        Create Your First Memory
                                    </Button>
                                </div>
                            </div>
                        </ScrollReveal>

                        {/* The Stellar Journey (Unified How It Works) */}
                        <ScrollReveal delay={200}>
                            <section className="space-y-20">
                                <div className="text-center space-y-6">
                                    <h2 className="font-serif text-5xl md:text-6xl text-foreground">
                                        The <span className="text-gradient-gold">Stellar Journey</span>
                                    </h2>
                                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                                        A sophisticated protocol designed to bridge the gap between human emotion and cosmic permanence.
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {[
                                        {
                                            icon: Box,
                                            title: '1. Digitization',
                                            description: 'Your memories are converted into high-entropy data artifacts, optimized for centennial preservation.',
                                        },
                                        {
                                            icon: Map,
                                            title: '2. Anchoring',
                                            description: 'Precise J2000.0 coordinates are assigned, tethering your vault to a fixed location in the celestial sphere.',
                                        },
                                        {
                                            icon: Shield,
                                            title: '3. Encryption',
                                            description: 'Military-grade AES-256 protocols shield your message until the exact millisecond of its intended reveal.',
                                        },
                                        {
                                            icon: Radio,
                                            title: '4. Transmission',
                                            description: 'At the appointed time, the cosmic key is released, revealing your legacy through stunning deep-space imagery.',
                                        },
                                    ].map((step, index) => (
                                        <div
                                            key={step.title}
                                            className="group p-8 rounded-[2rem] border border-white/5 bg-slate-950/40 relative overflow-hidden transition-all duration-700 hover:border-primary/30"
                                        >
                                            <div className="relative z-10 space-y-4">
                                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                                                    <step.icon className="w-6 h-6" />
                                                </div>
                                                <h3 className="font-serif text-xl text-foreground">
                                                    {step.title}
                                                </h3>
                                                <p className="text-sm text-muted-foreground leading-relaxed">
                                                    {step.description}
                                                </p>
                                            </div>
                                            <div className="absolute -bottom-4 -right-4 text-8xl font-serif text-white/[0.02] group-hover:text-white/[0.05] transition-colors italic">
                                                {index + 1}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </ScrollReveal>

                        {/* What Makes It Special (Enhanced) */}
                        <ScrollReveal delay={300}>
                            <section className="space-y-16">
                                <div className="text-center space-y-4">
                                    <h2 className="font-serif text-4xl md:text-5xl text-foreground">
                                        What Makes It <span className="text-gradient-gold italic">Special</span>
                                    </h2>
                                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                                        Where cutting-edge technology meets the infinite canvas of the universe.
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {[
                                        {
                                            icon: Globe,
                                            title: 'Real Celestial Coordinates',
                                            description: 'Every memory receives genuine Right Ascension and Declination coordinates verified against NASA and ESA astronomical catalogs.',
                                        },
                                        {
                                            icon: Sparkles,
                                            title: 'JWST/Hubble Visualization',
                                            description: 'Upon unlock, receive stunning, high-definition visualizations of the actual deep space surrounding your coordinates.',
                                        },
                                        {
                                            icon: Palette,
                                            title: 'Physical Star Map',
                                            description: 'A beautifully designed, premium plaque featuring your custom constellation artwork and precise celestial address.',
                                        },
                                        {
                                            icon: Shield,
                                            title: 'Time-Locked Encryption',
                                            description: 'Military-grade AES-256 protocols ensure your legacy remains private until the exact millisecond you choose.',
                                        },
                                        {
                                            icon: Clock,
                                            title: 'Century-Long Preservation',
                                            description: 'Your memories are stored across orbital and terrestrial nodes, designed to span decades or even centuries.',
                                        },
                                        {
                                            icon: Star,
                                            title: 'Celestial Legacy',
                                            description: 'Create a permanent digital monument that survives beyond physical storage, waiting among the stars.',
                                        },
                                    ].map((feature) => (
                                        <div
                                            key={feature.title}
                                            className="group relative p-8 rounded-3xl border border-white/5 bg-slate-900/20 backdrop-blur-sm hover:bg-slate-900/40 hover:border-primary/30 transition-all duration-700 hover:-translate-y-2"
                                        >
                                            <div className="absolute -inset-px bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
                                            <div className="relative space-y-6">
                                                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-500">
                                                    <feature.icon className="w-6 h-6 text-primary" />
                                                </div>
                                                <div className="space-y-3">
                                                    <h3 className="font-serif text-2xl text-foreground group-hover:text-primary transition-colors">
                                                        {feature.title}
                                                    </h3>
                                                    <p className="text-muted-foreground leading-relaxed text-sm group-hover:text-slate-300 transition-colors">
                                                        {feature.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </ScrollReveal>

                        {/* A Permanent Address in the Infinite (Restored & Refined) */}
                        <ScrollReveal delay={400}>
                            <section className="grid lg:grid-cols-2 gap-16 items-center border-t border-white/5 pt-32">
                                <div className="space-y-8">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs text-primary font-mono uppercase tracking-widest">
                                        Technical Protocol
                                    </div>
                                    <h2 className="font-serif text-4xl md:text-5xl text-foreground leading-tight">
                                        A Permanent Address <br />
                                        <span className="text-muted-foreground">in the Infinite</span>
                                    </h2>

                                    <div className="space-y-6">
                                        {[
                                            {
                                                title: "Right Ascension (α)",
                                                desc: "The celestial equivalent of longitude, measured eastwards from the First Point of Aries along the celestial equator."
                                            },
                                            {
                                                title: "Declination (δ)",
                                                desc: "The celestial equivalent of latitude, measuring the angle north or south of the celestial equator to the object's position."
                                            },
                                            {
                                                title: "J2000 Period Epoch",
                                                desc: "All coordinates are corrected for the precession of the Earth's axis, ensuring your memory stays locked to its star across centuries."
                                            }
                                        ].map((item) => (
                                            <div key={item.title} className="flex gap-4">
                                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0 shadow-[0_0_10px_hsl(var(--gold))]" />
                                                <div>
                                                    <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                                                    <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Coordinate System Visualization */}
                                <div className="relative aspect-square glass rounded-3xl overflow-hidden flex items-center justify-center group p-8">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(60,100,255,0.1)_0%,transparent_70%)] animate-pulse" />
                                    <svg viewBox="0 0 400 400" className="w-full h-full relative z-10 opacity-80 group-hover:opacity-100 transition-opacity duration-700">
                                        <circle cx="200" cy="200" r="160" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4 4" />
                                        <ellipse cx="200" cy="200" rx="160" ry="40" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                                        <line x1="200" y1="40" x2="200" y2="360" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                                        <line x1="40" y1="200" x2="360" y2="200" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                                        <g className="animate-drift" style={{ transformOrigin: '200px 200px' }}>
                                            <circle cx="280" cy="120" r="4" fill="#EAB308" className="animate-twinkle" />
                                            <line x1="200" y1="200" x2="280" y2="120" stroke="#EAB308" strokeWidth="0.5" strokeDasharray="2 2" />
                                            <path d="M 200 160 A 160 40 0 0 1 280 185" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" />
                                            <path d="M 280 185 L 280 120" fill="none" stroke="#F472B6" strokeWidth="2" strokeLinecap="round" />
                                        </g>
                                    </svg>
                                    <div className="absolute top-8 right-8 text-right space-y-1">
                                        <div className="text-[10px] font-mono text-primary animate-pulse">LOCKING SOURCE...</div>
                                        <div className="text-xs font-mono text-white/40 uppercase">Ep. J2000.0</div>
                                    </div>
                                </div>
                            </section>
                        </ScrollReveal>

                        {/* Physical Product (Enhanced) */}
                        <ScrollReveal delay={500}>
                            <section className="glass p-12 rounded-[3rem] border-white/5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full -mr-32 -mt-32" />
                                <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
                                    <div className="space-y-6">
                                        <h2 className="font-serif text-4xl md:text-5xl text-foreground">
                                            A Gift That <span className="text-gradient-gold">Transcends Time</span>
                                        </h2>
                                        <p className="text-muted-foreground text-lg leading-relaxed">
                                            Each memory comes with a beautifully designed physical star map plaque.
                                            It features your constellation, precise coordinates, and unlock date—
                                            a tangible connection to your digital legacy among the stars.
                                        </p>
                                        <ul className="grid sm:grid-cols-2 gap-4">
                                            {[
                                                'Premium quality materials',
                                                'Custom constellation artwork',
                                                'Precise RA/Dec coordinates',
                                                'Unlock date engraving',
                                                'Multiple design templates',
                                                'Heirloom-grade finish'
                                            ].map((item) => (
                                                <li key={item} className="flex items-center gap-3 text-muted-foreground text-sm">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 flex items-center justify-center p-8 group overflow-hidden">
                                        <div className="relative w-full h-full flex items-center justify-center">
                                            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 group-hover:scale-110 transition-transform duration-1000" />
                                            <Gift className="w-48 h-48 text-primary relative animate-float group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </ScrollReveal>

                        {/* CTA */}
                        <ScrollReveal delay={500}>
                            <section className="text-center space-y-8 py-20">
                                <h2 className="font-serif text-5xl md:text-6xl text-foreground leading-tight">
                                    Begin Your Journey <br />
                                    <span className="text-gradient-gold">to the Infinite</span>
                                </h2>
                                <p className="text-muted-foreground text-lg leading-relaxed max-w-xl mx-auto">
                                    Create a gift that will be remembered for generations—a moment frozen in time,
                                    waiting among the cosmos.
                                </p>
                                <div className="pt-8">
                                    <Button
                                        variant="gold"
                                        size="xl"
                                        onClick={handleCreateMemory}
                                        className="px-12 py-8 text-xl rounded-2xl shadow-[0_0_30px_rgba(234,179,8,0.2)] hover:shadow-[0_0_50px_rgba(234,179,8,0.4)] transition-all duration-500"
                                    >
                                        Create Your Stellar Vault
                                    </Button>
                                    <p className="mt-6 text-xs font-mono text-muted-foreground uppercase tracking-widest">
                                        No orbital fees for initial digitization
                                    </p>
                                </div>
                            </section>
                        </ScrollReveal>
                    </div>
                </main>

                <Footer />
                <ScrollToTop />
            </div>
        </div>
    );
};

export default B2CDetailPage;
