import type { QuizQuestion } from '../data/questions';

export interface ScoreBand {
  min: number;
  label: string;
  message: string;
  tone: 'emerald' | 'cyan' | 'sky' | 'amber';
}

export const SCORE_BANDS: ScoreBand[] = [
  {
    min: 90,
    label: 'Pemahaman sangat kuat',
    message:
      'Kamu mampu menghubungkan konsep, data, dan penerapan dengan sangat baik. Pertahankan!',
    tone: 'emerald',
  },
  {
    min: 80,
    label: 'Pemahaman baik',
    message:
      'Pemahamanmu sudah kuat. Tinjau kembali bagian yang masih terasa sulit agar makin mantap.',
    tone: 'cyan',
  },
  {
    min: 70,
    label: 'Pemahaman berkembang',
    message:
      'Kamu sudah menemukan pola dasarnya. Coba ulangi eksperimen dan amati grafik sekali lagi.',
    tone: 'sky',
  },
  {
    min: 0,
    label: 'Perlu eksplorasi kembali',
    message:
      'Tidak masalah! Kembali ke Lab Virtual, ubah volume, catat data, lalu amati apa yang terjadi.',
    tone: 'amber',
  },
];

export function bandForScore(score: number): ScoreBand {
  return SCORE_BANDS.find((b) => score >= b.min) ?? SCORE_BANDS[SCORE_BANDS.length - 1];
}

/** Fisher–Yates shuffle (menghasilkan array baru). */
export function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ==================== Penilaian per Tipe Soal ==================== */

export interface ScoredResult {
  correct: boolean;
  partial: number; // 0..1
}

function normalizeText(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[.,!?]/g, '.')
    .replace(/\s+/g, ' ')
    .replace(/\.$/, '');
}

export function scoreAnswer(
  q: QuizQuestion,
  answer: any,
): ScoredResult {
  if (answer == null) return { correct: false, partial: 0 };

  switch (q.type) {
    case 'mc': {
      const idx = answer.chosenIndex;
      const ok = q.options[idx]?.correct === true;
      return { correct: ok, partial: ok ? 1 : 0 };
    }

    case 'mc-complex': {
      const chosen: number[] = answer.chosenIndices ?? [];
      const totalCorrect = q.options.filter((o) => o.correct).length;
      if (totalCorrect === 0) return { correct: false, partial: 0 };
      const set = new Set(chosen);
      let hits = 0;
      let wrongs = 0;
      q.options.forEach((o, i) => {
        if (set.has(i)) {
          if (o.correct) hits++;
          else wrongs++;
        }
      });
      const raw = (hits - wrongs) / totalCorrect;
      const partial = Math.max(0, Math.min(1, raw));
      const correct = hits === totalCorrect && wrongs === 0;
      return { correct, partial };
    }

    case 'match': {
      const pairs: Record<string, string> = answer.pairs ?? {};
      const total = q.left.length;
      if (total === 0) return { correct: false, partial: 0 };
      let ok = 0;
      for (const left of q.left) {
        const rightId = pairs[left.id];
        const rightItem = q.right.find((r) => r.id === rightId);
        if (rightItem && rightItem.matchesLeftId === left.id) ok++;
      }
      return { correct: ok === total, partial: ok / total };
    }

    case 'short': {
      const text = normalizeText(String(answer.text ?? ''));
      if (!text) return { correct: false, partial: 0 };
      const accepted = q.acceptedAnswers.map(normalizeText);
      const ok = accepted.includes(text);
      return { correct: ok, partial: ok ? 1 : 0 };
    }

    case 'order': {
      const order: string[] = answer.orderedIds ?? [];
      const total = q.correctOrder.length;
      if (total === 0) return { correct: false, partial: 0 };
      let ok = 0;
      for (let i = 0; i < total; i++) {
        if (order[i] === q.correctOrder[i]) ok++;
      }
      return { correct: ok === total, partial: ok / total };
    }

    case 'classify': {
      const placements: Record<string, string> = answer.placements ?? {};
      const total = q.items.length;
      if (total === 0) return { correct: false, partial: 0 };
      let ok = 0;
      for (const item of q.items) {
        if (placements[item.id] === item.bucketId) ok++;
      }
      return { correct: ok === total, partial: ok / total };
    }
  }
}

/** Siapkan soal dengan urutan yang diacak (pertanyaan, opsi, dan pasangan). */
export function prepareQuestions(qs: QuizQuestion[]): QuizQuestion[] {
  return shuffle(qs).map((q) => {
    switch (q.type) {
      case 'mc':
      case 'mc-complex':
        return { ...q, options: shuffle(q.options) };
      case 'match':
        return { ...q, right: shuffle(q.right) };
      case 'order':
        return { ...q, items: shuffle(q.items) };
      case 'classify':
        return { ...q, items: shuffle(q.items) };
      case 'short':
        return q;
    }
  });
}