'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState('')

  const handleUpload = async () => {
    if (!file) return setMsg('Choose a file first')
    setUploading(true)

    const user = (await supabase.auth.getUser()).data.user
    if (!user) return setMsg('Please log in')

    const fileName = `${user.id}-${Date.now()}.${file.name.split('.').pop()}`
    try {
      const { error } = await supabase.storage.from('receipts').upload(fileName, file)
      if (error) {
        setMsg(error.message)
      } else {
        setMsg('Receipt uploaded & course unlocked!')
        await supabase.from('payments').insert({
          user_id: user.id,
          file_name: fileName
        })
      }
    } catch (error) {
      setMsg((error as Error).message)
    }

    setUploading(false)
  }

  return (
    <div style={{ padding: 40, fontFamily: 'Arial' }}>
      <h1>Upload Payment Receipt</h1>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      <button onClick={handleUpload} disabled={uploading} style={{ marginTop: 10 }}>
        {uploading ? 'Uploading…' : 'Upload'}
      </button>
      <p style={{ marginTop: 10 }}>{msg}</p>
    </div>
  )
}