'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function Grade9MathPage() {
  const [paid, setPaid] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    ;(async () => {
      const user = (await supabase.auth.getUser()).data.user
      if (!user) return router.push('/auth')

      const { data } = await supabase
        .from('payments')
        .select('id')
        .eq('user_id', user.id)
        .single()

      setPaid(!!data)
      setLoading(false)
    })()
  }, [router])

  if (loading) return <p style={{ padding: 40 }}>Checking access…</p>
  if (!paid) return <p style={{ padding: 40 }}>Please upload your receipt first.</p>

  return (
    <div style={{ padding: 40, fontFamily: 'Inter', lineHeight: 1.7 }}>
      <h1>Grade 9 – English</h1>
      <p>Welcome to your paid course! Here you will find:</p>
      <ul>
        <li>Video lessons</li>
        <li>Practice questions</li>
        <li>Exam simulations</li>
      </ul>
      <p>More content coming soon…</p>
    </div>
  )
}