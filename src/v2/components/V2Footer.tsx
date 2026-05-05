import React from 'react';
import { Link } from 'react-router-dom';
import { ScrollReveal } from '@/components/ScrollReveal';

export const V2Footer = () => {
    return (
        <footer className="bg-black py-20 border-t border-white/5 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-cyan-400/5 blur-[100px]" />
            <div className="container mx-auto px-6 relative z-10">
                <div className="grid md:grid-cols-4 gap-12 mb-20">
                    <div className="col-span-2 space-y-8">
                        <div className="flex items-center gap-1">
                            <img src="v2/logo_v2.svg" alt="" className="w-12 h-auto" />
                            <img src="v2/starhold_text_logo.png" alt="Starhold" className="h-6 w-auto object-contain -ml-2" />
                        </div>
                        <p className="font-technical text-zinc-500 text-sm leading-relaxed max-w-sm">
                            Celestial-referenced information infrastructure. Securing the world's most critical data through the immutable physics of the cosmos.
                        </p>
                        {/* Proudly Indian */}
                        <div className="flex items-center gap-3 pt-2">
                            <div className="flex items-center gap-2 px-3 py-1.5 border border-white/8 bg-white/[0.03] rounded-sm">
                                <span className="text-lg leading-none" role="img" aria-label="Indian flag">&#x1F1EE;&#x1F1F3;</span>
                                <span className="font-aerospace text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-bold">Proudly Indian</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className="font-aerospace text-cyan-500 font-bold uppercase tracking-widest text-sm text-shadow-glow">Infrastructure</h4>
                        <nav className="flex flex-col gap-4 text-xs font-aerospace uppercase tracking-widest text-zinc-500">
                            <a href="#" className="hover:text-white transition-colors">B2B Mission Specs</a>
                            <a href="#" className="hover:text-white transition-colors">Satellite Auth</a>
                            <a href="#" className="hover:text-white transition-colors">Network Status</a>
                        </nav>
                    </div>

                    <div className="space-y-6">
                        <h4 className="font-aerospace text-cyan-500 font-bold uppercase tracking-widest text-sm text-shadow-glow">Legal // Press</h4>
                        <nav className="flex flex-col gap-4 text-xs font-aerospace uppercase tracking-widest text-zinc-500">
                            <Link to="/v2/privacy" className="hover:text-white transition-colors">Privacy Protocol</Link>
                            <Link to="/v2/terms" className="hover:text-white transition-colors">Terms of Orbit</Link>
                            <Link to="/v2/contact" className="hover:text-white transition-colors">Contact Registry</Link>
                            <Link to="/v2/about" className="hover:text-white transition-colors">Command Roster</Link>
                        </nav>
                    </div>
                </div>

                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3 px-4 py-2 border border-white/5 bg-white/[0.02] rounded-lg">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-aerospace uppercase tracking-widest text-emerald-500/80">Network Active // All Systems Go</span>
                        </div>
                    </div>

                    <div className="text-right space-y-2">
                        <p className="font-aerospace text-zinc-500 text-[10px] uppercase tracking-widest italic">
                            "Address Your Data to the Stars."
                        </p>
                        <p className="text-zinc-600 text-[9px] font-technical uppercase">
                            &copy; 2026 Starhold Technologies Inc. // Registered Aerospace Information Infrastructure
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};
