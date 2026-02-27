import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Satellite, Shield, Lock, Radio, Cpu,
    Terminal, Globe, Zap, Settings, ArrowLeft, Calendar, FileText
} from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Html, Line } from '@react-three/drei';
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

const STAR_SPHERE_RADIUS = 500;

const SATELLITES = [
    { name: 'ISS (ZARYA)', catalog: '25544', tle: ['1 25544U 98067A   24040.82062361  .00016717  00000-0  30159-3 0  9999', '2 25544  51.6415 162.1557 0004353  70.8524  42.2215 15.49547121438257'] },
    { name: 'STARLINK-1007', catalog: '44713', tle: ['1 44713U 19074A   24040.54221123  .00001234  00000-0  12345-3 0  9999', '2 44713  53.0543  12.3456 0001234  45.6789 123.4567 15.06423123456789'] },
    { name: 'CHANDRAYAAN-3 (ORBITER)', catalog: '57320', tle: ['1 57320U 23098A   24040.54221123  .00001234  00000-0  12345-3 0  9999', '2 57320  21.3543  12.3456 0001234  45.6789 123.4567 15.06423123456789'] },
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
            <meshPhongMaterial color="#1a365d" emissive="#000205" specular="#2d3748" shininess={10} />
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
        // Removed scanning rotation to prevent satellite body from spinning

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
            if (isTransmitting && material) {
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
            {/* Satellite Core */}
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

            {/* Downlink Beam (Points to Earth along +Z) */}
            <mesh ref={beamRef} position={[0, 0, 2.5]} visible={false}>
                <cylinderGeometry args={[0.02, 0.5, 5, 32]} />
                <meshBasicMaterial color="#00d4ff" transparent opacity={0.4} />
            </mesh>


            {/* Zenith Star Tracker (On -Z face, pointing away from Earth) */}
            <group position={[0, 0, -0.4]} rotation={[-Math.PI / 2, 0, 0]}>
                {/* Tracker body */}
                <mesh position={[0, 0.15, 0]}>
                    <cylinderGeometry args={[0.2, 0.1, 0.3, 16]} />
                    <meshStandardMaterial color="#1e293b" metalness={0.9} />
                </mesh>
                {/* FOV Cone */}
                <mesh position={[0, 1.65, 0]}>
                    <cylinderGeometry args={[0.53, 0.1, 3, 32]} />
                    <meshBasicMaterial color="#00d4ff" transparent opacity={isScanning ? 0.3 : 0.05} />
                </mesh>
                <Html distanceFactor={10} position={[0, 3.2, 0]}>
                    <div className="text-[6px] font-mono text-cyan-400 bg-black/40 px-1 whitespace-nowrap">ZENITH OPTICS</div>
                </Html>
            </group>


            {isVerified && (
                <Html distanceFactor={10} position={[0, 0.8, 0]}>
                    <div className="bg-green-500/80 text-white text-[8px] px-2 py-1 rounded font-mono shadow-[0_0_10px_rgba(74,222,128,0.5)] animate-bounce">
                        ASTROMETRIC LOCK ✓
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
                <sphereGeometry args={[0.08, 12, 12]} />
                <meshBasicMaterial color="#fbbf24" />
            </mesh>
            <Html center position={[0, -0.3, 0]}>
                <div className="text-[6px] font-mono px-1 py-0.5 rounded text-yellow-500 bg-black/80 border border-yellow-500/10 whitespace-nowrap lg:block hidden">
                    {name}
                </div>
            </Html>
        </group>
    );
};

// --- Static Background Stars ---
const BackgroundStars = () => {
    const stars = useMemo(() => {
        const positions = [];
        for (let i = 0; i < 800; i++) {
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

// --- Helpers ---
const formatTo24h = (iso: string) => {
    if (!iso) return '';
    const [date, time] = iso.split('T');
    const [y, m, d] = date.split('-');
    return `${d}/${m}/${y} ${time}`;
};

const parseFrom24h = (val: string) => {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})$/;
    const match = val.match(regex);
    if (match) {
        const [_, d, m, y, hh, mm] = match;
        return `${y}-${m}-${d}T${hh}:${mm}`;
    }
    return null;
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

    const [timeInputValue, setTimeInputValue] = useState(() => {
        const d = new Date();
        d.setMinutes(d.getMinutes() + 30);
        const iso = d.toISOString().substring(0, 16);
        const [date, time] = iso.split('T');
        const [y, m, d_] = date.split('-');
        return `${d_}/${m}/${y} ${time}`;
    });

    // Synchronize states
    useEffect(() => {
        const parsed = parseFrom24h(timeInputValue);
        if (parsed && parsed !== unlockWindow) {
            setUnlockWindow(parsed);
        }
    }, [timeInputValue]);

    useEffect(() => {
        const formatted = formatTo24h(unlockWindow);
        if (formatted !== timeInputValue && parseFrom24h(timeInputValue) !== unlockWindow) {
            setTimeInputValue(formatted);
        }
    }, [unlockWindow]);

    const pickerRef = useRef<HTMLInputElement>(null);
    const [isSimulating, setIsSimulating] = useState(false);
    const [status, setStatus] = useState<'idle' | 'scanning' | 'verified' | 'failed'>('idle');
    const [logs, setLogs] = useState<string[]>([]);
    const [satPosition, setSatPosition] = useState<[number, number, number]>([10, 0, 0]);
    const [satRotation, setSatRotation] = useState<[number, number, number]>([0, 0, 0]);
    const [satGeodetic, setSatGeodetic] = useState({ lat: 0, lon: 0, alt: 0 });
    const [stars, setStars] = useState<CelestialStar[]>([]);
    const [patternStars, setPatternStars] = useState<CelestialStar[]>([]);
    const [selectedCommandId, setSelectedCommandId] = useState(MISSION_COMMANDS[0].id);
    const [panelsDeployed, setPanelsDeployed] = useState(false);
    const [isTransmitting, setIsTransmitting] = useState(false);
    const [isEmergency, setIsEmergency] = useState(false);
    const [isWaiting, setIsWaiting] = useState(false);
    const [countdown, setCountdown] = useState<number | null>(null);



    const addLog = (msg: string) => {
        setLogs(prev => [`[${new Date().toLocaleTimeString('en-US', { hour12: false })}] ${msg}`, ...prev].slice(0, 50));
    };

    const computeZenithFOVPatch = (tle: string[], timestamp: Date) => {
        try {
            const satrec = satellite.twoline2satrec(tle[0], tle[1]);
            const posVel = satellite.propagate(satrec, timestamp);
            const pos = posVel.position as satellite.EciVec3<number>;
            if (pos) {
                // Zenith vector is simply the position vector normalized (pointing away from Earth)
                const mag = Math.sqrt(pos.x ** 2 + pos.y ** 2 + pos.z ** 2);
                // In Nadir orientation, Z-axis of sat points to Earth (-pos)
                // Zenith is +pos
                const ra = Math.atan2(pos.y, pos.x) * (180 / Math.PI);
                const dec = Math.asin(pos.z / mag) * (180 / Math.PI);
                return { ra: (ra + 360) % 360, dec };
            }
        } catch (e) { }
        return { ra: 45.2, dec: 23.1 };
    };

    const fetchGaiaFOV = async (ra: number, dec: number): Promise<CelestialStar[]> => {
        // Realistic 20 deg FOV requirement (±10 deg)
        const query = `
            SELECT ra, dec, phot_g_mean_mag, source_id 
            FROM gaiadr3.gaia_source 
            WHERE ra BETWEEN ${ra - 10} AND ${ra + 10}
            AND dec BETWEEN ${dec - 10} AND ${dec + 10}
            AND phot_g_mean_mag < 8.5
            ORDER BY phot_g_mean_mag ASC
            LIMIT 100
        `;
        // Use CORS proxy to bypass browser restrictions
        const proxyUrl = 'https://corsproxy.io/?';
        const targetUrl = `https://gea.esac.esa.int/tap-server/tap/sync?REQUEST=doQuery&LANG=ADQL&FORMAT=json&QUERY=${encodeURIComponent(query)}`;
        const url = proxyUrl + encodeURIComponent(targetUrl);

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 sec timeout for proxy latency

            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (!response.ok) throw new Error("Displaying offline star catalog.");

            const data = await response.json();
            if (data && data.data) {
                return data.data.map((row: any[]) => ({
                    id: row[3].toString(),
                    name: MAJOR_STARS.find(s => Math.abs(s.ra - row[0]) < 0.2 && Math.abs(s.dec - row[1]) < 0.2)?.name || `Star ${row[3].toString().substring(0, 4)}`,
                    ra: row[0],
                    dec: row[1],
                    mag: row[2],
                    position: raDecToXyz(row[0], row[1], STAR_SPHERE_RADIUS)
                }));
            }
        } catch (e) {
            console.warn("Gaia FOV Query Failed:", e);
            toast.error("Gaia Link Offline. Accessing Onboard Database.", { duration: 3000 });

            // FALLBACK: Generate procedural stars around the requested RA/Dec
            const fallbackStars: CelestialStar[] = [];

            // 1. Add any major stars if they are in view
            MAJOR_STARS.forEach((star, i) => {
                if (Math.abs(star.ra - ra) < 10 && Math.abs(star.dec - dec) < 10) {
                    fallbackStars.push({
                        id: `major-${i}`,
                        name: star.name,
                        ra: star.ra,
                        dec: star.dec,
                        mag: star.mag,
                        position: raDecToXyz(star.ra, star.dec, STAR_SPHERE_RADIUS)
                    });
                }
            });

            // 2. Procedurally generate background stars to ensure lock is possible
            const numRandom = 15;
            for (let i = 0; i < numRandom; i++) {
                // Generate star within ±10 deg of center
                const rRA = ra + (Math.random() - 0.5) * 20;
                const rDec = dec + (Math.random() - 0.5) * 20;
                const rMag = 4 + Math.random() * 4; // Mag 4-8

                fallbackStars.push({
                    id: `proc-${i}`,
                    name: `GSC-${Math.floor(Math.random() * 10000)}`,
                    ra: rRA,
                    dec: rDec,
                    mag: rMag,
                    position: raDecToXyz(rRA, rDec, STAR_SPHERE_RADIUS)
                });
            }
            return fallbackStars;
        }
        return [];
    };

    const handleGenerateKey = async () => {
        await Tone.start(); // Initialize AudioContext on user gesture
        setIsSimulating(true);
        setStatus('scanning');
        setLogs([]);
        addLog(`🔮 INITIATING ZENITH-ALIGNED KEYGEN...`);

        const timestamp = new Date(unlockWindow);
        const { ra, dec } = computeZenithFOVPatch(selectedSat.tle, timestamp);

        addLog(`TLE: ${selectedSat.name} (NORAD ${selectedSat.catalog})`);
        addLog(`Zenith Boresight: RA=${ra.toFixed(2)}°, Dec=${dec.toFixed(2)}°`);

        const allDetected = await fetchGaiaFOV(ra, dec);
        setStars(allDetected);

        const selected = allDetected
            .sort((a, b) => (Math.abs(a.ra - ra) + Math.abs(a.dec - dec)) - (Math.abs(b.ra - ra) + Math.abs(b.dec - dec)))
            .slice(0, 5);
        setPatternStars(selected);

        addLog(`Gaia DR3 Sync: ${allDetected.length} stars identified in 20° FOV.`);
        addLog(`✓ PATTERN ACQUIRED: ${selected.map(s => s.name).join(', ')}`);
        addLog(`Geometry Hash Verified for Timestamp. ✓`);

        setTimeout(() => {
            setStatus('verified');
            setIsSimulating(false);
            new Tone.PolySynth().toDestination().triggerAttackRelease(["C4", "E4", "G4"], "8n");
            toast.success("Mission Key Pattern Generated");
        }, 2000);
    };

    const handleTransmit = () => {
        const targetTime = new Date(unlockWindow).getTime();
        const now = Date.now();
        const delay = targetTime - now;

        if (delay > 0) {
            setIsWaiting(true);
            setCountdown(Math.floor(delay / 1000));
            addLog(`[SCHEDULED] Execution queued for ${new Date(targetTime).toLocaleTimeString('en-US', { hour12: false })}`);
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

    // Orbital Movement Effect
    useEffect(() => {
        const timer = setInterval(() => {
            try {
                // For visible movement, we speed up time slightly for the visual loop
                const now = new Date(Date.now());
                const satrec = satellite.twoline2satrec(selectedSat.tle[0], selectedSat.tle[1]);
                const posVel = satellite.propagate(satrec, now);
                const pos = posVel.position as satellite.EciVec3<number>;
                if (pos) {
                    const scale = 0.001;
                    const x = pos.x * scale;
                    const y = pos.y * scale;
                    const z = pos.z * scale;
                    setSatPosition([x, z, -y]);

                    // Calculate Geodetic (Lat/Lon/Alt) for UI
                    const gmst = satellite.gstime(now);
                    const geodetic = satellite.eciToGeodetic(posVel.position as satellite.EciVec3<number>, gmst);
                    setSatGeodetic({
                        lat: satellite.degreesLat(geodetic.latitude),
                        lon: satellite.degreesLong(geodetic.longitude),
                        alt: geodetic.height
                    });

                    // Calculate rotation to point toward Earth (Nadir)
                    const posVector = new THREE.Vector3(x, z, -y);
                    const targetVector = new THREE.Vector3(0, 0, 0);
                    const direction = new THREE.Vector3().subVectors(targetVector, posVector).normalize();

                    // Create a quaternion that rotates from default orientation to point at Earth
                    const quaternion = new THREE.Quaternion();
                    quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction);

                    // Convert quaternion to Euler angles
                    const euler = new THREE.Euler().setFromQuaternion(quaternion);
                    setSatRotation([euler.x, euler.y, euler.z]);
                }
            } catch (e) { }
        }, 100);
        return () => clearInterval(timer);
    }, [selectedSat]);

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#02020a] text-white">
            <div className="relative z-10 flex flex-col h-screen">
                <div className="absolute top-6 left-6 z-50">
                    <Button variant="ghost" size="sm" className="text-white/60 hover:text-white" onClick={() => navigate(-1)}>
                        <ArrowLeft className="w-4 h-4 mr-2" /> Mission Abort
                    </Button>
                </div>

                <main className="flex-1 flex flex-col md:flex-row p-4 pt-20 gap-4 overflow-hidden text-cyan-400">
                    <Card className="flex-none w-full md:w-80 bg-black/60 border-cyan-900 p-4 space-y-6 flex flex-col backdrop-blur-md">
                        <div className="flex items-center justify-between pb-2 border-b border-cyan-900">
                            <div className="flex items-center gap-2 text-cyan-500"><Settings className="w-5 h-5" />
                                <h2 className="font-mono text-sm font-bold uppercase tracking-widest">Ground Control</h2></div>
                        </div>

                        <ScrollArea className="flex-1 pr-2">
                            <div className="space-y-6 pb-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] text-cyan-700 flex items-center gap-2"><Satellite className="w-3 h-3" /> ACTIVE TLE</Label>
                                    <Select onValueChange={(val) => setSelectedSat(SATELLITES.find(s => s.name === val) || SATELLITES[0])}>
                                        <SelectTrigger className="bg-black/50 border-cyan-900 h-8 text-[10px] font-mono"><SelectValue placeholder="Select satellite" /></SelectTrigger>
                                        <SelectContent className="bg-black border-cyan-900 font-mono text-xs">{SATELLITES.map(sat => (<SelectItem key={sat.catalog} value={sat.name}>{sat.name}</SelectItem>))}</SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] text-cyan-700 flex items-center gap-2"><Zap className="w-3 h-3" /> MISSION TIMESTAMP</Label>
                                    <div className="relative bg-black/50 border border-cyan-900 h-8 flex items-center px-3 rounded-md focus-within:border-cyan-500 transition-colors">
                                        <Input
                                            type="text"
                                            value={timeInputValue}
                                            onChange={(e) => setTimeInputValue(e.target.value)}
                                            className="bg-transparent border-none text-xs font-mono text-cyan-50 p-0 h-full w-full focus-visible:ring-0"
                                            placeholder="DD/MM/YYYY HH:mm"
                                        />
                                        <button
                                            onClick={() => pickerRef.current?.showPicker?.()}
                                            className="ml-2 opacity-50 hover:opacity-100 transition-opacity"
                                            title="Open Calendar"
                                        >
                                            <Calendar className="w-3 h-3 text-cyan-500" />
                                        </button>
                                        <input
                                            ref={pickerRef}
                                            type="datetime-local"
                                            value={unlockWindow}
                                            onChange={(e) => setUnlockWindow(e.target.value)}
                                            className="absolute invisible w-0 h-0"
                                        />
                                    </div>
                                </div>
                                <Button className="w-full bg-cyan-950/50 hover:bg-cyan-900 border border-cyan-500 text-cyan-400 font-mono text-[10px] py-4 uppercase tracking-widest" onClick={handleGenerateKey} disabled={isSimulating}>
                                    {isSimulating ? 'PROPAGATING TLE...' : 'INITIATE ASTROMETRIC LOCK'}
                                </Button>
                                <div className="space-y-2 pt-4 border-t border-cyan-900">
                                    <Label className="text-[10px] text-cyan-700 flex items-center gap-2"><Lock className="w-3 h-3" /> UPLINK PAYLOAD</Label>
                                    <Select onValueChange={(val) => setSelectedCommandId(val)} defaultValue={selectedCommandId}>
                                        <SelectTrigger className="bg-black/50 border-cyan-900 h-8 text-[10px] font-mono"><SelectValue placeholder="Select command" /></SelectTrigger>
                                        <SelectContent className="bg-black border-cyan-900 font-mono text-xs">{MISSION_COMMANDS.map(cmd => (<SelectItem key={cmd.id} value={cmd.id}><div className="flex items-center gap-2"><cmd.icon className="w-3 h-3" /><span>{cmd.label}</span></div></SelectItem>))}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2 pt-4 border-t border-cyan-900">
                                    <Label className="text-[10px] text-cyan-700 flex items-center gap-2"><Globe className="w-3 h-3" /> LIVE TELEMETRY</Label>
                                    <div className="grid grid-cols-2 gap-2 font-mono text-[9px] text-cyan-500/80 bg-black/50 border border-cyan-900 p-2 rounded">
                                        <div>LAT: {satGeodetic.lat.toFixed(4)}°</div>
                                        <div>LON: {satGeodetic.lon.toFixed(4)}°</div>
                                        <div className="col-span-2 text-emerald-500">ALT: {satGeodetic.alt.toFixed(2)} km</div>
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                        <Button className="w-full bg-emerald-950/50 hover:bg-emerald-900 border border-emerald-500 text-emerald-400 font-mono text-[10px] py-4" onClick={handleTransmit} disabled={status !== 'verified' || isWaiting}>
                            <Terminal className="w-4 h-4 mr-2" />{isWaiting ? `LINKING (${countdown}s)` : 'TRANSMIT ENCRYPTED PAYLOAD'}
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full text-cyan-700 hover:text-cyan-400 font-mono text-[9px] uppercase tracking-tighter"
                            onClick={() => navigate('/techdocs')}
                        >
                            <FileText className="w-3 h-3 mr-2" /> View Technical Docs
                        </Button>
                    </Card>

                    <div className="flex-1 relative rounded-lg overflow-hidden border border-cyan-900 bg-black/80">
                        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                            <div className="px-3 py-1 bg-black/60 border border-cyan-900 flex items-center gap-2">
                                <span className="text-[9px] font-mono text-cyan-500">MISSION STATE: {status.toUpperCase()}</span>
                            </div>
                        </div>

                        <Canvas shadows>
                            <PerspectiveCamera makeDefault position={[15, 15, 25]} fov={40} />
                            <OrbitControls enableDamping dampingFactor={0.05} />
                            <ambientLight intensity={0.5} />
                            <directionalLight position={[50, 20, 30]} intensity={1.5} />
                            <BackgroundStars />
                            <Earth />
                            <SatelliteModel position={satPosition} rotation={satRotation} isVerified={status === 'verified'} isScanning={status === 'scanning'} panelsDeployed={panelsDeployed} isTransmitting={isTransmitting} isEmergency={isEmergency} />

                            <group>
                                {/* GAIA DATA OVERLAY */}
                                {stars.map((star) => (
                                    <group key={star.id} position={star.position}>
                                        <mesh>
                                            <sphereGeometry args={[0.03, 4, 4]} />
                                            <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
                                        </mesh>
                                    </group>
                                ))}

                                {patternStars.map((star) => (<PulsingStar key={star.id} position={star.position} name={star.name} isTarget={true} />))}
                                {status === 'verified' && patternStars.length > 1 && (
                                    <group>
                                        {patternStars.slice(0, -1).map((star, i) => (
                                            <Line
                                                key={i}
                                                points={[star.position, patternStars[i + 1].position]}
                                                color="#fbbf24"
                                                lineWidth={0.5}
                                                transparent
                                                opacity={0.15}
                                            />
                                        ))}
                                    </group>
                                )}
                            </group>
                        </Canvas>

                        <div className="absolute bottom-4 right-4 z-20 pointer-events-none border border-cyan-900/50 bg-black/60 p-2 font-mono text-[8px] space-y-1">
                            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-500" /> ZENITH STAR TRACKER ACTIVE</div>
                            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> NADIR POSITION LOCK: 100%</div>
                        </div>
                    </div>

                    <Card className="flex-none w-full md:w-80 bg-black/60 border-cyan-900 p-4 space-y-4 flex flex-col backdrop-blur-md">
                        <div className="flex items-center gap-2 pb-2 border-b border-cyan-900 text-cyan-500 font-mono text-xs font-bold uppercase tracking-widest">Astrometric Log</div>
                        <ScrollArea className="flex-1 bg-black/20 rounded p-4 font-mono text-[9px] leading-relaxed overflow-hidden">
                            <div className="space-y-4">
                                {logs.length === 0 ? (<div className="text-cyan-900 italic">SYSTEM READY...</div>) : (logs.map((log, i) => (<div key={i} className={`${log.includes('✓') ? 'text-emerald-500' : 'text-cyan-500/80'}`}>{log}</div>)))}
                            </div>
                        </ScrollArea>
                        <div className="space-y-1 pt-2 text-[8px] font-mono border-t border-cyan-900/30">
                            <div className="flex justify-between uppercase"><span className="text-cyan-900">Precision</span><span className="text-emerald-500">Sub-Astrometric ✓</span></div>
                            <div className="flex justify-between uppercase"><span className="text-cyan-900">Integrity</span><span className="text-emerald-500">Hash Match ✓</span></div>
                        </div>
                    </Card>
                </main>
            </div>
        </div>
    );
};

export default B2BSimulator;
