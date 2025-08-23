'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

type Payment = {
  id: string
  user_id: string
  file_name: string
  created_at: string
  confirmed_by_admin: boolean
}

export default function AdminConfirmPage() {
  const [payments, setPayments] = useState<Payment[]>([])

  useEffect(() => {
    async function fetchPayments() {
      const { data } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false })
      setPayments(data || [])
    }
    fetchPayments()
  }, [])

  const confirm = async (id: string) => {
    await supabase
      .from('payments')
      .update({ confirmed_by_admin: true })
      .eq('id', id)
    // refresh list
    setPayments(p => p.map(pay => (pay.id === id ? { ...pay, confirmed_by_admin: true } : pay)))
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Confirm Payments</h1>
      {payments.map(p => (
        <div key={p.id} style={{ marginBottom: 20, border: '1px solid #ccc', padding: 10 }}>
          <p><strong>File:</strong> {p.file_name}</p>
          <p><strong>User:</strong> {p.user_id}</p>
          <p><strong>Date:</strong> {new Date(p.created_at).toLocaleString()}</p>
          {p.confirmed_by_admin ? (
            <span style={{ color: 'green' }}>✅ Confirmed</span>
          ) : (
            <button onClick={() => confirm(p.id)}>Mark Paid</button>
          )}
        </div>
      ))}
    </div>
  )
}