import React, { useState } from 'react';
import { Database, Loader2, Maximize2, Atom, Sun } from 'lucide-react';

interface CelestialBody {
    id: 'nebula' | 'neutron' | 'quasar' | 'system';
    name: string;
    description: string;
    stats: { label: string; value: string }[];
    color: string;
}

const HologramVisual = ({ type }: { type: string }) => {
    switch (type) {
        case 'nebula':
            return (
                <div className="relative w-full h-full flex items-center justify-center animate-float-slow">
                    {/* Core Clouds */}
                    <div className="absolute w-48 h-48 bg-purple-600/30 rounded-full blur-[60px] animate-pulse-slow" />
                    <div className="absolute w-64 h-32 bg-pink-500/20 rounded-full blur-[50px] rotate-45 mix-blend-screen" />
                    <div className="absolute w-32 h-64 bg-blue-500/20 rounded-full blur-[50px] -rotate-45 mix-blend-screen" />

                    {/* Stars within Nebula */}
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
                            style={{
                                top: `${Math.random() * 60 + 20}%`,
                                left: `${Math.random() * 60 + 20}%`,
                                animationDelay: `${Math.random() * 2}s`
                            }}
                        />
                    ))}
                </div>
            );
        case 'neutron':
            return (
                <div className="relative w-full h-full flex items-center justify-center">
                    {/* Magnetic Field Lines */}
                    <div className="absolute w-64 h-64 border border-blue-500/30 rounded-full animate-spin-slow opacity-50" style={{ transform: 'rotateX(60deg)' }} />
                    <div className="absolute w-64 h-64 border border-cyan-500/30 rounded-full animate-spin-slow opacity-50 animation-delay-500" style={{ transform: 'rotateY(60deg)' }} />

                    {/* Core */}
                    <div className="relative z-10 w-12 h-12 bg-white rounded-full shadow-[0_0_50px_8px_rgba(59,130,246,0.8)] animate-pulse" />

                    {/* Beam Jets */}
                    <div className="absolute h-[120%] w-1 bg-gradient-to-b from-transparent via-cyan-400 to-transparent blur-sm opacity-80 rotate-45" />
                </div>
            );
        case 'quasar':
            return (
                <div className="relative w-full h-full flex items-center justify-center">
                    {/* Accretion Disk */}
                    <div className="absolute w-72 h-24 bg-gradient-to-r from-orange-600/50 via-red-500/50 to-orange-600/50 rounded-[100%] blur-md animate-spin-slow" />
                    <div className="absolute w-60 h-16 bg-gradient-to-r from-orange-400/80 via-yellow-200/80 to-orange-400/80 rounded-[100%] blur-sm mix-blend-screen" />

                    {/* Black Hole Event Horizon */}
                    <div className="relative z-10 w-16 h-16 bg-black rounded-full shadow-[0_0_30px_rgba(249,115,22,0.6)] ring-1 ring-white/50" />

                    {/* Polar Jets */}
                    <div className="absolute w-2 h-full bg-gradient-to-b from-transparent via-white to-transparent blur-md opacity-80 animate-jet" />
                </div>
            );
        case 'system':
            return (
                <div className="relative w-full h-full flex items-center justify-center" style={{ perspective: '1000px' }}>
                    {/* Orbits */}
                    {[100, 160, 220, 280].map((size, i) => (
                        <div
                            key={i}
                            className="absolute border border-emerald-500/20 rounded-full"
                            style={{
                                width: size,
                                height: size,
                                transform: 'rotateX(60deg)'
                            }}
                        />
                    ))}

                    {/* Sun */}
                    <div className="relative z-10 w-16 h-16 bg-gradient-to-br from-yellow-300 to-orange-500 rounded-full shadow-[0_0_40px_rgba(252,165,164,0.6)] animate-pulse-slow" />

                    {/* Planets (simplified animation) */}
                    <div className="absolute w-[160px] h-[160px] animate-spin-slow" style={{ animationDuration: '8s' }}>
                        <div className="absolute top-0 left-1/2 w-3 h-3 bg-blue-400 rounded-full shadow-[0_0_10px_blue]" />
                    </div>
                    <div className="absolute w-[280px] h-[280px] animate-spin-slow" style={{ animationDuration: '15s', animationDirection: 'reverse' }}>
                        <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-orange-400 rounded-full shadow-[0_0_10px_orange]" />
                    </div>
                </div>
            );
        default:
            return null;
    }
}

