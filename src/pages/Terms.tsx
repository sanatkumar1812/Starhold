import { CosmicBackground } from '@/components/CosmicBackground';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ScrollToTop } from '@/components/ScrollToTop';

const Terms = () => {
    return (
        <div className="min-h-screen relative overflow-hidden bg-background">
            <CosmicBackground />
            <div className="relative z-10">
                <Navigation />

                <main className="pt-32 pb-20 px-4">
                    <div className="max-w-3xl mx-auto prose prose-invert">
                        <h1 className="font-serif text-5xl mb-8">Terms of Accord</h1>

                        <div className="glass p-8 rounded-3xl space-y-6 text-muted-foreground border-primary/10">
                            <section className="space-y-4">
                                <h2 className="text-xl font-medium text-foreground">1. Celestial Usage</h2>
                                <p>
                                    By accessing Starhold, you agree to use our celestial archival services for lawful purposes. Harassment, illegal content, or unauthorized archival of sensitive data is strictly prohibited.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-xl font-medium text-foreground">2. Memory Custody</h2>
                                <p>
                                    Starhold acts as a custodian of your memories. While we employ multi-redundant systems to ensure long-term storage, the ultimate responsibility for maintaining access credentials (keys/passwords) lies with the account holder.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-xl font-medium text-foreground">3. Reveal Protocol</h2>
                                <p>
                                    Memories will remain locked until the specified date and time in the Gregorian calendar. Once revealed, Starhold is not responsible for any emotional impact or consequences resulting from the shared content.
                                </p>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-xl font-medium text-foreground">4. Refund Policy</h2>
                                <p>
                                    Premium archival services (if applicable) are digital in nature. Once a celestial coordinate has been locked and a transmission initiated, refunds are typically not possible due to the permanent nature of the ledger.
                                </p>
                            </section>

                            <p className="text-xs italic pt-8 border-t border-border/30">
                                Last updated: January 2026. By using this service, you agree to the laws governing digital services in your jurisdiction.
                            </p>
                        </div>
                    </div>
                </main>

                <Footer />
                <ScrollToTop />
            </div>
        </div>
    );
};

export default Terms;
