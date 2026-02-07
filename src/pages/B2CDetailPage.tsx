import { CosmicBackground } from '@/components/CosmicBackground';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Button } from '@/components/ui/button';
import { Star, Lock, Calendar, Image, Gift, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { HowItWorks } from '@/components/HowItWorks';
import { CosmicTimeline } from '@/components/CosmicTimeline';
import { Features } from '@/components/Features';
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

                        {/* How It Works */}
                        <ScrollReveal delay={200}>
                            <section className="space-y-16">
                                <div className="text-center space-y-4">
                                    <h2 className="font-serif text-4xl md:text-5xl text-foreground">
                                        How It Works
                                    </h2>
                                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                                        Four simple steps to immortalize your memories in the cosmos
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                                    {[
                                        {
                                            icon: Image,
                                            title: 'Upload Your Memory',
                                            description: 'Share photos, videos, letters, or voice recordings—anything that holds meaning for you.',
                                        },
                                        {
                                            icon: Star,
                                            title: 'Receive Coordinates',
                                            description: 'Your memory is assigned unique RA/Dec celestial coordinates from real astronomical catalogs.',
                                        },
                                        {
                                            icon: Lock,
                                            title: 'Set Unlock Date',
                                            description: 'Choose when your memory will be revealed—days, years, or even decades from now.',
                                        },
                                        {
                                            icon: Gift,
                                            title: 'Get Star Map',
                                            description: 'Receive a beautiful physical plaque showing your constellation, coordinates, and unlock date.',
                                        },
                                    ].map((step, index) => (
                                        <div
                                            key={step.title}
                                            className="glass p-8 rounded-3xl space-y-6 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 relative group"
                                        >
                                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                                <step.icon className="w-7 h-7 text-primary" />
                                            </div>
                                            <div className="space-y-3">
                                                <h3 className="font-serif text-2xl text-foreground group-hover:text-primary transition-colors">
                                                    {step.title}
                                                </h3>
                                                <p className="text-muted-foreground leading-relaxed text-sm">
                                                    {step.description}
                                                </p>
                                            </div>
                                            <div className="absolute top-4 right-6 text-4xl font-serif text-primary/5 group-hover:text-primary/10 transition-colors italic">
                                                0{index + 1}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </ScrollReveal>

                        {/* Features */}
                        <ScrollReveal delay={300}>
                            <section className="space-y-16">
                                <div className="text-center space-y-4">
                                    <h2 className="font-serif text-4xl md:text-5xl text-foreground">
                                        What Makes It Special
                                    </h2>
                                </div>

                                <div className="grid md:grid-cols-2 gap-12">
                                    {[
                                        {
                                            icon: Lock,
                                            title: 'Time-Locked Encryption',
                                            description: 'Military-grade AES-256 encryption ensures your memory remains private until the exact moment you choose. Only your recipient, at the appointed time, will have the key.',
                                        },
                                        {
                                            icon: Sparkles,
                                            title: 'Real Space Imagery',
                                            description: 'Upon unlock, receive stunning visualizations of actual deep space around your coordinates using data from Hubble, JWST, and other observatories.',
                                        },
                                        {
                                            icon: Star,
                                            title: 'Authentic Coordinates',
                                            description: 'Every memory receives genuine Right Ascension and Declination coordinates verified against NASA and ESA astronomical catalogs.',
                                        },
                                        {
                                            icon: Calendar,
                                            title: 'Century-Long Preservation',
                                            description: 'Your memories are preserved for generations, designed to span decades or even centuries into the future.',
                                        },
                                    ].map((feature) => (
                                        <div
                                            key={feature.title}
                                            className="flex gap-6 p-8 rounded-3xl border border-white/5 bg-slate-900/20 backdrop-blur-sm hover:bg-slate-900/40 hover:border-primary/30 transition-all duration-700"
                                        >
                                            <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                                <feature.icon className="w-6 h-6 text-primary" />
                                            </div>
                                            <div className="space-y-3">
                                                <h3 className="font-serif text-2xl text-foreground">
                                                    {feature.title}
                                                </h3>
                                                <p className="text-muted-foreground leading-relaxed">
                                                    {feature.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </ScrollReveal>

                        {/* Physical Product */}
                        <ScrollReveal delay={400}>
                            <section className="glass p-12 rounded-[3rem] border-white/5">
                                <div className="grid lg:grid-cols-2 gap-12 items-center">
                                    <div className="space-y-6">
                                        <h2 className="font-serif text-4xl md:text-5xl text-foreground">
                                            A Gift That Transcends Time
                                        </h2>
                                        <p className="text-muted-foreground text-lg leading-relaxed">
                                            Each memory comes with a beautifully designed physical star map plaque.
                                            It features your constellation, precise coordinates, and unlock date—
                                            a tangible connection to your digital legacy among the stars.
                                        </p>
                                        <ul className="space-y-3">
                                            {[
                                                'Premium quality materials',
                                                'Custom constellation artwork',
                                                'Precise RA/Dec coordinates',
                                                'Unlock date engraving',
                                                'Multiple design templates',
                                            ].map((item) => (
                                                <li key={item} className="flex items-center gap-3 text-muted-foreground">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 flex items-center justify-center p-8">
                                        <div className="relative w-full h-full flex items-center justify-center">
                                            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                                            <Gift className="w-48 h-48 text-primary relative animate-float" />
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </ScrollReveal>

                        {/* How It Works (Relocated) */}
                        <ScrollReveal>
                            <HowItWorks />
                        </ScrollReveal>

                        {/* Timeline (Relocated) */}
                        <ScrollReveal delay={200}>
                            <CosmicTimeline />
                        </ScrollReveal>

                        {/* Features (Relocated) */}
                        <ScrollReveal>
                            <Features />
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
