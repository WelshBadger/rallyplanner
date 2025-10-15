import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <h1>Rally Planner</h1>
      <Link href="/rally-detail/1">Go to Rally Detail</Link>
    </div>
  )
}
