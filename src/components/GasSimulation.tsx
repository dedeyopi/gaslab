import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number; // vektor arah ternormalisasi
  vy: number;
}

interface Flash {
  x: number;
  y: number;
  life: number; // 1 → 0
}

interface Props {
  volume: number;
  particleCount: number;
  temperature: number;
  reduceMotion?: boolean;
  height?: number;
  className?: string;
}

interface Geo {
  padX: number;
  topY: number;
  bottomY: number;
  maxH: number;
  pistonTop: number;
  pistonBottom: number;
  pistonH: number;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

function geom(w: number, h: number, volume: number): Geo {
  const padX = 40;
  const topY = 30;
  const bottomY = h - 28;
  const maxH = Math.max(40, bottomY - topY);
  const v = Math.min(10, Math.max(1, volume));
  const frac = 0.15 + 0.77 * ((v - 1) / 9);
  const chamberH = maxH * frac;
  const pistonBottom = bottomY - chamberH;
  const pistonH = 14;
  return {
    padX,
    topY,
    bottomY,
    maxH,
    pistonH,
    pistonTop: pistonBottom - pistonH,
    pistonBottom,
    xMin: padX,
    xMax: w - padX,
    yMin: pistonBottom,
    yMax: bottomY,
  };
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const hh = Math.max(1, h);
  const rr = Math.max(0, Math.min(r, w / 2, hh / 2));
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + hh, rr);
  ctx.arcTo(x + w, y + hh, x, y + hh, rr);
  ctx.arcTo(x, y + hh, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function makeSprite(): HTMLCanvasElement {
  const S = 18;
  const c = document.createElement('canvas');
  c.width = S;
  c.height = S;
  const ctx = c.getContext('2d');
  if (ctx) {
    const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
    g.addColorStop(0, 'rgba(224, 252, 255, 1)');
    g.addColorStop(0.32, 'rgba(34, 211, 238, 0.95)');
    g.addColorStop(0.7, 'rgba(14, 165, 233, 0.35)');
    g.addColorStop(1, 'rgba(14, 165, 233, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, S, S);
  }
  return c;
}

export default function GasSimulation({
  volume,
  particleCount,
  temperature,
  reduceMotion = false,
  height = 340,
  className = '',
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const propsRef = useRef({ volume, particleCount, temperature, reduceMotion, height });
  propsRef.current = { volume, particleCount, temperature, reduceMotion, height };

  const particlesRef = useRef<Particle[]>([]);
  const flashesRef = useRef<Flash[]>([]);
  const sizeRef = useRef({ w: 320, h: height });
  const spriteRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!spriteRef.current) spriteRef.current = makeSprite();
    const sprite = spriteRef.current;

    let raf = 0;
    let last = performance.now();
    let disposed = false;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(260, Math.floor(rect.width));
      const h = propsRef.current.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = '100%';
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sizeRef.current = { w, h };
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const pushFlash = (x: number, y: number) => {
      const arr = flashesRef.current;
      if (arr.length > 70) return;
      arr.push({ x, y, life: 1 });
    };

    const step = (now: number) => {
      const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
      last = now;

      const { w, h } = sizeRef.current;
      const { volume: vol, particleCount: n, temperature: t, reduceMotion: rm } =
        propsRef.current;
      const g = geom(w, h, vol);
      const r = 2.6;
      const xMin = g.xMin + r;
      const xMax = Math.max(xMin + 1, g.xMax - r);
      const yMin = g.yMin + r;
      const yMax = Math.max(yMin + 1, g.yMax - r);

      const speed =
        (rm ? 45 : 115) * Math.sqrt(Math.max(0.25, t / 300)) * (h / 340);

      const arr = particlesRef.current;
      const target = Math.round(n);

      while (arr.length < target) {
        const a = Math.random() * Math.PI * 2;
        arr.push({
          x: xMin + Math.random() * (xMax - xMin),
          y: yMin + Math.random() * (yMax - yMin),
          vx: Math.cos(a),
          vy: Math.sin(a),
        });
      }
      if (arr.length > target) arr.length = target;

      for (const p of arr) {
        p.x += p.vx * speed * dt;
        p.y += p.vy * speed * dt;

        if (p.x < xMin) {
          p.x = xMin;
          p.vx = Math.abs(p.vx);
          pushFlash(p.x, p.y);
        } else if (p.x > xMax) {
          p.x = xMax;
          p.vx = -Math.abs(p.vx);
          pushFlash(p.x, p.y);
        }

        if (p.y < yMin) {
          p.y = yMin;
          p.vy = Math.abs(p.vy);
          pushFlash(p.x, p.y);
        } else if (p.y > yMax) {
          p.y = yMax;
          p.vy = -Math.abs(p.vy);
          pushFlash(p.x, p.y);
        }
      }

      const fl = flashesRef.current;
      for (let i = fl.length - 1; i >= 0; i--) {
        fl[i].life -= dt * 3.2;
        if (fl[i].life <= 0) fl.splice(i, 1);
      }
    };

    const draw = () => {
      const { w, h } = sizeRef.current;
      const { volume: vol } = propsRef.current;
      const g = geom(w, h, vol);

      ctx.clearRect(0, 0, w, h);

      // Latar
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, '#0a1220');
      bg.addColorStop(1, '#020617');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Grid halus
      ctx.strokeStyle = 'rgba(148,163,184,0.06)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 32) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Dinding silinder
      const wallL = g.padX - 16;
      const wallR = w - g.padX + 16;
      roundRect(ctx, wallL, g.topY - 12, wallR - wallL, g.bottomY - g.topY + 24, 20);
      const wallGrad = ctx.createLinearGradient(wallL, 0, wallR, 0);
      wallGrad.addColorStop(0, 'rgba(148,163,184,0.10)');
      wallGrad.addColorStop(0.5, 'rgba(148,163,184,0.03)');
      wallGrad.addColorStop(1, 'rgba(148,163,184,0.10)');
      ctx.fillStyle = wallGrad;
      ctx.fill();
      ctx.strokeStyle = 'rgba(148,163,184,0.40)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Zona gas
      const gasTop = g.pistonBottom;
      const gasH = Math.max(0, g.bottomY - gasTop);
      if (gasH > 0) {
        const gasGrad = ctx.createLinearGradient(0, gasTop, 0, g.bottomY);
        gasGrad.addColorStop(0, 'rgba(34,211,238,0.10)');
        gasGrad.addColorStop(1, 'rgba(16,185,129,0.14)');
        ctx.fillStyle = gasGrad;
        ctx.fillRect(g.xMin, gasTop, g.xMax - g.xMin, gasH);
      }

      // Partikel
      const arr = particlesRef.current;
      for (const p of arr) {
        ctx.drawImage(sprite, p.x - 7, p.y - 7, 14, 14);
      }

      // Kilatan tumbukan
      const fl = flashesRef.current;
      for (const f of fl) {
        const a = Math.max(0, f.life);
        ctx.beginPath();
        ctx.arc(f.x, f.y, (1 - a) * 9 + 2, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(103,232,249,${a * 0.55})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Piston
      roundRect(ctx, g.padX - 12, g.pistonTop, w - 2 * (g.padX - 12), g.pistonH, 6);
      const pGrad = ctx.createLinearGradient(0, g.pistonTop, 0, g.pistonBottom);
      pGrad.addColorStop(0, '#64748b');
      pGrad.addColorStop(1, '#334155');
      ctx.fillStyle = pGrad;
      ctx.fill();
      ctx.strokeStyle = 'rgba(103,232,249,0.65)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Batang piston
      const rodTop = g.topY - 12;
      const rodH = Math.max(0, g.pistonTop - rodTop);
      if (rodH > 0) {
        ctx.fillStyle = '#475569';
        ctx.fillRect(w / 2 - 5, rodTop, 10, rodH);
      }

      // Label
      ctx.font = '600 11px ui-sans-serif, system-ui, sans-serif';
      ctx.fillStyle = 'rgba(148,163,184,0.85)';
      ctx.textAlign = 'left';
      ctx.fillText('PISTON', 8, g.pistonTop - 4);
      ctx.textAlign = 'right';
      ctx.fillText(`V = ${vol.toFixed(1)} L`, w - 8, g.bottomY + 18);
    };

    const loop = (now: number) => {
      if (disposed) return;
      raf = requestAnimationFrame(loop);
      if (document.hidden) {
        last = now;
        return;
      }
      step(now);
      draw();
    };
    raf = requestAnimationFrame(loop);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={wrapRef} className={`w-full ${className}`}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Simulasi silinder gas dengan piston dan partikel yang bergerak"
        className="block w-full rounded-lg"
      />
    </div>
  );
}