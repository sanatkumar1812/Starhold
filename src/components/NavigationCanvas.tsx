import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float, PerspectiveCamera, Sparkles, Line, Points, PointMaterial, Html, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { getPulsarFrequency, getSunGalacticPosition } from '@/lib/pulsar-timing';
import astroData from '@/lib/data/astronomical_data.json';

const RA2RAD = Math.PI / 180;
const DEC2RAD = Math.PI / 180;

const celestialToCartesian = (ra: number, dec: number, radius: number): [number, number, number] => {
    const raRad = ra * RA2RAD;
    const decRad = dec * DEC2RAD;
    return [
        radius * Math.cos(decRad) * Math.cos(raRad),
        radius * Math.cos(decRad) * Math.sin(raRad),
        radius * Math.sin(decRad)
    ];
};

const RCSThruster = ({
    position,
    rotation,
    fireCondition,
    positionError
}: {
    position: [number, number, number],
    rotation: [number, number, number],
    fireCondition: (t: number, err: number) => boolean,
    positionError: number
}) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const effectsRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        const firing = fireCondition(t, positionError);

        if (effectsRef.current) {
            effectsRef.current.visible = firing;
        }
    });

    return (
        <group position={position} rotation={rotation}>
            {/* Nozzle Layout */}
            <mesh ref={meshRef}>
                <cylinderGeometry args={[0.02, 0.05, 0.15, 8]} />
                <meshStandardMaterial color="#333" />
            </mesh>

            {/* Active Effects Group */}
            <group ref={effectsRef} visible={false}>
                <Sparkles count={5} scale={0.2} size={3} color="#fbbf24" speed={2} noise={0.2} position={[0, 0.1, 0]} />
                <pointLight distance={0.5} intensity={1} color="#fbbf24" position={[0, 0.1, 0]} />
                <mesh position={[0, 0.1, 0]} rotation={[Math.PI, 0, 0]}>
                    <coneGeometry args={[0.02, 0.1, 8]} />
                    <meshBasicMaterial color="#fbbf24" transparent opacity={0.6} />
                </mesh>
            </group>
        </group>
    );
};

const Satellite = ({ positionError = 0, attitudeOffset = 0, autoPhase = 'OFF' }: { positionError?: number, attitudeOffset?: number, autoPhase?: string }) => {
    const meshRef = useRef<THREE.Group>(null);
    const nominalRef = useRef<THREE.Group>(null);
    const isActive = autoPhase === 'LOCK' || autoPhase === 'ALIGNED';

    useFrame((state) => {
        if (!meshRef.current || !nominalRef.current) return;
        const t = state.clock.getElapsedTime();

        // Orbital Math - SLOWER SPEED
        const radius = 15;
        const speed = 0.05;

        // Nominal Position
        const tx = Math.sin(t * speed) * radius;
        const tz = Math.cos(t * speed) * radius;

        // Position nominal reference (The orbital frame)
        nominalRef.current.position.set(tx, 0, tz);
        nominalRef.current.lookAt(
            Math.sin((t + 0.1) * speed) * radius,
            0,
            Math.cos((t + 0.1) * speed) * radius
        );

        // Drift Math (Offsets relative to nominal position)
        const driftX = Math.sin(t * 0.5) * positionError * 0.05;
        const driftY = Math.sin(t * 0.2) * positionError * 0.05;
        const driftZ = Math.cos(t * 0.3) * positionError * 0.05;

        // The meshRef is relative to nominalRef, but we set its position in world space currently?
        // Actually, meshRef is a child of nominalRef in the JSX below.
        // So drift should be LOCAL.
        meshRef.current.position.set(driftX, driftY, driftZ);

        // Attitude Offset - Perfect 1:1 Calibration (ABSOLUTE, NOT CUMULATIVE)
        const syncTime = performance.now() / 1000;
        const peakDegrees = attitudeOffset;

        // Reset rotation to nominal prograde first (local 0,0,0 relative to nominalRef)
        meshRef.current.rotation.set(0, 0, 0);
        // Apply absolute oscillation
        meshRef.current.rotateX(Math.sin(syncTime * 2) * peakDegrees * (Math.PI / 180));
        meshRef.current.rotateZ(Math.cos(syncTime * 3) * peakDegrees * (Math.PI / 180));
    });

    return (
        <group ref={nominalRef}>
            {/* Actual Satellite Body & Systems */}
            <group ref={meshRef}>
                {/* Main Bus */}
                <mesh>
                    <boxGeometry args={[0.2, 0.2, 0.2]} />
                    <meshStandardMaterial color="#444" />
                </mesh>

                {/* Solar Panels */}
                <mesh position={[0.4, 0, 0]}>
                    <boxGeometry args={[0.6, 0.02, 0.3]} />
                    <meshStandardMaterial color="#0891b2" emissive="#0891b2" emissiveIntensity={1} />
                </mesh>
                <mesh position={[-0.4, 0, 0]}>
                    <boxGeometry args={[0.6, 0.02, 0.3]} />
                    <meshStandardMaterial color="#0891b2" emissive="#0891b2" emissiveIntensity={1} />
                </mesh>

                {/* RCS Thrusters */}
                {isActive && (
                    <>
                        <RCSThruster
                            position={[0.2, 0, 0]}
                            rotation={[0, 0, -Math.PI / 2]}
                            positionError={positionError}
                            fireCondition={(t, err) => (Math.sin(t * 0.5) * err) > 0.05}
                        />
                        <RCSThruster
                            position={[-0.2, 0, 0]}
                            rotation={[0, 0, Math.PI / 2]}
                            positionError={positionError}
                            fireCondition={(t, err) => (Math.sin(t * 0.5) * err) < -0.05}
                        />
                        <RCSThruster
                            position={[0, 0.2, 0]}
                            rotation={[0, 0, 0]}
                            positionError={positionError}
                            fireCondition={(t, err) => (Math.sin(t * 0.7) * err) > 0.05}
                        />
                        <RCSThruster
                            position={[0, -0.2, 0]}
                            rotation={[Math.PI, 0, 0]}
                            positionError={positionError}
                            fireCondition={(t, err) => (Math.sin(t * 0.7) * err) < -0.05}
                        />
                    </>
                )}

                {/* Velocity Vector Indicator */}
                <Line
                    points={[[0, 0, 0], [0, 0, 2]]}
                    color="#06b6d4"
                    lineWidth={1}
                    transparent
                    opacity={0.4}
                />

                {/* HUD Label */}
                <Html distanceFactor={10} position={[0, 0.5, 0]}>
                    <div className="text-[6px] text-cyan-400 font-mono whitespace-nowrap bg-black/60 px-1 rounded pointer-events-none backdrop-blur-sm border border-cyan-500/20">
                        STARE-1
                    </div>
                </Html>
            </group>

            {/* Nominal Ghost Reference */}
            <mesh scale={0.5}>
                <boxGeometry args={[0.2, 0.2, 0.2]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.05} />
            </mesh>
        </group>
    );
};

