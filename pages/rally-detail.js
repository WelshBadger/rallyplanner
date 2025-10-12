import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

export default function RallyDetail() {
  const router = useRouter()
  const [rally, setRally] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRally = async () => {
      console.log('=== RALLY DETAIL DEBUG ===')
      console.log('Router is ready:', router.isReady)
      console.log('Full router query:', router.query)
      
      if (!router.isReady) {
        console.log('Router not ready yet')
        return
      }

      const { id } = router.query
      
      console.log('Extracted ID:', id)
      console.log('ID type:', typeof id)
      console.log('ID length:', id?.length)

      if (!id) {
        console.error('No ID in query')
        setError('No rally ID provided')
        setLoading(false)
        return
      }

      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        console.log('User:', user?.id)
        console.log('User error:', userError)

        if (userError || !user) {
          console.error('Auth error, redirecting to login')
          router.push('/login')
          return
        }

        console.log('Fetching rally with ID:', id)

        const { data, error: fetchError } = await supabase
          .from('rally_events')
          .select('*')
          .eq('id', id)
          .single()

        console.log('Fetch result:', { data, error: fetchError })

        if (fetchError) {
          console.error('Fetch error:', fetchError)
          setError(fetchError.message)
          setLoading(false)
          return
        }

        if (!data) {
          console.error('No data returned')
          setError('Rally not found')
          setLoading(false)
          return
        }

        console.log('Rally loaded successfully:', data)
        setRally(data)
        setLoading(false)

      } catch (err) {
        console.error('Unexpected error:', err)
        setError(err.message)
        setLoading(false)
      }
    }

    fetchRally()
  }, [router.isReady, router.query.id])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#000', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        Loading...
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: '#000', color: 'white', padding: '40px', textAlign: 'center' }}>
        <h1 style={{ color: '#ff6b6b' }}>Error</h1>
        <p>{error}</p>
        <pre style={{ background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
          Router Query: {JSON.stringify(router.query, null, 2)}
        </pre>
        <Link href="/my-dashboard" style={{ color: '#00ff88', marginTop: '20px', display: 'inline-block' }}>
          ← Back to Dashboard
        </Link>
      </div>
    )
  }

  if (!rally) {
    return (
      <div style={{ minHeight: '100vh', background: '#000', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        Rally not found
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: 'white', fontFamily: 'Arial' }}>
      <nav style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Link href="/my-dashboard" style={{ color: '#00ff88', textDecoration: 'none' }}>
          ← Back to Dashboard
        </Link>
      </nav>

      <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ background: 'rgba(0,255,136,0.1)', border: '2px solid #00ff88', borderRadius: '12px', padding: '40px' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '20px', color: '#00ff88' }}>{rally.name}</h1>
          <div style={{ fontSize: '1.2rem' }}>
            <p>�� {new Date(rally.start_date).toLocaleDateString('en-GB')} - {new Date(rally.end_date).toLocaleDateString('en-GB')}</p>
            <p>📍 {rally.location}</p>
            {rally.description && <p style={{ marginTop: '20px', color: 'rgba(255,255,255,0.7)' }}>{rally.description}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
