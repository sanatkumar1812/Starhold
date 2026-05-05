import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Satellite, Shield, Lock, Radio, Cpu,
    Terminal, Globe, Zap, Settings, ArrowLeft, Calendar, FileText, Activity, Crosshair
} from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import * as satellite from 'satellite.js';
import { V2Layout } from '../layout/V2Layout';
import { ScrollReveal } from '@/components/ScrollReveal';

// --- Constants (Simplified for code brevity, same logic as V1 but refactored for V2 feel) ---
const SATELLITES = [
    { name: 'ISS (ZARYA)', catalog: '25544', tle: ['1 25544U 98067A   24040.82062361  .00016717  00000-0  30159-3 0  9999', '2 25544  51.6415 162.1557 0004353  70.8524  42.2215 15.49547121438257'] },
    { name: 'STARLINK-1007', catalog: '44713', tle: ['1 44713U 19074A   24040.54221123  .00001234  00000-0  12345-3 0  9999', '2 44713  53.0543  12.3456 0001234  45.6789 123.4567 15.06423123456789'] },
    { name: 'CHANDRAYAAN-3', catalog: '57320', tle: ['1 57320U 23098A   24040.54221123  .00001234  00000-0  12345-3 0  9999', '2 57320  21.3543  12.3456 0001234  45.6789 123.4567 15.06423123456789'] },
];

const MISSION_COMMANDS = [
    { id: 'DEPLOY_ARRAYS', label: 'Deploy Solar Arrays', icon: Zap },
    { id: 'START_DOWNLINK', label: 'Initiate High-Speed Downlink', icon: Radio },
    { id: 'CALIBRATE_SENSOR', label: 'Calibrate Star Tracker', icon: Settings },
    { id: 'EMERGENCY_MODE', label: 'Execute Emergency Beacon', icon: Shield },
];

// --- Sub-Components (Ported & Polished for V2) ---
const Earth = () => (
    <group>
        <mesh>
            <sphereGeometry args={[5, 64, 64]} />
            <meshPhongMaterial color="#0A0A18" emissive="#050510" specular="#1a1a2e" shininess={20} />
        </mesh>
        <mesh scale={[1.02, 1.02, 1.02]}>
            <sphereGeometry args={[5, 64, 64]} />
            <meshBasicMaterial color="#00e0f0" transparent opacity={0.05} />
        </mesh>
    </group>
);

const SatelliteModel = ({ position, rotation, isVerified, isScanning }: any) => {
    return (
        <group position={position} rotation={rotation}>
            <mesh>
                <boxGeometry args={[0.5, 0.5, 0.8]} />
                <meshStandardMaterial color={isVerified ? "#00e0f0" : "#2a2a3e"} metalness={0.9} roughness={0.1} />
            </mesh>
            <group position={[0, 0, -0.4]} rotation={[Math.PI / 2, 0, 0]}>
                <mesh><cylinderGeometry args={[0.3, 0.1, 1.5, 32]} /><meshBasicMaterial color="#00e0f0" transparent opacity={isScanning ? 0.2 : 0.05} /></mesh>
            </group>
        </group>
    );
};

