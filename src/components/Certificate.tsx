import { Award, Printer } from 'lucide-react';
import { Button } from './ui';
import { useGasLab } from '../state/GasLabContext';
import { bandForScore } from '../utils/scoring';

export default function Certificate() {
  const { state } = useGasLab();
  const student = state.student;
  const band = bandForScore(state.quiz.score);

  const today = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div>
      <div className="no-print mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Sertifikat Kompetensi</h1>
          <p className="mt-1 text-sm text-slate-400">
            Cetak atau simpan sertifikatmu sebagai bukti penyelesaian modul.
          </p>
        </div>
        <Button onClick={() => window.print()}>
          <Printer size={16} /> Cetak Sertifikat
        </Button>
      </div>

      <div
        id="certificate-print"
        className="rounded-xl border border-slate-700/60 bg-white p-6 text-slate-900 shadow-2xl sm:p-10"
      >
        <div className="rounded-lg border-[3px] border-double border-cyan-700/50 p-6 sm:p-9">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border-2 border-cyan-700/60 text-cyan-800">
              <Award size={26} />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-cyan-800">
              Sertifikat Kompetensi
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              LAB VIRTUAL TEKANAN PADA GAS
            </h2>
            <div className="mx-auto mt-4 h-px w-40 bg-cyan-800/40" />
          </div>

          <p className="mt-6 text-center text-sm text-slate-600">Diberikan kepada</p>
          <p className="mt-1 text-center text-3xl font-bold tracking-tight text-cyan-900 sm:text-4xl">
            {student?.name ?? '—'}
          </p>
          <p className="mt-2 text-center text-sm text-slate-600">
            Kelas <span className="font-semibold text-slate-800">{student?.className ?? '—'}</span>
          </p>

          <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed text-slate-700">
            Telah menyelesaikan modul eksplorasi <strong>Tekanan pada Gas</strong> dan{' '}
            <strong>Hukum Boyle</strong> dengan Nilai{' '}
            <span className="font-bold text-cyan-900">{state.quiz.score}/100</span> —{' '}
            <em>{band.label}</em>.
          </p>

          <div className="mt-8 flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-end">
            <div className="text-center sm:text-left">
              <p className="text-xs text-slate-500">Tanggal</p>
              <p className="text-sm font-semibold text-slate-800">{today}</p>
            </div>

            <div className="text-center">
              <p className="mb-1 text-[11px] uppercase tracking-widest text-slate-500">
                Pengembang
              </p>
              <p
                className="text-2xl text-cyan-900"
                style={{ fontFamily: '"Segoe Script", "Brush Script MT", cursive' }}
              >
                Dede Yopi, M.Pd.
              </p>
              <div className="mx-auto mt-1 h-px w-44 bg-slate-400" />
              <p className="mt-1 text-xs font-semibold text-slate-700">Dede Yopi, M.Pd.</p>
              <p className="text-[11px] text-slate-500">
                Guru IPA / Pengembang Media Pembelajaran Digital
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}