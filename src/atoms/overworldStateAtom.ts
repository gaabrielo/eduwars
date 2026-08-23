import { atom } from 'recoil';

export interface BattleEnemyState {
  fieldId: string;
  name: string;
  spriteFrame: string;
}

export const overworldStateAtom = atom({
  key: 'overworldStateAtom',
  default: {
    previousLevelId: null as string | null,
    heroPosition: null as { x: number; y: number } | null,
    activeUI: null as
      | 'CLASSROOM'
      | 'NPC_BATTLE'
      | 'BATTLE_DEFEAT'
      | 'WARDROBE'
      | 'SKIN_SELECTION'
      | null,
    battleEnemy: null as BattleEnemyState | null,
    completedBattleIds: [] as string[],
  },
});
