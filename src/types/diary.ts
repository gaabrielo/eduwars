export type DiaryDayStatus =
  | 'NAO_INICIADA'
  | 'AULA_ASSISTIDA'
  | 'DESAFIO_CONCLUIDO';

export type DiaryBattleOutcome = 'VICTORY' | 'DEFEAT';

export interface DiaryConceptMiss {
  conceptId: string;
  misses: number;
}

export interface DiaryAttempt {
  /** Lesson day the attempt belongs to. */
  day: number;
  outcome: DiaryBattleOutcome;
  correctCount: number;
  answeredCount: number;
  questionTotal: number;
  /** Knowledge ("lives") lost during the attempt. */
  knowledgeLost: number;
  /** Concept ids of the questions answered incorrectly, in answer order. */
  missedConceptIds: string[];
}

export interface DiaryDayRecord {
  /** Attempt number within the day, starting at 1. */
  number: number;
  outcome: DiaryBattleOutcome;
  correctCount: number;
  answeredCount: number;
  questionTotal: number;
  knowledgeLost: number;
  savedAt: string;
}

export interface DiaryDayEntry {
  day: number;
  attempts: DiaryDayRecord[];
  best: DiaryDayRecord | null;
  last: DiaryDayRecord | null;
  /** Number of questions answered across all attempts. */
  answeredCount: number;
  correctCount: number;
  /** Aggregated per-concept miss counts across all attempts, sorted desc. */
  conceptMisses: DiaryConceptMiss[];
  /** Concept ids bound to the day's questions, so pending days can pre-list topics. */
  allConceptIds: string[];
}

export interface DiaryState {
  /** One entry per lesson day, in course order, only for days with attempts or that started. */
  days: DiaryDayEntry[];
}

/** Victory-only report shown after a battle; derived data, never persisted. */
export interface BattleSummary {
  day: number;
  lessonTitle: string;
  correctCount: number;
  questionTotal: number;
  /** Concept ids answered correctly during the attempt. */
  masteredConceptIds: string[];
  /** Concept ids answered incorrectly during the attempt, deduplicated. */
  missedConceptIds: string[];
}

export function createEmptyDiary(): DiaryState {
  return { days: [] };
}
