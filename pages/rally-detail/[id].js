import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function RallyDetail() {
  const router = useRouter()
  const { id } = router.query
  const [rally, setRally] = useState(null)
  const [teamMembers, setTeamMembers] = useState([])
  const [allTeamMembers, setAllTeamMembers] = useState([])
  const [scheduleItems, setScheduleItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState(null)
  const [scheduleForm, setScheduleForm] = useState({
    schedule_date: '',
    schedule_time: '',
    activity: '',
    location: '',
    notes: ''
  })

  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState(null)


  useEffect(() => {
    const fetchRallyDetails = async () => {
      if (!id) return

      try {
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
        
        const { data: team } = await supabase
          .from('rally_team_assignments')
          .select('*, team_members(*)')
          .eq('rally_id', id)

        const { data: allTeam } = await supabase
          .from('team_members')
          .select('*')
          .order('name')

        const { data: schedule } = await supabase
          .from('schedule_items')
          .select('*')
          .eq('rally_id', id)
          .order('date')

        setRally(r)
        setTeamMembers(team || [])
        setAllTeamMembers(allTeam || [])
        setScheduleItems(schedule || [])
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

  const handleAssignTeamMember = async (memberId) => {
    try {
      await supabase
        .from('rally_team_assignments')
        .insert({ rally_id: id, team_member_id: memberId })

      const { data: team } = await supabase
        .from('rally_team_assignments')
        .select('*, team_members(*)')
        .eq('rally_id', id)

      setTeamMembers(team || [])
      setShowAssignModal(false)
    } catch (err) {
      console.error('Error assigning team member:', err)
      alert('Failed to assign team member')
    }
  }

  const handleRemoveTeamMember = async (assignmentId) => {
    try {
      await supabase
        .from('rally_team_assignments')
        .delete()
        .eq('id', assignmentId)

      const { data: team } = await supabase
        .from('rally_team_assignments')
        .select('*, team_members(*)')
        .eq('rally_id', id)

      setTeamMembers(team || [])
    } catch (err) {
      console.error('Error removing team member:', err)
      alert('Failed to remove team member')
    }
  }

  const pageStyle = {
    minHeight: '100vh',
    backgroundColor: '#1e2a3a',
    color: 'white',
    fontFamily: 'Arial, sans-serif'
  }

  const navStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    background: 'linear-gradient(180deg, #000000 0%, rgba(30, 42, 58, 0) 100%)'
  }

  const linkStyle = {
    color: '#00d9cc',
    textDecoration: 'none',
    fontSize: '1rem'
  }

  const containerStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '40px 20px'
  }

  const headerStyle = {
    backgroundColor: '#2d3e50',
    padding: '40px',
    borderRadius: '12px',
    marginBottom: '30px'
  }

  const sectionStyle = {
    backgroundColor: '#2d3e50',
    padding: '30px',
    borderRadius: '12px',
    height: '100%'
  }

  const sectionHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '15px',
    borderBottom: '2px solid rgba(0, 217, 204, 0.2)'
  }

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '24px',
    marginBottom: '24px'
  }

  const itemStyle = {
    backgroundColor: 'rgba(0, 217, 204, 0.08)',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '12px',
    border: '1px solid rgba(0, 217, 204, 0.15)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }

  const buttonStyle = {
    padding: '8px 16px',
    backgroundColor: '#00d9cc',
    color: '#000',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.85rem'
  }

  const removeButtonStyle = {
    padding: '6px 12px',
    backgroundColor: 'rgba(255, 82, 82, 0.2)',
    color: '#FF5252',
    border: '1px solid #FF5252',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: '600'
  }

  if (loading) return (
    <div style={pageStyle}>
      <div style={{ textAlign: 'center', marginTop: '100px' }}>Loading...</div>
    </div>
  )

  if (error) return (
    <div style={pageStyle}>
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h2 style={{ color: 'red' }}>Error: {error}</h2>
        <button onClick={() => router.reload()} style={buttonStyle}>Try Again</button>
      </div>
    </div>
  )

  const assignedIds = teamMembers.map(t => t.team_member_id)
  const unassignedMembers = allTeamMembers.filter(m => !assignedIds.includes(m.id))

  return (
    <div style={pageStyle}>
      <nav style={navStyle}>
        <Link href="/my-dashboard" style={linkStyle}>
          ← Back to Dashboard
        </Link>
        <button 
          onClick={async () => {
            await supabase.auth.signOut()
            router.push('/')
          }}
          style={buttonStyle}
        >
          Logout
        </button>
      </nav>

      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={{ 
            color: '#00d9cc', 
            fontSize: '2.5rem',
            marginBottom: '24px',
            fontWeight: '700'
          }}>
            {rally.name}
          </h1>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '24px'
          }}>
            <div>
              <p style={{ 
                color: 'rgba(255,255,255,0.5)', 
                fontSize: '0.85rem',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Location
              </p>
              <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>
                {rally.location}
              </p>
            </div>
            <div>
              <p style={{ 
                color: 'rgba(255,255,255,0.5)', 
                fontSize: '0.85rem',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Dates
              </p>
              <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>
                {new Date(rally.start_date).toLocaleDateString()} - {' '}
                {new Date(rally.end_date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div style={gridStyle}>
          <div style={sectionStyle}>
            <div style={sectionHeaderStyle}>
              <h2 style={{ color: '#00d9cc', margin: 0, fontSize: '1.5rem' }}>Team</h2>
              <button style={buttonStyle} onClick={() => setShowAssignModal(true)}>
                + Assign
              </button>
            </div>
            {teamMembers.length === 0 ? (
              <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '20px' }}>
                No team members assigned
              </p>
            ) : (
              teamMembers.map(member => (
                <div key={member.id} style={itemStyle}>
                  <div>
                    <p style={{ fontWeight: '600', marginBottom: '6px', fontSize: '1rem' }}>
                      {member.team_members.name}
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                      {member.team_members.role || 'Team Member'}
                    </p>
                  </div>
                  <button 
                    style={removeButtonStyle}
                    onClick={() => handleRemoveTeamMember(member.id)}
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>

          <div style={sectionStyle}>
            <div style={sectionHeaderStyle}>
              <h2 style={{ color: '#00d9cc', margin: 0, fontSize: '1.5rem' }}>Schedule</h2>
              <button style={buttonStyle} onClick={handleAddSchedule}>+ Add</button>
            </div>
            {scheduleItems.length === 0 ? (
              <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '20px' }}>
                No schedule items
              </p>
            ) : (
              scheduleItems.map(item => (
                <div key={item.id} style={itemStyle}>
                  <div>
                    <p style={{ fontWeight: '600', marginBottom: '6px', fontSize: '1rem' }}>
                      {item.title}
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                      {new Date(item.date).toLocaleDateString()} {item.time}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={sectionStyle}>
            <div style={sectionHeaderStyle}>
              <h2 style={{ color: '#00d9cc', margin: 0, fontSize: '1.5rem' }}>Documents</h2>
              <button style={buttonStyle}>+ Upload</button>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '20px' }}>
              No documents uploaded
            </p>
          </div>

          <div style={sectionStyle}>
            <div style={sectionHeaderStyle}>
              <h2 style={{ color: '#00d9cc', margin: 0, fontSize: '1.5rem' }}>Notes</h2>
              <button style={buttonStyle}>+ Add</button>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '20px' }}>
              No notes yet
            </p>
          </div>
        </div>
      </div>

      {showAssignModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }} onClick={() => setShowAssignModal(false)}>
          <div style={{
            backgroundColor: '#2d3e50',
            padding: '30px',
            borderRadius: '12px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '70vh',
            overflowY: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ color: '#00d9cc', marginBottom: '20px' }}>Assign Team Member</h2>
            {unassignedMembers.length === 0 ? (
              <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '20px' }}>
                All team members are already assigned
              </p>
            ) : (
              unassignedMembers.map(member => (
                <div 
                  key={member.id} 
                  style={{
                    ...itemStyle,
                    cursor: 'pointer',
                    marginBottom: '10px'
                  }}
                  onClick={() => handleAssignTeamMember(member.id)}
                >
                  <div>
                    <p style={{ fontWeight: '600', marginBottom: '4px' }}>{member.name}</p>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                      {member.role || 'Team Member'}
                    </p>
                  </div>
                  <button style={{ ...buttonStyle, padding: '6px 12px', fontSize: '0.8rem' }}>
                    Assign
                  </button>
                </div>
              ))
            )}
            <button 
              style={{ 
                ...buttonStyle, 
                marginTop: '20px', 
                width: '100%' 
              }}
              onClick={() => setShowAssignModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
        {showScheduleModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }} onClick={() => setShowScheduleModal(false)}>
            <div style={{ backgroundColor: '#2d3e50', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '500px', maxHeight: '80vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
              <h2 style={{ color: '#00d9cc', marginBottom: '20px' }}>{editingSchedule ? 'Edit' : 'Add'} Schedule Item</h2>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', marginBottom: '5px' }}>Date *</label>
              <input type="date" value={scheduleForm.schedule_date} onChange={(e) => setScheduleForm({...scheduleForm, schedule_date: e.target.value})} style={{ width: '100%', padding: '10px', backgroundColor: 'rgba(0, 217, 204, 0.1)', border: '1px solid rgba(0, 217, 204, 0.3)', borderRadius: '6px', color: 'white', marginBottom: '15px' }} />
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', marginBottom: '5px' }}>Time</label>
              <input type="time" value={scheduleForm.schedule_time} onChange={(e) => setScheduleForm({...scheduleForm, schedule_time: e.target.value})} style={{ width: '100%', padding: '10px', backgroundColor: 'rgba(0, 217, 204, 0.1)', border: '1px solid rgba(0, 217, 204, 0.3)', borderRadius: '6px', color: 'white', marginBottom: '15px' }} />
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', marginBottom: '5px' }}>Activity *</label>
              <input type="text" value={scheduleForm.activity} onChange={(e) => setScheduleForm({...scheduleForm, activity: e.target.value})} placeholder="e.g., Scrutineering" style={{ width: '100%', padding: '10px', backgroundColor: 'rgba(0, 217, 204, 0.1)', border: '1px solid rgba(0, 217, 204, 0.3)', borderRadius: '6px', color: 'white', marginBottom: '15px' }} />
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', marginBottom: '5px' }}>Location</label>
              <input type="text" value={scheduleForm.location} onChange={(e) => setScheduleForm({...scheduleForm, location: e.target.value})} placeholder="e.g., Parc Ferme" style={{ width: '100%', padding: '10px', backgroundColor: 'rgba(0, 217, 204, 0.1)', border: '1px solid rgba(0, 217, 204, 0.3)', borderRadius: '6px', color: 'white', marginBottom: '15px' }} />
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', marginBottom: '5px' }}>Notes</label>
              <textarea value={scheduleForm.notes} onChange={(e) => setScheduleForm({...scheduleForm, notes: e.target.value})} style={{ width: '100%', padding: '10px', backgroundColor: 'rgba(0, 217, 204, 0.1)', border: '1px solid rgba(0, 217, 204, 0.3)', borderRadius: '6px', color: 'white', marginBottom: '15px', minHeight: '80px', resize: 'vertical' }} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button style={{ flex: 1, padding: '10px', backgroundColor: '#00d9cc', color: '#000', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }} onClick={handleSaveSchedule}>Save</button>
                <button style={{ flex: 1, padding: '10px', backgroundColor: 'rgba(255, 82, 82, 0.2)', color: '#FF5252', border: '1px solid #FF5252', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }} onClick={() => setShowScheduleModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
}
