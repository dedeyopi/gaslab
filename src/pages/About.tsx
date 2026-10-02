import {
  Award,
  Info,
  RotateCcw,
  UserCog,
  BadgeCheck,
  Building2,
  FlaskConical,
  Sparkles,
} from 'lucide-react';
import { Button, Callout, Card, Pill, SectionTitle, Toggle } from '../components/ui';
import { useGasLab } from '../state/GasLabContext';
import { isStorageAvailable } from '../utils/storage';
import dedeYopiPhoto from '../assets/dede-yopi.jpeg';

function DeveloperCard() {
  return (
    <Card className="overflow-hidden p-0">
      <div className="relative border-b border-slate-100 bg-gradient-to-br from-cyan-50 via-sky-50 to-emerald-50 px-6 py-5">
        <Pill tone="cyan">
          <Award size={12} /> Penulis Naskah &amp; Pengembang MPI
        </Pill>
      </div>

      <div className="grid gap-6 p-6 sm:grid-cols-[200px_1fr]">
        <div className="mx-auto sm:mx-0">
          <div className="relative">
            <div className="overflow-hidden rounded-2xl border-2 border-cyan-200 bg-gradient-to-br from-cyan-50 to-emerald-50 shadow-lg">
              <img
                src={dedeYopiPhoto}
                alt="Foto Dede Yopi, M.Pd."
                className="aspect-[3/4] w-full object-cover"
              />
            </div>
            <span
              className="absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-900 shadow-lg"
              title="Terverifikasi"
            >
              <BadgeCheck size={18} />
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Dede Yopi, M.Pd.</h2>

          <ul className="mt-4 space-y-2.5 text-sm">
            <li className="flex items-center gap-2.5 text-slate-700">
              <Building2 size={16} className="shrink-0 text-cyan-600" />
              <span>SMP Negeri 49 Jakarta</span>
            </li>
            <li className="flex items-center gap-2.5 text-slate-700">
              <FlaskConical size={16} className="shrink-0 text-emerald-600" />
              <span>Guru IPA · Fase D</span>
            </li>
            <li className="flex items-center gap-2.5 text-slate-700">
              <Sparkles size={16} className="shrink-0 text-amber-500" />
              <span>Pengembang Media Pembelajaran Interaktif</span>
            </li>
          </ul>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full border border-sky-200 bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-800">
              IPA Terpadu
            </span>
            <span className="rounded-full border border-cyan-200 bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-800">
              MPI Interaktif
            </span>
            <span className="rounded-full border border-amber-200 bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
              Pembelajaran Berbasis Inkuiri
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 px-6 py-5">
        <div className="rounded-xl border-l-4 border-cyan-400 bg-slate-50 px-4 py-3">
          <p className="text-sm italic leading-relaxed text-slate-700">
            “Media ini dikembangkan untuk membantu siswa memahami konsep IPA melalui eksplorasi,
            simulasi, analisis data, dan penerapan dalam kehidupan sehari-hari.”
          </p>
        </div>
      </div>
    </Card>
  );
}

export default function About({
  onReset,
  onChangeStudent,
}: {
  onReset: () => void;
  onChangeStudent: () => void;
}) {
  const { state, setReduceMotion } = useGasLab();

  return (
    <div className="space-y-8">
      <SectionTitle
        eyebrow="Tentang"
        icon={<Info size={20} />}
        title="Tentang GASLAB"
        subtitle="Virtual Laboratory untuk materi Tekanan pada Gas."
      />

      <DeveloperCard />

      <Card className="p-6">
        <h2 className="mb-4 text-base font-bold text-slate-900">Informasi Aplikasi</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {[
            ['Pengembang', 'Dede Yopi, M.Pd.'],
            ['Profesi', 'Guru IPA / Pengembang Media Pembelajaran Digital'],
            ['Sasaran', 'SMP / Fase D — Kelas IX'],
            ['Materi', 'Tekanan pada Gas'],
            ['Pendekatan', '5E + Guided Inquiry'],
            ['Versi', '1.0.0'],
          ].map(([k, v]) => (
            <div key={k}>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{k}</p>
              <p className="mt-1 text-sm text-slate-800">{v}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-base font-bold text-slate-900">Pengaturan</h2>

        <div className="mt-4 space-y-4">
          <Toggle
            id="reduce-motion"
            checked={state.reduceMotion}
            onChange={setReduceMotion}
            label="Reduce Motion"
            description="Kurangi animasi agar lebih nyaman dan hemat daya."
          />

          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={onChangeStudent}>
              <UserCog size={15} /> Ganti Siswa
            </Button>
            <Button variant="danger" onClick={onReset}>
              <RotateCcw size={15} /> Reset Progress
            </Button>
          </div>
        </div>

        {!isStorageAvailable() && (
          <Callout tone="warn" className="mt-4">
            Browser ini tidak mengizinkan penyimpanan lokal. Progres hanya akan bertahan selama
            sesi berlangsung.
          </Callout>
        )}
      </Card>

      <Card className="p-6">
        <h2 className="text-base font-bold text-slate-900">Catatan Ilmiah</h2>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-700">
          <p>
            <Pill tone="cyan">Model</Pill> Simulasi pada GASLAB menggunakan pendekatan gas ideal
            sederhana. Tujuannya adalah memperlihatkan <strong>pola</strong> hubungan tekanan dan
            volume, bukan mereplikasi pengukuran laboratorium presisi.
          </p>
          <p>
            <Pill tone="emerald">Hukum Boyle</Pill> Pada jumlah gas tetap dan suhu tetap, tekanan
            gas berbanding terbalik dengan volumenya: <strong>P × V = konstan</strong> atau{' '}
            <strong>P₁V₁ = P₂V₂</strong>.
          </p>
          <p>
            <Pill tone="amber">Variabel</Pill> Dalam eksperimen utama, volume adalah variabel
            bebas, tekanan adalah variabel terikat, sedangkan suhu dan jumlah partikel dijaga
            tetap.
          </p>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-base font-bold text-slate-900">Penyimpanan Data</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          Seluruh data (nama, kelas, progres, data eksperimen, jawaban kuis, badge, dan refleksi)
          disimpan di{' '}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-cyan-700">
            localStorage
          </code>{' '}
          perangkatmu dengan kunci{' '}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-cyan-700">
            gaslabState
          </code>
          . Tidak ada data yang dikirim ke server.
        </p>
      </Card>
    </div>
  );
}