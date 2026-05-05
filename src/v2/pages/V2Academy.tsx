import React, { useState, useEffect } from 'react';
import { V2Layout } from '../layout/V2Layout';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Library, CheckCircle2, HelpCircle, Activity, BookOpen, Layers, Globe, Compass } from 'lucide-react';
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

const V2Academy = () => {
    const [activeSection, setActiveSection] = useState(0);

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
        { id: 1, label: "ANALYSIS" },
        { id: 2, label: "EVOLUTION" },
        { id: 3, label: "CATALOG" },
        { id: 4, label: "ARCHIVE" },
    ];

    const ScientificBrief = ({ brief }: { brief: string }) => (
        <TooltipProvider delayDuration={0}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-[10px] font-aerospace font-bold uppercase tracking-widest rounded-none border border-cyan-500/20 transition-all">
                        <Activity className="w-3 h-3" /> Technical Brief
                    </button>
                </TooltipTrigger>
                <TooltipContent side="left" className="bg-[#0A0A12] border border-cyan-500/30 text-white max-w-sm p-6 aerospace-border">
                    <p className="font-technical text-sm leading-relaxed">{brief}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );

    return (
        <V2Layout>
            {/* Nav Progress Overlay */}
            <div className="fixed right-12 top-1/2 -translate-y-1/2 z-50 hidden xl:flex flex-col gap-10">
                {steps.map((step) => (
                    <div key={step.id} className="relative group flex items-center justify-end">
                        <span className={`
                            absolute right-10 font-aerospace text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-300
                            ${activeSection === step.id ? 'text-cyan-400 opacity-100 translate-x-0' : 'text-zinc-600 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0'}
                        `}>
                            {step.label}
                        </span>
                        <div className={`
                            w-2 h-2 border border-white/20 transition-all duration-500 rotate-45
                            ${activeSection === step.id ? 'bg-cyan-500 border-cyan-400 scale-150 shadow-[0_0_15px_rgba(0,224,240,0.4)]' : 'bg-transparent'}
                        `} />
                        {activeSection > step.id && <div className="absolute h-10 w-[1px] bg-cyan-500/20 -bottom-10 right-[3.5px]" />}
                    </div>
                ))}
            </div>

            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto space-y-48">

                {/* Header */}
                <ScrollReveal>
                    <div className="text-center space-y-10">
                        <div className="inline-flex items-center gap-3 px-6 py-2 border border-white/5 bg-white/[0.02] aerospace-border aerospace-border-tl text-[10px] text-zinc-500 font-aerospace font-bold uppercase tracking-[0.5em]">
                            <BookOpen className="w-4 h-4 text-cyan-500" /> Research & Training Division
                        </div>
                        <div className="space-y-4">
                            <h1 className="font-aerospace text-6xl md:text-8xl font-bold uppercase tracking-tight leading-[0.9]">
                                Celestial <br />
                                <span className="text-cyan-400">Mechanics</span> Analysis
                            </h1>
                            <p className="text-xl text-zinc-400 font-technical font-light max-w-2xl mx-auto leading-relaxed">
                                Master the fundamental physics of the J2000.0 reference frame and the internal logic of the Stellar Encryption Protocol.
                            </p>
                        </div>
                    </div>
                </ScrollReveal>

                {/* Module 1 */}
                <section className="scroll-mt-32 space-y-16">
                    <ScrollReveal>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-10">
                            <div className="space-y-4">
                                <h2 className="font-aerospace text-3xl font-bold uppercase tracking-wider">01. Astrometric Data Selection</h2>
                                <p className="text-zinc-500 font-technical text-sm uppercase tracking-widest max-w-xl">
                                    Establishing geometric benchmarks within the ICFR (International Celestial Reference Frame).
                                </p>
                            </div>
                            <ScientificBrief brief="Astrometric locking relies on the invariant relative positions of distant stellar bodies. Understanding RA/Dec is critical for mission success." />
                        </div>
                    </ScrollReveal>
                    <div className="bg-[#0A0A12] border border-white/5 p-8 aerospace-border aerospace-border-tl">
                        <CoordinateVisualizer />
                    </div>
                </section>

                {/* Module 2 */}
                <section className="scroll-mt-32 space-y-16">
                    <ScrollReveal>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-10">
                            <div className="space-y-4">
                                <h2 className="font-aerospace text-3xl font-bold uppercase tracking-wider">02. Entropy Source Evolution</h2>
                                <p className="text-zinc-500 font-technical text-sm uppercase tracking-widest max-w-xl">
                                    Monitoring stellar fusion cycles to predict archival data stability.
                                </p>
                            </div>
                            <ScientificBrief brief="The spectral signature of a star changes across eons. We leverage these predictable shifts for long-term temporal entropy." />
                        </div>
                    </ScrollReveal>
                    <div className="bg-[#0A0A12] border border-white/5 p-8 aerospace-border aerospace-border-tl">
                        <StarLifecycleViewer />
                    </div>
                </section>

                {/* Module 3 */}
                <section className="scroll-mt-32 space-y-16">
                    <ScrollReveal>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-10">
                            <div className="space-y-4">
                                <h2 className="font-aerospace text-3xl font-bold uppercase tracking-wider">03. Universal Registry Catalog</h2>
                                <p className="text-zinc-500 font-technical text-sm uppercase tracking-widest max-w-xl">
                                    A categorized database of high-fidelity celestial anchors.
                                </p>
                            </div>
                            <ScientificBrief brief="Not all stellar objects provide equal entropy. Pulsars and Nebulae offer distinct cryptographic advantages for heavy-load uplink." />
                        </div>
                    </ScrollReveal>
                    <div className="bg-[#0A0A12] border border-white/5 p-8 aerospace-border aerospace-border-tl">
                        <CosmicCompendium />
                    </div>
                </section>

                {/* Module 4 */}
                <section className="scroll-mt-32 space-y-16">
                    <ScrollReveal>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-10">
                            <div className="space-y-4">
                                <h2 className="font-aerospace text-3xl font-bold uppercase tracking-wider">04. Constellation Synthesis</h2>
                                <p className="text-zinc-500 font-technical text-sm uppercase tracking-widest max-w-xl">
                                    Derived pattern recognition for rapid manual verification.
                                </p>
                            </div>
                            <ScientificBrief brief="Constellations act as mnemonic hashes for complex coordinate sets, essential for civilian-grade archival interaction." />
                        </div>
                    </ScrollReveal>
                    <div className="bg-[#0A0A12] border border-white/5 p-8 aerospace-border aerospace-border-tl">
                        <ConstellationBuilder />
                    </div>
                </section>

                {/* Final Certification */}
                <ScrollReveal>
                    <div className="relative p-20 bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent border border-white/5 aerospace-border aerospace-border-tl text-center space-y-8">
                        <div className="absolute top-8 right-8 text-cyan-500/20 font-aerospace text-[8px] uppercase tracking-[1em] rotate-90 origin-right">DIVISION_CERTIFIED</div>
                        <h2 className="font-aerospace text-4xl font-bold uppercase tracking-widest">Training Complete</h2>
                        <p className="max-w-xl mx-auto text-zinc-400 font-technical text-sm leading-relaxed">
                            Your analytical capabilities have been successfully synchronized with current Starhold protocols. You are cleared for advanced mission simulation.
                        </p>
                        <Button
                            onClick={() => window.location.href = '#/v2/observatory'}
                            className="bg-cyan-500 hover:bg-cyan-400 text-[#0A0A12] font-aerospace font-bold uppercase tracking-widest px-12 h-14 rounded-none aerospace-border aerospace-border-tl"
                        >
                            Enter GNC Simulator
                        </Button>
                    </div>
                </ScrollReveal>

            </main>
        </V2Layout>
    );
};

export default V2Academy;
