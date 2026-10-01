import {
  createInitialGameProgress,
  GameProgress,
  HeroPosition,
} from '@/types/gameProgress';
import type {
  DiaryConceptMiss,
  DiaryDayEntry,
  DiaryDayRecord,
  DiaryState,
} from '@/types/diary';
import { createEmptyDiary } from '@/types/diary';

export const GAME_PROGRESS_STORAGE_KEY = 'eduwars:game-progress:v1';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isHeroPosition(value: unknown): value is HeroPosition {
  return (
    isRecord(value) &&
    typeof value.x === 'number' &&
    Number.isFinite(value.x) &&
    typeof value.y === 'number' &&
    Number.isFinite(value.y) &&
    typeof value.facingDirection === 'string'
  );
}

function isHeroPositionByLevel(
  value: unknown
): value is Record<string, HeroPosition> {
  return (
    isRecord(value) &&
    Object.values(value).every((position) => isHeroPosition(position))
  );
}

function isNumberArrayByLevel(
  value: unknown
): value is Record<string, number[]> {
  return (
    isRecord(value) &&
    Object.values(value).every(
      (ids) =>
        Array.isArray(ids) &&
        ids.every((id) => typeof id === 'number' && Number.isFinite(id))
    )
  );
}

function isDiaryDayRecord(value: unknown): value is DiaryDayRecord {
  return (
    isRecord(value) &&
    typeof value.number === 'number' &&
    Number.isFinite(value.number) &&
    (value.outcome === 'VICTORY' || value.outcome === 'DEFEAT') &&
    typeof value.correctCount === 'number' &&
    Number.isFinite(value.correctCount) &&
    typeof value.answeredCount === 'number' &&
    Number.isFinite(value.answeredCount) &&
    typeof value.questionTotal === 'number' &&
    Number.isFinite(value.questionTotal) &&
    typeof value.knowledgeLost === 'number' &&
    Number.isFinite(value.knowledgeLost) &&
    typeof value.savedAt === 'string'
  );
}

function isDiaryConceptMiss(value: unknown): value is DiaryConceptMiss {
  return (
    isRecord(value) &&
    typeof value.conceptId === 'string' &&
    typeof value.misses === 'number' &&
    Number.isFinite(value.misses)
  );
}

function isDiaryDayEntry(value: unknown): value is DiaryDayEntry {
  if (!isRecord(value) || typeof value.day !== 'number') return false;

  return (
    Number.isFinite(value.day) &&
    Array.isArray(value.attempts) &&
    value.attempts.every((attempt) => isDiaryDayRecord(attempt)) &&
    (value.best === null || isDiaryDayRecord(value.best)) &&
    (value.last === null || isDiaryDayRecord(value.last)) &&
    typeof value.answeredCount === 'number' &&
    Number.isFinite(value.answeredCount) &&
    typeof value.correctCount === 'number' &&
    Number.isFinite(value.correctCount) &&
    Array.isArray(value.conceptMisses) &&
    value.conceptMisses.every((miss) => isDiaryConceptMiss(miss)) &&
    Array.isArray(value.allConceptIds) &&
    value.allConceptIds.every((id) => typeof id === 'string')
  );
}

function getDiary(value: unknown): DiaryState {
  if (
    !isRecord(value) ||
    !Array.isArray(value.days) ||
    !value.days.every((entry) => isDiaryDayEntry(entry))
  ) {
    return createEmptyDiary();
  }

  // Every entry was already validated field by field by isDiaryDayEntry.
  return { days: value.days as DiaryDayEntry[] };
}

function getWatchedLessonDays(value: unknown): number[] {
  if (!Array.isArray(value)) return [];

  return value.filter(
    (day): day is number => typeof day === 'number' && Number.isFinite(day)
  );
}

function isGameProgress(value: unknown): value is GameProgress {
  return (
    isRecord(value) &&
    value.version === 1 &&
    typeof value.currentLevelId === 'string' &&
    typeof value.currentDay === 'number' &&
    Number.isFinite(value.currentDay) &&
    isRecord(value.knowledge) &&
    typeof value.knowledge.current === 'number' &&
    typeof value.knowledge.max === 'number' &&
    Number.isFinite(value.knowledge.current) &&
    Number.isFinite(value.knowledge.max) &&
    typeof value.characterName === 'string' &&
    isHeroPositionByLevel(value.heroPositionByLevel) &&
    Array.isArray(value.completedBattleIds) &&
    value.completedBattleIds.every((id) => typeof id === 'string') &&
    isNumberArrayByLevel(value.collectedPlacementIdsByLevel) &&
    Array.isArray(value.dialogueFlags) &&
    value.dialogueFlags.every((flag) => typeof flag === 'string') &&
    typeof value.savedAt === 'string'
  );
}

export function loadGameProgress(): GameProgress {
  if (typeof window === 'undefined') {
    return createInitialGameProgress();
  }

  try {
    const rawProgress = window.localStorage.getItem(GAME_PROGRESS_STORAGE_KEY);
    if (!rawProgress) return createInitialGameProgress();

    const parsedProgress: unknown = JSON.parse(rawProgress);
    if (!isGameProgress(parsedProgress)) return createInitialGameProgress();

    return {
      ...parsedProgress,
      watchedLessonDays: getWatchedLessonDays(parsedProgress.watchedLessonDays),
      // Older saves predate the diary; each record is validated individually so
      // a corrupted entry can never break the rest of the progress.
      diary: getDiary(parsedProgress.diary ?? createEmptyDiary()),
    };
  } catch {
    return createInitialGameProgress();
  }
}

export function saveGameProgress(progress: GameProgress): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(
      GAME_PROGRESS_STORAGE_KEY,
      JSON.stringify({ ...progress, savedAt: new Date().toISOString() })
    );
  } catch {
    // Storage can be unavailable in private browsing or after the quota is reached.
  }
}

export function clearGameProgress(): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.removeItem(GAME_PROGRESS_STORAGE_KEY);
  } catch {
    // Clearing a save should never prevent the game from starting.
  }
}
