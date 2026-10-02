import { atmToKpa, classifyPressure } from '../utils/boyleLaw';

const MAX_ATM = 5;

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const a = ((angleDeg - 180) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function arcPath(cx: number, cy: number, r: number, from: number, to: number) {
  const s = polar(cx, cy, r, to);
  const e = polar(cx, cy, r, from);
  const large = Math.abs(to - from) > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 0 ${e.x} ${e.y}`;
}

export default function PressureGauge({ pressure }: { pressure: number }) {
  const clamped = Math.max(0, Math.min(MAX_ATM, pressure));
  const ratio = clamped / MAX_ATM;
  const angle = ratio * 180;
  const cx = 110;
  const cy = 100;
  const r = 76;
  const needle = polar(cx, cy, r - 14, angle);
  const { label, tone } = classifyPressure(pressure);

  const toneColor =
    tone === 'low' ? 'text-sky-600' : tone === 'normal' ? 'text-emerald-600' : 'text-amber-600';

  return (
    <div className="flex flex-col items-center">
      <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        Pressure
      </p>
      <svg
        viewBox="0 0 220 128"
        className="w-full max-w-[240px]"
        role="img"
        aria-label={`Tekanan gas ${pressure.toFixed(2)} atmosfer`}
      >
        <defs>
          <linearGradient id="gaugeArc" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
        </defs>

        <path
          d={arcPath(cx, cy, r, 0, 180)}
          stroke="rgba(148,163,184,0.25)"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
        />

        <path d={arcPath(cx, cy, r, 0, 27)} stroke="#38bdf8" strokeWidth="12" fill="none" opacity="0.9" />
        <path d={arcPath(cx, cy, r, 27, 63)} stroke="#10b981" strokeWidth="12" fill="none" opacity="0.9" />
        <path d={arcPath(cx, cy, r, 63, 180)} stroke="#f59e0b" strokeWidth="12" fill="none" opacity="0.85" />

        <line
          x1={cx}
          y1={cy}
          x2={needle.x}
          y2={needle.y}
          stroke="#334155"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r="7" fill="#ffffff" stroke="#06b6d4" strokeWidth="2" />
      </svg>

      <div className="-mt-3 text-center">
        <p className="text-3xl font-bold tabular-nums text-slate-900">
          {pressure.toFixed(2)} atm
        </p>
        <p className="text-sm tabular-nums text-slate-500">
          {atmToKpa(pressure).toFixed(1)} kPa
        </p>
        <p className={`mt-1 text-xs font-semibold uppercase tracking-wider ${toneColor}`}>
          Zona: {label}
        </p>
      </div>
    </div>
  );
}