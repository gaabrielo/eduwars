import { supabase } from '@/services/supabase';
import type { PostgrestError } from '@supabase/supabase-js';
import type { UntypedRowList } from '@/types/dbRows';

export async function createLevel() {
  const res = await supabase
    .from('level')
    .insert({ updated_at: new Date() })
    .select();
  return res;
}

export async function getLevels() {
  const res = await supabase.from('level').select(`
    *,
    class (*)
  `);
  return res;
}

/**
 * Loosely typed on purpose: the raw select string below is not fully valid
 * (the `level_cover` relation is missing a comma) so supabase-js resolves its
 * result to a select-parser error type instead of rows.
 */
export async function getLevel(
  id: number
): Promise<{ data: UntypedRowList | null; error: PostgrestError | null }> {
  const res = await supabase
    .from('level')
    .select(
      `
    *,
    class ( *, class_challenge (*) ),
    level_participants ( *, users (*) )
    level_cover ( * )
  `
    )
    .eq('id', id)
    .order('id', { referencedTable: 'class', ascending: true });
  return res;
}

export async function getUsers(term: string) {
  const res = await supabase
    .from('users')
    .select('*')
    .ilike('email', `%${term}%`)
    .limit(5);

  return res;
}

export async function addUsersToLevel(obj: any) {
  const { data, error } = await supabase
    .from('level_participants')
    .insert(obj)
    .select();

  return data;
}

export async function updateLevel(cols: any, levelId: number) {
  const res = await supabase
    .from('level')
    .update(cols)
    .eq('id', levelId)
    .select();

  return res;
}
