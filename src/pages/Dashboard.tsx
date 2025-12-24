import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Lock, Unlock, Plus, LogOut, Calendar, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { CosmicBackground } from '@/components/CosmicBackground';
import { useAuth } from '@/hooks/useAuth';

// Mock data for demonstration
const mockMemories = [
  {
    id: '1',
    recipientName: 'Sarah',
    unlockDate: new Date('2025-12-25'),
    unlockTime: '09:00',
    constellation: 'Orion',
    isUnlocked: false,
  },
  {
    id: '2',
    recipientName: 'Mom',
    unlockDate: new Date('2024-06-15'),
    unlockTime: '12:00',
    constellation: 'Cassiopeia',
    isUnlocked: true,
  },
  {
    id: '3',
    recipientName: 'Future Me',
    unlockDate: new Date('2026-01-01'),
    unlockTime: '00:00',
    constellation: 'Ursa Major',
    isUnlocked: false,
  },
];

const Dashboard = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [memories] = useState(mockMemories);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  const formatDate = (date: Date) => {
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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen relative">
      <CosmicBackground />
      
      {/* Header */}
      <header className="relative z-10 border-b border-border/50 bg-background/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Star className="w-6 h-6 text-primary" />
            <span className="font-display text-xl">Starhold</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span>{user?.name || 'User'}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display mb-2">Your Memories</h1>
            <p className="text-muted-foreground">
              {memories.filter(m => m.isUnlocked).length} unlocked · {memories.filter(m => !m.isUnlocked).length} waiting
            </p>
          </div>
          
          <Link to="/">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Memory
            </Button>
          </Link>
        </div>
        
        {/* Memories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memories.map((memory) => (
            <Card 
              key={memory.id} 
              className={`bg-background/60 backdrop-blur-xl border-border/50 transition-all hover:border-primary/50 ${
                memory.isUnlocked ? 'cursor-pointer' : 'opacity-80'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                    {memory.isUnlocked ? (
                      <Unlock className="w-5 h-5 text-primary" />
                    ) : (
                      <Lock className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    memory.isUnlocked 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {memory.isUnlocked ? 'Unlocked' : 'Locked'}
                  </span>
                </div>
                <CardTitle className="text-lg mt-3">For {memory.recipientName}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  {memory.constellation}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(memory.unlockDate)} at {formatTime(memory.unlockTime)}</span>
                </div>
                
                {memory.isUnlocked ? (
                  <Button variant="secondary" className="w-full">
                    View Memory
                  </Button>
                ) : (
                  <div className="text-center py-2 text-sm text-muted-foreground">
                    Opens on unlock date
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        
        {memories.length === 0 && (
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
      </main>
    </div>
  );
};

export default Dashboard;
