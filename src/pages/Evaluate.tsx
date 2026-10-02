import { useEffect, useMemo, useState } from 'react';
import {
  Award,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Flame,
  GripVertical,
  Info,
  Link2,
  MoveRight,
  RefreshCw,
  Send,
  Sparkles,
  Trash2,
  X,
  XCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGasLab } from '../state/GasLabContext';
import {
  Button,
  Callout,
  Card,
  Pill,
  ProgressBar,
  SectionTitle,
  TextArea,
} from '../components/ui';
import BadgeGrid from '../components/BadgeGrid';
import {
  QUIZ_QUESTIONS,
  type ClassifyQuestion,
  type Difficulty,
  type MatchQuestion,
  type MCComplexQuestion,
  type MCQuestion,
  type OrderQuestion,
  type QuizQuestion,
  type ShortQuestion,
} from '../data/questions';
import {
  bandForScore,
  prepareQuestions,
  scoreAnswer,
  type ScoredResult,
} from '../utils/scoring';

/* ============================ Tipe Jawaban ============================ */
type AnswerValue =
  | { type: 'mc'; chosenIndex: number }
  | { type: 'mc-complex'; chosenIndices: number[] }
  | { type: 'match'; pairs: Record<string, string> }
  | { type: 'short'; text: string }
  | { type: 'order'; orderedIds: string[] }
  | { type: 'classify'; placements: Record<string, string> };

/* ======================== Konfigurasi Difficulty ====================== */
const DIFF_STYLES: Record<Difficulty, string> = {
  Mudah: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Sedang: 'border-amber-200 bg-amber-50 text-amber-700',
  Sulit: 'border-rose-200 bg-rose-50 text-rose-700',
};

