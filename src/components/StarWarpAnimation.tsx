import { useEffect, useRef, useState } from 'react';

interface StarWarpAnimationProps {
  isActive: boolean;
  onComplete: () => void;
  duration?: number;
}

export const StarWarpAnimation = ({ isActive, onComplete, duration = 2000 }: StarWarpAnimationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<'warp' | 'flash' | 'done'>('warp');

  useEffect(() => {
    if (!isActive) {
      setPhase('warp');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    };
    resize();

    const centerX = canvas.offsetWidth / 2;
    const centerY = canvas.offsetHeight / 2;

    // Star properties
    interface WarpStar {
      x: number;
      y: number;
      z: number;
      prevZ: number;
      color: string;
    }

    const stars: WarpStar[] = [];
    const numStars = 300;
    const colors = [
      'rgba(255, 215, 150, ',  // Gold
      'rgba(200, 180, 255, ',  // Purple tint
      'rgba(255, 255, 255, ',  // White
      'rgba(180, 220, 255, ',  // Blue tint
    ];

    // Initialize stars
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: (Math.random() - 0.5) * canvas.offsetWidth * 2,
        y: (Math.random() - 0.5) * canvas.offsetHeight * 2,
        z: Math.random() * 1500 + 500,
        prevZ: 0,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let animationId: number;
    let speed = 5;
    const maxSpeed = 80;
    const acceleration = 2;
    let elapsed = 0;
    const startTime = Date.now();

    const animate = () => {
      elapsed = Date.now() - startTime;
      
      // Accelerate
      if (speed < maxSpeed) {
        speed += acceleration;
      }

      // Clear with fade trail
      ctx.fillStyle = 'rgba(10, 10, 20, 0.15)';
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      // Draw stars
      stars.forEach((star) => {
        star.prevZ = star.z;
        star.z -= speed;

        if (star.z <= 0) {
          star.x = (Math.random() - 0.5) * canvas.offsetWidth * 2;
          star.y = (Math.random() - 0.5) * canvas.offsetHeight * 2;
          star.z = 1500;
          star.prevZ = star.z;
        }

        // Project to 2D
        const sx = (star.x / star.z) * 400 + centerX;
        const sy = (star.y / star.z) * 400 + centerY;
        const psx = (star.x / star.prevZ) * 400 + centerX;
        const psy = (star.y / star.prevZ) * 400 + centerY;

        // Calculate size and opacity based on z
        const size = Math.max(0.5, (1 - star.z / 2000) * 3);
        const opacity = Math.min(1, (1 - star.z / 2000) * 1.5);

        // Draw streak
        ctx.beginPath();
        ctx.moveTo(psx, psy);
        ctx.lineTo(sx, sy);
        ctx.strokeStyle = star.color + opacity + ')';
        ctx.lineWidth = size;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Draw star point
        ctx.beginPath();
        ctx.arc(sx, sy, size * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = star.color + opacity + ')';
        ctx.fill();
      });

      // Add central glow that intensifies
      const glowIntensity = Math.min(0.4, elapsed / duration);
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 200);
      gradient.addColorStop(0, `rgba(212, 175, 55, ${glowIntensity})`);
      gradient.addColorStop(0.5, `rgba(212, 175, 55, ${glowIntensity * 0.3})`);
      gradient.addColorStop(1, 'rgba(212, 175, 55, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      if (elapsed < duration * 0.8) {
        animationId = requestAnimationFrame(animate);
      } else {
        // Transition to flash
        setPhase('flash');
        setTimeout(() => {
          setPhase('done');
          onComplete();
        }, 400);
      }
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isActive, duration, onComplete]);

  if (!isActive && phase === 'done') return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] transition-opacity duration-500 ${
        phase === 'done' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Dark background */}
      <div className="absolute inset-0 bg-[#0a0a14]" />
      
      {/* Canvas for star warp */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      
      {/* Flash overlay */}
      <div 
        className={`absolute inset-0 bg-primary/80 transition-opacity duration-300 ${
          phase === 'flash' ? 'opacity-100' : 'opacity-0'
        }`}
      />
      
      {/* Center destination indicator */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div 
          className={`transition-all duration-500 ${
            phase === 'warp' ? 'scale-50 opacity-50' : 'scale-100 opacity-0'
          }`}
        >
          <div className="w-4 h-4 rounded-full bg-primary animate-pulse" />
          <div className="absolute inset-0 w-4 h-4 rounded-full bg-primary/50 animate-ping" />
        </div>
      </div>
      
      {/* Text indicator */}
      <div className="absolute bottom-12 left-0 right-0 text-center">
        <p className={`text-sm text-primary/60 font-serif tracking-widest uppercase transition-opacity duration-300 ${
          phase === 'warp' ? 'opacity-100' : 'opacity-0'
        }`}>
          Traveling to your memory...
        </p>
      </div>
    </div>
  );
};