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

                            <div className="grid grid-cols-2 gap-4 pt-2">
                                {[
                                    { icon: Star,   color: 'text-primary',     bg: 'bg-primary/10',     label: 'Fixed Celestial Reference', sub: 'Permanent — cannot be faked or jammed' },
                                    { icon: Cpu,    color: 'text-cosmic-blue', bg: 'bg-cosmic-blue/10', label: 'Physics-Based Auth',         sub: 'Tied to real astronomical events, not software' },
                                    { icon: Globe,  color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Globally Observable',         sub: 'Universe is the verification layer' },
                                    { icon: Lock,   color: 'text-amber-400',   bg: 'bg-amber-500/10',  label: 'RA/Dec Bound Keys',           sub: 'Right Ascension & Declination as address' },
                                ].map((item) => (
                                    <div key={item.label} className="glass p-5 rounded-2xl border-white/5 space-y-2 hover:border-cosmic-blue/20 transition-all duration-300">
                                        <div className={`w-9 h-9 rounded-xl ${item.bg} flex items-center justify-center`}>
                                            <item.icon className={`w-4 h-4 ${item.color}`} />
                                        </div>
                                        <p className="text-sm font-semibold text-foreground leading-tight">{item.label}</p>
                                        <p className="text-xs text-muted-foreground leading-relaxed">{item.sub}</p>
                                    </div>
                                ))}
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
                                        // Original: { label: 'Domain', value: 'B2C Personal & B2B Mission' }
                                        { label: 'Domain', value: 'High-Assurance Aerospace Security' }
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
