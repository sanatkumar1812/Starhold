import React, { useState } from 'react';
import { Star, Heart, MessageCircle, Sparkles } from 'lucide-react';

const memories = [
    { id: 1, recipient: "Eleanor", date: "2024", icon: Heart, color: "text-rose-400" },
    { id: 2, recipient: "Future Self", date: "2045", icon: MessageCircle, color: "text-blue-400" },
    { id: 3, recipient: "The Newlands", date: "2023", icon: Star, color: "text-amber-400" },
    { id: 4, recipient: "Sarah & Kai", date: "2029", icon: Sparkles, color: "text-purple-400" },
    { id: 5, recipient: "Grandpa Leo", date: "2025", icon: MessageCircle, color: "text-cyan-400" },
    { id: 6, recipient: "Apollo", date: "2024", icon: Heart, color: "text-indigo-400" },
];

export const StellarMosaic = () => {
    const [hoveredId, setHoveredId] = useState<number | null>(null);

    return (
        <section className="py-24 px-4 relative bg-slate-950/50">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-16 items-center">
                    <div className="lg:w-1/3 space-y-6">
                        <h2 className="font-serif text-4xl md:text-5xl text-foreground leading-tight">
                            A Living <span className="text-gradient-gold">Constellation</span> of Stories
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Every point in our archive represents a moment frozen in time. Explore how others are preserving their legacies among the stars.
                        </p>
                        <div className="pt-4 flex gap-8">
                            <div>
                                <p className="text-2xl font-serif text-primary">12k+</p>
                                <p className="text-xs text-muted-foreground uppercase tracking-widest">Memories</p>
                            </div>
                            <div>
                                <p className="text-2xl font-serif text-primary">88</p>
                                <p className="text-xs text-muted-foreground uppercase tracking-widest">Constellations</p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
                        {memories.map((m) => (
                            <div
                                key={m.id}
                                onMouseEnter={() => setHoveredId(m.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                className={`relative aspect-square glass rounded-3xl overflow-hidden group cursor-crosshair transition-all duration-500 ${hoveredId === m.id ? 'border-primary/50 -translate-y-2' : ''
                                    }`}
                            >
                                {/* Background glow for hovered state */}
                                <div className={`absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent transition-opacity duration-500 ${hoveredId === m.id ? 'opacity-100' : 'opacity-0'
                                    }`} />

                                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-3">
                                    <div className={`w-12 h-12 rounded-full glass flex items-center justify-center transition-all duration-500 ${hoveredId === m.id ? 'scale-110 shadow-[0_0_20px_rgba(234,179,8,0.3)]' : ''
                                        }`}>
                                        <m.icon className={`w-6 h-6 ${m.color}`} />
                                    </div>

                                    <div className={`transition-all duration-500 delay-75 ${hoveredId === m.id ? 'opacity-100 translate-y-0' : 'opacity-40 translate-y-2'
                                        }`}>
                                        <p className="font-serif text-lg text-foreground">To {m.recipient}</p>
                                        <p className="text-xs font-mono text-muted-foreground">Epoch {m.date}</p>
                                    </div>
                                </div>

                                {/* Corner detail */}
                                <div className="absolute top-4 right-4 text-[10px] font-mono text-white/10 group-hover:text-primary/30 transition-colors">
                                    VAULT-{m.id}092
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
