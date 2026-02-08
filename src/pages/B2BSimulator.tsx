import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CosmicBackground } from '@/components/CosmicBackground';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
    Satellite, Shield, Lock, Radio, Eye, CheckCircle2, XCircle, Cpu,
    Terminal, Globe, Zap, Settings, Download, Camera, Share2, Info, ArrowLeft
} from 'lucide-react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Float, PerspectiveCamera, Html, useHelper } from '@react-three/drei';
import * as THREE from 'three';
import * as satellite from 'satellite.js';
import CryptoJS from 'crypto-js';
import * as Tone from 'tone';
import chroma from 'chroma-js';
import { toast } from 'sonner';

// --- Mock Data & Constants ---

const GAIA_STARS = [
    { name: 'Sirius', ra: '06h 45m 08s', dec: '-16° 42\' 58"', mag: -1.46, class: 'A1V' },
    { name: 'Canopus', ra: '06h 23m 57s', dec: '-52° 41\' 44"', mag: -0.74, class: 'A9II' },
    { name: 'Rigil Kentaurus', ra: '14h 39m 36s', dec: '-60° 50\' 02"', mag: -0.27, class: 'G2V' },
    { name: 'Arcturus', ra: '14h 15m 39s', dec: '+19° 10\' 56"', mag: -0.05, class: 'K1.5III' },
    { name: 'Vega', ra: '18h 36m 56s', dec: '+38° 47\' 01"', mag: 0.03, class: 'A0Va' },
    { name: 'Capella', ra: '05h 16m 41s', dec: '+45° 59\' 52"', mag: 0.08, class: 'G3III' },
    { name: 'Rigel', ra: '05h 14m 32s', dec: '-08° 12\' 05"', mag: 0.13, class: 'B8Ia' },
    { name: 'Procyon', ra: '07h 39m 18s', dec: '+05° 13\' 29"', mag: 0.34, class: 'F5IV-V' },
    { name: 'Betelgeuse', ra: '05h 55m 10s', dec: '+07° 24\' 25"', mag: 0.42, class: 'M1-M2Ia-ab' },
    { name: 'Achernar', ra: '01h 37m 42s', dec: '-57° 14\' 12"', mag: 0.46, class: 'B6Vep' },
];

const SATELLITES = [
    { name: 'ISS (ZARYA)', catalog: '25544', tle: ['1 25544U 98067A   24040.82062361  .00016717  00000-0  30159-3 0  9999', '2 25544  51.6415 162.1557 0004353  70.8524  42.2215 15.49547121438257'] },
    { name: 'STARLINK-1007', catalog: '44713', tle: ['1 44713U 19074A   24040.54221123  .00001234  00000-0  12345-3 0  9999', '2 44713  53.0543  12.3456 0001234  45.6789 123.4567 15.06423123456789'] },
    { name: 'LUNAR GATEWAY (SIM)', catalog: '99999', tle: ['1 99999U 24001A   24040.00000000  .00000000  00000-0  00000-0 0  9999', '2 99999  25.0000  00.0000 0000000  00.0000   0.0000 12.00000000000000'] },
];

// --- Helper Functions ---

const encryptCommand = (command: string, key: string) => {
    return CryptoJS.AES.encrypt(command, key).toString();
};

const parseRA = (raStr: string) => {
    const parts = raStr.split(' ');
    const h = parseFloat(parts[0]);
    const m = parseFloat(parts[1]);
    const s = parseFloat(parts[2]);
    return (h + m / 60 + s / 3600) * 15; // to degrees
};

const parseDec = (decStr: string) => {
    const parts = decStr.split(' ');
    const sign = parts[0].startsWith('-') ? -1 : 1;
    const d = Math.abs(parseFloat(parts[0].replace(/[^0-9.]/g, '')));
    const m = parseFloat(parts[1].replace(/[^0-9.]/g, ''));
    const s = parseFloat(parts[2].replace(/[^0-9.]/g, ''));
    return sign * (d + m / 60 + s / 3600);
};

