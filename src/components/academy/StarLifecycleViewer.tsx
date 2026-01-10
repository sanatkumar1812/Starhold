import React, { useState } from 'react';
import { Slider } from "@/components/ui/slider";
import { Timer, Zap, Skull, Sparkles } from 'lucide-react';

export const StarLifecycleViewer = () => {
    const [age, setAge] = useState([0]); // 0 to 100 representing life percentage

    // Determine star state based on age
    const getStarState = (val: number) => {
        if (val < 15) return {
            stage: 'Protostar',
            color: 'bg-orange-600',
            scale: 'scale-75',
            glow: 'shadow-[0_0_30px_rgba(234,88,12,0.4)]',
            desc: "A collapsing cloud of gas and dust. Gravity heats the core until nuclear fusion ignites."
        };
        if (val < 60) return {
            stage: 'Main Sequence (Sun-like)',
            color: 'bg-yellow-400',
            scale: 'scale-100',
            glow: 'shadow-[0_0_50px_rgba(250,204,21,0.6)]',
            desc: "The star is stable, fusing hydrogen into helium. This is the longest phase of a star's life."
        };
        if (val < 90) return {
            stage: 'Red Giant',
            color: 'bg-red-500',
            scale: 'scale-150',
            glow: 'shadow-[0_0_80px_rgba(239,68,68,0.6)]',
            desc: "Fuel runs low. The star expands massively, swallowing nearby planets as it cools and turns red."
        };
        return {
            stage: 'White Dwarf',
            color: 'bg-blue-100',
            scale: 'scale-50',
            glow: 'shadow-[0_0_20px_rgba(219,234,254,0.4)]',
            desc: "The outer layers are shed (creating a nebula), leaving behind a small, incredibly dense, hot core."
        };
    };

    const currentState = getStarState(age[0]);

    return (
        <div className="glass p-8 rounded-[2rem] border-white/5 relative overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8 items-center">

                {/* Visual */}
                <div className="h-[300px] flex items-center justify-center bg-black/20 rounded-3xl border border-white/5 relative">
                    <div className="absolute inset-0 overflow-hidden rounded-3xl">
                        {/* Background stars */}
                        <div className="absolute top-10 left-10 w-1 h-1 bg-white rounded-full opacity-50" />
                        <div className="absolute top-40 right-20 w-1 h-1 bg-white rounded-full opacity-30" />
                        <div className="absolute bottom-20 left-1/3 w-1 h-1 bg-white rounded-full opacity-40" />
                    </div>

                    <div className={`transition-all duration-1000 ease-in-out rounded-full ${currentState.color} ${currentState.scale} ${currentState.glow} w-32 h-32 relative`}>
                        <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse" />
                    </div>
                </div>

                {/* Controls & Info */}
                <div className="space-y-8">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-serif text-3xl text-foreground flex items-center gap-3">
                                <Sparkles className="w-6 h-6 text-yellow-500" />
                                {currentState.stage}
                            </h3>
                            <span className="font-mono text-xs text-primary bg-primary/10 px-3 py-1 rounded-full uppercase">
                                Age: {(age[0] * 0.1).toFixed(1)} Billion Years
                            </span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed h-20">
                            {currentState.desc}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between text-xs font-mono text-muted-foreground uppercase tracking-wider">
                            <span>Birth</span>
                            <span>Main Sequence</span>
                            <span>Death</span>
                        </div>
                        <Slider
                            value={age}
                            onValueChange={setAge}
                            max={100}
                            step={1}
                            className="w-full"
                        />
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                                <Zap className="w-4 h-4" />
                            </div>
                            <div>
                                <div className="text-[10px] text-muted-foreground uppercase">Energy Output</div>
                                <div className="text-sm font-medium">
                                    {age[0] < 15 ? 'Increasing' : age[0] < 90 ? 'Stable' : 'Fading'}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                                <Timer className="w-4 h-4" />
                            </div>
                            <div>
                                <div className="text-[10px] text-muted-foreground uppercase">Human Era</div>
                                <div className="text-sm font-medium">
                                    {age[0] >= 45 && age[0] <= 50 ? 'Present Day' : 'N/A'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
