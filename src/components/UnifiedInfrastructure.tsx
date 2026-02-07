import { Shield, Lock, Globe, Zap, Cpu, Star } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export const UnifiedInfrastructure = () => {
    return (
        <section className="py-32 px-4 relative overflow-hidden bg-slate-950/20 shadow-inner">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(96,165,250,0.05)_0%,transparent_50%)]" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <ScrollReveal>
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cosmic-blue/30 bg-cosmic-blue/10 text-xs text-cosmic-blue font-mono uppercase tracking-widest">
                                Unified Protocol v4.2
                            </div>
                            <h2 className="font-serif text-5xl md:text-6xl text-foreground leading-tight">
                                The Immutable <br />
                                <span className="text-gradient-gold italic">Ledger of the Sky</span>
                            </h2>
                            <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
                                Whether securing a personal legacy or authorizing a satellite maneuver,
                                Starhold relies on the absolute precision of celestial mechanics.
                                By binding data to Right Ascension and Declination, we create a
                                globally observable verification layer that exists beyond earthly control.
                            </p>

                            <div className="grid sm:grid-cols-2 gap-8 pt-4">
                                <div className="space-y-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <Star className="w-5 h-5 text-primary" />
                                    </div>
                                    <h3 className="font-serif text-xl text-foreground">Fixed Reference</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        Stars provide a permanent, non-spoofable reference system available to any observer with clear sight.
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <div className="w-10 h-10 rounded-xl bg-cosmic-blue/10 flex items-center justify-center">
                                        <Cpu className="w-5 h-5 text-cosmic-blue" />
                                    </div>
                                    <h3 className="font-serif text-xl text-foreground">Physics-Based</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        Our authorization logic is tied to real-world astronomical events, not just digital keys.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal delay={200}>
                        <div className="relative group p-1 glass rounded-[3rem] overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-cosmic-blue/20 to-transparent opacity-50" />
                            <div className="relative bg-slate-950/50 rounded-[2.8rem] p-12 border border-white/5 space-y-8">
                                <div className="flex items-center justify-between pb-6 border-b border-white/5">
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-mono text-cosmic-blue uppercase tracking-widest">Network Status</div>
                                        <div className="text-sm font-mono text-white flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                            STELLAR-LINK ACTIVE
                                        </div>
                                    </div>
                                    <Shield className="w-6 h-6 text-cosmic-blue/50" />
                                </div>

                                <div className="space-y-6">
                                    {[
                                        { label: 'Addressing Mode', value: 'RA/Dec Celestial Mapping' },
                                        { label: 'Security Layer', value: 'Time-Delayed Atomic Locking' },
                                        { label: 'Verification', value: 'Observable Star Trackers' },
                                        { label: 'Domain', value: 'B2C Personal & B2B Mission' }
                                    ].map((spec) => (
                                        <div key={spec.label} className="flex justify-between items-center text-xs">
                                            <span className="text-white/40 font-mono italic">{spec.label}</span>
                                            <span className="text-white font-mono">{spec.value}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-8 space-y-4">
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full w-2/3 bg-gradient-to-r from-primary to-cosmic-blue animate-pulse" />
                                    </div>
                                    <p className="text-[10px] font-mono text-center text-white/20 uppercase tracking-[0.2em]">
                                        Unified Architecture Synchronization
                                    </p>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </section>
    );
};
