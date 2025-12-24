import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Lock, Unlock, Plus, LogOut, Calendar, User, Settings, Sparkles, Trash2, Map } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { CosmicBackground } from '@/components/CosmicBackground';
import { ProfileSettings } from '@/components/ProfileSettings';
import { StarMapModal } from '@/components/StarMapModal';
import { useAuth } from '@/hooks/useAuth';
import { useMemories, Memory } from '@/hooks/useMemories';
import { toast } from 'sonner';

const Dashboard = () => {
  const { user, profile, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const { memories, isLoading: memoriesLoading, deleteMemory } = useMemories();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('memories');
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [isStarMapOpen, setIsStarMapOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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

  const getInitials = () => {
    if (profile?.display_name) {
      return profile.display_name.slice(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return 'U';
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
      
      {/* Header */}
      <header className="relative z-10 border-b border-border/50 bg-background/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
              <Star className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-serif text-xl font-semibold text-foreground">Starhold</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={profile?.avatar_url || undefined} alt="Profile" />
                <AvatarFallback className="bg-primary/20 text-primary text-xs">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground hidden sm:block">
                {profile?.display_name || user?.email?.split('@')[0] || 'User'}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-display mb-2">
                Welcome, {profile?.display_name || user?.email?.split('@')[0] || 'Stargazer'}
              </h1>
              <p className="text-muted-foreground">
                {unlockedCount} unlocked · {lockedCount} waiting
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <TabsList className="bg-background/50">
                <TabsTrigger value="memories" className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span className="hidden sm:inline">Memories</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="gap-2">
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Settings</span>
                </TabsTrigger>
              </TabsList>
              
              <Link to="/">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Create Memory</span>
                </Button>
              </Link>
            </div>
          </div>
          
          <TabsContent value="memories" className="mt-0">
            {memoriesLoading ? (
              <div className="flex items-center justify-center py-16">
                <Sparkles className="w-6 h-6 text-primary animate-pulse" />
              </div>
            ) : memories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {memories.map((memory) => (
                  <Card 
                    key={memory.id} 
                    className={`bg-background/60 backdrop-blur-xl border-border/50 transition-all hover:border-primary/50 group ${
                      memory.is_unlocked ? 'cursor-pointer' : 'opacity-90'
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                          {memory.is_unlocked ? (
                            <Unlock className="w-5 h-5 text-primary" />
                          ) : (
                            <Lock className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            memory.is_unlocked 
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
                      <CardTitle className="text-lg mt-3">
                        {memory.title || `For ${memory.recipient_name}`}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {memory.constellation || 'Custom Star'}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(memory.unlock_date)} at {formatTime(memory.unlock_time)}</span>
                      </div>
                      
                      {/* View Star Map Button - Always visible */}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mb-3 gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMemory(memory);
                          setIsStarMapOpen(true);
                        }}
                      >
                        <Map className="w-4 h-4" />
                        View Star Map
                      </Button>
                      
                      {memory.is_unlocked ? (
                        <div className="space-y-3">
                          {memory.message && (
                            <p className="text-sm text-foreground/80 line-clamp-3">
                              {memory.message}
                            </p>
                          )}
                          <Button 
                            variant="secondary" 
                            className="w-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedMemory(memory);
                              setIsStarMapOpen(true);
                            }}
                          >
                            View Full Memory
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center py-2 text-sm text-muted-foreground">
                          Opens on unlock date
                        </div>
                      )}
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
                <Link to="/">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Memory
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="settings" className="mt-0">
            <div className="max-w-2xl">
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
    </div>
  );
};

export default Dashboard;
