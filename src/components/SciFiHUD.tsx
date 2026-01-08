import { useEffect, useState } from 'react';

export const SciFiHUD = () => {
    const [stats, setStats] = useState({
        ra: '00h 00m 00s',
        dec: '+00° 00\' 00"',
        temp: '2.73K',
        sync: 98
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prev => ({
                ...prev,
                sync: Math.min(100, prev.sync + (Math.random() > 0.8 ? 0.1 : 0))
            }));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
            {/* Scanlines */}
            <div className="absolute inset-0 scanline-overlay opacity-[0.03]" />

            {/* Corner Brackets */}
            <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-primary/30" />
            <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-primary/30" />
            <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-primary/30" />
            <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-primary/30" />

            {/* Technical Readouts - Top Left */}
            <div className="absolute top-10 left-24 font-mono text-[10px] text-primary/40 flex flex-col gap-1 tracking-widest hidden lg:flex">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary/40 animate-pulse" />
                    <span>ARRAY_STATUS: NOMINAL</span>
                </div>
                <div>SECTOR_GRID: 24.0.1 // SHL</div>
            </div>

            {/* Technical Readouts - Bottom Right */}
            <div className="absolute bottom-10 right-24 font-mono text-[10px] text-primary/40 text-right flex flex-col gap-1 tracking-widest hidden lg:flex">
                <div>SYSTEM_TIME: {new Date().toLocaleTimeString([], { hour12: false })}</div>
                <div>DATA_SYNC_INDEX: {stats.sync.toFixed(1)}%</div>
                <div className="flex items-center justify-end gap-2">
                    <span>ARCHIVE_READY</span>
                    <div className="w-1.5 h-1.5 bg-primary/60 animate-blink" />
                </div>
            </div>

            {/* Vertical Scale - Left */}
            <div className="absolute left-10 top-1/2 -translate-y-1/2 h-32 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent hidden md:block">
                {[0, 1, 2, 3, 4].map(i => (
                    <div key={i} className="absolute left-0 w-2 h-px bg-primary/30" style={{ top: `${i * 25}%` }} />
                ))}
            </div>

            {/* Scanning Line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary/10 animate-scanning blur-[1px] opacity-20" />
        </div>
    );
};
