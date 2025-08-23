'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import QrCodeReader from 'qrcode-reader'

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState('')

  const handleUpload = async () => {
    if (!file) return setMsg('Choose a file first')
    setUploading(true)

    const user = (await supabase.auth.getUser()).data.user
    if (!user) return setMsg('Please log in')

    // Check for existing file
    const { data: existingFiles, error: checkError } = await supabase.storage.from('receipts').list('*', { limit: 1000 })
    if (checkError) {
      setMsg(checkError.message)
      setUploading(false)
      return
    }
    const existingFileNames = existingFiles?.map(f => f.name) || []

    // Prevent uploading duplicates
    if (existingFileNames.includes(file.name)) {
      setMsg('This receipt has already been uploaded.')
      setUploading(false)
      return
    }

    // Read QR from image
    const reader = new FileReader()
    reader.onload = async (e) => {
      const img = new Image()
     img.src = e.target?.result as string
     img.onload = async () => {
        const qr = new QrCodeReader()
        qr.callback = async (err, value) => {
          if (value) {
            // QR found – mark as paid
            await supabase.from('payments').insert({
              user_id: user.id,
              file_name: file.name,
              qr_data: value.result
            })
            setMsg('QR scanned & course unlocked!')
          } else {
            // no QR – still allow upload
            await supabase.from('payments').insert({
              user_id: user.id,
              file_name: file.name
            })
            setMsg('Receipt uploaded & course unlocked!')
          }
        }
        qr.decode(img)
      }
    }
    reader.readAsDataURL(file)

    const fileName = `${user.id}-${Date.now()}.${file.name.split('.').pop()}`
    const { error: storageError } = await supabase.storage.from('receipts').upload(fileName, file)

    if (storageError) {
      setMsg(storageError.message)
    } else {
      setUploading(false)
    }
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