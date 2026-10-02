import { useEffect, useRef } from 'react';

interface Props {
  rate: number;
  history: number[];
}

export default function CollisionMonitor({ rate, history }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dataRef = useRef<number[]>([]);
  dataRef.current = history.slice(-48);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth || 240;
    const h = 46;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#f0f9ff';
    ctx.fillRect(0, 0, w, h);

    const data = dataRef.current;
    if (data.length < 2) return;

    const max = Math.max(10, ...data) * 1.15;
    const stepX = w / (data.length - 1);

    ctx.beginPath();
    data.forEach((v, i) => {
      const x = i * stepX;
      const y = h - (v / max) * (h - 8) - 4;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#0ea5e9';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, 'rgba(14,165,233,0.35)');
    grad.addColorStop(1, 'rgba(14,165,233,0)');
    ctx.fillStyle = grad;
    ctx.fill();
  }, [history]);

  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        Collision Monitor
      </p>
      <p className="text-2xl font-bold tabular-nums text-cyan-600">
        {rate} <span className="text-sm font-medium text-slate-500">tumbukan/detik</span>
      </p>
      <canvas
        ref={canvasRef}
        className="mt-2 block h-[46px] w-full rounded-md border border-slate-200"
      />
    </div>
  );
}