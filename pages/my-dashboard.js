import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

export default function MyDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [rallies, setRallies] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const checkUserAndFetchRallies = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
          router.push('/login')
          return
        }

        setUser(user)

        const { data: userRallies, error: ralliesError } = await supabase
          .from('rally_events')
          .select('*')
          .eq('user_id', user.id)
          .order('start_date')

        if (ralliesError) throw ralliesError

        setRallies(userRallies || [])

      } catch (err) {
        console.error('Dashboard Error:', err)
        setError(err.message)
      }
    }

    checkUserAndFetchRallies()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (error) return <div>Error: {error}</div>
  if (!user) return <div>Loading...</div>

  return (
    <div style={{ minHeight: '100vh', background: '#1e2a3a', color: 'white', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Gradient Header */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px 40px',
        background: 'linear-gradient(180deg, #000000 0%, rgba(30, 42, 58, 0) 100%)'
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'white' }}>
          <img src="https://eu.chat-img.sintra.ai/dc1642b4-24d4-4708-b881-4a4a3d091f51/085dd2a1-4cb2-4eec-ad91-6a8aa0a1b119/channels4_profile.jpeg" style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '12px' }} />
          <span style={{ fontSize: '1.5rem', fontWeight: '700' }}>Rally Planner</span>
        </Link>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link href="/add-rally" style={{ color: '#00d9cc', textDecoration: 'none', fontWeight: '600' }}>Add Rally</Link>
          <button onClick={handleLogout} style={{ padding: '10px 24px', background: '#00d9cc', color: '#000', border: 'none', borderRadius: '20px', fontWeight: '700', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </nav>

      <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '32px', color: 'white' }}>My Rallies</h1>
        
        {rallies.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '1.2rem', marginBottom: '24px' }}>No rallies yet</p>
            <Link href="/add-rally" style={{ display: 'inline-block', padding: '16px 32px', background: '#00d9cc', color: '#000', borderRadius: '25px', textDecoration: 'none', fontWeight: '700' }}>
              Create Your First Rally
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {rallies.map(rally => (
              <Link 
                key={rally.id} 
                href={`/rally-detail/${rally.id}`}
                style={{ textDecoration: 'none' }}
              >
                <div style={{ 
                  background: '#2d3e50', 
                  borderRadius: '16px', 
                  padding: '28px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s'
                }}>
                  <h2 style={{ color: 'white', fontSize: '1.3rem', fontWeight: '700', marginBottom: '12px' }}>{rally.name}</h2>
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '8px' }}>
                    📅 {new Date(rally.start_date).toLocaleDateString('en-GB')} - {new Date(rally.end_date).toLocaleDateString('en-GB')}
                  </p>
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>📍 {rally.location}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
