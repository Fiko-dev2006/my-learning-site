'use client'

import { useEffect, useState } from 'react'

type FileInfo = {
  name: string
  created_at: string
  metadata: { size: number; mimetype: string }
}

export default function AdminPage() {
  const [files, setFiles] = useState<FileInfo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/receipts')
      .then(r => r.json())
      .then(d => {
        setFiles(d.files || [])
        setLoading(false)
      })
  }, [])

  const downloadUrl = (name: string) =>
    `/api/download?file=${encodeURIComponent(name)}`

  return (
    <div
      style={{
        padding: 60,
        fontFamily: 'Inter, sans-serif',
        background: 'linear-gradient(135deg,#f5f7fa 0%, #e4edf5 100%)',
        minHeight: '100vh',
        color: '#1e293b'
      }}
    >
      <h1
        style={{
          fontSize: 36,
          fontWeight: 700,
          textAlign: 'center',
          marginBottom: 50,
          letterSpacing: 1
        }}
      >
        📄 Student Receipts
      </h1>

      {loading ? (
        <p style={{ fontSize: 20, textAlign: 'center' }}>Loading…</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gap: 30,
            maxWidth: 800,
            margin: '0 auto'
          }}
        >
          {files.map(f => (
            <div
              key={f.name}
              style={{
                background: '#ffffff',
                borderRadius: 16,
                padding: 30,
                boxShadow: '0 6px 20px rgba(0,0,0,.08)',
                fontSize: 18,
                lineHeight: 1.5
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: 20,
                  fontWeight: 600,
                  wordBreak: 'break-all'
                }}
              >
                {f.name}
              </h3>
              <p style={{ margin: '8px 0', color: '#475569' }}>
                Size: {(f.metadata.size / 1024).toFixed(1)} KB <br />
                Uploaded: {new Date(f.created_at).toLocaleString()}
              </p>
              <a
                href={downloadUrl(f.name)}
                style={{
                  display: 'inline-block',
                  marginTop: 14,
                  padding: '12px 24px',
                  background: '#2563eb',
                  color: '#fff',
                  borderRadius: 8,
                  fontSize: 16,
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#1e40af')}
                onMouseLeave={e => (e.currentTarget.style.background = '#2563eb')}
              >
                📥 Download
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}