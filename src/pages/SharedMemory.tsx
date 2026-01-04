import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StarMap } from '@/components/StarMap';
import { MemoryCountdown } from '@/components/MemoryCountdown';
import { CosmicBackground } from '@/components/CosmicBackground';
import { Star, Lock, Calendar, ArrowLeft, FileText, Image, Film, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Memory } from '@/hooks/useMemories';
import { Skeleton } from '@/components/ui/skeleton';

const SharedMemory = () => {
  const { token } = useParams<{ token: string }>();
  const [memory, setMemory] = useState<Memory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMemory = async () => {
      if (!token) {
        setError('Invalid share link');
        setIsLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('memories')
        .select('*')
        .eq('share_token', token)
        .maybeSingle();

      if (fetchError || !data) {
        setError('Memory not found or link expired');
        setIsLoading(false);
        return;
      }

      // Check and update unlock status
      const now = new Date();
      const unlockDateTime = new Date(`${data.unlock_date}T${data.unlock_time}`);
      const shouldBeUnlocked = now >= unlockDateTime;

      if (shouldBeUnlocked && !data.is_unlocked) {
        await supabase
          .from('memories')
          .update({ is_unlocked: true })
          .eq('id', data.id);
        setMemory({ ...data, is_unlocked: true } as Memory);
      } else {
        setMemory(data as Memory);
      }

      setIsLoading(false);
    };

    fetchMemory();
  }, [token]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
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

  const getAttachmentType = (url: string) => {
    const ext = url.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return 'image';
    if (['mp4', 'webm', 'mov'].includes(ext || '')) return 'video';
    return 'file';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen relative">
        <CosmicBackground />
        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <Skeleton className="h-8 w-32 mb-8" />
            <Card className="bg-background/60 backdrop-blur-xl border-border/50">
              <CardContent className="p-8 space-y-6">
                <div className="flex justify-center">
                  <Skeleton className="w-64 h-64 rounded-full" />
                </div>
                <Skeleton className="h-6 w-3/4 mx-auto" />
                <Skeleton className="h-4 w-1/2 mx-auto" />
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error || !memory) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <CosmicBackground />
        <div className="relative z-10 text-center space-y-6">
          <Star className="w-16 h-16 text-muted-foreground mx-auto" />
          <h1 className="text-2xl font-display">{error || 'Memory not found'}</h1>
          <p className="text-muted-foreground">
            This memory link may have expired or doesn't exist.
          </p>
          <Link to="/">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const coordinates = memory.star_coordinates as { ra: number; dec: number } | null;
  const attachments = memory.attachment_url ? memory.attachment_url.split(',').filter(Boolean) : [];

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
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-8 sm:py-16">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Memory Card */}
          <Card className="bg-background/60 backdrop-blur-xl border-border/50 overflow-hidden">
            <CardContent className="p-6 sm:p-8 space-y-8">
              {/* Star Map */}
              {coordinates && typeof coordinates.ra === 'number' && typeof coordinates.dec === 'number' && (
                <div className="flex justify-center">
                  <StarMap 
                    ra={coordinates.ra} 
                    dec={coordinates.dec} 
                    size={260} 
                    showCoordinates
                    showDownload
                    recipientName={memory.recipient_name}
                    unlockDate={new Date(memory.unlock_date)}
                    unlockTime={memory.unlock_time}
                    constellation={memory.constellation || undefined}
                  />
                </div>
              )}

              {/* Title */}
              <div className="text-center space-y-2">
                <h1 className="text-2xl sm:text-3xl font-display">
                  {memory.title || `A Memory for ${memory.recipient_name}`}
                </h1>
                {memory.constellation && (
                  <p className="text-muted-foreground flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    {memory.constellation}
                  </p>
                )}
              </div>

              {/* Unlock Info */}
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>
                  {memory.is_unlocked ? 'Unlocked' : 'Unlocks'} {formatDate(memory.unlock_date)} at {formatTime(memory.unlock_time)}
                </span>
              </div>

              {/* Content */}
              {memory.is_unlocked ? (
                <div className="space-y-6 animate-fade-in-up">
                  {/* Message */}
                  {memory.message && (
                    <div className="bg-background/50 rounded-xl p-6 border border-border/30">
                      <p className="text-foreground whitespace-pre-wrap leading-relaxed text-lg">
                        {memory.message}
                      </p>
                    </div>
                  )}

                  {/* Attachments */}
                  {attachments.length > 0 && (
                    <div className="space-y-4">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider text-center">
                        Attached Memories
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {attachments.map((url, index) => {
                          const type = getAttachmentType(url);
                          return (
                            <a 
                              key={index}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="relative aspect-square rounded-lg overflow-hidden bg-background/50 border border-border/30 hover:border-primary/50 transition-all hover:scale-105 group"
                            >
                              {type === 'image' ? (
                                <img 
                                  src={url} 
                                  alt={`Attachment ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              ) : type === 'video' ? (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Film className="w-10 h-10 text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <FileText className="w-10 h-10 text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                              )}
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 space-y-6">
                  <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Lock className="w-10 h-10 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg text-muted-foreground">
                      This memory is locked
                    </p>
                    <p className="text-sm text-muted-foreground/80">
                      Come back when the stars align...
                    </p>
                  </div>
                  <div className="inline-block">
                    <MemoryCountdown 
                      unlockDate={memory.unlock_date}
                      unlockTime={memory.unlock_time}
                      isUnlocked={memory.is_unlocked}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Want to create your own celestial memory?
            </p>
            <Link to="/">
              <Button variant="gold">
                <Star className="w-4 h-4 mr-2" />
                Create a Memory
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SharedMemory;
