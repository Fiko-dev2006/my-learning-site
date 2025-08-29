'use client'

import { useEffect, useState } from 'react'
import { supabase, hasActivePayment } from '@/lib/checkAccess'
import { useRouter } from 'next/navigation'

export default function Grade11MathPage() {
  const [allowed, setAllowed] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function check() {
      const user = (await supabase.auth.getUser()).data.user
      if (!user) return router.push('/auth')
      setAllowed(await hasActivePayment(user.id))
    }
    check()
  }, [router])

  if (!allowed) return <p style={{ padding: 40 }}>Please pay for this month to access Grade 11 Math.</p>

  return (
    <div style={{ padding: 40 }}>
      <h1>Grade 11 – Mathematics</h1>
      <p>All lessons, quizzes and exams unlocked!</p>
    </div>
  )
}