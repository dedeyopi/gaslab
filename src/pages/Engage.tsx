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

  const mc = MISCONCEPTIONS[1];
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
            <h2 className="text-xl font-bold !text-slate-900">
              Di dalam balon, ada sesuatu yang terus bergerak.
            </h2>
            <p className="mt-3 text-sm leading-relaxed !text-slate-700">
              Balon terasa kenyal dan bisa meletus ketika diperas. Apa yang sebenarnya terjadi
              di dalamnya? Balon berisi udara — kumpulan partikel yang sangat kecil dan tidak
              pernah diam.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Pill tone="cyan">Partikel gas</Pill>
              <Pill tone="emerald">Gerak terus-menerus</Pill>
              <Pill tone="amber">Tekanan</Pill>
            </div>
          </div>
          <BalloonIllustration volume={5} className="mx-auto h-48 w-44 animate-floaty" />
        </div>
      </Card>

      {/* Fenomena 1 */}
      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <Pill tone="cyan">Fenomena 1</Pill>
        </div>
        <h2 className="text-lg font-bold !text-slate-900">
          Mengapa kantong keripik dapat mengembang ketika dibawa ke daerah pegunungan?
        </h2>

        <div className="mt-5 grid items-center gap-6 md:grid-cols-[auto_1fr]">
          <div className="mx-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
            <ChipsBagIllustration altitude={altitude} className="h-52 w-44" />
          </div>

          <div>
            <div className="mb-4 flex gap-2">
              <Button
                size="sm"
                variant={altitude === 'low' ? 'primary' : 'secondary'}
                onClick={() => setAltitude('low')}
              >
                Daerah rendah
              </Button>
              <Button
                size="sm"
                variant={altitude === 'high' ? 'primary' : 'secondary'}
                onClick={() => setAltitude('high')}
              >
                Pegunungan
              </Button>
            </div>
            <p className="text-sm leading-relaxed !text-slate-700">
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
        <h2 className="text-lg font-bold !text-slate-900">
          Mengapa jarum suntik terasa lebih sulit ditekan ketika ujungnya ditutup?
        </h2>

        <div className="mt-5 grid items-center gap-6 md:grid-cols-[auto_1fr]">
          <div className="mx-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
            <SyringeIllustration volumeRatio={syringeRatio} className="h-52 w-44" />
          </div>

          <div>
            <label
              htmlFor="syringe-slider"
              className="mb-2 block text-sm font-semibold !text-slate-700"
            >
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
            <p className="mt-1 text-xs font-semibold tabular-nums !text-slate-600">
              Volume ruang: {(syringeRatio * 100).toFixed(0)}%
            </p>

            <p className="mt-4 text-sm leading-relaxed !text-slate-700">
              Semakin piston diturunkan, volume ruang udara makin kecil. Partikel udara di
              dalamnya jadi lebih rapat dan lebih sering menumbuk dinding serta piston. Tekanan
              udara di dalam meningkat dan mendorong piston kembali ke atas.
            </p>
          </div>
        </div>
      </Card>

      {/* Prediksi */}
      <Card className="p-6">
        <div className="mb-3 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-100 to-sky-100 !text-cyan-700">
            <HelpCircle size={18} />
          </span>
          <h2 className="text-lg font-bold !text-slate-900">Prediksi Awalmu</h2>
        </div>
        <p className="text-sm !text-slate-700">
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
                  'flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition',
                  selected
                    ? 'border-cyan-400 bg-gradient-to-br from-cyan-50 to-cyan-100 !text-cyan-900 shadow-sm'
                    : 'border-slate-200 bg-white !text-slate-700 hover:border-cyan-300 hover:bg-cyan-50/40',
                ].join(' ')}
              >
                <span
                  className={[
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                    selected
                      ? 'bg-gradient-to-br from-cyan-500 to-cyan-600 !text-white'
                      : 'bg-slate-100 !text-slate-600',
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
        <p className="text-base font-semibold !text-slate-800">
          “Gas tidak memberikan tekanan karena gas sangat ringan.”
        </p>

        <div className="mt-4 flex gap-2">
          <Button
            variant={mcAnswer === true ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setMcAnswer(true)}
          >
            <ThumbsUp size={14} /> Benar
          </Button>
          <Button
            variant={mcAnswer === false ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setMcAnswer(false)}
          >
            <ThumbsDown size={14} /> Salah
          </Button>
        </div>

        {mcAnswer !== null && (
          <div className="mt-4">
            <Callout
              tone={answeredCorrect ? 'success' : 'warn'}
              title={answeredCorrect ? 'Tepat!' : 'Belum tepat'}
            >
              {mc.explanation}
            </Callout>
          </div>
        )}
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm !text-slate-600">
          Sudah siap bereksperimen? Lanjut ke Lab Virtual.
        </p>
        <Button onClick={finish}>
          Lanjut ke Explore Lab <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}