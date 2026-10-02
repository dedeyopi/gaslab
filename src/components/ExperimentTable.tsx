import { Download, Trash2, X } from 'lucide-react';
import { Button, EmptyState } from './ui';
import type { ExperimentRow } from '../types';

interface Props {
  rows: ExperimentRow[];
  onRemove: (id: string) => void;
  onClearAll: () => void;
}

function toCsv(rows: ExperimentRow[]): string {
  const header = 'Percobaan,Volume (L),Tekanan (atm),P x V (atm.L),Partikel,Suhu (K)';
  const body = rows
    .map(
      (r, i) =>
        `${i + 1},${r.volume.toFixed(2)},${r.pressure.toFixed(3)},${r.pv.toFixed(3)},${r.particles},${r.temperature}`,
    )
    .join('\n');
  return `${header}\n${body}`;
}

export default function ExperimentTable({ rows, onRemove, onClearAll }: Props) {
  const exportCsv = () => {
    const blob = new Blob([toCsv(rows)], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gaslab-data-eksperimen.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-semibold text-slate-900">Catatan Hasil Eksperimen</h3>
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" size="sm" onClick={exportCsv} disabled={rows.length === 0}>
            <Download size={14} /> Export CSV
          </Button>
          <Button variant="ghost" size="sm" onClick={onClearAll} disabled={rows.length === 0}>
            <Trash2 size={14} /> Hapus Semua
          </Button>
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState>
          Belum ada data. Ubah volume pada simulasi lalu tekan <strong>“+ Catat Data”</strong>.
        </EmptyState>
      ) : (
        <div className="-mx-1 overflow-x-auto px-1">
          <table className="w-full min-w-[520px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="px-3 py-2 font-semibold">Percobaan</th>
                <th className="px-3 py-2 text-right font-semibold">Volume (L)</th>
                <th className="px-3 py-2 text-right font-semibold">Tekanan (atm)</th>
                <th className="px-3 py-2 text-right font-semibold">P × V (atm·L)</th>
                <th className="px-3 py-2 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr
                  key={r.id}
                  className="border-b border-slate-100 transition hover:bg-slate-50"
                >
                  <td className="px-3 py-2 tabular-nums text-slate-700">{i + 1}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-cyan-600 font-medium">
                    {r.volume.toFixed(2)}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums text-emerald-600 font-medium">
                    {r.pressure.toFixed(3)}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums text-amber-600 font-medium">
                    {r.pv.toFixed(3)}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => onRemove(r.id)}
                      aria-label={`Hapus percobaan ${i + 1}`}
                      className="rounded-md p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-500"
                    >
                      <X size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}