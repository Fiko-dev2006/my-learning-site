export default function Home() {
  return (
    <main style={{ padding: 40, fontFamily: 'Arial' }}>
      <h1>Welcome to My Learning Site!</h1>
      <p><a href="/auth">Log In / Sign Up</a></p>
      <p><a href="/upload">Upload Receipt</a></p>
      <p><a href="/admin">Admin Receipts</a></p>
      <p><a href="/grade9-math">Grade 9 Math Course</a></p>
      <p><a href="/grade9-english">Grade 9 English Course</a></p>
    </main>
  )
}