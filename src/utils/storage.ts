import type { GasLabState } from '../types';

const STORAGE_KEY = 'gaslabState';

export const initialState: GasLabState = {
  student: null,
  progress: {
    engage: false,
    explore: false,
    explain: false,
    elaborate: false,
    evaluate: false,
  },
  prediction: null,
  experiments: [],
  badges: [],
  challengeScore: 0,
  quiz: { answers: [], score: 0, completed: false },
  reflections: { learned: '', evidence: '', misconception: '', daily: '' },
  cer: { claim: '', evidence: '', reasoning: '' },
  analysisAnswers: {},
  calculatorSolved: false,
  analysisDone: false,
  reduceMotion: false,
  lastVisitedSection: 'dashboard',
};

/* Fallback in-memory bila localStorage tidak tersedia (mode privat, dsb.) */
let memoryState: GasLabState | null = null;
let storageAvailable = true;

function checkStorage(): boolean {
  try {
    const t = '__gaslab_test__';
    window.localStorage.setItem(t, '1');
    window.localStorage.removeItem(t);
    return true;
  } catch {
    return false;
  }
}

if (typeof window !== 'undefined') {
  storageAvailable = checkStorage();
}

export function isStorageAvailable(): boolean {
  return storageAvailable;
}

export function saveState(state: GasLabState): void {
  if (!storageAvailable) {
    memoryState = state;
    return;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    memoryState = state;
  }
}

export function loadState(): GasLabState {
  if (!storageAvailable) {
    return memoryState ?? initialState;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as Partial<GasLabState>;
    return {
      ...initialState,
      ...parsed,
      student: parsed.student ?? null,
      progress: { ...initialState.progress, ...(parsed.progress ?? {}) },
      quiz: { ...initialState.quiz, ...(parsed.quiz ?? {}) },
      reflections: { ...initialState.reflections, ...(parsed.reflections ?? {}) },
      cer: { ...initialState.cer, ...(parsed.cer ?? {}) },
      experiments: parsed.experiments ?? [],
      badges: parsed.badges ?? [],
      analysisAnswers: parsed.analysisAnswers ?? {},
    };
  } catch {
    return initialState;
  }
}

export function clearState(): void {
  memoryState = null;
  if (!storageAvailable) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* diabaikan */
  }
}