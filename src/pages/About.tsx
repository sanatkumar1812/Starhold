import { CosmicBackground } from '@/components/CosmicBackground';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Star, Rocket, Shield, Globe, User, Trophy, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ScrollToTop } from '@/components/ScrollToTop';

const About = () => {
    return (
        <div className="min-h-screen relative overflow-hidden bg-background">
            <CosmicBackground />
            <div className="relative z-10">
                <Navigation />

                <main className="pt-32 pb-20 px-4">
                    <div className="max-w-7xl mx-auto space-y-12">
                        <ScrollReveal>
                            <div className="text-center space-y-4 mb-16">
                                <h1 className="font-serif text-5xl md:text-7xl text-foreground">Meet the Visionaries</h1>
                                <p className="text-muted-foreground text-xl max-w-xl mx-auto">
                                    {/* Original B2C subtitle:
                                    The team of young innovators dedicated to making space accessible and memories eternal.
                                    */}
                                    The team of young innovators dedicated to making space accessible and securing orbital assets.
                                </p>
                            </div>
                        </ScrollReveal>

                        {/* Achievement Banner */}
                        <ScrollReveal delay={200}>
                            <a
                                href="https://outoftheboxedu.space"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 px-6 py-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 transition-colors group"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-amber-300">🏆 HolySpace Challenge — 1st Place</span>
                                </div>
                                <div className="w-px h-4 bg-amber-500/20 hidden sm:block" />
                                <span className="text-xs font-mono text-muted-foreground/70 uppercase tracking-widest">Science Accelerator 2026 · Out of the Box Aerospace</span>
                                <div className="w-px h-4 bg-amber-500/20 hidden sm:block" />
                                <span className="text-xs font-mono text-amber-500/60 uppercase tracking-widest flex items-center gap-1">Finalists <ExternalLink className="w-3 h-3" /></span>
                            </a>
                        </ScrollReveal>

                        <div className="space-y-20">
                            {/* All Visionaries */}
                            <ScrollReveal delay={650}>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {[
                                        {
                                            name: "Sanat Kumar",
                                            role: "Space Science & Aerospace",
                                            image: "sanat.png",
                                            bio: ["High School Student from India", "Passionate about Space Science and Aerospace", "ISRO YuViKa-25 Participant", "Musician (Vocalist + Instrumentalist)", "Likes to cook and read"]
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
                                        },
                                        {
                                            name: "Paarth Aggarwal",
                                            role: "AI & Technology",
                                            image: "paarth.jpeg",
                                            bio: ["High School Student from India", "Passionate about Quantum Computing and Ethical Hacking", "All-round sportsperson; loves Table Tennis", "Avid reader with deep human empathy", "Sharp critical thinker and analyst"]
                                        },
                                        {
                                            name: "Ishita Choudhary",
                                            role: "Creativity & Learning",
                                            image: "ishita.jpeg",
                                            bio: ["High School Student from India", "Passionate about creativity and learning", "Calm, imaginative, and deeply curious", "Loves music, peace, and self-expression", "Always eager to explore new ideas"]
                                        },
                                        {
                                            name: "Rakshit Rana",
                                            role: "Aerospace & Coding",
                                            image: "rakshit.jpeg",
                                            bio: ["High School Student from India", "Passionate about Aerospace and Astrophysics", "Interested in Tech", "Choir member who loves music", "Likes to cook and watch movies/TV shows"]
                                        }
                                    ].map((member, index) => (
                                        <div key={index} className="glass p-6 md:p-10 rounded-[3rem] border-white/5 group hover:translate-y-[-4px] hover:border-primary/20 transition-all duration-300 flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 overflow-hidden">
                                            <div className="flex flex-col items-center text-center gap-4 shrink-0 w-full md:w-52">
                                                <div className="relative w-44 h-44 md:w-48 md:h-48">
                                                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full group-hover:bg-primary/30 transition-colors" />
                                                    <div className="relative w-full h-full rounded-full border-2 border-primary/30 overflow-hidden ring-4 ring-primary/5 shadow-2xl">
                                                        {member.image ? (
                                                            <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-primary/5">
                                                                <User className="w-20 h-20 text-primary/40" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="space-y-1">
                                                    <h3 className="font-serif text-2xl text-foreground font-bold group-hover:text-primary transition-colors leading-tight">{member.name}</h3>
                                                    {member.role && <p className="text-primary font-medium text-[10px] tracking-[0.2em] uppercase">{member.role}</p>}
                                                </div>
                                            </div>

                                            <div className="flex-grow space-y-4 md:pt-4 min-w-0">
                                                <div className="w-12 h-0.5 bg-primary/20 hidden md:block" />
                                                {member.bio.length > 0 ? (
                                                    <ul className="space-y-3">
                                                        {member.bio.map((item, i) => (
                                                            <li key={i} className="flex items-start gap-3 text-sm md:text-[0.9375rem] text-muted-foreground/80 leading-relaxed break-words">
                                                                <div className="w-1 h-1 rounded-full bg-primary/40 mt-2 shrink-0" />
                                                                <span className="flex-1">{item}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p className="text-muted-foreground/40 text-sm italic">More coming soon…</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollReveal>
                        </div>

                         {/* Future Horizons (Deactivated for B2B) */}
                         {/*
                         <ScrollReveal delay={800}>
                             <div className="mt-32 p-10 md:p-16 rounded-[3rem] border border-white/5 bg-slate-900/40 glass relative overflow-hidden">
                                 <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
                                 <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
                                     <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-[10px] font-mono text-primary uppercase tracking-[0.2em]">
                                         Future Horizons
                                     </div>
                                     <h2 className="text-3xl md:text-5xl font-serif text-foreground">The Consumer Memory Archive</h2>
                                     <p className="text-muted-foreground text-lg leading-relaxed">
                                         While our current focus remains strictly on securing critical aerospace infrastructure, our long-term vision includes making space accessible to everyone. In the future, we plan to adapt our high-assurance backend to offer a <strong>B2C Consumer Memory Archive</strong>—allowing individuals to cryptographically lock their personal memories and media directly into celestial coordinates.
                                     </p>
                                 </div>
                             </div>
                         </ScrollReveal>
                         */}
                    </div>
                </main>

                <Footer />
                <ScrollToTop />
            </div>
        </div>
    );
};

export default About;
