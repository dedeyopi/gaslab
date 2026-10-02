import { useState } from 'react';
import { FlaskConical, GraduationCap, LogIn, User } from 'lucide-react';
import { Button, Callout, Card } from './ui';
import { useGasLab } from '../state/GasLabContext';

const CLASSES = ['IX A', 'IX B', 'IX C', 'IX D', 'IX E', 'IX F', 'IX G', 'IX H', 'IX I'];

export default function StudentOnboarding() {
  const { setStudent } = useGasLab();
  const [name, setName] = useState('');
  const [kelas, setKelas] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    if (!name.trim()) {
      setError('Nama lengkap tidak boleh kosong.');
      return;
    }
    if (!kelas) {
      setError('Silakan pilih kelas terlebih dahulu.');
      return;
    }
    setError(null);
    setStudent({ name: name.trim(), className: kelas });
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-lg overflow-hidden p-0 animate-fadeUp">
        <div className="relative border-b border-slate-100 bg-gradient-to-br from-cyan-100 via-sky-50 to-emerald-100 px-6 py-8 text-center">
          <span className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 text-white shadow-[0_10px_30px_-10px_rgba(6,182,212,0.8)]">
            <FlaskConical size={30} />
          </span>
          <h1 className="text-2xl font-bold text-slate-900">Selamat Datang di GASLAB</h1>
          <p className="mt-2 text-sm text-slate-600">
            Sebelum memulai eksperimen, kenali dulu peneliti kita.
          </p>
        </div>

        <div className="space-y-4 p-6">
          <div>
            <label
              htmlFor="student-name"
              className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700"
            >
              <User size={15} className="text-cyan-600" /> Nama Lengkap
            </label>
            <input
              id="student-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama lengkap"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>

          <div>
            <label
              htmlFor="student-class"
              className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700"
            >
              <GraduationCap size={15} className="text-cyan-600" /> Kelas
            </label>
            <select
              id="student-class"
              value={kelas}
              onChange={(e) => setKelas(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
            >
              <option value="">— Pilih kelas —</option>
              {CLASSES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {error && <Callout tone="danger">{error}</Callout>}

          <Button onClick={submit} size="lg" className="w-full">
            <LogIn size={17} /> Masuk ke Laboratorium
          </Button>

          <p className="text-center text-xs text-slate-500">
            Data hanya disimpan di perangkatmu (localStorage). Tidak dikirim ke server.
          </p>
        </div>
      </Card>
    </div>
  );
}