import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { StarMap } from '@/components/StarMap';
import { Download, X, Lock, Calendar, Star } from 'lucide-react';
import type { Memory } from '@/hooks/useMemories';

interface StarMapModalProps {
  memory: Memory | null;
  isOpen: boolean;
  onClose: () => void;
}

export const StarMapModal = ({ memory, isOpen, onClose }: StarMapModalProps) => {
  if (!memory) return null;

  const coordinates = memory.star_coordinates as { ra: number; dec: number } | null;
  
  if (!coordinates || typeof coordinates.ra !== 'number' || typeof coordinates.dec !== 'number') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-xl border-border/50">
          <DialogHeader>
            <DialogTitle>Star Map Unavailable</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8 text-muted-foreground">
            <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No star coordinates available for this memory.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-background/95 backdrop-blur-xl border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            {memory.title || `Memory for ${memory.recipient_name}`}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-6 py-4">
          {/* Star Map */}
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

          {/* Memory Info */}
          <div className="w-full space-y-4 border-t border-border/30 pt-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Unlocks</span>
              </div>
              <span className="text-foreground">
                {formatDate(memory.unlock_date)} at {formatTime(memory.unlock_time)}
              </span>
            </div>

            {memory.constellation && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Star className="w-4 h-4" />
                  <span>Constellation</span>
                </div>
                <span className="text-foreground">{memory.constellation}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Lock className="w-4 h-4" />
                <span>Status</span>
              </div>
              <span className={memory.is_unlocked ? 'text-green-400' : 'text-muted-foreground'}>
                {memory.is_unlocked ? 'Unlocked' : 'Locked'}
              </span>
            </div>

            {/* Show message preview if unlocked */}
            {memory.is_unlocked && memory.message && (
              <div className="bg-background/50 rounded-lg p-4 border border-border/30">
                <p className="text-xs text-muted-foreground mb-2">Message</p>
                <p className="text-sm text-foreground whitespace-pre-wrap">
                  {memory.message}
                </p>
              </div>
            )}

            {!memory.is_unlocked && (
              <div className="bg-primary/5 rounded-lg p-4 border border-primary/20 text-center">
                <Lock className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  The message will be revealed on the unlock date
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
