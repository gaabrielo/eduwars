import { atom } from 'recoil';
import { DialogueLine } from '@/utils/types';

export interface ActiveDialogue {
  npcId: string;
  npcName: string;
  variantId: string;
  lines: DialogueLine[];
  currentLineIndex: number;
  setFlags: string[];
}

export const dialogueStateAtom = atom<ActiveDialogue | null>({
  key: 'dialogueStateAtom',
  default: null,
});
