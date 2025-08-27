'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY!
)

export default function Grade9MathPage() {
  const [allowed, setAllowed] = useState(false)
  const [completed, setCompleted] = useState(0)
  const [total] = useState(10) // total lessons
  const router = useRouter()

  useEffect(() => {
    async function check() {
      const user = (await supabase.auth.getUser()).data.user
      if (!user) return router.push('/auth')

      // check monthly payment
      const today = new Date()
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
      const { data: pay } = await supabase
        .from('monthly_payments')
        .select('id')
        .eq('user_id', user.id)
        .gte('month', firstDay.toISOString())
        .single()
      setAllowed(!!pay)

      // check progress
      const { count } = await supabase
        .from('progress')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('grade', 'grade9')
      setCompleted(count ?? 0)
    }
    check()
  }, [router])

  if (!allowed) return <p style={{ padding: 40 }}>Please pay for this month to access Grade 9 Math.</p>

  return (
    <div style={{ padding: 40, fontFamily: 'Inter' }}>
      <h1>Grade 9 – Mathematics</h1>
      <progress value={completed} max={total} style={{ width: '100%' }} />
      <p>{completed} / {total} lessons completed</p>
    </div>
  )
}