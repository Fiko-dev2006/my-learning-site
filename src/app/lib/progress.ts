import { supabase } from './supabaseClient'

export async function getProgress(userId: string, grade: string) {
  const { count } = await supabase
    .from('progress')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('grade', grade)
  return count ?? 0
}