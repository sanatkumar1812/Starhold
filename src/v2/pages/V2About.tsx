import React from 'react';
import { V2Layout } from '../layout/V2Layout';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Shield, Globe, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const V2About = () => {
    const team = [
        {
            name: "Sanat Kumar",
            role: "Space Science & Aerospace",
            image: "sanat.png",
            bio: ["High School Student from India", "Passionate about Space Science and Aerospace", "ISRO YuViKa-25 Participant", "Musician(Vocalist+Instrumentalist)", "Likes to cook and read"]
        },
        {
            name: "Osheen Maleri",
            role: "AI & Space",
            image: "osheen.jfif",
            bio: ["High School Student from India", "Passionate about AI and Space", "ISRO YuViKa-25 Participant", "Is an Athlete", "National AI Impact Winner"]
        },
        {
            name: "Cheerag Majumdar",
            role: "Space & Aeronautics",
            image: "cheerag.jpeg",
            bio: ["High School Student from India", "Has a deep passion for space and aeronautics", "Is a Vocalist", "Enjoys writing songs", "Likes to play football"]
        },
        {
            name: "Samaira Gupta",
            role: "Math & Astronomy",
            image: "samaira.jpeg",
            bio: ["High School Student from India", "National Squash Player", "Likes listening to music, cycling, reading books", "Is a National AI Impact Winner", "Loves Math, space and astronomy"]
        },
        {
            name: "Avyukt Kamotra",
            role: "Art & Technology",
            image: "",
            bio: ["High School Student from India", "Interested in Space and Technology", "Curious Learner with a Problem-solving Mindset", "Balances academics with creative interests", "Skilled in Art and Visual Creativity"]
        }
    ];

    const supportingTeam = [
        { name: "Rakshit Rana" },
        { name: "Paarth Aggarwal" },
        { name: "Ishita Choudhary" }
    ];

    return (
        <V2Layout>
            <div className="min-h-screen relative overflow-hidden bg-[#0A0A12] pt-32 pb-20 px-6">
                <main className="max-w-6xl mx-auto space-y-32">

                    {/* Hero */}
                    <ScrollReveal>
                        <div className="text-center space-y-6 max-w-3xl mx-auto">
                            <h4 className="font-aerospace text-xs font-bold text-cyan-500 uppercase tracking-[0.4em]">ORIGIN PROTOCOL</h4>
                            <h1 className="font-aerospace text-4xl md:text-6xl font-black uppercase tracking-tight text-white leading-tight">
                                Our Cosmic <br />Mission
                            </h1>
                            <p className="text-lg text-zinc-400 font-technical leading-relaxed">
                                Preserving human emotion and memory in the most stable archive ever known: the stars.
                            </p>
                        </div>
                    </ScrollReveal>

                    {/* Content Sections */}
                    <div className="grid gap-24 max-w-5xl mx-auto">
                        <ScrollReveal delay={200}>
                            <section className="grid md:grid-cols-2 gap-12 items-center">
                                <div className="space-y-6">
                                    <div className="w-12 h-12 flex items-center justify-center bg-cyan-500/10 text-cyan-400">
                                        <Globe className="w-6 h-6" />
                                    </div>
                                    <h2 className="font-aerospace text-3xl font-black uppercase tracking-widest text-white">What is Starhold?</h2>
                                    <p className="text-zinc-400 font-technical leading-relaxed">
                                        Starhold is a celestial time capsule. We believe that some memories are too precious to be lost to the fleeting nature of digital scrolls or physical decay. By encoding your messages, photos, and videos into unique celestial coordinates, we give them a permanent place in the heavens.
                                    </p>
                                </div>
                                <div className="aspect-square bg-white/[0.02] border border-white/5 flex items-center justify-center p-8 aerospace-border relative group overflow-hidden">
                                    <div className="absolute inset-0 bg-cyan-400/5 group-hover:bg-cyan-400/10 transition-colors" />
                                    <img src="v2/logo_v2.svg" alt="Starhold Logo" className="w-32 h-32 object-contain relative opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                                </div>
                            </section>
                        </ScrollReveal>

                        <ScrollReveal delay={400}>
                            <section className="grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
                                <div className="md:order-2 space-y-6">
                                    <div className="w-12 h-12 bg-purple-500/10 text-purple-400 flex items-center justify-center">
                                        <Shield className="w-6 h-6" />
                                    </div>
                                    <h2 className="font-aerospace text-3xl font-black uppercase tracking-widest text-white">Unbreakable Bonds</h2>
                                    <p className="text-zinc-400 font-technical leading-relaxed">
                                        Every memory is encrypted using military-grade protocols and assigned to a coordinate verified by astronomical catalogs. Only your chosen recipient, at the exact moment you specify, will have the key to unlock the transmission.
                                    </p>
                                </div>
                                <div className="md:order-1 aspect-square bg-white/[0.02] border border-white/5 flex items-center justify-center p-8 aerospace-border relative group overflow-hidden">
                                    <div className="absolute inset-0 bg-purple-400/5 group-hover:bg-purple-400/10 transition-colors" />
                                    <Shield className="w-32 h-32 text-purple-500/40 relative group-hover:text-purple-400 transition-colors duration-700" />
                                </div>
                            </section>
                        </ScrollReveal>
                    </div>

                    {/* Team Section */}
                    <section className="space-y-16">
                        <ScrollReveal delay={600}>
                            <div className="text-center space-y-4">
                                <h2 className="font-aerospace text-4xl font-black uppercase tracking-widest text-white">Command Roster</h2>
                                <p className="text-zinc-400 font-technical max-w-xl mx-auto">
                                    The team of innovators dedicated to making space accessible and memories eternal.
                                </p>
                            </div>
                        </ScrollReveal>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {team.map((member, index) => (
                                <ScrollReveal key={index} delay={index * 100}>
                                    <div className="bg-white/[0.02] border border-white/5 p-8 flex flex-col sm:flex-row gap-8 items-center sm:items-start aerospace-border aerospace-border-tl hover:bg-white/[0.04] transition-colors h-full">
                                        <div className="w-40 h-40 shrink-0 rounded-none bg-black border border-white/10 overflow-hidden relative group">
                                            {member.image ? (
                                                <img src={member.image} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-white/5">
                                                    <User className="w-12 h-12 text-white/20" />
                                                </div>
                                            )}
                                            <div className="absolute top-0 right-0 bg-cyan-500 w-2 h-2" />
                                        </div>

                                        <div className="space-y-4 text-center sm:text-left">
                                            <div>
                                                <h3 className="font-aerospace text-xl font-bold uppercase tracking-widest text-white">{member.name}</h3>
                                                <p className="text-cyan-400 font-aerospace text-[10px] uppercase tracking-[0.2em]">{member.role}</p>
                                            </div>

                                            <ul className="space-y-2">
                                                {member.bio.map((item, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-xs text-zinc-400 font-technical">
                                                        <span className="text-cyan-500/50 mt-0.5">›</span>
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>

                        {/* Supporting Team */}
                        <ScrollReveal delay={400}>
                            <div className="pt-16 border-t border-white/5">
                                <h3 className="font-aerospace text-sm font-bold uppercase tracking-[0.3em] text-zinc-500 text-center mb-8">Support Personnel</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    {supportingTeam.map((member, index) => (
                                        <div key={index} className="bg-black/40 border border-white/5 p-6 flex items-center justify-center gap-4 text-center group hover:bg-white/[0.02] transition-colors">
                                            <User className="w-5 h-5 text-zinc-600 group-hover:text-cyan-500 transition-colors" />
                                            <span className="font-aerospace text-sm font-bold uppercase tracking-widest text-zinc-300">{member.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </ScrollReveal>
                    </section>
                </main>
            </div>
        </V2Layout>
    );
};

export default V2About;