// --- Sub-Components ---

const Earth = () => {
    return (
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
            <mesh scale={[1.01, 1.01, 1.01]}>
                <sphereGeometry args={[5, 64, 64]} />
                <meshPhongMaterial
                    color="#3b82f6"
                    transparent
                    opacity={0.1}
                    wireframe
                />
            </mesh>
            <gridHelper args={[100, 50, 0x3b82f6, 0x1e293b]} rotation={[Math.PI / 2, 0, 0]} />
        </group>
    );
};

const SatelliteModel = ({ position, rotation, isVerified, isScanning }: { position: [number, number, number], rotation: [number, number, number], isVerified: boolean, isScanning: boolean }) => {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            if (isScanning) {
                meshRef.current.rotation.y += 0.05;
            }
        }
    });

    return (
        <group position={position} rotation={rotation}>
            {/* Satellite Body */}
            <mesh ref={meshRef}>
                <boxGeometry args={[0.5, 0.5, 0.8]} />
                <meshStandardMaterial color={isVerified ? "#4ade80" : "#94a3b8"} metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Solar Panels */}
            <mesh position={[0.6, 0, 0]}>
                <boxGeometry args={[0.8, 0.4, 0.05]} />
                <meshStandardMaterial color="#3b82f6" emissive="#1e3a8a" emissiveIntensity={0.5} />
            </mesh>
            <mesh position={[-0.6, 0, 0]}>
                <boxGeometry args={[0.8, 0.4, 0.05]} />
                <meshStandardMaterial color="#3b82f6" emissive="#1e3a8a" emissiveIntensity={0.5} />
            </mesh>
            {/* Star Tracker FOV Cone */}
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
            {isTarget && (
                <mesh scale={[1.5, 1.5, 1.5]}>
                    <sphereGeometry args={[0.6, 16, 16]} />
                    <meshBasicMaterial color="#fbbf24" transparent opacity={0.2} />
                </mesh>
            )}
            <Html center position={[0, -1, 0]}>
                <div className={`text-[10px] font-mono px-2 py-0.5 rounded whitespace-nowrap ${isTarget ? 'text-yellow-400 bg-black/60 border border-yellow-500/30' : 'text-white/40'}`}>
                    {name}
                </div>
            </Html>
        </group>
    );
};
// --- Main Page Component ---

