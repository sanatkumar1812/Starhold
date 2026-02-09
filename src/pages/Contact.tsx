import { useState } from 'react';
import { CosmicBackground } from '@/components/CosmicBackground';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Mail, MessageSquare, Send, Loader2 } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ScrollToTop } from '@/components/ScrollToTop';

const Contact = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);

        try {
            const response = await fetch("https://sanatkumar1812.getform.com/g07g2", {
                method: "POST",
                body: formData,
                headers: {
                    "Accept": "application/json",
                },
            });

            if (response.ok) {
                toast.success("Transmission Received", {
                    description: "Our technicians have received your signal and will respond shortly."
                });
                (e.target as HTMLFormElement).reset();
            } else {
                throw new Error("Transmission failed");
            }
        } catch (error) {
            toast.error("Transmission Failed", {
                description: "Unable to reach the relay station. Please try again later."
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-background">
            <CosmicBackground />
            <div className="relative z-10">
                <Navigation />

                <main className="pt-32 pb-20 px-4">
                    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16 items-start">
                        {/* Info Section */}
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h1 className="font-serif text-5xl text-foreground">Contact Registry</h1>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    Need assistance with your stellar archive? Our technicians are ready to assist with coordinate locking and transmission relays.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                        <Mail className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-foreground">Direct Frequency</h4>
                                        <p className="text-sm text-muted-foreground">sanatkumar1812@gmail.com</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 rounded-xl bg-cosmic-purple/10 border border-cosmic-purple/20 flex items-center justify-center group-hover:bg-cosmic-purple/20 transition-colors">
                                        <MessageSquare className="w-6 h-6 text-cosmic-purple" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-foreground">Global Relay</h4>
                                        <p className="text-sm text-muted-foreground">Support Hours: 09:00 - 18:00 UTC</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Section */}
                        <div className="glass-strong p-8 rounded-3xl space-y-6 border-primary/20">
                            <form
                                onSubmit={handleSubmit}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground uppercase tracking-widest pl-1">Identifer (Name)</label>
                                    <Input
                                        name="name"
                                        placeholder="Commander John Doe"
                                        required
                                        className="bg-background/40 border-primary/20 focus:border-primary/50"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground uppercase tracking-widest pl-1">Frequency (Email)</label>
                                    <Input
                                        name="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        required
                                        className="bg-background/40 border-primary/20 focus:border-primary/50"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground uppercase tracking-widest pl-1">How are you using starhold?</label>
                                    <Select name="usageType" required>
                                        <SelectTrigger className="bg-background/40 border-primary/20 focus:border-primary/50">
                                            <SelectValue placeholder="Select usage type..." />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-primary/20 text-white">
                                            <SelectItem value="personal">For personal use</SelectItem>
                                            <SelectItem value="mission">For mission systems</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground uppercase tracking-widest pl-1">Transmission (Message)</label>
                                    <Textarea
                                        name="message"
                                        placeholder="Enter your message to the Starhold team..."
                                        required
                                        className="min-h-[150px] bg-background/40 border-primary/20 focus:border-primary/50 resize-none"
                                    />
                                </div>

                                <Button
                                    variant="gold"
                                    size="xl"
                                    className="w-full mt-4 group"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4 mr-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    )}
                                    {isSubmitting ? "Processing..." : "Initiate Transmission"}
                                </Button>
                            </form>
                        </div>
                    </div>
                </main>

                <Footer />
                <ScrollToTop />
            </div>
        </div>
    );
};

export default Contact;
