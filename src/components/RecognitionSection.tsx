import { Trophy, ExternalLink, Star } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

export const RecognitionSection = () => {
    return (
        <section className="py-28 px-4 relative overflow-hidden">
            {/* Gold ambient glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(251,191,36,0.05)_0%,transparent_70%)] pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />

            <div className="max-w-6xl mx-auto relative z-10">

                {/* Header */}
                <div className="text-center mb-14 space-y-5">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-mono uppercase tracking-widest">
                        <Trophy className="w-3.5 h-3.5" />
                        Award-Winning Innovation
                    </div>
                    <h1 className="font-serif text-4xl md:text-5xl text-foreground">
                        Recognized by the <span className="text-gradient-gold italic">Stars</span>
                    </h1>
                    <p className="text-muted-foreground max-w-5xl mx-auto text-lg leading-relaxed">
                        {/* Original:
                        Our B2C product won <strong className="text-foreground">1st Place</strong> in the HolySpace Challenge —
                        part of the <strong className="text-foreground">Science Accelerator Class of 2026</strong> by <br/>Out of the Box Aerospace.
                        We are now advancing to the Finals.
                        */}
                        We won <strong className="text-foreground">1st Place</strong> in the HolySpace Challenge — part of the <strong className="text-foreground">Science Accelerator Class of 2026</strong> by Out of the Box Aerospace.<br className="hidden md:inline" />After passing the Semi-finals, we are now advancing to the Finals.
                    </p>
                    <a
                        href="https://outoftheboxedu.space"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-amber-400/70 hover:text-amber-400 transition-colors"
                    >
                        outoftheboxedu.space <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                </div>

                {/* Intro about Dr Jeff Hoffman */}
                <div className="text-center mb-10 max-w-4xl mx-auto space-y-3">
                    <h3 className="font-serif text-3xl text-foreground flex items-center justify-center gap-2">
                        <Star className="w-6 h-6 text-amber-400" />
                        Dr. Jeff Hoffman
                    </h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        NASA Astronaut · 5 Spacewalks · Hubble Repair Mission <br />
                        MIT Professor of the Practice · Aeronautics & Astronautics
                    </p>
                    <p className="text-sm font-mono text-amber-500/50 uppercase tracking-widest pt-2">
                        Signed photos won as prize · HolySpace Challenge 2026
                    </p>
                </div>

                {/* Signed Photos */}
                <div className="flex flex-col md:flex-row gap-6 md:gap-8 w-full max-w-none px-[0px] mx-auto justify-center items-stretch h-auto md:h-[500px]">
                    {/* Landscape Image */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <div className="group relative glass rounded-[2.5rem] border-2 border-amber-500/20 hover:border-amber-400/50 overflow-hidden p-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_8px_60px_rgba(251,191,36,0.15)] md:w-[70%] cursor-pointer">
                                <div className="w-full h-full rounded-[2rem] overflow-hidden relative bg-black/40">
                                    <img
                                        src="hoffman-spacewalk.jpeg"
                                        alt="Dr. Jeff Hoffman Spacewalking"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                            </div>
                        </DialogTrigger>
                        <DialogContent className="w-auto max-w-[95vw] p-0 bg-transparent border-none shadow-2xl flex items-center justify-center">
                            <img
                                src="hoffman-spacewalk.jpeg"
                                alt="Dr. Jeff Hoffman Spacewalking"
                                className="w-auto h-auto max-w-[95vw] max-h-[90vh] object-contain rounded-xl"
                            />
                        </DialogContent>
                    </Dialog>

                    {/* Portrait Image */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <div className="group relative glass rounded-[2.5rem] border-2 border-amber-500/20 hover:border-amber-400/50 overflow-hidden p-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_8px_60px_rgba(251,191,36,0.15)] md:w-[30%] cursor-pointer">
                                <div className="w-full h-full rounded-[2rem] overflow-hidden relative bg-black/40">
                                    <img
                                        src="hoffman-spacesuit.jpeg"
                                        alt="Dr. Jeff Hoffman in Spacesuit"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 object-top"
                                    />
                                </div>
                            </div>
                        </DialogTrigger>
                        <DialogContent className="w-auto max-w-[95vw] p-0 bg-transparent border-none shadow-2xl flex items-center justify-center">
                            <img
                                src="hoffman-spacesuit.jpeg"
                                alt="Dr. Jeff Hoffman in Spacesuit"
                                className="w-auto h-auto max-w-[95vw] max-h-[90vh] object-contain rounded-xl"
                            />
                        </DialogContent>
                    </Dialog>
                </div>
                <br/><br/>
                {/* Award strip */}
                <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
                    {[
                        { label: "Challenge", value: "HolySpace" },
                        { label: "Result", value: "1st Place 🏆" },
                        { label: "Programme", value: "Science Accelerator 2026" },
                        { label: "Organiser", value: "Out of the Box Aerospace" },
                        { label: "Status", value: "Finalists ✦" },
                    ].map((item) => (
                        <div key={item.label} className="glass px-5 py-3 rounded-2xl border border-amber-500/10 hover:border-amber-500/20 transition-colors text-center">
                            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-500/50">{item.label}</p>
                            <p className="text-sm font-semibold text-foreground mt-0.5">{item.value}</p>
                        </div>
                    ))}
                </div>

                {/* Bottom strip */}
                <div className="mt-14 flex items-center justify-center gap-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-500/30" />
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                        <Star className="w-3 h-3 text-amber-400/80" />
                        <span className="text-[10px] font-mono text-amber-400/80 uppercase tracking-[0.25em]">
                            Science Accelerator Class of 2026 · Out of the Box Aerospace
                        </span>
                        <Star className="w-3 h-3 text-amber-400/80" />
                    </div>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-500/30" />
                </div>
            </div>
        </section>
    );
};
