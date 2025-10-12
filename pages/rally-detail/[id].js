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
      if (!id) {
        setError('Invalid rally ID')
        setLoading(false)
        return
      }

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
          setError(`Unable to fetch rally details: ${rallyError.message}`)
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
          setError(`Unable to fetch team members: ${teamError.message}`)
          setLoading(false)
          return
        }
        
        const { data: a, error: assignmentError } = await supabase
          .from('rally_team_assignments')
          .select('*, team_members (*)')
          .eq('rally_id', id)

        if (assignmentError) {
          console.error('Team assignments fetch error:', assignmentError)
          setError(`Unable to fetch team assignments: ${assignmentError.message}`)
          setLoading(false)
          return
        }
        
        const { data: s, error: scheduleError } = await supabase
          .from('schedule_items')
          .select('*')
          .eq('rally_id', id)
          .order('date', { ascending: true })

        if (scheduleError) {
          console.error('Schedule items fetch error:', scheduleError)
          setError(`Unable to fetch schedule items: ${scheduleError.message}`)
          setLoading(false)
          return
        }

        setRally(r)
        setTeamMembers(t || [])
        setAssignedTeam(a || [])
        setScheduleItems(s || [])
        setLoading(false)
      } catch (unexpectedError) {
        console.error('Unexpected error:', unexpectedError)
        setError(`An unexpected error occurred: ${unexpectedError.message}`)
        setLoading(false)
      }
    }

    if (router.isReady) {
      fetchData()
    }
  }, [id, router.isReady])

  // Existing methods remain the same...

  if (loading) return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#1e2a3a', 
      color: 'white', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center' 
    }}>
      Loading rally details...
    </div>
  )

  if (error) return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#1e2a3a', 
      color: 'white', 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h2>🚨 Error Loading Rally</h2>
      <p>{error}</p>
      <button 
        onClick={() => router.reload()}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          background: '#00d9cc',
          color: 'black',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        Try Again
      </button>
    </div>
  )

  // Rest of the existing component remains the same...
}
