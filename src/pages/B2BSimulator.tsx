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

interface CelestialStar {
    id: string;
    name: string;
    ra: number; // degrees
    dec: number; // degrees
    mag: number;
    class?: string;
    position: [number, number, number];
}

const STAR_SPHERE_RADIUS = 300;
const BRIGHTNESS_THRESHOLD = 5.5; // Visible magnitude threshold for demo performance

const SATELLITES = [
    { name: 'ISS (ZARYA)', catalog: '25544', tle: ['1 25544U 98067A   24040.82062361  .00016717  00000-0  30159-3 0  9999', '2 25544  51.6415 162.1557 0004353  70.8524  42.2215 15.49547121438257'] },
    { name: 'STARLINK-1007', catalog: '44713', tle: ['1 44713U 19074A   24040.54221123  .00001234  00000-0  12345-3 0  9999', '2 44713  53.0543  12.3456 0001234  45.6789 123.4567 15.06423123456789'] },
    { name: 'LUNAR GATEWAY (SIM)', catalog: '99999', tle: ['1 99999U 24001A   24040.00000000  .00000000  00000-0  00000-0 0  9999', '2 99999  25.0000  00.0000 0000000  00.0000   0.0000 12.00000000000000'] },
];

/**
 * Famous stars with coordinates for user-friendly referencing.
 */
const MAJOR_STARS = [
    { name: 'Sirius', ra: 101.287, dec: -16.716, mag: -1.46 },
    { name: 'Canopus', ra: 95.987, dec: -52.695, mag: -0.74 },
    { name: 'Arcturus', ra: 213.915, dec: 19.182, mag: -0.05 },
    { name: 'Vega', ra: 279.234, dec: 38.784, mag: 0.03 },
    { name: 'Capella', ra: 79.172, dec: 45.998, mag: 0.08 },
    { name: 'Rigel', ra: 78.634, dec: -8.201, mag: 0.13 },
    { name: 'Procyon', ra: 114.825, dec: 5.225, mag: 0.34 },
    { name: 'Betelgeuse', ra: 88.792, dec: 7.407, mag: 0.42 },
    { name: 'Achernar', ra: 24.428, dec: -57.236, mag: 0.46 },
    { name: 'Hadar', ra: 210.954, dec: -60.373, mag: 0.61 },
    { name: 'Altair', ra: 297.695, dec: 8.868, mag: 0.77 },
    { name: 'Aldebaran', ra: 68.98, dec: 16.509, mag: 0.85 },
    { name: 'Antares', ra: 247.351, dec: -26.432, mag: 1.05 },
    { name: 'Spica', ra: 201.298, dec: -11.161, mag: 1.04 },
];


const MISSION_COMMANDS = [
    { id: 'DEPLOY_ARRAYS', label: 'Deploy Solar Arrays', icon: Zap },
    { id: 'START_DOWNLINK', label: 'Initiate High-Speed Downlink', icon: Radio },
    { id: 'CALIBRATE_SENSOR', label: 'Calibrate Star Tracker', icon: Settings },
    { id: 'EMERGENCY_MODE', label: 'Execute Emergency Beacon', icon: Shield },
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

const raDecToXyz = (ra: number, dec: number, radius: number): [number, number, number] => {
    const raRad = (ra) * (Math.PI / 180);
    const decRad = (dec) * (Math.PI / 180);

    // RA/Dec to XYZ conversion (Celestial coordinates)
    const x = radius * Math.cos(decRad) * Math.cos(raRad);
    const y = radius * Math.cos(decRad) * Math.sin(raRad);
    const z = radius * Math.sin(decRad);

    return [x, z, -y]; // Swapping axes for proper 3D orientation (Y-up)
};

const fetchGaiaStars = async (): Promise<CelestialStar[]> => {
    // Proximity matching function to identify famous stars in the dataset
    const identifyStar = (ra: number, dec: number, id: string) => {
        const match = MAJOR_STARS.find(s =>
            Math.abs(s.ra - ra) < 0.2 && Math.abs(s.dec - dec) < 0.2
        );
        return match ? match.name : `HIP ${id.substring(0, 5)}`;
    };

    const query = `
        SELECT ra, dec, phot_g_mean_mag, source_id 
        FROM gaiadr3.gaia_source 
        WHERE phot_g_mean_mag < ${BRIGHTNESS_THRESHOLD} 
        ORDER BY phot_g_mean_mag ASC
    `;

    const url = `https://gea.esac.esa.int/tap-server/tap/sync?REQUEST=doQuery&LANG=ADQL&FORMAT=json&QUERY=${encodeURIComponent(query)}`;

    try {
        // We use a shorter timeout and handle errors gracefully for CORS issues
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        const data = await response.json();

        if (data && data.data) {
            return data.data.map((row: any[]) => ({
                id: row[3].toString(),
                name: identifyStar(row[0], row[1], row[3].toString()),
                ra: row[0],
                dec: row[1],
                mag: row[2],
                position: raDecToXyz(row[0], row[1], STAR_SPHERE_RADIUS)
            }));
        }
    } catch (error) {
        console.warn("Gaia API Error or CORS block. Using high-fidelity star fallback.");
    }

    // Fallback: Populate with named stars if API fails
    return MAJOR_STARS.map(s => ({
        id: `MOCK-${s.name.toUpperCase()}`,
        name: s.name,
        ra: s.ra,
        dec: s.dec,
        mag: s.mag,
        position: raDecToXyz(s.ra, s.dec, STAR_SPHERE_RADIUS)
    }));
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
        </group>
    );
};

