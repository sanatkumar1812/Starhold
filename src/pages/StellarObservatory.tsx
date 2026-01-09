import React, { useState } from 'react';
import { useMemories } from '@/hooks/useMemories';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Info, Map as MapIcon, Compass, Settings, X, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { InteractiveMap } from '@/components/InteractiveMap';
import { SkyLocationSelector } from '@/components/SkyLocationSelector';

const StellarObservatory = () => {
    const { memories } = useMemories();
    const [observerLoc, setObserverLoc] = useState<{ lat: number; lng: number; date: Date } | undefined>();
    const [isControlsOpen, setIsControlsOpen] = useState(false);

    return (
        <div className="h-screen w-screen relative overflow-hidden bg-black">
            {/* Main Interactive Map - Fullscreen Background */}
            <div className="absolute inset-0 z-0">
                <InteractiveMap
                    memories={memories || []}
                    observerLocation={observerLoc}
                    className="w-full h-full"
                />
            </div>

            {/* UI Overlays */}
            <div className="relative z-10 w-full h-full pointer-events-none flex flex-col justify-between p-6">
                {/* Top Bar */}
                <div className="flex justify-between items-start">
                    <div className="space-y-1 bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10 pointer-events-auto">
                        <h1 className="font-serif text-2xl text-foreground">Celestial Observatory</h1>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] text-primary font-mono animate-pulse">● SIGNAL ACTIVE</span>
                            <span className="text-[10px] text-muted-foreground/60 font-mono">SCANNING PERSISTENCE...</span>
                        </div>
                    </div>

                    <Link to="/dashboard" className="pointer-events-auto">
                        <Button variant="ghost" className="text-white/50 hover:text-white hover:bg-white/10 gap-2 rounded-xl">
                            <ChevronLeft className="w-4 h-4" />
                            Dashboard
                        </Button>
                    </Link>
                </div>

                {/* Bottom Controls */}
                <div className="flex justify-end items-end gap-6 pointer-events-auto">
                    {/* Compact Info (Optional) */}
                    <div className="hidden lg:block bg-black/40 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/10 text-xs text-muted-foreground/60 font-mono mb-2">
                        DATA SOURCE: NASA/HIPPARCOS / J2000.0 REFERENCE
                    </div>

                    {/* Controls Toggle */}
                    <div className="relative">
                        {isControlsOpen && (
                            <div className="absolute bottom-16 right-0 mb-4 animate-in slide-in-from-bottom-5 fade-in duration-300">
                                <SkyLocationSelector
                                    onLocationChange={(lat, lng, date) => setObserverLoc({ lat, lng, date })}
                                />
                            </div>
                        )}
                        <Button
                            onClick={() => setIsControlsOpen(!isControlsOpen)}
                            className={`w-14 h-14 rounded-full shadow-2xl transition-all duration-500 ${isControlsOpen ? 'bg-primary text-primary-foreground' : 'bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:scale-110'}`}
                        >
                            {isControlsOpen ? <X className="w-6 h-6" /> : <Compass className="w-6 h-6" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Subtle Vignette */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
        </div>
    );
};

export default StellarObservatory;
