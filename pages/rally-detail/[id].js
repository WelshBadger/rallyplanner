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
      if (!currentUser) {
        alert('Please log in to assign team members')
        return
      }

      const { data, error } = await supabase
        .from('rally_team_assignments')
        .insert({ 
          rally_id: id, 
          team_member_id: memberId,
          user_id: currentUser.id  // Explicitly add user_id
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
      alert('Failed to assign team member')
    }
  }

  // Rest of the code remains the same as in the previous version
  // ... (keep all the existing styles and render methods)
}
