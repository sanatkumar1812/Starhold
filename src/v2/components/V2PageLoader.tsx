import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Star } from 'lucide-react';

export const V2PageLoader = () => {
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Trigger loading on path change
        setIsLoading(true);
        // Minimum spinner time 2s
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, [location.pathname]);

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-[9999] bg-[#040814] flex flex-col items-center justify-center p-4">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[160px] pointer-events-none animate-pulse" />

            <div className="relative z-10 flex flex-col items-center">
                <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-cyan-400/80 animate-spin" />
                    <div className="absolute inset-2 rounded-full border-b-2 border-l-2 border-purple-500/60 animate-[spin_1.5s_linear_infinite_reverse]" />
                    <Star className="w-6 h-6 text-cyan-400 animate-pulse" />
                </div>

                <h3 className="font-aerospace text-xl lg:text-2xl font-black uppercase tracking-[0.4em] text-white mb-2 text-center">
                    Establishing <span className="text-cyan-400">Uplink</span>
                </h3>
                <p className="font-mono text-xs uppercase tracking-widest text-zinc-500 animate-pulse text-center px-4 leading-relaxed">
                    Authenticating via Celestial Reference...
                </p>

                {/* Progress bar simulation */}
                <div className="w-64 h-1 bg-white/5 mt-8 overflow-hidden rounded-full">
                    <div className="h-full bg-cyan-400 w-1/2 animate-[pulse_1s_ease-in-out_infinite]" style={{ animationDuration: '2s' }} />
                </div>
            </div>
        </div>
    );
};
