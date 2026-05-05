import React from 'react';
import { V2Layout } from '../layout/V2Layout';

const V2Privacy = () => {
    return (
        <V2Layout>
            <div className="min-h-screen relative overflow-hidden bg-[#0A0A12] pt-32 pb-20 px-6">
                <main className="max-w-4xl mx-auto space-y-12">
                    <div className="space-y-4">
                        <h4 className="font-aerospace text-xs font-bold text-cyan-500 uppercase tracking-[0.4em]">LEGAL DIRECTIVE</h4>
                        <h1 className="font-aerospace text-4xl md:text-5xl font-black uppercase tracking-tight text-white">Privacy Protocol</h1>
                    </div>

                    <div className="bg-white/[0.02] border border-white/5 p-8 md:p-12 aerospace-border aerospace-border-tl space-y-12 text-zinc-400 font-technical leading-relaxed">
                        <section className="space-y-4">
                            <h2 className="font-aerospace text-xl font-bold uppercase tracking-widest text-white">1. Data Encryption</h2>
                            <p>
                                At Starhold, we treat your memories with absolute reverence. All text, images, and videos uploaded to our servers are encrypted using AES-256 military-grade standards before being stored in the archival database.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="font-aerospace text-xl font-bold uppercase tracking-widest text-white">2. Information Collection</h2>
                            <p>
                                We only collect essential data required to maintain your account and deliver your memories: your email address, recipient names, and the celestial coordinates assigned to your memories.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="font-aerospace text-xl font-bold uppercase tracking-widest text-white">3. Memory Security</h2>
                            <p>
                                Memories are "locked" until the reveal date you specify. Not even the Starhold administrative team has the capability to view unencrypted content without the unique user-side key generated at creation.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="font-aerospace text-xl font-bold uppercase tracking-widest text-white">4. Third Parties</h2>
                            <p>
                                We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. This excludes trusted third parties who assist us in operating our website (like Supabase for storage), so long as those parties agree to keep this information confidential.
                            </p>
                        </section>

                        <p className="text-xs uppercase tracking-widest font-aerospace pt-8 border-t border-white/10 text-zinc-500">
                            Last updated: January 2026. For inquiries regarding data protection, please contact the Registry.
                        </p>
                    </div>
                </main>
            </div>
        </V2Layout>
    );
};

export default V2Privacy;
