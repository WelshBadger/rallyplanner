import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [rallies, setRallies] = useState([])
  const [showScheduleForm, setShowScheduleForm] = useState(false)
  const [scheduleForm, setScheduleForm] = useState({
    rally_id: '',
    title: '',
    event_date: '',
    event_time: '',
    type: 'other',
    location: ''
  })

  useEffect(() => {
    const fetchData = async () => {
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
    fetchData()
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

      alert('Schedule item added!')
      setScheduleForm({
        rally_id: '',
        title: '',
        event_date: '',
        event_time: '',
        type: 'other',
        location: ''
      })
      setShowScheduleForm(false)
    } catch (error) {
      alert('Error: ' + error.message)
    }
  }

  const userInitial = (user?.user_metadata?.full_name?.[0] || user?.email?.[0] || 'U').toUpperCase()

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: 'white', fontFamily: 'Arial' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Link href="/home" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'white' }}>
          <img src="https://eu.chat-img.sintra.ai/dc1642b4-24d4-4708-b881-4a4a3d091f51/085dd2a1-4cb2-4eec-ad91-6a8aa0a1b119/channels4_profile.jpeg" style={{ width: '40px', height: '40px', marginRight: '12px' }} />
          <span style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>Rally Planner</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Link href="/my-dashboard" style={{ background: '#00ff88', color: '#000', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>My Dashboard</Link>
          <div style={{ width: '45px', height: '45px', background: '#00ff88', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold', fontSize: '1.2rem' }}>{userInitial}</div>
        </div>
      </nav>

      <div style={{ padding: '40px 20px', maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Data Entry</h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '40px' }}>Add and manage your rally information</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          {/* Upload Rally Documents */}
          <div style={{ background: 'rgba(0,255,136,0.1)', border: '2px solid #00ff88', borderRadius: '12px', padding: '40px', textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📄</div>
            <h3 style={{ color: '#00ff88', fontSize: '1.5rem', marginBottom: '10px' }}>Upload Rally Documents</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)' }}>Upload rally regulations, final instructions, or any PDF documents</p>
          </div>

          {/* Add Rally Event */}
          <Link href="/add-rally" style={{ textDecoration: 'none' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '40px', textAlign: 'center', cursor: 'pointer', height: '100%' }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🏁</div>
              <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '10px' }}>Add Rally Event</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)' }}>Manually add rally details, dates, and locations</p>
            </div>
          </Link>

          {/* Manage Team */}
          <Link href="/team" style={{ textDecoration: 'none' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '40px', textAlign: 'center', cursor: 'pointer', height: '100%' }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>👥</div>
              <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '10px' }}>Manage Team</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)' }}>Add team members, contacts, and emergency information</p>
            </div>
          </Link>

          {/* Add Schedule Items */}
          <div onClick={() => setShowScheduleForm(!showScheduleForm)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '40px', textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📅</div>
            <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '10px' }}>Add Schedule Items</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)' }}>Add scrutineering times, briefings, and stage schedules</p>
          </div>

          {/* Add Accommodation */}
          <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '40px', textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🏨</div>
            <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '10px' }}>Add Accommodation</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)' }}>Store hotel bookings and accommodation details</p>
          </div>

          {/* Add Notes */}
          <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '40px', textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📝</div>
            <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '10px' }}>Add Notes</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)' }}>Quick notes, reminders, and important information</p>
          </div>
        </div>

        {/* Schedule Form Modal */}
        {showScheduleForm && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '40px', maxWidth: '500px', width: '90%', position: 'relative' }}>
              <button onClick={() => setShowScheduleForm(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', color: 'white', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
              
              <h2 style={{ color: '#00ff88', marginBottom: '20px' }}>Add Schedule Item</h2>
              
              <form onSubmit={handleAddScheduleItem}>
                <select 
                  required 
                  value={scheduleForm.rally_id} 
                  onChange={(e) => setScheduleForm({...scheduleForm, rally_id: e.target.value})}
                  style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white', marginBottom: '10px' }}
                >
                  <option value="">Select Rally *</option>
                  {rallies.map(rally => (
                    <option key={rally.id} value={rally.id} style={{ background: '#000' }}>
                      {rally.name} ({new Date(rally.start_date).toLocaleDateString('en-GB')})
                    </option>
                  ))}
                </select>

                <input 
                  type="text" 
                  placeholder="Title *" 
                  required
                  value={scheduleForm.title}
                  onChange={(e) => setScheduleForm({...scheduleForm, title: e.target.value})}
                  style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white', marginBottom: '10px' }}
                />

                <input 
                  type="date" 
                  required
                  value={scheduleForm.event_date}
                  onChange={(e) => setScheduleForm({...scheduleForm, event_date: e.target.value})}
                  style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white', marginBottom: '10px' }}
                />

                <input 
                  type="time" 
                  required
                  value={scheduleForm.event_time}
                  onChange={(e) => setScheduleForm({...scheduleForm, event_time: e.target.value})}
                  style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white', marginBottom: '10px' }}
                />

                <input 
                  type="text" 
                  placeholder="Location" 
                  value={scheduleForm.location}
                  onChange={(e) => setScheduleForm({...scheduleForm, location: e.target.value})}
                  style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white', marginBottom: '10px' }}
                />

                <button 
                  type="submit" 
                  style={{ background: '#00ff88', color: '#000', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}
                >
                  Add Schedule Item
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
