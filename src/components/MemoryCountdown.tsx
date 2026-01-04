import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface MemoryCountdownProps {
  unlockDate: string;
  unlockTime: string;
  isUnlocked: boolean;
}

export const MemoryCountdown = ({ unlockDate, unlockTime, isUnlocked }: MemoryCountdownProps) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    if (isUnlocked) return;

    const calculateTimeLeft = () => {
      const unlockDateTime = new Date(`${unlockDate}T${unlockTime}`);
      const now = new Date();
      const diff = unlockDateTime.getTime() - now.getTime();

      if (diff <= 0) {
        return null;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      return { days, hours, minutes, seconds };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      if (!newTimeLeft) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [unlockDate, unlockTime, isUnlocked]);

  if (isUnlocked || !timeLeft) return null;

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <Clock className="w-3 h-3" />
      <div className="flex gap-1">
        {timeLeft.days > 0 && (
          <span className="font-mono">{timeLeft.days}d</span>
        )}
        <span className="font-mono">{String(timeLeft.hours).padStart(2, '0')}h</span>
        <span className="font-mono">{String(timeLeft.minutes).padStart(2, '0')}m</span>
        <span className="font-mono">{String(timeLeft.seconds).padStart(2, '0')}s</span>
      </div>
    </div>
  );
};
