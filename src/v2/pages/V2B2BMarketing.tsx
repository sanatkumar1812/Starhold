import React from 'react';
import { V2Layout } from '../layout/V2Layout';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Satellite, Shield, Lock, Radio, Eye, CheckCircle2, Cpu } from 'lucide-react';
import { B2BPreviewSimulator } from '@/components/B2BPreviewSimulator';

const V2B2BMarketing = () => {
    const navigate = useNavigate();

    return (
        <V2Layout>
            <div className="min-h-screen relative overflow-hidden bg-[#040814] pt-32 pb-20 px-6">
                <main className="max-w-7xl mx-auto space-y-32">

                    {/* Hero Section */}
                    <ScrollReveal>
                        <div className="text-center space-y-8 max-w-5xl mx-auto">
                            <h4 className="font-aerospace text-xs font-bold text-cyan-500 uppercase tracking-[0.4em]">DEFENSE INFRASTRUCTURE</h4>
                            <h1 className="font-aerospace text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black uppercase tracking-tight text-white leading-[1]">
                                Stellar-Referenced <br />
                                Command <span className="text-cyan-400">Authorization</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-zinc-400 font-technical font-light leading-relaxed max-w-3xl mx-auto">
                                A physics-based verification layer for satellite commands. Uses star tracker observations
                                as non-spoofable authorization keys-no GPS, no ground contact required.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
                                <Button
                                    onClick={() => navigate('/v2/techdocs')}
                                    className="bg-cyan-500 hover:bg-cyan-400 text-[#040814] h-14 px-8 font-aerospace font-bold uppercase tracking-widest rounded-none aerospace-border aerospace-border-tl transition-all group"
                                >
                                    <Cpu className="w-5 h-5 mr-3" />
                                    Read Architecture Docs
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => document.getElementById('simulation')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="border-white/10 text-white hover:bg-white/5 h-14 px-8 font-aerospace font-bold uppercase tracking-widest rounded-none transition-all"
                                >
                                    Observe Simulation →
                                </Button>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Value Propositions */}
                    <ScrollReveal delay={200}>
                        <section className="grid lg:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: Shield,
                                    title: 'Non-Spoofable Verification',
                                    description: 'Star observations cannot be faked. Physical sky state acts as cryptographic witness.',
                                },
                                {
                                    icon: Satellite,
                                    title: 'Earth-Independent',
                                    description: 'No reliance on GPS, ground stations, or real-time comms. Autonomous deep-space ready.',
                                },
                                {
                                    icon: Lock,
                                    title: 'Additive Security Layer',
                                    description: 'Does not replace RF/optical comms. Adds physics-based authorization condition.',
                                },
                            ].map((item, idx) => (
                                <div key={idx} className="bg-white/[0.02] border border-white/5 p-10 aerospace-border aerospace-border-tl group hover:bg-white/[0.04] transition-colors relative">
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-cyan-500/10 to-transparent pointer-events-none" />
                                    <div className="w-12 h-12 flex items-center justify-center bg-cyan-500/10 text-cyan-400 mb-8 group-hover:bg-cyan-500 group-hover:text-black transition-all">
                                        <item.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-aerospace text-xl font-bold uppercase tracking-widest text-white mb-4">{item.title}</h3>
                                    <p className="text-zinc-400 font-technical text-sm leading-relaxed">{item.description}</p>
                                </div>
                            ))}
                        </section>
                    </ScrollReveal>

                    {/* Operational Flow */}
                    <ScrollReveal delay={400}>
                        <section className="space-y-16">
                            <div className="text-center space-y-4">
                                <h2 className="font-aerospace text-4xl font-black uppercase tracking-widest text-white">Operational <span className="text-cyan-400">Flow</span></h2>
                                <p className="text-zinc-500 font-technical max-w-2xl mx-auto uppercase tracking-widest text-xs">
                                    Integration with existing satellite command infrastructure
                                </p>
                            </div>

                            <div className="bg-black/40 border border-white/5 p-8 md:p-12 aerospace-border relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
                                <div className="space-y-4 relative z-10">
                                    {[
                                        {
                                            step: '01', title: 'Operator Inputs Command', description: 'Ground operator enters command into Starhold interface with mission parameters.', icon: Cpu, type: 'default'
                                        },
                                        {
                                            step: '02', title: 'Stellar Binding', description: 'Command encrypted and bound to: target star (RA/Dec), magnitude, catalog ID, satellite TLE, predicted attitude, execution window.', icon: Lock, type: 'technical'
                                        },
                                        {
                                            step: '03', title: 'Standard Uplink', description: 'Encrypted command uplinked via normal RF/optical comms. No changes to existing infrastructure.', icon: Radio, type: 'default'
                                        },
                                        {
                                            step: '04', title: 'Onboard Storage', description: 'Satellite stores encrypted command in queue. Command remains locked until authorization condition met.', icon: Satellite, type: 'default'
                                        },
                                        {
                                            step: '05', title: 'Star Tracker Observation', description: 'Satellite star tracker autonomously observes sky. Pattern matching against star catalog.', icon: Eye, type: 'technical'
                                        },
                                        {
                                            step: '06', title: 'Authorization Check', description: 'If observed star matches expected parameters (RA/Dec ±tolerance, magnitude, time window) → decryption key released.', icon: CheckCircle2, type: 'success'
                                        },
                                        {
                                            step: '07', title: 'Command Execution', description: 'Authorized command executed by satellite systems. If no match → command remains locked.', icon: CheckCircle2, type: 'success'
                                        },
                                    ].map((item, index) => (
                                        <div key={item.step} className={`p-6 border flex gap-6 items-start transition-colors ${item.type === 'technical' ? 'bg-cyan-500/5 border-cyan-500/20' :
                                            item.type === 'success' ? 'bg-emerald-500/5 border-emerald-500/20' :
                                                'bg-[#040814] border-white/5 hover:bg-white/[0.02]'
                                            }`}>
                                            <div className={`w-12 h-12 flex-shrink-0 flex items-center justify-center font-aerospace font-bold text-sm ${item.type === 'technical' ? 'bg-cyan-500/10 text-cyan-400' :
                                                item.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' :
                                                    'bg-white/5 text-zinc-400'
                                                }`}>
                                                {item.step}
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-aerospace font-bold uppercase tracking-widest text-white text-lg">{item.title}</h3>
                                                    <item.icon className={`w-5 h-5 ${item.type === 'technical' ? 'text-cyan-400' :
                                                        item.type === 'success' ? 'text-emerald-400' :
                                                            'text-zinc-500'
                                                        }`} />
                                                </div>
                                                <p className="text-zinc-400 font-technical text-sm">{item.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </ScrollReveal>

                    {/* Simulation Module */}
                    <ScrollReveal delay={600}>
                        <section id="simulation" className="space-y-16 pt-16">
                            <div className="text-center space-y-4">
                                <h2 className="font-aerospace text-4xl font-black uppercase tracking-widest text-white">Live <span className="text-purple-400">Simulation</span></h2>
                                <p className="text-zinc-500 font-technical max-w-2xl mx-auto uppercase tracking-widest text-xs">
                                    Interactive demonstration of stellar-referenced command authorization
                                </p>
                            </div>
                            <div className="bg-[#040814] p-2 border border-white/10 aerospace-border shadow-[0_0_50px_rgba(168,85,247,0.1)]">
                                <B2BPreviewSimulator />
                            </div>
                            <div className="text-center pt-8">
                                <Button
                                    onClick={() => navigate('/v2/for-missions/console')}
                                    className="bg-transparent border border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black h-14 px-12 font-aerospace font-bold uppercase tracking-widest rounded-none transition-all"
                                >
                                    Enter Active Mission Console
                                </Button>
                            </div>
                        </section>
                    </ScrollReveal>

                    {/* Call to Action */}
                    <ScrollReveal delay={800}>
                        <section className="bg-gradient-to-br from-cyan-900/20 to-purple-900/20 border border-t-cyan-500/30 border-b-purple-500/30 border-l-transparent border-r-transparent py-24 text-center mt-32 relative overflow-hidden">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-full bg-[radial-gradient(circle_at_center,rgba(0,224,240,0.1)_0%,transparent_70%)] blur-2xl pointer-events-none" />
                            <div className="relative z-10 space-y-10 max-w-2xl mx-auto px-6">
                                <h2 className="font-aerospace text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
                                    Ready to Deploy?
                                </h2>
                                <p className="text-zinc-400 font-technical text-lg leading-relaxed">
                                    Contact our aerospace engineering team to discuss integration pipelines and security clearances for your satellite constellation.
                                </p>
                                <Button
                                    onClick={() => navigate('/v2/contact')}
                                    className="bg-white text-black hover:bg-cyan-400 h-16 px-12 text-lg font-aerospace font-bold uppercase tracking-widest rounded-none transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                                >
                                    Initiate Contact Protocol
                                </Button>
                            </div>
                        </section>
                    </ScrollReveal>

                </main>
            </div>
        </V2Layout>
    );
};

export default V2B2BMarketing;
