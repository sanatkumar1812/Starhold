import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Database, Radio, Cpu } from 'lucide-react';

export const SciFiHUD: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    return (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden font-mono">
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-cyan-500/30 rounded-tl-2xl m-8" />
            <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-cyan-500/30 rounded-tr-2xl m-8" />
            <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-cyan-500/30 rounded-bl-2xl m-8" />
            <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-cyan-500/30 rounded-br-2xl m-8" />

            {/* Top Header */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-6 px-8 py-3 bg-black/40 backdrop-blur-md border border-cyan-500/20 rounded-full pointer-events-auto">
                <div className="flex items-center gap-2">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    >
                        <Compass className="w-5 h-5 text-cyan-400" />
                    </motion.div>
                    <span className="text-xs font-bold tracking-[0.3em] uppercase text-cyan-100">NAV-CPU v4.0.2</span>
                </div>
                <div className="w-px h-4 bg-cyan-500/20" />
                <div className="flex items-center gap-4 text-[10px] text-cyan-500/60 uppercase tracking-widest">
                    <div className="flex items-center gap-1">
                        <Database className="w-3 h-3" />
                        <span>SIMBAD R-LINK</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Radio className="w-3 h-3" />
                        <span>4D-SYNC</span>
                    </div>
                </div>
            </div>

            {/* Sidebars */}
            <div className="absolute inset-y-0 left-8 flex items-center pointer-events-auto">
                {children}
            </div>

            {/* Bottom Status */}
            <div className="absolute bottom-8 right-8 flex flex-col items-end gap-2 pointer-events-auto">
                <div className="flex items-center gap-3 px-4 py-2 bg-black/40 backdrop-blur-md border border-cyan-500/20 rounded-lg">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    <div className="flex flex-col">
                        <span className="text-[9px] uppercase tracking-widest text-cyan-500/60 leading-none">AI Processor</span>
                        <span className="text-[11px] font-bold text-cyan-400">ACTIVE: DEEP-SPACE_V4</span>
                    </div>
                </div>
                <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="w-8 h-1 bg-cyan-500/40 rounded-full"
                            animate={{ opacity: [0.2, 1, 0.2] }}
                            transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
                        />
                    ))}
                </div>
            </div>

            {/* Scanline Effect */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 bg-[length:100%_2px,3px_100%]" />
        </div>
    );
};
