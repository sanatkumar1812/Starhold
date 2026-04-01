import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ScrollReveal } from '@/components/ScrollReveal';
import {
    Cpu, Shield, Lock, Radio, Zap, ChevronRight,
    Layers, Globe, Terminal, FileText, Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DraftLandingPage = () => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-[#0A0A12] text-white font-inter selection:bg-cyan-500/30">
            {/* Custom Navigation for Draft */}
            <Navigation />

            <main>
                {/* Section 1: Hero Header */}
                <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
                    {/* Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A12] via-[#121226] to-[#0A0A12]" />

                    {/* Hero Assets Background Animation */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-cyan-500/10 rounded-full animate-spin-slow" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-blue-500/5 rounded-full animate-spin-reverse-slow" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,224,240,0.05)_0%,transparent_70%)]" />
                    </div>

                    <div className="relative z-10 w-full max-w-7xl mx-auto px-4 text-center space-y-12">
                        {/* Logo Animation Container */}
                        <div className="flex justify-center mb-8">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-cyan-400 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                                <img
                                    src="draft/logo_aerospace.png"
                                    alt="StarHold Logo"
                                    className="relative w-32 md:w-48 h-auto drop-shadow-[0_0_15px_rgba(0,224,240,0.3)]"
                                />
                            </div>
                        </div>

                        {/* Heading */}
                        <ScrollReveal>
                            <h1 className="font-rajdhani text-5xl md:text-8xl font-bold uppercase tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-cyan-400/80">
                                Information Secured <br />
                                <span className="text-cyan-400">by Sky & Time</span>
                            </h1>
                        </ScrollReveal>

                        <ScrollReveal delay={200}>
                            <p className="max-w-3xl mx-auto text-lg md:text-xl text-zinc-400 leading-relaxed font-light">
                                The world's first celestial-referenced information infrastructure, turning stars into unique, un-hackable, physics-based encryption keys for both personal legacy and aerospace security.
                            </p>
                        </ScrollReveal>

                        {/* CTAs */}
                        <ScrollReveal delay={400}>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
                                <Button
                                    onClick={() => navigate('/observatory')}
                                    className="bg-cyan-500 hover:bg-cyan-400 text-[#0A0A12] px-10 py-7 text-lg font-rajdhani font-bold uppercase tracking-widest rounded-none shadow-[0_0_30px_rgba(0,224,240,0.2)] transition-all hover:scale-105"
                                >
                                    Launch Simulation
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => window.open('Starhold Market and Technical Research.pdf', '_blank')}
                                    className="border-white/10 text-white hover:bg-white/5 px-10 py-7 text-lg font-rajdhani font-bold uppercase tracking-widest rounded-none transition-all"
                                >
                                    Download Whitepaper
                                </Button>
                            </div>
                        </ScrollReveal>

                        {/* Star Map Animation (Subtle CSS) */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-screen opacity-10 pointer-events-none overflow-hidden">
                            <div className="hero-star-grid" />
                        </div>
                    </div>
                </section>

                {/* Section 2: How It Works */}
                <section className="py-32 w-full max-w-7xl mx-auto px-4 relative">
                    <div className="text-center mb-20">
                        <h2 className="font-rajdhani text-4xl md:text-5xl font-bold uppercase tracking-widest text-cyan-400 mb-4">How It Works</h2>
                        <div className="w-20 h-1 bg-cyan-500 mx-auto" />
                    </div>

                    <div className="relative">
                        {/* Connection Line */}
                        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent hidden lg:block" />

                        <div className="grid lg:grid-cols-4 gap-8 relative z-10">
                            {[
                                {
                                    step: "01",
                                    header: "Define",
                                    title: "Input Command",
                                    desc: "Message is bound to a unique celestial coordinate and time window.",
                                    icon: Terminal
                                },
                                {
                                    step: "02",
                                    header: "Encrypt",
                                    title: "Spectral Shield",
                                    desc: "StarHold harvests spectral data to generate an environmental key.",
                                    icon: Lock,
                                    img: "draft/spectral_key.png"
                                },
                                {
                                    step: "03",
                                    header: "Verify",
                                    title: "Uplink Signal",
                                    desc: "The onboard star tracker confirms alignment with the anchor star.",
                                    icon: Radio
                                },
                                {
                                    step: "04",
                                    header: "Access",
                                    title: "Physics Release",
                                    desc: "The physics of the moment decrypt the information.",
                                    icon: Zap
                                }
                            ].map((item, id) => (
                                <ScrollReveal key={id} delay={id * 100}>
                                    <div className="group space-y-6 text-center">
                                        <div className="w-20 h-20 mx-auto bg-[#121226] border border-cyan-500/20 rounded-2xl flex items-center justify-center relative group-hover:border-cyan-500 group-hover:shadow-[0_0_20px_rgba(0,224,240,0.2)] transition-all">
                                            {item.img ? (
                                                <img src={item.img} alt={item.title} className="w-12 h-12 object-contain" />
                                            ) : (
                                                <item.icon className="w-10 h-10 text-cyan-500" />
                                            )}
                                            <div className="absolute -top-3 -right-3 text-xs font-rajdhani font-bold bg-cyan-500 text-black px-2 py-1">
                                                {item.step}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-rajdhani text-sm font-bold text-cyan-400 uppercase tracking-widest">{item.header}</h4>
                                            <h3 className="text-xl font-bold">{item.title}</h3>
                                            <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Section 3: Dual Use Cases */}
                <section className="py-20 bg-gradient-to-b from-[#0A0A12] to-black">
                    <div className="grid md:grid-cols-2 gap-0">
                        {/* B2C Panel */}
                        <div className="relative group overflow-hidden border-r border-white/5">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1464802686167-b939a6910659?q=80&w=2070')] bg-cover bg-center opacity-30 group-hover:scale-105 transition-transform duration-1000" />
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 to-[#0A0A12]" />
                            <div className="relative p-16 md:p-24 space-y-8 h-full flex flex-col justify-center">
                                <div className="space-y-4">
                                    <h4 className="font-rajdhani text-purple-400 font-bold uppercase tracking-widest">B2C ARCHIVE</h4>
                                    <h2 className="font-serif text-4xl md:text-5xl border-l-4 border-purple-500 pl-6">Cosmic Memory Registry</h2>
                                </div>
                                <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
                                    An archival data-persistence layer for personal legacy, anchoring memories to the cosmos until their designated time.
                                </p>
                                <Button
                                    variant="link"
                                    className="text-white p-0 flex items-center gap-2 group/btn font-rajdhani uppercase tracking-widest"
                                    onClick={() => navigate('/for-you')}
                                >
                                    Explore Personal Archive <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        </div>

                        {/* B2B Panel */}
                        <div className="relative group overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072')] bg-cover bg-center opacity-30 group-hover:scale-105 transition-transform duration-1000" />
                            <div className="absolute inset-0 bg-gradient-to-l from-cyan-900/40 to-[#0A0A12]" />
                            <div className="relative p-16 md:p-24 space-y-8 h-full flex flex-col justify-center">
                                <div className="space-y-4">
                                    <h4 className="font-rajdhani text-cyan-400 font-bold uppercase tracking-widest">B2B DEFENSE</h4>
                                    <h2 className="font-serif text-4xl md:text-5xl border-l-4 border-cyan-500 pl-6">Aerospace Command Authorization</h2>
                                </div>
                                <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
                                    A non-spoofable, physics-based security layer for satellite control, preventing credential theft and key exposure.
                                </p>
                                <Button
                                    variant="link"
                                    className="text-white p-0 flex items-center gap-2 group/btn font-rajdhani uppercase tracking-widest"
                                    onClick={() => navigate('/for-missions')}
                                >
                                    Review Mission Specs <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 4: Roadmap */}
                <section className="py-32 w-full max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="font-rajdhani text-4xl font-bold uppercase tracking-widest text-cyan-400">StarHold Deployment Roadmap</h2>
                        <p className="text-zinc-500 font-mono text-sm uppercase">Mission Timeline: 2024 - 2026</p>
                    </div>

                    <div className="glass p-12 rounded-3xl border-white/5 bg-gradient-to-br from-white/5 to-transparent">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                            {/* Connecting Line */}
                            <div className="absolute top-[40px] left-0 w-full h-px bg-cyan-500/20 hidden md:block" />

                            {[
                                { phase: "Phase 1", title: "Terrestrial Alpha", status: "Completed", date: "Q1 2024" },
                                { phase: "Phase 2", title: "Consumer Observatory", status: "Live", date: "Q3 2024" },
                                { phase: "Phase 3", title: "LEO Deployment", status: "Scheduled", date: "Q2 2025" },
                                { phase: "Phase 4", title: "Deep Space Mesh", status: "R&D", date: "2026" }
                            ].map((step, id) => (
                                <div key={id} className="relative z-10 space-y-6">
                                    <div className="w-20 h-20 rounded-full bg-[#0A0A12] border-2 border-cyan-500/30 flex items-center justify-center mx-auto ring-8 ring-cyan-500/5">
                                        <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
                                    </div>
                                    <div className="text-center space-y-1">
                                        <span className="font-rajdhani font-bold text-cyan-500 uppercase tracking-tighter text-xs">{step.phase}</span>
                                        <h4 className="font-bold">{step.title}</h4>
                                        <p className="text-zinc-500 text-xs font-mono">{step.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-16 text-center max-w-2xl mx-auto">
                            <p className="text-zinc-400 italic">
                                "Phase 1 uses consumer market revenue to fund the critical expansion of the high-fidelity celestial database required for the Phase 2 LEO deployment."
                            </p>
                        </div>
                    </div>
                </section>

                {/* Section 5: The Challenge */}
                <section className="py-32 bg-[#05050a] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/10 blur-[150px] -translate-y-1/2 translate-x-1/2" />
                    <div className="w-full max-w-5xl mx-auto px-4 text-center space-y-12">
                        <ScrollReveal>
                            <h2 className="font-rajdhani text-4xl md:text-6xl font-bold uppercase leading-tight">
                                Solving the <span className="text-red-500">$500B</span> <br />
                                Space Cybersecurity Crisis
                            </h2>
                        </ScrollReveal>
                        <ScrollReveal delay={200}>
                            <p className="text-xl text-zinc-400 leading-relaxed font-light">
                                As orbital assets proliferate, standard digital encryption is vulnerable. StarHold moves the key generation from hackable ground servers to the immutable physical properties of distant stars, introducing <span className="text-white font-medium">Environmental Key Derivation</span> as the new zero-trust standard.
                            </p>
                        </ScrollReveal>
                        <ScrollReveal delay={400}>
                            <div className="inline-block p-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent w-full" />
                        </ScrollReveal>
                    </div>
                </section>
            </main>

            {/* Section 6: Footer */}
            <footer className="bg-black py-20 border-t border-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-cyan-400/5 blur-[100px]" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col items-center space-y-12">
                        <div className="flex items-center gap-6 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
                            <img
                                src="draft/logo_aerospace.png"
                                alt="StarHold"
                                className="w-16 h-auto"
                            />
                            <h3 className="font-rajdhani text-2xl font-bold uppercase tracking-[0.4em]">StarHold</h3>
                        </div>

                        <nav className="flex flex-wrap justify-center gap-8 md:gap-16">
                            {["About", "Docs", "B2C Registry", "B2B Security", "Press Kit"].map(link => (
                                <a key={link} href="#" className="font-rajdhani uppercase text-sm font-medium tracking-widest text-zinc-500 hover:text-cyan-400 transition-colors">
                                    {link}
                                </a>
                            ))}
                        </nav>

                        <div className="text-center space-y-4">
                            <p className="font-rajdhani text-zinc-600 uppercase tracking-widest text-sm italic">
                                "Address Your Data to the Stars."
                            </p>
                            <p className="text-zinc-500 text-xs font-mono">
                                © 2024 StarHold Technologies Inc. | All Rights Reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </footer>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes spin-slow {
                    from { transform: translate(-50%, -50%) rotate(0deg); }
                    to { transform: translate(-50%, -50%) rotate(360deg); }
                }
                @keyframes spin-reverse-slow {
                    from { transform: translate(-50%, -50%) rotate(0deg); }
                    to { transform: translate(-50%, -50%) rotate(-360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 120s linear infinite;
                }
                .animate-spin-reverse-slow {
                    animation: spin-reverse-slow 80s linear infinite;
                }
                .hero-star-grid {
                    background-image: 
                        radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0);
                    background-size: 40px 40px;
                    width: 200%;
                    height: 200%;
                    transform: rotate(15deg);
                }
                .font-rajdhani { font-family: 'Rajdhani', sans-serif; }
                .font-inter { font-family: 'Inter', sans-serif; }
            `}} />
        </div>
    );
};

export default DraftLandingPage;
