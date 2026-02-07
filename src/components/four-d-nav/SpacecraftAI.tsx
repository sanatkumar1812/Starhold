import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line, Html, Float } from '@react-three/drei';
import * as THREE from 'three';

interface SpacecraftAIProps {
    truePos: THREE.Vector3;
    estPos: THREE.Vector3;
    sensorNoise: number;
    showBeams: boolean;
}

export const SpacecraftAI: React.FC<SpacecraftAIProps> = ({ truePos, estPos, sensorNoise, showBeams }) => {
    const trueMeshRef = useRef<THREE.Group>(null);
    const estMeshRef = useRef<THREE.Group>(null);

    // Distant reference points (Quasars) for visual beams
    const quasarPositions = useMemo(() => [
        new THREE.Vector3(1000, 500, -1000),
        new THREE.Vector3(-1200, -300, 800),
    ], []);

    useFrame((state) => {
        if (trueMeshRef.current) {
            trueMeshRef.current.position.copy(truePos);
        }
        if (estMeshRef.current) {
            estMeshRef.current.position.copy(estPos);
        }
    });

    return (
        <group>
            {/* TRUE Position (Hidden or subtle) */}
            <group ref={trueMeshRef}>
                <mesh>
                    <octahedronGeometry args={[1, 0]} />
                    <meshStandardMaterial color="#ffffff" transparent opacity={0.15} wireframe />
                </mesh>
                <Html distanceFactor={20} position={[0, 2, 0]}>
                    <div className="text-[8px] text-white/40 font-mono uppercase tracking-widest whitespace-nowrap px-1 border border-white/10">
                        Ground Truth (Hidden)
                    </div>
                </Html>
            </group>

            {/* ESTIMATED Position (AI's best guess) */}
            <group ref={estMeshRef}>
                <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                    <mesh>
                        <octahedronGeometry args={[1.5, 0]} />
                        <meshStandardMaterial
                            color="#06b6d4"
                            emissive="#06b6d4"
                            emissiveIntensity={2}
                            transparent
                            opacity={0.8}
                        />
                    </mesh>
                </Float>

                {/* Navigation Beams to Quasars */}
                {showBeams && quasarPositions.map((qPos, i) => (
                    <Line
                        key={i}
                        points={[new THREE.Vector3(0, 0, 0), qPos.clone().sub(estPos)]}
                        color="#06b6d4"
                        lineWidth={0.5}
                        transparent
                        opacity={0.2}
                    />
                ))}

                <Html distanceFactor={20} position={[0, -2, 0]}>
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-[0.3em] bg-black/60 px-2 py-1 border border-cyan-500/40 backdrop-blur-md">
                            AI ESTIMATE
                        </span>
                        <div className="flex gap-2 text-[8px] text-cyan-500/60 font-mono">
                            <span>ΔX: {(estPos.x - truePos.x).toFixed(2)}</span>
                            <span>ΔY: {(estPos.y - truePos.y).toFixed(2)}</span>
                            <span>ΔZ: {(estPos.z - truePos.z).toFixed(2)}</span>
                        </div>
                    </div>
                </Html>

                {/* Error Ring */}
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[sensorNoise * 2, sensorNoise * 2.1, 64]} />
                    <meshBasicMaterial color="#06b6d4" transparent opacity={0.1} />
                </mesh>
            </group>

            {/* Uncertainty Line (Connects True to Estimated) */}
            <Line
                points={[truePos, estPos]}
                color="#fbbf24"
                lineWidth={1}
                transparent
                opacity={0.3}
                dashed
            />
        </group>
    );
};
