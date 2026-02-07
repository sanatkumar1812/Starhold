import { CosmicBackground } from '@/components/CosmicBackground';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Button } from '@/components/ui/button';
import { Satellite, Shield, Lock, Radio, Eye, CheckCircle2, XCircle, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ScrollToTop } from '@/components/ScrollToTop';

const B2BDetailPage = () => {
    return (
        <div className="min-h-screen relative overflow-hidden bg-background">
            <CosmicBackground />
            <div className="relative z-10">
                <Navigation />

                <main className="pt-32 pb-20 px-4">
                    <div className="max-w-7xl mx-auto space-y-32">
                        {/* Hero Section */}
                        <ScrollReveal>
                            <div className="text-center space-y-8">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cosmic-blue/30 bg-cosmic-blue/10 text-sm text-cosmic-blue font-mono uppercase tracking-widest">
                                    For Mission Systems
                                </div>
                                <h1 className="font-serif text-5xl md:text-7xl text-foreground leading-tight">
                                    Stellar-Referenced <br />
                                    Command Authorization
                                </h1>
                                <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                                    A physics-based verification layer for satellite commands. Uses star tracker observations
                                    as non-spoofable authorization keys—no GPS, no ground contact required.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                                    <Button
                                        variant="outline"
                                        size="lg"
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
                            </div>
                        </ScrollReveal>

                        {/* Key Value Propositions */}
                        <ScrollReveal delay={100}>
                            <section className="grid md:grid-cols-3 gap-8">
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
                                ].map((item) => (
                                    <div
                                        key={item.title}
                                        className="glass p-8 rounded-3xl space-y-4 hover:border-cosmic-blue/50 transition-all duration-500"
                                    >
                                        <div className="w-12 h-12 rounded-2xl bg-cosmic-blue/10 flex items-center justify-center">
                                            <item.icon className="w-6 h-6 text-cosmic-blue" />
                                        </div>
                                        <h3 className="font-serif text-xl text-foreground">{item.title}</h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                                    </div>
                                ))}
                            </section>
                        </ScrollReveal>

                        {/* Operational Flow */}
                        <ScrollReveal delay={200}>
                            <section className="space-y-12">
                                <div className="text-center space-y-4">
                                    <h2 className="font-serif text-4xl md:text-5xl text-foreground">
                                        Operational Flow
                                    </h2>
                                    <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                                        How stellar-referenced authorization integrates with existing satellite command infrastructure
                                    </p>
                                </div>

                                <div className="glass p-12 rounded-[3rem] border-white/5">
                                    <div className="space-y-8">
                                        {[
                                            {
                                                step: '01',
                                                title: 'Operator Inputs Command',
                                                description: 'Ground operator enters command into Starhold interface with mission parameters.',
                                                icon: Cpu,
                                            },
                                            {
                                                step: '02',
                                                title: 'Stellar Binding',
                                                description: 'Command encrypted and bound to: target star (RA/Dec), magnitude, catalog ID, satellite TLE, predicted attitude, execution window.',
                                                icon: Lock,
                                                technical: true,
                                            },
                                            {
                                                step: '03',
                                                title: 'Standard Uplink',
                                                description: 'Encrypted command uplinked via normal RF/optical comms. No changes to existing infrastructure.',
                                                icon: Radio,
                                            },
                                            {
                                                step: '04',
                                                title: 'Onboard Storage',
                                                description: 'Satellite stores encrypted command in queue. Command remains locked until authorization condition met.',
                                                icon: Satellite,
                                            },
                                            {
                                                step: '05',
                                                title: 'Star Tracker Observation',
                                                description: 'Satellite star tracker autonomously observes sky. Pattern matching against star catalog.',
                                                icon: Eye,
                                                technical: true,
                                            },
                                            {
                                                step: '06',
                                                title: 'Authorization Check',
                                                description: 'If observed star matches expected parameters (RA/Dec ±tolerance, magnitude, time window) → decryption key released.',
                                                icon: CheckCircle2,
                                                success: true,
                                            },
                                            {
                                                step: '07',
                                                title: 'Command Execution',
                                                description: 'Authorized command executed by satellite systems. If no match → command remains locked.',
                                                icon: CheckCircle2,
                                                success: true,
                                            },
                                        ].map((item, index) => (
                                            <div
                                                key={item.step}
                                                className={`flex gap-6 p-6 rounded-2xl border transition-all duration-500 ${item.technical
                                                    ? 'border-cosmic-blue/30 bg-cosmic-blue/5'
                                                    : item.success
                                                        ? 'border-green-500/30 bg-green-500/5'
                                                        : 'border-white/5 bg-slate-900/20'
                                                    }`}
                                            >
                                                <div className="flex-shrink-0">
                                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-mono text-sm ${item.technical
                                                        ? 'bg-cosmic-blue/10 text-cosmic-blue'
                                                        : item.success
                                                            ? 'bg-green-500/10 text-green-500'
                                                            : 'bg-primary/10 text-primary'
                                                        }`}>
                                                        {item.step}
                                                    </div>
                                                </div>
                                                <div className="flex-1 space-y-2">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <h3 className="font-serif text-xl text-foreground">{item.title}</h3>
                                                        <item.icon className={`w-5 h-5 flex-shrink-0 ${item.technical
                                                            ? 'text-cosmic-blue'
                                                            : item.success
                                                                ? 'text-green-500'
                                                                : 'text-primary'
                                                            }`} />
                                                    </div>
                                                    <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        </ScrollReveal>

                        {/* Interactive Simulation Placeholder */}
                        <ScrollReveal delay={300}>
                            <section id="simulation" className="space-y-12">
                                <div className="text-center space-y-4">
                                    <h2 className="font-serif text-4xl md:text-5xl text-foreground">
                                        Live Demonstration
                                    </h2>
                                    <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                                        Interactive simulation showing stellar-referenced command authorization in action
                                    </p>
                                </div>

                                <div className="glass p-12 rounded-[3rem] border-cosmic-blue/20">
                                    <div className="aspect-video rounded-2xl bg-slate-950/50 border border-cosmic-blue/20 flex items-center justify-center">
                                        <div className="text-center space-y-4">
                                            <Satellite className="w-16 h-16 text-cosmic-blue mx-auto animate-pulse" />
                                            <p className="text-muted-foreground font-mono text-sm">
                                                Interactive 3D simulation component
                                            </p>
                                            <p className="text-xs text-muted-foreground/60 max-w-md">
                                                Full simulation showing satellite orbit, star tracker FOV, star field,
                                                command authorization flow, and technical HUD will be implemented here
                                            </p>
                                            <Link to="/4d2">
                                                <Button variant="outline" size="sm" className="mt-4 border-cosmic-blue/30 text-cosmic-blue">
                                                    View Similar Simulation (4D Nav) →
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </ScrollReveal>

                        {/* Technical Plausibility */}
                        <ScrollReveal delay={400}>
                            <section className="space-y-12">
                                <div className="text-center space-y-4">
                                    <h2 className="font-serif text-4xl md:text-5xl text-foreground">
                                        Technical Plausibility
                                    </h2>
                                    <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                                        Why this works with existing spacecraft technology
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    {[
                                        {
                                            title: 'Star Trackers Already Exist',
                                            points: [
                                                'Standard attitude determination sensors on most satellites',
                                                'Identify stars by magnitude and angular position',
                                                'Sub-arcsecond precision capability',
                                                'Autonomous operation without ground contact',
                                            ],
                                        },
                                        {
                                            title: 'No Real-Time Ground Contact',
                                            points: [
                                                'Command uploaded during normal comm window',
                                                'Authorization happens onboard autonomously',
                                                'Ideal for deep-space missions with long light delays',
                                                'Reduces dependency on ground infrastructure',
                                            ],
                                        },
                                        {
                                            title: 'Non-Spoofable Physical Key',
                                            points: [
                                                'Cannot fake the actual sky state',
                                                'Star positions are deterministic and verifiable',
                                                'Requires precise attitude and timing',
                                                'Physical observation acts as cryptographic witness',
                                            ],
                                        },
                                        {
                                            title: 'Additive Security Layer',
                                            points: [
                                                'Does not replace existing command & control',
                                                'Works alongside RF/optical uplinks',
                                                'Adds physics-based authorization condition',
                                                'Graceful degradation if star tracker unavailable',
                                            ],
                                        },
                                    ].map((section) => (
                                        <div
                                            key={section.title}
                                            className="glass p-8 rounded-3xl space-y-6 border-white/5"
                                        >
                                            <h3 className="font-serif text-2xl text-foreground">{section.title}</h3>
                                            <ul className="space-y-3">
                                                {section.points.map((point) => (
                                                    <li key={point} className="flex items-start gap-3 text-muted-foreground text-sm">
                                                        <CheckCircle2 className="w-4 h-4 text-cosmic-blue flex-shrink-0 mt-0.5" />
                                                        <span>{point}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </ScrollReveal>

                        {/* Use Cases */}
                        <ScrollReveal delay={500}>
                            <section className="space-y-12">
                                <div className="text-center space-y-4">
                                    <h2 className="font-serif text-4xl md:text-5xl text-foreground">
                                        Target Applications
                                    </h2>
                                </div>

                                <div className="grid md:grid-cols-3 gap-8">
                                    {[
                                        {
                                            title: 'CubeSats',
                                            description: 'Low-cost missions requiring autonomous command authorization without expensive ground infrastructure.',
                                        },
                                        {
                                            title: 'Autonomous Spacecraft',
                                            description: 'Long-duration missions where real-time ground contact is impractical or impossible.',
                                        },
                                        {
                                            title: 'Deep-Space Missions',
                                            description: 'Missions beyond Earth orbit where light delays make real-time authorization infeasible.',
                                        },
                                    ].map((useCase) => (
                                        <div
                                            key={useCase.title}
                                            className="p-8 rounded-3xl border border-cosmic-blue/20 bg-cosmic-blue/5 space-y-4 hover:border-cosmic-blue/40 transition-all duration-500"
                                        >
                                            <h3 className="font-serif text-2xl text-foreground">{useCase.title}</h3>
                                            <p className="text-muted-foreground leading-relaxed">{useCase.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </ScrollReveal>

                        {/* Important Clarification */}
                        <ScrollReveal delay={600}>
                            <section className="glass p-12 rounded-[3rem] border-amber-500/20 bg-amber-500/5">
                                <div className="space-y-6 max-w-4xl mx-auto">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                                            <Shield className="w-6 h-6 text-amber-500" />
                                        </div>
                                        <div className="space-y-4">
                                            <h3 className="font-serif text-2xl text-foreground">
                                                Important: Verification Witness, Not Control
                                            </h3>
                                            <p className="text-muted-foreground leading-relaxed">
                                                Starhold does <strong>not</strong> control satellites with stars. Stars act as <strong>verification witnesses</strong>—
                                                a physics-based condition that must be met for command authorization. The satellite's star tracker
                                                observes the sky autonomously, and if the observed star matches the expected parameters,
                                                the command is authorized for execution.
                                            </p>
                                            <p className="text-muted-foreground leading-relaxed">
                                                This is an <strong>information infrastructure</strong>, not a novelty. It adds a non-spoofable
                                                physical authorization layer to existing satellite command systems.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </ScrollReveal>

                        {/* CTA */}
                        <ScrollReveal delay={700}>
                            <section className="text-center space-y-8 py-20">
                                <h2 className="font-serif text-5xl md:text-6xl text-foreground leading-tight">
                                    Ready to Integrate?
                                </h2>
                                <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
                                    Contact our engineering team to discuss integration with your mission systems.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="px-8 py-6 text-lg rounded-xl border-cosmic-blue/30 text-cosmic-blue hover:bg-cosmic-blue/10"
                                    >
                                        Request Technical Consultation
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="lg"
                                        className="px-8 py-6 text-lg rounded-xl text-muted-foreground hover:text-foreground"
                                    >
                                        Download Integration Guide
                                    </Button>
                                </div>
                            </section>
                        </ScrollReveal>
                    </div>
                </main>

                <Footer />
                <ScrollToTop />
            </div>
        </div>
    );
};

export default B2BDetailPage;
