import React from 'react';
import { V2Layout } from '../layout/V2Layout';

const V2Terms = () => {
    return (
        <V2Layout>
            <div className="min-h-screen relative overflow-hidden bg-[#0A0A12] pt-32 pb-20 px-6">
                <main className="max-w-4xl mx-auto space-y-12">
                    <div className="space-y-4">
                        <h4 className="font-aerospace text-xs font-bold text-cyan-500 uppercase tracking-[0.4em]">LEGAL DIRECTIVE</h4>
                        <h1 className="font-aerospace text-4xl md:text-5xl font-black uppercase tracking-tight text-white">Terms of Accord</h1>
                    </div>

                    <div className="bg-white/[0.02] border border-white/5 p-8 md:p-12 aerospace-border aerospace-border-tl space-y-12 text-zinc-400 font-technical leading-relaxed">
                        <section className="space-y-4">
                            <h2 className="font-aerospace text-xl font-bold uppercase tracking-widest text-white">1. Celestial Usage</h2>
                            <p>
                                By accessing Starhold, you agree to use our celestial archival services for lawful purposes. Harassment, illegal content, or unauthorized archival of sensitive data is strictly prohibited.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="font-aerospace text-xl font-bold uppercase tracking-widest text-white">2. Memory Custody</h2>
                            <p>
                                Starhold acts as a custodian of your memories. While we employ multi-redundant systems to ensure long-term storage, the ultimate responsibility for maintaining access credentials (keys/passwords) lies with the account holder.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="font-aerospace text-xl font-bold uppercase tracking-widest text-white">3. Reveal Protocol</h2>
                            <p>
                                Memories will remain locked until the specified date and time in the Gregorian calendar. Once revealed, Starhold is not responsible for any emotional impact or consequences resulting from the shared content.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="font-aerospace text-xl font-bold uppercase tracking-widest text-white">4. Refund Policy</h2>
                            <p>
                                Premium archival services (if applicable) are digital in nature. Once a celestial coordinate has been locked and a transmission initiated, refunds are typically not possible due to the permanent nature of the ledger.
                            </p>
                        </section>

                        <p className="text-xs uppercase tracking-widest font-aerospace pt-8 border-t border-white/10 text-zinc-500">
                            Last updated: January 2026. By using this service, you agree to the laws governing digital services in your jurisdiction.
                        </p>
                    </div>
                </main>
            </div>
        </V2Layout>
    );
};

export default V2Terms;
