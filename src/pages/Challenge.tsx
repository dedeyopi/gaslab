import { useState } from 'react';
import { ArrowRight, Flame, RotateCcw, Target, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { SectionId } from '../types';
import { useGasLab } from '../state/GasLabContext';
import { Button, Callout, Card, Pill, SectionTitle } from '../components/ui';
import GasSimulation from '../components/GasSimulation';
import PressureGauge from '../components/PressureGauge';

interface Mission {
  id: number;
  constant: number;
  target: number;
  tolerance: number;
}

const MISSIONS: Mission[] = [
  { id: 1, constant: 10, target: 2, tolerance: 0.05 },
  { id: 2, constant: 12, target: 4, tolerance: 0.08 },
  { id: 3, constant: 6, target: 1.5, tolerance: 0.05 },
];

export default function Challenge({ onNavigate }: { onNavigate: (s: SectionId) => void }) {
  const { state, setChallengeScore, awardBadge, updateProgress } = useGasLab();

  const [missionIndex, setMissionIndex] = useState(0);
  const [volume, setVolume] = useState(5);
  const [attempts, setAttempts] = useState(0);
  const [solved, setSolved] = useState<number[]>([]);
  const [hint, setHint] = useState<string | null>(null);

  const mission = MISSIONS[missionIndex];

  // Gunakan model langsung agar sesuai dengan konstanta misi
  const actualPressure = mission.constant / volume;
  const diff = Math.abs(actualPressure - mission.target);
  const isCorrect = diff <= mission.tolerance;

  const check = () => {
    setAttempts((a) => a + 1);
    if (isCorrect) {
      const nextSolved = solved.includes(mission.id) ? solved : [...solved, mission.id];
      setSolved(nextSolved);
      setHint(null);
      const score = Math.round((nextSolved.length / MISSIONS.length) * 100);
      setChallengeScore(score);
      if (nextSolved.length === MISSIONS.length) {
        awardBadge('solver');
        confetti({ particleCount: 120, spread: 70, origin: { y: 0.7 } });
      } else {
        confetti({ particleCount: 60, spread: 55, origin: { y: 0.7 } });
      }
    } else if (diff > mission.tolerance * 4) {
      setHint(
        `Tekanan saat ini ${actualPressure.toFixed(2)} atm, target ${mission.target.toFixed(2)} atm. Ingat P × V = ${mission.constant}. Coba hitung V = ${mission.constant} / ${mission.target.toFixed(2)} lalu geser piston ke nilai itu.`,
      );
    } else {
      setHint(
        `Sudah dekat! Tekanan ${actualPressure.toFixed(2)} atm. ${
          actualPressure > mission.target ? 'Volume perlu sedikit diperbesar.' : 'Volume perlu sedikit diperkecil.'
        }`,
      );
    }
  };

  const nextMission = () => {
    const next = Math.min(missionIndex + 1, MISSIONS.length - 1);
    setMissionIndex(next);
    setVolume(5);
    setHint(null);
    setAttempts(0);
  };

  const allSolved = solved.length === MISSIONS.length;

  const finish = () => {
    updateProgress('evaluate', state.quiz.completed);
    awardBadge('solver');
    onNavigate('evaluate');
  };

  return (
    <div className="space-y-8">
      <SectionTitle
        eyebrow="Challenge"
        icon={<Target size={20} />}
        title="MISSION: PRESSURE CONTROL"
        subtitle="Kamu berperan sebagai teknisi laboratorium. Sesuaikan volume agar tekanan mencapai target."
      />

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Card className="p-5">
          <GasSimulation volume={volume} particleCount={50} temperature={300} reduceMotion={state.reduceMotion} height={300} />

          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between">
              <label htmlFor="ch-vol" className="text-sm font-medium text-slate-600">
                Posisi Piston (Volume)
              </label>
              <span className="text-sm font-semibold tabular-nums text-cyan-300">
                {volume.toFixed(2)} L
              </span>
            </div>
            <input
              id="ch-vol"
              type="range"
              min={1}
              max={10}
              step={0.05}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              aria-label="Volume pada tantangan"
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Button onClick={check}>
              <Target size={16} /> Periksa Tekanan
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setVolume(5);
                setHint(null);
              }}
            >
              <RotateCcw size={15} /> Reset Piston
            </Button>
          </div>

          {hint && (
            <div className="mt-4">
              <Callout tone={isCorrect ? 'success' : 'warn'} title={isCorrect ? 'Target tercapai!' : 'Petunjuk'}>
                {hint}
              </Callout>
            </div>
          )}
        </Card>

        <div className="space-y-5">
          <Card className="p-5">
            <Pill tone="amber">
              <Flame size={12} /> Misi {mission.id} dari {MISSIONS.length}
            </Pill>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-wider text-slate-500">Target tekanan</p>
                <p className="text-xl font-bold tabular-nums text-amber-300">
                  {mission.target.toFixed(2)} atm
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-wider text-slate-500">Konstanta</p>
                <p className="text-xl font-bold tabular-nums text-cyan-300">
                  {mission.constant.toFixed(1)} atm·L
                </p>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Tekanan saat ini:{' '}
              <span className={`font-semibold tabular-nums ${isCorrect ? 'text-emerald-300' : 'text-slate-700'}`}>
                {actualPressure.toFixed(3)} atm
              </span>{' '}
              · Percobaan ke-{attempts}
            </p>
          </Card>

          <Card className="p-5">
            <PressureGauge pressure={Math.min(5, actualPressure)} />
          </Card>

          <Card className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Misi Selesai
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-emerald-300">
              {solved.length}/{MISSIONS.length}
            </p>
            <div className="mt-3 flex gap-1.5">
              {MISSIONS.map((m) => (
                <span
                  key={m.id}
                  className={[
                    'h-2 flex-1 rounded-full',
                    solved.includes(m.id) ? 'bg-emerald-400' : 'bg-slate-700',
                  ].join(' ')}
                />
              ))}
            </div>

            {!allSolved && solved.includes(mission.id) && (
              <Button className="mt-4 w-full" variant="secondary" onClick={nextMission}>
                Misi Berikutnya <ArrowRight size={15} />
              </Button>
            )}

            {allSolved && (
              <Callout tone="success" className="mt-4">
                <span className="flex items-center gap-2">
                  <Trophy size={16} /> Semua misi selesai! Kamu resmi jadi Problem Solver.
                </span>
              </Callout>
            )}
          </Card>
        </div>
      </div>

      <Card className="p-5">
        <h2 className="text-base font-semibold text-white">PREDICT THE PRESSURE</h2>
        <p className="mt-2 text-sm text-slate-600">
          Jika volume gas dikurangi 50% pada suhu tetap, apa yang terjadi pada tekanan?
        </p>
        <PredictPressure />
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          Sudah siap menguji pemahaman secara menyeluruh?
        </p>
        <Button onClick={finish}>
          Lanjut ke Evaluate <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}

