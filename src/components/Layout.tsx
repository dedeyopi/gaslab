import { useState, type ReactNode } from 'react';
import {
  Award,
  BookOpenCheck,
  Brain,
  Compass,
  FlaskConical,
  Home,
  Info,
  Menu,
  ScrollText,
  Target,
  X,
} from 'lucide-react';
import type { SectionId } from '../types';
import { useGasLab } from '../state/GasLabContext';
import { ProgressBar } from './ui';

interface NavItem {
  id: SectionId;
  label: string;
  icon: ReactNode;
}

const NAV: NavItem[] = [
  { id: 'dashboard', label: 'Beranda', icon: <Home size={18} /> },
  { id: 'engage', label: 'Engage', icon: <Compass size={18} /> },
  { id: 'explore', label: 'Explore Lab', icon: <FlaskConical size={18} /> },
  { id: 'explain', label: 'Explain', icon: <Brain size={18} /> },
  { id: 'elaborate', label: 'Elaborate', icon: <BookOpenCheck size={18} /> },
  { id: 'challenge', label: 'Challenge', icon: <Target size={18} /> },
  { id: 'evaluate', label: 'Evaluate', icon: <Award size={18} /> },
  { id: 'certificate', label: 'Sertifikat', icon: <ScrollText size={18} /> },
  { id: 'about', label: 'Tentang', icon: <Info size={18} /> },
];

const MOBILE_PRIMARY: SectionId[] = ['dashboard', 'explore', 'explain', 'evaluate'];

interface Props {
  current: SectionId;
  onNavigate: (s: SectionId) => void;
  children: ReactNode;
}

export default function Layout({ current, onNavigate, children }: Props) {
  const { state, progressPercent } = useGasLab();
  const [menuOpen, setMenuOpen] = useState(false);

  const go = (id: SectionId) => {
    onNavigate(id);
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen">
      {/* Sidebar desktop */}
      <aside className="no-print fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200 bg-white/95 backdrop-blur lg:flex">
        <div className="flex items-center gap-2.5 border-b border-slate-200 px-5 py-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 text-white shadow-[0_4px_12px_-4px_rgba(6,182,212,0.6)]">
            <FlaskConical size={18} />
          </span>
          <div>
            <p className="text-sm font-bold tracking-wide text-slate-900">GASLAB</p>
            <p className="text-[11px] text-slate-500">Tekanan pada Gas</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {NAV.map((item) => {
            const active = current === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => go(item.id)}
                aria-current={active ? 'page' : undefined}
                className={[
                  'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition',
                  active
                    ? 'bg-gradient-to-r from-cyan-50 to-emerald-50 text-cyan-700 border border-cyan-200 shadow-sm'
                    : 'border border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                ].join(' ')}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 p-4">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Progress Lab
          </p>
          <ProgressBar value={progressPercent} />
          <p className="mt-1.5 text-xs tabular-nums text-slate-500">{progressPercent}% selesai</p>
          {state.student && (
            <p className="mt-3 truncate text-xs text-slate-500">
              {state.student.name} · {state.student.className}
            </p>
          )}
        </div>
      </aside>

      {/* Konten */}
      <div className="lg:pl-64">
        <header className="no-print sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="flex items-center justify-between gap-3 px-4 py-3 lg:px-8">
            <div className="flex items-center gap-2 lg:hidden">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-emerald-500 text-white">
                <FlaskConical size={16} />
              </span>
              <div>
                <p className="text-sm font-bold text-slate-900">GASLAB</p>
                <p className="text-[10px] text-slate-500">Tekanan pada Gas</p>
              </div>
            </div>

            <div className="hidden min-w-0 lg:block">
              <p className="truncate text-sm text-slate-600">
                {state.student
                  ? `Halo, ${state.student.name} — Kelas ${state.student.className}`
                  : 'Selamat datang di laboratorium'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden w-40 sm:block lg:hidden">
                <ProgressBar value={progressPercent} />
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Buka menu navigasi"
                aria-expanded={menuOpen}
                className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 shadow-sm lg:hidden"
              >
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          {menuOpen && (
            <nav className="border-t border-slate-200 bg-white p-3 lg:hidden">
              <div className="grid grid-cols-2 gap-2">
                {NAV.map((item) => {
                  const active = current === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => go(item.id)}
                      className={[
                        'flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition',
                        active
                          ? 'bg-gradient-to-r from-cyan-50 to-emerald-50 text-cyan-700 border border-cyan-200'
                          : 'border border-slate-200 text-slate-600 hover:bg-slate-50',
                      ].join(' ')}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </nav>
          )}
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-6 lg:px-8 lg:pb-16">
          {children}
        </main>

        <footer className="no-print border-t border-slate-200 bg-white/60 px-4 py-8 lg:px-8">
          <div className="mx-auto max-w-6xl text-sm text-slate-500">
            <p className="font-bold text-slate-700">GASLAB</p>
            <p>Virtual Laboratory — Tekanan pada Gas</p>
            <p className="mt-3">
              Dikembangkan oleh <span className="font-semibold text-slate-700">Dede Yopi, M.Pd.</span>
            </p>
            <p>Guru IPA / Pengembang Media Pembelajaran Digital — SMP Fase D</p>
          </div>
        </footer>
      </div>

      {/* Bottom nav mobile */}
      <nav className="no-print fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur lg:hidden">
        <div className="grid grid-cols-4">
          {MOBILE_PRIMARY.map((id) => {
            const item = NAV.find((n) => n.id === id)!;
            const active = current === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => go(id)}
                aria-current={active ? 'page' : undefined}
                className={[
                  'flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold transition',
                  active ? 'text-cyan-600' : 'text-slate-400',
                ].join(' ')}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}