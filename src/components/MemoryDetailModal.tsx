import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StarMap } from '@/components/StarMap';
import { MemoryCountdown } from '@/components/MemoryCountdown';
import { StarWarpAnimation } from '@/components/StarWarpAnimation';
import { Lock, Calendar, Star, Share2, Copy, Check, FileText, Film, Sparkles, MapPin, X } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import type { Memory } from '@/hooks/useMemories';

interface MemoryDetailModalProps {
  memory: Memory | null;
  isOpen: boolean;
  onClose: () => void;
  onGenerateShareLink?: (id: string) => Promise<string | null>;
}

export const MemoryDetailModal = ({ memory, isOpen, onClose, onGenerateShareLink }: MemoryDetailModalProps) => {
  const [copied, setCopied] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [showWarpAnimation, setShowWarpAnimation] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    if (isOpen && memory?.is_unlocked) {
      setShowWarpAnimation(true);
      setAnimationComplete(false);
      // Fallback: ensure content shows even if animation fails
      const timeout = setTimeout(() => {
        setAnimationComplete(true);
        setShowWarpAnimation(false);
      }, 3000);
      return () => clearTimeout(timeout);
    } else {
      setShowWarpAnimation(false);
      setAnimationComplete(true); // Set to true so content shows immediately for locked memories
    }
  }, [isOpen, memory?.is_unlocked]);

  const handleAnimationComplete = useCallback(() => {
    setAnimationComplete(true);
    setShowWarpAnimation(false);
  }, []);

  if (!memory) return null;

  const coordinates = memory.star_coordinates as { ra: number; dec: number } | null;
  
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

  const handleGenerateShareLink = async () => {
    if (!onGenerateShareLink) return;
    
    setIsGeneratingLink(true);
    const link = await onGenerateShareLink(memory.id);
    if (link) {
      setShareLink(link);
    }
    setIsGeneratingLink(false);
  };

  const handleCopyLink = async () => {
    const link = shareLink || `${window.location.origin}/memory/${memory.share_token}`;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const getAttachmentType = (url: string) => {
    const ext = url.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return 'image';
    if (['mp4', 'webm', 'mov'].includes(ext || '')) return 'video';
    return 'file';
  };

  const attachments = memory.attachment_url ? memory.attachment_url.split(',').filter(Boolean) : [];

  return (
    <>
      {/* Star Warp Animation */}
      <StarWarpAnimation 
        isActive={showWarpAnimation} 
        onComplete={handleAnimationComplete}
        duration={1800}
      />
      
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] bg-gradient-to-b from-background via-background to-background/95 backdrop-blur-2xl border-primary/20 p-0 overflow-hidden shadow-2xl shadow-primary/5">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-50 rounded-full p-2 bg-background/80 backdrop-blur-sm border border-border/50 text-muted-foreground hover:text-foreground hover:bg-background transition-all"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Decorative Header Gradient */}
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent pointer-events-none" />
          
          <ScrollArea className="max-h-[90vh]">
            <div className={`relative p-8 pt-12 space-y-8 transition-opacity duration-500 ${
              memory.is_unlocked && !animationComplete && showWarpAnimation ? 'opacity-0' : 'opacity-100'
            }`}>
            {/* Star Map Section */}
            {coordinates && typeof coordinates.ra === 'number' && typeof coordinates.dec === 'number' && (
              <div className="flex justify-center">
                <div className="relative">
                  {/* Glow Effect */}
                  <div className="absolute inset-0 blur-3xl bg-primary/20 rounded-full scale-75" />
                  <StarMap 
                    ra={coordinates.ra} 
                    dec={coordinates.dec} 
                    size={240} 
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
            <div className="text-center space-y-3 max-w-full overflow-hidden">
              <h2 className="text-2xl sm:text-3xl font-display tracking-wide text-foreground break-words hyphens-auto">
                {memory.title || `A Memory for ${memory.recipient_name}`}
              </h2>
              <div className="flex items-center justify-center gap-2 text-primary/80">
                <MapPin className="w-4 h-4 shrink-0" />
                <span className="text-sm font-medium tracking-wide break-words">{memory.recipient_name}</span>
              </div>
            </div>

            {/* Constellation Badge */}
            {memory.constellation && (
              <div className="flex justify-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-serif tracking-wider">{memory.constellation}</span>
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
              <Star className="w-4 h-4 text-primary/50" />
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
            </div>

            {/* Memory Info Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1 text-center p-4 rounded-xl bg-background/50 border border-border/30">
                <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">Unlock Date</span>
                </div>
                <p className="font-serif text-foreground">{formatDate(memory.unlock_date)}</p>
                <p className="text-sm text-muted-foreground">{formatTime(memory.unlock_time)}</p>
              </div>
              
              <div className="space-y-1 text-center p-4 rounded-xl bg-background/50 border border-border/30">
                <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
                  <Lock className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">Status</span>
                </div>
                {memory.is_unlocked ? (
                  <p className="font-serif text-emerald-400">✦ Unlocked ✦</p>
                ) : (
                  <MemoryCountdown 
                    unlockDate={memory.unlock_date} 
                    unlockTime={memory.unlock_time}
                    isUnlocked={memory.is_unlocked}
                  />
                )}
              </div>
            </div>

            {/* Locked State */}
            {!memory.is_unlocked && (
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-primary/10 via-primary/5 to-transparent border border-primary/20 p-8 text-center space-y-4">
                {/* Decorative stars */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute top-4 left-8 w-1 h-1 rounded-full bg-primary/40 animate-pulse" />
                  <div className="absolute top-12 right-12 w-1.5 h-1.5 rounded-full bg-primary/30 animate-pulse" style={{ animationDelay: '0.5s' }} />
                  <div className="absolute bottom-8 left-16 w-1 h-1 rounded-full bg-primary/50 animate-pulse" style={{ animationDelay: '1s' }} />
                </div>
                
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-b from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center">
                  <Lock className="w-7 h-7 text-primary" />
                </div>
                <div className="space-y-2">
                  <p className="font-serif text-lg text-foreground">This memory awaits its moment</p>
                  <p className="text-sm text-muted-foreground italic">Come back when the stars align...</p>
                </div>
                <div className="pt-2">
                  <MemoryCountdown 
                    unlockDate={memory.unlock_date} 
                    unlockTime={memory.unlock_time}
                    isUnlocked={memory.is_unlocked}
                  />
                </div>
              </div>
            )}

            {/* Message - only show when unlocked */}
            {memory.is_unlocked && memory.message && (
              <div className="relative rounded-2xl bg-gradient-to-b from-background/80 to-background/40 border border-border/30 p-6 sm:p-8 space-y-4 overflow-hidden">
                <div className="absolute -top-3 left-6 px-3 py-1 bg-background border border-border/50 rounded-full">
                  <span className="text-xs text-muted-foreground uppercase tracking-widest">Message</span>
                </div>
                <p className="text-foreground whitespace-pre-wrap leading-relaxed text-lg font-serif pt-2 break-words overflow-wrap-anywhere">
                  {memory.message}
                </p>
              </div>
            )}

            {/* Attachments - only show when unlocked */}
            {memory.is_unlocked && attachments.length > 0 && (
              <div className="space-y-4">
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
                        className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-b from-background/60 to-background/30 border border-border/30 hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10 group"
                      >
                        {type === 'image' ? (
                          <img 
                            src={url} 
                            alt={`Attachment ${index + 1}`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : type === 'video' ? (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                            <Film className="w-10 h-10 text-muted-foreground group-hover:text-primary transition-colors" />
                            <span className="text-xs text-muted-foreground">Video</span>
                          </div>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                            <FileText className="w-10 h-10 text-muted-foreground group-hover:text-primary transition-colors" />
                            <span className="text-xs text-muted-foreground">Document</span>
                          </div>
                        )}
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Share Section */}
            <div className="pt-4 space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent to-border/50" />
                <Share2 className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1 h-px bg-gradient-to-l from-transparent to-border/50" />
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                {!shareLink && !memory.share_token ? (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleGenerateShareLink}
                    disabled={isGeneratingLink}
                    className="border-primary/30 hover:bg-primary/10"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    {isGeneratingLink ? 'Creating link...' : 'Create Share Link'}
                  </Button>
                ) : (
                  <div className="flex items-center gap-2 w-full max-w-md">
                    <code className="flex-1 text-xs bg-background/60 rounded-lg px-4 py-3 border border-border/40 truncate font-mono text-muted-foreground">
                      {shareLink || `${window.location.origin}/memory/${memory.share_token}`}
                    </code>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={handleCopyLink}
                      className="border-primary/30 hover:bg-primary/10 shrink-0"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};
