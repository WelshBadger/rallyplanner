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

  if (loading) return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#1e2a3a', 
      color: 'white', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      fontFamily: 'system-ui'
    }}>
      Loading...
    </div>
  )

  if (error) return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#1e2a3a', 
      color: 'white', 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center',
      fontFamily: 'system-ui',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h2 style={{ color: '#ff5252', marginBottom: '20px' }}>🚨 {error}</h2>
      <div style={{ display: 'flex', gap: '20px' }}>
        <button 
          onClick={() => router.reload()}
          style={{
            padding: '10px 20px',
            background: '#00d9cc',
            color: 'black',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Try Again
        </button>
        <button 
          onClick={() => router.push('/my-dashboard')}
          style={{
            padding: '10px 20px',
            background: 'rgba(0, 217, 204, 0.2)',
            color: '#00d9cc',
            border: '1px solid #00d9cc',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#1e2a3a', 
      color: 'white',
      fontFamily: 'system-ui'
    }}>
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '20px 40px', 
        background: 'linear-gradient(180deg, #000000 0%, rgba(30, 42, 58, 0) 100%)' 
      }}>
        <Link href="/my-dashboard" style={{ 
          color: '#00d9cc', 
          textDecoration: 'none', 
          display: 'flex', 
          alignItems: 'center' 
        }}>
          ← Back to Dashboard
        </Link>
        <button 
          onClick={handleLogout}
          style={{
            padding: '8px 20px',
            background: '#00d9cc',
            color: 'black',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </nav>

      <div style={{ 
        padding: '40px 20px', 
        maxWidth: '1200px', 
        margin: '0 auto' 
      }}>
        <div style={{ 
          background: '#2d3e50', 
          borderRadius: '16px', 
          padding: '40px', 
          marginBottom: '24px' 
        }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            marginBottom: '20px', 
            color: '#00d9cc' 
          }}>
            {rally.name}
          </h1>
          <div style={{ 
            display: 'flex', 
            gap: '24px', 
            marginBottom: '24px' 
          }}>
            <div>
              <p style={{ 
                color: 'rgba(255,255,255,0.6)', 
                marginBottom: '8px' 
              }}>
                Location
              </p>
              <p style={{ 
                fontSize: '1.2rem', 
                fontWeight: 'bold' 
              }}>
                {rally.location}
              </p>
            </div>
            <div>
              <p style={{ 
                color: 'rgba(255,255,255,0.6)', 
                marginBottom: '8px' 
              }}>
                Dates
              </p>
              <p style={{ 
                fontSize: '1.2rem', 
                fontWeight: 'bold' 
              }}>
                {new Date(rally.start_date).toLocaleDateString()} - {' '}
                {new Date(rally.end_date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps(context) {
  console.log('Server-side Rally ID:', context.params.id)
  return { props: {} }
}
