import { useNavigate } from 'react-router-dom';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Button } from '@/components/ui/button';
import { Satellite, Shield, Lock, Radio, Eye, CheckCircle2, Cpu, ArrowRight, Zap, Globe, Box } from 'lucide-react';
import { B2BPreviewSimulator } from '@/components/B2BPreviewSimulator';

export const ForMissionsSection = () => {
    const navigate = useNavigate();

    const flowSteps = [
        { step: '01', label: 'Operator Command', icon: Cpu, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' },
        { step: '02', label: 'Stellar Binding', icon: Lock, color: 'text-cosmic-blue', bg: 'bg-cosmic-blue/10', border: 'border-cosmic-blue/30', highlight: true },
        { step: '03', label: 'RF/Optical Uplink', icon: Radio, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' },
        { step: '04', label: 'Onboard Queue', icon: Satellite, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' },
        { step: '05', label: 'Star Observation', icon: Eye, color: 'text-cosmic-blue', bg: 'bg-cosmic-blue/10', border: 'border-cosmic-blue/30', highlight: true },
        { step: '06', label: 'Auth Check', icon: Shield, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', success: true },
        { step: '07', label: 'Execution', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', success: true },
    ];

    const techPillars = [
        {
            icon: '🔭',
            stat: 'Sub-arcsecond',
            label: 'Star Tracker Precision',
            sub: 'Already on most satellites — zero new hardware',
        },
        {
            icon: '🔐',
            stat: 'AES-256',
            label: 'Encryption Standard',
            sub: 'Commands bound to RA/Dec + catalog ID + TLE',
        },
        {
            icon: '🌌',
            stat: '1.8 Billion',
            label: 'Gaia DR3 Stars',
            sub: 'Immutable physical truth database — unspoofable',
        },
        {
            icon: '📡',
            stat: '0 Latency',
            label: 'Ground Contact Required',
            sub: 'Auth happens onboard — deep-space ready',
        },
    ];

    const applications = [
        { icon: Box, label: 'CubeSats', tag: 'Low-orbit', desc: 'Autonomous auth without ground infrastructure' },
        { icon: Satellite, label: 'Autonomous Craft', tag: 'Long-duration', desc: 'Real-time contact impractical or impossible' },
        { icon: Globe, label: 'Deep-Space', tag: 'Beyond Earth orbit', desc: 'Light delays make real-time auth infeasible' },
    ];

    return (
        <section id="for-missions" className="py-20 px-4 relative overflow-hidden">
            <div className="max-w-7xl mx-auto space-y-28">

                {/* CTA Buttons — title already introduced above */}
                <ScrollReveal>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => navigate('/techdocs')}
                            className="px-8 py-6 text-lg rounded-xl border-cosmic-blue/30 text-cosmic-blue hover:bg-cosmic-blue/10"
                        >
                            <Cpu className="w-5 h-5 mr-2" />
                            View Technical Docs
                        </Button>
                        <Button
                            variant="ghost"
                            size="lg"
                            onClick={() => document.getElementById('simulation')?.scrollIntoView({ behavior: 'smooth' })}
                            className="px-8 py-6 text-lg rounded-xl text-muted-foreground hover:text-foreground"
                        >
                            See Live Simulation →
                        </Button>
                    </div>
                </ScrollReveal>

                {/* Key Value Propositions */}
                <ScrollReveal delay={100}>
                    <section className="grid md:grid-cols-3 gap-6">
                        {[
                            { icon: Shield, title: 'Non-Spoofable', desc: 'Physical sky state acts as cryptographic witness. Cannot be faked.' },
                            { icon: Satellite, title: 'Earth-Independent', desc: 'No GPS. No ground stations. No real-time comms needed.' },
                            { icon: Lock, title: 'Additive Layer', desc: 'Plugs into existing RF/optical comms — zero infrastructure changes.' },
                        ].map((item) => (
                            <div
                                key={item.title}
                                className="glass p-7 rounded-3xl space-y-3 hover:border-cosmic-blue/50 transition-all duration-500 group"
                            >
                                <div className="w-11 h-11 rounded-2xl bg-cosmic-blue/10 flex items-center justify-center group-hover:bg-cosmic-blue/20 transition-colors duration-300">
                                    <item.icon className="w-5 h-5 text-cosmic-blue" />
                                </div>
                                <h3 className="font-serif text-lg text-foreground">{item.title}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </section>
                </ScrollReveal>

                {/* Operational Flow — compact visual timeline */}
                <ScrollReveal delay={200}>
                    <section className="space-y-10">
                        <div className="text-center space-y-2">
                            <h3 className="font-serif text-3xl md:text-4xl text-foreground">Operational Flow</h3>
                            <p className="text-muted-foreground text-sm max-w-xl mx-auto">
                                Seven steps from command input to authorized execution — all physics-verified
                            </p>
                        </div>

                        {/* Desktop: horizontal pipeline */}
                        <div className="hidden lg:flex items-center justify-between gap-1 glass p-8 rounded-[2.5rem] border-white/5 overflow-x-auto">
                            {flowSteps.map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <div key={item.step} className="flex items-center gap-1 flex-shrink-0">
                                        <div className={`flex flex-col items-center gap-2 px-4 py-5 rounded-2xl border transition-all duration-300 ${item.border} ${item.highlight ? 'bg-cosmic-blue/5' : item.success ? 'bg-emerald-500/5' : 'bg-white/[0.02]'}`}>
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.bg}`}>
                                                <Icon className={`w-5 h-5 ${item.color}`} />
                                            </div>
                                            <span className={`font-mono text-[10px] font-bold ${item.color}`}>{item.step}</span>
                                            <span className="text-xs text-center text-foreground/80 font-medium max-w-[72px] leading-tight">{item.label}</span>
                                        </div>
                                        {index < flowSteps.length - 1 && (
                                            <ArrowRight className="w-4 h-4 text-white/15 flex-shrink-0" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Mobile: compact 2-col grid */}
                        <div className="lg:hidden grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {flowSteps.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <div key={item.step} className={`flex flex-col items-center gap-2 p-4 rounded-2xl border text-center ${item.border} ${item.highlight ? 'bg-cosmic-blue/5' : item.success ? 'bg-emerald-500/5' : 'bg-white/[0.02]'}`}>
                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.bg}`}>
                                            <Icon className={`w-4 h-4 ${item.color}`} />
                                        </div>
                                        <span className={`font-mono text-[10px] font-bold ${item.color}`}>{item.step}</span>
                                        <span className="text-xs text-foreground/80 font-medium leading-tight">{item.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </ScrollReveal>

                {/* Live Simulation */}
                <ScrollReveal delay={300}>
                    <section id="simulation" className="space-y-10">
                        <div className="text-center space-y-2">
                            <h3 className="font-serif text-3xl md:text-4xl text-foreground">Live Demonstration</h3>
                            <p className="text-muted-foreground text-sm max-w-xl mx-auto">
                                Stellar-referenced command authorization in action
                            </p>
                        </div>
                        <div className="glass p-8 md:p-12 rounded-[3rem] border-cosmic-blue/20">
                            <B2BPreviewSimulator />
                        </div>
                    </section>
                </ScrollReveal>

                {/* Technical Plausibility — infographic stat cards */}
                <ScrollReveal delay={400}>
                    <section className="space-y-10">
                        <div className="text-center space-y-2">
                            <h3 className="font-serif text-3xl md:text-4xl text-foreground">Why It Works</h3>
                            <p className="text-muted-foreground text-sm max-w-xl mx-auto">
                                Built on existing spacecraft hardware — no new components required
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {techPillars.map((pillar) => (
                                <div
                                    key={pillar.label}
                                    className="glass p-6 rounded-3xl space-y-3 border-white/5 hover:border-cosmic-blue/30 transition-all duration-500 group text-center"
                                >
                                    <div className="text-3xl">{pillar.icon}</div>
                                    <div className="font-serif text-2xl font-bold text-gradient-gold">{pillar.stat}</div>
                                    <div className="text-sm font-semibold text-foreground">{pillar.label}</div>
                                    <div className="text-xs text-muted-foreground leading-relaxed">{pillar.sub}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                </ScrollReveal>

                {/* Target Applications — visual icon tiles */}
                <ScrollReveal delay={500}>
                    <section className="space-y-10">
                        <div className="text-center space-y-2">
                            <h3 className="font-serif text-3xl md:text-4xl text-foreground">Target Applications</h3>
                        </div>

                        <div className="grid md:grid-cols-3 gap-5">
                            {applications.map((app) => {
                                const Icon = app.icon;
                                return (
                                    <div
                                        key={app.label}
                                        className="p-7 rounded-3xl border border-cosmic-blue/20 bg-cosmic-blue/5 hover:border-cosmic-blue/50 hover:bg-cosmic-blue/10 transition-all duration-500 group space-y-4"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="w-12 h-12 rounded-2xl bg-cosmic-blue/15 flex items-center justify-center group-hover:bg-cosmic-blue/25 transition-colors">
                                                <Icon className="w-6 h-6 text-cosmic-blue" />
                                            </div>
                                            <span className="text-[10px] font-mono px-2 py-1 rounded-full border border-cosmic-blue/20 text-cosmic-blue bg-cosmic-blue/5">
                                                {app.tag}
                                            </span>
                                        </div>
                                        <h4 className="font-serif text-xl text-foreground">{app.label}</h4>
                                        <p className="text-muted-foreground text-sm leading-relaxed">{app.desc}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </ScrollReveal>

                {/* Compact Clarification Banner */}
                <ScrollReveal delay={600}>
                    <div className="flex items-center gap-6 p-6 rounded-2xl border border-amber-500/20 bg-amber-500/5">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                            <Shield className="w-5 h-5 text-amber-500" />
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            <span className="text-amber-400 font-semibold">Verification Witness, Not Control — </span>
                            Stars don't command satellites. They act as{' '}
                            <strong className="text-foreground">non-spoofable physical authorization keys</strong>.
                            The star tracker observes, the onboard system verifies, the command executes — no ground contact needed.
                        </p>
                    </div>
                </ScrollReveal>

            </div>
        </section>
    );
};
