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
  const [loading, setLoading] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showAssignTeam, setShowAssignTeam] = useState(false)

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
      
      setLoading(false)
    }
    if (router.isReady) fetchData()
  }, [id, router.isReady])

  const handleDelete = async () => {
    await supabase.from('rally_events').delete().eq('id', rally.id)
    router.push('/my-dashboard')
  }

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

  if (loading || !rally) return <div style={{ minHeight: '100vh', background: '#1e2a3a', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>

  const assignedIds = assignedTeam.map(a => a.team_member_id)
  const unassigned = teamMembers.filter(m => !assignedIds.includes(m.id))

  return (
    <div style={{ minHeight: '100vh', background: '#1e2a3a', color: 'white', fontFamily: 'system-ui' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px 40px', background: 'linear-gradient(180deg, #000000 0%, rgba(30, 42, 58, 0) 100%)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'white' }}>
          <img src="https://eu.chat-img.sintra.ai/dc1642b4-24d4-4708-b881-4a4a3d091f51/085dd2a1-4cb2-4eec-ad91-6a8aa0a1b119/channels4_profile.jpeg" style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '12px' }} />
          <span style={{ fontSize: '1.5rem', fontWeight: '700' }}>Rally Planner</span>
        </Link>
        <Link href="/my-dashboard" style={{ color: '#00d9cc', textDecoration: 'none', fontWeight: '600' }}>← Dashboard</Link>
      </nav>

      <div style={{ padding: '40px 20px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ background: '#2d3e50', borderRadius: '16px', padding: '40px', border: '1px solid rgba(255, 255, 255, 0.05)', marginBottom: '24px', position: 'relative' }}>
          <button onClick={() => setShowDeleteConfirm(true)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255, 82, 82, 0.2)', color: '#FF5252', border: '1px solid #FF5252', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' }}>Delete</button>
          <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '24px' }}>{rally.name}</h1>
          <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
            <div><p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.85rem', marginBottom: '4px' }}>DATES</p><p style={{ fontSize: '1.1rem', fontWeight: '600' }}>📅 {new Date(rally.start_date).toLocaleDateString('en-GB')} - {new Date(rally.end_date).toLocaleDateString('en-GB')}</p></div>
            <div><p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.85rem', marginBottom: '4px' }}>LOCATION</p><p style={{ fontSize: '1.1rem', fontWeight: '600' }}>📍 {rally.location}</p></div>
          </div>
          {rally.description && <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}><p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{rally.description}</p></div>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
          <div style={{ background: '#2d3e50', borderRadius: '16px', padding: '28px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>Team</h2>
              <button onClick={() => setShowAssignTeam(true)} style={{ padding: '6px 16px', background: 'rgba(0, 217, 204, 0.2)', color: '#00d9cc', border: '1px solid #00d9cc', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}>+ Assign</button>
            </div>
            {assignedTeam.length === 0 ? <p style={{ color: 'rgba(255, 255, 255, 0.5)' }}>No team assigned.</p> : assignedTeam.map(a => (
              <div key={a.id} style={{ background: 'rgba(0, 217, 204, 0.05)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(0, 217, 204, 0.2)', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <div><p style={{ fontWeight: '600', fontSize: '0.95rem' }}>{a.team_members.name}</p><p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.85rem' }}>{a.team_members.role || 'Team Member'}</p></div>
                <button onClick={() => handleUnassign(a.id)} style={{ background: 'rgba(255, 82, 82, 0.2)', color: '#FF5252', border: '1px solid #FF5252', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}>Remove</button>
              </div>
            ))}
          </div>

          <div style={{ background: '#2d3e50', borderRadius: '16px', padding: '28px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>Schedule</h2>
              <button style={{ padding: '6px 16px', background: 'rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.5)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '12px', fontSize: '0.85rem', cursor: 'not-allowed' }}>+ Add</button>
            </div>
            <p style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Coming soon...</p>
          </div>

          <div style={{ background: '#2d3e50', borderRadius: '16px', padding: '28px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>Documents</h2>
              <button style={{ padding: '6px 16px', background: 'rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.5)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '12px', fontSize: '0.85rem', cursor: 'not-allowed' }}>+ Upload</button>
            </div>
            <p style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Coming soon...</p>
          </div>

          <div style={{ background: '#2d3e50', borderRadius: '16px', padding: '28px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>Notes</h2>
              <button style={{ padding: '6px 16px', background: 'rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.5)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '12px', fontSize: '0.85rem', cursor: 'not-allowed' }}>+ Add</button>
            </div>
            <p style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Coming soon...</p>
          </div>
        </div>
      </div>

      {showDeleteConfirm && <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}><div style={{ background: '#2d3e50', border: '2px solid #FF5252', borderRadius: '16px', padding: '40px', textAlign: 'center', maxWidth: '400px' }}><h2 style={{ color: '#FF5252', marginBottom: '20px' }}>Delete Rally?</h2><p style={{ marginBottom: '30px' }}>Delete "{rally.name}"?</p><div style={{ display: 'flex', gap: '15px' }}><button onClick={() => setShowDeleteConfirm(false)} style={{ flex: 1, padding: '12px', background: 'rgba(255, 255, 255, 0.1)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button><button onClick={handleDelete} style={{ flex: 1, padding: '12px', background: '#FF5252', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Delete</button></div></div></div>}

      {showAssignTeam && <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}><div style={{ background: '#2d3e50', borderRadius: '16px', padding: '40px', maxWidth: '500px', width: '90%', maxHeight: '80vh', overflow: 'auto' }}><h2 style={{ marginBottom: '20px' }}>Assign Team Member</h2>{unassigned.length === 0 ? <p style={{ color: 'rgba(255, 255, 255, 0.5)' }}>All team members assigned.</p> : unassigned.map(m => <div key={m.id} onClick={() => handleAssign(m.id)} style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '16px', borderRadius: '8px', marginBottom: '8px', cursor: 'pointer', border: '1px solid rgba(255, 255, 255, 0.1)' }}><p style={{ fontWeight: '600' }}>{m.name}</p><p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>{m.role || 'Team Member'}</p></div>)}<button onClick={() => setShowAssignTeam(false)} style={{ width: '100%', padding: '12px', background: 'rgba(255, 255, 255, 0.1)', color: 'white', border: 'none', borderRadius: '8px', marginTop: '20px', cursor: 'pointer' }}>Close</button></div></div>}
    </div>
  )
}
cursor: 'not-allowed' }}>+ Add</button>
            </div>
            <p style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Coming soon...</p>
          </div>
        </div>
      </div>

      {showDeleteConfirm && <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}><div style={{ background: '#2d3e50', border: '2px solid #FF5252', borderRadius: '16px', padding: '40px', textAlign: 'center', maxWidth: '400px' }}><h2 style={{ color: '#FF5252', marginBottom: '20px' }}>Delete Rally?</h2><p style={{ marginBottom: '30px' }}>Delete "{rally.name}"?</p><div style={{ display: 'flex', gap: '15px' }}><button onClick={() => setShowDeleteConfirm(false)} style={{ flex: 1, padding: '12px', background: 'rgba(255, 255, 255, 0.1)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button><button onClick={handleDelete} style={{ flex: 1, padding: '12px', background: '#FF5252', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Delete</button></div></div></div>}

      {showAssignTeam && <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}><div style={{ background: '#2d3e50', borderRadius: '16px', padding: '40px', maxWidth: '500px', width: '90%', maxHeight: '80vh', overflow: 'auto' }}><h2 style={{ marginBottom: '20px' }}>Assign Team Member</h2>{unassigned.length === 0 ? <p style={{ color: 'rgba(255, 255, 255, 0.5)' }}>All team members assigned.</p> : unassigned.map(m => <div key={m.id} onClick={() => handleAssign(m.id)} style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '16px', borderRadius: '8px', marginBottom: '8px', cursor: 'pointer', border: '1px solid rgba(255, 255, 255, 0.1)' }}><p style={{ fontWeight: '600' }}>{m.name}</p><p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>{m.role || 'Team Member'}</p></div>)}<button onClick={() => setShowAssignTeam(false)} style={{ width: '100%', padding: '12px', background: 'rgba(255, 255, 255, 0.1)', color: 'white', border: 'none', borderRadius: '8px', marginTop: '20px', cursor: 'pointer' }}>Close</button></div></div>}

      {showAddSchedule && <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}><div style={{ background: '#2d3e50', borderRadius: '16px', padding: '40px', maxWidth: '500px', width: '90%' }}><h2 style={{ marginBottom: '20px' }}>Add Schedule Item</h2><form onSubmit={handleAddSchedule}><div style={{ marginBottom: '16px' }}><label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Title *</label><input type="text" value={scheduleForm.title} onChange={(e) => setScheduleForm({...scheduleForm, title: e.target.value})} required style={{ width: '100%', padding: '12px', background: '#1e2a3a', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'white' }} /></div><div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}><div style={{ flex: 1 }}><label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Date *</label><input type="date" value={scheduleForm.date} onChange={(e) => setScheduleForm({...scheduleForm, date: e.target.value})} required style={{ width: '100%', padding: '12px', background: '#1e2a3a', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'white' }} /></div><div style={{ flex: 1 }}><label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Time</label><input type="time" value={scheduleForm.time} onChange={(e) => setScheduleForm({...scheduleForm, time: e.target.value})} style={{ width: '100%', padding: '12px', background: '#1e2a3a', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'white' }} /></div></div><div style={{ marginBottom: '16px' }}><label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Location</label><input type="text" value={scheduleForm.location} onChange={(e) => setScheduleForm({...scheduleForm, location: e.target.value})} style={{ width: '100%', padding: '12px', background: '#1e2a3a', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'white' }} /></div><div style={{ marginBottom: '16px' }}><label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Type</label><select value={scheduleForm.item_type} onChange={(e) => setScheduleForm({...scheduleForm, item_type: e.target.value})} style={{ width: '100%', padding: '12px', background: '#1e2a3a', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'white' }}><option value="">Select type...</option><option value="scrutineering">Scrutineering</option><option value="recce">Recce</option><option value="stage">Stage</option><option value="service">Service</option><option value="other">Other</option></select></div><div style={{ marginBottom: '20px' }}><label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Description</label><textarea value={scheduleForm.description} onChange={(e) => setScheduleForm({...scheduleForm, description: e.target.value})} style={{ width: '100%', padding: '12px', background: '#1e2a3a', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'white', minHeight: '80px' }} /></div><div style={{ display: 'flex', gap: '12px' }}><button type="button" onClick={() => setShowAddSchedule(false)} style={{ flex: 1, padding: '12px', background: 'rgba(255, 255, 255, 0.1)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button><button type="submit" style={{ flex: 1, padding: '12px', background: '#00d9cc', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Add</button></div></form></div></div>}
    </div>
  )
}
