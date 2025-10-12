import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'

export default function DataEntry() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [rallies, setRallies] = useState([])
  const [scheduleForm, setScheduleForm] = useState({
    rally_id: '',
    title: '',
    event_date: '',
    event_time: '',
    type: 'other',
    location: ''
  })

  useEffect(() => {
    const fetchUserAndRallies = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)

      const { data: userRallies } = await supabase
        .from('rally_events')
        .select('*')
        .eq('user_id', user.id)
        .order('start_date')

      setRallies(userRallies || [])
    }
    fetchUserAndRallies()
  }, [])

  const handleAddScheduleItem = async (e) => {
    e.preventDefault()
    
    if (!scheduleForm.rally_id) {
      alert('Please select a rally')
      return
    }

    try {
      const { error } = await supabase.from('schedule_items').insert({
        user_id: user.id,
        rally_id: scheduleForm.rally_id,
        title: scheduleForm.title,
        event_date: scheduleForm.event_date,
        event_time: scheduleForm.event_time,
        type: scheduleForm.type,
        location: scheduleForm.location
      })

      if (error) throw error

      alert('Schedule item added successfully!')
      setScheduleForm({
        rally_id: '',
        title: '',
        event_date: '',
        event_time: '',
        type: 'other',
        location: ''
      })
    } catch (error) {
      alert('Error adding schedule item: ' + error.message)
    }
  }

  const userInitial = user?.user_metadata?.full_name?.[0] || 
                      user?.email?.[0] || 
                      user?.name?.[0] || 
                      'U'

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: 'white', fontFamily: 'Arial' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Link href="/home" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'white' }}>
          <img src="https://eu.chat-img.sintra.ai/dc1642b4-24d4-4708-b881-4a4a3d091f51/085dd2a1-4cb2-4eec-ad91-6a8aa0a1b119/channels4_profile.jpeg" style={{ width: '40px', height: '40px', marginRight: '12px' }} />
          <span style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>Rally Planner</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Link href="/my-dashboard" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>← Dashboard</Link>
          <div style={{ 
            width: '45px', 
            height: '45px', 
            background: '#00ff88', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: '#000', 
            fontWeight: 'bold', 
            fontSize: '1.2rem' 
          }}>
            {userInitial.toUpperCase()}
          </div>
        </div>
      </nav>

      <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ color: '#00ff88', marginBottom: '30px' }}>Data Entry</h1>

        {/* Add Schedule Item Form */}
        <div style={{ 
          background: 'rgba(255,255,255,0.05)', 
          border: '1px solid rgba(255,255,255,0.1)', 
          borderRadius: '12px', 
          padding: '30px' 
        }}>
          <h2 style={{ color: '#00ff88', marginBottom: '20px' }}>Add Schedule Item</h2>
          <form onSubmit={handleAddScheduleItem}>
            <select 
              required 
              value={scheduleForm.rally_id} 
              onChange={(e) => setScheduleForm({...scheduleForm, rally_id: e.target.value})}
              style={{ 
                width: '100%', 
                padding: '10px', 
                background: 'rgba(255,255,255,0.1)', 
                border: '1px solid rgba(255,255,255,0.2)', 
                borderRadius: '8px', 
                color: 'white', 
                marginBottom: '10px' 
              }}
            >
              <option value="">Select Rally</option>
              {rallies.map(rally => (
                <option key={rally.id} value={rally.id}>
                  {rally.name} ({new Date(rally.start_date).toLocaleDateString()})
                </option>
              ))}
            </select>

            <input 
              type="text" 
              placeholder="Title" 
              required
              value={scheduleForm.title}
              onChange={(e) => setScheduleForm({...scheduleForm, title: e.target.value})}
              style={{ 
                width: '100%', 
                padding: '10px', 
                background: 'rgba(255,255,255,0.1)', 
                border: '1px solid rgba(255,255,255,0.2)', 
                borderRadius: '8px', 
                color: 'white', 
                marginBottom: '10px' 
              }}
            />

            <input 
              type="date" 
              required
              value={scheduleForm.event_date}
              onChange={(e) => setScheduleForm({...scheduleForm, event_date: e.target.value})}
              style={{ 
                width: '100%', 
                padding: '10px', 
                background: 'rgba(255,255,255,0.1)', 
                border: '1px solid rgba(255,255,255,0.2)', 
                borderRadius: '8px', 
                color: 'white', 
                marginBottom: '10px' 
              }}
            />

            <input 
              type="time" 
              required
              value={scheduleForm.event_time}
              onChange={(e) => setScheduleForm({...scheduleForm, event_time: e.target.value})}
              style={{ 
                width: '100%', 
                padding: '10px', 
                background: 'rgba(255,255,255,0.1)', 
                border: '1px solid rgba(255,255,255,0.2)', 
                borderRadius: '8px', 
                color: 'white', 
                marginBottom: '10px' 
              }}
            />

            <input 
              type="text" 
              placeholder="Location" 
              value={scheduleForm.location}
              onChange={(e) => setScheduleForm({...scheduleForm, location: e.target.value})}
              style={{ 
                width: '100%', 
                padding: '10px', 
                background: 'rgba(255,255,255,0.1)', 
                border: '1px solid rgba(255,255,255,0.2)', 
                borderRadius: '8px', 
                color: 'white', 
                marginBottom: '10px' 
              }}
            />

            <button 
              type="submit" 
              style={{ 
                background: '#00ff88', 
                color: '#000', 
                border: 'none', 
                padding: '10px', 
                borderRadius: '8px', 
                fontWeight: 'bold', 
                cursor: 'pointer', 
                width: '100%' 
              }}
            >
              Add Schedule Item
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
