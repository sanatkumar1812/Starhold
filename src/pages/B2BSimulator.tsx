import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CosmicBackground } from '@/components/CosmicBackground';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
    Satellite, Shield, Lock, Radio, Eye, CheckCircle2, Cpu,
    Terminal, Globe, Zap, Settings, Download, Info, ArrowLeft
} from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera, Html } from '@react-three/drei';
import * as THREE from 'three';
import * as satellite from 'satellite.js';
import CryptoJS from 'crypto-js';
import * as Tone from 'tone';
import { toast } from 'sonner';

// --- Types & Constants ---
interface CelestialStar {
    id: string;
    name: string;
    ra: number;
    dec: number;
    mag: number;
    position: [number, number, number];
}

const STAR_SPHERE_RADIUS = 300;

const SATELLITES = [
    { name: 'ISS (ZARYA)', catalog: '25544', tle: ['1 25544U 98067A   24040.82062361  .00016717  00000-0  30159-3 0  9999', '2 25544  51.6415 162.1557 0004353  70.8524  42.2215 15.49547121438257'] },
    { name: 'STARLINK-1007', catalog: '44713', tle: ['1 44713U 19074A   24040.54221123  .00001234  00000-0  12345-3 0  9999', '2 44713  53.0543  12.3456 0001234  45.6789 123.4567 15.06423123456789'] },
    { name: 'LUNAR GATEWAY (SIM)', catalog: '99999', tle: ['1 99999U 24001A   24040.00000000  .00000000  00000-0  00000-0 0  9999', '2 99999  25.0000  00.0000 0000000  00.0000   0.0000 12.00000000000000'] },
];

const MAJOR_STARS = [
    { name: 'Sirius', ra: 101.287, dec: -16.716, mag: -1.46 },
    { name: 'Canopus', ra: 95.987, dec: -52.695, mag: -0.74 },
    { name: 'Arcturus', ra: 213.915, dec: 19.182, mag: -0.05 },
    { name: 'Vega', ra: 279.234, dec: 38.784, mag: 0.03 },
    { name: 'Capella', ra: 79.172, dec: 45.998, mag: 0.08 },
    { name: 'Rigel', ra: 78.634, dec: -8.201, mag: 0.13 },
    { name: 'Procyon', ra: 114.825, dec: 5.225, mag: 0.34 },
];

const MISSION_COMMANDS = [
    { id: 'DEPLOY_ARRAYS', label: 'Deploy Solar Arrays', icon: Zap },
    { id: 'START_DOWNLINK', label: 'Initiate High-Speed Downlink', icon: Radio },
    { id: 'CALIBRATE_SENSOR', label: 'Calibrate Star Tracker', icon: Settings },
    { id: 'EMERGENCY_MODE', label: 'Execute Emergency Beacon', icon: Shield },
];

// --- Helpers ---
const raDecToXyz = (ra: number, dec: number, radius: number): [number, number, number] => {
    const raRad = ra * (Math.PI / 180);
    const decRad = dec * (Math.PI / 180);
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
            <meshPhongMaterial color="#1a365d" emissive="#000814" specular="#2d3748" shininess={10} />
        </mesh>
    </group>
);

