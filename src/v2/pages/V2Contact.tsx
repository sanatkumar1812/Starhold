import React, { useState } from 'react';
import { V2Layout } from '../layout/V2Layout';
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

const V2Contact = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);

        try {
            const response = await fetch("https://formsubmit.co/ajax/starhold.co@gmail.com", {
                method: "POST",
                body: formData,
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
        <V2Layout>
            <div className="min-h-screen relative overflow-hidden bg-[#0A0A12] pt-32 pb-20 px-6">
                <main className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
                    {/* Info Section */}
                    <div className="space-y-12">
                        <div className="space-y-4">
                            <h4 className="font-aerospace text-xs font-bold text-cyan-500 uppercase tracking-[0.4em]">COMMUNICATIONS UNIT</h4>
                            <h1 className="font-aerospace text-4xl md:text-5xl font-black uppercase tracking-tight text-white">Contact Registry</h1>
                            <p className="text-zinc-400 font-technical leading-relaxed max-w-md pt-4">
                                Need assistance with your stellar archive? Our technicians are ready to assist with coordinate locking and transmission relays.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-6 group bg-white/[0.02] border border-white/5 p-6 aerospace-border hover:bg-white/[0.04] transition-colors">
                                <div className="w-12 h-12 flex items-center justify-center bg-cyan-500/10 text-cyan-400">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-aerospace font-bold text-sm uppercase tracking-widest text-white">Direct Frequency</h4>
                                    <p className="text-xs text-zinc-500 font-technical mt-1">starhold.co@gmail.com</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 group bg-white/[0.02] border border-white/5 p-6 aerospace-border hover:bg-white/[0.04] transition-colors">
                                <div className="w-12 h-12 flex items-center justify-center bg-purple-500/10 text-purple-400">
                                    <MessageSquare className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-aerospace font-bold text-sm uppercase tracking-widest text-white">Global Relay</h4>
                                    <p className="text-xs text-zinc-500 font-technical mt-1">Support Hours: 0330 to 1530 UTC</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="bg-black/40 p-8 md:p-12 border border-white/5 aerospace-border aerospace-border-tl">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-aerospace font-bold text-cyan-500 uppercase tracking-[0.2em]">Identifer (Name)</label>
                                <Input
                                    name="name"
                                    placeholder="Commander John Doe"
                                    required
                                    className="bg-[#0A0A12] border-white/10 text-white font-technical h-12 rounded-none focus-visible:border-cyan-500 focus-visible:ring-0"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-aerospace font-bold text-cyan-500 uppercase tracking-[0.2em]">Frequency (Email)</label>
                                <Input
                                    name="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    required
                                    className="bg-[#0A0A12] border-white/10 text-white font-technical h-12 rounded-none focus-visible:border-cyan-500 focus-visible:ring-0"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-aerospace font-bold text-cyan-500 uppercase tracking-[0.2em]">How are you using starhold?</label>
                                <Select name="usageType" required>
                                    <SelectTrigger className="bg-[#0A0A12] border-white/10 text-white font-technical h-12 rounded-none focus:border-cyan-500 focus:ring-0">
                                        <SelectValue placeholder="Select usage type..." />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#0A0A12] border-white/10 text-white rounded-none">
                                        <SelectItem value="personal" className="font-technical focus:bg-cyan-500/20 focus:text-cyan-400">For personal use</SelectItem>
                                        <SelectItem value="mission" className="font-technical focus:bg-cyan-500/20 focus:text-cyan-400">For mission systems</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-aerospace font-bold text-cyan-500 uppercase tracking-[0.2em]">Transmission (Message)</label>
                                <Textarea
                                    name="message"
                                    placeholder="Enter your message to the Starhold team..."
                                    required
                                    className="min-h-[150px] bg-[#0A0A12] border-white/10 text-white font-technical rounded-none focus-visible:border-cyan-500 focus-visible:ring-0 resize-none"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-14 bg-cyan-500 hover:bg-cyan-400 text-[#0A0A12] font-aerospace font-black uppercase tracking-widest rounded-none group transition-all"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                                ) : (
                                    <Send className="w-5 h-5 mr-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                )}
                                {isSubmitting ? "PROCESSING..." : "INITIATE TRANSMISSION"}
                            </Button>
                        </form>
                    </div>
                </main>
            </div>
        </V2Layout>
    );
};

export default V2Contact;
