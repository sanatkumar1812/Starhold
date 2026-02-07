import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Activity, Zap, Earth, ShieldAlert, Crosshair, HelpCircle } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface SimDashboardProps {
    sensorNoise: number;
    setSensorNoise: (v: number) => void;
    showEarth: boolean;
    setShowEarth: (v: boolean) => void;
    posError: number;
    timeOffset: number;
    onApplyDisturbance: () => void;
    onResetAI: () => void;
    aiMode: 'MANUAL' | 'AUTO';
    setAiMode: (m: 'MANUAL' | 'AUTO') => void;
}

export const SimDashboard: React.FC<SimDashboardProps> = ({
    sensorNoise,
    setSensorNoise,
    showEarth,
    setShowEarth,
    posError,
    timeOffset,
    onApplyDisturbance,
    onResetAI,
    aiMode,
    setAiMode
}) => {
    return (
        <div className="flex flex-col gap-6 w-[400px] h-full p-8 bg-black/60 backdrop-blur-2xl border-l border-white/10 text-white overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
                    <h2 className="text-lg font-bold tracking-[0.2em] uppercase">4D-NAV Controller</h2>
                </div>
                <div className="text-[10px] text-white/40 uppercase font-mono tracking-tighter">System ID: Q-P-FUSION</div>
            </div>

            {/* Educational Context */}
            <div className="p-4 bg-cyan-950/20 border border-cyan-500/20 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-cyan-400">
                    <ShieldAlert className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">AI Fusion Concept</span>
                </div>
                <p className="text-[11px] leading-relaxed text-cyan-100/60 font-medium">
                    This AI fuses angle data from <span className="text-cyan-400 underline decoration-cyan-400/20">Quasars</span> (extreme distance spatial anchors) with timing pulses from <span className="text-amber-500 underline decoration-amber-500/20">Pulsars</span> (galactic clocks) to maintain a continuous 4D coordinate map.
                </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
                <MetricCard
                    label="Positional Error"
                    value={`${posError.toFixed(2)} km`}
                    status={posError > 10 ? "CRITICAL" : "STABLE"}
                    icon={<Crosshair className="w-4 h-4" />}
                />
                <MetricCard
                    label="Time Offset"
                    value={`${(timeOffset * 1000).toFixed(4)} ms`}
                    status={Math.abs(timeOffset) > 0.01 ? "SYNC_LOSS" : "LOCKED"}
                    icon={<Zap className="w-4 h-4" />}
                />
            </div>

            {/* Simulation Controls */}
            <div className="space-y-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-widest text-white/60">Sensor Noise Magnitude</span>
                            <EducationalTooltip text="Simulates signal interference and measurement uncertainty. Higher noise makes AI fusion much more difficult." />
                        </div>
                        <span className="text-xs font-mono text-cyan-400">{(sensorNoise * 10).toFixed(1)}%</span>
                    </div>
                    <Slider
                        value={[sensorNoise]}
                        max={10}
                        step={0.1}
                        onValueChange={([v]) => setSensorNoise(v)}
                        className="cursor-pointer"
                    />
                </div>

                <div className="space-y-4 pt-4 border-t border-white/5">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold uppercase tracking-widest text-white/60">Earth-Based Navigation</span>
                                <EducationalTooltip text="Toggle between traditional ground-control reference and pure autonomous cosmic navigation." />
                            </div>
                            <span className="text-[9px] text-white/30 uppercase tracking-tighter">Status: {showEarth ? 'Active Uplink' : 'Pure Autonomous'}</span>
                        </div>
                        <Switch checked={showEarth} onCheckedChange={setShowEarth} />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold uppercase tracking-widest text-white/60">Autonomous AI Pilot</span>
                                <EducationalTooltip text="AUTO: AI continuously corrects drift. MANUAL: You must manually stabilize using impulses." />
                            </div>
                            <span className="text-[9px] text-white/30 uppercase tracking-tighter">Algorithm: Adaptive Kalman Map v4</span>
                        </div>
                        <Switch checked={aiMode === 'AUTO'} onCheckedChange={(v) => setAiMode(v ? 'AUTO' : 'MANUAL')} />
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-auto pt-6 space-y-3 border-t border-white/10">
                <Button
                    variant="outline"
                    onClick={onApplyDisturbance}
                    className="w-full h-12 border-amber-500/50 hover:bg-amber-500/10 text-amber-500 gap-2 uppercase text-[10px] font-bold tracking-[0.2em]"
                >
                    <ShieldAlert className="w-4 h-4" />
                    Inject External Disturbance
                </Button>
                <Button
                    variant="secondary"
                    onClick={onResetAI}
                    className="w-full h-12 bg-white text-black hover:bg-white/90 gap-2 uppercase text-[10px] font-bold tracking-[0.2em]"
                >
                    <Zap className="w-4 h-4 fill-current" />
                    Hard Reset AI Map
                </Button>
            </div>
        </div>
    );
};

const MetricCard = ({ label, value, status, icon }: { label: string; value: string; status: string; icon: React.ReactNode }) => (
    <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-3 hover:bg-white/10 transition-colors">
        <div className="flex items-center gap-2 text-white/40 uppercase tracking-widest text-[8px] font-bold">
            {icon}
            <span>{label}</span>
        </div>
        <div className="flex flex-col gap-1">
            <span className="text-xl font-bold font-mono tracking-tighter text-white">{value}</span>
            <span className={`text-[9px] font-bold tracking-widest ${status === 'STABLE' || status === 'LOCKED' ? 'text-emerald-400' : 'text-amber-400'}`}>
                [{status}]
            </span>
        </div>
    </div>
);

const EducationalTooltip = ({ text }: { text: string }) => (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <button className="text-white/20 hover:text-white/60 transition-colors">
                    <HelpCircle className="w-3 h-3" />
                </button>
            </TooltipTrigger>
            <TooltipContent className="bg-black/90 border-white/10 text-[11px] max-w-[200px] text-white/80 p-3 leading-relaxed">
                {text}
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
);
