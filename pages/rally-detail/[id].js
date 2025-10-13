import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function RallyDetail() {
  const router = useRouter()
  const { id } = router.query
  const [rally, setRally] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRallyDetails = async () => {
      if (!id) return

      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { 
          router.push('/login')
          return 
        }
        
        const { data: r, error: rallyError } = await supabase
          .from('rally_events')
          .select('*')
          .eq('id', id)
          .single()

        if (rallyError) {
          console.error('Rally fetch error:', rallyError)
          setError('Unable to fetch rally details')
          setLoading(false)
          return
        }
        
        setRally(r)
        setLoading(false)
      } catch (unexpectedError) {
        console.error('Unexpected error:', unexpectedError)
        setError('An unexpected error occurred')
        setLoading(false)
      }
    }

    if (router.isReady) {
      fetchRallyDetails()
    }
  }, [id, router.isReady])

  const handleLogout = async () => { 
    await supabase.auth.signOut()
    router.push('/') 
  }

  if (loading) return <div>Loading...</div>

  if (error) return (
    <div>
      <h2>Error: {error}</h2>
      <button onClick={() => router.reload()}>Try Again</button>
      <button onClick={() => router.push('/my-dashboard')}>Back to Dashboard</button>
    </div>
  )

  return (
    <div>
      <nav>
        <Link href="/my-dashboard">← Back to Dashboard</Link>
        <button onClick={handleLogout}>Logout</button>
      </nav>

      <h1>{rally.name}</h1>
      <div>
        <p>Location: {rally.location}</p>
        <p>
          Dates: {new Date(rally.start_date).toLocaleDateString()} - {' '}
          {new Date(rally.end_date).toLocaleDateString()}
        </p>
      </div>
    </div>
  )
}

export async function getServerSideProps(context) {
  return { props: {} }
}
