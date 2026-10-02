export interface Student {
  name: string;
  className: string;
}

export interface Progress {
  engage: boolean;
  explore: boolean;
  explain: boolean;
  elaborate: boolean;
  evaluate: boolean;
}

export interface ExperimentRow {
  id: string;
  volume: number;
  pressure: number;
  pv: number;
  particles: number;
  temperature: number;
  time: number;
}

export interface QuizAnswer {
  questionId: string;
  userAnswer: unknown;
  correct: boolean;
  partialScore: number;
}

export interface QuizState {
  answers: QuizAnswer[];
  score: number;
  completed: boolean;
}

export interface Reflections {
  learned: string;
  evidence: string;
  misconception: string;
  daily: string;
}

export interface CerState {
  claim: string;
  evidence: string;
  reasoning: string;
}

export interface GasLabState {
  student: Student | null;
  progress: Progress;
  prediction: string | null;
  experiments: ExperimentRow[];
  badges: string[];
  challengeScore: number;
  quiz: QuizState;
  reflections: Reflections;
  cer: CerState;
  analysisAnswers: Record<string, string>;
  calculatorSolved: boolean;
  analysisDone: boolean;
  reduceMotion: boolean;
  lastVisitedSection: string;
}

export type SectionId =
  | 'dashboard'
  | 'engage'
  | 'explore'
  | 'explain'
  | 'elaborate'
  | 'challenge'
  | 'evaluate'
  | 'certificate'
  | 'about';