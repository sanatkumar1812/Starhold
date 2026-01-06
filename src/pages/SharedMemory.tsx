import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { StarMap } from '@/components/StarMap';
import { MemoryCountdown } from '@/components/MemoryCountdown';
import { CosmicBackground } from '@/components/CosmicBackground';
import { Star, Lock, Calendar, ArrowLeft, FileText, Film, Sparkles, MapPin, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Memory } from '@/hooks/useMemories';
import { Skeleton } from '@/components/ui/skeleton';

const SharedMemory = () => {
  const { token } = useParams<{ token: string }>();
  const [memory, setMemory] = useState<Memory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showZoomAnimation, setShowZoomAnimation] = useState(false);

  useEffect(() => {
    if (memory?.is_unlocked && !isLoading) {
      setShowZoomAnimation(true);
    }
  }, [memory?.is_unlocked, isLoading]);

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
            <div className="bg-background/60 backdrop-blur-xl border border-border/50 rounded-3xl p-8 space-y-8">
              <div className="flex justify-center">
                <Skeleton className="w-64 h-64 rounded-full" />
              </div>
              <Skeleton className="h-8 w-3/4 mx-auto" />
              <Skeleton className="h-4 w-1/2 mx-auto" />
              <Skeleton className="h-40 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !memory) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <CosmicBackground />
        <div className="relative z-10 text-center space-y-8 px-4">
          <div className="w-24 h-24 mx-auto rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Star className="w-12 h-12 text-primary/50" />
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-display">{error || 'Memory not found'}</h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              This memory link may have expired or doesn't exist in our constellation.
            </p>
          </div>
          <Link to="/">
            <Button variant="outline" className="border-primary/30">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return Home
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
      <header className="relative z-10 border-b border-border/30 bg-background/30 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center transition-transform group-hover:scale-105">
              <Star className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-serif text-xl font-semibold text-foreground">Starhold</span>
          </Link>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-12 sm:py-20">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Memory Card */}
          <div className="relative rounded-3xl bg-gradient-to-b from-background/80 via-background/60 to-background/40 backdrop-blur-2xl border border-primary/20 overflow-hidden shadow-2xl shadow-primary/5">
            {/* Decorative gradient overlay */}
            <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent pointer-events-none" />
            
            {/* Star Zoom Animation Overlay */}
            {showZoomAnimation && (
              <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden">
                {[...Array(16)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute star-zoom-overlay"
                    style={{
                      left: `${15 + Math.random() * 70}%`,
                      top: `${15 + Math.random() * 70}%`,
                      width: `${2 + Math.random() * 5}px`,
                      height: `${2 + Math.random() * 5}px`,
                      borderRadius: '50%',
                      background: `radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)`,
                      animationDelay: `${i * 0.04}s`,
                    }}
                  />
                ))}
                {/* Central burst */}
                <div
                  className="absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 star-zoom-overlay"
                  style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: `radial-gradient(circle, hsl(var(--primary) / 0.6) 0%, hsl(var(--primary) / 0.2) 30%, transparent 70%)`,
                  }}
                />
              </div>
            )}
            
            {/* Decorative stars */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-8 left-12 w-1 h-1 rounded-full bg-primary/40 animate-pulse" />
              <div className="absolute top-20 right-16 w-1.5 h-1.5 rounded-full bg-primary/30 animate-pulse" style={{ animationDelay: '0.5s' }} />
              <div className="absolute top-32 left-24 w-1 h-1 rounded-full bg-primary/50 animate-pulse" style={{ animationDelay: '1s' }} />
              <div className="absolute bottom-20 right-20 w-1 h-1 rounded-full bg-primary/40 animate-pulse" style={{ animationDelay: '1.5s' }} />
            </div>

            <div className={`relative p-8 sm:p-12 space-y-10 ${showZoomAnimation ? 'content-reveal' : ''}`}>
              {/* Star Map */}
              {coordinates && typeof coordinates.ra === 'number' && typeof coordinates.dec === 'number' && (
                <div className="flex justify-center">
                  <div className="relative">
                    {/* Glow Effect */}
                    <div className="absolute inset-0 blur-3xl bg-primary/20 rounded-full scale-75" />
                    <StarMap 
                      ra={coordinates.ra} 
                      dec={coordinates.dec} 
                      size={280} 
                      showCoordinates
                      showDownload
                      recipientName={memory.recipient_name}
                      unlockDate={new Date(memory.unlock_date)}
                      unlockTime={memory.unlock_time}
                      constellation={memory.constellation || undefined}
                    />
                  </div>
                </div>
              )}

              {/* Title & Recipient */}
              <div className="text-center space-y-4 max-w-full overflow-hidden px-2">
                <h1 className="text-3xl sm:text-4xl font-display tracking-wide text-foreground break-words hyphens-auto">
                  {memory.title || `A Memory for ${memory.recipient_name}`}
                </h1>
                <div className="flex items-center justify-center gap-2 text-primary/80">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span className="text-sm font-medium tracking-wide break-words">{memory.recipient_name}</span>
                </div>
              </div>

              {/* Constellation Badge */}
              {memory.constellation && (
                <div className="flex justify-center">
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary">
                    <Sparkles className="w-4 h-4" />
                    <span className="font-serif tracking-wider">{memory.constellation}</span>
                  </div>
                </div>
              )}

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
                <Star className="w-4 h-4 text-primary/50" />
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
              </div>

              {/* Unlock Info Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2 text-center p-5 rounded-2xl bg-background/40 border border-border/30">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground mb-3">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-widest">Unlock Date</span>
                  </div>
                  <p className="font-serif text-lg text-foreground">{formatDate(memory.unlock_date)}</p>
                  <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span className="text-sm">{formatTime(memory.unlock_time)}</span>
                  </div>
                </div>
                
                <div className="space-y-2 text-center p-5 rounded-2xl bg-background/40 border border-border/30">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground mb-3">
                    <Lock className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-widest">Status</span>
                  </div>
                  {memory.is_unlocked ? (
                    <p className="font-serif text-lg text-emerald-400">✦ Unlocked ✦</p>
                  ) : (
                    <div className="pt-1">
                      <MemoryCountdown 
                        unlockDate={memory.unlock_date} 
                        unlockTime={memory.unlock_time}
                        isUnlocked={memory.is_unlocked}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              {memory.is_unlocked ? (
                <div className="space-y-8 animate-fade-in-up">
                  {/* Message */}
                  {memory.message && (
                    <div className="relative rounded-2xl bg-gradient-to-b from-background/60 to-background/30 border border-border/30 p-6 sm:p-10 overflow-hidden">
                      <div className="absolute -top-3 left-6 sm:left-8 px-4 py-1 bg-background border border-border/50 rounded-full">
                        <span className="text-xs text-muted-foreground uppercase tracking-widest">Message</span>
                      </div>
                      <p className="text-foreground whitespace-pre-wrap leading-relaxed text-base sm:text-lg font-serif pt-2 break-words overflow-wrap-anywhere">
                        {memory.message}
                      </p>
                    </div>
                  )}

                  {/* Attachments */}
                  {attachments.length > 0 && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-border/50" />
                        <span className="text-xs text-muted-foreground uppercase tracking-widest">Attached Memories</span>
                        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-border/50" />
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {attachments.map((url, index) => {
                          const type = getAttachmentType(url);
                          return (
                            <a 
                              key={index}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-b from-background/60 to-background/30 border border-border/30 hover:border-primary/50 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-primary/10 group"
                            >
                              {type === 'image' ? (
                                <img 
                                  src={url} 
                                  alt={`Attachment ${index + 1}`}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                              ) : type === 'video' ? (
                                <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                                  <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                    <Film className="w-7 h-7 text-muted-foreground group-hover:text-primary transition-colors" />
                                  </div>
                                  <span className="text-xs text-muted-foreground">Play Video</span>
                                </div>
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                                  <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                    <FileText className="w-7 h-7 text-muted-foreground group-hover:text-primary transition-colors" />
                                  </div>
                                  <span className="text-xs text-muted-foreground">View Document</span>
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
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-primary/10 via-primary/5 to-transparent border border-primary/20 p-10 sm:p-12 text-center space-y-6">
                  {/* Additional decorative elements */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-6 left-10 w-1 h-1 rounded-full bg-primary/40 animate-pulse" />
                    <div className="absolute top-16 right-14 w-1.5 h-1.5 rounded-full bg-primary/30 animate-pulse" style={{ animationDelay: '0.5s' }} />
                    <div className="absolute bottom-10 left-20 w-1 h-1 rounded-full bg-primary/50 animate-pulse" style={{ animationDelay: '1s' }} />
                    <div className="absolute bottom-20 right-24 w-1 h-1 rounded-full bg-primary/35 animate-pulse" style={{ animationDelay: '0.7s' }} />
                  </div>
                  
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-b from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center">
                    <Lock className="w-9 h-9 text-primary" />
                  </div>
                  <div className="space-y-3">
                    <p className="font-serif text-2xl text-foreground">This memory awaits its moment</p>
                    <p className="text-muted-foreground italic">Come back when the stars align...</p>
                  </div>
                  <div className="pt-4">
                    <MemoryCountdown 
                      unlockDate={memory.unlock_date}
                      unlockTime={memory.unlock_time}
                      isUnlocked={memory.is_unlocked}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center space-y-6 py-8">
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-border/30" />
              <Sparkles className="w-4 h-4 text-primary/40" />
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-border/30" />
            </div>
            <p className="text-muted-foreground font-serif text-lg">
              Want to create your own celestial memory?
            </p>
            <Link to="/">
              <Button variant="gold" size="lg" className="shadow-lg shadow-primary/20">
                <Star className="w-5 h-5 mr-2" />
                Create Your Memory
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SharedMemory;
