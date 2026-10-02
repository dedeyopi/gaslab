export interface Misconception {
  id: string;
  statement: string;
  verdict: 'Salah' | 'Benar';
  explanation: string;
}

export const MISCONCEPTIONS: Misconception[] = [
  {
    id: 'mc1',
    statement:
      'Jika volume gas diperkecil, tekanan turun karena partikel gas menjadi lebih sedikit.',
    verdict: 'Salah',
    explanation:
      'Jumlah partikel tidak otomatis berkurang. Wadah tertutup menahan jumlah partikel tetap. Yang berubah adalah ruang geraknya: ketika ruang mengecil, partikel lebih sering menumbuk dinding per satuan waktu, sehingga tekanan justru meningkat.',
  },
  {
    id: 'mc2',
    statement: 'Gas tidak memberikan tekanan karena gas sangat ringan.',
    verdict: 'Salah',
    explanation:
      'Ringan bukan berarti tidak memberikan gaya. Partikel gas bergerak terus-menerus dan menumbuk dinding wadah. Setiap tumbukan memberikan gaya kecil, dan miliaran tumbukan setiap detik menghasilkan tekanan yang dapat terukur.',
  },
  {
    id: 'mc3',
    statement: 'Tekanan gas hanya bergantung pada jumlah partikel saja.',
    verdict: 'Salah',
    explanation:
      'Tekanan gas dipengaruhi oleh jumlah partikel, volume ruang, dan suhu. Ketiganya adalah variabel yang berbeda. Pada Hukum Boyle, jumlah partikel dan suhu dijaga tetap, sehingga yang berpengaruh adalah volume.',
  },
  {
    id: 'mc4',
    statement:
      'Pada suhu tetap, jika volume gas diperbesar dua kali, tekanan menjadi dua kali lebih besar.',
    verdict: 'Salah',
    explanation:
      'Hubungan tekanan dan volume berbanding terbalik (P ∝ 1/V). Jika volume diperbesar dua kali, tekanan justru menjadi setengah kali dari nilai semula.',
  },
  {
    id: 'mc5',
    statement:
      'Partikel gas berhenti bergerak ketika gas sudah tenang di dalam wadah tertutup.',
    verdict: 'Salah',
    explanation:
      'Partikel gas selalu bergerak. "Tenang" hanya berarti tekanan rata-rata di seluruh dinding wadah sama, bukan berarti partikelnya berhenti. Gerak partikel berkaitan dengan suhu gas.',
  },
];