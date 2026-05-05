import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { StarMap } from '@/components/StarMap';
import { MemoryCountdown } from '@/components/MemoryCountdown';
import { StarWarpAnimation } from '@/components/StarWarpAnimation';
import { Star, Lock, Calendar, ArrowLeft, FileText, Film, Sparkles, MapPin, Clock, Activity, Shield, Globe } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Memory } from '@/hooks/useMemories';
import { Skeleton } from '@/components/ui/skeleton';
import { decrypt } from '@/lib/encryption';
import { CosmicGift } from '@/components/CosmicGift';
import { V2Layout } from '../layout/V2Layout';

const V2SharedMemory = () => {
    const { token } = useParams<{ token: string }>();
    const [memory, setMemory] = useState<Memory | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showWarpAnimation, setShowWarpAnimation] = useState(false);
    const [animationComplete, setAnimationComplete] = useState(true);
    const [isUnboxed, setIsUnboxed] = useState(false);

    const handleAnimationComplete = useCallback(() => {
        setAnimationComplete(true);
        setShowWarpAnimation(false);
    }, []);

    useEffect(() => {
        if (memory?.is_unlocked && isUnboxed && !isLoading) {
            setAnimationComplete(false);
            setShowWarpAnimation(true);
            const timeout = setTimeout(() => {
                setAnimationComplete(true);
                setShowWarpAnimation(false);
            }, 3000);
            return () => clearTimeout(timeout);
        }
    }, [memory?.is_unlocked, isUnboxed, isLoading]);

    useEffect(() => {
        const fetchMemory = async () => {
            if (!token) {
                setError('INVALID LINK');
                setIsLoading(false);
                return;
            }

            const { data, error: fetchError } = await supabase
                .from('memories')
                .select('*')
                .eq('share_token', token)
                .maybeSingle();

            if (fetchError || !data) {
                setError('RECORD NOT FOUND');
                setIsLoading(false);
                return;
            }

            const now = new Date();
            const unlockDateTime = new Date(`${data.unlock_date}T${data.unlock_time}`);
            const shouldBeUnlocked = now >= unlockDateTime;

            const processedData = {
                ...data,
                is_unlocked: shouldBeUnlocked || data.is_unlocked,
                recipient_name: decrypt(data.recipient_name),
                message: data.message ? decrypt(data.message) : null,
                title: data.title ? decrypt(data.title) : null
            };

            if (shouldBeUnlocked && !data.is_unlocked) {
                await supabase.from('memories').update({ is_unlocked: true }).eq('id', data.id);
            }

            setMemory(processedData as Memory);
            setIsLoading(false);
        };

        fetchMemory();
    }, [token]);

    if (isLoading) return <div className="h-screen bg-[#0A0A12] flex items-center justify-center font-aerospace text-cyan-500 uppercase tracking-[0.5em] animate-pulse">Linking to Deep Space Infrastructure...</div>;

    if (error || !memory) {
        return (
            <V2Layout>
                <div className="h-screen flex items-center justify-center p-6">
                    <div className="text-center space-y-8 max-w-md">
                        <div className="w-24 h-24 mx-auto aerospace-border flex items-center justify-center text-zinc-800">
                            <Activity className="w-12 h-12" />
                        </div>
                        <div className="space-y-4">
                            <h1 className="font-aerospace text-3xl font-bold uppercase tracking-widest text-white">{error || 'ACCESS DENIED'}</h1>
                            <p className="text-zinc-500 font-technical text-sm uppercase leading-relaxed">The requested celestial anchor could not be established. Check link validity.</p>
                        </div>
                        <Button onClick={() => window.location.href = '#/v2'} className="bg-cyan-500 text-[#0A0A12] px-8 h-12 rounded-none font-aerospace font-bold uppercase tracking-widest">
                            Return to HQ
                        </Button>
                    </div>
                </div>
            </V2Layout>
        );
    }

    const coordinates = memory.star_coordinates as { ra: number; dec: number } | null;
    const attachments = memory.attachment_url ? memory.attachment_url.split(',').filter(Boolean) : [];

    return (
        <V2Layout>
            <div className="min-h-screen relative overflow-hidden bg-[#0A0A12]">
                <StarWarpAnimation isActive={showWarpAnimation} onComplete={handleAnimationComplete} duration={2000} />

                {memory?.is_unlocked && !isUnboxed && (
                    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md">
                        <CosmicGift onShatter={() => setIsUnboxed(true)} senderName="ORBITAL UPLINK" />
                    </div>
                )}

                <main className="relative z-10 pt-32 pb-20 px-6 max-w-4xl mx-auto space-y-12">

                    {/* Header Spec */}
                    <div className={`space-y-8 transition-opacity duration-1000 ${!animationComplete ? 'opacity-0' : 'opacity-100'}`}>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-10">
                            <div className="space-y-2">
                                <h4 className="font-aerospace text-[10px] text-cyan-500 font-bold uppercase tracking-[0.4em]">RECORD ACQUISITION</h4>
                                <h1 className="font-aerospace text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight">
                                    {memory.title || `MEM_ID: ${memory.id.substring(0, 8)}`}
                                </h1>
                            </div>
                            <div className="bg-black/40 border border-white/10 px-6 py-3 aerospace-border">
                                <div className="flex items-center gap-4 font-aerospace text-[10px] uppercase tracking-widest">
                                    <div className={`w-2 h-2 rounded-full ${memory.is_unlocked ? 'bg-emerald-500' : 'bg-cyan-500 animate-pulse'}`} />
                                    <span className={memory.is_unlocked ? 'text-emerald-500' : 'text-cyan-500'}>
                                        {memory.is_unlocked ? 'DECRYPTED ✓' : 'SECURED // LOCKED'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Visual & Map Section */}
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="aspect-square bg-black border border-white/5 aerospace-border aerospace-border-tl relative group overflow-hidden">
                                {coordinates && (
                                    <div className="absolute inset-0 z-0 opacity-80 group-hover:opacity-100 transition-opacity">
                                        <StarMap ra={coordinates.ra} dec={coordinates.dec} size={400} />
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 text-cyan-500/40 text-[8px] font-mono uppercase tracking-[0.5em]">
                                    ZENITH POINT LOCK
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <Globe className="w-4 h-4 text-cyan-500" />
                                        <span className="font-aerospace text-xs uppercase tracking-widest text-zinc-400">Target Designation</span>
                                    </div>
                                    <div className="bg-white/[0.02] border border-white/5 p-6 space-y-4">
                                        <div className="flex justify-between items-center text-[10px] font-aerospace uppercase tracking-widest">
                                            <span className="text-zinc-500">Recipient</span>
                                            <span className="text-white">{memory.recipient_name}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[10px] font-aerospace uppercase tracking-widest">
                                            <span className="text-zinc-500">Patch</span>
                                            <span className="text-cyan-400">{memory.constellation || 'CUSTOM'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-4 h-4 text-cyan-500" />
                                        <span className="font-aerospace text-xs uppercase tracking-widest text-zinc-400">Protocol Windows</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white/[0.02] border border-white/5 p-4 text-center space-y-1">
                                            <span className="text-[8px] text-zinc-600 uppercase font-aerospace">Unlock Epoch</span>
                                            <div className="text-xs text-white font-aerospace">{memory.unlock_date}</div>
                                        </div>
                                        <div className="bg-white/[0.02] border border-white/5 p-4 text-center space-y-1">
                                            <span className="text-[8px] text-zinc-600 uppercase font-aerospace">Time Lock</span>
                                            <div className="text-xs text-white font-aerospace">{memory.unlock_time}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Decrypted Payload */}
                        {memory.is_unlocked && isUnboxed ? (
                            <div className="space-y-12 pt-12 animate-in fade-in duration-1000">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 text-emerald-500">
                                        <FileText className="w-5 h-5" />
                                        <h3 className="font-aerospace text-xl font-black uppercase tracking-widest">Decrypted Payload</h3>
                                    </div>
                                    <div className="bg-white/[0.02] border border-emerald-500/20 p-10 font-technical text-lg leading-relaxed text-zinc-300 aerospace-border aerospace-border-tl whitespace-pre-wrap">
                                        {memory.message}
                                    </div>
                                </div>

                                {attachments.length > 0 && (
                                    <div className="space-y-8">
                                        <h4 className="font-aerospace text-xs font-bold uppercase tracking-[0.3em] text-zinc-500">Associated Technical Data</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                            {attachments.map((url, i) => (
                                                <a key={i} href={url} target="_blank" rel="noopener" className="aspect-square bg-black border border-white/5 aerospace-border group overflow-hidden">
                                                    <img src={url} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="pt-20 text-center space-y-8 opacity-40">
                                <div className="font-aerospace text-xs uppercase tracking-[0.5em] text-cyan-400 animate-pulse">Awaiting Payload Release Window...</div>
                                <div className="max-w-sm mx-auto">
                                    <MemoryCountdown unlockDate={memory.unlock_date} unlockTime={memory.unlock_time} isUnlocked={memory.is_unlocked} />
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </V2Layout>
    );
};

export default V2SharedMemory;
