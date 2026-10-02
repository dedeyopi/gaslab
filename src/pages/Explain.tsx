import { useState } from 'react';
import { ArrowRight, Brain, Check, GitBranch, ShieldAlert, X } from 'lucide-react';
import type { SectionId } from '../types';
import { useGasLab } from '../state/GasLabContext';
import { Button, Callout, Card, Pill, SectionTitle } from '../components/ui';
import {
  GasMoleculeIllustration,
  ParticleChamberIllustration,
  ParticleCollisionIllustration,
} from '../components/Illustrations';
import MindMap from '../components/MindMap';
import { MISCONCEPTIONS } from '../data/misconceptions';
import { boyleConstant } from '../utils/boyleLaw';

export default function Explain({ onNavigate }: { onNavigate: (s: SectionId) => void }) {
  const { state, updateProgress, awardBadge } = useGasLab();
  const [mcIndex, setMcIndex] = useState(0);
  const [mcChoice, setMcChoice] = useState<boolean | null>(null);

  const k = boyleConstant(50, 300);
  const mc = MISCONCEPTIONS[mcIndex];

  const finish = () => {
    updateProgress('explain', true);
    awardBadge('particle');
    onNavigate('elaborate');
  };

  const cards = [
    {
      title: 'Gas Tersusun dari Partikel',
      body: 'Gas tersusun atas partikel-partikel yang sangat banyak dan berukuran sangat kecil. Antarpartikel terdapat ruang kosong yang relatif besar dibanding ukuran partikelnya.',
      visual: <ParticleChamberIllustration className="h-40 w-full" />,
    },
    {
      title: 'Partikel Bergerak Terus-Menerus',
      body: 'Partikel gas tidak pernah diam. Mereka bergerak ke segala arah dengan kecepatan yang berbeda-beda. Semakin tinggi suhu gas, semakin cepat gerak partikelnya.',
      visual: <GasMoleculeIllustration className="h-40 w-full" />,
    },
    {
      title: 'Partikel Bertumbukan dengan Dinding',
      body: 'Ketika partikel mencapai dinding wadah, terjadi tumbukan. Setiap tumbukan memberikan gaya yang sangat kecil, tetapi jumlahnya sangat banyak setiap detik.',
      visual: <ParticleCollisionIllustration className="h-40 w-full" />,
    },
    {
      title: 'Tumbukan Menghasilkan Tekanan',
      body: 'Total gaya dari seluruh tumbukan partikel pada setiap satuan luas dinding itulah yang kita sebut tekanan gas. Semakin sering dan semakin kuat tumbukannya, semakin besar tekanannya.',
      visual: <ParticleCollisionIllustration className="h-40 w-full" />,
    },
  ];

  return (
    <div className="space-y-8">
      <SectionTitle
        eyebrow="Explain"
        icon={<Brain size={20} />}
        title="Mengapa Tekanan Gas Bisa Berubah?"
        subtitle="Sekarang kita bangun penjelasannya dari empat ide utama berikut."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {cards.map((c, i) => (
          <Card key={c.title} className="p-5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 text-xs font-bold text-white shadow-sm">
                {i + 1}
              </span>
              <h2 className="text-base font-bold text-slate-900">{c.title}</h2>
            </div>
            <div className="my-3 rounded-xl border border-slate-200 bg-slate-50 p-2">
              {c.visual}
            </div>
            <p className="text-sm leading-relaxed text-slate-700">{c.body}</p>
          </Card>
        ))}
      </div>

      {/* Perbandingan volume */}
      <Card className="p-5">
        <h2 className="text-lg font-bold text-slate-900">Volume Besar vs Volume Kecil</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-4">
            <p className="text-sm font-bold text-emerald-800">Volume besar</p>
            <ul className="mt-2 space-y-1 text-sm text-slate-700">
              <li>• Partikel lebih berjauhan.</li>
              <li>• Tumbukan per satuan waktu lebih sedikit.</li>
              <li>• Tekanan lebih kecil.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-4">
            <p className="text-sm font-bold text-amber-800">Volume kecil</p>
            <ul className="mt-2 space-y-1 text-sm text-slate-700">
              <li>• Partikel lebih rapat.</li>
              <li>• Tumbukan ke dinding lebih sering.</li>
              <li>• Tekanan meningkat.</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Hukum Boyle */}
      <Card className="p-5">
        <div className="mb-3 flex items-center gap-2">
          <Pill tone="cyan">Hukum Boyle</Pill>
        </div>

        <p className="text-lg font-semibold leading-relaxed text-slate-900">
          Pada suhu tetap, tekanan gas berbanding terbalik dengan volumenya.
        </p>

        <div className="mt-5 rounded-2xl border-2 border-cyan-200 bg-gradient-to-br from-cyan-50 via-sky-50 to-emerald-50 px-6 py-6 text-center">
          <p className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            P₁V₁ = P₂V₂
          </p>
          <p className="mt-2 text-sm font-semibold text-cyan-700">P × V = konstan = k</p>
          <p className="mt-1 text-xs tabular-nums text-slate-500">
            Contoh: k = {k.toFixed(2)} atm·L
          </p>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <span className="text-sm font-semibold text-slate-700">Volume ↓</span>
            <ArrowRight size={16} className="text-slate-400" />
            <span className="text-sm font-bold text-amber-600">Pressure ↑</span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <span className="text-sm font-semibold text-slate-700">Volume ↑</span>
            <ArrowRight size={16} className="text-slate-400" />
            <span className="text-sm font-bold text-emerald-600">Pressure ↓</span>
          </div>
        </div>
      </Card>

      {/* Bongkar miskonsepsi */}
      <Card className="p-5">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-rose-100 to-pink-100 text-rose-600">
            <ShieldAlert size={18} />
          </span>
          Bongkar Miskonsepsi
        </h2>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {MISCONCEPTIONS.map((m, i) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                setMcIndex(i);
                setMcChoice(null);
              }}
              className={[
                'rounded-xl border px-3 py-1.5 text-xs font-semibold transition',
                i === mcIndex
                  ? 'border-cyan-300 bg-gradient-to-br from-cyan-100 to-sky-100 text-cyan-800 shadow-sm'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50',
              ].join(' ')}
            >
              Kasus {i + 1}
            </button>
          ))}
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5">
          <p className="text-base font-medium italic text-slate-800">“{mc.statement}”</p>

          <div className="mt-4 flex gap-2">
            <Button
              size="sm"
              variant={mcChoice === true ? 'primary' : 'secondary'}
              onClick={() => setMcChoice(true)}
            >
              <Check size={14} /> Benar
            </Button>
            <Button
              size="sm"
              variant={mcChoice === false ? 'primary' : 'secondary'}
              onClick={() => setMcChoice(false)}
            >
              <X size={14} /> Salah
            </Button>
          </div>

          {mcChoice !== null && (
            <div className="mt-4">
              <Callout
                tone={(mcChoice ? 'Benar' : 'Salah') === mc.verdict ? 'success' : 'warn'}
                title={`Pernyataan ini ${mc.verdict}.`}
              >
                {mc.explanation}
              </Callout>
            </div>
          )}
        </div>
      </Card>

      {/* Mind map */}
      <Card className="p-5">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-700">
            <GitBranch size={18} />
          </span>
          Apa yang Sekarang Kamu Ketahui?
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Klik setiap node untuk melihat penjelasannya.
        </p>
        <div className="mt-4">
          <MindMap />
        </div>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600">
          Konsep sudah terbangun. Mari terapkan di dunia nyata.
        </p>
        <Button onClick={finish}>
          Lanjut ke Elaborate <ArrowRight size={16} />
        </Button>
      </div>

      {state.progress.explain && (
        <Callout tone="success">
          Tahap Explain sudah kamu selesaikan. Kamu bisa kembali kapan saja untuk mengulang.
        </Callout>
      )}
    </div>
  );
}