import { useState } from 'react';
import { ArrowRight, Compass, HelpCircle, Lightbulb, ThumbsDown, ThumbsUp } from 'lucide-react';
import type { SectionId } from '../types';
import { useGasLab } from '../state/GasLabContext';
import { Button, Callout, Card, Pill, SectionTitle } from '../components/ui';
import {
  BalloonIllustration,
  ChipsBagIllustration,
  SyringeIllustration,
} from '../components/Illustrations';
import { PREDICTION_OPTIONS } from '../data/questions';
import { MISCONCEPTIONS } from '../data/misconceptions';

export default function Engage({ onNavigate }: { onNavigate: (s: SectionId) => void }) {
  const { state, setPrediction, updateProgress } = useGasLab();
  const [syringeRatio, setSyringeRatio] = useState(1);
  const [altitude, setAltitude] = useState<'low' | 'high'>('low');
  const [mcAnswer, setMcAnswer] = useState<boolean | null>(null);

  const mc = MISCONCEPTIONS[1]; // "Gas tidak memberikan tekanan karena ringan"
  const answeredCorrect = mcAnswer !== null && mcAnswer === false;

  const finish = () => {
    updateProgress('engage', true);
    onNavigate('explore');
  };

  return (
    <div className="space-y-8">
      <SectionTitle
        eyebrow="Engage"
        icon={<Compass size={20} />}
        title="Kenapa Balon Bisa Meletus?"
        subtitle="Sebelum kita membahas definisi, mari amati dulu beberapa fenomena di sekitar kita."
      />

      <Card className="overflow-hidden p-0">
        <div className="grid items-center gap-6 p-6 md:grid-cols-[1fr_auto]">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Di dalam balon, ada sesuatu yang terus bergerak.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Balon terasa kenyal dan bisa meletus ketika diperas. Apa yang sebenarnya terjadi di
              dalamnya? Balon berisi udara — kumpulan partikel yang sangat kecil dan tidak pernah
              diam.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Pill tone="cyan">Partikel gas</Pill>
              <Pill tone="emerald">Gerak terus-menerus</Pill>
              <Pill tone="amber">Tekanan</Pill>
            </div>
          </div>
          <BalloonIllustration className="mx-auto h-44 w-40 animate-floaty" />
        </div>
      </Card>

      {/* Fenomena 1 */}
      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <Pill tone="cyan">Fenomena 1</Pill>
        </div>
        <h2 className="text-lg font-semibold text-white">
          Mengapa kantong keripik dapat mengembang ketika dibawa ke daerah pegunungan?
        </h2>

        <div className="mt-5 grid items-center gap-6 md:grid-cols-[auto_1fr]">
          <ChipsBagIllustration altitude={altitude} className="mx-auto h-48 w-40" />

          <div>
            <div className="mb-4 flex gap-2">
              <Button
                size="sm"
                variant={altitude === 'low' ? 'primary' : 'ghost'}
                onClick={() => setAltitude('low')}
              >
                Daerah rendah
              </Button>
              <Button
                size="sm"
                variant={altitude === 'high' ? 'primary' : 'ghost'}
                onClick={() => setAltitude('high')}
              >
                Pegunungan
              </Button>
            </div>
            <p className="text-sm leading-relaxed text-slate-600">
              {altitude === 'low'
                ? 'Di daerah rendah, tekanan udara luar cukup besar sehingga kantong tampak kempis dan rapat.'
                : 'Di pegunungan, tekanan udara luar lebih kecil. Gas di dalam kantong yang tertutup rapat "mendorong" dari dalam lebih kuat dibanding tekanan luar, sehingga kantong mengembang.'}
            </p>
            <Callout tone="neutral" className="mt-4">
              Perhatikan: jumlah udara di dalam kantong <strong>tidak bertambah</strong>. Yang
              berubah adalah tekanan udara di luar kantong.
            </Callout>
          </div>
        </div>
      </Card>

      {/* Fenomena 2 */}
      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <Pill tone="emerald">Fenomena 2</Pill>
        </div>
        <h2 className="text-lg font-semibold text-white">
          Mengapa jarum suntik terasa lebih sulit ditekan ketika ujungnya ditutup?
        </h2>

        <div className="mt-5 grid items-center gap-6 md:grid-cols-[auto_1fr]">
          <SyringeIllustration volumeRatio={syringeRatio} className="mx-auto h-52 w-44" />

          <div>
            <label htmlFor="syringe-slider" className="mb-2 block text-sm font-medium text-slate-600">
              Geser piston untuk menekan udara di dalam suntikan
            </label>
            <input
              id="syringe-slider"
              type="range"
              min={0.2}
              max={1}
              step={0.01}
              value={syringeRatio}
              onChange={(e) => setSyringeRatio(Number(e.target.value))}
              aria-label="Posisi piston suntikan"
            />
            <p className="mt-1 text-xs tabular-nums text-slate-500">
              Volume ruang: {(syringeRatio * 100).toFixed(0)}%
            </p>

            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              Semakin piston diturunkan, volume ruang udara makin kecil. Partikel udara di dalamnya
              jadi lebih rapat dan lebih sering menumbuk dinding serta piston. Tekanan udara di
              dalam meningkat dan mendorong piston kembali ke atas.
            </p>
          </div>
        </div>
      </Card>

      {/* Prediksi */}
      <Card className="p-6">
        <div className="mb-3 flex items-center gap-2">
          <HelpCircle className="text-cyan-400" size={18} />
          <h2 className="text-lg font-semibold text-white">Prediksi Awalmu</h2>
        </div>
        <p className="text-sm text-slate-600">
          Menurutmu, apa yang terjadi pada tekanan gas ketika volume ruang diperkecil?
        </p>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {PREDICTION_OPTIONS.map((opt) => {
            const selected = state.prediction === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setPrediction(opt.id)}
                className={[
                  'flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition',
                  selected
                    ? 'border-cyan-500/60 bg-cyan-500/10 text-cyan-100'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-600',
                ].join(' ')}
              >
                <span
                  className={[
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                    selected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-700 text-slate-700',
                  ].join(' ')}
                >
                  {opt.id}
                </span>
                {opt.text}
              </button>
            );
          })}
        </div>

        {state.prediction && (
          <Callout tone="info" className="mt-4">
            <span className="flex items-start gap-2">
              <Lightbulb size={16} className="mt-0.5 shrink-0" />
              Prediksimu sudah disimpan. Kita akan memeriksanya kembali setelah eksperimen di Lab
              Virtual.
            </span>
          </Callout>
        )}
      </Card>

      {/* Miskonsepsi */}
      <Card className="p-6">
        <div className="mb-3 flex items-center gap-2">
          <Pill tone="amber">Benarkah?</Pill>
        </div>
        <p className="text-base font-medium text-slate-700">
          “Gas tidak memberikan tekanan karena gas sangat ringan.”
        </p>

        <div className="mt-4 flex gap-2">
          <Button
            variant={mcAnswer === true ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setMcAnswer(true)}
          >
            <ThumbsUp size={14} /> Benar
          </Button>
          <Button
            variant={mcAnswer === false ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setMcAnswer(false)}
          >
            <ThumbsDown size={14} /> Salah
          </Button>
        </div>

        {mcAnswer !== null && (
          <div className="mt-4">
            <Callout tone={answeredCorrect ? 'success' : 'warn'} title={answeredCorrect ? 'Tepat!' : 'Belum tepat'}>
              {mc.explanation}
            </Callout>
          </div>
        )}
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          Sudah siap bereksperimen? Lanjut ke Lab Virtual.
        </p>
        <Button onClick={finish}>
          Lanjut ke Explore Lab <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}