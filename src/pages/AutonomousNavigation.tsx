import React, { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { NavigationCanvas } from '@/components/NavigationCanvas';
import { GNCDashboard } from '@/components/GNCDashboard';
import { SciFiHUD } from '@/components/SciFiHUD';
import { MemoryBeacon } from '@/components/MemoryBeacon';
import { motion, AnimatePresence } from 'framer-motion';

const AutonomousNavigation = () => {
    const [isInitializing, setIsInitializing] = useState(true);
    const [starDataSync, setStarDataSync] = useState<any>(null);
    const [selectedStar, setSelectedStar] = useState<any>(null);
    const [beacons, setBeacons] = useState<any[]>([]);
    const [toaError, setToaError] = useState(0.005);
    const [gncStats, setGncStats] = useState({
        positionError: 0.05,
        attitudeOffset: 0.001,
        signalSync: 100,
        isSimulatingLoss: false,
        autoPhase: 'OFF' as 'OFF' | 'DRIFT' | 'SEARCH' | 'LOCK' | 'ALIGNED'
    });

    useEffect(() => {
        const timer = setTimeout(() => setIsInitializing(false), 2000);

        setStarDataSync({
            status: "LOCKED",
            pulsars: 10,
            stars: 500,
            frame: "ICRS J2000"
        });

        const interval = setInterval(() => {
            // Signal Drift
            setToaError(prev => {
                const drift = (Math.random() - 0.5) * 0.0001;
                return Math.max(0.0001, prev + drift);
            });

            // GNC Stats Drift & Alignment
            setGncStats((prev) => {
                if (prev.isSimulatingLoss) {
                    if (prev.autoPhase === 'DRIFT') {
                        // Phase 1: Rapid Drift (Losing Earth Lock) - Realistic Dampened Scale
                        const nextPos = prev.positionError + Math.random() * 0.4;
                        // Realistic attitude drift: 0.1 to 0.5 degrees per second
                        const nextAtt = prev.attitudeOffset + (0.1 + Math.random() * 0.4);
                        const phaseChange = nextPos > 3.0; // Wait for significant drift
                        return {
                            ...prev,
                            positionError: nextPos,
                            attitudeOffset: Math.min(15, nextAtt), // Cap at 15 deg for "realistic" failure
                            signalSync: Math.max(0, prev.signalSync - 10),
                            autoPhase: phaseChange ? 'SEARCH' : 'DRIFT'
                        };
                    } else if (prev.autoPhase === 'SEARCH') {
                        // Phase 2: Searching for Pulsars
                        return {
                            ...prev,
                            signalSync: Math.min(20, prev.signalSync + 1),
                            autoPhase: prev.signalSync >= 20 ? 'LOCK' : 'SEARCH'
                        };
                    } else if (prev.autoPhase === 'LOCK' || prev.autoPhase === 'ALIGNED') {
                        // Phase 3: Converging using Pulsar-NAV - Perfect Calibration
                        const targetPos = 0.05 + (Math.random() * 0.05);
                        const targetAtt = 0.0001; // Near-perfect alignment target
                        const recoveryRate = 0.85;

                        return {
                            ...prev,
                            positionError: prev.positionError > targetPos ? prev.positionError * recoveryRate : targetPos,
                            attitudeOffset: prev.attitudeOffset > targetAtt ? prev.attitudeOffset * recoveryRate : targetAtt,
                            signalSync: Math.min(98, prev.signalSync + 5), // High-precision autonomous lock
                            autoPhase: 'ALIGNED'
                        };
                    }
                    return prev;
                } else {
                    // Link restored: Rapidly converge to zero-error state
                    const recoveryRate = 0.7;
                    const baselinePos = 0.001 + Math.random() * 0.002;
                    const baselineAtt = 0.0000;
                    return {
                        ...prev,
                        positionError: prev.positionError > baselinePos ? prev.positionError * recoveryRate : baselinePos,
                        attitudeOffset: prev.attitudeOffset > baselineAtt ? prev.attitudeOffset * recoveryRate : baselineAtt,
                        signalSync: Math.min(100, prev.signalSync + 10),
                        autoPhase: 'OFF'
                    };
                }
            });
        }, 1000);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, []);

    const handleSaveBeacon = (data: any) => {
        setBeacons([...beacons, data]);
        console.log("Memory Beacon Deployed:", data);
    };

    const toggleSignalLoss = () => {
        setGncStats(prev => ({
            ...prev,
            isSimulatingLoss: !prev.isSimulatingLoss,
            autoPhase: !prev.isSimulatingLoss ? 'DRIFT' : 'OFF'
        }));
    };

    return (
        <div className="h-screen w-screen bg-black text-cyan-500 flex flex-col overflow-hidden select-none">
            <Navigation />

            <div className="flex-1 relative mt-[72px]">
                <NavigationCanvas
                    onStarClick={(p) => setSelectedStar(p)}
                    positionError={gncStats.positionError}
                    attitudeOffset={gncStats.attitudeOffset}
                    autoPhase={gncStats.autoPhase}
                />

                <SciFiHUD>
                    <GNCDashboard
                        toaError={toaError}
                        syncStatus={starDataSync?.status}
                        stats={gncStats}
                        onToggleLoss={toggleSignalLoss}
                    />
                </SciFiHUD>

                <AnimatePresence>
                    {selectedStar && (
                        <MemoryBeacon
                            selectedStar={selectedStar}
                            onClose={() => setSelectedStar(null)}
                            onSave={handleSaveBeacon}
                        />
                    )}
                </AnimatePresence>

                {/* Initialization Overlay */}
                <AnimatePresence>
                    {isInitializing && (
                        <motion.div
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1 }}
                            className="absolute inset-0 z-[100] bg-black flex flex-col items-center justify-center gap-6"
                        >
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 90, 180, 270, 360]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="w-16 h-16 border-2 border-cyan-500 border-t-transparent rounded-full"
                            />
                            <div className="flex flex-col items-center gap-2">
                                <h1 className="text-xl font-bold tracking-[0.5em] uppercase animate-pulse">Initializing 4D-NAV</h1>
                                <p className="text-[10px] tracking-widest text-cyan-500/60 uppercase">Synchronizing with Pulsar Timing Array (ATNF/Gaia)...</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Data Sync Status (Floating) */}
                <div className="absolute top-8 right-16 z-20 pointer-events-none">
                    <AnimatePresence>
                        {starDataSync && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex flex-col items-end gap-1 px-4 py-2 border-r-2 border-cyan-500/40 bg-black/20"
                            >
                                <span className="text-[9px] uppercase tracking-widest text-cyan-500/60 underline">ICRS Reference Frame</span>
                                <span className="text-[11px] font-bold text-cyan-400">PULSARS: {starDataSync.pulsars} (LOCKED)</span>
                                <span className="text-[11px] font-bold text-cyan-400">Gaia DR3 STARS: {starDataSync.stars}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Subtle Vignette Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] z-10" />
        </div>
    );
};

export default AutonomousNavigation;
