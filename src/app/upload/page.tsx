const handleUpload = async () => {
  if (!file) return setMsg('Choose a file first')
  setUploading(true)

  const user = (await supabase.auth.getUser()).data.user
  if (!user) return setMsg('Please log in')

  // Read QR from image
  const reader = new FileReader()
  reader.onload = async (e) => {
    const img = new Image()
   img.src = e.target?.result as string
   img.onload = async () => {
      const qr = new QrCodeReader()
     qr.callback = async (err, value) => {
       if (err) {
         setMsg('Failed to read QR code')
         return setUploading(false)
       }
       if (!value) {
         setMsg('No QR code found')
         return setUploading(false)
       }

       // Basic forgery check (example: check if QR data contains expected fields)
       const isValidQrData = value.result.includes('expected_field')
       if (!isValidQrData) {
         setMsg('Invalid QR data')
         return setUploading(false)
       }

       // Check for duplication
       const { data: existingData, error: existingError } = await supabase
         .from('payments')
         .select('id')
         .eq('qr_data', value.result)
         .single()

       if (existingError || existingData) {
         setMsg('Duplicate payment detected')
         return setUploading(false)
       }

       // Mark as paid
       await supabase.from('payments').insert({
         user_id: user.id,
         file_name: file.name,
         qr_data: value.result,
         confirmed_by_admin: true // Automatically confirm
       })
       setMsg('QR scanned & course unlocked!')
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