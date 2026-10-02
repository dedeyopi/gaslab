import {
  ArrowRight,
  Award,
  Compass,
  FlaskConical,
  GraduationCap,
  Settings,
  Target,
  UserRound,
} from 'lucide-react';
import type { SectionId } from '../types';
import { useGasLab } from '../state/GasLabContext';
import { Button, Card, Pill, ProgressBar } from '../components/ui';
import BadgeGrid from '../components/BadgeGrid';

const STAGE_LABEL: Record<string, string> = {
  engage: 'Engage — Fenomena & Prediksi',
  explore: 'Explore — Lab Virtual',
  explain: 'Explain — Membangun Konsep',
  elaborate: 'Elaborate — Dunia Nyata',
  evaluate: 'Evaluate — Uji Pemahaman',
};

const STAGE_SECTION: Record<string, SectionId> = {
  engage: 'engage',
  explore: 'explore',
  explain: 'explain',
  elaborate: 'elaborate',
  evaluate: 'evaluate',
};

export default function Dashboard({
  onNavigate,
  onOpenSettings,
}: {
  onNavigate: (s: SectionId) => void;
  onOpenSettings: () => void;
}) {
  const { state, progressPercent, completedStages } = useGasLab();
  const student = state.student;

  const nextStageKey =
    (['engage', 'explore', 'explain', 'elaborate', 'evaluate'] as const).find(
      (k) => !state.progress[k],
    ) ?? null;

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden p-0 animate-fadeUp">
        <div className="relative bg-gradient-to-br from-cyan-100 via-sky-50 to-emerald-100 px-6 py-8">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-300/40 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-12 left-1/3 h-40 w-40 rounded-full bg-emerald-300/40 blur-3xl"
          />
          <div className="relative flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-700">
                GASLAB · Virtual Laboratory
              </p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">Tekanan pada Gas</h1>
              <p className="mt-3 text-lg text-slate-700">
                Halo, <span className="font-bold text-slate-900">{student?.name}</span>! 👋
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Pill tone="cyan">
                  <GraduationCap size={13} /> Kelas {student?.className}
                </Pill>
                <Pill tone="emerald">
                  <Target size={13} /> {completedStages} dari 5 tahap selesai
                </Pill>
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={onOpenSettings}>
              <Settings size={14} /> Pengaturan
            </Button>
          </div>
        </div>

        <div className="border-t border-slate-100 bg-white px-6 py-5">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Progress Lab
            </p>
            <p className="text-sm font-bold tabular-nums text-cyan-600">{progressPercent}%</p>
          </div>
          <ProgressBar value={progressPercent} />
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-900">Tahapan Belajar</h2>
          <p className="mt-1 text-sm text-slate-600">
            Ikuti alurnya dari fenomena hingga refleksi.
          </p>

          <ul className="mt-4 space-y-2">
            {(['engage', 'explore', 'explain', 'elaborate', 'evaluate'] as const).map((key) => {
              const done = state.progress[key];
              const isNext = nextStageKey === key;
              return (
                <li key={key}>
                  <button
                    type="button"
                    onClick={() => onNavigate(STAGE_SECTION[key])}
                    className={[
                      'flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition',
                      done
                        ? 'border-emerald-200 bg-emerald-50 hover:bg-emerald-100'
                        : isNext
                          ? 'border-cyan-300 bg-cyan-50 hover:bg-cyan-100'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50',
                    ].join(' ')}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={[
                          'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold',
                          done
                            ? 'bg-emerald-500 text-white'
                            : isNext
                              ? 'bg-gradient-to-br from-cyan-500 to-cyan-600 text-white shadow'
                              : 'bg-slate-200 text-slate-500',
                        ].join(' ')}
                      >
                        {done ? '✓' : ''}
                      </span>
                      <span className="text-sm font-semibold text-slate-700">
                        {STAGE_LABEL[key]}
                      </span>
                    </span>
                    <span
                      className={[
                        'text-xs font-bold',
                        done
                          ? 'text-emerald-600'
                          : isNext
                            ? 'text-cyan-600'
                            : 'text-slate-500',
                      ].join(' ')}
                    >
                      {done ? 'Selesai' : isNext ? 'Lanjutkan' : 'Belum'}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {nextStageKey && (
            <Button className="mt-4" onClick={() => onNavigate(STAGE_SECTION[nextStageKey])}>
              Lanjutkan Belajar <ArrowRight size={16} />
            </Button>
          )}
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
              <Award size={17} className="text-amber-500" /> Badge Kamu
            </h2>
            <div className="mt-3">
              <BadgeGrid compact />
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
              <UserRound size={17} className="text-cyan-600" /> Profil Peneliti
            </h2>
            <p className="mt-2 text-sm font-semibold text-slate-800">{student?.name}</p>
            <p className="text-sm text-slate-500">Kelas {student?.className}</p>
            <p className="mt-3 text-sm text-slate-600">
              Data eksperimen tercatat:{' '}
              <span className="font-bold text-cyan-600">{state.experiments.length}</span>
            </p>
            <p className="text-sm text-slate-600">
              Skor kuis:{' '}
              <span className="font-bold text-emerald-600">
                {state.quiz.completed ? `${state.quiz.score}/100` : '—'}
              </span>
            </p>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            icon: <Compass size={18} />,
            title: 'Mulai dari Fenomena',
            text: 'Amati balon, kantong keripik, dan jarum suntik.',
            section: 'engage' as SectionId,
            color: 'from-sky-100 to-cyan-100 text-cyan-700 border-cyan-200',
          },
          {
            icon: <FlaskConical size={18} />,
            title: 'Lakukan Eksperimen',
            text: 'Ubah volume, catat tekanan, temukan polanya.',
            section: 'explore' as SectionId,
            color: 'from-emerald-100 to-teal-100 text-emerald-700 border-emerald-200',
          },
          {
            icon: <Award size={18} />,
            title: 'Uji Pemahaman',
            text: 'Kerjakan tantangan dan kuis akhir.',
            section: 'evaluate' as SectionId,
            color: 'from-amber-100 to-orange-100 text-amber-700 border-amber-200',
          },
        ].map((c) => (
          <Card key={c.section} interactive className="p-5">
            <button
              type="button"
              onClick={() => onNavigate(c.section)}
              className="w-full text-left"
            >
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-xl border bg-gradient-to-br ${c.color}`}
              >
                {c.icon}
              </span>
              <h3 className="mt-3 text-sm font-bold text-slate-900">{c.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">{c.text}</p>
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}