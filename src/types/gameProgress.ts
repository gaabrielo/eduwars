import { INITIAL_DAY } from '@/atoms/currentDayAtom';
import {
  INITIAL_KNOWLEDGE_CURRENT,
  INITIAL_KNOWLEDGE_MAX,
} from '@/atoms/knowledgeStateAtom';
import type { HeroPosition } from '@/utils/types';
import type { DiaryState } from '@/types/diary';
import { createEmptyDiary } from '@/types/diary';

export type { HeroPosition } from '@/utils/types';

export interface GameProgress {
  version: 1;
  currentLevelId: string;
  currentDay: number;
  knowledge: {
    current: number;
    max: number;
  };
  characterName: string;
  heroPositionByLevel: Record<string, HeroPosition>;
  completedBattleIds: string[];
  watchedLessonDays: number[];
  courseSequenceAcknowledged: boolean;
  collectedPlacementIdsByLevel: Record<string, number[]>;
  dialogueFlags: string[];
  /** History recorded by the Knowledge Diary (attempts, concepts to review). */
  diary: DiaryState;
  savedAt: string;
}

export type BattleSnapshot = Omit<
  GameProgress,
  | 'version'
  | 'savedAt'
  | 'watchedLessonDays'
  | 'diary'
  | 'courseSequenceAcknowledged'
>;

export function createInitialGameProgress(): GameProgress {
  return {
    version: 1,
    currentLevelId: 'DormRoomLevel',
    currentDay: INITIAL_DAY,
    knowledge: {
      current: INITIAL_KNOWLEDGE_CURRENT,
      max: INITIAL_KNOWLEDGE_MAX,
    },
    characterName: 'HERO',
    heroPositionByLevel: {},
    completedBattleIds: [],
    watchedLessonDays: [],
    courseSequenceAcknowledged: false,
    collectedPlacementIdsByLevel: {},
    dialogueFlags: [],
    diary: createEmptyDiary(),
    savedAt: new Date().toISOString(),
  };
}
