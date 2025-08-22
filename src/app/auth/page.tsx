'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const signUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password })
    setMessage(error ? error.message : 'Check your email for a confirmation link!')
  }

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setMessage(error ? error.message : 'Logged in!')
  }

  return (
    <div style={{ padding: 40, fontFamily: 'Arial' }}>
      <h1>Student Portal</h1>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: 'block', marginBottom: 10, padding: 8 }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: 'block', marginBottom: 10, padding: 8 }}
      />
      <button onClick={signIn} style={{ marginRight: 10 }}>Log In</button>
      <button onClick={signUp}>Sign Up</button>
      <p style={{ marginTop: 10 }}>{message}</p>
    </div>
  )
}