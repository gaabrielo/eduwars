import { atom } from 'recoil';

export interface KnowledgeState {
  current: number;
  max: number;
}

export const INITIAL_KNOWLEDGE_CURRENT = 7;
export const INITIAL_KNOWLEDGE_MAX = 10;

export const knowledgeStateAtom = atom<KnowledgeState>({
  key: 'knowledgeStateAtom',
  default: {
    current: INITIAL_KNOWLEDGE_CURRENT,
    max: INITIAL_KNOWLEDGE_MAX,
  },
});
