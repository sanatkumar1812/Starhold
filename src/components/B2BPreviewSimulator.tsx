import { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import * as satellite from 'satellite.js';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Satellite, Shield, Lock, Radio, Zap, Terminal } from 'lucide-react';
import { toast } from 'sonner';

// --- TLE & Constants ---
const TLE = [
    '1 25544U 98067A   24040.82062361  .00016717  00000-0  30159-3 0  9999',
    '2 25544  51.6415 162.1557 0004353  70.8524  42.2215 15.49547121438257'
];

const STAR_SPHERE_RADIUS = 300;

// --- Sub-Components ---
const Earth = () => (
    <mesh>
        <sphereGeometry args={[5, 32, 32]} />
        <meshStandardMaterial color="#0f172a" emissive="#1e293b" emissiveIntensity={0.2} />
    </mesh>
);

const SatelliteModel = ({ position, status }: any) => {
    const isScanning = status === 'scanning';
    const isVerified = status === 'verified';
    const groupRef = useRef<THREE.Group>(null);

    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.lookAt(0, 0, 0);
        }
    });

    return (
        <group ref={groupRef} position={position}>
            {/* Satellite Body */}
            <mesh>
                <boxGeometry args={[0.5, 0.5, 0.8]} />
                <meshStandardMaterial color={isVerified ? "#10b981" : "#64748b"} metalness={0.8} />
            </mesh>

            {/* Zenith Star Tracker (Local +Z, Pointing Space) */}
            <group position={[0, 0, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
                <mesh position={[0, -0.3, 0]}>
                    <cylinderGeometry args={[0.2, 0.1, 0.3, 16]} />
                    <meshStandardMaterial color="#1e293b" />
                </mesh>
                <mesh position={[0, 1.5, 0]}>
                    <cylinderGeometry args={[0.53, 0.1, 3, 32]} />
                    <meshBasicMaterial color="#06b6d4" transparent opacity={isScanning ? 0.3 : 0.05} />
                </mesh>
                <Html distanceFactor={10} position={[0, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <div className="text-[6px] font-mono text-cyan-400 bg-black/40 px-1 whitespace-nowrap uppercase">Zenith Ops</div>
                </Html>
            </group>

            {isVerified && (
                <Html distanceFactor={10} position={[0, 0.8, 0]}>
                    <div className="bg-emerald-500 text-white text-[8px] px-2 py-0.5 rounded font-mono uppercase font-bold animate-pulse">
                        Astrometric Lock
                    </div>
                </Html>
            )}
        </group>
    );
};

const BackgroundStars = () => {
    const stars = useMemo(() => {
        const positions = [];
        for (let i = 0; i < 400; i++) {
            const r = 400 + Math.random() * 200;
            const theta = 2 * Math.PI * Math.random();
            const phi = Math.acos(2 * Math.random() - 1);
            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);
            positions.push(x, y, z);
        }
        return new Float32Array(positions);
    }, []);

    return (
        <points>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={stars.length / 3}
                    array={stars}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial size={1.5} sizeAttenuation color="#ffffff" transparent opacity={0.6} />
        </points>
    );
};

const B2BPreviewSimulator = () => {
    const [status, setStatus] = useState<'idle' | 'scanning' | 'verified'>('idle');
    const [satPosition, setSatPosition] = useState<[number, number, number]>([10, 0, 0]);
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (msg: string) => {
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 5));
    };

    const handleQuickBind = async () => {
        setStatus('scanning');
        setLogs([]);
        addLog("INITIATING ZENITH-ALIGNED BIND...");
        addLog("TLE: ISS (ZARYA) - NORAD 25544");

        setTimeout(() => {
            addLog("ZENITH BORESIGHT CALIBRATED: RA=102.4°, Dec=-16.1°");
            addLog("✓ PATTERN ACQUIRED: Sirius, HIP 4322, HIP 9912");
            setStatus('verified');
            toast.success("Astrometric Signature Handshake Complete");
        }, 1500);
    };

    // Orbital Movement
    useEffect(() => {
        const timer = setInterval(() => {
            try {
                const now = new Date();
                const satrec = satellite.twoline2satrec(TLE[0], TLE[1]);
                const posVel = satellite.propagate(satrec, now);
                const pos = posVel.position as satellite.EciVec3<number>;
                if (pos) {
                    const scale = 0.001;
                    const x = pos.x * scale;
                    const y = pos.y * scale;
                    const z = pos.z * scale;
                    setSatPosition([x, z, -y]);
                }
            } catch (e) { }
        }, 100);
        return () => clearInterval(timer);
    }, []);

    return (
        <Card className="flex flex-col md:flex-row h-[500px] bg-slate-950/80 border-slate-800 overflow-hidden backdrop-blur-sm self-center max-w-5xl mx-auto w-full group relative">
            <div className="flex-1 relative bg-black/40">
                <Canvas>
                    <PerspectiveCamera makeDefault position={[12, 12, 15]} fov={35} />
                    <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[50, 20, 30]} intensity={1.5} />
                    <BackgroundStars />
                    <Earth />
                    <SatelliteModel position={satPosition} status={status} />
                </Canvas>

                <div className="absolute bottom-4 left-4 flex flex-col gap-1 pointer-events-none">
                    {logs.map((log, i) => (
                        <div key={i} className={`font-mono text-[9px] ${log.includes('✓') ? 'text-emerald-400' : 'text-cyan-400/70'}`}>
                            {log}
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-full md:w-80 p-6 flex flex-col gap-6 justify-center bg-slate-900/50">
                <div className="space-y-4">
                    <div className="p-3 rounded-lg bg-slate-950 border border-emerald-500/20 shadow-inner">
                        <div className="flex items-center gap-2 mb-2">
                            <Shield className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">Operational Status</span>
                        </div>
                        <div className="flex justify-between items-end">
                            <div className="space-y-1">
                                <p className="text-[10px] text-slate-500 uppercase">Integrity Score</p>
                                <p className="text-xl font-mono text-emerald-400">99.9%</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-slate-500 uppercase">Mode</p>
                                <p className="text-sm font-mono text-emerald-400 uppercase">{status === 'verified' ? 'Astrometric Lock' : 'Standby'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-slate-200">Star-Referenced Command Link</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Synchronize your command uplink with the satellite's Zenith boresight.
                            Uses the physical geometric orientation of the stars as a one-time pad.
                        </p>
                    </div>
                </div>

                <Button
                    onClick={handleQuickBind}
                    disabled={status === 'verified' || status === 'scanning'}
                    className={`w-full h-12 font-mono text-xs uppercase tracking-widest transition-all duration-500 ${status === 'verified'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 cursor-default'
                        : 'bg-cyan-600 hover:bg-cyan-500 text-white border-transparent'
                        }`}
                >
                    {status === 'scanning' ? 'Calibrating Zenith...' : status === 'verified' ? 'Signature Synchronized ✓' : 'Initiate Secure Handshake'}
                </Button>

                <div className="flex items-center justify-between px-2 opacity-50">
                    <div className="flex flex-col items-center">
                        <Satellite className="w-3 h-3 mb-1 text-slate-400" />
                        <span className="text-[8px] uppercase tracking-tighter">Nadir Lock</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <Lock className="w-3 h-3 mb-1 text-slate-400" />
                        <span className="text-[8px] uppercase tracking-tighter">AES-256</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <Radio className="w-3 h-3 mb-1 text-slate-400" />
                        <span className="text-[8px] uppercase tracking-tighter">X-Band</span>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export { B2BPreviewSimulator };
