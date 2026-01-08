import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface CosmicGiftProps {
    onShatter: () => void;
    senderName?: string;
}

export const CosmicGift = ({ onShatter, senderName }: CosmicGiftProps) => {
    const [isShattering, setIsShattering] = useState(false);

    const handleShatter = () => {
        if (isShattering) return;
        setIsShattering(true);

        // Play sound if possible, or just haptic feedback (conceptually)

        setTimeout(() => {
            onShatter();
        }, 1500); // Time for the "shatter" animation to manifest
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md transition-all duration-1000">
            <div className="text-center space-y-12 max-w-md px-6">
                <div className="space-y-4">
                    <h2 className="text-3xl font-display text-white tracking-[0.2em] font-light">
                        A GIFT FROM THE STARS
                    </h2>
                    {senderName && (
                        <p className="text-primary/60 font-serif italic text-lg tracking-wide">
                            Sent with love by {senderName}
                        </p>
                    )}
                </div>

                {/* The Cosmic Orb / Bottle */}
                <div
                    className="relative w-64 h-64 mx-auto cursor-pointer group"
                    onClick={handleShatter}
                >
                    {/* Outer Glow Aura */}
                    <div className={`absolute inset-0 rounded-full bg-primary/20 blur-[60px] transition-all duration-700 group-hover:bg-primary/40 ${isShattering ? 'scale-[3] opacity-0' : 'animate-pulse'}`} />

                    {/* Orbiting Particles */}
                    <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${isShattering ? 'opacity-0' : 'opacity-100'}`}>
                        {[...Array(8)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-1 h-1 bg-white rounded-full"
                                style={{
                                    top: '50%',
                                    left: '50%',
                                    animation: `orbit ${3 + i * 0.5}s linear infinite`,
                                    transform: `rotate(${i * 45}deg) translateX(${80 + i * 5}px)`
                                }}
                            />
                        ))}
                    </div>

                    {/* The Vessel */}
                    <div
                        className={`relative w-full h-full rounded-full border border-white/20 bg-white/5 backdrop-blur-sm flex items-center justify-center transition-all duration-700 shadow-[inset_0_0_40px_rgba(255,255,255,0.1)] overflow-hidden
              ${isShattering ? 'scale-[2.5] opacity-0 border-white/0' : 'hover:scale-105 hover:bg-white/10'}`}
                    >
                        {/* The Inner Essence */}
                        <div className={`relative transition-all duration-700 ${isShattering ? 'scale-0' : ''}`}>
                            <div className="absolute inset-0 blur-2xl bg-primary animate-pulse" />
                            <Sparkles className="w-16 h-16 text-primary relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
                        </div>

                        {/* Glass Reflections */}
                        <div className="absolute top-1/4 left-1/4 w-12 h-1 bg-white/20 -rotate-45 rounded-full blur-[1px]" />
                        <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-white/10 rounded-full blur-[1px]" />
                    </div>

                    {/* Tap Prompt */}
                    {!isShattering && (
                        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 whitespace-nowrap text-white/40 text-sm tracking-[0.3em] font-light animate-bounce">
                            TAP TO RELEASE
                        </div>
                    )}
                </div>
            </div>

            <style>{`
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(90px) rotate(0deg); }
          to   { transform: rotate(360deg) translateX(90px) rotate(-360deg); }
        }
        
        @keyframes shatter-flash {
          0% { background-color: rgba(255,255,255,0); }
          50% { background-color: rgba(255,255,255,1); }
          100% { background-color: rgba(255,255,255,0); }
        }
      `}</style>

            {/* Shatter Flash Overlay */}
            {isShattering && (
                <div
                    className="fixed inset-0 z-[110] pointer-events-none"
                    style={{ animation: 'shatter-flash 1.5s forwards' }}
                />
            )}
        </div>
    );
};