/* ================================= PAGE ================================ */
export default function Evaluate() {
  const { state, setQuiz, updateProgress, awardBadge, setReflections } = useGasLab();

  const [questions, setQuestions] = useState<QuizQuestion[]>(() => prepareQuestions(QUIZ_QUESTIONS));
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(AnswerValue | null)[]>(() =>
    Array(QUIZ_QUESTIONS.length).fill(null),
  );
  const [finished, setFinished] = useState(
    state.quiz.completed && state.quiz.answers.length === QUIZ_QUESTIONS.length,
  );
  const [reflectionDraft, setReflectionDraft] = useState(state.reflections);

  useEffect(() => {
    if (!finished) return;
    if (state.quiz.score >= 80) {
      confetti({ particleCount: 180, spread: 95, origin: { y: 0.6 } });
    }
  }, [finished, state.quiz.score]);

  const q = questions[current];
  const answeredCount = answers.filter(Boolean).length;

  const scoredResults = useMemo<ScoredResult[]>(
    () => questions.map((qq, i) => scoreAnswer(qq, answers[i])),
    [questions, answers],
  );

  const liveScore = useMemo(() => {
    if (questions.length === 0) return 0;
    const sum = scoredResults.reduce((s, r) => s + r.partial, 0);
    return Math.round((sum / questions.length) * 100);
  }, [scoredResults, questions.length]);

  const setAnswer = (value: AnswerValue) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[current] = value;
      return next;
    });
  };

  const next = () => setCurrent((c) => Math.min(c + 1, questions.length - 1));
  const prev = () => setCurrent((c) => Math.max(c - 1, 0));

  const submit = () => {
    const finalAnswers = questions.map((qq, i) => {
      const r = scoreAnswer(qq, answers[i]);
      return {
        questionId: qq.id,
        userAnswer: answers[i],
        correct: r.correct,
        partialScore: r.partial,
      };
    });
    const totalPartial = finalAnswers.reduce((s, a) => s + a.partialScore, 0);
    const finalScore = Math.round((totalPartial / questions.length) * 100);
    setQuiz({ answers: finalAnswers, score: finalScore, completed: true });
    setFinished(true);
    updateProgress('evaluate', true);
    if (finalScore >= 70) awardBadge('gaslab');
  };

  const restart = () => {
    setQuestions(prepareQuestions(QUIZ_QUESTIONS));
    setAnswers(Array(QUIZ_QUESTIONS.length).fill(null));
    setCurrent(0);
    setFinished(false);
    setQuiz({ answers: [], score: 0, completed: false });
  };

  /* ============================ HASIL ============================ */
  if (finished) {
    return (
      <ResultView
        questions={questions}
        answers={answers}
        score={state.quiz.score}
        onRestart={restart}
        reflectionDraft={reflectionDraft}
        setReflectionDraft={(v) => {
          setReflectionDraft(v);
          setReflections(v);
        }}
      />
    );
  }

  /* ============================== KUIS ============================== */
  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="Evaluate"
        icon={<Award size={20} />}
        title="Uji Pemahaman — 25 Soal"
        subtitle="Soal dan pilihan jawaban diacak setiap kali kamu memulai. Ada PG, PG Kompleks, Menjodohkan, Isian Singkat, Urutan, dan Klasifikasi."
      />

      {/* Progress bar + nomor */}
      <Card className="p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone="cyan">
              Soal {current + 1} dari {questions.length}
            </Pill>
            <Pill tone="neutral">{q.category}</Pill>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${DIFF_STYLES[q.difficulty]}`}
            >
              {q.difficulty === 'Sulit' && <Flame size={12} />}
              {q.difficulty}
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-500">
            Terjawab: {answeredCount}/{questions.length}
          </p>
        </div>
        <ProgressBar value={(answeredCount / questions.length) * 100} />
        <p className="mt-2 text-xs text-slate-500">
          Skor berjalan: <span className="font-bold text-cyan-600">{liveScore}</span>/100
        </p>
      </Card>

      {/* Nomor navigasi */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-1.5">
          {questions.map((qq, i) => {
            const done = answers[i] != null;
            const isCurrent = i === current;
            return (
              <button
                key={qq.id}
                type="button"
                onClick={() => setCurrent(i)}
                aria-label={`Ke soal ${i + 1}`}
                className={[
                  'flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition',
                  isCurrent
                    ? 'bg-gradient-to-br from-cyan-500 to-cyan-600 text-white shadow ring-2 ring-cyan-300'
                    : done
                      ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200',
                ].join(' ')}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Soal */}
      <Card className="p-5 sm:p-6">
        <p className="whitespace-pre-line text-base font-semibold leading-relaxed text-slate-900">
          {q.prompt}
        </p>

        {(q.type === 'mc-complex') && (
          <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-amber-700">
            <Info size={13} /> {q.hint ?? 'Pilih semua jawaban yang benar.'}
          </p>
        )}
        {(q.type === 'match' || q.type === 'order' || q.type === 'classify') && (
          <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-cyan-700">
            <Info size={13} />
            {q.type === 'match' && 'Pasangkan item kiri dengan item kanan.'}
            {q.type === 'order' && 'Susun urutan dengan mengklik item.'}
            {q.type === 'classify' && 'Klasifikasikan setiap item ke kategori.'}
          </p>
        )}

        <div className="mt-5">
          {q.type === 'mc' && (
            <MCView q={q} value={answers[current]} onChange={setAnswer} />
          )}
          {q.type === 'mc-complex' && (
            <MCComplexView q={q} value={answers[current]} onChange={setAnswer} />
          )}
          {q.type === 'match' && (
            <MatchView q={q} value={answers[current]} onChange={setAnswer} />
          )}
          {q.type === 'short' && (
            <ShortView q={q} value={answers[current]} onChange={setAnswer} />
          )}
          {q.type === 'order' && (
            <OrderView q={q} value={answers[current]} onChange={setAnswer} />
          )}
          {q.type === 'classify' && (
            <ClassifyView q={q} value={answers[current]} onChange={setAnswer} />
          )}
        </div>
      </Card>

      {/* Navigasi */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" onClick={prev} disabled={current === 0}>
          <ChevronLeft size={16} /> Sebelumnya
        </Button>

        {current < questions.length - 1 ? (
          <Button onClick={next}>
            Berikutnya <ChevronRight size={16} />
          </Button>
        ) : (
          <Button
            variant="success"
            onClick={submit}
            disabled={answeredCount < questions.length}
          >
            <Send size={15} /> Kumpulkan Jawaban
          </Button>
        )}
      </div>

      {answeredCount < questions.length && current === questions.length - 1 && (
        <Callout tone="warn">
          Masih ada {questions.length - answeredCount} soal yang belum dijawab. Gunakan tombol “Sebelumnya” atau klik nomor soal di panel atas.
        </Callout>
      )}
    </div>
  );
}

/* ====================================================================
 *                        SUB-COMPONENTS PER TYPE
 * ==================================================================== */

/* --------------------------------- MC ------------------------------- */
function MCView({
  q,
  value,
  onChange,
}: {
  q: MCQuestion;
  value: AnswerValue | null;
  onChange: (v: AnswerValue) => void;
}) {
  const chosen = value?.type === 'mc' ? value.chosenIndex : -1;
  return (
    <div className="space-y-2">
      {q.options.map((o, i) => {
        const selected = chosen === i;
        return (
          <button
            key={i}
            type="button"
            onClick={() => onChange({ type: 'mc', chosenIndex: i })}
            className={[
              'flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition',
              selected
                ? 'border-cyan-400 bg-gradient-to-br from-cyan-50 to-cyan-100 text-slate-900 shadow-sm'
                : 'border-slate-200 bg-white text-slate-700 hover:border-cyan-300 hover:bg-cyan-50/40',
            ].join(' ')}
          >
            <span
              className={[
                'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                selected
                  ? 'bg-gradient-to-br from-cyan-500 to-cyan-600 text-white'
                  : 'bg-slate-100 text-slate-600',
              ].join(' ')}
            >
              {String.fromCharCode(65 + i)}
            </span>
            <span className="flex-1">{o.text}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------ MC Complex ------------------------------ */
function MCComplexView({
  q,
  value,
  onChange,
}: {
  q: MCComplexQuestion;
  value: AnswerValue | null;
  onChange: (v: AnswerValue) => void;
}) {
  const set = new Set(value?.type === 'mc-complex' ? value.chosenIndices : []);

  const toggle = (i: number) => {
    const next = new Set(set);
    if (next.has(i)) next.delete(i);
    else next.add(i);
    onChange({ type: 'mc-complex', chosenIndices: Array.from(next) });
  };

  return (
    <div className="space-y-2">
      {q.options.map((o, i) => {
        const selected = set.has(i);
        return (
          <button
            key={i}
            type="button"
            onClick={() => toggle(i)}
            className={[
              'flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition',
              selected
                ? 'border-emerald-400 bg-gradient-to-br from-emerald-50 to-emerald-100 text-slate-900 shadow-sm'
                : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/40',
            ].join(' ')}
          >
            <span
              className={[
                'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition',
                selected
                  ? 'border-emerald-500 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white'
                  : 'border-slate-300 bg-white',
              ].join(' ')}
            >
              {selected && <Check size={14} strokeWidth={3} />}
            </span>
            <span className="flex-1">{o.text}</span>
          </button>
        );
      })}
      <p className="mt-2 text-xs font-semibold text-slate-500">
        Terpilih: {set.size} jawaban
      </p>
    </div>
  );
}

/* -------------------------------- Match -------------------------------- */
function MatchView({
  q,
  value,
  onChange,
}: {
  q: MatchQuestion;
  value: AnswerValue | null;
  onChange: (v: AnswerValue) => void;
}) {
  const pairs: Record<string, string> = value?.type === 'match' ? value.pairs : {};
  const [activeLeft, setActiveLeft] = useState<string | null>(null);

  const usedRightIds = new Set(Object.values(pairs));

  const pickLeft = (leftId: string) => {
    if (pairs[leftId]) {
      const next = { ...pairs };
      delete next[leftId];
      onChange({ type: 'match', pairs: next });
      setActiveLeft(null);
      return;
    }
    setActiveLeft(activeLeft === leftId ? null : leftId);
  };

  const pickRight = (rightId: string) => {
    if (!activeLeft) return;
    const next: Record<string, string> = {};
    for (const [k, v] of Object.entries(pairs)) {
      if (v !== rightId) next[k] = v;
    }
    next[activeLeft] = rightId;
    onChange({ type: 'match', pairs: next });
    setActiveLeft(null);
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          Istilah
        </p>
        <div className="space-y-2">
          {q.left.map((l) => {
            const pairedRightId = pairs[l.id];
            const pairedRight = pairedRightId
              ? q.right.find((r) => r.id === pairedRightId)
              : null;
            const active = activeLeft === l.id;
            return (
              <button
                key={l.id}
                type="button"
                onClick={() => pickLeft(l.id)}
                className={[
                  'w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors',
                  active
                    ? 'border-cyan-400 bg-gradient-to-br from-cyan-50 to-cyan-100 shadow-md ring-2 ring-cyan-300'
                    : pairedRight
                      ? 'border-emerald-300 bg-emerald-50 text-slate-900'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-cyan-300 hover:bg-cyan-50/40',
                ].join(' ')}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold">{l.text}</span>
                  {pairedRight && <Link2 size={14} className="shrink-0 text-emerald-600" />}
                </div>
                {pairedRight && (
                  <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                    <MoveRight size={12} /> {pairedRight.text}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          Pilihan
        </p>
        <div className="space-y-2">
          {q.right.map((r) => {
            const used = usedRightIds.has(r.id);
            const canPick = !!activeLeft && !used;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => pickRight(r.id)}
                disabled={used}
                className={[
                  'w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors',
                  used
                    ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400'
                    : canPick
                      ? 'border-cyan-400 bg-cyan-50 text-slate-800 shadow-[0_0_0_3px_rgba(34,211,238,0.25)] hover:border-cyan-500 hover:bg-cyan-100'
                      : 'border-slate-200 bg-white text-slate-700',
                ].join(' ')}
              >
                {r.text}
              </button>
            );
          })}
        </div>
      </div>

      {activeLeft && (
        <p className="sm:col-span-2 text-xs font-semibold text-cyan-700">
          Pilih pasangan yang sesuai dari kolom kanan.
        </p>
      )}
    </div>
  );
}

/* --------------------------------- Short -------------------------------- */
function ShortView({
  q,
  value,
  onChange,
}: {
  q: ShortQuestion;
  value: AnswerValue | null;
  onChange: (v: AnswerValue) => void;
}) {
  const text = value?.type === 'short' ? value.text : '';
  return (
    <div>
      <input
        type="text"
        value={text}
        placeholder="Tulis jawabanmu di sini…"
        onChange={(e) => onChange({ type: 'short', text: e.target.value })}
        className="w-full rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-base font-medium text-slate-900 placeholder:font-normal placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
      />
      {q.hint && (
        <p className="mt-2 text-xs italic text-slate-500">Petunjuk: {q.hint}</p>
      )}
    </div>
  );
}

/* --------------------------------- Order -------------------------------- */
function OrderView({
  q,
  value,
  onChange,
}: {
  q: OrderQuestion;
  value: AnswerValue | null;
  onChange: (v: AnswerValue) => void;
}) {
  const ordered = value?.type === 'order' ? value.orderedIds : [];
  const pool = q.items.filter((it) => !ordered.includes(it.id));

  const addToEnd = (id: string) => {
    onChange({ type: 'order', orderedIds: [...ordered, id] });
  };

  const removeFromOrder = (id: string) => {
    onChange({ type: 'order', orderedIds: ordered.filter((x) => x !== id) });
  };

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const next = [...ordered];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    onChange({ type: 'order', orderedIds: next });
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          Pilihan langkah
        </p>
        <div className="space-y-2">
          {pool.length === 0 && (
            <p className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-xs text-slate-500">
              Semua langkah sudah disusun. Klik langkah di kolom kanan untuk mengembalikan.
            </p>
          )}
          {pool.map((it) => (
            <button
              key={it.id}
              type="button"
              onClick={() => addToEnd(it.id)}
              className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50/40"
            >
              <GripVertical size={16} className="shrink-0 text-slate-400" />
              {it.text}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          Urutanmu
        </p>
        <div className="space-y-2">
          {ordered.length === 0 && (
            <p className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-xs text-slate-500">
              Klik langkah di kolom kiri untuk menyusun urutan.
            </p>
          )}
          {ordered.map((id, i) => {
            const it = q.items.find((x) => x.id === id)!;
            return (
              <div
                key={id}
                className="flex items-center gap-3 rounded-xl border border-cyan-200 bg-gradient-to-br from-cyan-50 to-white px-3 py-2.5"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span className="flex-1 text-sm font-medium text-slate-800">{it.text}</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => moveUp(i)}
                    disabled={i === 0}
                    className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-30"
                    aria-label="Naikkan"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFromOrder(id)}
                    className="rounded p-1 text-rose-500 hover:bg-rose-50"
                    aria-label="Hapus"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- Classify ------------------------------- */
function ClassifyView({
  q,
  value,
  onChange,
}: {
  q: ClassifyQuestion;
  value: AnswerValue | null;
  onChange: (v: AnswerValue) => void;
}) {
  const placements: Record<string, string> = value?.type === 'classify' ? value.placements : {};
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const pool = q.items.filter((it) => !placements[it.id]);

  const pickItem = (id: string) => {
    setActiveItem(activeItem === id ? null : id);
  };

  const removeItem = (id: string) => {
    const next = { ...placements };
    delete next[id];
    onChange({ type: 'classify', placements: next });
  };

  const placeInBucket = (bucketId: string) => {
    if (!activeItem) return;
    onChange({
      type: 'classify',
      placements: { ...placements, [activeItem]: bucketId },
    });
    setActiveItem(null);
  };

  const toneClass = (tone: string) => {
    switch (tone) {
      case 'emerald': return 'border-emerald-300 bg-emerald-50 text-emerald-800';
      case 'rose': return 'border-rose-300 bg-rose-50 text-rose-800';
      case 'cyan': return 'border-cyan-300 bg-cyan-50 text-cyan-800';
      case 'amber': return 'border-amber-300 bg-amber-50 text-amber-800';
      case 'sky': return 'border-sky-300 bg-sky-50 text-sky-800';
      default: return 'border-slate-300 bg-slate-50 text-slate-800';
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          Klik item, lalu klik kategori tujuan
        </p>
        <div className="flex flex-wrap gap-2">
          {pool.length === 0 && (
            <p className="w-full rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-center text-xs text-slate-500">
              Semua item sudah diklasifikasikan.
            </p>
          )}
          {pool.map((it) => {
            const active = activeItem === it.id;
            return (
              <button
                key={it.id}
                type="button"
                onClick={() => pickItem(it.id)}
                className={[
                  'rounded-xl border-2 px-3 py-2 text-left text-xs font-semibold transition-colors',
                  active
                    ? 'border-cyan-400 bg-cyan-100 text-cyan-900 ring-2 ring-cyan-300'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-cyan-300 hover:bg-cyan-50/40',
                ].join(' ')}
              >
                {it.text}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {q.buckets.map((b) => {
          const items = q.items.filter((it) => placements[it.id] === b.id);
          const canDrop = !!activeItem;
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => placeInBucket(b.id)}
              disabled={!canDrop}
              className={[
                'min-h-[110px] rounded-2xl border-2 border-dashed px-4 py-3 text-left transition-colors',
                toneClass(b.tone),
                canDrop
                  ? 'cursor-pointer ring-2 ring-cyan-300/60 hover:shadow-md'
                  : 'cursor-default',
              ].join(' ')}
            >
              <p className="text-xs font-bold uppercase tracking-wider">{b.label}</p>
              <div className="mt-2 space-y-1.5">
                {items.map((it) => (
                  <div
                    key={it.id}
                    className="flex items-center gap-2 rounded-lg bg-white/80 px-2 py-1.5 text-xs font-medium text-slate-800"
                  >
                    <span className="flex-1">{it.text}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeItem(it.id);
                      }}
                      className="rounded p-0.5 text-rose-500 hover:bg-rose-100"
                      aria-label="Keluarkan"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                {items.length === 0 && (
                  <p className="text-[11px] italic opacity-60">Belum ada item.</p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ============================ RESULT VIEW ============================ */
function ResultView({
  questions,
  answers,
  score,
  onRestart,
  reflectionDraft,
  setReflectionDraft,
}: {
  questions: QuizQuestion[];
  answers: (AnswerValue | null)[];
  score: number;
  onRestart: () => void;
  reflectionDraft: {
    learned: string;
    evidence: string;
    misconception: string;
    daily: string;
  };
  setReflectionDraft: (v: typeof reflectionDraft) => void;
}) {
  const band = bandForScore(score);
  const results = questions.map((q, i) => ({ q, r: scoreAnswer(q, answers[i]), a: answers[i] }));
  const wrong = results.filter((x) => !x.r.correct);

  // Breakdown per kategori
  const byCategory = useMemo(() => {
    const map = new Map<string, { total: number; ok: number; partial: number }>();
    for (const { q, r } of results) {
      const cur = map.get(q.category) ?? { total: 0, ok: 0, partial: 0 };
      cur.total++;
      if (r.correct) cur.ok++;
      cur.partial += r.partial;
      map.set(q.category, cur);
    }
    return Array.from(map.entries());
  }, [results]);

  return (
    <div className="space-y-8">
      <SectionTitle
        eyebrow="Evaluate"
        icon={<Award size={20} />}
        title="Hasil Evaluasi"
        subtitle="Ini bukan akhir — ini titik awal untuk memperdalam pemahamanmu."
      />

      <Card className="p-6 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
          Skor Kamu
        </p>
        <p className="mt-2 text-6xl font-bold tabular-nums text-slate-900">{score}</p>
        <p className="mt-1 text-sm text-slate-500">dari 100</p>
        <div className="mx-auto mt-4 max-w-md">
          <ProgressBar value={score} />
        </div>
        <Pill
          tone={
            band.tone === 'amber' ? 'amber' : band.tone === 'emerald' ? 'emerald' : 'cyan'
          }
          className="mt-4"
        >
          {band.label}
        </Pill>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-700">
          {band.message}
        </p>
      </Card>

      {/* Breakdown per kategori */}
      <Card className="p-5">
        <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
          <BarChart3 size={17} className="text-cyan-600" /> Rincian per Kategori
        </h2>
        <div className="mt-4 space-y-3">
          {byCategory.map(([cat, s]) => {
            const pct = Math.round((s.partial / s.total) * 100);
            return (
              <div key={cat}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-700">{cat}</span>
                  <span className="tabular-nums text-slate-500">
                    {s.ok}/{s.total} benar ({pct}%)
                  </span>
                </div>
                <ProgressBar value={pct} />
              </div>
            );
          })}
        </div>
      </Card>

      {/* Feedback per soal yang salah */}
      {wrong.length > 0 && (
        <Card className="p-5">
          <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
            <Sparkles size={17} className="text-amber-500" /> Umpan Balik Diagnostik
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Pelajari kembali bagian ini untuk memperbaiki pemahamanmu.
          </p>
          <ul className="mt-4 space-y-3">
            {wrong.map(({ q, a }) => (
              <li
                key={q.id}
                className="rounded-xl border border-amber-200 bg-amber-50 p-4"
              >
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Pill tone="neutral">{q.category}</Pill>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${DIFF_STYLES[q.difficulty]}`}
                  >
                    {q.difficulty}
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-800">{q.prompt}</p>
                <UserAnswerPreview q={q} a={a} />
                <CorrectAnswerPreview q={q} />
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Refleksi */}
      <Card className="p-5">
        <h2 className="text-base font-bold text-slate-900">Refleksi Peneliti</h2>
        <p className="mt-1 text-sm text-slate-600">
          Jawab dengan bahasamu sendiri. Refleksi ini tersimpan di perangkatmu.
        </p>
        <div className="mt-4 space-y-4">
          {(
            [
              ['learned', 'Hal terpenting yang saya pelajari adalah…'],
              ['evidence', 'Bukti dari eksperimen yang mendukung pemahaman saya adalah…'],
              ['misconception', 'Miskonsepsi yang berhasil saya ubah adalah…'],
              ['daily', 'Fenomena kehidupan sehari-hari yang sekarang dapat saya jelaskan adalah…'],
            ] as const
          ).map(([key, label]) => (
            <TextArea
              key={key}
              id={`refl-${key}`}
              label={label}
              value={reflectionDraft[key]}
              onChange={(v) => setReflectionDraft({ ...reflectionDraft, [key]: v })}
              placeholder="Tuliskan refleksimu…"
              rows={2}
            />
          ))}
        </div>
      </Card>

      {/* Badge */}
      <Card className="p-5">
        <h2 className="text-base font-bold text-slate-900">Badge Kamu</h2>
        <div className="mt-3">
          <BadgeGrid />
        </div>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button variant="ghost" onClick={onRestart}>
          <RefreshCw size={15} /> Ulangi Kuis
        </Button>
      </div>
    </div>
  );
}

