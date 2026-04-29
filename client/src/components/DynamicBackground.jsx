import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

const DynamicBackground = () => {
  const canvasRef = useRef(null);
  const { darkMode } = useSelector((state) => state.theme || { darkMode: true });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', resize);

    const colors = ['#cdfb0a', '#35d908ff', '#333333'];
    const sportsEmojis = ['🏃', '⛹️', '⚽', '🤸', '🏄', '🏂', '🚴'];

    // Speed Lines
    const speedLines = Array.from({ length: 20 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      length: Math.random() * 100 + 50,
      speed: Math.random() * 5 + 3,
      thickness: Math.random() * 2 + 0.5,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));

    // Particles
    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3 + 1,
      speedY: Math.random() * -1 - 0.5,
      speedX: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.1,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));

    // Silhouettes
    const silhouettes = Array.from({ length: 3 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      emoji: sportsEmojis[Math.floor(Math.random() * sportsEmojis.length)],
      opacity: 0,
      phase: Math.random() * Math.PI * 2,
      scale: Math.random() * 0.5 + 1.5,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));

    let time = 0;

    const draw = () => {
      time += 0.01;

      // Clear canvas depending on dark mode vs light mode
      ctx.clearRect(0, 0, width, height);

      // Base dark stadium glow in center
      const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width / 1.5);
      if (darkMode) {
        gradient.addColorStop(0, 'rgba(15, 20, 35, 0.4)');
        gradient.addColorStop(1, 'rgba(5, 5, 10, 0.9)');
      } else {
        gradient.addColorStop(0, 'rgba(240, 248, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(230, 240, 250, 0.7)');
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Parallax Grid
      ctx.globalAlpha = 0.05;
      ctx.strokeStyle = darkMode ? '#cdfb0a' : '#000000';
      ctx.beginPath();
      const gridOffset = (time * 20) % 50;
      for (let i = 0; i < width; i += 50) {
        ctx.moveTo(i - gridOffset, 0);
        ctx.lineTo(i - gridOffset, height);
      }
      for (let j = 0; j < height; j += 50) {
        ctx.moveTo(0, j + gridOffset);
        ctx.lineTo(width, j + gridOffset);
      }
      ctx.stroke();

      // Wave Motion (Energy wave)
      ctx.globalAlpha = darkMode ? 0.05 : 0.1;
      ctx.beginPath();
      ctx.moveTo(0, height * 0.8);
      for (let i = 0; i < width; i += 20) {
        const y = height * 0.8 + Math.sin(i * 0.01 + time * 2) * 50;
        ctx.lineTo(i, y);
      }
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.fillStyle = colors[0];
      ctx.fill();

      // Speed lines
      ctx.globalAlpha = darkMode ? 0.3 : 0.5;
      speedLines.forEach(line => {
        ctx.beginPath();
        ctx.strokeStyle = line.color;
        ctx.lineWidth = line.thickness;
        ctx.lineCap = 'round';
        ctx.moveTo(line.x, line.y);
        ctx.lineTo(line.x + line.length, line.y);
        ctx.stroke();

        line.x += line.speed;
        if (line.x > width) {
          line.x = -line.length;
          line.y = Math.random() * height;
        }
      });

      // Particles
      particles.forEach(p => {
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        p.y += p.speedY;
        p.x += p.speedX;
        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }
      });

      // Silhouettes
      silhouettes.forEach(s => {
        // Fade in and out with sine wave
        s.opacity = (Math.sin(time * 1.5 + s.phase) + 1) / 2 * 0.15; // max 0.15 opacity (faint)
        if (s.opacity < 0.01) {
          // Relocate when invisible
          s.x = Math.random() * width;
          s.y = Math.random() * height;
          s.emoji = sportsEmojis[Math.floor(Math.random() * sportsEmojis.length)];
          s.phase = -time * 1.5; // Reset phase
        }

        if (s.opacity > 0) {
          ctx.save();
          ctx.translate(s.x, s.y);
          ctx.font = `${40 * s.scale}px Arial`;
          ctx.globalAlpha = s.opacity;

          // Draw silhouette using text and source-atop standard technique
          ctx.fillText(s.emoji, 0, 0);
          ctx.globalCompositeOperation = 'source-atop';
          ctx.fillStyle = s.color;
          ctx.shadowColor = s.color;
          ctx.shadowBlur = 10;
          ctx.fillRect(-20, -50, 80 * s.scale, 80 * s.scale);

          ctx.restore();
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [darkMode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10"
      style={{ background: 'transparent' }}
    />
  );
};

export default DynamicBackground;
