import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface StarMapProps {
  ra: number; // Right Ascension in degrees (0-360)
  dec: number; // Declination in degrees (-90 to 90)
  size?: number;
  showCoordinates?: boolean;
  showDownload?: boolean;
  recipientName?: string;
  unlockDate?: Date;
  constellation?: string;
  className?: string;
}

export const StarMap = ({ 
  ra, 
  dec, 
  size = 300, 
  showCoordinates = true, 
  showDownload = false, 
  recipientName,
  unlockDate,
  constellation,
  className = '' 
}: StarMapProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 20;

    // Background
    const bgGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    bgGradient.addColorStop(0, 'rgba(30, 35, 50, 0.9)');
    bgGradient.addColorStop(1, 'rgba(15, 18, 28, 0.95)');
    ctx.fillStyle = bgGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();

    // Generate deterministic stars based on coordinates
    const seed = ra * 1000 + dec * 100;
    const seededRandom = (n: number) => {
      const x = Math.sin(seed + n) * 10000;
      return x - Math.floor(x);
    };

    // Draw background stars
    for (let i = 0; i < 150; i++) {
      const angle = seededRandom(i) * Math.PI * 2;
      const dist = seededRandom(i + 100) * radius * 0.95;
      const x = centerX + Math.cos(angle) * dist;
      const y = centerY + Math.sin(angle) * dist;
      const starSize = seededRandom(i + 200) * 1.5 + 0.5;
      const opacity = seededRandom(i + 300) * 0.6 + 0.2;

      ctx.beginPath();
      ctx.arc(x, y, starSize, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.fill();
    }

    // Draw constellation lines (decorative)
    ctx.strokeStyle = 'rgba(100, 140, 200, 0.15)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    
    const constellationPoints = [];
    for (let i = 0; i < 6; i++) {
      constellationPoints.push({
        x: centerX + (seededRandom(i + 500) - 0.5) * radius * 1.5,
        y: centerY + (seededRandom(i + 600) - 0.5) * radius * 1.5,
      });
    }
    
    ctx.beginPath();
    ctx.moveTo(constellationPoints[0].x, constellationPoints[0].y);
    for (let i = 1; i < constellationPoints.length; i++) {
      ctx.lineTo(constellationPoints[i].x, constellationPoints[i].y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw coordinate grid
    ctx.strokeStyle = 'rgba(180, 150, 100, 0.1)';
    ctx.lineWidth = 0.5;

    // RA lines (vertical on projection)
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius);
      ctx.stroke();
    }

    // Dec circles
    for (let i = 1; i <= 3; i++) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, (radius / 3) * i, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Highlight the target coordinate
    const targetAngle = (ra / 360) * Math.PI * 2 - Math.PI / 2;
    const targetDist = ((90 - Math.abs(dec)) / 90) * radius * 0.8;
    const targetX = centerX + Math.cos(targetAngle) * targetDist;
    const targetY = centerY + Math.sin(targetAngle) * targetDist;

    // Target glow
    const targetGlow = ctx.createRadialGradient(targetX, targetY, 0, targetX, targetY, 30);
    targetGlow.addColorStop(0, 'rgba(212, 175, 55, 0.4)');
    targetGlow.addColorStop(0.5, 'rgba(212, 175, 55, 0.15)');
    targetGlow.addColorStop(1, 'rgba(212, 175, 55, 0)');
    ctx.fillStyle = targetGlow;
    ctx.beginPath();
    ctx.arc(targetX, targetY, 30, 0, Math.PI * 2);
    ctx.fill();

    // Target crosshair
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.8)';
    ctx.lineWidth = 1;
    
    // Outer ring
    ctx.beginPath();
    ctx.arc(targetX, targetY, 12, 0, Math.PI * 2);
    ctx.stroke();

    // Inner dot
    ctx.fillStyle = 'rgba(212, 175, 55, 1)';
    ctx.beginPath();
    ctx.arc(targetX, targetY, 3, 0, Math.PI * 2);
    ctx.fill();

    // Crosshair lines
    ctx.beginPath();
    ctx.moveTo(targetX - 18, targetY);
    ctx.lineTo(targetX - 8, targetY);
    ctx.moveTo(targetX + 8, targetY);
    ctx.lineTo(targetX + 18, targetY);
    ctx.moveTo(targetX, targetY - 18);
    ctx.lineTo(targetX, targetY - 8);
    ctx.moveTo(targetX, targetY + 8);
    ctx.lineTo(targetX, targetY + 18);
    ctx.stroke();

    // Border
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();

  }, [ra, dec, size]);

  const formatRA = (ra: number) => {
    const hours = Math.floor(ra / 15);
    const minutes = Math.floor((ra / 15 - hours) * 60);
    const seconds = ((ra / 15 - hours) * 60 - minutes) * 60;
    return `${hours}h ${minutes}m ${seconds.toFixed(1)}s`;
  };

  const formatDec = (dec: number) => {
    const sign = dec >= 0 ? '+' : '-';
    const absDec = Math.abs(dec);
    const degrees = Math.floor(absDec);
    const minutes = Math.floor((absDec - degrees) * 60);
    const seconds = ((absDec - degrees) * 60 - minutes) * 60;
    return `${sign}${degrees}° ${minutes}' ${seconds.toFixed(1)}"`;
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create a new canvas for the download with extra space for text
    const downloadCanvas = document.createElement('canvas');
    const padding = 100;
    const textHeight = 240;
    const totalWidth = Math.max(size + padding * 2, 500); // Minimum width to fit coordinates
    const totalHeight = size + padding * 2 + textHeight;
    
    const dpr = 2; // Fixed high resolution for download
    downloadCanvas.width = totalWidth * dpr;
    downloadCanvas.height = totalHeight * dpr;
    
    const ctx = downloadCanvas.getContext('2d');
    if (!ctx) return;
    
    ctx.scale(dpr, dpr);
    
    // Background with subtle gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 0, totalHeight);
    bgGradient.addColorStop(0, '#0d0f18');
    bgGradient.addColorStop(1, '#070810');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, totalWidth, totalHeight);
    
    // Draw decorative double border
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.15)';
    ctx.lineWidth = 1;
    ctx.strokeRect(12, 12, totalWidth - 24, totalHeight - 24);
    
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, totalWidth - 40, totalHeight - 40);
    
    // Corner accents
    const cornerSize = 20;
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)';
    ctx.lineWidth = 2;
    
    // Top-left corner
    ctx.beginPath();
    ctx.moveTo(20, 20 + cornerSize);
    ctx.lineTo(20, 20);
    ctx.lineTo(20 + cornerSize, 20);
    ctx.stroke();
    
    // Top-right corner
    ctx.beginPath();
    ctx.moveTo(totalWidth - 20 - cornerSize, 20);
    ctx.lineTo(totalWidth - 20, 20);
    ctx.lineTo(totalWidth - 20, 20 + cornerSize);
    ctx.stroke();
    
    // Bottom-left corner
    ctx.beginPath();
    ctx.moveTo(20, totalHeight - 20 - cornerSize);
    ctx.lineTo(20, totalHeight - 20);
    ctx.lineTo(20 + cornerSize, totalHeight - 20);
    ctx.stroke();
    
    // Bottom-right corner
    ctx.beginPath();
    ctx.moveTo(totalWidth - 20 - cornerSize, totalHeight - 20);
    ctx.lineTo(totalWidth - 20, totalHeight - 20);
    ctx.lineTo(totalWidth - 20, totalHeight - 20 - cornerSize);
    ctx.stroke();
    
    // Draw the star map from original canvas centered
    const mapX = (totalWidth - size) / 2;
    ctx.drawImage(canvas, mapX, padding, size, size);
    
    // Text styling
    const textStartY = size + padding + 40;
    const centerX = totalWidth / 2;
    
    // Brand name - Starhold with elegant font
    ctx.font = '600 32px Cinzel, Georgia, serif';
    ctx.fillStyle = 'rgba(212, 175, 55, 1)';
    ctx.textAlign = 'center';
    ctx.fillText('S T A R H O L D', centerX, textStartY);
    
    // Tagline
    ctx.font = 'italic 11px Georgia, serif';
    ctx.fillStyle = 'rgba(212, 175, 55, 0.6)';
    ctx.fillText('memories among the stars', centerX, textStartY + 22);
    
    // Decorative divider with diamond
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(centerX - 100, textStartY + 42);
    ctx.lineTo(centerX - 8, textStartY + 42);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(centerX + 8, textStartY + 42);
    ctx.lineTo(centerX + 100, textStartY + 42);
    ctx.stroke();
    
    // Diamond in center
    ctx.fillStyle = 'rgba(212, 175, 55, 0.5)';
    ctx.beginPath();
    ctx.moveTo(centerX, textStartY + 38);
    ctx.lineTo(centerX + 5, textStartY + 42);
    ctx.lineTo(centerX, textStartY + 46);
    ctx.lineTo(centerX - 5, textStartY + 42);
    ctx.closePath();
    ctx.fill();
    
    let currentY = textStartY + 70;
    
    // Constellation name
    if (constellation) {
      ctx.font = 'italic 18px Georgia, serif';
      ctx.fillStyle = 'rgba(212, 175, 55, 0.95)';
      ctx.fillText(constellation, centerX, currentY);
      currentY += 28;
    }
    
    // Celestial coordinates - split into two lines for better fit
    ctx.font = '12px monospace';
    ctx.fillStyle = 'rgba(212, 175, 55, 0.7)';
    ctx.fillText(`α  ${formatRA(ra)}   ·   δ  ${formatDec(dec)}`, centerX, currentY);
    currentY += 35;
    
    // Recipient section
    if (recipientName) {
      ctx.font = '10px Georgia, serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fillText('— FOR —', centerX, currentY);
      currentY += 22;
      
      ctx.font = '500 22px Cinzel, Georgia, serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.fillText(recipientName, centerX, currentY);
      currentY += 30;
    }
    
    // Unlock date
    if (unlockDate) {
      ctx.font = '10px Georgia, serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fillText('— UNLOCKS —', centerX, currentY);
      currentY += 20;
      
      ctx.font = '15px Georgia, serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      const formattedDate = unlockDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      ctx.fillText(formattedDate, centerX, currentY);
    }

    const link = document.createElement('a');
    link.download = `starhold-${formatRA(ra).replace(/\s/g, '')}-${formatDec(dec).replace(/\s/g, '')}.png`;
    link.href = downloadCanvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size }}
        className="rounded-full"
      />
      {showCoordinates && (
        <div className="mt-4 text-center space-y-1">
          <p className="text-sm text-muted-foreground">Celestial Coordinates</p>
          <p className="font-mono text-primary">
            α {formatRA(ra)} · δ {formatDec(dec)}
          </p>
        </div>
      )}
      {showDownload && (
        <Button variant="outline" size="sm" onClick={handleDownload} className="mt-4 gap-2">
          <Download className="w-4 h-4" />
          Download Star Map
        </Button>
      )}
    </div>
  );
};
