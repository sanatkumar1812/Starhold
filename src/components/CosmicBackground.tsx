import { useEffect, useRef } from 'react';

export const CosmicBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create stars with different sizes and brightness
    interface Star {
      x: number;
      y: number;
      size: number;
      opacity: number;
      twinkleSpeed: number;
      color: string;
    }

    const stars: Star[] = [];
    const numStars = 300;

    const starColors = [
      'rgba(255, 255, 255,',
      'rgba(255, 248, 220,', // warm white
      'rgba(200, 220, 255,', // cool blue
      'rgba(255, 220, 180,', // golden
    ];

    for (let i = 0; i < numStars; i++) {
      const isBright = Math.random() > 0.9;
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: isBright ? Math.random() * 2 + 1.5 : Math.random() * 1.5 + 0.3,
        opacity: isBright ? Math.random() * 0.5 + 0.5 : Math.random() * 0.4 + 0.1,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        color: starColors[Math.floor(Math.random() * starColors.length)],
      });
    }

    // Create nebula clouds
    interface Nebula {
      x: number;
      y: number;
      radius: number;
      color: string;
      opacity: number;
    }

    const nebulae: Nebula[] = [
      { x: canvas.width * 0.2, y: canvas.height * 0.3, radius: 300, color: '148, 103, 189', opacity: 0.03 },
      { x: canvas.width * 0.8, y: canvas.height * 0.7, radius: 400, color: '52, 108, 176', opacity: 0.025 },
      { x: canvas.width * 0.5, y: canvas.height * 0.5, radius: 500, color: '176, 92, 140', opacity: 0.02 },
    ];

    let animationFrame: number;

    const drawNebulae = () => {
      nebulae.forEach((nebula) => {
        const gradient = ctx.createRadialGradient(
          nebula.x, nebula.y, 0,
          nebula.x, nebula.y, nebula.radius
        );
        gradient.addColorStop(0, `rgba(${nebula.color}, ${nebula.opacity})`);
        gradient.addColorStop(0.5, `rgba(${nebula.color}, ${nebula.opacity * 0.5})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw nebulae first (background)
      drawNebulae();

      // Draw and animate stars
      const time = Date.now();
      stars.forEach((star) => {
        const twinkle = Math.sin(time * star.twinkleSpeed) * 0.3 + 0.7;
        const currentOpacity = star.opacity * twinkle;

        // Draw star glow for brighter stars
        if (star.size > 1.5) {
          const glowGradient = ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, star.size * 4
          );
          glowGradient.addColorStop(0, `${star.color}${currentOpacity * 0.3})`);
          glowGradient.addColorStop(1, `${star.color}0)`);
          ctx.fillStyle = glowGradient;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw star core
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `${star.color}${currentOpacity})`;
        ctx.fill();
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'linear-gradient(180deg, hsl(230 40% 3%) 0%, hsl(230 35% 5%) 50%, hsl(230 30% 4%) 100%)' }}
    />
  );
};
