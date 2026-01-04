import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StarMap } from '@/components/StarMap';
import { MemoryCountdown } from '@/components/MemoryCountdown';
import { Lock, Calendar, Star, Share2, Copy, Check, FileText, Image, Film, X } from 'lucide-react';
import { useState } from 'react';
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
    if (!shareLink) return;
    await navigator.clipboard.writeText(shareLink);
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] bg-background/95 backdrop-blur-xl border-border/50 p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Star className="w-5 h-5 text-primary" />
            {memory.title || `Memory for ${memory.recipient_name}`}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(90vh-100px)]">
          <div className="p-6 pt-4 space-y-6">
            {/* Star Map Section */}
            {coordinates && typeof coordinates.ra === 'number' && typeof coordinates.dec === 'number' && (
              <div className="flex justify-center">
                <StarMap 
                  ra={coordinates.ra} 
                  dec={coordinates.dec} 
                  size={220} 
                  showCoordinates
                  showDownload
                  recipientName={memory.recipient_name}
                  unlockDate={new Date(memory.unlock_date)}
                  unlockTime={memory.unlock_time}
                  constellation={memory.constellation || undefined}
                />
              </div>
            )}

            {/* Memory Info */}
            <div className="space-y-4 border-t border-border/30 pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Unlock Date</span>
                </div>
                <span className="text-foreground text-right">
                  {formatDate(memory.unlock_date)} at {formatTime(memory.unlock_time)}
                </span>

                {memory.constellation && (
                  <>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Star className="w-4 h-4" />
                      <span>Constellation</span>
                    </div>
                    <span className="text-foreground text-right">{memory.constellation}</span>
                  </>
                )}

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Lock className="w-4 h-4" />
                  <span>Status</span>
                </div>
                <div className="text-right">
                  {memory.is_unlocked ? (
                    <span className="text-green-400">Unlocked</span>
                  ) : (
                    <MemoryCountdown 
                      unlockDate={memory.unlock_date} 
                      unlockTime={memory.unlock_time}
                      isUnlocked={memory.is_unlocked}
                    />
                  )}
                </div>
              </div>

              {/* Countdown for locked memories */}
              {!memory.is_unlocked && (
                <div className="bg-primary/5 rounded-lg p-6 border border-primary/20 text-center space-y-3">
                  <Lock className="w-8 h-8 text-primary mx-auto" />
                  <p className="text-muted-foreground">
                    This memory will be revealed on the unlock date
                  </p>
                  <MemoryCountdown 
                    unlockDate={memory.unlock_date} 
                    unlockTime={memory.unlock_time}
                    isUnlocked={memory.is_unlocked}
                  />
                </div>
              )}

              {/* Message - only show when unlocked */}
              {memory.is_unlocked && memory.message && (
                <div className="bg-background/50 rounded-lg p-5 border border-border/30 space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Message</p>
                  <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                    {memory.message}
                  </p>
                </div>
              )}

              {/* Attachments - only show when unlocked */}
              {memory.is_unlocked && attachments.length > 0 && (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Attachments</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {attachments.map((url, index) => {
                      const type = getAttachmentType(url);
                      return (
                        <a 
                          key={index}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative aspect-square rounded-lg overflow-hidden bg-background/50 border border-border/30 hover:border-primary/50 transition-colors group"
                        >
                          {type === 'image' ? (
                            <img 
                              src={url} 
                              alt={`Attachment ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          ) : type === 'video' ? (
                            <div className="w-full h-full flex items-center justify-center">
                              <Film className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FileText className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                          )}
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Share Section */}
              <div className="border-t border-border/30 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Share this memory</span>
                  {!shareLink && !memory.share_token && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleGenerateShareLink}
                      disabled={isGeneratingLink}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      {isGeneratingLink ? 'Generating...' : 'Generate Link'}
                    </Button>
                  )}
                </div>
                
                {(shareLink || memory.share_token) && (
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-xs bg-background/50 rounded px-3 py-2 border border-border/30 truncate">
                      {shareLink || `${window.location.origin}/memory/${memory.share_token}`}
                    </code>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => {
                        const link = shareLink || `${window.location.origin}/memory/${memory.share_token}`;
                        navigator.clipboard.writeText(link);
                        setCopied(true);
                        toast.success('Link copied!');
                        setTimeout(() => setCopied(false), 2000);
                      }}
                    >
                      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
