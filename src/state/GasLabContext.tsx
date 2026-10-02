import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type {
  CerState,
  ExperimentRow,
  GasLabState,
  Progress,
  QuizState,
  Reflections,
  Student,
} from '../types';
import { clearState, initialState, loadState, saveState } from '../utils/storage';

interface GasLabContextValue {
  state: GasLabState;
  progressPercent: number;
  completedStages: number;
  setStudent: (student: Student) => void;
  updateProgress: (key: keyof Progress, value: boolean) => void;
  setPrediction: (value: string) => void;
  addExperiment: (row: Omit<ExperimentRow, 'id' | 'time'>) => void;
  removeExperiment: (id: string) => void;
  clearExperiments: () => void;
  awardBadge: (id: string) => void;
  setChallengeScore: (score: number) => void;
  setQuiz: (quiz: QuizState) => void;
  setReflections: (reflections: Reflections) => void;
  setCer: (cer: CerState) => void;
  setAnalysisAnswer: (id: string, value: string) => void;
  markAnalysisDone: () => void;
  markCalculatorSolved: () => void;
  setReduceMotion: (value: boolean) => void;
  setLastVisitedSection: (section: string) => void;
  reset: () => void;
}

const GasLabContext = createContext<GasLabContextValue | null>(null);

const STAGE_WEIGHTS: Record<keyof Progress, number> = {
  engage: 15,
  explore: 25,
  explain: 20,
  elaborate: 20,
  evaluate: 20,
};

export function GasLabProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GasLabState>(() => loadState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    const root = document.documentElement;
    if (state.reduceMotion) root.classList.add('reduce-motion');
    else root.classList.remove('reduce-motion');
  }, [state.reduceMotion]);

  const setStudent = useCallback((student: Student) => {
    setState((s) => ({ ...s, student }));
  }, []);

  const updateProgress = useCallback((key: keyof Progress, value: boolean) => {
    setState((s) => ({ ...s, progress: { ...s.progress, [key]: value } }));
  }, []);

  const setPrediction = useCallback((value: string) => {
    setState((s) => ({ ...s, prediction: value }));
  }, []);

  const addExperiment = useCallback((row: Omit<ExperimentRow, 'id' | 'time'>) => {
    setState((s) => ({
      ...s,
      experiments: [
        ...s.experiments,
        {
          ...row,
          id: `exp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          time: Date.now(),
        },
      ],
    }));
  }, []);

  const removeExperiment = useCallback((id: string) => {
    setState((s) => ({ ...s, experiments: s.experiments.filter((e) => e.id !== id) }));
  }, []);

  const clearExperiments = useCallback(() => {
    setState((s) => ({ ...s, experiments: [] }));
  }, []);

  const awardBadge = useCallback((id: string) => {
    setState((s) => (s.badges.includes(id) ? s : { ...s, badges: [...s.badges, id] }));
  }, []);

  const setChallengeScore = useCallback((score: number) => {
    setState((s) => ({ ...s, challengeScore: Math.max(s.challengeScore, score) }));
  }, []);

  const setQuiz = useCallback((quiz: QuizState) => {
    setState((s) => ({ ...s, quiz }));
  }, []);

  const setReflections = useCallback((reflections: Reflections) => {
    setState((s) => ({ ...s, reflections }));
  }, []);

  const setCer = useCallback((cer: CerState) => {
    setState((s) => ({ ...s, cer }));
  }, []);

  const setAnalysisAnswer = useCallback((id: string, value: string) => {
    setState((s) => ({
      ...s,
      analysisAnswers: { ...s.analysisAnswers, [id]: value },
    }));
  }, []);

  const markAnalysisDone = useCallback(() => {
    setState((s) => ({ ...s, analysisDone: true }));
  }, []);

  const markCalculatorSolved = useCallback(() => {
    setState((s) => ({ ...s, calculatorSolved: true }));
  }, []);

  const setReduceMotion = useCallback((value: boolean) => {
    setState((s) => ({ ...s, reduceMotion: value }));
  }, []);

  const setLastVisitedSection = useCallback((section: string) => {
    setState((s) => ({ ...s, lastVisitedSection: section }));
  }, []);

  const reset = useCallback(() => {
    clearState();
    setState({ ...initialState });
  }, []);

  const { progressPercent, completedStages } = useMemo(() => {
    let percent = 0;
    let count = 0;
    (Object.keys(STAGE_WEIGHTS) as (keyof Progress)[]).forEach((key) => {
      if (state.progress[key]) {
        percent += STAGE_WEIGHTS[key];
        count += 1;
      }
    });
    return { progressPercent: percent, completedStages: count };
  }, [state.progress]);

  const value: GasLabContextValue = {
    state,
    progressPercent,
    completedStages,
    setStudent,
    updateProgress,
    setPrediction,
    addExperiment,
    removeExperiment,
    clearExperiments,
    awardBadge,
    setChallengeScore,
    setQuiz,
    setReflections,
    setCer,
    setAnalysisAnswer,
    markAnalysisDone,
    markCalculatorSolved,
    setReduceMotion,
    setLastVisitedSection,
    reset,
  };

  return <GasLabContext.Provider value={value}>{children}</GasLabContext.Provider>;
}

export function useGasLab(): GasLabContextValue {
  const ctx = useContext(GasLabContext);
  if (!ctx) throw new Error('useGasLab harus digunakan di dalam <GasLabProvider>.');
  return ctx;
}