const Pulsar = ({ data }: { data: any }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const lightRef = useRef<THREE.PointLight>(null);
    const pos = useMemo(() => celestialToCartesian(data.ra, data.dec, 50), [data]);
    const freq = getPulsarFrequency(data.period);

    useFrame((state) => {
        if (!meshRef.current || !lightRef.current) return;
        const t = state.clock.getElapsedTime();
        const ping = (Math.sin(t * freq * 0.5) + 1) / 2;
        const isPinging = ping > 0.95;

        meshRef.current.scale.setScalar(isPinging ? 1.5 : 1);
        lightRef.current.intensity = isPinging ? 10 : 2;
        (meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = isPinging ? 10 : 1;
    });

    return (
        <group position={pos}>
            <mesh ref={meshRef}>
                <sphereGeometry args={[0.3, 16, 16]} />
                <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={1} />
            </mesh>
            <pointLight ref={lightRef} color="#f59e0b" distance={20} />
            <Html distanceFactor={15} position={[0, 0, 0]}>
                <div className="text-[5px] text-amber-500 font-mono whitespace-nowrap bg-black/40 px-0.5 rounded pointer-events-none">
                    {data.name}
                </div>
            </Html>
        </group>
    );
};

const GaiaStarfield = ({ onStarClick }: { onStarClick?: (star: any) => void }) => {
    const pointsRef = useRef<THREE.Points>(null);
    const [positions, sColors] = useMemo(() => {
        const pos = new Float32Array(astroData.stars.length * 3);
        const cols = new Float32Array(astroData.stars.length * 3);
        astroData.stars.forEach((star, i) => {
            const p = celestialToCartesian(star.ra, star.dec, 100);
            pos[i * 3] = p[0];
            pos[i * 3 + 1] = p[1];
            pos[i * 3 + 2] = p[2];
            const intensity = Math.max(0.5, 1 - star.mag / 12);
            cols[i * 3] = intensity;
            cols[i * 3 + 1] = intensity;
            cols[i * 3 + 2] = intensity;
        });
        return [pos, cols];
    }, []);

    const handleClick = (e: any) => {
        if (!onStarClick) return;
        e.stopPropagation();
        if (e.index !== undefined) {
            const star = astroData.stars[e.index];
            onStarClick(star);
        }
    };

    return (
        <group>
            <Points ref={pointsRef} positions={positions} colors={sColors} stride={3} onClick={handleClick}>
                <PointMaterial transparent vertexColors size={0.8} sizeAttenuation={true} depthWrite={false} blending={THREE.AdditiveBlending} />
            </Points>
            {astroData.stars.slice(0, 50).map((star: any, i) => star.name ? (
                <Html key={i} position={celestialToCartesian(star.ra, star.dec, 100)} distanceFactor={15}>
                    <div className="text-[4px] text-white/20 hover:text-white font-mono pointer-events-none whitespace-nowrap transition-colors">
                        {star.name}
                    </div>
                </Html>
            ) : null)}
        </group>
    );
};

const Earth = () => {
    return (
        <group>
            {/* Earth Logic (Fixed at origin, Satellite orbits IT) */}
            <mesh>
                <sphereGeometry args={[4, 64, 64]} />
                <meshStandardMaterial
                    color="#2563eb"
                    emissive="#1d4ed8"
                    emissiveIntensity={0.2}
                    roughness={0.7}
                />
            </mesh>
            <mesh scale={1.05}>
                <sphereGeometry args={[4, 32, 32]} />
                <meshStandardMaterial
                    color="#60a5fa"
                    transparent
                    opacity={0.15}
                    side={THREE.BackSide}
                />
            </mesh>
            <Html distanceFactor={25} position={[0, 5, 0]} center>
                <div className="text-[9px] text-white/50 font-mono tracking-widest uppercase bg-black/40 px-2 py-0.5 rounded border border-white/10">
                    Terra (Origin)
                </div>
            </Html>
            <pointLight position={[50, 20, 50]} intensity={1.5} color="#fff" />
        </group>
    );
};

const OrbitalPaths = ({ positionError }: { positionError: number }) => {
    const points = useMemo(() => {
        const pts = [];
        for (let i = 0; i <= 64; i++) {
            const angle = (i / 64) * Math.PI * 2;
            pts.push(new THREE.Vector3(Math.sin(angle) * 15, 0, Math.cos(angle) * 15));
        }
        return pts;
    }, []);

    return (
        <group>
            {/* Nominal Path (Static Cyan) */}
            <Line points={points} color="#06b6d4" lineWidth={0.5} transparent opacity={0.2} />

            {/* Drift Boundary (Ghost Path) */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[15 - positionError * 0.2, 15 + positionError * 0.2, 64]} />
                <meshBasicMaterial color="#06b6d4" transparent opacity={0.03} />
            </mesh>
        </group>
    );
};

const TriangulationLines = ({ satelliteRef }: { satelliteRef: React.RefObject<THREE.Group> }) => {
    const linesRef = useRef<THREE.Group>(null);

    useFrame(() => {
        if (!linesRef.current || !satelliteRef.current) return;
        const satPos = satelliteRef.current.position;

        // Update line points imperatively for performance
        linesRef.current.children.forEach((child, i) => {
            if (child instanceof THREE.Line || (child as any).isLine) {
                const p = astroData.pulsars[i];
                const targetPos = celestialToCartesian(p.ra, p.dec, 50);

                // Note: Line component from drei might not be easily updatable imperatively
                // through child.geometry. So we'll keep it simple but avoid the parent re-render.
            }
        });
    });

    return (
        <group ref={linesRef}>
            {astroData.pulsars.slice(0, 3).map((p, i) => {
                const targetPos = celestialToCartesian(p.ra, p.dec, 50);
                return (
                    <TriangulationLine
                        key={i}
                        targetPos={new THREE.Vector3(...targetPos)}
                        satelliteRef={satelliteRef}
                    />
                );
            })}
        </group>
    );
};

const TriangulationLine = ({ targetPos, satelliteRef }: { targetPos: THREE.Vector3, satelliteRef: React.RefObject<THREE.Group> }) => {
    const [points, setPoints] = useState<[THREE.Vector3, THREE.Vector3]>([new THREE.Vector3(), targetPos]);

    useFrame(() => {
        if (!satelliteRef.current) return;
        // Check if satellite has moved significantly before updating to avoid unnecessary re-renders
        const currentSatPos = satelliteRef.current.position;
        if (currentSatPos.distanceToSquared(points[0]) > 0.0001) {
            setPoints([currentSatPos.clone(), targetPos]);
        }
    });

    return (
        <Line
            points={points}
            color="#06b6d4"
            lineWidth={0.5}
            transparent
            opacity={0.1}
        />
    );
};

export const NavigationCanvas = ({
    onStarClick,
    positionError = 0,
    attitudeOffset = 0,
    autoPhase = 'OFF'
}: {
    onStarClick?: (star: any) => void,
    positionError?: number,
    attitudeOffset?: number,
    autoPhase?: string
}) => {
    const satelliteRef = useRef<THREE.Group>(null);

    return (
        <div className="w-full h-full bg-[#020617]">
            <Canvas shadows dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 20, 40]} fov={60} />
                <OrbitControls enablePan={true} maxDistance={300} minDistance={10} />
                <ambientLight intensity={0.1} />
                <Stars radius={300} depth={100} count={2000} factor={4} saturation={0} fade speed={1} />
                <GaiaStarfield onStarClick={onStarClick} />
                {astroData.pulsars.map((p, i) => (
                    <Pulsar key={p.id} data={p} />
                ))}
                <Earth />
                <OrbitalPaths positionError={positionError} />
                <group ref={satelliteRef}>
                    <Satellite
                        positionError={positionError}
                        attitudeOffset={attitudeOffset}
                        autoPhase={autoPhase}
                    />
                </group>
                <TriangulationLines satelliteRef={satelliteRef} />
                <gridHelper args={[400, 40]} position={[0, -100, 0]}>
                    <meshBasicMaterial transparent opacity={0.02} color="#06b6d4" />
                </gridHelper>
            </Canvas>
        </div>
    );
};
