import { atom, selector } from 'recoil';

export interface BattleEnemyState {
  fieldId: string;
  name: string;
  spriteFrame: string;
}

export interface OverworldState {
  previousLevelId: string | null;
  heroPosition: { x: number; y: number } | null;
  activeUI:
    | 'CLASSROOM'
    | 'DIALOGUE'
    | 'NPC_BATTLE'
    | 'BATTLE_DEFEAT'
    | 'WARDROBE'
    | 'SKIN_SELECTION'
    | null;
  battleEnemy: BattleEnemyState | null;
  completedBattleIds: string[];
  watchedLessonDays: number[];
  heroPositionByLevel: Record<
    string,
    { x: number; y: number; facingDirection: string }
  >;
  collectedPlacementIdsByLevel: Record<string, number[]>;
  dialogueFlags: string[];
}

export const overworldStateAtom = atom<OverworldState>({
  key: 'overworldStateAtom',
  default: {
    previousLevelId: null as string | null,
    heroPosition: null as { x: number; y: number } | null,
    activeUI: null as
      | 'CLASSROOM'
      | 'DIALOGUE'
      | 'NPC_BATTLE'
      | 'BATTLE_DEFEAT'
      | 'WARDROBE'
      | 'SKIN_SELECTION'
      | null,
    battleEnemy: null as BattleEnemyState | null,
    completedBattleIds: [] as string[],
    watchedLessonDays: [] as number[],
    heroPositionByLevel: {},
    collectedPlacementIdsByLevel: {},
    dialogueFlags: [],
  },
});

export const overworldActiveUISelector = selector<
  OverworldState['activeUI']
>({
  key: 'overworldActiveUISelector',
  get: ({ get }) => get(overworldStateAtom).activeUI,
});

export const overworldBattleEnemySelector = selector<
  BattleEnemyState | null
>({
  key: 'overworldBattleEnemySelector',
  get: ({ get }) => get(overworldStateAtom).battleEnemy,
});
