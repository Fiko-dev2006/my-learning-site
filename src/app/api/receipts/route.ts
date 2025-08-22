import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY!
)

export async function GET() {
  const { data, error } = await supabase.storage
    .from('receipts')
    .list('', { limit: 1000 })

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ files: data })
}