import {
  createInitialGameProgress,
  GameProgress,
  HeroPosition,
} from '@/types/gameProgress';

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
