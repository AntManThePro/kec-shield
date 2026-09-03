import { useEffect, useRef } from 'react';
import { NEXUS } from '../data/categories';

export default function ParticleField() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf = 0;
    let running = true;

    const particles = Array.from({ length: 48 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00035,
      vy: -0.00015 - Math.random() * 0.0004,
      r: 0.6 + Math.random() * 1.6,
      c: [NEXUS.green, NEXUS.cyan, NEXUS.pink, NEXUS.yellow][Math.floor(Math.random() * 4)]
    }));

    const resize = () => {
      canvas.width = canvas.offsetWidth * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
    };
    resize();
    window.addEventListener('resize', resize);

    const tick = () => {
      if (!running) return;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < 0) p.y = 1;
        if (p.x < 0) p.x = 1;
        if (p.x > 1) p.x = 0;
        ctx.beginPath();
        ctx.fillStyle = p.c;
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.c;
        ctx.arc(p.x * w, p.y * h, p.r * devicePixelRatio, 0, Math.PI * 2);
        ctx.fill();
      });
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0 w-full h-full no-print"
      style={{ opacity: 0.28 }}
      aria-hidden="true"
    />
  );
}
