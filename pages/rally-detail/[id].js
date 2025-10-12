import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function RallyDetail() {
  const router = useRouter()
  const { id } = router.query
  const [rally, setRally] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    const fetchRally = async () => {
      if (!id) return

      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
          router.push('/login')
          return
        }

        const rallyId = String(id)

        const { data, error: fetchError } = await supabase
          .from('rally_events')
          .select('*')
          .eq('id', rallyId)
          .single()

        if (fetchError) {
          setError(fetchError.message)
          setLoading(false)
          return
        }

        setRally(data)
        setLoading(false)

      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    if (router.isReady) fetchRally()
  }, [id, router.isReady])

  const handleDelete = async () => {
    try {
      await supabase.from('rally_events').delete().eq('id', rally.id)
      router.push('/my-dashboard')
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <div style={{ minHeight: '100vh', background: '#1e2a3a', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>
  if (error) return <div style={{ minHeight: '100vh', background: '#1e2a3a', color: 'white', padding: '40px', textAlign: 'center' }}><h1 style={{ color: '#FF5252' }}>Error</h1><p>{error}</p><Link href="/my-dashboard" style={{ color: '#00d9cc' }}>← Back</Link></div>
  if (!rally) return <div style={{ minHeight: '100vh', background: '#1e2a3a', color: 'white', padding: '40px', textAlign: 'center' }}><h1>Rally not found</h1><Link href="/my-dashboard" style={{ color: '#00d9cc' }}>← Back</Link></div>

  return (
    <div style={{ minHeight: '100vh', background: '#1e2a3a', color: 'white', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px 40px', background: 'linear-gradient(180deg, #000000 0%, rgba(30, 42, 58, 0) 100%)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'white' }}>
          <img src="https://eu.chat-img.sintra.ai/dc1642b4-24d4-4708-b881-4a4a3d091f51/085dd2a1-4cb2-4eec-ad91-6a8aa0a1b119/channels4_profile.jpeg" style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '12px' }} />
          <span style={{ fontSize: '1.5rem', fontWeight: '700' }}>Rally Planner</span>
        </Link>
        <Link href="/my-dashboard" style={{ color: '#00d9cc', textDecoration: 'none', fontWeight: '600' }}>← Dashboard</Link>
      </nav>

      <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ background: '#2d3e50', borderRadius: '16px', padding: '40px', border: '1px solid rgba(255, 255, 255, 0.05)', position: 'relative' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '24px' }}>{rally.name}</h1>
          <p style={{ fontSize: '1.2rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '12px' }}>📅 {new Date(rally.start_date).toLocaleDateString('en-GB')} - {new Date(rally.end_date).toLocaleDateString('en-GB')}</p>
          <p style={{ fontSize: '1.2rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '20px' }}>📍 {rally.location}</p>
          {rally.description && <p style={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.6' }}>{rally.description}</p>}
          
          <button onClick={() => setShowDeleteConfirm(true)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255, 82, 82, 0.2)', color: '#FF5252', border: '1px solid #FF5252', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Delete Rally</button>
        </div>

        {showDeleteConfirm && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div style={{ background: '#2d3e50', border: '2px solid #FF5252', borderRadius: '16px', padding: '40px', textAlign: 'center', maxWidth: '400px' }}>
              <h2 style={{ color: '#FF5252', marginBottom: '20px' }}>Delete Rally?</h2>
              <p style={{ color: 'white', marginBottom: '30px' }}>Are you sure you want to delete "{rally.name}"? This cannot be undone.</p>
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                <button onClick={() => setShowDeleteConfirm(false)} style={{ padding: '12px 24px', background: 'rgba(255, 255, 255, 0.1)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
                <button onClick={handleDelete} style={{ padding: '12px 24px', background: '#FF5252', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
