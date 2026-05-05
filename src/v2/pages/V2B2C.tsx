import React from 'react';
import { V2Layout } from '../layout/V2Layout';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
    Star, Lock, Calendar, Image, Gift, Sparkles,
    Shield, Radio, Box, Map, Globe, Palette, Clock,
    ChevronRight, Cpu, Zap, Activity
} from 'lucide-react';

const V2Consumer = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const handleCreateMemory = () => {
        if (!isAuthenticated) {
            navigate('/auth?redirect=create');
        } else {
            navigate('/dashboard?create=true');
        }
    };

    return (
        <V2Layout>
            <main className="pt-32 pb-20 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 space-y-40">

                    {/* Hero Section */}
                    <section className="relative flex flex-col items-center text-center space-y-10">
                        <ScrollReveal>
                            <div className="space-y-6">
                                <h4 className="font-aerospace text-purple-400 font-bold uppercase tracking-[0.5em] text-xs">CIVILIAN ARCHIVE PROTOCOL</h4>
                                <h1 className="font-aerospace text-6xl md:text-8xl font-black uppercase tracking-tight leading-[0.9] text-white">
                                    Cosmic Memory <br />
                                    <span className="text-shadow-glow">Registry</span>
                                </h1>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal delay={200}>
                            <p className="max-w-3xl text-xl text-zinc-400 font-technical font-light leading-relaxed">
                                Secure your personal legacy within the immutable physics of the cosmos. Each entry is anchored to a unique celestial coordinate-encrypted, time-locked, and preserved across deep-space infrastructure.
                            </p>
                        </ScrollReveal>

                        <ScrollReveal delay={400}>
                            <Button
                                onClick={handleCreateMemory}
                                className="bg-purple-500 hover:bg-purple-400 text-[#0A0A12] px-12 py-8 text-xl font-aerospace font-bold uppercase tracking-widest rounded-none aerospace-border aerospace-border-tl shadow-[0_0_40px_rgba(168,85,247,0.15)] transition-all hover:scale-105"
                            >
                                <Star className="w-6 h-6 mr-3" />
                                Initialize Your Record
                            </Button>
                        </ScrollReveal>

                        {/* Background HUD Decor */}
                        <div className="absolute -top-20 -left-20 w-[500px] h-[500px] border border-purple-500/5 rounded-full animate-spin-slow opacity-20 pointer-events-none" />
                    </section>

                    {/* Technical Workflow */}
                    <section className="space-y-20">
                        <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-white/5 pb-12">
                            <div className="space-y-4">
                                <h2 className="font-aerospace text-4xl font-black uppercase tracking-wider">The Archival <span className="text-purple-400">Process</span></h2>
                                <p className="text-zinc-500 font-technical uppercase tracking-widest text-xs">Standard Operating Procedure // Starhold Civil Div.</p>
                            </div>
                            <div className="hidden md:flex items-center gap-4 text-[10px] font-aerospace text-zinc-600 tracking-[0.2em]">
                                <span>STATUS: READY</span>
                                <Activity className="w-3 h-3" />
                                <span>LATENCY: 12ms</span>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-1">
                            {[
                                {
                                    id: "01",
                                    icon: Cpu,
                                    title: "DIGITIZATION",
                                    desc: "Data is converted into high-entropy shards, optimized for orbital cold storage."
                                },
                                {
                                    id: "02",
                                    icon: Map,
                                    title: "ANCHORING",
                                    desc: "Precise J2000.0 coordinates are assigned via the onboard star tracker."
                                },
                                {
                                    id: "03",
                                    icon: Shield,
                                    title: "ENCRYPTION",
                                    desc: "Military-grade AES-256 protocols shield your record until release."
                                },
                                {
                                    id: "04",
                                    icon: Radio,
                                    title: "UPLINK",
                                    desc: "Data is transmitted to our LEO mesh network for multi-node redundancy."
                                }
                            ].map((item, id) => (
                                <div key={id} className="group bg-[#0A0A12] border border-white/5 p-10 hover:bg-white/[0.02] transition-colors relative h-full">
                                    <div className="absolute top-4 right-6 font-aerospace text-sm font-bold text-white/10 group-hover:text-purple-500/20 transition-colors">
                                        {item.id}
                                    </div>
                                    <div className="space-y-6 flex flex-col h-full">
                                        <div className="w-12 h-12 flex items-center justify-center bg-purple-500/10 text-purple-400 group-hover:bg-purple-500 group-hover:text-[#0A0A12] transition-all duration-500">
                                            <item.icon className="w-6 h-6" />
                                        </div>
                                        <div className="space-y-4 flex-1">
                                            <h3 className="font-aerospace text-xl font-bold uppercase tracking-widest group-hover:text-purple-400 transition-colors">{item.title}</h3>
                                            <p className="text-zinc-500 text-sm font-technical leading-relaxed">
                                                {item.desc}
                                            </p>
                                        </div>
                                        <div className="pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="w-8 h-[2px] bg-purple-500" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Features Grid */}
                    <section className="grid lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Globe,
                                title: "CELESTIAL VERIFICATION",
                                desc: "Every address is verified against ESA astronomical catalogs for 100% precision."
                            },
                            {
                                icon: Sparkles,
                                title: "DEEP SPACE OPTICS",
                                desc: "Receive high-definition imagery of your star's sector from orbital sensors."
                            },
                            {
                                icon: Palette,
                                title: "TANGIBLE ARTIFACTS",
                                desc: "Optional physical star maps engraved with your precise J2000.0 address."
                            }
                        ].map((feature, id) => (
                            <div key={id} className="p-12 border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent aerospace-border aerospace-border-tl space-y-8">
                                <feature.icon className="w-10 h-10 text-purple-500" />
                                <div className="space-y-4">
                                    <h3 className="font-aerospace text-2xl font-bold uppercase tracking-widest text-white">{feature.title}</h3>
                                    <p className="text-zinc-400 font-technical text-sm leading-relaxed">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </section>

                    {/* Final CTA */}
                    <section className="text-center py-20 relative">
                        <div className="absolute inset-0 bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />
                        <ScrollReveal>
                            <div className="space-y-10 relative z-10">
                                <h2 className="font-aerospace text-5xl md:text-7xl font-black uppercase tracking-tight">
                                    Preserve Your <br />
                                    <span className="text-purple-400">Legacy Forever</span>
                                </h2>
                                <p className="max-w-xl mx-auto text-zinc-400 font-technical text-lg">
                                    Join the elite circle of individuals who have anchored their humanity to the stars.
                                    Your story deserves a place in the infinite.
                                </p>
                                <Button
                                    onClick={handleCreateMemory}
                                    className="bg-purple-500 hover:bg-purple-400 text-[#0A0A12] px-12 py-8 text-xl font-aerospace font-bold uppercase tracking-widest rounded-none aerospace-border aerospace-border-tl shadow-[0_0_40px_rgba(168,85,247,0.15)] transition-all hover:scale-105"
                                >
                                    Initiate Your Stellar Vault
                                </Button>
                            </div>
                        </ScrollReveal>
                    </section>

                </div>
            </main>
        </V2Layout>
    );
};

export default V2Consumer;
