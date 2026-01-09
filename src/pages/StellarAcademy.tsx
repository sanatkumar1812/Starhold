import { CosmicBackground } from '@/components/CosmicBackground';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Star, Library, Microscope, Zap, BookOpen, Compass } from 'lucide-react';

const StellarAcademy = () => {
    const starTypes = [
        { type: 'O', color: 'bg-blue-500', label: 'Blue Giants', temp: ' > 30,000K', description: 'The hottest and rarest stars. They burn fast and bright, ending in magnificent supernovae.' },
        { type: 'B', color: 'bg-blue-300', label: 'Blue-White', temp: '10,000 - 30,000K', description: 'Extremely luminous and massive. Rigel in Orion is a classic B-type star.' },
        { type: 'A', color: 'bg-white', label: 'White', temp: '7,500 - 10,000K', description: 'Strong hydrogen lines. Sirius, the brightest star in our sky, is A-type.' },
        { type: 'F', color: 'bg-yellow-100', label: 'Yellow-White', temp: '6,000 - 7,500K', description: 'Main sequence stars. They appear white to the naked eye but have a yellow tint.' },
        { type: 'G', color: 'bg-yellow-400', label: 'Yellow', temp: '5,000 - 6,000K', description: 'Our Sun is a G-type star. Stable and long-lived, ideal for hosting life.' },
        { type: 'K', color: 'bg-orange-500', label: 'Orange', temp: '3,500 - 5,000K', description: 'Cooler than the Sun. Arcturus is a famous K-type giant.' },
        { type: 'M', color: 'bg-red-500', label: 'Red Dwarfs', temp: '< 3,500K', description: 'The most common stars in the galaxy. Cool, small, and can live for trillions of years.' },
    ];

    return (
        <div className="min-h-screen relative overflow-hidden bg-background">
            <CosmicBackground />
            <div className="relative z-10 flex flex-col min-h-screen">
                <Navigation />

                <main className="flex-1 pt-32 pb-20 px-4">
                    <div className="max-w-6xl mx-auto space-y-32">

                        {/* Academy Header */}
                        <ScrollReveal>
                            <div className="text-center space-y-6">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-xs text-primary font-mono uppercase tracking-[0.2em] mb-4">
                                    <Library className="w-4 h-4" /> Celestial Academy
                                </div>
                                <h1 className="font-serif text-5xl md:text-8xl text-foreground">The Language of <span className="text-gradient-gold italic">Light</span></h1>
                                <p className="text-xl text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed">
                                    Understand the science behind your archive. From the spectral signatures of distant suns to the geometry of the infinite.
                                </p>
                            </div>
                        </ScrollReveal>

                        {/* The Spectral Scale Interactive */}
                        <section className="space-y-16">
                            <ScrollReveal delay={200}>
                                <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-10">
                                    <div className="space-y-4">
                                        <h2 className="font-serif text-4xl text-foreground">The Spectral Scale</h2>
                                        <p className="text-muted-foreground max-w-xl">
                                            Stars are classified based on their spectral characteristics. Use this key to identify the nature of the star holding your memory.
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 font-mono text-[10px] text-primary/60 tracking-widest uppercase">
                                        <Zap className="w-4 h-4 animate-pulse" /> Thermal Analysis Active
                                    </div>
                                </div>
                            </ScrollReveal>

                            <div className="grid gap-4">
                                {starTypes.map((star, idx) => (
                                    <ScrollReveal key={star.type} delay={idx * 100}>
                                        <div className="glass group hover:bg-white/5 transition-all duration-500 p-6 md:p-8 rounded-[2rem] flex flex-col md:flex-row items-center gap-8 border-white/5 hover:border-primary/20">
                                            <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full ${star.color} shadow-2xl flex items-center justify-center text-background font-bold text-2xl md:text-3xl relative overflow-hidden`}>
                                                <div className="absolute inset-0 bg-white/20 animate-pulse" />
                                                {star.type}
                                            </div>
                                            <div className="flex-1 text-center md:text-left space-y-2">
                                                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                                                    <h3 className="font-serif text-2xl text-foreground">{star.label}</h3>
                                                    <span className="font-mono text-xs text-primary px-3 py-1 rounded-full bg-primary/10 w-fit mx-auto md:mx-0">
                                                        TEMP: {star.temp}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                                                    {star.description}
                                                </p>
                                            </div>
                                            <Star className="w-8 h-8 text-white/10 group-hover:text-primary/40 transition-colors shrink-0 hidden md:block" />
                                        </div>
                                    </ScrollReveal>
                                ))}
                            </div>
                        </section>

                        {/* Technical Fundamentals Section */}
                        <div className="grid md:grid-cols-2 gap-8">
                            <ScrollReveal delay={200}>
                                <div className="glass p-12 rounded-[3rem] border-white/5 space-y-6 h-full relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:text-primary/10 transition-colors">
                                        <Microscope className="w-32 h-32" />
                                    </div>
                                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8">
                                        <Compass className="w-7 h-7" />
                                    </div>
                                    <h3 className="font-serif text-3xl text-foreground">Celestial Coordinates</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        To lock a memory in place, we use the Equatorial Coordinate System. RA (Right Ascension) and Dec (Declination) act as a global lattice for the entire universe. Unlike terrestrial maps, these are fixed against the distant background of space, ensuring your archive never "drifts" from its stellar host.
                                    </p>
                                    <div className="pt-6 font-mono text-xs text-primary/50 uppercase tracking-widest">
                                        HIPPARCOS CATALOG PRIMARY SOURCE
                                    </div>
                                </div>
                            </ScrollReveal>

                            <ScrollReveal delay={400}>
                                <div className="glass p-12 rounded-[3rem] border-white/5 space-y-6 h-full relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:text-primary/10 transition-colors">
                                        <BookOpen className="w-32 h-32" />
                                    </div>
                                    <div className="w-14 h-14 rounded-2xl bg-cosmic-purple/10 flex items-center justify-center text-cosmic-purple mb-8">
                                        <Library className="w-7 h-7" />
                                    </div>
                                    <h3 className="font-serif text-3xl text-foreground">The Epoch Protocol</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Because Earth's axis wobbles slightly over thousands of years (precession), astronomers use an "Epoch" to standardize maps. Starhold uses J2000.0, the current standard reference. This technical precision is why your memory will be reachable by light-waves thousands of years from now.
                                    </p>
                                    <div className="pt-6 font-mono text-xs text-cosmic-purple/50 uppercase tracking-widest">
                                        CHRONO-STABILITY ASSURED
                                    </div>
                                </div>
                            </ScrollReveal>
                        </div>

                        {/* Final CTA */}
                        <ScrollReveal>
                            <div className="text-center bg-white/5 border border-white/10 rounded-[4rem] p-20 space-y-8">
                                <h2 className="font-serif text-4xl md:text-5xl text-foreground">Ready to test your vision?</h2>
                                <p className="text-muted-foreground max-w-xl mx-auto">
                                    Step into the observatory to see these principles in action or start encoding your primary archive entry.
                                </p>
                                <div className="flex flex-col sm:flex-row justify-center gap-4">
                                    <a href="#/observatory" className="px-10 py-4 rounded-full gradient-gold text-primary-foreground font-semibold hover:shadow-[0_0_30px_rgba(234,179,8,0.4)] transition-all">
                                        Visit Observatory
                                    </a>
                                    <a href="#/" className="px-10 py-4 rounded-full glass border-white/10 text-foreground font-semibold hover:bg-white/10 transition-all">
                                        Return to Origin
                                    </a>
                                </div>
                            </div>
                        </ScrollReveal>

                    </div>
                </main>

                <Footer />
            </div>
        </div>
    );
};

export default StellarAcademy;
