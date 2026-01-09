import React, { useState, useEffect } from 'react';
import { CosmicBackground } from '@/components/CosmicBackground';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { InteractiveMap } from '@/components/InteractiveMap';
import { SkyLocationSelector } from '@/components/SkyLocationSelector';
import { useMemories } from '@/hooks/useMemories';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Info, Map as MapIcon, Compass } from 'lucide-react';

const StellarObservatory = () => {
    const { memories } = useMemories();
    const [observerLoc, setObserverLoc] = useState<{ lat: number; lng: number; date: Date } | undefined>();

    return (
        <div className="min-h-screen relative overflow-hidden bg-background">
            <CosmicBackground />
            <div className="relative z-10 flex flex-col min-h-screen">
                <Navigation />

                <main className="flex-1 pt-24 px-4 flex flex-col md:flex-row gap-6 max-w-[1600px] mx-auto w-full pb-10">
                    {/* Map Sidebar / Controls */}
                    <div className="w-full md:w-80 space-y-6 shrink-0 order-2 md:order-1">
                        <ScrollReveal>
                            <div className="space-y-2">
                                <h1 className="font-serif text-4xl text-foreground">Celestial Observatory</h1>
                                <p className="text-sm text-muted-foreground/80 font-mono tracking-tighter uppercase">
                                    Deep Space Scanning Protocol v.4.2
                                </p>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal delay={100}>
                            <SkyLocationSelector onLocationChange={(lat, lng, date) => setObserverLoc({ lat, lng, date })} />
                        </ScrollReveal>

                        <ScrollReveal delay={200}>
                            <div className="glass p-6 rounded-3xl space-y-4 border-white/5">
                                <div className="flex items-center gap-2 text-primary">
                                    <Info className="w-4 h-4" />
                                    <h3 className="text-sm font-semibold uppercase tracking-widest">Protocol Usage</h3>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    The observatory maps real-time celestial coordinates. Use the location selector to view the "Sky Above You" or enter a past date to recreate historical cosmic alignments.
                                </p>
                                <div className="pt-2 flex flex-wrap gap-2">
                                    <div className="px-2 py-1 rounded bg-white/5 text-[10px] border border-white/10 text-muted-foreground">
                                        <MapIcon className="w-3 h-3 inline mr-1" /> RA/Dec Grids
                                    </div>
                                    <div className="px-2 py-1 rounded bg-white/5 text-[10px] border border-white/10 text-muted-foreground">
                                        <Compass className="w-3 h-3 inline mr-1" /> Horizon Tracking
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>

                    {/* Main Interactive Map */}
                    <div className="flex-1 min-h-[600px] md:min-h-0 relative rounded-[40px] overflow-hidden border border-white/10 bg-black/40 backdrop-blur-sm order-1 md:order-2 shadow-2xl">
                        <InteractiveMap
                            memories={memories || []}
                            observerLocation={observerLoc}
                        />
                    </div>
                </main>

                <Footer />
            </div>
        </div>
    );
};

export default StellarObservatory;
