import { useState } from 'react';
import { Calculator, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button, Callout, Card } from './ui';
import { useGasLab } from '../state/GasLabContext';

interface Fields {
  p1: string;
  v1: string;
  v2: string;
}

export default function BoyleCalculator() {
  const { markCalculatorSolved } = useGasLab();
  const [f, setF] = useState<Fields>({ p1: '1', v1: '5', v2: '2.5' });
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const parse = (s: string) => {
    const n = Number(s.replace(',', '.'));
    return Number.isFinite(n) ? n : NaN;
  };

  const compute = () => {
    const p1 = parse(f.p1);
    const v1 = parse(f.v1);
    const v2 = parse(f.v2);

    if ([p1, v1, v2].some((n) => Number.isNaN(n))) {
      setError('Masukkan angka yang valid pada semua kolom.');
      setResult(null);
      return;
    }
    if (p1 <= 0 || v1 <= 0) {
      setError('Tekanan dan volume awal harus lebih besar dari nol.');
      setResult(null);
      return;
    }
    if (v2 <= 0) {
      setError('Volume akhir (V₂) harus lebih besar dari nol.');
      setResult(null);
      return;
    }

    setError(null);
    const p2 = (p1 * v1) / v2;
    setResult(p2);
    markCalculatorSolved();
  };

  const reset = () => {
    setF({ p1: '', v1: '', v2: '' });
    setResult(null);
    setError(null);
  };

  const p1 = parse(f.p1);
  const v1 = parse(f.v1);
  const v2 = parse(f.v2);

  return (
    <Card className="p-5">
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 !text-white shadow-[0_8px_20px_-8px_rgba(6,182,212,0.65)]">
          <Calculator size={22} />
        </span>
        <h3 className="text-xl font-bold !text-slate-900">Boyle Calculator</h3>
      </div>

      {/* Input group */}
      <div className="grid gap-4 sm:grid-cols-3">
        {(
          [
            ['p1', 'P₁ (atm)', 'Tekanan awal'],
            ['v1', 'V₁ (L)', 'Volume awal'],
            ['v2', 'V₂ (L)', 'Volume akhir'],
          ] as const
        ).map(([key, label, hint]) => (
          <div key={key}>
            <label
              htmlFor={`bc-${key}`}
              className="mb-2 block text-sm font-bold !text-cyan-700"
            >
              {label}
            </label>
            <input
              id={`bc-${key}`}
              type="text"
              inputMode="decimal"
              value={f[key]}
              placeholder={hint}
              onChange={(e) => setF({ ...f, [key]: e.target.value })}
              className="w-full rounded-xl border-2 !border-slate-300 !bg-white px-4 py-3 text-base font-semibold tabular-nums !text-slate-900 placeholder:font-normal placeholder:!text-slate-400 focus:!border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/25"
            />
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-5 flex flex-wrap gap-2">
        <Button onClick={compute}>
          <Calculator size={15} /> Hitung P₂
        </Button>
        <Button variant="secondary" onClick={reset}>
          Kosongkan
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4">
          <Callout tone="danger" title="Periksa input">
            <span className="flex items-start gap-2">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              {error}
            </span>
          </Callout>
        </div>
      )}

      {/* Result */}
      {result !== null && !error && (
        <div className="mt-5 space-y-4">
          <div className="rounded-2xl border-2 !border-cyan-200 !bg-gradient-to-br !from-cyan-50 !via-sky-50 !to-emerald-50 p-5">
            <p className="text-xs font-bold uppercase tracking-wider !text-cyan-700">
              Langkah Penyelesaian
            </p>

            <div className="mt-3 space-y-2 font-mono text-sm">
              <p className="!text-slate-900">P₁ × V₁ = P₂ × V₂</p>
              <p className="!text-slate-900">P₂ = (P₁ × V₁) / V₂</p>
              <p className="!text-cyan-700">
                P₂ = ({Number.isFinite(p1) ? p1 : 0} × {Number.isFinite(v1) ? v1 : 0}) /{' '}
                {Number.isFinite(v2) ? v2 : 0}
              </p>
              <p className="pt-2 text-2xl font-bold !text-emerald-700">
                P₂ = {result.toFixed(3)} atm
              </p>
            </div>
          </div>

          <Callout tone="success">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} className="shrink-0" />
              <span>
                Ketika volume akhir <strong>lebih kecil</strong> dari volume awal, tekanan akhir
                menjadi <strong>lebih besar</strong>.
              </span>
            </span>
          </Callout>
        </div>
      )}
    </Card>
  );
}