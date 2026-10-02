export type Difficulty = 'Mudah' | 'Sedang' | 'Sulit';

export type Category =
  | 'Konsep'
  | 'Analisis Data'
  | 'Grafik'
  | 'Aplikasi'
  | 'Perhitungan';

export interface MCQuestion {
  id: string;
  type: 'mc';
  category: Category;
  difficulty: Difficulty;
  prompt: string;
  options: { text: string; correct: boolean; feedback?: string }[];
}

export interface MCComplexQuestion {
  id: string;
  type: 'mc-complex';
  category: Category;
  difficulty: Difficulty;
  prompt: string;
  hint?: string;
  options: { text: string; correct: boolean; feedback?: string }[];
}

export interface MatchQuestion {
  id: string;
  type: 'match';
  category: Category;
  difficulty: Difficulty;
  prompt: string;
  left: { id: string; text: string }[];
  right: { id: string; text: string; matchesLeftId: string }[];
}

export interface ShortQuestion {
  id: string;
  type: 'short';
  category: Category;
  difficulty: Difficulty;
  prompt: string;
  acceptedAnswers: string[];
  hint?: string;
}

export interface OrderQuestion {
  id: string;
  type: 'order';
  category: Category;
  difficulty: Difficulty;
  prompt: string;
  items: { id: string; text: string }[];
  correctOrder: string[];
}

export interface ClassifyQuestion {
  id: string;
  type: 'classify';
  category: Category;
  difficulty: Difficulty;
  prompt: string;
  buckets: { id: string; label: string; tone: 'emerald' | 'rose' | 'cyan' | 'amber' | 'sky' }[];
  items: { id: string; text: string; bucketId: string }[];
}

