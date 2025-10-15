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
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const fetchRallyDetails = async () => {
      if (!id) return

      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }
        setCurrentUser(user)

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
          .eq('user_id', user.id)
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
      const { data, error } = await supabase
        .from('rally_team_assignments')
        .insert({ 
          rally_id: id, 
          team_member_id: memberId,
          user_id: currentUser.id
        })

      if (error) {
        console.error('Assignment error:', error)
        alert('Failed to assign: ' + error.message)
        return
      }

      const { data: team } = await supabase
        .from('rally_team_assignments')
        .select('*, team_members(*)')
        .eq('rally_id', id)

      setTeamMembers(team || [])
      setShowAssignModal(false)
    } catch (err) {
      console.error('Error assigning team member:', err)
      alert('Failed to assign team member: ' + err.message)
    }
  }

  const handleRemoveTeamMember = async (assignmentId) => {
    try {
      const { error } = await supabase
        .from('rally_team_assignments')
        .delete()
        .eq('id', assignmentId)

      if (error) {
        console.error('Remove error:', error)
        alert('Failed to remove: ' + error.message)
        return
      }

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

  if (loading) return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1e2a3a',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white'
    }}>
      Loading...
    </div>
  )

  if (error) return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1e2a3a',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'red'
    }}>
      {error}
    </div>
  )

  if (!rally) return null

  const assignedIds = teamMembers.map(t => t.team_member_id)
  const unassignedMembers = allTeamMembers.filter(m => !assignedIds.includes(m.id))

  const buttonStyle = {
    padding: '8px 16px',
    backgroundColor: '#00d9cc',
    color: '#000',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600'
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

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1e2a3a',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px',
        background: 'linear-gradient(180deg, #000000 0%, rgba(30, 42, 58, 0) 100%)'
      }}>
        <Link href="/my-dashboard" style={{ color: '#00d9cc', textDecoration: 'none' }}>
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

      {/* Rest of the existing render code */}
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
            width: '400px'
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ color: '#00d9cc', marginBottom: '20px' }}>Assign Team Member</h2>
            {unassignedMembers.length === 0 ? (
              <p style={{ color: 'rgba(255,255,255,0.6)' }}>All team members are already assigned</p>
            ) : (
              unassignedMembers.map(member => (
                <div 
                  key={member.id}
                  style={{
                    backgroundColor: 'rgba(0, 217, 204, 0.1)',
                    padding: '10px',
                    marginBottom: '10px',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleAssignTeamMember(member.id)}
                >
                  <p style={{ margin: 0, marginBottom: '4px' }}>{member.name}</p>
                  <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0, fontSize: '0.9rem' }}>
                    {member.role}
                  </p>
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

      {showScheduleModal && (
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
        }} onClick={() => setShowScheduleModal(false)}>
          <div style={{
            backgroundColor: '#2d3e50',
            padding: '30px',
            borderRadius: '12px',
            width: '500px'
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ color: '#00d9cc', marginBottom: '20px' }}>Add Schedule Item</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '20px' }}>
              Schedule functionality coming soon
            </p>
            <button 
              style={{
                ...buttonStyle,
                width: '100%'
              }}
              onClick={() => setShowScheduleModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
