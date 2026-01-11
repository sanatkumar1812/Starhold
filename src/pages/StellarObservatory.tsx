import React, { useState, useRef, useEffect } from 'react';
import { useMemories } from '@/hooks/useMemories';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Info, Map as MapIcon, Compass, Settings, X, ChevronLeft, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { InteractiveMap, InteractiveMapHandle } from '@/components/InteractiveMap';
import { SkyLocationSelector } from '@/components/SkyLocationSelector';
import { MemoryDetailModal } from '@/components/MemoryDetailModal';
import { Memory } from '@/hooks/useMemories';
import { useAuth } from '@/hooks/useAuth';

const StellarObservatory = () => {
    const { memories } = useMemories();
    const { user } = useAuth();

    // Default to Midday Sun (12:00 PM) for visual impact
    const getDefaultMidday = () => {
        const d = new Date();
        d.setHours(12, 0, 0, 0);
        return d;
    };

    const [observerLoc, setObserverLoc] = useState<{ lat: number; lng: number; date: Date } | undefined>({
        lat: 40.7128, // Default NYC or use 0,0
        lng: -74.0060,
        date: getDefaultMidday()
    });

    const [controlMode, setControlMode] = useState<'polar' | 'pan'>('polar');
    const [isControlsOpen, setIsControlsOpen] = useState(false);
    const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const mapRef = useRef<InteractiveMapHandle>(null);

    const handleMemoryClick = (memory: Memory) => {
        setSelectedMemory(memory);
        setIsModalOpen(true);
    };

    return (
        <div className="h-screen w-screen relative overflow-hidden bg-black">
            {/* Main Interactive Map - Fullscreen Background */}
            <div className="absolute inset-0 z-0">
                <InteractiveMap
                    ref={mapRef}
                    memories={memories || []}
                    onMemoryClick={handleMemoryClick}
                    observerLocation={observerLoc}
                    controlMode={controlMode}
                    className="w-full h-full"
                />
            </div>

            {/* UI Overlays */}
            <div className="relative z-10 w-full h-full pointer-events-none flex flex-col justify-between p-6">
                {/* Top Bar - Status Card to Top Left */}
                <div className="flex justify-between items-start pointer-events-none">
                    <div className="flex flex-col items-start pointer-events-auto">
                        <div className="bg-black/40 backdrop-blur-md p-5 rounded-3xl border border-white/10 shadow-2xl space-y-4">
                            <Link to={user ? "/dashboard" : "/"}>
                                <Button variant="ghost" size="sm" className="w-full justify-start text-white/50 hover:text-white hover:bg-white/5 gap-3 rounded-xl px-2 transition-all group mb-2">
                                    <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                        <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                                    </div>
                                    <span className="text-[10px] font-medium uppercase tracking-widest">
                                        Back to {user ? "Dashboard" : "Home"}
                                    </span>
                                </Button>
                            </Link>

                            <div className="flex flex-col gap-1 px-1">
                                <h1 className="font-serif text-2xl text-foreground leading-tight tracking-wide">Celestial Observatory</h1>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                    <span className="text-[10px] text-primary font-mono tracking-widest uppercase">Signal Active</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-3 px-5">
                            <span className="text-[9px] text-muted-foreground/40 font-mono uppercase tracking-[0.2em] animate-pulse">Scanning Persistence...</span>
                        </div>
                    </div>

                    {/* Top Right is handled by the Map's Legend now */}
                    <div />
                </div>

                {/* Bottom Controls - Grouped in Bottom Right */}
                <div className="flex flex-col items-end gap-6 pointer-events-auto self-end">
                    {/* Data Source Moved to Left of Compass */}

                    <div className="flex flex-col items-center gap-4">
                        {/* Data Source Label - Repositioned Here */}
                        <div className="absolute right-20 bottom-2 whitespace-nowrap hidden lg:block bg-black/40 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/10 text-[10px] text-muted-foreground/40 font-mono tracking-widest uppercase">
                            DATA SOURCE: NASA/HIPPARCOS / J2000.0 REFERENCE
                        </div>

                        {/* Zoom stack repositioned above Compass */}
                        <div className="flex flex-col gap-2">
                            <Button variant="secondary" size="icon" onClick={() => mapRef.current?.zoomIn()} className="bg-white/10 hover:bg-white/20 border-white/10 text-white rounded-xl shadow-xl transition-all hover:scale-110 w-11 h-11 sm:w-10 sm:h-10"><ZoomIn className="w-5 h-5" /></Button>
                            <Button variant="secondary" size="icon" onClick={() => mapRef.current?.zoomOut()} className="bg-white/10 hover:bg-white/20 border-white/10 text-white rounded-xl shadow-xl transition-all hover:scale-110 w-11 h-11 sm:w-10 sm:h-10"><ZoomOut className="w-5 h-5" /></Button>
                            <Button variant="secondary" size="icon" onClick={() => mapRef.current?.resetView()} className="bg-white/10 hover:bg-white/20 border-white/10 text-white rounded-xl shadow-xl transition-all hover:scale-110 w-11 h-11 sm:w-10 sm:h-10"><RotateCcw className="w-5 h-5" /></Button>
                        </div>

                        <div className="relative">
                            {isControlsOpen && (
                                <div className="absolute bottom-16 right-0 mb-4 animate-in slide-in-from-bottom-5 fade-in duration-300">
                                    <SkyLocationSelector
                                        onLocationChange={(lat, lng, date) => setObserverLoc({ lat, lng, date })}
                                        onControlModeChange={setControlMode}
                                        controlMode={controlMode}
                                    />
                                </div>
                            )}
                            <Button
                                onClick={() => setIsControlsOpen(!isControlsOpen)}
                                className={`w-14 h-14 rounded-full shadow-2xl transition-all duration-500 ${isControlsOpen ? 'bg-primary text-primary-foreground scale-110' : 'bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:scale-110'}`}
                            >
                                {isControlsOpen ? <X className="w-6 h-6" /> : <Compass className="w-6 h-6" />}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Memory Detail Modal */}
            <MemoryDetailModal
                memory={selectedMemory}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                showAnimation={true}
            />

            {/* Subtle Vignette */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
        </div>
    );
};

export default StellarObservatory;
