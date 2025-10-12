import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabase'

export default function RallyPage() {
  const router = useRouter()
  const { id } = router.query
  const [rally, setRally] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      loadRally()
    }
  }, [id])

  const loadRally = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        window.location.href = '/login'
        return
      }

      const { data, error } = await supabase
        .from('rally_events')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

      if (error) throw error

      setRally(data)
      setLoading(false)
    } catch (error) {
      console.error('Error loading rally:', error)
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    })
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#000000',
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ fontSize: '1.5rem' }}>Loading...</div>
      </div>
    )
  }

  if (!rally) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#000000',
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
      }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>Rally Not Found</h1>
        <Link href="/my-dashboard" style={{ color: '#00ff88' }}>← Back to Dashboard</Link>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src="https://eu.chat-img.sintra.ai/dc1642b4-24d4-4708-b881-4a4a3d091f51/085dd2a1-4cb2-4eec-ad91-6a8aa0a1b119/channels4_profile.jpeg"
            alt="Rally Planner"
            style={{ width: '40px', height: '40px', marginRight: '12px' }}
          />
          <span style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>Rally Planner</span>
        </div>
        <Link href="/calendar" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
          ← Back to Calendar
        </Link>
      </nav>

      <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          background: 'rgba(0, 255, 136, 0.1)',
          border: '2px solid #00ff88',
          borderRadius: '12px',
          padding: '40px',
          marginBottom: '40px'
        }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '20px', color: '#00ff88' }}>
            {rally.name}
          </h1>
          <div style={{ display: 'flex', gap: '30px', fontSize: '1.2rem', marginBottom: '20px' }}>
            <div>
              <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>📅 </span>
              {formatDate(rally.start_date)} - {formatDate(rally.end_date)}
            </div>
            <div>
              <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>📍 </span>
              {rally.location}
            </div>
            <div>
              <span style={{
                background: rally.status === 'upcoming' ? '#00ff88' : 'rgba(255, 255, 255, 0.3)',
                color: rally.status === 'upcoming' ? '#000000' : 'white',
                padding: '5px 15px',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: 'bold'
              }}>
                {rally.status}
              </span>
            </div>
          </div>
          {rally.description && (
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem', lineHeight: '1.6' }}>
              {rally.description}
            </p>
          )}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '30px'
          }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>📅 Schedule</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              No schedule items yet
            </p>
            <button style={{
              marginTop: '20px',
              background: '#00ff88',
              color: '#000000',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>
              + Add Schedule Item
            </button>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '30px'
          }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>👥 Team</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              No team members assigned
            </p>
            <Link href="/team">
              <button style={{
                marginTop: '20px',
                background: 'transparent',
                color: '#00ff88',
                border: '2px solid #00ff88',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}>
                Manage Team
              </button>
            </Link>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '30px'
          }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>📄 Documents</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              No documents uploaded
            </p>
            <Link href="/upload">
              <button style={{
                marginTop: '20px',
                background: 'transparent',
                color: '#00ff88',
                border: '2px solid #00ff88',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}>
                Upload Documents
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
