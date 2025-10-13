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

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  const assignedIds = teamMembers.map(t => t.team_member_id)
  const unassignedMembers = allTeamMembers.filter(m => !assignedIds.includes(m.id))

  return (
    <div>
      <h1>{rally.name}</h1>
      <div>
        <h2>Team</h2>
        <button onClick={() => setShowAssignModal(true)}>+ Assign</button>
        {teamMembers.map(member => (
          <div key={member.id}>
            <span>{member.team_members.name}</span>
            <button onClick={() => handleRemoveTeamMember(member.id)}>Remove</button>
          </div>
        ))}
      </div>

      {showAssignModal && (
        <div>
          <h3>Assign Team Member</h3>
          {unassignedMembers.map(member => (
            <div key={member.id}>
              <span>{member.name}</span>
              <button onClick={() => handleAssignTeamMember(member.id)}>Assign</button>
            </div>
          ))}
          <button onClick={() => setShowAssignModal(false)}>Close</button>
        </div>
      )}
    </div>
  )
}