/* --------------------- Preview jawaban pengguna ------------------------ */
function UserAnswerPreview({ q, a }: { q: QuizQuestion; a: AnswerValue | null }) {
  if (!a) return <p className="mt-2 text-xs italic text-slate-500">Tidak dijawab.</p>;

  const wrap = (text: string, ok: boolean) => (
    <p
      className={`mt-2 text-xs ${
        ok ? 'text-emerald-700' : 'text-rose-700'
      }`}
    >
      Jawabanmu: <span className="font-semibold">{text}</span>{' '}
      {ok ? <CheckCircle2 size={12} className="inline text-emerald-600" /> : <XCircle size={12} className="inline text-rose-600" />}
    </p>
  );

  switch (q.type) {
    case 'mc':
      if (a.type !== 'mc') return null;
      return wrap(q.options[a.chosenIndex]?.text ?? '—', q.options[a.chosenIndex]?.correct === true);
    case 'mc-complex':
      if (a.type !== 'mc-complex') return null;
      return wrap(
        a.chosenIndices.map((i) => q.options[i]?.text).filter(Boolean).join('; ') || '—',
        false,
      );
    case 'match':
      if (a.type !== 'match') return null;
      return wrap(
        Object.entries(a.pairs)
          .map(([l, r]) => {
            const lt = q.left.find((x) => x.id === l)?.text;
            const rt = q.right.find((x) => x.id === r)?.text;
            return `${lt} → ${rt}`;
          })
          .join(' · ') || '—',
        false,
      );
    case 'short':
      if (a.type !== 'short') return null;
      return wrap(a.text || '—', false);
    case 'order':
      if (a.type !== 'order') return null;
      return wrap(
        a.orderedIds
          .map((id) => q.items.find((x) => x.id === id)?.text)
          .filter(Boolean)
          .join(' → ') || '—',
        false,
      );
    case 'classify':
      if (a.type !== 'classify') return null;
      return wrap(
        Object.entries(a.placements)
          .map(([id, b]) => {
            const it = q.items.find((x) => x.id === id)?.text;
            const bk = q.buckets.find((x) => x.id === b)?.label;
            return `${it} → ${bk}`;
          })
          .join(' · ') || '—',
        false,
      );
  }
}

function CorrectAnswerPreview({ q }: { q: QuizQuestion }) {
  let text = '';
  switch (q.type) {
    case 'mc':
      text = q.options.find((o) => o.correct)?.text ?? '—';
      break;
    case 'mc-complex':
      text = q.options.filter((o) => o.correct).map((o) => o.text).join('; ');
      break;
    case 'match':
      text = q.left
        .map((l) => {
          const r = q.right.find((x) => x.matchesLeftId === l.id)?.text;
          return `${l.text} → ${r}`;
        })
        .join(' · ');
      break;
    case 'short':
      text = q.acceptedAnswers[0];
      break;
    case 'order':
      text = q.correctOrder
        .map((id) => q.items.find((x) => x.id === id)?.text)
        .filter(Boolean)
        .join(' → ');
      break;
    case 'classify':
      text = q.items
        .map((it) => {
          const bucket = q.buckets.find((b) => b.id === it.bucketId)?.label;
          return `${it.text} → ${bucket}`;
        })
        .join(' · ');
      break;
  }
  return (
    <p className="mt-1.5 text-xs text-emerald-700">
      Jawaban benar: <span className="font-semibold">{text}</span>
    </p>
  );
}