const SatelliteModel = ({
    position, rotation, isVerified, isScanning,
    panelsDeployed, isTransmitting, isEmergency
}: {
    position: [number, number, number],
    rotation: [number, number, number],
    isVerified: boolean,
    isScanning: boolean,
    panelsDeployed: boolean,
    isTransmitting: boolean,
    isEmergency: boolean
}) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const leftPanelRef = useRef<THREE.Group>(null);
    const rightPanelRef = useRef<THREE.Group>(null);
    const beamRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            if (isScanning) {
                meshRef.current.rotation.y += 0.05;
            }
        }

        // Animate panels
        if (leftPanelRef.current && rightPanelRef.current) {
            const targetX = panelsDeployed ? 0.6 : 0.25;
            const targetScaleX = panelsDeployed ? 1 : 0.1;

            leftPanelRef.current.position.x = THREE.MathUtils.lerp(leftPanelRef.current.position.x, -targetX, 0.1);
            rightPanelRef.current.position.x = THREE.MathUtils.lerp(rightPanelRef.current.position.x, targetX, 0.1);

            leftPanelRef.current.scale.x = THREE.MathUtils.lerp(leftPanelRef.current.scale.x, targetScaleX, 0.1);
            rightPanelRef.current.scale.x = THREE.MathUtils.lerp(rightPanelRef.current.scale.x, targetScaleX, 0.1);
        }

        // Animate beam
        if (beamRef.current) {
            if (isTransmitting) {
                beamRef.current.visible = true;
                beamRef.current.scale.y = THREE.MathUtils.lerp(beamRef.current.scale.y, 1, 0.1);
                beamRef.current.material.opacity = 0.5 + Math.sin(state.clock.elapsedTime * 10) * 0.2;
            } else {
                beamRef.current.scale.y = 0;
                beamRef.current.visible = false;
            }
        }
    });

    return (
        <group position={position} rotation={rotation}>
            {/* Satellite Body */}
            <mesh ref={meshRef}>
                <boxGeometry args={[0.5, 0.5, 0.8]} />
                <meshStandardMaterial
                    color={isEmergency ? "#ef4444" : isVerified ? "#4ade80" : "#94a3b8"}
                    emissive={isEmergency ? "#ef4444" : "#000000"}
                    emissiveIntensity={isEmergency ? 0.5 : 0}
                    metalness={0.8}
                    roughness={0.2}
                />
            </mesh>

            {/* Solar Panels (Animated) */}
            <group ref={leftPanelRef} position={[-0.25, 0, 0]}>
                <mesh>
                    <boxGeometry args={[0.8, 0.4, 0.05]} />
                    <meshStandardMaterial color="#3b82f6" emissive="#1e3a8a" emissiveIntensity={0.5} />
                </mesh>
            </group>
            <group ref={rightPanelRef} position={[0.25, 0, 0]}>
                <mesh>
                    <boxGeometry args={[0.8, 0.4, 0.05]} />
                    <meshStandardMaterial color="#3b82f6" emissive="#1e3a8a" emissiveIntensity={0.5} />
                </mesh>
            </group>

            {/* Transmission Beam */}
            <mesh ref={beamRef} position={[0, -5, 0]} rotation={[0, 0, 0]} visible={false}>
                <cylinderGeometry args={[0.02, 0.5, 10, 32]} />
                <meshBasicMaterial color="#00d4ff" transparent opacity={0.4} />
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
    const [selectedSat, setSelectedSat] = useState(SATELLITES[0]);
    const [memoryTitle, setMemoryTitle] = useState('First Steps on the Moon');
    const [unlockWindow, setUnlockWindow] = useState('2026-02-08T20:00');
    const [isSimulating, setIsSimulating] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const [status, setStatus] = useState<'idle' | 'scanning' | 'verified' | 'failed'>('idle');
    const [satPosition, setSatPosition] = useState<[number, number, number]>([10, 0, 0]);
    const [satRotation, setSatRotation] = useState<[number, number, number]>([0, 0, 0]);

    // Astrometric States
    const [stars, setStars] = useState<CelestialStar[]>([]);
    const [selectedStarObj, setSelectedStarObj] = useState<CelestialStar | null>(null);
    const [isLoadingStars, setIsLoadingStars] = useState(true);

    // Interactive Visual States
    const [selectedCommandId, setSelectedCommandId] = useState(MISSION_COMMANDS[0].id);
    const [panelsDeployed, setPanelsDeployed] = useState(false);
    const [isTransmitting, setIsTransmitting] = useState(false);
    const [isEmergency, setIsEmergency] = useState(false);

    // Scheduling States
    const [isWaiting, setIsWaiting] = useState(false);
    const [countdown, setCountdown] = useState<number | null>(null);

    const addLog = (msg: string) => {
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 50));
    };

    // Initialize stars on mount
    useEffect(() => {
        const initStars = async () => {
            addLog("Astrometric System initializing...");
            const data = await fetchGaiaStars();
            if (data.length > 0) {
                setStars(data);
                setSelectedStarObj(data[0]);
                addLog(`✓ Catalog Gaia DR3 Loaded: ${data.length} reference stars mapped.`);
            } else {
                addLog("⚠ Gaia API unreachable. Using fallback reference frame.");
                // Fallback would go here if needed, but for now we rely on API
            }
            setIsLoadingStars(false);
        };
        initStars();
    }, []);

    const handleStartSim = () => {
        const targetTime = new Date(unlockWindow).getTime();
        const now = new Date().getTime();
        const delay = targetTime - now;

        if (delay > 0) {
            setIsWaiting(true);
            setCountdown(Math.floor(delay / 1000));
            setLogs([]);
            addLog(`[SCHEDULED] Command queued for execution at ${new Date(targetTime).toLocaleTimeString()}`);
            addLog(`Waiting for unlock window (${Math.floor(delay / 1000)}s remaining)...`);

            const timer = setInterval(() => {
                setCountdown(prev => {
                    if (prev === null || prev <= 1) {
                        clearInterval(timer);
                        startExecution();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return;
        } else if (delay < -300000) { // 5 minute expiry window
            addLog('✗ AUTHENTICATION FAILED: Unlock window has expired.');
            setStatus('failed');
            toast.error("Command Window Expired");
            return;
        }

        startExecution();
    };

    const startExecution = () => {
        setIsWaiting(false);
        setCountdown(null);
        setIsSimulating(true);
        setStatus('scanning');
        setLogs([]);
        addLog('Initialization process started...');

        if (selectedStarObj) {
            addLog(`Targeting star: ${selectedStarObj.name} (Source: ${selectedStarObj.id})`);
            addLog(`Celestial Coords: RA ${selectedStarObj.ra.toFixed(4)}, Dec ${selectedStarObj.dec.toFixed(4)}`);
        }

        // Instant visual feedback for the selected command
        if (!isB2C) {
            // Reset all visual states first to ensure clean start for new command
            setPanelsDeployed(false);
            setIsTransmitting(false);
            setIsEmergency(false);

            if (selectedCommandId === 'DEPLOY_ARRAYS') setPanelsDeployed(true);
            if (selectedCommandId === 'START_DOWNLINK') setIsTransmitting(true);
            if (selectedCommandId === 'EMERGENCY_MODE') setIsEmergency(true);
        }

        const commandToEncrypt = isB2C ? `Memory Unlock: ${memoryTitle}` : MISSION_COMMANDS.find(c => c.id === selectedCommandId)?.label || '';
        const ciphertext = encryptCommand(commandToEncrypt, 'starhold-secret-key-2026');
        addLog(`Command encrypted: ${ciphertext.substring(0, 20)}...`);

        // Faster simulation for "instant" feel
        setTimeout(() => {
            addLog(`Connecting to NORAD CATNR ${selectedSat.catalog}...`);
            addLog(`Satellite: ${selectedSat.name}`);
        }, 500);

        setTimeout(() => {
            addLog('Star tracker acquisition in progress (6° FOV)...');
            addLog('Analyzing Gaia DR3 spectral signatures...');
        }, 1200);

        setTimeout(() => {
            const success = Math.random() > 0.1; // 90% success
            if (success) {
                setStatus('verified');
                addLog('✓ Star acquired: Match confidence 99.4%');
                if (selectedStarObj) {
                    addLog(`✓ Magnitude match: ${selectedStarObj.mag.toFixed(2)} vs predicted (±0.02)`);
                }
                addLog('✓ HMAC-SHA256 verified');
                addLog(`✓ ${isB2C ? 'MEMORY UNLOCKED' : 'COMMAND EXECUTED'}: "${commandToEncrypt}"`);
                new Tone.PolySynth().toDestination().triggerAttackRelease(["C4", "E4", "G4"], "8n");
            } else {
                setStatus('failed');
                addLog('✗ CONDITIONS NOT MET: Attitude drift detected');
                addLog('✗ Authentication failure: Signal out of window');
                new Tone.Synth().toDestination().triggerAttackRelease("C2", "4n");
                // Reset visuals on failure
                setIsTransmitting(false);
                setIsEmergency(false);
            }
            setIsSimulating(false);
        }, 2500);
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
                                    <Select onValueChange={(val) => setSelectedStarObj(stars.find(s => s.id === val) || stars[0])} disabled={isLoadingStars}>
                                        <SelectTrigger className="bg-slate-900/50 border-cosmic-blue/30">
                                            <SelectValue placeholder={isLoadingStars ? "Mapping universe..." : "Select reference star"} />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-950 border-cosmic-blue/30 max-h-[300px]">
                                            {stars.map(star => (
                                                <SelectItem key={star.id} value={star.id}>
                                                    {star.name} (Mag: {star.mag?.toFixed(1)})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {selectedStarObj && (
                                        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-muted-foreground bg-black/40 p-2 rounded border border-white/5">
                                            <div>RA: {selectedStarObj.ra.toFixed(2)}°</div>
                                            <div>Dec: {selectedStarObj.dec.toFixed(2)}°</div>
                                            <div>Mag: {selectedStarObj.mag.toFixed(2)}</div>
                                            <div>Source: {selectedStarObj.id.substring(0, 8)}...</div>
                                        </div>
                                    )}
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
                                    {isB2C ? (
                                        <Input
                                            value={memoryTitle}
                                            onChange={(e) => setMemoryTitle(e.target.value)}
                                            className="bg-slate-900/50 border-cosmic-blue/30 font-mono text-sm"
                                        />
                                    ) : (
                                        <Select onValueChange={(val) => {
                                            setSelectedCommandId(val);
                                            // Optional: reset temporary visuals when switching command
                                            if (val !== 'START_DOWNLINK') setIsTransmitting(false);
                                            if (val !== 'EMERGENCY_MODE') setIsEmergency(false);
                                        }} defaultValue={selectedCommandId}>
                                            <SelectTrigger className="bg-slate-900/50 border-cosmic-blue/30 h-10">
                                                <SelectValue placeholder="Select command" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-950 border-cosmic-blue/30">
                                                {MISSION_COMMANDS.map(cmd => (
                                                    <SelectItem key={cmd.id} value={cmd.id} className="cursor-pointer">
                                                        <div className="flex items-center gap-2">
                                                            <cmd.icon className="w-3.5 h-3.5 text-cosmic-blue" />
                                                            <span>{cmd.label}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
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
                            disabled={isSimulating || isWaiting}
                        >
                            <Radio className={`w-5 h-5 mr-2 ${isSimulating || isWaiting ? 'animate-ping' : ''}`} />
                            {isWaiting ? `PENDING (${countdown}s)` : isSimulating ? 'SCANNING SKY...' : isB2C ? 'UNLOCK MEMORY' : 'TRIGGER AUTH'}
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
                                <div className={`w-2 h-2 rounded-full ${isWaiting ? 'bg-yellow-500 animate-pulse' : status === 'scanning' ? 'bg-blue-500 animate-pulse' : status === 'verified' ? 'bg-green-500' : status === 'failed' ? 'bg-red-500' : 'bg-slate-500'}`} />
                                <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-cosmic-blue">
                                    System: {isWaiting ? 'PENDING' : status.toUpperCase()}
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

                            <SatelliteModel
                                position={satPosition}
                                rotation={satRotation}
                                isVerified={status === 'verified'}
                                isScanning={status === 'scanning'}
                                panelsDeployed={panelsDeployed}
                                isTransmitting={isTransmitting}
                                isEmergency={isEmergency}
                            />

                            <group>
                                {stars.map((star) => (
                                    <PulsingStar
                                        key={star.id}
                                        position={star.position}
                                        name={star.name}
                                        isTarget={selectedStarObj?.id === star.id}
                                    />
                                ))}
                            </group>
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