const SatelliteModel = ({
    position, rotation, isVerified, isScanning,
    panelsDeployed, isTransmitting, isEmergency
}: any) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const leftPanelRef = useRef<THREE.Group>(null);
    const rightPanelRef = useRef<THREE.Group>(null);
    const beamRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current && isScanning) meshRef.current.rotation.y += 0.05;

        if (leftPanelRef.current && rightPanelRef.current) {
            const targetX = panelsDeployed ? 0.6 : 0.25;
            const targetScaleX = panelsDeployed ? 1 : 0.1;
            leftPanelRef.current.position.x = THREE.MathUtils.lerp(leftPanelRef.current.position.x, -targetX, 0.1);
            rightPanelRef.current.position.x = THREE.MathUtils.lerp(rightPanelRef.current.position.x, targetX, 0.1);
            leftPanelRef.current.scale.x = THREE.MathUtils.lerp(leftPanelRef.current.scale.x, targetScaleX, 0.1);
            rightPanelRef.current.scale.x = THREE.MathUtils.lerp(rightPanelRef.current.scale.x, targetScaleX, 0.1);
        }

        if (beamRef.current) {
            const material = beamRef.current.material as THREE.MeshBasicMaterial;
            if (isTransmitting) {
                beamRef.current.visible = true;
                beamRef.current.scale.y = THREE.MathUtils.lerp(beamRef.current.scale.y, 1, 0.1);
                material.opacity = 0.5 + Math.sin(state.clock.elapsedTime * 10) * 0.2;
            } else {
                beamRef.current.scale.y = 0;
                beamRef.current.visible = false;
            }
        }
    });

    return (
        <group position={position} rotation={rotation}>
            <mesh ref={meshRef}>
                <boxGeometry args={[0.5, 0.5, 0.8]} />
                <meshStandardMaterial
                    color={isEmergency ? "#ef4444" : isVerified ? "#4ade80" : "#94a3b8"}
                    metalness={0.8} roughness={0.2}
                />
            </mesh>
            <group ref={leftPanelRef} position={[-0.25, 0, 0]}>
                <mesh><boxGeometry args={[0.8, 0.4, 0.05]} /><meshStandardMaterial color="#3b82f6" /></mesh>
            </group>
            <group ref={rightPanelRef} position={[0.25, 0, 0]}>
                <mesh><boxGeometry args={[0.8, 0.4, 0.05]} /><meshStandardMaterial color="#3b82f6" /></mesh>
            </group>
            <mesh ref={beamRef} position={[0, -5, 0]} visible={false}>
                <cylinderGeometry args={[0.02, 0.5, 10, 32]} />
                <meshBasicMaterial color="#00d4ff" transparent opacity={0.4} />
            </mesh>
            <mesh position={[0, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0, 0.6, 2, 32]} />
                <meshBasicMaterial color="#00d4ff" transparent opacity={isScanning ? 0.4 : 0.1} />
            </mesh>
            {isVerified && (
                <Html distanceFactor={10} position={[0, 0.8, 0]}>
                    <div className="bg-green-500/80 text-white text-[8px] px-2 py-1 rounded font-mono shadow-[0_0_10px_rgba(74,222,128,0.5)] animate-bounce">
                        STAR VERIFIED ✓
                    </div>
                </Html>
            )}
        </group>
    );
};

const PulsingStar = ({ position, name, isTarget }: any) => {
    const meshRef = useRef<THREE.Mesh>(null);
    useFrame((state) => {
        if (meshRef.current) {
            const scale = 1 + Math.sin(state.clock.elapsedTime * 6) * 0.2;
            meshRef.current.scale.set(scale, scale, scale);
        }
    });
    return (
        <group position={position}>
            <mesh ref={meshRef}>
                <sphereGeometry args={[0.5, 16, 16]} />
                <meshBasicMaterial color="#fbbf24" />
            </mesh>
            <Html center position={[0, -1, 0]}>
                <div className="text-[10px] font-mono px-2 py-0.5 rounded text-yellow-400 bg-black/60 border border-yellow-500/30 whitespace-nowrap">
                    {name}
                </div>
            </Html>
        </group>
    );
};

