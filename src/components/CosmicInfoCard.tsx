import { StarProperties } from "@/lib/celestial-data";
import { Button } from "@/components/ui/button";
import { X, ExternalLink, Info, Crosshair, MapPin } from "lucide-react";
import { getConstellationArt } from "@/lib/constellation-art";
import { celestialToHorizon } from "@/lib/astro-math";

import { PLANET_DETAILS } from "@/lib/planet-info";

interface CosmicInfoCardProps {
    data: any;
    type: 'star' | 'constellation' | 'planet';
    coords?: [number, number]; // [RA, Dec]
    controlMode?: 'polar' | 'pan';
    observerLocation?: { lat: number; lng: number; date: Date };
    onClose: () => void;
}

export const CosmicInfoCard = ({ data, type, coords, controlMode, observerLocation, onClose }: CosmicInfoCardProps) => {
    const artUrl = type === 'constellation' ? getConstellationArt(data.name) : null;

    // Coordinate Calculation
    const isPlanar = controlMode === 'pan';
    let displayCoords = null;

    if (coords) {
        if (isPlanar && observerLocation) {
            // Convert RA/Dec to Alt/Az for planar mode
            const horiz = celestialToHorizon(
                observerLocation.date,
                observerLocation.lat,
                observerLocation.lng,
                coords[0] < 0 ? coords[0] + 360 : coords[0],
                coords[1]
            );
            displayCoords = {
                title: 'Horizon Pos (Alt/Az)',
                c1: { label: 'Altitude', value: `${horiz.altitude.toFixed(2)}°` },
                c2: { label: 'Azimuth', value: `${horiz.azimuth.toFixed(2)}°` }
            };
        } else {
            // Show RA/Dec for polar mode
            displayCoords = {
                title: 'Celestial Pos (J2000)',
                c1: { label: 'RA', value: `${(coords[0] < 0 ? coords[0] + 360 : coords[0]).toFixed(2)}°` },
                c2: { label: 'Dec', value: `${coords[1].toFixed(2)}°` }
            };
        }
    }

    return (
        <div className="absolute bottom-6 left-6 w-80 bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-left-4 duration-300 z-50">
            {artUrl && (
                <div className="w-full h-48 relative overflow-hidden bg-slate-900">
                    <img
                        src={artUrl}
                        alt={data.name}
                        className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                </div>
            )}
            <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="text-xs text-blue-400 font-mono uppercase tracking-widest mb-1">
                            {type === 'star' ? 'Stellar Object' : type === 'planet' ? 'Solar System' : 'Constellation'}
                        </div>
                        <h2 className="text-2xl font-serif text-white leading-none">{data.name}</h2>
                        {type === 'constellation' && 'meaning' in data && (
                            <p className="text-white/50 italic text-sm mt-1">{data.meaning}</p>
                        )}
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6 text-white/50 hover:text-white -mr-2 -mt-2">
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                <div className="space-y-4">
                    {/* Description */}
                    {(data as any).description && (
                        <p className="text-sm text-white/80 leading-relaxed border-l-2 border-white/20 pl-3">
                            {(data as any).description}
                        </p>
                    )}

                    {/* Coordinates Display */}
                    {displayCoords && (
                        <div className="space-y-2 pt-2 border-t border-white/5">
                            <div className="flex items-center gap-2 text-[10px] text-primary/60 font-mono uppercase tracking-[0.2em]">
                                {isPlanar ? <MapPin className="w-3 h-3" /> : <Crosshair className="w-3 h-3" />}
                                {displayCoords.title}
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white/5 p-2 rounded border border-white/5">
                                    <span className="text-white/40 block text-[9px] uppercase">{displayCoords.c1.label}</span>
                                    <span className="text-white font-mono text-sm">{displayCoords.c1.value}</span>
                                </div>
                                <div className="bg-white/5 p-2 rounded border border-white/5">
                                    <span className="text-white/40 block text-[9px] uppercase">{displayCoords.c2.label}</span>
                                    <span className="text-white font-mono text-sm">{displayCoords.c2.value}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Planet Specific Stats */}
                    {type === 'planet' && (
                        <div className="space-y-4">
                            <p className="text-sm text-white/80 leading-relaxed border-l-2 border-primary/50 pl-3 italic">
                                {PLANET_DETAILS[data.name]?.description || data.description}
                            </p>
                            <div className="grid grid-cols-2 gap-2 text-[11px] mt-4 uppercase font-mono tracking-tighter">
                                <div className="bg-white/5 p-2 rounded border border-white/5">
                                    <span className="text-white/40 block">Type</span>
                                    <span className="text-primary/90 truncate">{PLANET_DETAILS[data.name]?.type}</span>
                                </div>
                                <div className="bg-white/5 p-2 rounded border border-white/5">
                                    <span className="text-white/40 block">Dist.</span>
                                    <span className="text-white/90">{PLANET_DETAILS[data.name]?.distance}</span>
                                </div>
                                <div className="bg-white/5 p-2 rounded border border-white/5">
                                    <span className="text-white/40 block">Mass</span>
                                    <span className="text-white/90">{PLANET_DETAILS[data.name]?.mass}</span>
                                </div>
                                <div className="bg-white/5 p-2 rounded border border-white/5">
                                    <span className="text-white/40 block">Year</span>
                                    <span className="text-white/90">{PLANET_DETAILS[data.name]?.yearLength}</span>
                                </div>
                            </div>
                            {PLANET_DETAILS[data.name]?.facts && (
                                <div className="space-y-2 pt-2">
                                    <span className="text-[10px] text-primary/60 font-mono uppercase tracking-widest">Scientific Insights</span>
                                    <ul className="text-[11px] text-white/60 space-y-1 list-disc pl-4">
                                        {PLANET_DETAILS[data.name].facts.map((f: string, i: number) => (
                                            <li key={i}>{f}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Star Specific Stats */}
                    {type === 'star' && 'magnitude' in data && (
                        <div className="grid grid-cols-2 gap-3 text-sm mt-4">
                            <div className="bg-white/5 p-2 rounded">
                                <span className="text-white/40 block text-xs">Distance</span>
                                <span className="text-white/90">{(data as any).distance || 'Unknown'}</span>
                            </div>
                            <div className="bg-white/5 p-2 rounded">
                                <span className="text-white/40 block text-xs">Magnitude</span>
                                <span className="text-white/90">{(data as any).magnitude}</span>
                            </div>
                            <div className="bg-white/5 p-2 rounded col-span-2">
                                <span className="text-white/40 block text-xs">Type</span>
                                <span className="text-white/90">{(data as any).spectralType || 'Star'}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
