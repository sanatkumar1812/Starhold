import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Satellite, Shield, Lock, Radio, Eye, CheckCircle2, Cpu,
    Terminal, Globe, Zap, Settings, ArrowRight, ExternalLink
} from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera, Html } from '@react-three/drei';
import * as THREE from 'three';
import * as satellite from 'satellite.js';
import * as Tone from 'tone';

// --- Shared Types & Constants ---
interface CelestialStar {
    id: string;
    name: string;
    ra: number;
    dec: number;
    mag: number;
    position: [number, number, number];
}

const STAR_SPHERE_RADIUS = 300;

const MAJOR_STARS = [
    { name: 'Sirius', ra: 101.287, dec: -16.716, mag: -1.46 },
    { name: 'Canopus', ra: 95.987, dec: -52.695, mag: -0.74 },
    { name: 'Arcturus', ra: 213.915, dec: 19.182, mag: -0.05 },
    { name: 'Vega', ra: 279.234, dec: 38.784, mag: 0.03 },
];

const raDecToXyz = (ra: number, dec: number, radius: number): [number, number, number] => {
    const raRad = (ra) * (Math.PI / 180);
    const decRad = (dec) * (Math.PI / 180);
    const x = radius * Math.cos(decRad) * Math.cos(raRad);
    const y = radius * Math.cos(decRad) * Math.sin(raRad);
    const z = radius * Math.sin(decRad);
    return [x, z, -y];
};

// --- Sub-Components ---
const Earth = () => (
    <group>
        <mesh>
            <sphereGeometry args={[5, 64, 64]} />
            <meshPhongMaterial
                color="#1a365d"
                emissive="#000814"
                specular="#2d3748"
                shininess={10}
            />
        </mesh>
    </group>
);

const SatelliteModel = ({
    position, rotation, isVerified, isScanning
}: {
    position: [number, number, number],
    rotation: [number, number, number],
    isVerified: boolean,
    isScanning: boolean
}) => {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame(() => {
        if (meshRef.current && isScanning) {
            meshRef.current.rotation.y += 0.05;
        }
    });

    return (
        <group position={position} rotation={rotation}>
            <mesh ref={meshRef}>
                <boxGeometry args={[0.5, 0.5, 0.8]} />
                <meshStandardMaterial
                    color={isVerified ? "#4ade80" : "#94a3b8"}
                    metalness={0.8}
                    roughness={0.2}
                />
            </mesh>
            <mesh position={[0, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0, 0.6, 2, 32]} />
                <meshBasicMaterial color="#00d4ff" transparent opacity={isScanning ? 0.4 : 0.15} />
            </mesh>
            {isVerified && (
                <Html distanceFactor={10} position={[0, 0.8, 0]}>
                    <div className="bg-green-500/80 text-white text-[8px] px-2 py-1 rounded font-mono whitespace-nowrap shadow-[0_0_10px_rgba(74,222,128,0.5)] border border-white/20 animate-bounce">
                        STAR VERIFIED ✓
                    </div>
                </Html>
            )}
        </group>
    );
};

const PulsingStar = ({ position, name, isTarget }: { position: [number, number, number], name: string, isTarget: boolean }) => {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current && isTarget) {
            const scale = 1 + Math.sin(state.clock.elapsedTime * 6) * 0.3;
            meshRef.current.scale.set(scale, scale, scale);
        }
    });

    return (
        <group position={position}>
            <mesh ref={meshRef}>
                <sphereGeometry args={[isTarget ? 0.6 : 0.3, 16, 16]} />
                <meshBasicMaterial color={isTarget ? "#fbbf24" : "#ffffff"} />
            </mesh>
            <Html center position={[0, -1, 0]}>
                <div className={`text-[8px] font-mono px-1 py-0.5 rounded whitespace-nowrap ${isTarget ? 'text-yellow-400 bg-black/60 border border-yellow-500/30' : 'text-white/20'}`}>
                    {name}
                </div>
            </Html>
        </group>
    );
};

