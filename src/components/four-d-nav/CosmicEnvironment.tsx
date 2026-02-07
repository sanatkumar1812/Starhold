import React, { useMemo } from 'react';
import { Stars, Sphere, Html, Line } from '@react-three/drei';
import * as THREE from 'three';

interface CosmicEnvironmentProps {
    showEarth: boolean;
    pulsarPings: number[]; // timing of pings
}

export const CosmicEnvironment: React.FC<CosmicEnvironmentProps> = ({ showEarth, pulsarPings }) => {
    // Quasars: Extremely distant, static points
    const quasars = useMemo(() => [
        { name: "3C 273", pos: [1000, 500, -1000] as [number, number, number], color: "#ff2d55" },
        { name: "PKS 0637-752", pos: [-1200, -300, 800] as [number, number, number], color: "#007aff" },
        { name: "ULAS J1120+0641", pos: [200, 1000, 500] as [number, number, number], color: "#5856d6" },
        { name: "SDSS J0100+2802", pos: [-500, 800, -1200] as [number, number, number], color: "#ff9500" },
    ], []);

    // Pulsars: Precise timing sources
    const pulsars = useMemo(() => [
        { name: "PSR B1919+21", pos: [200, 50, 200] as [number, number, number], freq: 0.714 },
        { name: "PSR J0437-4715", pos: [-150, -100, -50] as [number, number, number], freq: 173.6 },
    ], []);

    return (
        <group>
            <Stars radius={2000} depth={500} count={10000} factor={6} saturation={0} fade speed={1} />

            {/* Quasars: Fixed Reference Frame */}
            {quasars.map((q, i) => (
                <group key={i} position={q.pos}>
                    <Sphere args={[10, 16, 16]}>
                        <meshBasicMaterial color={q.color} />
                    </Sphere>
                    <pointLight color={q.color} intensity={50} distance={2000} />
                    <Html distanceFactor={100}>
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] text-white font-mono uppercase bg-black/80 px-2 py-1 border border-white/20 whitespace-nowrap">
                                QUASAR: {q.name}
                            </span>
                            <span className="text-[8px] text-white/40 uppercase mt-1">Spatial Ref: ICRS J2000</span>
                        </div>
                    </Html>
                </group>
            ))}

            {/* Pulsars: Timing Reference */}
            {pulsars.map((p, i) => (
                <group key={i} position={p.pos}>
                    <Sphere args={[2, 16, 16]}>
                        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={2} />
                    </Sphere>
                    <pointLight color="#fbbf24" intensity={20} distance={500} />
                    <Html distanceFactor={50} position={[0, -5, 0]}>
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] text-amber-500 font-mono uppercase bg-black/80 px-2 py-1 border border-amber-500/20 whitespace-nowrap">
                                PULSAR: {p.name}
                            </span>
                            <span className="text-[8px] text-amber-500/40 uppercase mt-1">Time Sync: {p.freq} MHz</span>
                        </div>
                    </Html>
                </group>
            ))}

            {/* Optional Earth Reference */}
            {showEarth && (
                <group position={[0, -200, 0]}>
                    <Sphere args={[50, 64, 64]}>
                        <meshStandardMaterial color="#2563eb" roughness={0.8} metalness={0.2} />
                    </Sphere>
                    <Html distanceFactor={100} position={[0, 60, 0]}>
                        <div className="px-3 py-1 bg-blue-900/40 border border-blue-500/40 rounded backdrop-blur-sm">
                            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.2em]">Terra (Earth-Frame)</span>
                        </div>
                    </Html>
                </group>
            )}

            <ambientLight intensity={0.2} />
            <pointLight position={[500, 500, 500]} intensity={1} color="#fff" />
        </group>
    );
};
