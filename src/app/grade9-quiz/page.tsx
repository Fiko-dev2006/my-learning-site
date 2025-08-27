'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY!
)

// 5 demo questions
const QUESTIONS = [
  {
    q: 'What is 2 + 2?',
    choices: ['3', '4', '5', '6'],
    answer: 1
  },
  {
    q: 'Solve 3x = 9',
    choices: ['x = 2', 'x = 3', 'x = 4', 'x = 5'],
    answer: 1
  },
  {
    q: 'Area of a circle with r = 2?',
    choices: ['4π', '8π', '12π', '16π'],
    answer: 0
  },
  {
    q: 'Prime number among 2, 4, 6, 8?',
    choices: ['2', '4', '6', '8'],
    answer: 0
  },
  {
    q: 'Square of 5?',
    choices: ['20', '25', '30', '35'],
    answer: 1
  }
]

export default function Grade9QuizPage() {
  const [allowed, setAllowed] = useState(false)
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function check() {
      const user = (await supabase.auth.getUser()).data.user
      if (!user) return router.push('/auth')

      const today = new Date()
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
      const { data: pay } = await supabase
        .from('monthly_payments')
        .select('id')
        .eq('user_id', user.id)
        .gte('month', firstDay.toISOString())
        .single()
      setAllowed(!!pay)
    }
    check()
  }, [router])

  if (!allowed) return <p style={{ padding: 40 }}>Please pay for this month to access Grade 9 Quiz.</p>

  const handleAnswer = (choiceIndex: number) => {
    if (choiceIndex === QUESTIONS[index].answer) setScore(s => s + 1)
    if (index < QUESTIONS.length - 1) {
      setIndex(i => i + 1)
    } else {
      setFinished(true)
    }
  }

  if (finished) return (
    <div style={{ padding: 40 }}>
      <h1>Quiz Finished!</h1>
      <p>You scored {score} / {QUESTIONS.length}</p>
      <button onClick={() => setIndex(0)}>Retake</button>
    </div>
  )

  const { q, choices } = QUESTIONS[index]
  return (
    <div style={{ padding: 40, fontFamily: 'Inter' }}>
      <h1>Grade 9 Math Quiz – Question {index + 1}</h1>
      <h3>{q}</h3>
      {choices.map((choice, i) => (
        <button
          key={i}
          onClick={() => handleAnswer(i)}
          style={{ display: 'block', margin: '8px 0', padding: '8px 16px' }}
        >
          {choice}
        </button>
      ))}
    </div>
  )
}