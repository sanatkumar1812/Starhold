import React, { useState, useEffect } from 'react';
import { Slider } from "@/components/ui/slider";
import { Compass, Info } from 'lucide-react';

export const CoordinateVisualizer = () => {
    const [ra, setRa] = useState([12]); // Right Ascension (0-24h)
    const [dec, setDec] = useState([0]); // Declination (-90 to +90 deg)

    // Calculate position on the 2D projection
    // Center is (150, 150)
    // Radius is 100
    const centerX = 150;
    const centerY = 150;
    const radius = 100;

    // Convert RA/Dec to x/y for the "front" face of the sphere
    // This is a simplified projection for educational visuals, not a perfect stereographic one
    const getCoordinates = (r: number, d: number) => {
        // Normalize RA to -1 to 1 range relative to center view (assuming center view is 12h)
        const raNorm = ((r - 12) / 12) * Math.PI;
        // Normalize Dec to radians
        const decRad = (d / 90) * (Math.PI / 2);

        // Simple 3D-ish projection
        const x = centerX + radius * Math.cos(decRad) * Math.sin(raNorm);
        const y = centerY - radius * Math.sin(decRad);

        return { x, y };
    };

    const { x, y } = getCoordinates(ra[0], dec[0]);

    // Generate grid lines
    const raLines = [];
    for (let i = 0; i <= 24; i += 2) {
        const path = [];
        for (let j = -90; j <= 90; j += 5) {
            const { x, y } = getCoordinates(i, j);
            path.push(`${x},${y}`);
        }
        raLines.push(path.join(' '));
    }

    return (
        <div className="glass p-8 rounded-[2rem] border-white/5 relative overflow-hidden">

            <div className="flex flex-col md:flex-row gap-12 items-center">

                {/* Visualizer */}
                <div className="relative w-[300px] h-[300px] shrink-0">
                    <div className="absolute inset-0 bg-black/40 rounded-full border border-white/10 shadow-inner" />

                    <svg className="absolute inset-0 w-full h-full text-white/20" viewBox="0 0 300 300">
                        {/* Sphere Outline */}
                        <circle cx="150" cy="150" r="100" fill="none" stroke="currentColor" strokeWidth="2" />

                        {/* Equator */}
                        <path d="M 50 150 Q 150 180 250 150" fill="none" stroke="currentColor" strokeDasharray="4 4" />
                        <path d="M 50 150 Q 150 120 250 150" fill="none" stroke="currentColor" strokeDasharray="4 4" opacity="0.5" />

                        {/* RA Lines */}
                        {raLines.map((line, idx) => (
                            <polyline key={idx} points={line} fill="none" stroke="currentColor" opacity="0.3" strokeWidth="1" />
                        ))}

                        {/* Target Star */}
                        <g transform={`translate(${x}, ${y})`}>
                            <circle r="6" className="fill-primary animate-pulse" />
                            <circle r="12" className="stroke-primary/50 fill-none animate-ping" />
                            <line x1="0" y1="0" x2="0" y2="20" className="stroke-primary/50" />
                            <text x="5" y="25" className="fill-primary text-[10px] font-mono">
                                {`RA:${ra[0]}h DEC:${dec[0]}°`}
                            </text>
                        </g>
                    </svg>

                    {/* Labels */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs text-muted-foreground font-mono">N (Celestial North)</div>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-muted-foreground font-mono">S (Celestial South)</div>
                </div>

                {/* Controls */}
                <div className="flex-1 space-y-8 w-full">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xl font-serif text-foreground">
                            <Compass className="w-5 h-5 text-primary" />
                            <h3>Celestial Coordinator</h3>
                        </div>
                        <p className="text-muted-foreground text-sm">
                            Adjust the Right Ascension (Rotation) and Declination (Elevation) to pinpoint stars on the celestial sphere.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm font-mono">
                                <span className="text-muted-foreground">Right Ascension (RA)</span>
                                <span className="text-primary">{ra[0]}h</span>
                            </div>
                            <Slider
                                value={ra}
                                onValueChange={setRa}
                                max={24}
                                step={1}
                                className="w-full"
                            />
                            <p className="text-[10px] text-muted-foreground">
                                Measures rotation along the celestial equator, similar to longitude on Earth.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between text-sm font-mono">
                                <span className="text-muted-foreground">Declination (Dec)</span>
                                <span className="text-primary">{dec[0]}°</span>
                            </div>
                            <Slider
                                value={dec}
                                onValueChange={setDec}
                                min={-90}
                                max={90}
                                step={1}
                                className="w-full"
                            />
                            <p className="text-[10px] text-muted-foreground">
                                Measures angle north or south of the celestial equator, similar to latitude.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
