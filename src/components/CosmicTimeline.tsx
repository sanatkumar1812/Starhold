import React from 'react';
import { Shield, Lock, Unlock, Zap } from 'lucide-react';

const events = [
    {
        icon: Zap,
        title: "Quantum Digitization",
        time: "T+0m",
        desc: "Your memory is converted into a high-entropy data stream, resilient to bit-rot and environmental decay."
    },
    {
        icon: Shield,
        title: "Stellar Addressing",
        time: "T+5m",
        desc: "Using current star-mapping data, we fix your data to a unique set of coordinates in the celestial sphere."
    },
    {
        icon: Lock,
        title: "The Great Wait",
        time: "Years / Decades",
        desc: "Your data orbits the central vault, encrypted and invisible, protected by our redundant orbital servers."
    },
    {
        icon: Unlock,
        title: "The Reveal",
        time: "Set by You",
        desc: "At the precise millisecond, the coordinates are broadcasted back, and your memory is unlocked for the recipient."
    }
];

export const CosmicTimeline = () => {
    return (
        <section className="py-32 px-4 relative overflow-hidden">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-4">The <span className="text-gradient-gold">Temporal</span> Journey</h2>
                    <p className="text-muted-foreground italic">How a moment travels through time to meet its future.</p>
                </div>

                <div className="relative space-y-24">
                    {/* Vertical line */}
                    <div className="absolute left-8 top-8 bottom-8 w-px bg-gradient-to-b from-primary/50 via-primary/10 to-transparent md:left-1/2" />

                    {events.map((e, i) => (
                        <div key={e.title} className={`relative flex flex-col md:flex-row items-center gap-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                            }`}>
                            {/* Icon / Center node */}
                            <div className="absolute left-8 -translate-x-1/2 w-16 h-16 rounded-full glass-strong border-primary/30 flex items-center justify-center z-20 md:left-1/2">
                                <e.icon className="w-8 h-8 text-primary shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
                            </div>

                            {/* Content Card */}
                            <div className={`w-full md:w-1/2 pl-24 md:pl-0 ${i % 2 === 0 ? 'md:pr-24 md:text-right' : 'md:pl-24 md:text-left'
                                }`}>
                                <div className="glass p-8 rounded-3xl hover:border-primary/20 transition-all duration-500 group">
                                    <span className="text-xs font-mono text-primary uppercase tracking-widest">{e.time}</span>
                                    <h3 className="font-serif text-2xl text-foreground mt-2 mb-4 group-hover:text-primary transition-colors">{e.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed text-sm">
                                        {e.desc}
                                    </p>
                                </div>
                            </div>

                            {/* Empty space for the other side */}
                            <div className="hidden md:block w-1/2" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
