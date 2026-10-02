import { Award, Flame, FlaskConical, Lock, Microscope, Sigma, Trophy } from 'lucide-react';
import type { ReactNode } from 'react';
import { useGasLab } from '../state/GasLabContext';

export interface BadgeDef {
  id: string;
  name: string;
  description: string;
  icon: ReactNode;
  color: string;
}

export const BADGES: BadgeDef[] = [
  {
    id: 'explorer',
    name: 'Penjelajah Gas',
    description: 'Menyelesaikan tahap Explore Lab.',
    icon: <FlaskConical size={20} />,
    color: 'text-cyan-700 border-cyan-200 bg-cyan-50',
  },
  {
    id: 'particle',
    name: 'Master Partikel',
    description: 'Memahami teori kinetik gas pada tahap Explain.',
    icon: <Microscope size={20} />,
    color: 'text-sky-700 border-sky-200 bg-sky-50',
  },
  {
    id: 'analyst',
    name: 'Analis Data',
    description: 'Mencatat dan menganalisis data eksperimen.',
    icon: <Award size={20} />,
    color: 'text-emerald-700 border-emerald-200 bg-emerald-50',
  },
  {
    id: 'boyle',
    name: 'Penakluk Boyle',
    description: 'Berhasil menggunakan Boyle Calculator.',
    icon: <Sigma size={20} />,
    color: 'text-amber-700 border-amber-200 bg-amber-50',
  },
  {
    id: 'solver',
    name: 'Problem Solver',
    description: 'Menyelesaikan Challenge Misi Tekanan.',
    icon: <Flame size={20} />,
    color: 'text-rose-700 border-rose-200 bg-rose-50',
  },
  {
    id: 'gaslab',
    name: 'GasLab Explorer',
    description: 'Menyelesaikan seluruh modul GASLAB.',
    icon: <Trophy size={20} />,
    color: 'text-yellow-700 border-yellow-200 bg-yellow-50',
  },
];

export default function BadgeGrid({ compact = false }: { compact?: boolean }) {
  const { state } = useGasLab();

  const list = compact ? BADGES.filter((b) => state.badges.includes(b.id)) : BADGES;

  if (compact && list.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        Belum ada badge. Badge berikutnya menunggu untuk ditemukan.
      </p>
    );
  }

  return (
    <div className={`grid gap-3 ${compact ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
      {list.map((b) => {
        const owned = state.badges.includes(b.id);
        return (
          <div
            key={b.id}
            className={[
              'flex items-start gap-3 rounded-xl border p-3 transition',
              owned ? b.color : 'border-slate-200 bg-slate-50 text-slate-400',
            ].join(' ')}
          >
            <span
              className={[
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border',
                owned ? b.color : 'border-slate-200 bg-white',
              ].join(' ')}
            >
              {owned ? b.icon : <Lock size={18} />}
            </span>
            <div className="min-w-0">
              <p className={`text-sm font-bold ${owned ? 'text-slate-900' : 'text-slate-400'}`}>
                {b.name}
              </p>
              <p className="mt-0.5 text-xs leading-snug text-slate-500">{b.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}