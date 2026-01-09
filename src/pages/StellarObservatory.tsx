import React, { useState, useRef } from 'react';
import { useMemories } from '@/hooks/useMemories';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Info, Map as MapIcon, Compass, Settings, X, ChevronLeft, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { InteractiveMap, InteractiveMapHandle } from '@/components/InteractiveMap';
import { SkyLocationSelector } from '@/components/SkyLocationSelector';
import { MemoryDetailModal } from '@/components/MemoryDetailModal';
import { Memory } from '@/hooks/useMemories';

const StellarObservatory = () => {
    const { memories } = useMemories();
    const [observerLoc, setObserverLoc] = useState<{ lat: number; lng: number; date: Date } | undefined>();
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
                    className="w-full h-full"
                />
            </div>

            {/* UI Overlays */}
            <div className="relative z-10 w-full h-full pointer-events-none flex flex-col justify-between p-6">
                {/* Top Bar - Repositioned to Right */}
                <div className="flex justify-end items-start pointer-events-none">
                    <div className="flex flex-col items-end gap-3 pointer-events-auto">
                        <div className="space-y-1 bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                            <h1 className="font-serif text-2xl text-foreground text-right leading-tight">Celestial<br />Observatory</h1>
                            <div className="flex items-center justify-end gap-3">
                                <span className="text-[10px] text-primary font-mono animate-pulse">● SIGNAL ACTIVE</span>
                            </div>
                        </div>

                        <Link to="/dashboard">
                            <Button variant="ghost" className="text-white/50 hover:text-white hover:bg-white/10 gap-2 rounded-xl h-10 px-4">
                                <ChevronLeft className="w-4 h-4" />
                                Dashboard
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Controls Toggle & Zoom Stack */}
                <div className="flex flex-col items-center gap-4">
                    {/* Zoom stack repositioned above Compass */}
                    <div className="flex flex-col gap-2 scale-90 sm:scale-100">
                        <Button variant="secondary" size="icon" onClick={() => mapRef.current?.zoomIn()} className="bg-white/10 hover:bg-white/20 border-white/10 text-white rounded-xl shadow-xl pointer-events-auto"><ZoomIn className="w-5 h-5" /></Button>
                        <Button variant="secondary" size="icon" onClick={() => mapRef.current?.zoomOut()} className="bg-white/10 hover:bg-white/20 border-white/10 text-white rounded-xl shadow-xl pointer-events-auto"><ZoomOut className="w-5 h-5" /></Button>
                        <Button variant="secondary" size="icon" onClick={() => mapRef.current?.resetView()} className="bg-white/10 hover:bg-white/20 border-white/10 text-white rounded-xl shadow-xl pointer-events-auto"><RotateCcw className="w-5 h-5" /></Button>
                    </div>

                    <div className="relative pointer-events-auto">
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
        </div>

            {/* Memory Detail Modal */ }
    <MemoryDetailModal
        memory={selectedMemory}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        showAnimation={true}
    />

    {/* Subtle Vignette */ }
    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
        </div >
    );
};

export default StellarObservatory;
