import { useState } from 'react';

interface Node {
  id: string;
  label: string;
  detail: string;
  x: number;
  y: number;
}

const NODES: Node[] = [
  {
    id: 'root',
    label: 'TEKANAN GAS',
    detail:
      'Tekanan gas adalah hasil tumbukan partikel gas terhadap dinding wadah. Semakin sering dan semakin kuat tumbukannya, semakin besar tekanannya.',
    x: 50,
    y: 8,
  },
  {
    id: 'partikel',
    label: 'Partikel',
    detail:
      'Gas tersusun atas partikel yang sangat banyak dan berukuran sangat kecil. Partikel-partikel ini tidak diam.',
    x: 14,
    y: 36,
  },
  {
    id: 'volume',
    label: 'Volume',
    detail:
      'Volume adalah besar ruang yang ditempati gas. Jika volume diperkecil, partikel lebih sering menumbuk dinding.',
    x: 50,
    y: 36,
  },
  {
    id: 'suhu',
    label: 'Suhu',
    detail:
      'Suhu berkaitan dengan energi kinetik rata-rata partikel. Suhu naik → partikel bergerak lebih cepat → tumbukan lebih kuat.',
    x: 86,
    y: 36,
  },
  {
    id: 'tumbukan',
    label: 'Tumbukan',
    detail:
      'Setiap kali partikel mengenai dinding, terjadi gaya kecil. Jutaan tumbukan setiap detik menghasilkan tekanan yang terukur.',
    x: 14,
    y: 64,
  },
  {
    id: 'boyle',
    label: 'Hukum Boyle',
    detail:
      'Pada suhu tetap dan jumlah gas tetap, hasil kali tekanan dan volume selalu konstan: P × V = k.',
    x: 50,
    y: 64,
  },
  {
    id: 'formula',
    label: 'P × V = k',
    detail:
      'Bentuk lain Hukum Boyle: P₁V₁ = P₂V₂. Jika volume diperkecil, tekanan menjadi lebih besar, dan sebaliknya.',
    x: 50,
    y: 90,
  },
];

const EDGES: [string, string][] = [
  ['root', 'partikel'],
  ['root', 'volume'],
  ['root', 'suhu'],
  ['partikel', 'tumbukan'],
  ['volume', 'boyle'],
  ['suhu', 'boyle'],
  ['tumbukan', 'boyle'],
  ['boyle', 'formula'],
];

export default function MindMap() {
  const [active, setActive] = useState<Node>(NODES[0]);
  const byId = (id: string) => NODES.find((n) => n.id === id)!;

  return (
    <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
      <div className="relative h-[360px] rounded-lg border border-slate-700 bg-slate-950 p-3">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-3 h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)]"
        >
          {EDGES.map(([a, b]) => {
            const na = byId(a);
            const nb = byId(b);
            return (
              <line
                key={`${a}-${b}`}
                x1={na.x}
                y1={na.y + 4}
                x2={nb.x}
                y2={nb.y + 4}
                stroke="rgba(34,211,238,0.45)"
                strokeWidth="0.4"
              />
            );
          })}
        </svg>

        {NODES.map((n) => {
          const isActive = active.id === n.id;
          return (
            <button
              key={n.id}
              type="button"
              onClick={() => setActive(n)}
              style={{ left: `${n.x}%`, top: `${n.y}%` }}
              className={[
                'absolute -translate-x-1/2 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold transition sm:text-xs',
                isActive
                  ? 'border-cyan-400 bg-cyan-500 text-slate-950 shadow-[0_0_20px_-4px_rgba(34,211,238,0.9)]'
                  : 'border-slate-600 bg-slate-800 text-slate-100 hover:border-cyan-500/60 hover:text-cyan-200',
              ].join(' ')}
            >
              {n.label}
            </button>
          );
        })}
      </div>

      <div className="rounded-lg border border-slate-700 bg-slate-900 p-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300">
          {active.label}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-100">{active.detail}</p>
        <p className="mt-4 text-xs text-slate-400">
          Klik node lain pada peta untuk membuka penjelasannya.
        </p>
      </div>
    </div>
  );
}