import { useMemo, useState } from 'react';
import type { ExperimentRow } from '../types';

interface Props {
  rows: ExperimentRow[];
  constant: number;
  liveVolume: number;
  livePressure: number;
}

const W = 560;
const H = 340;
const PAD_L = 58;
const PAD_R = 22;
const PAD_T = 18;
const PAD_B = 46;

type Mode = 'pv' | 'pinv';

export default function BoyleGraph({ rows, constant, liveVolume, livePressure }: Props) {
  const [mode, setMode] = useState<Mode>('pv');
  const [hover, setHover] = useState<ExperimentRow | null>(null);

  const plotW = W - PAD_L - PAD_R;
  const plotH = H - PAD_T - PAD_B;

  const maxPressure = useMemo(() => {
    const values = [
      ...rows.map((r) => r.pressure),
      livePressure,
      constant / 1.2,
    ].filter((v) => Number.isFinite(v));
    return Math.max(2, Math.ceil(Math.max(...values, 1) * 1.1 * 2) / 2);
  }, [rows, livePressure, constant]);

  const xMax = mode === 'pv' ? 10 : 2;
  const xOf = (v: number) => (mode === 'pv' ? v : 1 / Math.max(0.05, v));
  const sx = (x: number) => PAD_L + (x / xMax) * plotW;
  const sy = (p: number) => PAD_T + plotH - (Math.min(p, maxPressure) / maxPressure) * plotH;

  const curve = useMemo(() => {
    const pts: string[] = [];
    const startX = constant / maxPressure;
    const from = Math.max(0.02, startX);
    const steps = 120;
    for (let i = 0; i <= steps; i++) {
      const x = from + ((xMax - from) * i) / steps;
      const v = mode === 'pv' ? x : 1 / Math.max(0.02, x);
      const p = constant / v;
      if (p > maxPressure + 0.001) continue;
      pts.push(`${sx(x).toFixed(1)},${sy(p).toFixed(1)}`);
    }
    return pts.join(' ');
  }, [constant, maxPressure, mode, xMax]);

  const xTicks = mode === 'pv' ? [0, 2, 4, 6, 8, 10] : [0, 0.5, 1, 1.5, 2];
  const yTicks = Array.from({ length: 5 }, (_, i) => (maxPressure * i) / 4);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-semibold text-slate-900">Graph Explorer</h3>
        <div className="flex gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
          <button
            type="button"
            onClick={() => setMode('pv')}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              mode === 'pv'
                ? 'bg-cyan-500 text-white shadow-sm'
                : 'text-slate-600 hover:bg-white'
            }`}
          >
            P vs V
          </button>
          <button
            type="button"
            onClick={() => setMode('pinv')}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              mode === 'pinv'
                ? 'bg-cyan-500 text-white shadow-sm'
                : 'text-slate-600 hover:bg-white'
            }`}
          >
            P vs 1/V
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          role="img"
          aria-label="Grafik hubungan tekanan dan volume gas"
        >
          {yTicks.map((t, i) => (
            <line
              key={`yg-${i}`}
              x1={PAD_L}
              x2={W - PAD_R}
              y1={sy(t)}
              y2={sy(t)}
              stroke="rgba(148,163,184,0.22)"
              strokeWidth="1"
            />
          ))}
          {xTicks.map((t, i) => (
            <line
              key={`xg-${i}`}
              x1={sx(t)}
              x2={sx(t)}
              y1={PAD_T}
              y2={PAD_T + plotH}
              stroke="rgba(148,163,184,0.22)"
              strokeWidth="1"
            />
          ))}

          <line
            x1={PAD_L}
            x2={W - PAD_R}
            y1={PAD_T + plotH}
            y2={PAD_T + plotH}
            stroke="#94a3b8"
            strokeWidth="1.6"
          />
          <line
            x1={PAD_L}
            x2={PAD_L}
            y1={PAD_T}
            y2={PAD_T + plotH}
            stroke="#94a3b8"
            strokeWidth="1.6"
          />

          {yTicks.map((t, i) => (
            <text
              key={`yl-${i}`}
              x={PAD_L - 8}
              y={sy(t) + 4}
              textAnchor="end"
              fontSize="10"
              fill="#64748b"
            >
              {t.toFixed(1)}
            </text>
          ))}
          {xTicks.map((t, i) => (
            <text
              key={`xl-${i}`}
              x={sx(t)}
              y={PAD_T + plotH + 16}
              textAnchor="middle"
              fontSize="10"
              fill="#64748b"
            >
              {t}
            </text>
          ))}

          <text x={W / 2} y={H - 8} textAnchor="middle" fontSize="11" fill="#475569">
            {mode === 'pv' ? 'Volume (L)' : '1 / Volume (1/L)'}
          </text>
          <text
            x={14}
            y={PAD_T + plotH / 2}
            textAnchor="middle"
            fontSize="11"
            fill="#475569"
            transform={`rotate(-90 14 ${PAD_T + plotH / 2})`}
          >
            Tekanan (atm)
          </text>

          <polyline
            points={curve}
            fill="none"
            stroke="#06b6d4"
            strokeWidth="2.4"
            strokeLinecap="round"
          />

          <circle
            cx={sx(xOf(liveVolume))}
            cy={sy(livePressure)}
            r="5"
            fill="#f59e0b"
            stroke="#ffffff"
            strokeWidth="1.8"
          />

          {rows.map((r) => (
            <circle
              key={r.id}
              cx={sx(xOf(r.volume))}
              cy={sy(r.pressure)}
              r={hover?.id === r.id ? 7 : 5}
              fill="#10b981"
              stroke="#ffffff"
              strokeWidth="1.8"
              className="cursor-pointer transition-all"
              onMouseEnter={() => setHover(r)}
              onMouseLeave={() => setHover(null)}
            />
          ))}

          {hover && (
            <g
              transform={`translate(${Math.min(sx(xOf(hover.volume)) + 12, W - 168)}, ${Math.max(sy(hover.pressure) - 60, 8)})`}
            >
              <rect
                width="156"
                height="58"
                rx="8"
                fill="#ffffff"
                stroke="rgba(6,182,212,0.5)"
                strokeWidth="1.5"
              />
              <text x="10" y="19" fontSize="11" fill="#0f172a">
                Volume: {hover.volume.toFixed(2)} L
              </text>
              <text x="10" y="35" fontSize="11" fill="#0f172a">
                Tekanan: {hover.pressure.toFixed(2)} atm
              </text>
              <text x="10" y="51" fontSize="11" fill="#0891b2" fontWeight="600">
                P × V: {hover.pv.toFixed(2)} atm·L
              </text>
            </g>
          )}
        </svg>
      </div>

      <p className="mt-2 text-xs text-slate-500">
        Kurva biru = kurva isotermal model (k = {constant.toFixed(2)} atm·L). Titik{' '}
        <span className="text-emerald-600 font-medium">hijau</span> = data eksperimenmu. Titik{' '}
        <span className="text-amber-600 font-medium">kuning</span> = kondisi simulasi saat ini.
      </p>
    </div>
  );
}