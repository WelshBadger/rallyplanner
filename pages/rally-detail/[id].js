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
  const [error, setError] = useState(null)
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

      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { 
          router.push('/login')
          return 
        }
        
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
        
        const { data: t, error: teamError } = await supabase
          .from('team_members')
          .select('*')
          .eq('user_id', user.id)
          .order('name')

        if (teamError) {
          console.error('Team members fetch error:', teamError)
        }
        
        const { data: a, error: assignmentError } = await supabase
          .from('rally_team_assignments')
          .select('*, team_members (*)')
          .eq('rally_id', id)

        if (assignmentError) {
          console.error('Team assignments fetch error:', assignmentError)
        }
        
        const { data: s, error: scheduleError } = await supabase
          .from('schedule_items')
          .select('*')
          .eq('rally_id', id)

        if (scheduleError) {
          console.error('Schedule items fetch error:', scheduleError)
        }

        setRally(r)
        setTeamMembers(t || [])
        setAssignedTeam(a || [])
        setScheduleItems(s || [])
        setLoading(false)
      } catch (unexpectedError) {
        console.error('Unexpected error:', unexpectedError)
        setError('An unexpected error occurred')
        setLoading(false)
      }
    }

    if (router.isReady) {
      fetchData()
    }
  }, [id, router.isReady])

  const handleLogout = async () => { 
    await supabase.auth.signOut()
    router.push('/') 
  }
  
  const handleAssign = async (memberId) => {
    try {
      await supabase.from('rally_team_assignments').insert({ rally_id: rally.id, team_member_id: memberId })
      const { data: a } = await supabase.from('rally_team_assignments').select('*, team_members (*)').eq('rally_id', rally.id)
      setAssignedTeam(a || [])
      setShowAssignTeam(false)
    } catch (err) {
      console.error('Error assigning team member:', err)
      alert('Failed to assign team member. Please try again.')
    }
  }

  const handleUnassign = async (assignmentId) => {
    try {
      await supabase.from('rally_team_assignments').delete().eq('id', assignmentId)
      const { data: a } = await supabase.from('rally_team_assignments').select('*, team_members (*)').eq('rally_id', rally.id)
      setAssignedTeam(a || [])
    } catch (err) {
      console.error('Error unassigning team member:', err)
      alert('Failed to remove team member. Please try again.')
    }
  }

  const handleAddSchedule = async (e) => {
    e.preventDefault()
    try {
      const { data: { user } } = await supabase.auth.getUser()
      await supabase.from('schedule_items').insert({ 
        ...scheduleForm, 
        rally_id: rally.id, 
        user_id: user.id 
      })
      const { data: s } = await supabase.from('schedule_items').select('*').eq('rally_id', rally.id)
      setScheduleItems(s || [])
      setShowAddSchedule(false)
      setScheduleForm({ title: '', date: '', time: '', location: '', description: '', item_type: '' })
    } catch (err) {
      console.error('Error adding schedule item:', err)
      alert('Failed to add schedule item. Please try again.')
    }
  }

  const handleDeleteSchedule = async (scheduleId) => {
    try {
      await supabase.from('schedule_items').delete().eq('id', scheduleId)
      const { data: s } = await supabase.from('schedule_items').select('*').eq('rally_id', rally.id)
      setScheduleItems(s || [])
    } catch (err) {
      console.error('Error deleting schedule item:', err)
      alert('Failed to delete schedule item. Please try again.')
    }
  }

  if (loading) return <div style={{ minHeight: '100vh', background: '#1e2a3a', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>

  if (error) return (
    <div style={{ minHeight: '100vh', background: '#1e2a3a', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', textAlign: 'center' }}>
      <h2>⚠️ {error}</h2>
      <button onClick={() => router.reload()} style={{ marginTop: '20px', padding: '10px 20px', background: '#00d9cc', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Try Again</button>
      <button onClick={() => router.push('/my-dashboard')} style={{ marginTop: '10px', padding: '10px 20px', background: 'rgba(0, 217, 204, 0.2)', color: '#00d9cc', border: '1px solid #00d9cc', borderRadius: '8px', cursor: 'pointer' }}>Back to Dashboard</button>
    </div>
  )

  const assignedIds = assignedTeam.map(a => a.team_member_id)
  const unassigned = teamMembers.filter(m => !assignedIds.includes(m.id))

  return (
    <div style={{ minHeight: '100vh', background: '#1e2a3a', color: 'white', fontFamily: 'system-ui' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px 40px', background: 'linear-gradient(180deg, #000000 0%, rgba(30, 42, 58, 0) 100%)' }}>
        <Link href="/my-dashboard" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'white' }}>
          ← Back to Dashboard
        </Link>
        <button 
          onClick={handleLogout}
          style={{
            padding: '8px 20px',
            background: '#00d9cc',
            color: 'black',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </nav>

      <div style={{ padding: '40px 20px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ background: '#2d3e50', borderRadius: '16px', padding: '40px', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '24px', color: '#00d9cc' }}>{rally.name}</h1>
          <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>Location</p>
              <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{rally.location}</p>
            </div>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>Dates</p>
              <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                {new Date(rally.start_date).toLocaleDateString()} - {' '}
                {new Date(rally.end_date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps(context) {
  console.log('Server-side Rally ID:', context.params.id)
  return { props: {} }
}
