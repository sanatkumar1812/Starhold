import { useEffect, useRef } from 'react';

interface StarMapProps {
  ra: number; // Right Ascension in degrees (0-360)
  dec: number; // Declination in degrees (-90 to 90)
  size?: number;
  showCoordinates?: boolean;
  className?: string;
}

export const StarMap = ({ ra, dec, size = 300, showCoordinates = true, className = '' }: StarMapProps) => {
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
    </div>
  );
};
