import React, { useState, useEffect } from 'react';
import { V2Layout } from '../layout/V2Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Star, Lock, Unlock, Plus, LogOut, Calendar, Settings,
    Sparkles, Trash2, Map, Eye, Share2, FileText, Image,
    Compass, ArrowLeft, Activity, Layers, LayoutGrid
} from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useMemories, Memory } from '@/hooks/useMemories';
import { toast } from 'sonner';
import { ProfileSettings } from '@/components/ProfileSettings';
import { MemoryDetailModal } from '@/components/MemoryDetailModal';
import { MemoryCardSkeleton } from '@/components/MemoryCardSkeleton';

const V2Dashboard = () => {
    const { user, profile, isAuthenticated, isLoading: authLoading, logout } = useAuth();
    const { memories, isLoading: memoriesLoading, deleteMemory } = useMemories();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState('memories');
    const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) navigate('/auth');
    }, [isAuthenticated, authLoading, navigate]);

    useEffect(() => {
        const tab = searchParams.get('tab');
        setActiveTab(tab === 'settings' ? 'settings' : 'memories');
    }, [searchParams]);

    const unlockedCount = memories.filter(m => m.is_unlocked).length;
    const lockedCount = memories.filter(m => !m.is_unlocked).length;

    const handleDelete = async (id: string) => {
        if (confirm('De-orbit this record permanently?')) {
            const success = await deleteMemory(id);
            if (success) toast.success('Record De-orbited');
        }
    };

    if (authLoading) return <div className="h-screen bg-[#0A0A12] flex items-center justify-center font-aerospace text-cyan-500 animate-pulse uppercase tracking-[0.5em]">Syncing Base Station...</div>;

    return (
        <V2Layout>
            <div className="min-h-screen bg-[#0A0A12] pt-24 pb-12 px-6">
                <main className="max-w-7xl mx-auto space-y-12">

                    {/* Header HUD */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-12">
                        <div className="space-y-4">
                            <h1 className="font-aerospace text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
                                Mission Command: <span className="text-cyan-400">{profile?.display_name || user?.email?.split('@')[0] || 'STARGAZER'}</span>
                            </h1>
                            <div className="flex items-center gap-6 font-aerospace text-[10px] uppercase tracking-widest text-zinc-500">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                    <span>{unlockedCount} Records Active</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-cyan-500" />
                                    <span>{lockedCount} In Transit</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button
                                onClick={() => navigate('/?create=true')}
                                className="bg-cyan-500 hover:bg-cyan-400 text-[#0A0A12] font-aerospace font-bold uppercase tracking-widest h-12 px-8 rounded-none aerospace-border aerospace-border-tl transition-all"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                New Memory
                            </Button>
                        </div>
                    </div>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                        <TabsList className="bg-white/5 border border-white/10 rounded-none p-1 h-auto">
                            <TabsTrigger
                                value="memories"
                                className="data-[state=active]:bg-cyan-500 data-[state=active]:text-[#0A0A12] font-aerospace uppercase tracking-widest text-xs h-10 px-8 rounded-none transition-all"
                            >
                                <LayoutGrid className="w-3 h-3 mr-2" /> Orbiting Records
                            </TabsTrigger>
                            <TabsTrigger
                                value="settings"
                                className="data-[state=active]:bg-cyan-500 data-[state=active]:text-[#0A0A12] font-aerospace uppercase tracking-widest text-xs h-10 px-8 rounded-none transition-all"
                            >
                                <Settings className="w-3 h-3 mr-2" /> Station Settings
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="memories" className="mt-0 space-y-8">
                            {memoriesLoading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[1, 2, 3].map(i => <div key={i} className="h-64 bg-white/5 animate-pulse aerospace-border" />)}
                                </div>
                            ) : memories.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {memories.map((memory) => (
                                        <div key={memory.id} className="group relative bg-[#0A0A12] border border-white/5 p-8 aerospace-border aerospace-border-tl hover:bg-white/[0.02] transition-colors">
                                            <div className="absolute top-4 right-4 flex items-center gap-2">
                                                <div className={`p-1.5 rounded-sm ${memory.is_unlocked ? 'bg-emerald-500/10 text-emerald-500' : 'bg-cyan-500/10 text-cyan-400'}`}>
                                                    {memory.is_unlocked ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="w-8 h-8 text-zinc-600 hover:text-red-500 transition-colors"
                                                    onClick={() => handleDelete(memory.id)}
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </Button>
                                            </div>

                                            <div className="space-y-6">
                                                <div className="space-y-2">
                                                    <h3 className="font-aerospace text-xl font-black uppercase tracking-widest text-white truncate pr-12">
                                                        {memory.title || `RECORD-${memory.id.substring(0, 4)}`}
                                                    </h3>
                                                    <div className="flex items-center gap-2 font-aerospace text-[10px] text-zinc-500 uppercase tracking-widest">
                                                        <Activity className="w-3 h-3" />
                                                        {memory.constellation || 'CUSTOM PATCH'}
                                                    </div>
                                                </div>

                                                <div className="space-y-1 font-technical text-[10px] text-zinc-400 uppercase tracking-widest bg-black/40 p-4 border border-white/5">
                                                    <div className="flex justify-between">
                                                        <span>Window</span>
                                                        <span>{new Date(memory.unlock_date).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Integrity</span>
                                                        <span className="text-emerald-500">Verified</span>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-3 pt-4">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => navigate(`/v2/observatory?memoryId=${memory.id}`)}
                                                        className="bg-white/5 border-white/10 text-white font-aerospace uppercase tracking-widest text-[9px] h-10 rounded-none hover:bg-cyan-500 hover:text-[#0A0A12] hover:border-cyan-500"
                                                    >
                                                        <Map className="w-3 h-3 mr-2" /> View Map
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedMemory(memory);
                                                            setIsDetailOpen(true);
                                                        }}
                                                        className="bg-white/5 border-white/10 text-white font-aerospace uppercase tracking-widest text-[9px] h-10 rounded-none hover:bg-cyan-500 hover:text-[#0A0A12] hover:border-cyan-500"
                                                    >
                                                        <Eye className="w-3 h-3 mr-2" /> {memory.is_unlocked ? "Open" : "Spec"}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-32 border border-white/5 bg-white/[0.01] aerospace-border">
                                    <h3 className="font-aerospace text-2xl font-black uppercase tracking-widest text-zinc-600 mb-4">No Records Found in Orbit</h3>
                                    <Button onClick={() => navigate('/?create=true')} className="bg-cyan-500 hover:bg-cyan-400 text-[#0A0A12] font-aerospace font-bold uppercase tracking-widest px-8 h-12 rounded-none">
                                        Initiate First Archive
                                    </Button>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="settings" className="mt-0">
                            <div className="bg-[#0A0A12] border border-white/5 p-12 aerospace-border aerospace-border-tl max-w-2xl mx-auto">
                                <div className="space-y-8">
                                    <div className="flex items-center gap-4 mb-8">
                                        <Button variant="ghost" size="sm" onClick={() => setActiveTab('memories')} className="text-zinc-500 hover:text-white font-aerospace uppercase tracking-widest text-xs">
                                            <ArrowLeft className="w-4 h-4 mr-2" /> Back
                                        </Button>
                                    </div>
                                    <ProfileSettings />
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </main>

                <MemoryDetailModal
                    memory={selectedMemory}
                    isOpen={isDetailOpen}
                    onClose={() => {
                        setIsDetailOpen(false);
                        setSelectedMemory(null);
                    }}
                    showAnimation={true}
                />
            </div>
        </V2Layout>
    );
};

export default V2Dashboard;