export type QuizQuestion =
  | MCQuestion
  | MCComplexQuestion
  | MatchQuestion
  | ShortQuestion
  | OrderQuestion
  | ClassifyQuestion;

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  /* ======================= KONSEP (10 soal) ======================= */
  {
    id: 'q1',
    type: 'mc',
    category: 'Konsep',
    difficulty: 'Mudah',
    prompt: 'Gas tersusun atas partikel yang bergerak terus-menerus. Tekanan gas timbul karena …',
    options: [
      {
        text: 'Partikel gas saling tarik-menarik di dalam wadah',
        correct: false,
        feedback:
          'Gaya tarik-menarik antarpartikel bukan penyebab utama tekanan gas dalam model teori kinetik sederhana.',
      },
      { text: 'Partikel gas menumbuk dinding wadah', correct: true },
      {
        text: 'Gas memiliki massa yang sangat besar',
        correct: false,
        feedback:
          'Massa gas justru kecil. Yang penting bukan besar massanya, melainkan gerak dan tumbukan partikelnya.',
      },
      {
        text: 'Gas selalu memenuhi seluruh ruang yang tersedia',
        correct: false,
        feedback:
          'Gas memang memenuhi ruang, tetapi itu akibat dari gerak partikel. Penyebab tekanan adalah tumbukan pada dinding.',
      },
    ],
  },
  {
    id: 'q2',
    type: 'mc',
    category: 'Konsep',
    difficulty: 'Mudah',
    prompt:
      'Hubungan tekanan (P) dan volume (V) gas pada suhu tetap dan jumlah gas tetap adalah …',
    options: [
      {
        text: 'P berbanding lurus dengan V',
        correct: false,
        feedback: 'Kalau berbanding lurus, memperkecil volume akan memperkecil tekanan. Amati lagi simulasi: hasilnya justru sebaliknya.',
      },
      { text: 'P berbanding terbalik dengan V', correct: true },
      {
        text: 'P tidak berhubungan dengan V',
        correct: false,
        feedback: 'Data eksperimenmu menunjukkan perubahan volume selalu diikuti perubahan tekanan secara teratur.',
      },
      {
        text: 'P selalu bernilai 1 atm berapa pun volumenya',
        correct: false,
        feedback: 'Tekanan hanya 1 atm pada kondisi tertentu (V = 5 L dengan 50 partikel pada 300 K).',
      },
    ],
  },
  {
    id: 'q3',
    type: 'short',
    category: 'Konsep',
    difficulty: 'Mudah',
    prompt:
      'Hukum yang menyatakan bahwa pada suhu tetap P × V = konstan disebut Hukum ____.',
    acceptedAnswers: ['boyle', 'hukum boyle', 'robert boyle', 'hukum robert boyle'],
    hint: 'Nama ilmuwan Inggris abad ke-17.',
  },
  {
    id: 'q4',
    type: 'mc-complex',
    category: 'Konsep',
    difficulty: 'Sedang',
    prompt: 'Pilihlah SEMUA pernyataan yang BENAR tentang teori kinetik gas!',
    hint: 'Pilih lebih dari satu jawaban.',
    options: [
      { text: 'Partikel gas bergerak secara acak ke segala arah', correct: true },
      { text: 'Semakin tinggi suhu, semakin cepat gerak partikel', correct: true },
      {
        text: 'Partikel gas berhenti bergerak ketika wadah ditutup rapat',
        correct: false,
        feedback: 'Partikel gas terus bergerak. "Tenang" hanya berarti tekanannya merata, bukan berarti partikel berhenti.',
      },
      { text: 'Tekanan timbul dari tumbukan partikel terhadap dinding', correct: true },
      {
        text: 'Volume gas selalu sama di semua jenis wadah',
        correct: false,
        feedback: 'Volume gas bergantung pada besar ruang wadah yang ditempatinya.',
      },
    ],
  },
  {
    id: 'q5',
    type: 'mc',
    category: 'Konsep',
    difficulty: 'Sulit',
    prompt:
      'Sebuah gas berada dalam wadah dengan volume V. Jika volume diperkecil menjadi V/3 pada suhu tetap, tekanan gas menjadi …',
    options: [
      { text: 'Sepertiga kali dari semula', correct: false, feedback: 'Perhatikan arah hubungan: jika volume mengecil, tekanan justru membesar.' },
      { text: 'Tetap sama', correct: false, feedback: 'Tekanan tidak tetap ketika volume berubah pada suhu tetap.' },
      { text: 'Tiga kali dari semula', correct: true },
      { text: 'Sembilan kali dari semula', correct: false, feedback: 'Jika volume menjadi 1/3, maka tekanan menjadi 3× (bukan 3² = 9×).' },
    ],
  },
  {
    id: 'q6',
    type: 'short',
    category: 'Konsep',
    difficulty: 'Sedang',
    prompt:
      'Tuliskan persamaan Hukum Boyle dalam bentuk perbandingan dua keadaan (P₁, V₁, P₂, V₂). Format contoh: P1V1=P2V2',
    acceptedAnswers: ['p1v1=p2v2', 'p1 v1 = p2 v2', 'p1v1 = p2v2', 'p1.v1=p2.v2'],
    hint: 'Gunakan huruf kapital dan tanda sama dengan tanpa spasi.',
  },
  {
    id: 'q7',
    type: 'mc-complex',
    category: 'Konsep',
    difficulty: 'Sulit',
    prompt:
      'Faktor-faktor yang mempengaruhi tekanan gas dalam wadah tertutup adalah …',
    hint: 'Pilih SEMUA yang benar.',
    options: [
      { text: 'Jumlah partikel gas', correct: true },
      { text: 'Volume wadah', correct: true },
      { text: 'Suhu gas', correct: true },
      {
        text: 'Warna wadah',
        correct: false,
        feedback: 'Warna wadah tidak memengaruhi gerak atau tumbukan partikel gas.',
      },
      {
        text: 'Bentuk luar wadah (bulat / kotak)',
        correct: false,
        feedback: 'Yang penting adalah volume ruang, bukan bentuk luarnya.',
      },
    ],
  },
  {
    id: 'q8',
    type: 'match',
    category: 'Konsep',
    difficulty: 'Sedang',
    prompt: 'Jodohkan setiap istilah dengan pengertiannya yang tepat!',
    left: [
      { id: 'l1', text: 'Isotermal' },
      { id: 'l2', text: 'Tekanan' },
      { id: 'l3', text: 'Volume' },
      { id: 'l4', text: 'Suhu' },
    ],
    right: [
      { id: 'r1', text: 'Suhu tetap', matchesLeftId: 'l1' },
      { id: 'r2', text: 'Hasil tumbukan partikel pada dinding', matchesLeftId: 'l2' },
      { id: 'r3', text: 'Besar ruang yang ditempati gas', matchesLeftId: 'l3' },
      { id: 'r4', text: 'Ukuran energi kinetik rata-rata partikel', matchesLeftId: 'l4' },
    ],
  },
  {
    id: 'q9',
    type: 'mc',
    category: 'Konsep',
    difficulty: 'Sedang',
    prompt: '"Tekanan berbanding terbalik dengan volume" berarti …',
    options: [
      { text: 'Jika V naik, P juga naik', correct: false, feedback: 'Itu arti berbanding lurus, bukan terbalik.' },
      { text: 'Jika V naik, P turun', correct: true },
      { text: 'Jika V naik, P tetap', correct: false, feedback: 'P berubah ketika V berubah; hubungannya bukan tetap.' },
      { text: 'P dan V tidak berhubungan', correct: false, feedback: 'Mereka justru sangat berhubungan erat.' },
    ],
  },
  {
    id: 'q10',
    type: 'classify',
    category: 'Konsep',
    difficulty: 'Sulit',
    prompt:
      'Klasifikasikan setiap pernyataan ke kategori Benar atau Salah menurut Hukum Boyle!',
    buckets: [
      { id: 'benar', label: 'Benar', tone: 'emerald' },
      { id: 'salah', label: 'Salah', tone: 'rose' },
    ],
    items: [
      { id: 'c1', text: 'Pada suhu tetap, P × V = konstan', bucketId: 'benar' },
      { id: 'c2', text: 'Volume diperkecil, tekanan bertambah', bucketId: 'benar' },
      { id: 'c3', text: 'Partikel gas berhenti saat wadah ditutup', bucketId: 'salah' },
      { id: 'c4', text: 'Volume diperbesar, tekanan bertambah', bucketId: 'salah' },
      { id: 'c5', text: 'Jumlah partikel tetap saat wadah tertutup', bucketId: 'benar' },
      { id: 'c6', text: 'Tekanan gas tidak dipengaruhi volume', bucketId: 'salah' },
    ],
  },

  /* ===================== ANALISIS DATA (6 soal) ===================== */
  {
    id: 'q11',
    type: 'mc',
    category: 'Analisis Data',
    difficulty: 'Sedang',
    prompt:
      'Perhatikan data eksperimen pada suhu tetap berikut.\n\nV = 5 L → P = 2 atm\nV = 2,5 L → P = 4 atm\nV = 1 L → P = 10 atm\n\nNilai P × V pada ketiga data tersebut adalah …',
    options: [
      { text: 'Berubah-ubah, tidak ada pola', correct: false, feedback: 'Coba hitung satu per satu: 5×2, 2,5×4, dan 1×10. Bandingkan hasilnya.' },
      { text: 'Selalu 10 atm·L', correct: true },
      { text: 'Selalu 2 atm·L', correct: false, feedback: '2 atm·L hanya muncul di satu baris. Hitung ulang P × V untuk setiap baris.' },
      { text: 'Selalu 20 atm·L', correct: false, feedback: 'Perhatikan: V = 2,5 L dan P = 4 atm menghasilkan 10, bukan 20.' },
    ],
  },
  {
    id: 'q12',
    type: 'mc',
    category: 'Analisis Data',
    difficulty: 'Sulit',
    prompt:
      'Dari data pada soal sebelumnya (P × V = 10 atm·L), jika volume diubah menjadi 8 L pada suhu tetap, maka tekanan menjadi …',
    options: [
      { text: '0,5 atm', correct: false, feedback: 'Bagi 10 dengan 8 — hasilnya bukan 0,5.' },
      { text: '1,25 atm', correct: true },
      { text: '2 atm', correct: false, feedback: '2 atm adalah P pada V = 5 L. Karena V kini lebih besar, P harus lebih kecil.' },
      { text: '80 atm', correct: false, feedback: 'Kamu mungkin mengalikan. Gunakan P = (P₁V₁) / V₂.' },
    ],
  },
  {
    id: 'q13',
    type: 'short',
    category: 'Analisis Data',
    difficulty: 'Sulit',
    prompt:
      'Gas memiliki P₁ = 3 atm dan V₁ = 4 L. Jika volume diubah menjadi V₂ = 6 L pada suhu tetap, maka tekanan akhir P₂ = ____ atm. (tulis angka saja)',
    acceptedAnswers: ['2', '2,0', '2.0', '2 atm'],
    hint: 'Gunakan P₂ = (P₁ × V₁) / V₂.',
  },
  {
    id: 'q14',
    type: 'match',
    category: 'Analisis Data',
    difficulty: 'Sedang',
    prompt:
      'Jodohkan setiap volume dengan tekanan yang sesuai, jika P × V = 12 atm·L (suhu tetap)!',
    left: [
      { id: 'v1', text: 'V = 6 L' },
      { id: 'v2', text: 'V = 4 L' },
      { id: 'v3', text: 'V = 3 L' },
      { id: 'v4', text: 'V = 2 L' },
    ],
    right: [
      { id: 'p1', text: 'P = 6 atm', matchesLeftId: 'v4' },
      { id: 'p2', text: 'P = 4 atm', matchesLeftId: 'v3' },
      { id: 'p3', text: 'P = 3 atm', matchesLeftId: 'v2' },
      { id: 'p4', text: 'P = 2 atm', matchesLeftId: 'v1' },
    ],
  },
  {
    id: 'q15',
    type: 'mc',
    category: 'Analisis Data',
    difficulty: 'Sedang',
    prompt:
      'Gas dalam wadah tertutup memiliki V = 4 L dan P = 3 atm. Jika volume diperbesar menjadi 12 L (suhu tetap), tekanan menjadi …',
    options: [
      { text: '9 atm', correct: false, feedback: 'Volume bertambah, tekanan seharusnya berkurang — bukan bertambah.' },
      { text: '1 atm', correct: true },
      { text: '3 atm', correct: false, feedback: 'Hitung ulang: 4 × 3 = 12; 12 / 12 = ?' },
      { text: '0,33 atm', correct: false, feedback: 'Itu 4/12, bukan 12/12. Periksa lagi pembagiannya.' },
    ],
  },
  {
    id: 'q16',
    type: 'short',
    category: 'Analisis Data',
    difficulty: 'Sulit',
    prompt:
      'Pada suhu tetap, P × V = 20 atm·L. Jika tekanan gas 5 atm, maka volumenya ____ L. (tulis angka saja)',
    acceptedAnswers: ['4', '4,0', '4.0', '4 l', '4 liter'],
    hint: 'Gunakan V = (P × V) / P.',
  },

  /* ======================== GRAFIK (3 soal) ======================== */
  {
    id: 'q17',
    type: 'mc',
    category: 'Grafik',
    difficulty: 'Sedang',
    prompt:
      'Grafik tekanan (sumbu Y) terhadap volume (sumbu X) pada suhu tetap berbentuk kurva melengkung menurun dan tidak pernah menyentuh sumbu. Arti grafik tersebut adalah …',
    options: [
      { text: 'P dan V berbanding lurus', correct: false, feedback: 'Grafik berbanding lurus berupa garis lurus naik, bukan kurva melengkung menurun.' },
      { text: 'P dan V berbanding terbalik', correct: true },
      { text: 'P dan V tidak berhubungan', correct: false, feedback: 'Kalau tidak berhubungan, grafiknya akan berupa garis mendatar.' },
      { text: 'P selalu konstan pada semua volume', correct: false, feedback: 'Grafik menunjukkan P berubah ketika V berubah. Jadi P tidak konstan.' },
    ],
  },
  {
    id: 'q18',
    type: 'mc',
    category: 'Grafik',
    difficulty: 'Sedang',
    prompt: 'Grafik P vs (1/V) pada suhu tetap akan berbentuk …',
    options: [
      { text: 'Kurva melengkung menurun', correct: false, feedback: 'Kurva melengkung muncul di grafik P vs V. Untuk P vs 1/V, bentuknya berbeda.' },
      { text: 'Garis lurus melalui titik asal (0,0)', correct: true },
      { text: 'Garis mendatar', correct: false, feedback: 'Garis mendatar berarti P tidak dipengaruhi 1/V — padahal P berbanding lurus dengan 1/V.' },
      { text: 'Kurva naik lalu turun', correct: false, feedback: 'Hubungan P dengan 1/V bersifat linear positif, bukan kurva.' },
    ],
  },
  {
    id: 'q19',
    type: 'mc',
    category: 'Grafik',
    difficulty: 'Sulit',
    prompt:
      'Suatu titik pada grafik P–V menunjukkan P = 1,5 atm dan V = 4 L. Konstanta Boyle gas tersebut adalah 6 atm·L. Titik tersebut …',
    options: [
      { text: 'Tepat berada pada kurva isotermal', correct: true },
      { text: 'Berada di atas kurva isotermal', correct: false, feedback: 'Cek: 1,5 × 4 = 6 = k. Titik ini tepat pada kurva.' },
      { text: 'Berada di bawah kurva isotermal', correct: false, feedback: 'Cek: 1,5 × 4 = 6 = k. Titik ini tepat pada kurva.' },
      { text: 'Tidak dapat ditentukan dari data', correct: false, feedback: 'Kita bisa menentukan posisinya dengan membandingkan P × V terhadap k.' },
    ],
  },

  /* ======================= APLIKASI (5 soal) ======================= */
  {
    id: 'q20',
    type: 'mc',
    category: 'Aplikasi',
    difficulty: 'Mudah',
    prompt:
      'Mengapa kantong keripik yang tertutup rapat tampak mengembang ketika dibawa ke daerah pegunungan?',
    options: [
      { text: 'Karena jumlah partikel di dalam kantong bertambah', correct: false, feedback: 'Kantong tertutup rapat, sehingga tidak ada partikel yang masuk.' },
      { text: 'Karena tekanan udara luar menurun, sedangkan tekanan gas di dalam kantong relatif tetap', correct: true },
      { text: 'Karena suhu di pegunungan selalu lebih tinggi', correct: false, feedback: 'Suhu di pegunungan umumnya lebih rendah. Penyebab utamanya bukan suhu.' },
      { text: 'Karena gaya gravitasi di pegunungan lebih kecil', correct: false, feedback: 'Perbedaan gravitasi terlalu kecil untuk menjelaskan fenomena ini.' },
    ],
  },
  {
    id: 'q21',
    type: 'short',
    category: 'Aplikasi',
    difficulty: 'Sedang',
    prompt:
      'Saat menarik napas, diafragma berkontraksi sehingga volume rongga dada ____, tekanan udara di dalam paru menurun, dan udara masuk. (isi dengan: membesar / mengecil)',
    acceptedAnswers: ['membesar', 'bertambah', 'naik', 'besar'],
    hint: 'Pikirkan: agar udara masuk, tekanan harus lebih kecil dari luar.',
  },
  {
    id: 'q22',
    type: 'mc-complex',
    category: 'Aplikasi',
    difficulty: 'Sedang',
    prompt:
      'Pilihlah SEMUA fenomena sehari-hari yang menerapkan prinsip Hukum Boyle!',
    hint: 'Pilih lebih dari satu jawaban.',
    options: [
      { text: 'Pompa sepeda saat memompa ban', correct: true },
      { text: 'Balon udara yang naik ke atas', correct: true },
      { text: 'Proses pernapasan manusia', correct: true },
      { text: 'Pembakaran kertas oleh api', correct: false, feedback: 'Itu reaksi kimia, bukan penerapan hubungan P–V gas.' },
      { text: 'Es yang mencair pada suhu ruang', correct: false, feedback: 'Itu perubahan wujud zat (fisika kalor), bukan Hukum Boyle.' },
    ],
  },
  {
    id: 'q23',
    type: 'mc',
    category: 'Aplikasi',
    difficulty: 'Sulit',
    prompt:
      'Seorang penyelam turun ke kedalaman tertentu. Jika tidak ada kompensasi tekanan, yang terjadi pada volume udara di paru-parunya adalah …',
    options: [
      { text: 'Membesar karena tekanan air menurun', correct: false, feedback: 'Semakin dalam, tekanan air justru meningkat, bukan menurun.' },
      { text: 'Mengecil karena tekanan air meningkat', correct: true },
      { text: 'Tetap karena udara tidak terpengaruh tekanan', correct: false, feedback: 'Udara sangat dipengaruhi tekanan (itulah inti Hukum Boyle).' },
      { text: 'Tidak dapat ditentukan', correct: false, feedback: 'Kita bisa menentukannya dari Hukum Boyle: P naik, V turun.' },
    ],
  },
  {
    id: 'q24',
    type: 'order',
    category: 'Aplikasi',
    difficulty: 'Sedang',
    prompt:
      'Urutkan langkah-langkah yang terjadi pada pompa sepeda ketika tangkai ditekan, dari awal hingga udara masuk ke ban!',
    items: [
      { id: 's1', text: 'Tangkai pompa mulai ditekan ke bawah' },
      { id: 's2', text: 'Volume udara di dalam tabung pompa mengecil' },
      { id: 's3', text: 'Tekanan udara di dalam pompa meningkat' },
      { id: 's4', text: 'Udara melewati katup dan masuk ke dalam ban' },
    ],
    correctOrder: ['s1', 's2', 's3', 's4'],
  },

  /* ===================== PERHITUNGAN (1 soal) ===================== */
  {
    id: 'q25',
    type: 'short',
    category: 'Perhitungan',
    difficulty: 'Sedang',
    prompt:
      'Gas memiliki P₁ = 2 atm dan V₁ = 3 L. Jika V₂ = 1,5 L (suhu tetap), maka P₂ = ____ atm. (tulis angka saja, boleh desimal dengan titik)',
    acceptedAnswers: ['4', '4,0', '4.0', '4 atm'],
    hint: 'P₂ = (2 × 3) / 1,5.',
  },
];

/* ==================================================================== */

export const PREDICTION_OPTIONS = [
  { id: 'A', text: 'Tekanan semakin kecil' },
  { id: 'B', text: 'Tekanan semakin besar' },
  { id: 'C', text: 'Tekanan tetap' },
  { id: 'D', text: 'Tidak dapat diprediksi' },
];

export const ANALYSIS_QUESTIONS = [
  { id: 'a1', prompt: 'Apa yang terjadi pada tekanan ketika volume diperkecil?' },
  { id: 'a2', prompt: 'Apakah tekanan dan volume berubah dengan arah yang sama? Jelaskan.' },
  { id: 'a3', prompt: 'Bagaimana nilai P × V pada data yang kamu kumpulkan?' },
  { id: 'a4', prompt: 'Apa pola yang kamu temukan dari data tersebut?' },
];