import { atom } from 'recoil';
import { createEmptyDiary, DiaryState } from '@/types/diary';

export const diaryAtom = atom<DiaryState>({
  key: 'diaryAtom',
  default: createEmptyDiary(),
});
