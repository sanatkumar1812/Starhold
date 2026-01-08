import { CosmicBackground } from '@/components/CosmicBackground';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

const Privacy = () => {
    return (
        <div className="min-h-screen relative overflow-hidden bg-background">
            <CosmicBackground />
            <div className="relative z-10">
                <Navigation />

                <main className="pt-32 pb-20 px-4">
                    <div className="max-w-3xl mx-auto prose prose-invert">
                        <h1 className="font-serif text-5xl mb-8">Privacy Protocol</h1>

                        <div className="glass p-8 rounded-3xl space-y-6 text-muted-foreground border-primary/10">
                            <section className="space-y-4">
                                <h2 className="text-xl font-medium text-foreground">1. Data Encryption</h2>
                                <p>
                                    At Starhold, we treat your memories with absolute reverence. All text, images, and videos uploaded to our servers are encrypted using AES-256 military-grade standards before being stored in the archival database.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-xl font-medium text-foreground">2. Information Collection</h2>
                                <p>
                                    We only collect essential data required to maintain your account and deliver your memories: your email address, recipient names, and the celestial coordinates assigned to your memories.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-xl font-medium text-foreground">3. Memory Security</h2>
                                <p>
                                    Memories are "locked" until the reveal date you specify. Not even the Starhold administrative team has the capability to view unencrypted content without the unique user-side key generated at creation.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-xl font-medium text-foreground">4. Third Parties</h2>
                                <p>
                                    We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. This excludes trusted third parties who assist us in operating our website (like Supabase for storage), so long as those parties agree to keep this information confidential.
                                </p>
                            </section>

                            <p className="text-xs italic pt-8 border-t border-border/30">
                                Last updated: January 2026. For inquiries regarding data protection, please contact the Registry.
                            </p>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </div>
    );
};

export default Privacy;