const V2Missions = () => {
    const navigate = useNavigate();
    const [selectedSat, setSelectedSat] = useState(SATELLITES[0]);
    const [status, setStatus] = useState<'idle' | 'scanning' | 'verified'>('idle');
    const [logs, setLogs] = useState<string[]>([]);
    const [satGeodetic, setSatGeodetic] = useState({ lat: 0, lon: 0, alt: 0 });

    const addLog = (msg: string) => {
        setLogs(prev => [`[${new Date().toLocaleTimeString('en-US', { hour12: false })}] ${msg}`, ...prev].slice(0, 30));
    };

    const handleAstrometricLock = () => {
        setStatus('scanning');
        addLog(`INITIATING ASTROMETRIC LOCK ON ${selectedSat.name}...`);
        setTimeout(() => {
            setStatus('verified');
            addLog(`✓ PATTERN RECOGNITION COMPLETE.`);
            addLog(`✓ GAIA DR3 COVARIANCE VERIFIED.`);
            addLog(`✓ CRYPTOGRAPHIC KEY DERIVED FROM ZENITH PATCH.`);
        }, 2500);
    };

    return (
        <V2Layout>
            <div className="min-h-screen bg-[#0A0A12] flex flex-col pt-20">
                <main className="flex-1 container mx-auto px-6 py-8 grid lg:grid-cols-12 gap-6 overflow-hidden">
                    {/* Left Panel: Ground Control */}
                    <div className="lg:col-span-3 space-y-6">
                        <ScrollReveal>
                            <div className="bg-[#0A0A12]/60 backdrop-blur-xl border border-white/5 p-8 aerospace-border aerospace-border-tl flex flex-col gap-8 h-full">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3 text-cyan-400">
                                        <Settings className="w-5 h-5 animate-spin-slow" />
                                        <h2 className="font-aerospace text-xl font-black uppercase tracking-widest">Ground Control</h2>
                                    </div>
                                    <p className="text-[10px] font-aerospace text-zinc-500 uppercase tracking-widest">Command Center // Noida Hub</p>
                                </div>

                                <div className="space-y-6 flex-1">
                                    <div className="space-y-4">
                                        <Label className="font-aerospace text-[10px] uppercase tracking-[0.2em] text-cyan-500/60">Satellite Selection</Label>
                                        <Select onValueChange={(val) => setSelectedSat(SATELLITES.find(s => s.name === val) || SATELLITES[0])}>
                                            <SelectTrigger className="bg-white/5 border-white/10 rounded-none font-aerospace uppercase tracking-widest text-xs h-12">
                                                <SelectValue placeholder="Select Satellite" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#0A0A12] border-white/10">
                                                {SATELLITES.map(sat => (<SelectItem key={sat.catalog} value={sat.name} className="font-aerospace uppercase text-xs">{sat.name}</SelectItem>))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-white/5">
                                        <Label className="font-aerospace text-[10px] uppercase tracking-[0.2em] text-cyan-500/60">Mission State</Label>
                                        <div className="bg-[#0A0A12] border border-white/5 p-4 rounded-lg space-y-4">
                                            <div className="flex justify-between items-center text-[10px] font-aerospace uppercase tracking-widest">
                                                <span className="text-zinc-500">Telemetry</span>
                                                <span className="text-emerald-500">Nominal ✓</span>
                                            </div>
                                            <div className="flex justify-between items-center text-[10px] font-aerospace uppercase tracking-widest">
                                                <span className="text-zinc-500">Antenna</span>
                                                <span className="text-emerald-500">Locked ✓</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleAstrometricLock}
                                    disabled={status === 'scanning'}
                                    className="w-full bg-cyan-500 hover:bg-cyan-400 text-[#0A0A12] font-aerospace font-bold uppercase tracking-widest h-14 rounded-none aerospace-border aerospace-border-tl shadow-[0_0_20px_rgba(0,224,240,0.15)]"
                                >
                                    {status === 'scanning' ? 'Scanning Stars...' : 'Initiate Astrometric Lock'}
                                </Button>
                            </div>
                        </ScrollReveal>
                    </div>

                    {/* Center Panel: Visualization */}
                    <div className="lg:col-span-6 relative">
                        <div className="absolute inset-0 bg-black rounded-lg border border-white/5 overflow-hidden aerospace-border">
                            <Canvas shadows>
                                <PerspectiveCamera makeDefault position={[10, 10, 20]} />
                                <OrbitControls />
                                <ambientLight intensity={0.5} />
                                <directionalLight position={[10, 10, 10]} intensity={1} />
                                <Earth />
                                <SatelliteModel position={[8, 0, 0]} isVerified={status === 'verified'} isScanning={status === 'scanning'} />
                                <points>
                                    <sphereGeometry args={[100, 32, 32]} />
                                    <pointsMaterial size={0.5} sizeAttenuation color="#ffffff" transparent opacity={0.3} />
                                </points>
                            </Canvas>

                            {/* HUD Overlays */}
                            <div className="absolute top-6 left-6 pointer-events-none">
                                <div className="bg-black/40 backdrop-blur-md border border-cyan-500/30 px-4 py-2 flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${status === 'verified' ? 'bg-emerald-500 animate-pulse' : 'bg-cyan-500'}`} />
                                    <span className="font-aerospace text-xs font-bold uppercase tracking-widest text-cyan-400">
                                        System Mode: {status.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            <div className="absolute bottom-6 right-6 pointer-events-none text-right font-aerospace text-[9px] text-cyan-500/40 uppercase tracking-[0.5em]">
                                Guidance & Navigation Control (GNC) // Starhold V2.0
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Logs & Payloads */}
                    <div className="lg:col-span-3 space-y-6">
                        <ScrollReveal delay={400}>
                            <div className="bg-[#0A0A12]/60 backdrop-blur-xl border border-white/5 p-8 aerospace-border aerospace-border-tl flex flex-col h-full min-h-[500px]">
                                <h3 className="font-aerospace text-xs font-bold uppercase tracking-widest text-cyan-500 mb-6 flex items-center gap-3">
                                    <Activity className="w-4 h-4" /> System Logs
                                </h3>

                                <ScrollArea className="flex-1 font-technical text-[10px] text-zinc-500 uppercase tracking-widest">
                                    <div className="space-y-4 pr-4">
                                        {logs.length === 0 ? (
                                            <div className="opacity-20 italic">Awaiting System Initiation...</div>
                                        ) : (
                                            logs.map((log, i) => (
                                                <div key={i} className={`border-l-2 pl-3 ${log.includes('✓') ? 'border-emerald-500 text-emerald-500/80' : 'border-cyan-500/30'}`}>
                                                    {log}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </ScrollArea>

                                <div className="pt-8 border-t border-white/5 space-y-4">
                                    <Label className="font-aerospace text-[10px] uppercase tracking-[0.2em] text-cyan-500/60">Uplink Command</Label>
                                    <Select disabled={status !== 'verified'}>
                                        <SelectTrigger className="bg-white/5 border-white/10 rounded-none font-aerospace uppercase tracking-widest text-xs h-12">
                                            <SelectValue placeholder="Select Action" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#0A0A12] border-white/10">
                                            {MISSION_COMMANDS.map(cmd => (<SelectItem key={cmd.id} value={cmd.id} className="font-aerospace uppercase text-xs">{cmd.label}</SelectItem>))}
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        disabled={status !== 'verified'}
                                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-[#0A0A12] font-aerospace font-bold uppercase tracking-widest h-14 rounded-none transition-all shadow-[0_0_20px_rgba(16,185,129,0.15)] disabled:opacity-20 translate-y-2"
                                    >
                                        Transmit Payload
                                    </Button>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </main>
            </div>
        </V2Layout>
    );
};

export default V2Missions;
