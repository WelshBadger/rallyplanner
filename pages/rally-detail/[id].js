import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function RallyDetail() {
  const router = useRouter()
  const { id } = router.query
  const [rally, setRally] = useState(null)
  const [teamMembers, setTeamMembers] = useState([])
  const [assignedTeam, setAssignedTeam] = useState([])
  const [scheduleItems, setScheduleItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAssignTeam, setShowAssignTeam] = useState(false)
  const [showAddSchedule, setShowAddSchedule] = useState(false)
  const [scheduleForm, setScheduleForm] = useState({ 
    title: '', 
    date: '', 
    time: '', 
    location: '', 
    description: '', 
    item_type: '' 
  })

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data: r } = await supabase.from('rally_events').select('*').eq('id', id).single()
      setRally(r)
      const { data: t } = await supabase.from('team_members').select('*').eq('user_id', user.id).order('name')
      setTeamMembers(t || [])
      const { data: a } = await supabase.from('rally_team_assignments').select('*, team_members (*)').eq('rally_id', id)
      setAssignedTeam(a || [])
      const { data: s } = await supabase.from('schedule_items').select('*').eq('rally_id', id).order('date', { ascending: true })
      setScheduleItems(s || [])
      setLoading(false)
    }
    if (router.isReady) fetchData()
  }, [id, router.isReady])

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/') }
  
  const handleAssign = async (memberId) => {
    await supabase.from('rally_team_assignments').insert({ rally_id: rally.id, team_member_id: memberId })
    const { data: a } = await supabase.from('rally_team_assignments').select('*, team_members (*)').eq('rally_id', rally.id)
    setAssignedTeam(a || [])
    setShowAssignTeam(false)
  }

  const handleUnassign = async (assignmentId) => {
    await supabase.from('rally_team_assignments').delete().eq('id', assignmentId)
    const { data: a } = await supabase.from('rally_team_assignments').select('*, team_members (*)').eq('rally_id', rally.id)
    setAssignedTeam(a || [])
  }

  const handleAddSchedule = async (e) => {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('schedule_items').insert({ 
      ...scheduleForm, 
      rally_id: rally.id, 
      user_id: user.id 
    })
    const { data: s } = await supabase.from('schedule_items').select('*').eq('rally_id', rally.id).order('date', { ascending: true })
    setScheduleItems(s || [])
    setShowAddSchedule(false)
    setScheduleForm({ title: '', date: '', time: '', location: '', description: '', item_type: '' })
  }

  const handleDeleteSchedule = async (scheduleId) => {
    await supabase.from('schedule_items').delete().eq('id', scheduleId)
    const { data: s } = await supabase.from('schedule_items').select('*').eq('rally_id', rally.id).order('date', { ascending: true })
    setScheduleItems(s || [])
  }

  if (loading || !rally) return <div style={{ minHeight: '100vh', background: '#1e2a3a', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>

  const assignedIds = assignedTeam.map(a => a.team_member_id)
  const unassigned = teamMembers.filter(m => !assignedIds.includes(m.id))

  return (
    <div style={{ minHeight: '100vh', background: '#1e2a3a', color: 'white', fontFamily: 'system-ui' }}>
      {/* Rest of the existing code remains the same */}
      
      {showAssignTeam && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }} onClick={() => setShowAssignTeam(false)}>
          <div style={{ background: '#2d3e50', borderRadius: '16px', padding: '40px', maxWidth: '500px', width: '90%', maxHeight: '80vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginBottom: '20px' }}>Assign Team Member</h2>
            {unassigned.length === 0 ? <p style={{ color: 'rgba(255, 255, 255, 0.5)' }}>All team members assigned.</p> : unassigned.map(m => (
              <div key={m.id} onClick={() => handleAssign(m.id)} style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '16px', borderRadius: '8px', marginBottom: '8px', cursor: 'pointer', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <p style={{ fontWeight: '600' }}>{m.name}</p>
                <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>{m.role || 'Team Member'}</p>
              </div>
            ))}
            <button onClick={() => setShowAssignTeam(false)} style={{ width: '100%', padding: '12px', background: 'rgba(255, 255, 255, 0.1)', color: 'white', border: 'none', borderRadius: '8px', marginTop: '20px', cursor: 'pointer' }}>Close</button>
          </div>
        </div>
      )}

      {showAddSchedule && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }} onClick={() => setShowAddSchedule(false)}>
          <div style={{ background: '#2d3e50', borderRadius: '16px', padding: '40px', maxWidth: '500px', width: '90%' }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginBottom: '20px' }}>Add Schedule Item</h2>
            <form onSubmit={handleAddSchedule}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Title *</label>
                <input 
                  type="text" 
                  value={scheduleForm.title} 
                  onChange={(e) => setScheduleForm({...scheduleForm, title: e.target.value})} 
                  required 
                  style={{ width: '100%', padding: '12px', background: '#1e2a3a', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'white' }} 
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Date *</label>
                  <input 
                    type="date" 
                    value={scheduleForm.date} 
                    onChange={(e) => setScheduleForm({...scheduleForm, date: e.target.value})} 
                    required 
                    style={{ width: '100%', padding: '12px', background: '#1e2a3a', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'white' }} 
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Time</label>
                  <input 
                    type="time" 
                    value={scheduleForm.time} 
                    onChange={(e) => setScheduleForm({...scheduleForm, time: e.target.value})} 
                    style={{ width: '100%', padding: '12px', background: '#1e2a3a', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'white' }} 
                  />
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Location</label>
                <input 
                  type="text" 
                  value={scheduleForm.location} 
                  onChange={(e) => setScheduleForm({...scheduleForm, location: e.target.value})} 
                  style={{ width: '100%', padding: '12px', background: '#1e2a3a', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'white' }} 
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Type</label>
                <select 
                  value={scheduleForm.item_type} 
                  onChange={(e) => setScheduleForm({...scheduleForm, item_type: e.target.value})} 
                  style={{ width: '100%', padding: '12px', background: '#1e2a3a', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'white' }}
                >
                  <option value="">Select type...</option>
                  <option value="scrutineering">Scrutineering</option>
                  <option value="recce">Recce</option>
                  <option value="stage">Stage</option>
                  <option value="service">Service</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Description</label>
                <textarea 
                  value={scheduleForm.description} 
                  onChange={(e) => setScheduleForm({...scheduleForm, description: e.target.value})} 
                  style={{ width: '100%', padding: '12px', background: '#1e2a3a', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'white', minHeight: '80px' }} 
                />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  type="button" 
                  onClick={() => setShowAddSchedule(false)} 
                  style={{ flex: 1, padding: '12px', background: 'rgba(255, 255, 255, 0.1)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={{ flex: 1, padding: '12px', background: '#00d9cc', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
