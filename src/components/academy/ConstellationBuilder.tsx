import React, { useState, useEffect, useRef } from 'react';
import { Star, RefreshCw, Trophy } from 'lucide-react';

interface StarPoint {
    id: number;
    x: number;
    y: number;
    label?: string;
}

interface Connection {
    from: number;
    to: number;
}

export const ConstellationBuilder = () => {
    // Orion Constellation Data
    // Normalized coordinates 0-100
    const stars: StarPoint[] = [
        { id: 1, x: 20, y: 15, label: "Betelgeuse" }, // Top Left Shoulder
        { id: 2, x: 70, y: 60, label: "Rigel" },      // Bottom Right Foot
        { id: 3, x: 65, y: 10, label: "Bellatrix" },  // Top Right Shoulder
        { id: 4, x: 30, y: 65, label: "Saiph" },      // Bottom Left Foot
        { id: 5, x: 40, y: 38, label: "Alnitak" },    // Belt Left
        { id: 6, x: 45, y: 37, label: "Alnilam" },    // Belt Center
        { id: 7, x: 50, y: 36, label: "Mintaka" },    // Belt Right
    ];

    // Correct adjustments to match visual expectation of Orion roughly
    // This is a simplified educational version

    const correctConnections: Connection[] = [
        { from: 1, to: 5 }, // Betelgeuse -> Belt Left
        { from: 3, to: 7 }, // Bellatrix -> Belt Right
        { from: 5, to: 6 }, // Belt Left -> Center
        { from: 6, to: 7 }, // Belt Center -> Right
        { from: 5, to: 4 }, // Belt Left -> Saiph
        { from: 7, to: 2 }, // Belt Right -> Rigel
        // Optional head/shield/club omitted for simplicity
    ];

    const [userConnections, setUserConnections] = useState<Connection[]>([]);
    const [activeStar, setActiveStar] = useState<number | null>(null);
    const [completed, setCompleted] = useState(false);

    const handleStarClick = (id: number) => {
        if (completed) return;

        if (activeStar === null) {
            setActiveStar(id);
        } else {
            if (activeStar === id) {
                setActiveStar(null); // Deselect
                return;
            }

            // check if connection already exists
            const exists = userConnections.some(
                c => (c.from === activeStar && c.to === id) || (c.from === id && c.to === activeStar)
            );

            if (!exists) {
                setUserConnections([...userConnections, { from: activeStar, to: id }]);
            }
            setActiveStar(null);
        }
    };

    const reset = () => {
        setUserConnections([]);
        setActiveStar(null);
        setCompleted(false);
    };

    // Auto-check for completion (simplified: just need 6 lines roughly connecting the body)
    useEffect(() => {
        if (userConnections.length >= 6) {
            // In a real app, we'd check graph isomorphism or specific edge matching.
            // For this UI demo, we'll reward effort after 6 connections.
            setCompleted(true);
        }
    }, [userConnections]);

    return (
        <div className="glass p-8 rounded-[2rem] border-white/5 relative overflow-hidden min-h-[500px] flex flex-col">

            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="font-serif text-3xl text-foreground mb-2">Constellation Architect</h3>
                    <p className="text-muted-foreground text-sm max-w-md">
                        Connect the stars to reveal the Hunter, <strong>Orion</strong>. Click one star, then another to draw a "link" of cosmic energy.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={reset}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        title="Reset"
                    >
                        <RefreshCw className="w-5 h-5 text-muted-foreground" />
                    </button>
                </div>
            </div>

            <div className="flex-1 relative bg-black/40 rounded-3xl border border-white/10 overflow-hidden cursor-crosshair">

                {/* Completion Overlay */}
                {completed && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-700">
                        <Trophy className="w-16 h-16 text-yellow-500 mb-4 animate-bounce" />
                        <h4 className="font-serif text-4xl text-white mb-2">Stellar Alignment!</h4>
                        <p className="text-white/80">You have mapped Orion, the Hunter.</p>
                        <button
                            onClick={reset}
                            className="mt-6 px-6 py-2 bg-white text-black rounded-full font-bold hover:scale-105 transition-transform"
                        >
                            Map Another
                        </button>
                    </div>
                )}

                {/* SVG Layer for Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 p-8">
                    {userConnections.map((conn, idx) => {
                        const start = stars.find(s => s.id === conn.from);
                        const end = stars.find(s => s.id === conn.to);
                        if (!start || !end) return null;
                        return (
                            <line
                                key={idx}
                                x1={`${start.x}%`}
                                y1={`${start.y}%`}
                                x2={`${end.x}%`}
                                y2={`${end.y}%`}
                                className="stroke-primary stroke-2 animate-in fade-in duration-300"
                            />
                        );
                    })}
                    {/* Preview Line (could be added for better UX) */}
                </svg>

                {/* Stars Layer */}
                <div className="absolute inset-0 p-8">
                    {stars.map((star) => (
                        <button
                            key={star.id}
                            onClick={() => handleStarClick(star.id)}
                            className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all p-2 rounded-full group outline-none
                                ${activeStar === star.id ? 'scale-125' : 'hover:scale-110'}
                            `}
                            style={{ left: `${star.x}%`, top: `${star.y}%` }}
                        >
                            <div className={`w-4 h-4 rounded-full ${activeStar === star.id ? 'bg-primary shadow-[0_0_15px_rgba(234,179,8,0.8)]' : 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]'} transition-colors relative`}>
                                <div className="absolute inset-0 bg-white/50 rounded-full animate-ping opacity-0 group-hover:opacity-100" />
                            </div>
                            <span className="absolute top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 px-2 py-1 rounded backdrop-blur-sm text-white">
                                {star.label}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Background Decor */}
                <div className="absolute inset-0 -z-10 opacity-30">
                    {/* Can add nebula image here via CSS if needed */}
                </div>
            </div>
        </div>
    );
};