/* -------------------- Sub-komponen: Predict the Pressure ------------------- */
function PredictPressure() {
  const [choice, setChoice] = useState<string | null>(null);
  const options = [
    { id: 'A', text: 'Tetap', correct: false },
    { id: 'B', text: 'Menjadi setengah', correct: false },
    { id: 'C', text: 'Menjadi dua kali', correct: true },
    { id: 'D', text: 'Menjadi nol', correct: false },
  ];
  const chosen = options.find((o) => o.id === choice);

  return (
    <div className="mt-4">
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => setChoice(o.id)}
            className={[
              'rounded-lg border px-4 py-3 text-left text-sm transition',
              choice === o.id
                ? o.correct
                  ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-100'
                  : 'border-rose-500/60 bg-rose-500/10 text-rose-100'
                : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-600',
            ].join(' ')}
          >
            <span className="font-semibold">{o.id}.</span> {o.text}
          </button>
        ))}
      </div>

      {chosen && (
        <Callout tone={chosen.correct ? 'success' : 'warn'} className="mt-4">
          {chosen.correct
            ? 'Tepat! Karena P × V konstan, memperkecil volume menjadi setengah membuat tekanan menjadi dua kali lipat.'
            : 'Belum tepat. Ingat bahwa P × V tetap konstan. Jika volume menjadi setengah, tekanan harus menjadi dua kali agar hasil kalinya tetap sama.'}
        </Callout>
      )}
    </div>
  );
}