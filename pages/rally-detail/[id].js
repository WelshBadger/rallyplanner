import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function RallyDetail() {
  const router = useRouter()
  const { id } = router.query
  const [rally, setRally] = useState(null)
  const [teamMembers, setTeamMembers] = useState([])
  const [scheduleItems, setScheduleItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

        const { data: schedule } = await supabase
          .from('schedule_items')
          .select('*')
          .eq('rally_id', id)
          .order('date')

        setRally(r)
        setTeamMembers(team || [])
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

  const pageStyle = {
    minHeight: '100vh',
    backgroundColor: '#1e2a3a',
    color: 'white',
    fontFamily: 'Arial, sans-serif',
    padding: '20px'
  }

  const navStyle = {
    marginBottom: '30px'
  }

  const linkStyle = {
    color: '#00d9cc',
    textDecoration: 'none',
    fontSize: '1rem'
  }

  const sectionStyle = {
    backgroundColor: '#2d3e50',
    padding: '30px',
    borderRadius: '10px',
    maxWidth: '800px',
    margin: '0 auto 20px'
  }

  const headingStyle = {
    color: '#00d9cc',
    marginBottom: '20px',
    fontSize: '2rem'
  }

  const itemStyle = {
    backgroundColor: 'rgba(0, 217, 204, 0.1)',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '10px'
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
        <button onClick={() => router.reload()}>Try Again</button>
      </div>
    </div>
  )

  return (
    <div style={pageStyle}>
      <nav style={navStyle}>
        <Link href="/my-dashboard" style={linkStyle}>
          ← Back to Dashboard
        </Link>
      </nav>

      <div style={sectionStyle}>
        <h1 style={headingStyle}>{rally.name}</h1>
        <p style={{ marginBottom: '10px' }}>
          <strong>Location:</strong> {rally.location}
        </p>
        <p>
          <strong>Dates:</strong> {' '}
          {new Date(rally.start_date).toLocaleDateString()} - {' '}
          {new Date(rally.end_date).toLocaleDateString()}
        </p>
      </div>

      <div style={sectionStyle}>
        <h2 style={{ color: '#00d9cc', marginBottom: '15px' }}>Team</h2>
        {teamMembers.length === 0 ? (
          <p style={{ color: 'rgba(255,255,255,0.6)' }}>No team members assigned</p>
        ) : (
          teamMembers.map(member => (
            <div key={member.id} style={itemStyle}>
              <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                {member.team_members.name}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.6)' }}>
                {member.team_members.role || 'Team Member'}
              </p>
            </div>
          ))
        )}
      </div>

      <div style={sectionStyle}>
        <h2 style={{ color: '#00d9cc', marginBottom: '15px' }}>Schedule</h2>
        {scheduleItems.length === 0 ? (
          <p style={{ color: 'rgba(255,255,255,0.6)' }}>No schedule items</p>
        ) : (
          scheduleItems.map(item => (
            <div key={item.id} style={itemStyle}>
              <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                {item.title}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.6)' }}>
                {new Date(item.date).toLocaleDateString()} {item.time}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
