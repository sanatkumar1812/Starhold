import { CosmicBackground } from '@/components/CosmicBackground';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Star, Rocket, Shield, Globe } from 'lucide-react';

const About = () => {
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
                                <h1 className="font-serif text-5xl md:text-7xl text-foreground">Our Cosmic Mission</h1>
                                <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                                    Preserving human emotion and memory in the most stable archive ever known: the stars.
                                </p>
                            </div>
                        </ScrollReveal>

                        {/* Content Sections */}
                        <div className="grid gap-20">
                            <ScrollReveal delay={200}>
                                <section className="grid md:grid-cols-2 gap-12 items-center">
                                    <div className="space-y-6">
                                        <div className="w-12 h-12 rounded-2xl gradient-gold flex items-center justify-center">
                                            <Star className="w-6 h-6 text-primary-foreground" />
                                        </div>
                                        <h2 className="font-serif text-3xl text-foreground">What is Starhold?</h2>
                                        <p className="text-muted-foreground leading-relaxed">
                                            Starhold is a celestial time capsule. We believe that some memories are too precious to be lost to the fleeting nature of digital scrolls or physical decay. By encoding your messages, photos, and videos into unique celestial coordinates, we give them a permanent place in the heavens.
                                        </p>
                                    </div>
                                    <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 flex items-center justify-center p-8 group">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 group-hover:scale-175 transition-transform duration-500" />
                                            <Star className="w-32 h-32 text-primary relative animate-float" />
                                        </div>
                                    </div>
                                </section>
                            </ScrollReveal>

                            <ScrollReveal delay={400}>
                                <section className="grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
                                    <div className="md:order-2 space-y-6">
                                        <div className="w-12 h-12 rounded-2xl bg-cosmic-purple/20 border border-cosmic-purple/30 flex items-center justify-center">
                                            <Shield className="w-6 h-6 text-cosmic-purple" />
                                        </div>
                                        <h2 className="font-serif text-3xl text-foreground">Unbreakable Bonds</h2>
                                        <p className="text-muted-foreground leading-relaxed">
                                            Every memory is encrypted using military-grade protocols and assigned to a coordinate verified by astronomical catalogs. Only your chosen recipient, at the exact moment you specify, will have the key to unlock the transmission.
                                        </p>
                                    </div>
                                    <div className="md:order-1 aspect-square rounded-3xl bg-gradient-to-tr from-cosmic-purple/10 to-cosmic-purple/5 border border-cosmic-purple/20 flex items-center justify-center p-8 group">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-cosmic-purple/20 blur-3xl rounded-full scale-150 group-hover:scale-175 transition-transform duration-500" />
                                            <Globe className="w-32 h-32 text-cosmic-purple relative animate-drift" />
                                        </div>
                                    </div>
                                </section>
                            </ScrollReveal>
                        </div>

                        {/* Vision Quote */}
                        <ScrollReveal delay={600}>
                            <div className="text-center bg-primary/5 border border-primary/10 rounded-3xl p-12 space-y-6">
                                <p className="font-serif text-2xl md:text-3xl italic text-foreground leading-relaxed">
                                    "For my part I know nothing with any certainty, but the sight of the stars makes me dream."
                                </p>
                                <div className="w-12 h-px bg-primary/30 mx-auto" />
                                <p className="text-sm uppercase tracking-widest text-primary/60 font-mono">Archive Protocol v.4.2</p>
                            </div>
                        </ScrollReveal>
                    </div>
                </main>

                <Footer />
            </div>
        </div>
    );
};

export default About;
