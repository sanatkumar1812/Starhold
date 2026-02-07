import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Radio, Crosshair, AlertTriangle, Zap, Activity, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface GNCStats {
    positionError: number;
    attitudeOffset: number;
    signalSync: number;
    isSimulatingLoss: boolean;
    autoPhase: 'OFF' | 'DRIFT' | 'SEARCH' | 'LOCK' | 'ALIGNED';
}

interface GNCDashboardProps {
    toaError?: number;
    syncStatus?: string;
    stats: GNCStats;
    onToggleLoss: () => void;
}

export const GNCDashboard: React.FC<GNCDashboardProps> = ({
    toaError = 0.005,
    syncStatus = "LOCKED",
    stats,
    onToggleLoss
}) => {
    const [liveAttitude, setLiveAttitude] = useState(0);

    useEffect(() => {
        let frameId: number;

        const update = () => {
            const syncTime = performance.now() / 1000;
            const peakDegrees = stats.attitudeOffset;

            // Match the rotation logic in NavigationCanvas:
            // Math.sin(syncTime * 2) * peakDegrees and Math.cos(syncTime * 3) * peakDegrees
            const wobbleX = Math.sin(syncTime * 2) * peakDegrees;
            const wobbleZ = Math.cos(syncTime * 3) * peakDegrees;

            // The combined displacement magnitude (vector length)
            const totalDev = Math.sqrt(wobbleX * wobbleX + wobbleZ * wobbleZ);
            setLiveAttitude(totalDev);

            frameId = requestAnimationFrame(update);
        };

        frameId = requestAnimationFrame(update);
        return () => cancelAnimationFrame(frameId);
    }, [stats.attitudeOffset]);

    return (
        <div className="flex flex-col gap-4 w-80 p-6 bg-black/40 backdrop-blur-xl border border-cyan-500/20 rounded-2xl text-cyan-500 font-mono shadow-[0_0_20px_rgba(6,182,212,0.1)]">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
                <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 animate-pulse" />
                    <h2 className="text-sm font-bold tracking-tighter uppercase">GNC Systems Status</h2>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[9px] uppercase tracking-tighter opacity-70">{syncStatus}</span>
                    <div className={`w-2 h-2 rounded-full ${stats.isSimulatingLoss ? 'bg-amber-500 animate-ping' : 'bg-cyan-500'}`} />
                </div>
            </div>

            <div className="space-y-6 py-4">
                <StatItem
                    icon={<Crosshair className="w-4 h-4" />}
                    label="Position Error"
                    value={`${(stats.positionError * 0.0866).toFixed(3)} m`}
                    color={stats.isSimulatingLoss ? 'text-amber-500' : 'text-cyan-400'}
                />
                <StatItem
                    icon={<Radio className="w-4 h-4" />}
                    label="Live ToA Error"
                    value={`${(toaError * 1000).toFixed(2)} μs`}
                    color={toaError > 0.01 ? 'text-amber-500' : 'text-cyan-400'}
                />
                <div className="relative">
                    <StatItem
                        icon={<Zap className="w-4 h-4" />}
                        label="Attitude Error (Δ)"
                        value={`${liveAttitude.toFixed(4)}°`}
                        color={stats.isSimulatingLoss ? 'text-amber-500' : 'text-cyan-400'}
                    />
                    <span className="absolute top-0 right-0 text-[8px] text-cyan-500/50 uppercase tracking-widest border border-cyan-500/20 px-1 rounded">
                        Prograde Ref
                    </span>
                </div>
                <StatItem
                    icon={<ArrowUpDown className="w-4 h-4" />}
                    label="Vertical Deviation"
                    value={`${(stats.positionError * 0.05).toFixed(4)} m`} // Exact visual magnitude
                    color={stats.positionError > 0.5 ? 'text-amber-500' : 'text-cyan-400'}
                />

                <div className="space-y-2">
                    <div className="flex justify-between text-[10px] uppercase tracking-widest opacity-70">
                        <span>Signal Sync</span>
                        <span>{stats.signalSync}%</span>
                    </div>
                    <Progress value={stats.signalSync} className="h-1 bg-cyan-950" />
                </div>
            </div>

            <div className="mt-auto space-y-4">
                <Button
                    onClick={onToggleLoss}
                    variant="outline"
                    className={`w-full border-cyan-500/50 hover:bg-cyan-500/10 text-cyan-500 gap-2 h-12 transition-all ${stats.isSimulatingLoss ? 'border-amber-500 text-amber-500 hover:bg-amber-500/10' : ''
                        }`}
                >
                    {stats.isSimulatingLoss ? <Zap className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                    <span className="text-xs uppercase font-bold">
                        {stats.isSimulatingLoss ? 'Restore Earth Link' : 'Simulate Signal Loss'}
                    </span>
                </Button>

                <AnimatePresence>
                    {stats.isSimulatingLoss && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-start gap-3"
                        >
                            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <div className="flex flex-col gap-1">
                                <span className="font-bold text-amber-500 text-[11px] uppercase tracking-tighter">
                                    Autonomous Mode: {stats.autoPhase}
                                </span>
                                <p className="text-[10px] leading-relaxed text-amber-200/80">
                                    {stats.autoPhase === 'DRIFT' && "Lost Earth lock. Drifting to inertial frame..."}
                                    {stats.autoPhase === 'SEARCH' && "Scanning Pulsar $( \tau )$ timing signatures..."}
                                    {stats.autoPhase === 'LOCK' && "Triangulating position with ATNF MSP network..."}
                                    {stats.autoPhase === 'ALIGNED' && "Holding position using Galactic Pulse Count."}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const StatItem = ({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) => (
    <div className="space-y-1">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest opacity-60">
            {icon}
            <span>{label}</span>
        </div>
        <div className={`text-xl font-bold tracking-tight ${color}`}>{value}</div>
    </div>
);
