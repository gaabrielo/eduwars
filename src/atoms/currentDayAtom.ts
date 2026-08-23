import { atom } from 'recoil';

export const INITIAL_DAY = 1;

export const currentDayAtom = atom({
  key: 'currentDayAtom',
  default: INITIAL_DAY,
});
