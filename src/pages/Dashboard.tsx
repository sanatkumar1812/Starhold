import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Lock, Unlock, Plus, LogOut, Calendar, Settings, Sparkles, Trash2, Map, Eye, Share2, FileText, Image, Compass, ArrowLeft } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CosmicBackground } from '@/components/CosmicBackground';
import { ProfileSettings } from '@/components/ProfileSettings';
import { StarMapModal } from '@/components/StarMapModal';
import { MemoryDetailModal } from '@/components/MemoryDetailModal';
import { MemoryCountdown } from '@/components/MemoryCountdown';
import { MemoryCardSkeleton } from '@/components/MemoryCardSkeleton';
import { InteractiveMap } from '@/components/InteractiveMap';
import { useAuth } from '@/hooks/useAuth';
import { useMemories, Memory } from '@/hooks/useMemories';
import { toast } from 'sonner';

import { Navigation } from '@/components/Navigation';

const Dashboard = () => {
  const { user, profile, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const { memories, isLoading: memoriesLoading, deleteMemory, generateShareToken } = useMemories();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('memories');
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [isStarMapOpen, setIsStarMapOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'settings') {
      setActiveTab('settings');
    } else {
      setActiveTab('memories');
    }
  }, [searchParams]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleDeleteMemory = async (id: string) => {
    if (confirm('Are you sure you want to delete this memory?')) {
      const success = await deleteMemory(id);
      if (success) {
        toast.success('Memory deleted');
      }
    }
  };

  const handleGenerateShareLink = async (id: string) => {
    return await generateShareToken(id);
  };

  const getAttachmentCount = (memory: Memory) => {
    if (!memory.attachment_url) return 0;
    return memory.attachment_url.split(',').filter(Boolean).length;
  };

  const unlockedCount = memories.filter(m => m.is_unlocked).length;
  const lockedCount = memories.filter(m => !m.is_unlocked).length;

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CosmicBackground />
        <div className="relative z-10 flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-primary animate-pulse" />
          <span className="text-lg">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <CosmicBackground />
      <Navigation />

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 pt-24 pb-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
            <div>
              <h1 className="text-3xl sm:text-4xl font-display mb-2">
                Welcome, {profile?.display_name || user?.email?.split('@')[0] || 'Stargazer'}
              </h1>
              <p className="text-muted-foreground">
                {unlockedCount} unlocked · {lockedCount} waiting
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link to="/starmap">
                <Button className="whitespace-nowrap bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white border-0 shadow-lg shadow-purple-500/20 gap-2">
                  <Compass className="w-4 h-4" />
                  <span>Enter the Cosmos</span>
                </Button>
              </Link>

              <Link to="/?create=true">
                <Button className="whitespace-nowrap flex-1 sm:flex-initial">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Memory
                </Button>
              </Link>
            </div>
          </div>

          <TabsContent value="memories" className="mt-0 space-y-8">
            {memoriesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <MemoryCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <>
                {/* Removed redundant header */}

                {memories.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {memories.map((memory) => (
                      <Card
                        key={memory.id}
                        className={`bg-background/60 backdrop-blur-xl border-border/50 transition-all hover:border-primary/50 group overflow-hidden ${memory.is_unlocked ? '' : 'opacity-95'
                          }`}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className={`p-2.5 rounded-lg ${memory.is_unlocked ? 'bg-green-500/10 border border-green-500/20' : 'bg-primary/10 border border-primary/20'}`}>
                              {memory.is_unlocked ? (
                                <Unlock className="w-5 h-5 text-green-400" />
                              ) : (
                                <Lock className="w-5 h-5 text-primary" />
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {memory.share_token && (
                                <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">
                                  <Share2 className="w-3 h-3 inline mr-1" />
                                  Shared
                                </span>
                              )}
                              <span className={`text-xs px-2 py-1 rounded-full ${memory.is_unlocked
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-muted text-muted-foreground'
                                }`}>
                                {memory.is_unlocked ? 'Unlocked' : 'Locked'}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteMemory(memory.id);
                                }}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                          <CardTitle className="text-lg mt-3 line-clamp-1">
                            {memory.title || `For ${memory.recipient_name}`}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            <Star className="w-3 h-3" />
                            <span className="truncate">{memory.constellation || 'Custom Star'}</span>
                            {getAttachmentCount(memory) > 0 && (
                              <span className="flex items-center gap-1 text-xs">
                                <Image className="w-3 h-3" />
                                {getAttachmentCount(memory)}
                              </span>
                            )}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          {/* Date & Countdown */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">{formatDate(memory.unlock_date)} at {formatTime(memory.unlock_time)}</span>
                            </div>
                            {!memory.is_unlocked && (
                              <MemoryCountdown
                                unlockDate={memory.unlock_date}
                                unlockTime={memory.unlock_time}
                                isUnlocked={memory.is_unlocked}
                              />
                            )}
                          </div>

                          {/* Preview for unlocked memories */}
                          {memory.is_unlocked && memory.message && (
                            <p className="text-sm text-foreground/70 line-clamp-2 bg-background/30 rounded-lg p-3 border border-border/20">
                              {memory.message}
                            </p>
                          )}

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 gap-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedMemory(memory);
                                setIsStarMapOpen(true);
                              }}
                            >
                              <Map className="w-4 h-4" />
                              <span className="hidden sm:inline">Star Map</span>
                            </Button>
                            <Button
                              variant={memory.is_unlocked ? "default" : "secondary"}
                              size="sm"
                              className="flex-1 gap-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedMemory(memory);
                                setIsDetailOpen(true);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                              <span className="hidden sm:inline">{memory.is_unlocked ? 'View' : 'Details'}</span>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-display mb-2">No memories yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Create your first celestial memory to get started
                    </p>
                    <Link to="/?create=true">
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Memory
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="settings" className="mt-0">
            <div className="max-w-2xl space-y-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setActiveTab('memories');
                  navigate('/dashboard'); // Clear the ?tab=settings param
                }}
                className="text-muted-foreground hover:text-white -ml-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <ProfileSettings />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Star Map Modal */}
      <StarMapModal
        memory={selectedMemory}
        isOpen={isStarMapOpen}
        onClose={() => {
          setIsStarMapOpen(false);
          setSelectedMemory(null);
        }}
      />

      {/* Memory Detail Modal */}
      <MemoryDetailModal
        memory={selectedMemory}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedMemory(null);
        }}
        onGenerateShareLink={handleGenerateShareLink}
      />
    </div>
  );
};

export default Dashboard;