export const B2BPreviewSimulator = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState<'idle' | 'scanning' | 'verified' | 'failed'>('idle');
    const [isSimulating, setIsSimulating] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const [satPosition, setSatPosition] = useState<[number, number, number]>([10, 0, 0]);

    const stars = useMemo<CelestialStar[]>(() =>
        MAJOR_STARS.map(s => ({
            ...s,
            id: s.name,
            position: raDecToXyz(s.ra, s.dec, STAR_SPHERE_RADIUS)
        })), []);

    const targetStar = stars[0];

    const addLog = (msg: string) => {
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 5));
    };

    const handleQuickBind = () => {
        if (isSimulating) return;
        setIsSimulating(true);
        setStatus('scanning');
        setLogs([]);
        addLog('Initializing Starhold Verification Layer...');

        setTimeout(() => {
            addLog(`Acquiring target: ${targetStar.name}...`);
        }, 800);

        setTimeout(() => {
            addLog('Cross-referencing Gaia DR3 catalog...');
        }, 1500);

        setTimeout(() => {
            setStatus('verified');
            addLog('✓ Physical sky state confirmed.');
            addLog('✓ Command authorized.');
            new Tone.PolySynth().toDestination().triggerAttackRelease(["C4", "E4", "G4"], "8n");
            setIsSimulating(false);
        }, 3000);
    };

    useEffect(() => {
        const timer = setInterval(() => {
            const t = Date.now() * 0.0005;
            setSatPosition([Math.cos(t) * 12, Math.sin(t) * 2, Math.sin(t) * 12]);
        }, 50);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="grid lg:grid-cols-3 gap-6">
            {/* 3D View */}
            <div className="lg:col-span-2 relative aspect-video rounded-2xl overflow-hidden border border-cosmic-blue/20 bg-slate-950/50 shadow-2xl">
                <div className="absolute top-4 left-4 z-20">
                    <div className="px-3 py-1.5 rounded-full bg-black/60 border border-cosmic-blue/40 flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${status === 'scanning' ? 'bg-blue-500 animate-pulse' : status === 'verified' ? 'bg-green-500' : 'bg-slate-500'}`} />
                        <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-cosmic-blue">
                            PREVIEW: {status.toUpperCase()}
                        </span>
                    </div>
                </div>

                <Canvas>
                    <PerspectiveCamera makeDefault position={[12, 12, 25]} fov={45} />
                    <OrbitControls enableZoom={false} autoRotate={!isSimulating} autoRotateSpeed={0.5} />
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} />
                    <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
                    <Earth />
                    <SatelliteModel
                        position={satPosition}
                        rotation={[0, 0, 0]}
                        isVerified={status === 'verified'}
                        isScanning={status === 'scanning'}
                    />
                    {stars.map((star) => (
                        <PulsingStar
                            key={star.id}
                            position={star.position}
                            name={star.name}
                            isTarget={star.id === targetStar.id}
                        />
                    ))}
                </Canvas>

                {/* Verification Overlay */}
                {status === 'verified' && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                        <div className="w-[80%] h-[80%] border-2 border-green-500/30 rounded-lg animate-pulse" />
                    </div>
                )}
            </div>

            {/* Interaction Panel */}
            <Card className="bg-slate-900/40 border-cosmic-blue/20 p-6 flex flex-col justify-between backdrop-blur-md">
                <div className="space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-cosmic-blue/20">
                        <Terminal className="w-4 h-4 text-cosmic-blue" />
                        <h3 className="font-mono text-xs font-bold uppercase tracking-wider">Interface Control</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-black/40 rounded-lg p-3 border border-white/5 font-mono text-[10px] min-h-[100px]">
                            {logs.length === 0 ? (
                                <div className="text-muted-foreground italic">System Idle. Pending command binding...</div>
                            ) : (
                                logs.map((log, i) => (
                                    <div key={i} className={`${log.includes('✓') ? 'text-green-400' : 'text-cyan-400/80'}`}>
                                        {log}
                                    </div>
                                ))
                            )}
                        </div>

                        <Button
                            className="w-full bg-cosmic-blue hover:bg-cosmic-blue/80 text-white font-mono text-xs py-5"
                            onClick={handleQuickBind}
                            disabled={isSimulating || status === 'verified'}
                        >
                            {status === 'verified' ? 'COMMAND VERIFIED' : isSimulating ? 'BINDING...' : 'QUICK BIND (DEMO)'}
                        </Button>
                    </div>

                    <div className="space-y-2 text-[10px] text-muted-foreground font-mono leading-relaxed">
                        <p>This simulation demonstrates the stellar pattern matching algorithm between the spacecraft star tracker and the Gaia DR3 catalog.</p>
                    </div>
                </div>

                <div className="pt-6 border-t border-cosmic-blue/10">
                    <Link to="/4d">
                        <Button
                            variant="outline"
                            className="w-full border-cosmic-blue/30 text-cosmic-blue hover:bg-cosmic-blue/10 text-xs py-5 flex items-center justify-center gap-2"
                        >
                            <ExternalLink className="w-3 h-3" />
                            Launch Full Mission Dashboard
                        </Button>
                    </Link>
                </div>
            </Card>
        </div>
    );
};
