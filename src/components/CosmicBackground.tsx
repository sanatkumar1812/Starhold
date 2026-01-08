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
    const starColors = [
      'rgba(255, 255, 255,',
      'rgba(255, 248, 220,', // warm white
      'rgba(200, 220, 255,', // cool blue
      'rgba(255, 220, 180,', // golden
    ];

    const stars: Star[] = [];
    const numStars = 400; // Increased for depth

    for (let i = 0; i < numStars; i++) {
      const isBright = Math.random() > 0.95;
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        // Using size to determine depth layer (smaller = farther)
        size: isBright ? Math.random() * 2 + 1.5 : Math.random() * 1.5 + 0.3,
        opacity: isBright ? Math.random() * 0.5 + 0.5 : Math.random() * 0.4 + 0.1,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        color: starColors[Math.floor(Math.random() * starColors.length)],
      });
    }

    let mouseX = 0;
    let mouseY = 0;
    let scrollY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 50;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 50;
    };

    const handleScroll = () => {
      scrollY = window.scrollY * 0.1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    // Create nebula clouds
    interface Nebula {
      x: number;
      y: number;
      radius: number;
      color: string;
      opacity: number;
    }

    const nebulae: Nebula[] = [
      { x: canvas.width * 0.2, y: canvas.height * 0.3, radius: 400, color: '148, 103, 189', opacity: 0.02 },
      { x: canvas.width * 0.8, y: canvas.height * 0.7, radius: 500, color: '52, 108, 176', opacity: 0.015 },
      { x: canvas.width * 0.5, y: canvas.height * 0.5, radius: 600, color: '176, 92, 140', opacity: 0.01 },
    ];

    let animationFrame: number;

    const drawNebulae = () => {
      nebulae.forEach((nebula) => {
        const parallaxX = nebula.x + mouseX * 0.2;
        const parallaxY = nebula.y + mouseY * 0.2 - scrollY * 0.5;

        const gradient = ctx.createRadialGradient(
          parallaxX, parallaxY, 0,
          parallaxX, parallaxY, nebula.radius
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
        // Multi-layered parallax
        // Layers based on star size (depth)
        const layerMultiplier = star.size < 0.8 ? 0.1 : star.size < 1.5 ? 0.3 : 1;
        const px = star.x + mouseX * layerMultiplier;
        let py = star.y + mouseY * layerMultiplier - scrollY * layerMultiplier * 2;

        // Wrap around vertically
        if (py < 0) py = canvas.height + (py % canvas.height);
        if (py > canvas.height) py = py % canvas.height;

        const twinkle = Math.sin(time * star.twinkleSpeed) * 0.3 + 0.7;
        const currentOpacity = star.opacity * twinkle;

        // Draw star glow for brighter stars
        if (star.size > 1.5) {
          const glowGradient = ctx.createRadialGradient(
            px, py, 0,
            px, py, star.size * 4
          );
          glowGradient.addColorStop(0, `${star.color}${currentOpacity * 0.3})`);
          glowGradient.addColorStop(1, `${star.color}0)`);
          ctx.fillStyle = glowGradient;
          ctx.beginPath();
          ctx.arc(px, py, star.size * 4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw star core
        ctx.beginPath();
        ctx.arc(px, py, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `${star.color}${currentOpacity})`;
        ctx.fill();
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
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
