import { StarProperties } from "@/lib/celestial-data";
import { Button } from "@/components/ui/button";
import { X, ExternalLink, Info } from "lucide-react";
import { getConstellationArt } from "@/lib/constellation-art";

interface CosmicInfoCardProps {
    data: StarProperties | { name: string; meaning?: string; description?: string };
    type: 'star' | 'constellation';
    onClose: () => void;
}

export const CosmicInfoCard = ({ data, type, onClose }: CosmicInfoCardProps) => {
    const artUrl = type === 'constellation' ? getConstellationArt(data.name) : null;

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
                            {type === 'star' ? 'Stellar Object' : 'Constellation'}
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
