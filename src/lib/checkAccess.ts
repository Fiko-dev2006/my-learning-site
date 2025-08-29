// src/lib/checkAccess.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey  = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function hasActivePayment(userId: string) {
  const firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  const { data } = await supabase
    .from('monthly_payments')
    .select('id')
    .eq('user_id', userId)
    .gte('month', firstDay.toISOString())
    .single()
  return !!data
}