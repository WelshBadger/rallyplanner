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

  if (loading) return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#1e2a3a', 
      color: 'white', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      Loading...
    </div>
  )

  if (error) return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#1e2a3a', 
      color: 'white', 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{ color: 'red' }}>Error: {error}</h2>
      <button 
        onClick={() => router.reload()}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#00d9cc',
          color: 'black',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Try Again
      </button>
    </div>
  )

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#1e2a3a', 
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      <nav style={{ marginBottom: '30px' }}>
        <Link href="/my-dashboard" style={{ 
          color: '#00d9cc', 
          textDecoration: 'none',
          fontSize: '1rem',
          display: 'inline-block'
        }}>
          ← Back to Dashboard
        </Link>
      </nav>

      <div style={{ 
        backgroundColor: '#2d3e50', 
        padding: '30px', 
        borderRadius: '10px',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <h1 style={{ 
          color: '#00d9cc', 
          marginBottom: '20px',
          fontSize: '2.5rem'
        }}>
          {rally.name}
        </h1>
        <div>
          <p style={{ marginBottom: '10px', fontSize: '1.1rem' }}>
            <strong>Location:</strong> {rally.location}
          </p>
          <p style={{ fontSize: '1.1rem' }}>
            <strong>Dates:</strong> {' '}
            {new Date(rally.start_date).toLocaleDateString()} - {' '}
            {new Date(rally.end_date).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  )
}
