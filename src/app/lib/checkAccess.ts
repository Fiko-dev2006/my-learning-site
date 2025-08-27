import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY!

export const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function hasActivePayment(userId: string) {
  const today = new Date()
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
  const { data } = await supabase
    .from('monthly_payments')
    .select('id')
    .eq('user_id', userId)
    .gte('month', firstDay.toISOString())
    .single()
  return !!data
}