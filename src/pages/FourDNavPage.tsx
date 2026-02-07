import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { CosmicEnvironment } from '@/components/four-d-nav/CosmicEnvironment';
import { SpacecraftAI } from '@/components/four-d-nav/SpacecraftAI';
import { SimDashboard } from '@/components/four-d-nav/SimDashboard';
import { Navigation } from '@/components/Navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Crosshair } from 'lucide-react';

const FourDNavPage = () => {
    // Navigation State
    const [truePos, setTruePos] = useState(new THREE.Vector3(0, 0, 0));
    const [estPos, setEstPos] = useState(new THREE.Vector3(0.5, 0.2, -0.3));
    const [sensorNoise, setSensorNoise] = useState(2.0); // 0-10 scale
    const [showEarth, setShowEarth] = useState(false);
    const [aiMode, setAiMode] = useState<'AUTO' | 'MANUAL'>('AUTO');
    const [showBeams, setShowBeams] = useState(true);
    const [isInitializing, setIsInitializing] = useState(true);

    // Time-series stats for metrics
    const [posError, setPosError] = useState(0);
    const [timeOffset, setTimeOffset] = useState(0);

    const truePosRef = useRef(truePos);
    const estPosRef = useRef(estPos);

    useEffect(() => {
        truePosRef.current = truePos;
        estPosRef.current = estPos;
    }, [truePos, estPos]);

    useEffect(() => {
        const timer = setTimeout(() => setIsInitializing(false), 2000);

        const interval = setInterval(() => {
            // 1. SIMULATE DRIFT
            setTruePos(prev => {
                const drift = new THREE.Vector3(
                    (Math.random() - 0.5) * 0.1 * sensorNoise,
                    (Math.random() - 0.5) * 0.1 * sensorNoise,
                    (Math.random() - 0.5) * 0.1 * sensorNoise
                );
                return prev.clone().add(drift);
            });

            // 2. AI FUSION LOGIC
            setEstPos((prev) => {
                const measurementError = new THREE.Vector3(
                    (Math.random() - 0.5) * 0.05 * sensorNoise,
                    (Math.random() - 0.5) * 0.05 * sensorNoise,
                    (Math.random() - 0.5) * 0.05 * sensorNoise
                );

                let nextEst = prev.clone().add(measurementError);

                if (aiMode === 'AUTO') {
                    // We use the ref here to get the "latest" truePos without triggering deps
                    const correctionVector = truePosRef.current.clone().sub(nextEst);
                    const convergenceRate = showEarth ? 0.8 : 0.15;
                    nextEst.add(correctionVector.multiplyScalar(convergenceRate));
                }

                return nextEst;
            });

            // 3. UPDATE METRICS
            setPosError(truePosRef.current.distanceTo(estPosRef.current));
            setTimeOffset((Math.random() - 0.5) * 0.02 * sensorNoise);

        }, 200);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, [sensorNoise, aiMode, showEarth]);

    const handleApplyDisturbance = () => {
        const impulse = new THREE.Vector3(
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20
        );
        setTruePos(prev => prev.clone().add(impulse));
    };

    const handleResetAI = () => {
        setEstPos(new THREE.Vector3(20, 15, -10)); // Major desync
        setTruePos(new THREE.Vector3(0, 0, 0));
    };

    return (
        <div className="h-screen w-screen bg-[#020617] text-white flex flex-col overflow-hidden select-none">
            <Navigation />

            <div className="flex-1 relative flex">
                {/* 3D Simulation View */}
                <div className="flex-1 relative">
                    <Canvas shadows dpr={[1, 2]}>
                        <PerspectiveCamera makeDefault position={[0, 50, 100]} fov={50} />
                        <OrbitControls enablePan={true} maxDistance={2000} minDistance={10} />

                        <CosmicEnvironment showEarth={showEarth} pulsarPings={[]} />
                        <SpacecraftAI
                            truePos={truePos}
                            estPos={estPos}
                            sensorNoise={sensorNoise}
                            showBeams={showBeams}
                        />

                        <gridHelper args={[2000, 100]} position={[0, -500, 0]}>
                            <meshBasicMaterial transparent opacity={0.02} color="#06b6d4" />
                        </gridHelper>
                    </Canvas>

                    {/* Floating UI Elements */}
                    <div className="absolute top-24 left-8 z-20 pointer-events-none space-y-2">
                        <div className="px-4 py-2 bg-black/40 border border-white/10 backdrop-blur-md">
                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.4em]">Reference Frame</span>
                            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-tighter">ICRS (Inter-Galactic)</h3>
                        </div>
                        <div className="flex gap-2">
                            <span className="px-2 py-0.5 bg-black/40 border border-white/10 text-[8px] text-white/60 uppercase">Ecliptic-Align: OK</span>
                            <span className="px-2 py-0.5 bg-black/40 border border-white/10 text-[8px] text-white/60 uppercase">Pulsar-Sync: ACTIVE</span>
                        </div>
                    </div>
                </div>

                {/* Dashboard/Controller Sidebar */}
                <SimDashboard
                    sensorNoise={sensorNoise}
                    setSensorNoise={setSensorNoise}
                    showEarth={showEarth}
                    setShowEarth={setShowEarth}
                    posError={posError}
                    timeOffset={timeOffset}
                    onApplyDisturbance={handleApplyDisturbance}
                    onResetAI={handleResetAI}
                    aiMode={aiMode}
                    setAiMode={setAiMode}
                />
            </div>

            {/* Intro Animation */}
            <AnimatePresence>
                {isInitializing && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[100] bg-black flex flex-col items-center justify-center gap-8"
                    >
                        <div className="relative w-32 h-32 flex items-center justify-center">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 border-t-2 border-cyan-500 rounded-full"
                            />
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-4 border-b-2 border-amber-500 rounded-full opacity-50"
                            />
                            <Crosshair className="w-8 h-8 text-cyan-500" />
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-[0.8em] uppercase text-white">4D-NAV SIMULATOR</h1>
                            <p className="text-[10px] tracking-widest text-white/40 uppercase">Initializing Autonomous Navigation AI...</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Vignette */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)] z-10" />
        </div>
    );
};

export default FourDNavPage;
