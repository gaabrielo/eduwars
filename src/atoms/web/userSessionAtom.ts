import { atom } from 'recoil';
import type { AuthError, Session } from '@supabase/supabase-js';

export interface UserSessionResponse {
  data: { session: Session | null };
  error: AuthError | null;
}

export const userSessionAtom = atom<UserSessionResponse | null>({
  key: 'userSessionAtom',
  default: null,
});
