import {
  BATTLE_ID_BY_DAY,
  getLessonByDay,
  PYTHON_COURSE,
} from '@/data/pythonCourse';
import {
  createEmptyDiary,
  BattleSummary,
  DiaryConceptMiss,
  DiaryDayEntry,
  DiaryDayRecord,
  DiaryDayStatus,
  DiaryState,
  DiaryAttempt,
} from '@/types/diary';
import { GameProgress } from '@/types/gameProgress';

/**
 * Merges a finished battle attempt into the diary. Attempts for the same day
 * are kept in order (retries create sequential records), the best victory by
 * correct count is tracked separately, and concept misses accumulate across
 * attempts so the review list reflects the full history.
 */
export function applyDiaryAttempt(
  diary: DiaryState,
  attempt: DiaryAttempt
): DiaryState {
  if (attempt.answeredCount === 0) return diary;

  const dayEntry =
    diary.days.find((entry) => entry.day === attempt.day) ??
    createDayEntry(attempt.day);

  const attemptRecord: DiaryDayRecord = {
    number: dayEntry.attempts.length + 1,
    outcome: attempt.outcome,
    correctCount: attempt.correctCount,
    answeredCount: attempt.answeredCount,
    questionTotal: attempt.questionTotal,
    knowledgeLost: attempt.knowledgeLost,
    savedAt: new Date().toISOString(),
  };

  const attempts = [...dayEntry.attempts, attemptRecord];
  const conceptMisses = accumulateConceptMisses(
    [
      ...dayEntry.conceptMisses,
      ...attempt.missedConceptIds.map((conceptId) => ({
        conceptId,
        misses: 1,
      })),
    ],
    dayEntry.allConceptIds
  );

  const days = upsertDay(diary.days, {
    ...dayEntry,
    attempts,
    best: chooseBestResult(dayEntry.best, attempts),
    last: attemptRecord,
    answeredCount: dayEntry.answeredCount + attempt.answeredCount,
    correctCount: dayEntry.correctCount + attempt.correctCount,
    conceptMisses,
  });

  return { days };
}

function createDayEntry(day: number): DiaryDayEntry {
  return {
    day,
    attempts: [],
    best: null,
    last: null,
    answeredCount: 0,
    correctCount: 0,
    conceptMisses: [],
    allConceptIds: collectLessonConceptIds(day),
  };
}

function collectLessonConceptIds(day: number): string[] {
  const lesson = getLessonByDay(day);
  if (!lesson) return [];

  const conceptIds = new Set<string>();
  for (const question of lesson.questions) {
    for (const conceptId of question.concepts ?? []) {
      conceptIds.add(conceptId);
    }
  }
  return Array.from(conceptIds);
}

/**
 * The best result is the victory with the most correct answers; ties keep the
 * earliest victory. Days without any victory have no best result yet.
 */
function chooseBestResult(
  currentBest: DiaryDayRecord | null,
  attempts: DiaryDayRecord[]
): DiaryDayRecord | null {
  const victories = attempts.filter((record) => record.outcome === 'VICTORY');
  if (victories.length === 0) return currentBest;

  return victories.reduce((best, record) =>
    (best?.correctCount ?? -1) >= record.correctCount ? best : record
  );
}

function accumulateConceptMisses(
  misses: DiaryConceptMiss[],
  allConceptIds: string[]
): DiaryConceptMiss[] {
  const counts = new Map<string, number>();
  for (const conceptId of allConceptIds) {
    counts.set(conceptId, 0);
  }
  for (const miss of misses) {
    counts.set(miss.conceptId, (counts.get(miss.conceptId) ?? 0) + miss.misses);
  }

  return Array.from(counts.entries())
    .filter(([, misses]) => misses > 0)
    .map(([conceptId, misses]) => ({ conceptId, misses }))
    .sort((a, b) => b.misses - a.misses);
}

function upsertDay(
  days: DiaryDayEntry[],
  updatedEntry: DiaryDayEntry
): DiaryDayEntry[] {
  const existingIndex = days.findIndex((entry) => entry.day === updatedEntry.day);
  if (existingIndex === -1) {
    return [...days, updatedEntry].sort((a, b) => a.day - b.day);
  }

  return days.map((entry) =>
    entry.day === updatedEntry.day ? updatedEntry : entry
  );
}

/**
 * Rebuilds the whole diary from scratch; only used by the full progress reset.
 */
export function clearDiary(): DiaryState {
  return createEmptyDiary();
}

/**
 * Derives a day's progress status from the actual game state. Nothing is
 * stored: aula assistida = watchedLessonDays; desafio concluído = the day's
 * battle id present in completedBattleIds.
 */
export function getDayStatus(
  day: number,
  progress: Pick<GameProgress, 'watchedLessonDays' | 'completedBattleIds'>
): DiaryDayStatus {
  const lesson = getLessonByDay(day);
  if (!lesson) {
    return 'NAO_INICIADA';
  }

  const battleId = BATTLE_ID_BY_DAY[day];
  if (battleId !== undefined && progress.completedBattleIds.includes(battleId)) {
    return 'DESAFIO_CONCLUIDO';
  }
  if (progress.watchedLessonDays.includes(day)) {
    return 'AULA_ASSISTIDA';
  }
  return 'NAO_INICIADA';
}

/**
 * Aggregates the concept miss counts of every recorded day, sorted by the
 * most missed concept first.
 */
export function aggregateConceptMisses(
  diary: DiaryState
): DiaryConceptMiss[] {
  const totals = new Map<string, number>();
  for (const dayEntry of diary.days) {
    for (const miss of dayEntry.conceptMisses) {
      totals.set(miss.conceptId, (totals.get(miss.conceptId) ?? 0) + miss.misses);
    }
  }

  return Array.from(totals.entries())
    .map(([conceptId, misses]) => ({ conceptId, misses }))
    .sort((a, b) => b.misses - a.misses || a.conceptId.localeCompare(b.conceptId));
}

/**
 * Concept ids taught by a lesson day (union of its questions' concepts).
 */
export function getLessonConceptIds(day: number): string[] {
  return collectLessonConceptIds(day);
}

/**
 * Victory report shown right after a battle. Purely derived from the attempt
 * and the lesson data; never persisted.
 */
export function buildBattleSummary(attempt: DiaryAttempt): BattleSummary {
  const lesson = getLessonByDay(attempt.day);
  return {
    day: attempt.day,
    lessonTitle: lesson?.title ?? `Dia ${attempt.day}`,
    correctCount: attempt.correctCount,
    questionTotal: attempt.questionTotal,
    masteredConceptIds: getMasteredConceptIds(attempt.day, attempt.missedConceptIds),
    missedConceptIds: Array.from(new Set(attempt.missedConceptIds)),
  };
}

/**
 * Concepts from a day's lesson that were NOT missed in the given attempt,
 * i.e. the ones answered correctly at least once.
 */
export function getMasteredConceptIds(
  day: number,
  missedConceptIds: string[]
): string[] {
  const missed = new Set(missedConceptIds);
  return collectLessonConceptIds(day).filter((conceptId) => !missed.has(conceptId));
}

/**
 * Lesson days whose questions reference the given concept id, used to show
 * "Relacionado às aulas" in the review panel.
 */
export function getConceptRelatedDays(conceptId: string): number[] {
  return PYTHON_COURSE.filter((lesson) =>
    lesson.questions.some((question) =>
      (question.concepts ?? []).includes(conceptId)
    )
  ).map((lesson) => lesson.day);
}
