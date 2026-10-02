import { useMemo, useState } from 'react';
import {
  ArrowRight,
  ClipboardList,
  FlaskConical,
  ListChecks,
  PlusCircle,
  Sliders,
  Sparkles,
} from 'lucide-react';
import type { SectionId } from '../types';
import { useGasLab } from '../state/GasLabContext';
import {
  Button,
  Callout,
  Card,
  EmptyState,
  Pill,
  SectionTitle,
  TextArea,
  Toggle,
} from '../components/ui';
import GasSimulation from '../components/GasSimulation';
import PressureGauge from '../components/PressureGauge';
import CollisionMonitor from '../components/CollisionMonitor';
import ExperimentTable from '../components/ExperimentTable';
import BoyleGraph from '../components/BoyleGraph';
import {
  BASE_TEMP,
  boyleConstant,
  computeCollisionRate,
  computePressure,
  PARTICLES_MAX,
  PARTICLES_MIN,
  TEMP_MAX,
  TEMP_MIN,
  VOLUME_MAX,
  VOLUME_MIN,
} from '../utils/boyleLaw';
import { ANALYSIS_QUESTIONS } from '../data/questions';

export default function Explore({ onNavigate }: { onNavigate: (s: SectionId) => void }) {
  const {
    state,
    addExperiment,
    removeExperiment,
    clearExperiments,
    updateProgress,
    setAnalysisAnswer,
    markAnalysisDone,
    awardBadge,
  } = useGasLab();

  const [volume, setVolume] = useState(5);
  const [particles, setParticles] = useState(50);
  const [temperature, setTemperature] = useState(BASE_TEMP);
  const [isothermal, setIsothermal] = useState(true);
  const [collisionHistory, setCollisionHistory] = useState<number[]>([]);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const effTemp = isothermal ? BASE_TEMP : temperature;
  const pressure = computePressure(volume, particles, effTemp);
  const collisionRate = computeCollisionRate(volume, particles, effTemp);
  const k = boyleConstant(particles, effTemp);

  useMemo(() => {
    setCollisionHistory((prev) => {
      const next = [...prev, collisionRate];
      return next.length > 48 ? next.slice(-48) : next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collisionRate]);

  const record = () => {
    addExperiment({
      volume,
      pressure,
      pv: pressure * volume,
      particles,
      temperature: effTemp,
    });
  };

  const canAnalyze = state.experiments.length >= 3;

  const allAnswered = ANALYSIS_QUESTIONS.every(
    (q) => (state.analysisAnswers[q.id] ?? '').trim().length > 0,
  );

  const finishExplore = () => {
    updateProgress('explore', true);
    awardBadge('explorer');
    if (state.experiments.length >= 3 && state.analysisDone) awardBadge('analyst');
    onNavigate('explain');
  };

  return (
    <div className="space-y-8">
      <SectionTitle
        eyebrow="Explore"
        icon={<FlaskConical size={20} />}
        title="LAB 01 — Eksperimen Tekanan Gas"
        subtitle="Cari tahu sendiri hubungan antara volume dan tekanan."
      />

      {/* Misi peneliti */}
      <Card className="p-5">
        <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-100 to-sky-100 text-cyan-700">
            <ClipboardList size={17} />
          </span>
          Misi Peneliti
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[
            ['Pertanyaan', 'Bagaimana hubungan volume dan tekanan gas?', 'cyan'],
            ['Prediksi', 'Apa yang akan terjadi jika volume diperkecil?', 'sky'],
            ['Variabel', 'Diubah: volume. Diamati: tekanan. Dikontrol: suhu & jumlah gas.', 'violet'],
            ['Data', 'Catat hasil setiap perubahan volume.', 'emerald'],
            ['Kesimpulan', 'Gunakan bukti dari data, bukan dugaan.', 'amber'],
          ].map(([t, d, c]) => {
            const tone: Record<string, string> = {
              cyan: 'border-cyan-200 bg-gradient-to-br from-cyan-50 to-white',
              sky: 'border-sky-200 bg-gradient-to-br from-sky-50 to-white',
              violet: 'border-violet-200 bg-gradient-to-br from-violet-50 to-white',
              emerald: 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-white',
              amber: 'border-amber-200 bg-gradient-to-br from-amber-50 to-white',
            };
            const label: Record<string, string> = {
              cyan: 'text-cyan-700',
              sky: 'text-sky-700',
              violet: 'text-violet-700',
              emerald: 'text-emerald-700',
              amber: 'text-amber-700',
            };
            return (
              <div key={t} className={`rounded-xl border p-3 ${tone[c]}`}>
                <p className={`text-[11px] font-bold uppercase tracking-wider ${label[c]}`}>
                  {t}
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-700">{d}</p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Rancang eksperimen */}
      <Card className="p-5">
        <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-700">
            <Sliders size={17} />
          </span>
          Rancang Eksperimen
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-cyan-200 bg-gradient-to-br from-cyan-50 to-cyan-100/50 p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-cyan-700">
              Yang kita ubah
            </p>
            <p className="mt-1 text-base font-bold text-slate-900">Volume</p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
              Yang kita ukur
            </p>
            <p className="mt-1 text-base font-bold text-slate-900">Tekanan</p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100/50 p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
              Yang kita jaga
            </p>
            <p className="mt-1 text-base font-bold text-slate-900">Suhu &amp; jumlah gas</p>
          </div>
        </div>
      </Card>

      {/* Lab */}
      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <Card className="p-4 sm:p-5">
          <GasSimulation
            volume={volume}
            particleCount={particles}
            temperature={effTemp}
            reduceMotion={state.reduceMotion}
            height={340}
          />
          <p className="mt-3 text-xs italic text-slate-500">
            Visualisasi ini merupakan model sederhana untuk membantu memahami konsep.
          </p>

          <div className="mt-4 space-y-5">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="vol" className="text-sm font-semibold text-slate-700">
                  Volume
                </label>
                <span className="text-sm font-bold tabular-nums text-cyan-700">
                  Volume = {volume.toFixed(1)} L
                </span>
              </div>
              <input
                id="vol"
                type="range"
                min={VOLUME_MIN}
                max={VOLUME_MAX}
                step={0.1}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                aria-label="Volume gas dalam liter"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="part" className="text-sm font-semibold text-slate-700">
                  Jumlah Partikel
                </label>
                <span className="text-sm font-bold tabular-nums text-emerald-700">
                  Partikel = {particles}
                </span>
              </div>
              <input
                id="part"
                type="range"
                min={PARTICLES_MIN}
                max={PARTICLES_MAX}
                step={1}
                value={particles}
                onChange={(e) => setParticles(Number(e.target.value))}
                aria-label="Jumlah partikel gas"
              />
            </div>

            <Toggle
              id="iso"
              checked={isothermal}
              onChange={setIsothermal}
              label="Suhu tetap / Isotermal"
              description={
                isothermal
                  ? 'Mode Hukum Boyle aktif. Suhu dijaga pada 300 K.'
                  : 'Mode eksperimen lanjutan. Suhu dapat diubah.'
              }
            />

            <div className={isothermal ? 'opacity-50' : ''}>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="temp" className="text-sm font-semibold text-slate-700">
                  Suhu
                </label>
                <span className="text-sm font-bold tabular-nums text-amber-700">
                  {effTemp} K
                </span>
              </div>
              <input
                id="temp"
                type="range"
                min={TEMP_MIN}
                max={TEMP_MAX}
                step={5}
                value={temperature}
                disabled={isothermal}
                onChange={(e) => setTemperature(Number(e.target.value))}
                aria-label="Suhu gas dalam Kelvin"
              />
            </div>
          </div>
        </Card>

        <div className="space-y-5">
          <Card className="p-5">
            <PressureGauge pressure={pressure} />
          </Card>

          <Card className="p-5">
            <CollisionMonitor rate={collisionRate} history={collisionHistory} />
          </Card>

          <Button onClick={record} className="w-full" size="lg">
            <PlusCircle size={17} /> Catat Data
          </Button>
        </div>
      </div>

      <Callout tone="info">
        Model menggunakan pendekatan gas ideal untuk membantu melihat pola hubungan tekanan dan
        volume. Nilai yang ditampilkan bertujuan menunjukkan <strong>pola</strong>, bukan hasil
        pengukuran laboratorium presisi.
      </Callout>

      {/* Tabel */}
      <Card className="p-5">
        <ExperimentTable
          rows={state.experiments}
          onRemove={removeExperiment}
          onClearAll={clearExperiments}
        />
      </Card>

      {/* Grafik */}
      <Card className="p-5">
        <BoyleGraph
          rows={state.experiments}
          constant={k}
          liveVolume={volume}
          livePressure={pressure}
        />
      </Card>

      {/* Guided inquiry */}
      <Card className="p-5">
        <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-100 to-sky-100 text-cyan-700">
            <ListChecks size={17} />
          </span>
          Analisis Data
        </h2>

        {!canAnalyze ? (
          <EmptyState>
            Catat minimal <strong>3 data</strong> terlebih dahulu, lalu bagian ini akan terbuka.
          </EmptyState>
        ) : (
          <div className="mt-4 space-y-4">
            {ANALYSIS_QUESTIONS.map((q) => (
              <TextArea
                key={q.id}
                id={`analysis-${q.id}`}
                label={q.prompt}
                value={state.analysisAnswers[q.id] ?? ''}
                onChange={(v) => setAnalysisAnswer(q.id, v)}
                placeholder="Tuliskan hasil pengamatanmu…"
                rows={2}
              />
            ))}

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="secondary"
                disabled={!allAnswered}
                onClick={() => {
                  markAnalysisDone();
                  setShowAnalysis(true);
                  awardBadge('analyst');
                }}
              >
                <Sparkles size={15} /> Bandingkan dengan Konsep Ilmiah
              </Button>
              {!allAnswered && (
                <p className="text-xs text-slate-500">Jawab semua pertanyaan untuk melanjutkan.</p>
              )}
            </div>

            {(showAnalysis || state.analysisDone) && (
              <Callout tone="success" title="Sekarang bandingkan temuanmu dengan konsep ilmiah.">
                Ketika volume diperkecil, tekanan bertambah. Data P × V cenderung tetap selama
                jumlah gas dan suhu tidak diubah. Hubungan ini dinyatakan sebagai{' '}
                <strong>P × V = konstan</strong> atau <strong>P₁V₁ = P₂V₂</strong> — inilah Hukum
                Boyle.
              </Callout>
            )}
          </div>
        )}
      </Card>

      {/* Prediksi ulang */}
      {state.prediction && (
        <Card className="p-5">
          <div className="flex items-center gap-2">
            <Pill tone="amber">Cek Prediksi</Pill>
          </div>
          <p className="mt-3 text-sm text-slate-700">
            Prediksimu di awal adalah:{' '}
            <span className="font-bold text-slate-900">
              {state.prediction === 'A'
                ? 'Tekanan semakin kecil'
                : state.prediction === 'B'
                  ? 'Tekanan semakin besar'
                  : state.prediction === 'C'
                    ? 'Tekanan tetap'
                    : 'Tidak dapat diprediksi'}
            </span>
            . Apakah prediksimu masih sama setelah melihat data?
          </p>
        </Card>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600">
          Sudah menemukan polanya? Mari bangun konsepnya.
        </p>
        <Button onClick={finishExplore}>
          Lanjut ke Explain <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}