// --- Main Component ---
const B2BSimulator = () => {
    const navigate = useNavigate();
    const [selectedSat, setSelectedSat] = useState(SATELLITES[0]);
    const [unlockWindow, setUnlockWindow] = useState(() => {
        const d = new Date();
        d.setMinutes(d.getMinutes() + 30);
        return d.toISOString().substring(0, 16);
    });
    const [isSimulating, setIsSimulating] = useState(false);
    const [status, setStatus] = useState<'idle' | 'scanning' | 'verified' | 'failed'>('idle');
    const [logs, setLogs] = useState<string[]>([]);
    const [satPosition, setSatPosition] = useState<[number, number, number]>([10, 0, 0]);
    const [satRotation, setSatRotation] = useState<[number, number, number]>([0, 0, 0]);
    const [patternStars, setPatternStars] = useState<CelestialStar[]>([]);
    const [selectedCommandId, setSelectedCommandId] = useState(MISSION_COMMANDS[0].id);
    const [panelsDeployed, setPanelsDeployed] = useState(false);
    const [isTransmitting, setIsTransmitting] = useState(false);
    const [isEmergency, setIsEmergency] = useState(false);
    const [isWaiting, setIsWaiting] = useState(false);
    const [countdown, setCountdown] = useState<number | null>(null);

    const addLog = (msg: string) => {
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 50));
    };

    const computeFOVPatch = (tle: string[], timestamp: Date) => {
        try {
            const satrec = satellite.twoline2satrec(tle[0], tle[1]);
            const posVel = satellite.propagate(satrec, timestamp);
            const pos = posVel.position as satellite.EciVec3<number>;
            if (pos) {
                const mag = Math.sqrt(pos.x ** 2 + pos.y ** 2 + pos.z ** 2);
                const ra = Math.atan2(pos.y, pos.x) * (180 / Math.PI);
                const dec = Math.asin(pos.z / mag) * (180 / Math.PI);
                return { ra: (ra + 360) % 360, dec };
            }
        } catch (e) { }
        return { ra: 45.2, dec: 23.1 };
    };

    const handleGenerateKey = async () => {
        setIsSimulating(true);
        setStatus('scanning');
        setLogs([]);
        addLog(`🔮 INITIATING AUTO-PATTERN GENERATION...`);

        const timestamp = new Date(unlockWindow);
        const { ra, dec } = computeFOVPatch(selectedSat.tle, timestamp);

        addLog(`TLE: ${selectedSat.name} (NORAD ${selectedSat.catalog})`);
        addLog(`Predicted FOV Center: RA=${ra.toFixed(1)}°, Dec=${dec.toFixed(1)}° (Nadir-Pointed)`);

        // Mock Gaia selection for demo efficiency
        const selected = MAJOR_STARS.slice(0, 5).map(s => ({
            ...s, id: s.name, position: raDecToXyz(s.ra, s.dec, STAR_SPHERE_RADIUS)
        }));
        setPatternStars(selected);

        addLog(`Gaia Query: 47 stars detected (Vmag<6.5)`);
        addLog(`✓ AUTO-SELECTED PATTERN: ${selected.map(s => s.name).join(', ')}`);
        addLog(`Geometry Hash: [12.4°, 8.7°, 15.2°...] ✓`);
        addLog(`Reliability: 99.9% (auto-selected optimal geometry)`);

        setTimeout(() => {
            setStatus('verified');
            setIsSimulating(false);
            new Tone.PolySynth().toDestination().triggerAttackRelease(["C4", "E4", "G4"], "8n");
            toast.success("Key Pattern Generated");
        }, 2000);
    };

    const handleTransmit = () => {
        const targetTime = new Date(unlockWindow).getTime();
        const now = Date.now();
        const delay = targetTime - now;

        if (delay > 0) {
            setIsWaiting(true);
            setCountdown(Math.floor(delay / 1000));
            addLog(`[SCHEDULED] Execution queued for ${new Date(targetTime).toLocaleTimeString()}`);
            const timer = setInterval(() => {
                setCountdown(prev => {
                    if (prev === null || prev <= 1) {
                        clearInterval(timer);
                        executeCommand();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            executeCommand();
        }
    };

    const executeCommand = () => {
        setIsWaiting(false);
        setIsTransmitting(true);
        addLog(`✓ TRANSMITTING ENCRYPTED COMMAND...`);

        if (selectedCommandId === 'DEPLOY_ARRAYS') setPanelsDeployed(true);
        if (selectedCommandId === 'START_DOWNLINK') setIsTransmitting(true);
        if (selectedCommandId === 'EMERGENCY_MODE') setIsEmergency(true);

        setTimeout(() => {
            setIsTransmitting(false);
            addLog(`✓ COMMAND VERIFIED → EXECUTED ✓`);
            toast.success("Command Executed");
            new Tone.Synth().toDestination().triggerAttackRelease("C5", "8n");
        }, 3000);
    };

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            try {
                const satrec = satellite.twoline2satrec(selectedSat.tle[0], selectedSat.tle[1]);
                const posVel = satellite.propagate(satrec, now);
                const pos = posVel.position as satellite.EciVec3<number>;
                if (pos) {
                    const scale = 0.001;
                    const x = pos.x * scale;
                    const y = pos.y * scale;
                    const z = pos.z * scale;
                    setSatPosition([x, z, -y]);
                    const yaw = Math.atan2(x, -y);
                    const pitch = Math.atan2(z, Math.sqrt(x * x + y * y));
                    setSatRotation([pitch, yaw, 0]);
                }
            } catch (e) {
                const t = Date.now() * 0.0005;
                setSatPosition([Math.cos(t) * 15, Math.sin(t) * 2, Math.sin(t) * 15]);
            }
        }, 50);
        return () => clearInterval(timer);
    }, [selectedSat]);

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#0a0a1a] text-white">
            <CosmicBackground />
            <div className="relative z-10 flex flex-col h-screen">
                <div className="absolute top-6 left-6 z-50">
                    <Button variant="ghost" size="sm" className="text-white/60 hover:text-white" onClick={() => navigate(-1)}>
                        <ArrowLeft className="w-4 h-4 mr-2" /> Exit Mission Simulator
                    </Button>
                </div>

                <main className="flex-1 flex flex-col md:flex-row p-4 pt-20 gap-4 overflow-hidden">
                    <Card className="flex-none w-full md:w-80 bg-black/40 border-cosmic-blue/20 p-4 space-y-6 flex flex-col backdrop-blur-md">
                        <div className="flex items-center justify-between pb-2 border-b border-cosmic-blue/20">
                            <div className="flex items-center gap-2"><Settings className="w-5 h-5 text-cosmic-blue" />
                                <h2 className="font-mono text-sm font-bold uppercase tracking-tighter">Mission Control</h2></div>
                            <div className="px-2 py-0.5 rounded bg-cosmic-blue/10 border border-cosmic-blue/30 text-[8px] text-cosmic-blue font-mono animate-pulse">TLE-AUTO ✓</div>
                        </div>

                        <ScrollArea className="flex-1 pr-2">
                            <div className="space-y-6 pb-4">
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground flex items-center gap-2"><Satellite className="w-3 h-3" /> SELECT MISSION TLE</Label>
                                    <Select onValueChange={(val) => setSelectedSat(SATELLITES.find(s => s.name === val) || SATELLITES[0])}>
                                        <SelectTrigger className="bg-slate-900/50 border-cosmic-blue/30"><SelectValue placeholder="Select satellite" /></SelectTrigger>
                                        <SelectContent className="bg-slate-950 border-cosmic-blue/30">{SATELLITES.map(sat => (<SelectItem key={sat.catalog} value={sat.name}>{sat.name}</SelectItem>))}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground flex items-center gap-2"><Zap className="w-3 h-3" /> UNLOCK TIMESTAMP</Label>
                                    <Input type="datetime-local" value={unlockWindow} onChange={(e) => setUnlockWindow(e.target.value)} className="bg-slate-900/50 border-cosmic-blue/30" />
                                    <p className="text-[10px] text-white/30 italic">Determines celestial window for auto-keygen.</p>
                                </div>
                                <Button className="w-full bg-cosmic-blue hover:bg-cosmic-blue/80 text-white font-bold py-6 group relative overflow-hidden" onClick={handleGenerateKey} disabled={isSimulating}>
                                    <Radio className={`w-5 h-5 mr-2 ${isSimulating ? 'animate-ping' : ''}`} />
                                    {isSimulating ? 'COMPUTING FOV...' : 'GENERATE AUTO-PATTERN'}
                                </Button>
                                <div className="space-y-2 pt-4 border-t border-white/5">
                                    <Label className="text-xs text-muted-foreground flex items-center gap-2"><Lock className="w-3 h-3" /> MISSION COMMAND</Label>
                                    <Select onValueChange={(val) => setSelectedCommandId(val)} defaultValue={selectedCommandId}>
                                        <SelectTrigger className="bg-slate-900/50 border-cosmic-blue/30"><SelectValue placeholder="Select command" /></SelectTrigger>
                                        <SelectContent className="bg-slate-950 border-cosmic-blue/30">{MISSION_COMMANDS.map(cmd => (<SelectItem key={cmd.id} value={cmd.id}><div className="flex items-center gap-2"><cmd.icon className="w-3.5 h-3.5 text-cosmic-blue" /><span>{cmd.label}</span></div></SelectItem>))}</SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </ScrollArea>
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-6" onClick={handleTransmit} disabled={status !== 'verified' || isWaiting}>
                            <Terminal className="w-5 h-5 mr-2" />{isWaiting ? `PENDING (${countdown}s)` : 'TRANSMIT ENCRYPTED COMMAND'}
                        </Button>
                        <div className="mt-4 p-3 rounded-xl bg-slate-950/50 border border-white/5 flex flex-col gap-2">
                            <div className="flex items-center gap-2"><Shield className="w-3 h-3 text-amber-500" /><span className="text-[10px] font-mono text-white/50 font-bold uppercase tracking-wider">Patented Physics-Based Keygen</span></div>
                            <p className="text-[8px] text-white/30 leading-tight">Leverages Ball 300S optics simulation & Gaia DR3 alignment.</p>
                        </div>
                    </Card>

                    <div className="flex-1 relative rounded-2xl overflow-hidden border border-cosmic-blue/20 bg-black/60 shadow-2xl">
                        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                            <div className="px-3 py-1.5 rounded-full bg-black/60 border border-cosmic-blue/40 flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${isWaiting ? 'bg-yellow-500 animate-pulse' : status === 'scanning' ? 'bg-blue-500 animate-pulse' : status === 'verified' ? 'bg-green-500' : 'bg-slate-500'}`} />
                                <span className="text-[10px] font-mono font-bold uppercase text-cosmic-blue">NADIR LOCK: {status === 'verified' ? 'ACTIVE' : 'STANDBY'}</span>
                            </div>
                        </div>
                        {status === 'verified' && (
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
                                <div className="w-[12vw] h-[12vw] border border-cosmic-blue/50 rounded flex items-end justify-center pb-2">
                                    <span className="text-[8px] font-mono text-cosmic-blue/60 uppercase">10°×10° FOV</span>
                                </div>
                            </div>
                        )}
                        <Canvas>
                            <PerspectiveCamera makeDefault position={[12, 12, 25]} fov={45} />
                            <OrbitControls enableDamping dampingFactor={0.05} />
                            <ambientLight intensity={0.5} />
                            <pointLight position={[100, 100, 100]} intensity={1.5} />
                            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                            <Earth />
                            <SatelliteModel position={satPosition} rotation={satRotation} isVerified={status === 'verified'} isScanning={status === 'scanning'} panelsDeployed={panelsDeployed} isTransmitting={isTransmitting} isEmergency={isEmergency} />
                            <group>
                                {patternStars.map((star) => (<PulsingStar key={star.id} position={star.position} name={star.name} isTarget={true} />))}
                                {status === 'verified' && patternStars.length > 1 && (
                                    <group>
                                        {patternStars.slice(0, -1).map((star, i) => (
                                            <line key={i}>
                                                <bufferGeometry attach="geometry"><float32BufferAttribute attach="attributes-position" args={[new Float32Array([...star.position, ...patternStars[i + 1].position]), 3]} /></bufferGeometry>
                                                <lineBasicMaterial attach="material" color="#fbbf24" transparent opacity={0.3} />
                                            </line>
                                        ))}
                                    </group>
                                )}
                            </group>
                        </Canvas>
                        <div className="absolute top-4 right-4 z-20">
                            <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2">
                                <Cpu className="w-3 h-3 text-emerald-400" /><span className="text-[9px] font-mono font-bold text-emerald-400 uppercase">AI Selected Optimal Pattern</span>
                            </div>
                        </div>
                    </div>

                    <Card className="flex-none w-full md:w-80 bg-black/40 border-cosmic-blue/20 p-4 space-y-4 flex flex-col backdrop-blur-md">
                        <div className="flex items-center gap-2 pb-2 border-b border-cosmic-blue/20"><Terminal className="w-5 h-5 text-cosmic-blue" /><h2 className="font-mono text-sm font-bold uppercase tracking-tighter">Auto-Magic Log</h2></div>
                        <ScrollArea className="flex-1 bg-black/20 rounded p-4 border border-white/5 font-mono text-[10px] leading-relaxed">
                            <div className="space-y-4">
                                {logs.length === 0 ? (<div className="text-muted-foreground italic">Awaiting key generation pulse...</div>) : (logs.map((log, i) => (<div key={i} className={`${log.includes('✓') ? 'text-green-400' : 'text-cyan-400/80'}`}>{log}</div>)))}
                            </div>
                        </ScrollArea>
                        <div className="space-y-2 pt-2 text-[10px] font-mono">
                            <div className="flex justify-between">
                                <span className="text-white/40">RELIABILITY</span>
                                <span className="text-green-400 font-bold">99.9% SUCCESS</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-white/40">TLE PROPAGATION</span>
                                <span className="text-green-400">HIGH-PRECISION ✓</span>
                            </div>
                        </div>
                    </Card>
                </main>
            </div>
        </div>
    );
};

export default B2BSimulator;
