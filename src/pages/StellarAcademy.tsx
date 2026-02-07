import React, { useState, useEffect } from 'react';
import { CosmicBackground } from '@/components/CosmicBackground';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ScrollReveal } from '@/components/ScrollReveal';
import { ScrollToTop } from '@/components/ScrollToTop';
import { Library, CheckCircle2, HelpCircle } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import { CoordinateVisualizer } from '@/components/academy/CoordinateVisualizer';
import { StarLifecycleViewer } from '@/components/academy/StarLifecycleViewer';
import { ConstellationBuilder } from '@/components/academy/ConstellationBuilder';
import { CosmicCompendium } from '@/components/academy/CosmicCompendium';

const StellarAcademy = () => {
    // Scroll Progress Logic
    const [activeSection, setActiveSection] = useState(0);

    // Simple scroll spy (in a real app, use IntersectionObserver)
    useEffect(() => {
        const handleScroll = () => {
            const sections = document.querySelectorAll('section');
            sections.forEach((sec, idx) => {
                const rect = sec.getBoundingClientRect();
                if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
                    setActiveSection(idx + 1);
                }
            });
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const steps = [
        { id: 1, label: "Coordinates" },
        { id: 2, label: "Evolution" },
        { id: 3, label: "Compendium" },
        { id: 4, label: "Constellations" },
    ];

    const AIGuide = ({ tip }: { tip: string }) => (
        <TooltipProvider delayDuration={0}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-mono uppercase tracking-widest rounded-full transition-colors cursor-help border border-primary/20">
                        <HelpCircle className="w-3 h-3" /> Why this matters?
                    </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-black/90 border-primary/20 text-white max-w-xs p-4">
                    <p className="font-serif italic leading-relaxed text-sm">"{tip}"</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );

    return (
        <div className="min-h-screen relative overflow-hidden bg-background">
            <CosmicBackground />

            {/* Floating Progress Tracker */}
            <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden xl:flex flex-col gap-8">
                {steps.map((step, idx) => (
                    <div key={step.id} className="relative group flex items-center justify-end">
                        <span className={`
                            absolute right-8 text-xs font-mono uppercase tracking-widest transition-all duration-300
                            ${activeSection === step.id ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0'}
                        `}>
                            {step.label}
                        </span>
                        <div className={`
                            w-3 h-3 rounded-full border border-primary/50 transition-all duration-500
                            ${activeSection === step.id ? 'bg-primary scale-125 shadow-[0_0_15px_rgba(234,179,8,0.6)]' : 'bg-transparent'}
                            ${activeSection > step.id ? 'bg-primary/40' : ''}
                        `} />
                        {activeSection > step.id && <div className="absolute h-8 w-[1px] bg-primary/20 -bottom-8 right-[5px]" />}
                    </div>
                ))}
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                <Navigation />

                <main className="flex-1 pt-32 pb-20 px-4">
                    <div className="max-w-7xl mx-auto space-y-40">

                        {/* Academy Header */}
                        <ScrollReveal>
                            <div className="text-center space-y-6">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-xs text-primary font-mono uppercase tracking-[0.2em] mb-4">
                                    <Library className="w-4 h-4" /> Celestial Academy
                                </div>
                                <h1 className="font-serif text-5xl md:text-8xl text-foreground">The Language of <span className="text-gradient-gold italic">Light</span></h1>
                                <p className="text-xl text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed">
                                    Interactive modules to master the mechanics of the cosmos.
                                </p>
                            </div>
                        </ScrollReveal>

                        {/* Module 1: Coordinates */}
                        <section className="scroll-mt-32">
                            <ScrollReveal>
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-white/10 pb-8">
                                    <div className="space-y-4 max-w-2xl">
                                        <h2 className="font-serif text-4xl text-foreground">01. Celestial Coordinates</h2>
                                        <p className="text-muted-foreground text-lg">
                                            The Universal GPS. Learn how we map the infinite void using Right Ascension and Declination.
                                        </p>
                                    </div>
                                    <AIGuide tip="Coordinates ensure your memory is locked to a specific point in space-time, preventing it from drifting into the void." />
                                </div>
                            </ScrollReveal>
                            <ScrollReveal delay={200}>
                                <CoordinateVisualizer />
                            </ScrollReveal>
                        </section>

                        {/* Module 2: Stellar Evolution */}
                        <section className="scroll-mt-32">
                            <ScrollReveal>
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-white/10 pb-8">
                                    <div className="space-y-4 max-w-2xl">
                                        <h2 className="font-serif text-4xl text-foreground">02. Stellar Evolution</h2>
                                        <p className="text-muted-foreground text-lg">
                                            From birth to black holes. Witness the billion-year lifecycle of stars.
                                        </p>
                                    </div>
                                    <AIGuide tip="Choosing a long-lived star ensures your archive lasts for eons. Choose wisely based on the star's age." />
                                </div>
                            </ScrollReveal>
                            <ScrollReveal delay={200}>
                                <StarLifecycleViewer />
                            </ScrollReveal>
                        </section>

                        {/* Module 3: Cosmic Taxonomy */}
                        <section className="scroll-mt-32">
                            <ScrollReveal>
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-white/10 pb-8">
                                    <div className="space-y-4 max-w-2xl">
                                        <h2 className="font-serif text-4xl text-foreground">03. The Cosmic Compendium</h2>
                                        <p className="text-muted-foreground text-lg">
                                            Meet the neighbors. Explore the exotic objects that populate our galaxy.
                                        </p>
                                    </div>
                                    <AIGuide tip="Not all hosts are stars. Nebulae offer vast, artistic canvasses for shared community archives." />
                                </div>
                            </ScrollReveal>
                            <ScrollReveal delay={200}>
                                <CosmicCompendium />
                            </ScrollReveal>
                        </section>

                        {/* Module 4: Constellations */}
                        <section className="scroll-mt-32">
                            <ScrollReveal>
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-white/10 pb-8">
                                    <div className="space-y-4 max-w-2xl">
                                        <h2 className="font-serif text-4xl text-foreground">04. Constellation Architect</h2>
                                        <p className="text-muted-foreground text-lg">
                                            Connect the dots. Trace the ancient patterns hidden in the night sky.
                                        </p>
                                    </div>
                                    <AIGuide tip="Constellations help you memorize the location of your star without needing complex instruments." />
                                </div>
                            </ScrollReveal>
                            <ScrollReveal delay={200}>
                                <ConstellationBuilder />
                            </ScrollReveal>
                        </section>

                        {/* Final CTA */}
                        <ScrollReveal>
                            <div className="text-center bg-white/5 border border-white/10 rounded-[4rem] p-20 space-y-8 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent" />
                                <h2 className="font-serif text-4xl md:text-5xl text-foreground relative z-10">Academy Certified</h2>
                                <p className="text-muted-foreground max-w-xl mx-auto relative z-10">
                                    You have explored the fundamentals of the cosmos. Your vision is now attuned to the infinite.
                                </p>
                                <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
                                    <a href="#/observatory" className="px-10 py-4 rounded-full gradient-gold text-primary-foreground font-semibold hover:shadow-[0_0_30px_rgba(234,179,8,0.4)] transition-all">
                                        Enter the Observatory
                                    </a>
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

export default StellarAcademy;
