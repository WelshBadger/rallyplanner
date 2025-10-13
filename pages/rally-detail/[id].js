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

  if (loading) return <div>Loading...</div>

  if (error) return (
    <div>
      <h2>Error: {error}</h2>
      <button onClick={() => router.reload()}>Try Again</button>
    </div>
  )

  return (
    <div>
      <Link href="/my-dashboard">← Back to Dashboard</Link>

      <h1>{rally.name}</h1>
      <div>
        <p>Location: {rally.location}</p>
        <p>
          Dates: {new Date(rally.start_date).toLocaleDateString()} - {' '}
          {new Date(rally.end_date).toLocaleDateString()}
        </p>
      </div>

      <h2>Team</h2>
      {teamMembers.length === 0 ? (
        <p>No team members</p>
      ) : (
        teamMembers.map(member => (
          <div key={member.id}>
            <p>{member.team_members.name}</p>
            <p>{member.team_members.role || 'Team Member'}</p>
          </div>
        ))
      )}

      <h2>Schedule</h2>
      {scheduleItems.length === 0 ? (
        <p>No schedule items</p>
      ) : (
        scheduleItems.map(item => (
          <div key={item.id}>
            <p>{item.title}</p>
            <p>
              {new Date(item.date).toLocaleDateString()} {item.time}
            </p>
          </div>
        ))
      )}
    </div>
  )
}
