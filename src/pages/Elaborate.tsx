import { useState } from 'react';
import { ArrowRight, BookOpenCheck, Lightbulb, Microscope } from 'lucide-react';
import type { SectionId } from '../types';
import { useGasLab } from '../state/GasLabContext';
import { Button, Callout, Card, Pill, SectionTitle, TextArea } from '../components/ui';
import {
  BalloonIllustration,
  BikePumpIllustration,
  DiverIllustration,
  LungsIllustration,
  SyringeIllustration,
} from '../components/Illustrations';
import BoyleCalculator from '../components/BoyleCalculator';
import { CASE_STUDIES } from '../data/caseStudies';
import { computePressure } from '../utils/boyleLaw';

export default function Elaborate({ onNavigate }: { onNavigate: (s: SectionId) => void }) {
  const { state, updateProgress, awardBadge, setCer } = useGasLab();

  const [syringe, setSyringe] = useState(1);
  const [lungsExpanded, setLungsExpanded] = useState(false);
  const [depth, setDepth] = useState(0.3);
  const [pump, setPump] = useState(0.2);
  const [balloonVolume, setBalloonVolume] = useState(5);

  const finish = () => {
    updateProgress('elaborate', true);
    onNavigate('challenge');
  };

  return (
    <div className="space-y-8">
      <SectionTitle
        eyebrow="Elaborate"
        icon={<BookOpenCheck size={20} />}
        title="Dari Laboratorium ke Dunia Nyata"
        subtitle="Konsep tekanan gas ternyata ada di banyak hal di sekitar kita."
      />

      {/* CASE 01 — Jarum suntik */}
      <Card className="p-5">
        <Pill tone="cyan">{CASE_STUDIES[0].index}</Pill>
        <h2 className="mt-3 text-lg font-bold !text-slate-900">{CASE_STUDIES[0].title}</h2>
        <div className="mt-4 grid items-center gap-6 md:grid-cols-[auto_1fr]">
          <div className="mx-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
            <SyringeIllustration volumeRatio={syringe} className="h-48 w-40" />
          </div>
          <div>
            <label
              htmlFor="el-syr"
              className="mb-2 block text-sm font-semibold !text-slate-700"
            >
              Geser piston (ujung suntikan tertutup)
            </label>
            <input
              id="el-syr"
              type="range"
              min={0.2}
              max={1}
              step={0.01}
              value={syringe}
              onChange={(e) => setSyringe(Number(e.target.value))}
              aria-label="Posisi piston pada kasus jarum suntik"
            />
            <p className="mt-1 text-xs font-semibold tabular-nums !text-slate-600">
              Volume: {(syringe * 100).toFixed(0)}% · Tekanan relatif: {(1 / syringe).toFixed(2)}×
            </p>
            <p className="mt-3 text-sm font-bold !text-slate-900">{CASE_STUDIES[0].question}</p>
            <p className="mt-2 text-sm leading-relaxed !text-slate-700">
              {CASE_STUDIES[0].explanation}
            </p>
          </div>
        </div>
      </Card>

      {/* CASE 02 — Paru-paru */}
      <Card className="p-5">
        <Pill tone="emerald">{CASE_STUDIES[1].index}</Pill>
        <h2 className="mt-3 text-lg font-bold !text-slate-900">{CASE_STUDIES[1].title}</h2>
        <div className="mt-4 grid items-center gap-6 md:grid-cols-[auto_1fr]">
          <div className="mx-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
            <LungsIllustration expanded={lungsExpanded} className="h-48 w-44" />
          </div>
          <div>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={lungsExpanded ? 'primary' : 'secondary'}
                onClick={() => setLungsExpanded(true)}
              >
                Menarik napas
              </Button>
              <Button
                size="sm"
                variant={!lungsExpanded ? 'primary' : 'secondary'}
                onClick={() => setLungsExpanded(false)}
              >
                Mengembuskan napas
              </Button>
            </div>

            <ul className="mt-4 space-y-1.5 text-sm font-medium !text-slate-700">
              {lungsExpanded ? (
                <>
                  <li>• Rongga dada membesar.</li>
                  <li>• Volume paru bertambah.</li>
                  <li>• Tekanan udara di dalam paru menurun.</li>
                  <li>• Udara dari luar masuk.</li>
                </>
              ) : (
                <>
                  <li>• Rongga dada mengecil.</li>
                  <li>• Volume paru berkurang.</li>
                  <li>• Tekanan udara di dalam paru meningkat.</li>
                  <li>• Udara terdorong keluar.</li>
                </>
              )}
            </ul>

            <Callout tone="neutral" className="mt-4">
              {CASE_STUDIES[1].note}
            </Callout>
          </div>
        </div>
      </Card>

      {/* CASE 03 — Penyelam */}
      <Card className="p-5">
        <Pill tone="sky">{CASE_STUDIES[2].index}</Pill>
        <h2 className="mt-3 text-lg font-bold !text-slate-900">{CASE_STUDIES[2].title}</h2>
        <div className="mt-4 grid items-center gap-6 md:grid-cols-[auto_1fr]">
          <div className="mx-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
            <DiverIllustration depth={depth} className="h-48 w-44" />
          </div>
          <div>
            <label
              htmlFor="el-depth"
              className="mb-2 block text-sm font-semibold !text-slate-700"
            >
              Atur kedalaman penyelam
            </label>
            <input
              id="el-depth"
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={depth}
              onChange={(e) => setDepth(Number(e.target.value))}
              aria-label="Kedalaman penyelam"
            />
            <p className="mt-1 text-xs font-semibold tabular-nums !text-slate-600">
              Kedalaman: {(depth * 30).toFixed(0)} m · Tekanan lingkungan relatif:{' '}
              {(1 + depth * 3).toFixed(2)} atm
            </p>
            <p className="mt-3 text-sm font-bold !text-slate-900">{CASE_STUDIES[2].question}</p>
            <p className="mt-2 text-sm leading-relaxed !text-slate-700">
              {CASE_STUDIES[2].explanation}
            </p>
            <Callout tone="warn" className="mt-3">
              {CASE_STUDIES[2].note}
            </Callout>
          </div>
        </div>
      </Card>

      {/* CASE 04 — Pompa sepeda */}
      <Card className="p-5">
        <Pill tone="amber">{CASE_STUDIES[3].index}</Pill>
        <h2 className="mt-3 text-lg font-bold !text-slate-900">{CASE_STUDIES[3].title}</h2>
        <div className="mt-4 grid items-center gap-6 md:grid-cols-[auto_1fr]">
          <div className="mx-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
            <BikePumpIllustration pressRatio={pump} className="h-48 w-36" />
          </div>
          <div>
            <label
              htmlFor="el-pump"
              className="mb-2 block text-sm font-semibold !text-slate-700"
            >
              Tekan tangkai pompa
            </label>
            <input
              id="el-pump"
              type="range"
              min={0}
              max={0.85}
              step={0.01}
              value={pump}
              onChange={(e) => setPump(Number(e.target.value))}
              aria-label="Penekanan tangkai pompa"
            />
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-slate-200 bg-white p-3">
                <p className="text-[11px] font-bold uppercase tracking-wider !text-slate-500">
                  Volume udara
                </p>
                <p className="text-lg font-bold tabular-nums !text-cyan-700">
                  {(1 - pump).toFixed(2)}×
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3">
                <p className="text-[11px] font-bold uppercase tracking-wider !text-slate-500">
                  Tekanan udara
                </p>
                <p className="text-lg font-bold tabular-nums !text-amber-600">
                  {(1 / Math.max(0.15, 1 - pump)).toFixed(2)}×
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed !text-slate-700">
              {CASE_STUDIES[3].explanation}
            </p>
          </div>
        </div>
      </Card>

      {/* CASE 05 — Balon */}
      <Card className="p-5">
        <Pill tone="rose">{CASE_STUDIES[4].index}</Pill>
        <h2 className="mt-3 text-lg font-bold !text-slate-900">{CASE_STUDIES[4].title}</h2>
        <div className="mt-4 grid items-center gap-6 md:grid-cols-[auto_1fr]">
          <div className="mx-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
            <BalloonIllustration volume={balloonVolume} className="h-44 w-40" />
          </div>
          <div>
            <label
              htmlFor="el-balloon"
              className="mb-2 block text-sm font-semibold !text-slate-700"
            >
              Atur volume balon (jumlah udara tetap)
            </label>
            <input
              id="el-balloon"
              type="range"
              min={2}
              max={10}
              step={0.1}
              value={balloonVolume}
              onChange={(e) => setBalloonVolume(Number(e.target.value))}
              aria-label="Volume balon"
            />
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-slate-200 bg-white p-3">
                <p className="text-[11px] font-bold uppercase tracking-wider !text-slate-500">
                  Volume
                </p>
                <p className="text-lg font-bold tabular-nums !text-cyan-700">
                  {balloonVolume.toFixed(1)} L
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3">
                <p className="text-[11px] font-bold uppercase tracking-wider !text-slate-500">
                  Tekanan
                </p>
                <p className="text-lg font-bold tabular-nums !text-emerald-600">
                  {computePressure(balloonVolume, 50, 300).toFixed(2)} atm
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed !text-slate-700">
              {CASE_STUDIES[4].explanation}
            </p>
          </div>
        </div>
      </Card>

      <BoyleCalculator />

      {/* CER */}
      <Card className="p-5">
        <h2 className="flex items-center gap-2 text-lg font-bold !text-slate-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-100 to-sky-100 !text-cyan-700">
            <Microscope size={18} />
          </span>
          Bangun Penjelasan Ilmiah
        </h2>
        <p className="mt-1 text-sm !text-slate-600">
          Latih kemampuan berargumen seperti ilmuwan: Claim — Evidence — Reasoning.
        </p>

        <div className="mt-4 space-y-4">
          <TextArea
            id="cer-claim"
            label="CLAIM — Apa kesimpulanmu tentang hubungan volume dan tekanan gas?"
            value={state.cer.claim}
            onChange={(v) => setCer({ ...state.cer, claim: v })}
            placeholder="Contoh: Tekanan gas berbanding terbalik dengan volumenya…"
            rows={2}
          />
          <TextArea
            id="cer-evidence"
            label="EVIDENCE — Data mana yang mendukung kesimpulanmu?"
            value={state.cer.evidence}
            onChange={(v) => setCer({ ...state.cer, evidence: v })}
            placeholder="Contoh: Pada V = 5 L diperoleh P = 1 atm; pada V = 2,5 L diperoleh P = 2 atm…"
            rows={2}
          />
          <TextArea
            id="cer-reasoning"
            label="REASONING — Mengapa data tersebut mendukung kesimpulanmu?"
            value={state.cer.reasoning}
            onChange={(v) => setCer({ ...state.cer, reasoning: v })}
            placeholder="Contoh: Karena hasil kali P × V selalu sama, maka…"
            rows={2}
          />
        </div>

        {state.cer.claim && state.cer.evidence && state.cer.reasoning && (
          <Callout tone="success" className="mt-4">
            <span className="flex items-start gap-2">
              <Lightbulb size={16} className="mt-0.5 shrink-0" />
              Penjelasanmu sudah lengkap. Perhatikan bagaimana bukti (evidence) menghubungkan
              kesimpulan (claim) dengan alasan ilmiah (reasoning).
            </span>
          </Callout>
        )}
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm !text-slate-600">
          Siap jadi teknisi laboratorium? Coba Challenge berikut.
        </p>
        <Button
          onClick={() => {
            if (state.calculatorSolved) awardBadge('boyle');
            finish();
          }}
        >
          Lanjut ke Challenge <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}