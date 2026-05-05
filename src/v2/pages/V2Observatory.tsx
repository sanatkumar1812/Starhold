import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useMemories } from '@/hooks/useMemories';
import { V2Layout } from '../layout/V2Layout';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Info, Map as MapIcon, Compass, Settings, X, ChevronLeft, ZoomIn, ZoomOut, RotateCcw, HelpCircle, Activity, Globe, Crosshair } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useSearchParams } from 'react-router-dom';
import { InteractiveMap, InteractiveMapHandle } from '@/components/InteractiveMap';
import { SkyLocationSelector } from '@/components/SkyLocationSelector';
import { MemoryDetailModal } from '@/components/MemoryDetailModal';
import { Memory } from '@/hooks/useMemories';
import { useAuth } from '@/hooks/useAuth';

const V2Observatory = () => {
    const { memories, fetchSharedMemory } = useMemories();
    const [extraMemories, setExtraMemories] = useState<Memory[]>([]);
    const { user, profile, updateProfile } = useAuth();
    const mapRef = useRef<InteractiveMapHandle>(null);
    const [searchParams] = useSearchParams();

    const allMemories = useMemo(() => {
        const base = memories || [];
        if (extraMemories.length === 0) return base;
        const ids = new Set(base.map(m => m.id));
        return [...base, ...extraMemories.filter(m => !ids.has(m.id))];
    }, [memories, extraMemories]);

    // Default to Midday Sun
    const getDefaultMidday = () => {
        const d = new Date();
        d.setHours(12, 0, 0, 0);
        return d;
    };

    const [observerLoc, setObserverLoc] = useState<{ lat: number; lng: number; date: Date } | undefined>({
        lat: 40.7128,
        lng: -74.0060,
        date: getDefaultMidday()
    });

    const [controlMode, setControlMode] = useState<'polar' | 'pan'>('polar');
    const [isControlsOpen, setIsControlsOpen] = useState(false);
    const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleLocationChange = (lat: number, lng: number, date: Date) => {
        setObserverLoc({ lat, lng, date });
        if (user) updateProfile({ location: `${lat.toFixed(4)},${lng.toFixed(4)}` });
    };

    const handleMemoryClick = (memory: Memory) => {
        setSelectedMemory(memory);
        setIsModalOpen(true);
    };

    return (
        <V2Layout>
            <div className="h-screen w-screen relative overflow-hidden bg-[#0A0A12]">
                {/* Main Interactive Map */}
                <div className="absolute inset-0 z-0">
                    <InteractiveMap
                        ref={mapRef}
                        memories={allMemories}
                        onMemoryClick={handleMemoryClick}
                        observerLocation={observerLoc}
                        controlMode={controlMode}
                        className="w-full h-full"
                    />
                </div>

                {/* HUD Overlays - Left Side */}
                <div className="absolute top-28 left-8 z-20 pointer-events-none space-y-6">
                    <ScrollReveal>
                        <div className="bg-[#0A0A12]/60 backdrop-blur-xl border border-white/5 p-6 aerospace-border aerospace-border-tl pointer-events-auto min-w-[300px]">
                            <div className="flex items-center gap-3 mb-4">
                                <Activity className="w-4 h-4 text-cyan-400" />
                                <h2 className="font-aerospace text-lg font-black uppercase tracking-widest text-white">System Status</h2>
                            </div>
                            <div className="space-y-3 font-aerospace">
                                <div className="flex justify-between text-[10px] uppercase tracking-widest">
                                    <span className="text-zinc-500">Observer Lat</span>
                                    <span className="text-cyan-400">{observerLoc?.lat.toFixed(4)}°</span>
                                </div>
                                <div className="flex justify-between text-[10px] uppercase tracking-widest">
                                    <span className="text-zinc-500">Observer Lng</span>
                                    <span className="text-cyan-400">{observerLoc?.lng.toFixed(4)}°</span>
                                </div>
                                <div className="flex justify-between text-[10px] uppercase tracking-widest">
                                    <span className="text-zinc-500">Signal Integrity</span>
                                    <span className="text-emerald-500">99.98% ✓</span>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal delay={200}>
                        <div className="bg-[#0A0A12]/60 backdrop-blur-xl border border-white/5 p-6 aerospace-border aerospace-border-tl pointer-events-auto">
                            <h3 className="font-aerospace text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400 mb-4 flex items-center gap-2">
                                <Globe className="w-3 h-3" /> Ref. J2000.0
                            </h3>
                            <p className="font-technical text-[10px] text-zinc-500 uppercase leading-relaxed max-w-[200px]">
                                Tracking {allMemories.length} persistent celestial anchors across the visible horizon.
                            </p>
                        </div>
                    </ScrollReveal>
                </div>

                {/* HUD Overlays - Right Side Control Stack */}
                <div className="absolute bottom-12 right-12 z-20 pointer-events-none flex flex-col items-end gap-6">
                    {/* Zoom & View Controls */}
                    <div className="flex flex-col gap-3 pointer-events-auto">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => mapRef.current?.zoomIn()}
                            className="w-12 h-12 bg-white/5 border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/5 group transition-all"
                        >
                            <ZoomIn className="w-5 h-5 group-hover:text-cyan-400 transition-colors" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => mapRef.current?.zoomOut()}
                            className="w-12 h-12 bg-white/5 border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/5 group transition-all"
                        >
                            <ZoomOut className="w-5 h-5 group-hover:text-cyan-400 transition-colors" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => mapRef.current?.resetView()}
                            className="w-12 h-12 bg-white/5 border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/5 group transition-all"
                        >
                            <RotateCcw className="w-5 h-5 group-hover:text-cyan-400 transition-colors" />
                        </Button>
                    </div>

                    {/* Main Compass Toggle */}
                    <div className="relative pointer-events-auto">
                        {isControlsOpen && (
                            <div className="absolute bottom-20 right-0 mb-4 animate-in slide-in-from-bottom-5 fade-in duration-300">
                                <div className="bg-[#0A0A12]/90 backdrop-blur-3xl border border-white/10 p-2 rounded-xl aerospace-border">
                                    <SkyLocationSelector
                                        onLocationChange={handleLocationChange}
                                        onControlModeChange={setControlMode}
                                        controlMode={controlMode}
                                    />
                                </div>
                            </div>
                        )}
                        <Button
                            onClick={() => setIsControlsOpen(!isControlsOpen)}
                            className={`w-16 h-16 rounded-full shadow-[0_0_30px_rgba(0,224,240,0.1)] transition-all duration-500 border-2 ${isControlsOpen
                                ? 'bg-cyan-500 border-cyan-400 text-[#0A0A12] scale-110'
                                : 'bg-white/5 border-white/10 text-white hover:border-cyan-500/50 hover:scale-105'
                                }`}
                        >
                            {isControlsOpen ? <X className="w-8 h-8" /> : <Compass className="w-8 h-8" />}
                        </Button>
                    </div>
                </div>

                {/* Bottom Left Badge */}
                <div className="absolute bottom-12 left-12 z-20 font-aerospace pointer-events-none">
                    <div className="flex items-center gap-4 text-zinc-600">
                        <span className="text-[10px] uppercase tracking-[0.5em]">Stellar Link Active</span>
                        <div className="w-[100px] h-px bg-white/10" />
                        <span className="text-[10px] uppercase tracking-[0.5em]">GAIA DR3 SYNC</span>
                    </div>
                </div>

                {/* Coordinate Grid Overlay (HUD) */}
                <div className="absolute inset-0 pointer-events-none opacity-20">
                    <div className="hero-star-grid scale-150 opacity-10" />
                </div>

                {/* Vignette */}
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />

                {/* Memory Detail Modal */}
                <MemoryDetailModal
                    memory={selectedMemory}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    showAnimation={true}
                />
            </div>
        </V2Layout>
    );
};

export default V2Observatory;
