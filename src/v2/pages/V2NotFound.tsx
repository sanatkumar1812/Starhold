import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Home, Compass } from 'lucide-react';

const V2NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#040814] flex flex-col items-center justify-center p-6 relative overflow-hidden font-technical text-white selection:bg-cyan-500/30 scanline-effect">
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[99]" style={{ backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')` }} />

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-red-600/10 rounded-full blur-[180px] pointer-events-none" />

            <div className="relative z-10 space-y-12 text-center max-w-2xl mx-auto">
                <div className="space-y-6">
                    <div className="flex justify-center mb-8">
                        <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.15)] animate-[pulse_3s_ease-in-out_infinite]">
                            <AlertTriangle className="w-12 h-12 text-red-500" />
                        </div>
                    </div>

                    <h1 className="font-aerospace text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-red-500/80 tracking-tighter">
                        404
                    </h1>
                    <h2 className="font-aerospace text-2xl md:text-3xl font-bold uppercase tracking-widest text-white mt-4">
                        Signal Lost
                    </h2>
                    <p className="text-lg text-zinc-400 font-light leading-relaxed max-w-xl mx-auto">
                        The orbital coordinates for this sector do not exist, or the data packet has decayed due to cosmic background radiation.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
                    <Button
                        onClick={() => navigate('/v2')}
                        className="bg-cyan-500 hover:bg-cyan-400 text-[#040814] px-10 py-6 text-sm font-aerospace font-bold uppercase tracking-widest rounded-none aerospace-border aerospace-border-tl transition-all hover:scale-105 shadow-[0_0_30px_rgba(0,224,240,0.2)]"
                    >
                        <Home className="w-4 h-4 mr-2" /> Resume Connection
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => navigate('/v2/observatory')}
                        className="border-white/10 text-white hover:bg-white/5 px-10 py-6 text-sm font-aerospace font-bold uppercase tracking-widest rounded-none transition-all"
                    >
                        <Compass className="w-4 h-4 mr-2" /> Enter Observatory
                    </Button>
                </div>

                <div className="pt-16 border-t border-white/5 mt-16 w-full max-w-md mx-auto">
                    <div className="flex items-center justify-between font-mono text-xs text-zinc-600 uppercase tracking-widest">
                        <span>ERR: ORBITAL_DECAY</span>
                        <span>SYS: STARHOLD_CORE_V2</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default V2NotFound;
