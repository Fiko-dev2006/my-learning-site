'use client'

import { useEffect, useState } from 'react'
import { supabase, hasActivePayment } from '@/lib/checkAccess'
import { useRouter } from 'next/navigation'

export default function Grade9MathPage() {
  const [allowed, setAllowed] = useState(false)
  const [completed, setCompleted] = useState(0)
  const [total] = useState(5)
  const router = useRouter()

  useEffect(() => {
    async function check() {
      const user = (await supabase.auth.getUser()).data.user
      if (!user) return router.push('/auth')
      setAllowed(await hasActivePayment(user.id))
    }
    check()
  }, [router])

  if (!allowed) return <p style={{ padding: 40 }}>Please pay for this month to access Grade 9 Math.</p>

  return (
    <div style={{ padding: 40 }}>
      <h1>Grade 9 – Mathematics</h1>
      <progress value={completed} max={total} style={{ width: '100%' }} />
      <p>{completed} / {total} lessons completed</p>
    </div>
  )
}