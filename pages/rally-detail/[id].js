import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function RallyDetail() {
  const router = useRouter()
  const { id } = router.query
  const [rally, setRally] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data: r } = await supabase.from('rally_events').select('*').eq('id', id).single()
      setRally(r)
      setLoading(false)
    }
    if (router.isReady) fetchData()
  }, [id, router.isReady])

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/') }

  if (loading || !rally) return <div style={{ minHeight: '100vh', background: '#1e2a3a', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>

  return (
    <div style={{ minHeight: '100vh', background: '#1e2a3a', color: 'white', fontFamily: 'system-ui' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px 40px', background: 'linear-gradient(180deg, #000000 0%, rgba(30, 42, 58, 0) 100%)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'white' }}>
          <img src="https://eu.chat-img.sintra.ai/dc1642b4-24d4-4708-b881-4a4a3d091f51/085dd2a1-4cb2-4eec-ad91-6a8aa0a1b119/channels4_profile.jpeg" style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '12px' }} alt="Logo" />
          <span style={{ fontSize: '1.5rem', fontWeight: '700' }}>Rally Planner</span>
        </Link>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link href="/my-dashboard" style={{ color: '#00d9cc', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}>Dashboard</Link>
          <Link href="/team" style={{ color: '#00d9cc', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}>Team</Link>
          <button onClick={handleLogout} style={{ padding: '8px 20px', background: '#00d9cc', color: '#000', border: 'none', borderRadius: '20px', fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem' }}>Logout</button>
        </div>
      </nav>
      <div style={{ padding: '40px 20px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ background: '#2d3e50', borderRadius: '16px', padding: '40px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '24px' }}>{rally.name}</h1>
          <p>📅 {new Date(rally.start_date).toLocaleDateString('en-GB')} - {new Date(rally.end_date).toLocaleDateString('en-GB')}</p>
          <p>📍 {rally.location}</p>
          {rally.description && <p style={{ marginTop: '20px', color: 'rgba(255, 255, 255, 0.7)' }}>{rally.description}</p>}
        </div>
        <p style={{ marginTop: '20px', textAlign: 'center', color: 'rgba(255, 255, 255, 0.5)' }}>Team, Schedule, Documents & Notes sections coming in next update...</p>
      </div>
    </div>
  )
}
