export interface CaseStudy {
  id: string;
  index: string;
  title: string;
  question: string;
  explanation: string;
  note?: string;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'syringe',
    index: '01',
    title: 'Jarum Suntik',
    question:
      'Mengapa piston terasa lebih sulit ditekan ketika ujung suntikan ditutup?',
    explanation:
      'Ketika ujung suntikan ditutup, jumlah partikel udara di dalamnya tetap. Menekan piston berarti memperkecil volume. Ruang gerak partikel mengecil, sehingga partikel lebih sering menumbuk dinding dan piston. Tekanan udara di dalam meningkat dan mendorong piston kembali ke atas — itulah sebabnya terasa makin sulit ditekan.',
  },
  {
    id: 'lungs',
    index: '02',
    title: 'Paru-Paru',
    question:
      'Bagaimana udara bisa masuk dan keluar dari paru-paru kita?',
    explanation:
      'Saat menarik napas, diafragma dan otot rusuk bekerja sehingga volume rongga dada bertambah. Volume bertambah → tekanan udara di dalam paru-paru menurun → udara dari luar yang tekanannya lebih tinggi masuk. Saat mengembuskan napas, volume rongga dada mengecil → tekanan di dalam meningkat → udara terdorong keluar.',
    note:
      'Model ini merupakan penyederhanaan untuk memahami hubungan volume dan tekanan, bukan penjelasan medis lengkap.',
  },
  {
    id: 'diver',
    index: '03',
    title: 'Penyelam',
    question:
      'Mengapa penyelam perlu memperhatikan tekanan saat menyelam semakin dalam?',
    explanation:
      'Semakin dalam, semakin banyak air di atas penyelam, sehingga tekanan lingkungan meningkat. Udara di dalam tubuh dan peralatan menyelam mengalami perubahan volume ketika tekanan berubah. Karena itu penyelam harus mengatur pernapasan dan naik secara perlahan.',
    note:
      'Penjelasan ini bersifat pengantar konsep, bukan panduan medis atau panduan penyelaman.',
  },
  {
    id: 'pump',
    index: '04',
    title: 'Pompa Sepeda',
    question:
      'Bagaimana pompa dapat mendorong udara masuk ke dalam ban?',
    explanation:
      'Ketika tangkai pompa ditekan, volume udara di dalam tabung pompa mengecil. Tekanan udara di dalam pompa meningkat melebihi tekanan di dalam ban. Perbedaan tekanan inilah yang mendorong udara masuk ke dalam ban melalui katup.',
  },
  {
    id: 'balloon',
    index: '05',
    title: 'Balon',
    question:
      'Apa yang terjadi pada tekanan udara di dalam balon ketika volumenya diperkecil?',
    explanation:
      'Jika balon diperkecil pada jumlah udara dan suhu yang tetap, volume mengecil sehingga tekanan udara di dalam balon meningkat. Itulah sebabnya balon yang diperas terlalu kuat bisa meletus — tekanan di dalamnya melampaui kekuatan bahan balon.',
  },
];