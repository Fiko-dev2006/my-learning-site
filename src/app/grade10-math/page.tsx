'use client'

import { useEffect, useState } from 'react'
import { hasActivePayment } from '@/lib/checkAccess'
import { useRouter } from 'next/navigation'

export default function GradePage({ grade, subject }: { grade: number; subject: string }) {
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

  if (!allowed) return <p style={{ padding: 40 }}>Please pay for this month to access {grade} {subject}.</p>

  return (
    <div style={{ padding: 40 }}>
      <h1>Grade {grade} – {subject}</h1>
      <p>All lessons, quizzes and exams are unlocked!</p>
    </div>
  )
}