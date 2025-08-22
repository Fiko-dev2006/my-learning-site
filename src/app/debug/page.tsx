'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Debug() {
  const [list, setList] = useState<any>(null)
  const [url, setUrl] = useState<any>(null)

  useEffect(() => {
    ;(async () => {
      // 1. list every file
      const listRes = await supabase.storage.from('receipts').list('', { limit: 1000 })
      setList(listRes)

      // 2. try to build the public URL for your file
      const urlRes = supabase.storage
        .from('receipts')
        .getPublicUrl('a2e9767d-049c-460a-89c5-959224e8f058-1755548153476.jpeg')
      setUrl(urlRes)
    })()
  }, [])

  return (
    <pre style={{ padding: 20, fontSize: 14 }}>
      {JSON.stringify({ list, url }, null, 2)}
    </pre>
  )
}