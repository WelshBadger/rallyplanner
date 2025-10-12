import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import Link from 'next/link'

export default function AddRally() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [rallyData, setRallyData] = useState({
    name: '',
    start_date: '',
    end_date: '',
    location: '',
    description: ''
  })
  const [error, setError] = useState(null)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        router.push('/login')
        return
      }
      
      setUser(user)
    }

    checkUser()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setRallyData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const { data, error } = await supabase
        .from('rally_events')
        .insert({
          ...rallyData,
          user_id: user.id
        })
        .select()

      if (error) throw error

      router.push(`/rally-detail/\${data[0].id}`)

    } catch (err) {
      console.error('Add Rally Error:', err)
      setError(err.message)
    }
  }

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
        <Link href="/my-dashboard" style={{ color: '#00d9cc', textDecoration: 'none', fontWeight: '600' }}>← Dashboard</Link>
      </nav>

      <div style={{ padding: '40px 20px', maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '32px' }}>Add New Rally</h1>
        
        {error && (
          <div style={{ background: 'rgba(255, 82, 82, 0.1)', border: '1px solid #FF5252', color: '#FF5252', padding: '15px', marginBottom: '20px', borderRadius: '8px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ background: '#2d3e50', padding: '32px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.9)', fontWeight: '500' }}>Rally Name</label>
            <input
              type="text"
              name="name"
              value={rallyData.name}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '14px', background: '#1e2a3a', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'white', fontSize: '1rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.9)', fontWeight: '500' }}>Start Date</label>
              <input
                type="date"
                name="start_date"
                value={rallyData.start_date}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '14px', background: '#1e2a3a', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'white', fontSize: '1rem' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.9)', fontWeight: '500' }}>End Date</label>
              <input
                type="date"
                name="end_date"
                value={rallyData.end_date}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '14px', background: '#1e2a3a', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'white', fontSize: '1rem' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.9)', fontWeight: '500' }}>Location</label>
            <input
              type="text"
              name="location"
              value={rallyData.location}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '14px', background: '#1e2a3a', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'white', fontSize: '1rem' }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.9)', fontWeight: '500' }}>Description (Optional)</label>
            <textarea
              name="description"
              value={rallyData.description}
              onChange={handleChange}
              style={{ width: '100%', padding: '14px', background: '#1e2a3a', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'white', minHeight: '100px', fontSize: '1rem' }}
            />
          </div>

          <button
            type="submit"
            style={{ width: '100%', padding: '16px', background: '#00d9cc', color: '#000', border: 'none', borderRadius: '25px', fontWeight: '700', cursor: 'pointer', fontSize: '1rem' }}
          >
            Create Rally
          </button>
        </form>
      </div>
    </div>
  )
}