export const CosmicCompendium = () => {
    const bodies: CelestialBody[] = [
        {
            id: 'nebula',
            name: 'Stellar Nursery',
            description: "Massive clouds of dust and hydrogen gas. Gravity pulls clumps together until they collapse to form new stars.",
            stats: [
                { label: 'Composition', value: '90% H, 10% He' },
                { label: 'Avg Size', value: '1 - 100 LY' },
                { label: 'Role', value: 'Creator' }
            ],
            color: 'shadow-[0_0_50px_rgba(168,85,247,0.4)]'
        },
        {
            id: 'neutron',
            name: 'Neutron Star',
            description: "The collapsed core of a giant star. Incredibly dense; a teaspoon would weigh billion of tons.",
            stats: [
                { label: 'Diameter', value: '~20 km' },
                { label: 'Density', value: 'Extreme' },
                { label: 'Spin', value: 'Rapid' }
            ],
            color: 'shadow-[0_0_50px_rgba(59,130,246,0.4)]'
        },
        {
            id: 'quasar',
            name: 'Quasar',
            description: "A supermassive black hole actively feeding on gas, shining brighter than entire galaxies.",
            stats: [
                { label: 'Luminosity', value: '100k x Galaxy' },
                { label: 'Source', value: 'Black Hole' },
                { label: 'Age', value: 'Ancient' }
            ],
            color: 'shadow-[0_0_50px_rgba(249,115,22,0.4)]'
        },
        {
            id: 'system',
            name: 'Solar System',
            description: "A star and all objects bound to it by gravity: planets, moons, asteroids, and comets.",
            stats: [
                { label: 'Our Age', value: '4.6 B Years' },
                { label: 'Planets', value: '8 (Official)' },
                { label: 'Zone', value: 'Habitable' }
            ],
            color: 'shadow-[0_0_50px_rgba(16,185,129,0.4)]'
        }
    ];

    const [selected, setSelected] = useState<CelestialBody>(bodies[0]);

    return (
        <div className="grid lg:grid-cols-3 gap-8 lg:h-[600px] h-auto">
            {/* Menu List */}
            <div className="space-y-4 lg:col-span-1 flex flex-col h-full">
                <h3 className="font-serif text-3xl text-foreground mb-4">Cosmic Compendium</h3>
                <div className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
                    {bodies.map((body) => (
                        <button
                            key={body.id}
                            onClick={() => setSelected(body)}
                            className={`w-full text-left px-6 py-5 rounded-2xl transition-all border flex items-center justify-between group
                                ${selected.id === body.id
                                    ? 'bg-white/10 border-primary/50 shadow-lg translate-x-2'
                                    : 'hover:bg-white/5 border-transparent hover:border-white/10 text-muted-foreground'}
                            `}
                        >
                            <div>
                                <span className={`font-medium block ${selected.id === body.id ? 'text-primary' : 'group-hover:text-foreground'}`}>
                                    {body.name}
                                </span>
                                <span className="text-[10px] uppercase font-mono tracking-wider opacity-60">
                                    Class: {body.id}
                                </span>
                            </div>
                            {selected.id === body.id && <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
                        </button>
                    ))}
                </div>
            </div>

            {/* Holographic Display */}
            <div className="lg:col-span-2 relative group">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-[3rem] -z-10" />

                <div className="glass h-full rounded-[3rem] border-white/10 relative overflow-hidden flex flex-col">

                    {/* Viewport (Image) */}
                    <div className="relative flex-1 flex items-center justify-center bg-black/40 overflow-hidden">

                        {/* Grid Overlay */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

                        {/* Brackets HUD */}
                        <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-primary/30 rounded-tl-3xl" />
                        <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-primary/30 rounded-tr-3xl" />
                        <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-primary/30 rounded-bl-3xl" />
                        <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-primary/30 rounded-br-3xl" />

                        {/* The Hologram */}
                        <div className="relative z-10 w-full h-full p-12 flex items-center justify-center transform perspective-1000">
                            <HologramVisual type={selected.id} />
                        </div>

                        {/* Scanner Line Animation */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent h-[10%] w-full animate-scan pointer-events-none" />
                    </div>

                    {/* Data Panel */}
                    <div className="bg-black/60 backdrop-blur-xl border-t border-white/10 p-8 space-y-6">
                        <div className="flex justify-between items-start">
                            <h2 className="font-serif text-4xl text-foreground">{selected.name}</h2>
                            <div className="flex gap-2">
                                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-primary animate-pulse">
                                    LIVE FEED
                                </span>
                            </div>
                        </div>

                        <p className="text-muted-foreground leading-relaxed max-w-2xl">
                            {selected.description}
                        </p>

                        <div className="grid grid-cols-3 gap-4 pt-2">
                            {selected.stats.map((stat, idx) => (
                                <div key={idx} className="bg-white/5 rounded-xl p-4 border border-white/5">
                                    <div className="text-[9px] text-muted-foreground uppercase tracking-wider mb-1">{stat.label}</div>
                                    <div className="font-mono text-sm text-foreground">{stat.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
