import { CosmicBackground } from '@/components/CosmicBackground';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Star, Rocket, Shield, Globe, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ScrollToTop } from '@/components/ScrollToTop';

const About = () => {
    return (
        <div className="min-h-screen relative overflow-hidden bg-background">
            <CosmicBackground />
            <div className="relative z-10">
                <Navigation />

                <main className="pt-32 pb-20 px-4">
                    <div className="max-w-4xl mx-auto space-y-20">
                        {/* Hero Section */}
                        <ScrollReveal>
                            <div className="text-center space-y-6">
                                <h1 className="font-serif text-5xl md:text-7xl text-foreground">Our Cosmic Mission</h1>
                                <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                                    Preserving human emotion and memory in the most stable archive ever known: the stars.
                                </p>
                            </div>
                        </ScrollReveal>

                        {/* Content Sections */}
                        <div className="grid gap-20">
                            <ScrollReveal delay={200}>
                                <section className="grid md:grid-cols-2 gap-12 items-center">
                                    <div className="space-y-6">
                                        <div className="w-12 h-12 flex items-center justify-center">
                                            <img src="logo-small.svg" alt="Starhold Logo" className="w-full h-full object-contain" />
                                        </div>
                                        <h2 className="font-serif text-3xl text-foreground">What is Starhold?</h2>
                                        <p className="text-muted-foreground leading-relaxed">
                                            Starhold is a celestial time capsule. We believe that some memories are too precious to be lost to the fleeting nature of digital scrolls or physical decay. By encoding your messages, photos, and videos into unique celestial coordinates, we give them a permanent place in the heavens.
                                        </p>
                                    </div>
                                    <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 flex items-center justify-center p-8 group">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 group-hover:scale-175 transition-transform duration-500" />
                                            <img src="logo-small.svg" alt="Starhold Logo" className="w-32 h-32 object-contain relative animate-float" />
                                        </div>
                                    </div>
                                </section>
                            </ScrollReveal>

                            <ScrollReveal delay={400}>
                                <section className="grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
                                    <div className="md:order-2 space-y-6">
                                        <div className="w-12 h-12 rounded-2xl bg-cosmic-purple/20 border border-cosmic-purple/30 flex items-center justify-center">
                                            <Shield className="w-6 h-6 text-cosmic-purple" />
                                        </div>
                                        <h2 className="font-serif text-3xl text-foreground">Unbreakable Bonds</h2>
                                        <p className="text-muted-foreground leading-relaxed">
                                            Every memory is encrypted using military-grade protocols and assigned to a coordinate verified by astronomical catalogs. Only your chosen recipient, at the exact moment you specify, will have the key to unlock the transmission.
                                        </p>
                                    </div>
                                    <div className="md:order-1 aspect-square rounded-3xl bg-gradient-to-tr from-cosmic-purple/10 to-cosmic-purple/5 border border-cosmic-purple/20 flex items-center justify-center p-8 group">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-cosmic-purple/20 blur-3xl rounded-full scale-150 group-hover:scale-175 transition-transform duration-500" />
                                            <Globe className="w-32 h-32 text-cosmic-purple relative animate-drift" />
                                        </div>
                                    </div>
                                </section>
                            </ScrollReveal>
                        </div>

                        {/* Team Section */}
                        <ScrollReveal delay={600}>
                            <section className="space-y-12">
                                <div className="text-center space-y-4">
                                    <h2 className="font-serif text-4xl text-foreground">Meet the Visionaries</h2>
                                    <p className="text-muted-foreground max-w-xl mx-auto">
                                        The team of young innovators dedicated to making space accessible and memories eternal.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {[
                                        {
                                            name: "Sanat Kumar",
                                            role: "Space Science & Aerospace",
                                            image: "sanat.png",
                                            bio: ["Class 10 Student from India", "Passionate about Space Science and Aerospace", "ISRO YuViKa-25 Participant", "Musician(Vocalist+Instrumentalist)", "Likes to cook and read"]
                                        },
                                        {
                                            name: "Osheen Maleri",
                                            role: "AI & Space",
                                            image: "osheen.jfif",
                                            bio: ["Class 10 Student from India", "Passionate about AI and Space", "ISRO YuViKa-25 Participant", "Is an Athlete", "National AI Impact Winner"]
                                        },
                                        {
                                            name: "Cheerag Majumdar",
                                            role: "Space & Aeronautics",
                                            image: "cheerag.jpeg",
                                            bio: ["Class 10th student from India", "Has a deep passion for space and aeronautics", "Is a Vocalist", "Enjoys writing songs", "Likes to play football"]
                                        },
                                        {
                                            name: "Samaira Gupta",
                                            role: "Math & Astronomy",
                                            image: "samaira.jpeg",
                                            bio: ["Class 10th Student from India", "National Squash Player", "Likes listening to music, cycling, reading books", "Is a National AI Impact Winner", "Loves Math, space and astronomy"]
                                        },
                                        {
                                            name: "Avyukt Kamotra",
                                            role: "Art & Technology",
                                            image: "",
                                            bio: ["Class 10th student from India", "Interested in Space and Technology", "Curious Learner with a Problem-solving Mindset", "Balances academics with creative interests", "Skilled in Art and Visual Creativity"]
                                        }
                                    ].map((member, index) => (
                                        <div key={index} className="glass p-8 rounded-3xl border-white/5 space-y-6 group hover:translate-y-[-4px] transition-all duration-300">
                                            <div className="relative w-44 h-44 mx-auto">
                                                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full group-hover:bg-primary/30 transition-colors" />
                                                <div className="relative w-full h-full rounded-full border-2 border-primary/30 overflow-hidden ring-4 ring-primary/10">
                                                    {member.image ? (
                                                        <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-primary/5">
                                                            <User className="w-20 h-20 text-primary/40" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="text-center space-y-2">
                                                <h3 className="font-serif text-2xl text-foreground font-bold">{member.name}</h3>
                                                <p className="text-primary font-medium text-sm tracking-widest uppercase">{member.role}</p>
                                            </div>

                                            <ul className="space-y-2">
                                                {member.bio.map((item, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground leading-snug">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 shrink-0" />
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </ScrollReveal>

                        {/* Vision Quote */}
                        <ScrollReveal delay={700}>
                            <div className="flex flex-col md:flex-row gap-8 items-center glass p-10 rounded-[3rem] border-white/5">
                                <div className="space-y-4 flex-1">
                                    <h3 className="font-serif text-3xl">Deepen Your Knowledge</h3>
                                    <p className="text-muted-foreground">Learn about the science of the stars and the technology behind our archive protocol in the Stellar Academy.</p>
                                    <Link to="/academy" className="inline-block px-8 py-3 rounded-full gradient-gold text-primary-foreground font-semibold">Visit Academy</Link>
                                </div>
                                <div className="w-px h-20 bg-white/10 hidden md:block" />
                                <div className="space-y-4 flex-1">
                                    <h3 className="font-serif text-3xl">Explore the Skies</h3>
                                    <p className="text-muted-foreground">Use our professional-grade observatory to map coordinates and see the heavens in real-time.</p>
                                    <Link to="/observatory" className="inline-block px-8 py-3 rounded-full glass border-white/10 text-foreground font-semibold">Enter Observatory</Link>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </main>

                <Footer />
                <ScrollToTop />
            </div>
        </div>
    );
};

export default About;