const B2BSimulator = () => {
    const navigate = useNavigate();
    const [isB2C, setIsB2C] = useState(false);
    const [selectedStar, setSelectedStar] = useState(GAIA_STARS[0]);
    const [selectedSat, setSelectedSat] = useState(SATELLITES[0]);
    const [missionCommand, setMissionCommand] = useState('Deploy solar sail');
    const [memoryTitle, setMemoryTitle] = useState('First Steps on the Moon');
    const [unlockWindow, setUnlockWindow] = useState('2026-02-08T20:00');
    const [isSimulating, setIsSimulating] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const [status, setStatus] = useState<'idle' | 'scanning' | 'verified' | 'failed'>('idle');
    const [satPosition, setSatPosition] = useState<[number, number, number]>([10, 0, 0]);
    const [satRotation, setSatRotation] = useState<[number, number, number]>([0, 0, 0]);

    const addLog = (msg: string) => {
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 50));
    };

    const handleStartSim = () => {
        setIsSimulating(true);
        setStatus('scanning');
        setLogs([]);
        addLog('Initialization process started...');
        addLog(`Targeting star: ${selectedStar.name} (RA: ${selectedStar.ra}, Dec: ${selectedStar.dec})`);

        const commandToEncrypt = isB2C ? `Memory Unlock: ${memoryTitle}` : missionCommand;
        const ciphertext = encryptCommand(commandToEncrypt, 'starhold-secret-key-2026');
        addLog(`Command encrypted: ${ciphertext.substring(0, 20)}...`);

        // Simulate flow
        setTimeout(() => {
            addLog(`Connecting to NORAD CATNR ${selectedSat.catalog}...`);
            addLog(`Satellite: ${selectedSat.name}`);
        }, 1000);

        setTimeout(() => {
            addLog('Star tracker acquisition in progress (6° FOV)...');
            addLog('Analyzing Gaia DR3 spectral signatures...');
        }, 2500);

        setTimeout(() => {
            const success = Math.random() > 0.2; // 80% success for demo
            if (success) {
                setStatus('verified');
                addLog('✓ Star acquired: Match confidence 99.4%');
                addLog(`✓ Magnitude match: ${selectedStar.mag} vs predicted (±0.02)`);
                addLog('✓ HMAC-SHA256 verified');
                addLog(`✓ ${isB2C ? 'MEMORY UNLOCKED' : 'COMMAND UNLOCKED'}: "${commandToEncrypt}"`);
                new Tone.PolySynth().toDestination().triggerAttackRelease(["C4", "E4", "G4"], "8n");
            } else {
                setStatus('failed');
                addLog('✗ CONDITIONS NOT MET: Attitude drift detected');
                addLog('✗ Authentication failure: Signal out of window');
                new Tone.Synth().toDestination().triggerAttackRelease("C2", "4n");
            }
            setIsSimulating(false);
        }, 5000);
    };

    // Satellite orbit calculation
    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            try {
                const satrec = satellite.twoline2satrec(selectedSat.tle[0], selectedSat.tle[1]);
                const positionAndVelocity = satellite.propagate(satrec, now);
                const positionEci = positionAndVelocity.position;
                if (typeof positionEci !== 'boolean' && positionEci) {
                    // Scale for visualization
                    const scale = 0.001;
                    setSatPosition([positionEci.x * scale, positionEci.z * scale, positionEci.y * scale]);
                    setSatRotation([now.getTime() * 0.0001, now.getTime() * 0.0002, 0]);
                }
            } catch (e) {
                // Fallback for simulation
                const t = now.getTime() * 0.0005;
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
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-white/60 hover:text-white hover:bg-white/10 gap-2 backdrop-blur-md border border-white/5"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Mission Page
                    </Button>
                </div>

                <main className="flex-1 flex flex-col md:flex-row p-4 pt-20 gap-4 overflow-hidden">
                    {/* Left Panel: Inputs */}
                    <Card className="flex-none w-full md:w-80 bg-black/40 border-cosmic-blue/20 p-4 space-y-6 flex flex-col backdrop-blur-md">
                        <div className="flex items-center gap-2 pb-2 border-b border-cosmic-blue/20">
                            <Settings className="w-5 h-5 text-cosmic-blue" />
                            <h2 className="font-mono text-sm font-bold uppercase tracking-tighter">Input Panel</h2>
                        </div>

                        <ScrollArea className="flex-1 pr-2">
                            <div className="space-y-6 pb-4">
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground flex items-center gap-2">
                                        <Eye className="w-3 h-3" /> STAR TARGET (GAIA DR3)
                                    </Label>
                                    <Select onValueChange={(val) => setSelectedStar(GAIA_STARS.find(s => s.name === val) || GAIA_STARS[0])}>
                                        <SelectTrigger className="bg-slate-900/50 border-cosmic-blue/30">
                                            <SelectValue placeholder="Select star" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-950 border-cosmic-blue/30">
                                            {GAIA_STARS.map(star => (
                                                <SelectItem key={star.name} value={star.name}>
                                                    {star.name} ({star.mag})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-muted-foreground bg-black/40 p-2 rounded border border-white/5">
                                        <div>RA: {selectedStar.ra}</div>
                                        <div>Dec: {selectedStar.dec}</div>
                                        <div>Mag: {selectedStar.mag}</div>
                                        <div>Class: {selectedStar.class}</div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground flex items-center gap-2">
                                        <Satellite className="w-3 h-3" /> SATELLITE TLE
                                    </Label>
                                    <Select onValueChange={(val) => setSelectedSat(SATELLITES.find(s => s.name === val) || SATELLITES[0])}>
                                        <SelectTrigger className="bg-slate-900/50 border-cosmic-blue/30">
                                            <SelectValue placeholder="Select satellite" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-950 border-cosmic-blue/30">
                                            {SATELLITES.map(sat => (
                                                <SelectItem key={sat.catalog} value={sat.name}>{sat.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground flex items-center gap-2">
                                        {isB2C ? <Eye className="w-3 h-3" /> : <Lock className="w-3 h-3" />} {isB2C ? 'MEMORY TITLE' : 'MISSION COMMAND'}
                                    </Label>
                                    <Input
                                        value={isB2C ? memoryTitle : missionCommand}
                                        onChange={(e) => isB2C ? setMemoryTitle(e.target.value) : setMissionCommand(e.target.value)}
                                        className="bg-slate-900/50 border-cosmic-blue/30 font-mono text-sm"
                                    />
                                </div>


                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground flex items-center gap-2">
                                        <Zap className="w-3 h-3" /> UNLOCK WINDOW
                                    </Label>
                                    <Input
                                        type="datetime-local"
                                        value={unlockWindow}
                                        onChange={(e) => setUnlockWindow(e.target.value)}
                                        className="bg-slate-900/50 border-cosmic-blue/30"
                                    />
                                </div>
                            </div>
                        </ScrollArea>

                        <Button
                            className={`w-full ${isB2C ? 'bg-cosmic-purple hover:bg-cosmic-purple/80' : 'bg-cosmic-blue hover:bg-cosmic-blue/80'} text-white font-bold py-6 group`}
                            onClick={handleStartSim}
                            disabled={isSimulating}
                        >
                            <Radio className={`w-5 h-5 mr-2 ${isSimulating ? 'animate-ping' : ''}`} />
                            {isSimulating ? 'SCANNING SKY...' : isB2C ? 'UNLOCK MEMORY' : 'TRIGGER AUTH'}
                        </Button>

                        <Button
                            variant="outline"
                            className="w-full border-white/10 text-white/60 hover:text-white"
                            onClick={() => setIsB2C(!isB2C)}
                        >
                            <Share2 className="w-4 h-4 mr-2" />
                            Switch to {isB2C ? 'B2B Mission' : 'B2C Vault'}
                        </Button>
                    </Card>

                    {/* Center Panel: 3D Vis */}
                    <div className="flex-1 relative rounded-2xl overflow-hidden border border-cosmic-blue/20 bg-black/60 shadow-2xl">
                        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                            <div className="px-3 py-1.5 rounded-full bg-black/60 border border-cosmic-blue/40 flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${status === 'scanning' ? 'bg-blue-500 animate-pulse' : status === 'verified' ? 'bg-green-500' : status === 'failed' ? 'bg-red-500' : 'bg-slate-500'}`} />
                                <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-cosmic-blue">
                                    System: {status.toUpperCase()}
                                </span>
                            </div>
                            <div className="px-3 py-1.5 rounded-full bg-black/60 border border-white/10 flex items-center gap-2 text-[10px] font-mono text-white/60">
                                <Globe className="w-3 h-3" /> {satPosition[0].toFixed(2)}, {satPosition[1].toFixed(2)}, {satPosition[2].toFixed(2)}
                            </div>
                        </div>

                        <div className="absolute top-4 right-4 z-20 flex gap-2">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline" size="icon" className="w-8 h-8 rounded-full border-white/10 bg-black/40"><Info className="w-4 h-4" /></Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-slate-900 border-cosmic-blue/30 text-[10px] max-w-xs">
                                        Leverages Ball Aerospace 300S tracker specs and Gaia DR3 astrometric catalog data.
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <Button variant="outline" size="icon" className="w-8 h-8 rounded-full border-white/10 bg-black/40" onClick={() => toast.info("Verification log downloaded data generated.")}><Download className="w-4 h-4" /></Button>
                        </div>

                        {/* Overlays */}
                        {status === 'verified' && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                                <div className="w-[80%] h-[80%] border-2 border-green-500/50 rounded-lg animate-pulse flex items-center justify-center">
                                    <div className="font-serif text-6xl md:text-8xl text-green-500/20 italic select-none">STAR VERIFIED</div>
                                </div>
                            </div>
                        )}
                        {status === 'failed' && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none group">
                                <div className="w-[80%] h-[80%] border-2 border-red-500/50 rounded-lg animate-shake flex items-center justify-center">
                                    <div className="font-serif text-6xl md:text-8xl text-red-500/20 italic select-none">WINDOW FAILED</div>
                                </div>
                            </div>
                        )}

                        <Canvas>
                            <PerspectiveCamera makeDefault position={[15, 15, 30]} fov={45} />
                            <OrbitControls enableDamping dampingFactor={0.05} />
                            <ambientLight intensity={0.5} />
                            <pointLight position={[100, 100, 100]} intensity={1.5} />

                            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                            <Earth />

                            <SatelliteModel position={satPosition} rotation={satRotation} isVerified={status === 'verified'} isScanning={status === 'scanning'} />

                            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                                {GAIA_STARS.map((star, idx) => (
                                    <PulsingStar
                                        key={star.name}
                                        position={[
                                            (idx % 3 - 1) * 15,
                                            (Math.floor(idx / 3) % 3 - 1) * 15,
                                            -(idx * 5) - 30
                                        ]}
                                        name={star.name}
                                        isTarget={selectedStar.name === star.name}
                                    />
                                ))}
                            </Float>
                        </Canvas>

                        <div className="absolute bottom-4 left-4 right-4 z-20 h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className={`h-full bg-cosmic-blue transition-all duration-300 ${isSimulating ? 'w-full duration-[5000ms]' : 'w-0'}`} />
                        </div>
                    </div>

                    {/* Right Panel: Logs */}
                    <Card className="flex-none w-full md:w-80 bg-black/40 border-cosmic-blue/20 p-4 space-y-4 flex flex-col backdrop-blur-md">
                        <div className="flex items-center gap-2 pb-2 border-b border-cosmic-blue/20">
                            <Terminal className="w-5 h-5 text-cosmic-blue" />
                            <h2 className="font-mono text-sm font-bold uppercase tracking-tighter">Status Log</h2>
                        </div>

                        <ScrollArea className="flex-1 bg-black/10 rounded p-4 border border-white/5 font-mono text-[11px]">
                            <div className="space-y-2">
                                {logs.length === 0 ? (
                                    <div className="text-muted-foreground italic">Awaiting simulation trigger...</div>
                                ) : (
                                    logs.map((log, i) => {
                                        const isSuccess = log.includes('✓');
                                        const isError = log.includes('✗');
                                        return (
                                            <div key={i} className={`flex gap-2 ${isSuccess ? 'text-green-400' : isError ? 'text-red-400' : 'text-cyan-400/80'}`}>
                                                <span className="flex-none text-white/20 select-none">[{logs.length - i}]</span>
                                                <span>{log.split('] ')[1] || log}</span>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </ScrollArea>

                        <div className="space-y-3 pt-2">
                            <div className="flex justify-between text-[10px] font-mono">
                                <span className="text-muted-foreground">LATENCY</span>
                                <span className="text-cosmic-blue">87ms &lt; CCSDS AUTH ✓</span>
                            </div>
                            <div className="flex justify-between text-[10px] font-mono">
                                <span className="text-muted-foreground">RELIABILITY</span>
                                <span className="text-green-500">98.7% SUCCESS RATE</span>
                            </div>
                            <div className="flex justify-between text-[10px] font-mono border-t border-white/5 pt-2">
                                <span className="text-muted-foreground">ORBITAL EPOCH</span>
                                <span className="text-white/60">{new Date().toISOString().substring(0, 10)}</span>
                            </div>
                        </div>
                    </Card>
                </main>
            </div>
        </div>
    );
};

export default B2BSimulator;
