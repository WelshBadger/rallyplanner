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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const fetchRallyDetails = async () => {
      if (!id) return

      try {
        // Log the current user and rally ID
        console.log('Fetching rally details for ID:', id)

        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError) {
          console.error('User authentication error:', userError)
          router.push('/login')
          return
        }

        if (!user) {
          console.log('No user found, redirecting to login')
          router.push('/login')
          return
        }

        setCurrentUser(user)
        console.log('Current User:', user)

        // Fetch rally details with comprehensive error logging
        const { data: r, error: rallyError } = await supabase
          .from('rally_events')
          .select('*')
          .eq('id', id)
          .single()

        if (rallyError) {
          console.error('Rally fetch error:', rallyError)
          setError('Unable to fetch rally details: ' + rallyError.message)
          setLoading(false)
          return
        }

        console.log('Rally Details:', r)
        setRally(r)

        // Fetch team assignments with error logging
        const { data: team, error: teamError } = await supabase
          .from('rally_team_assignments')
          .select('*, team_members(*)')
          .eq('rally_id', id)

        if (teamError) {
          console.error('Team assignments fetch error:', teamError)
        }

        console.log('Team Assignments:', team)
        setTeamMembers(team || [])

        // Fetch all team members with error logging
        const { data: allTeam, error: allTeamError } = await supabase
          .from('team_members')
          .select('*')
          .eq('user_id', user.id)
          .order('name')

        if (allTeamError) {
          console.error('All team members fetch error:', allTeamError)
        }

        console.log('All Team Members:', allTeam)
        setAllTeamMembers(allTeam || [])
        setLoading(false)

      } catch (unexpectedError) {
        console.error('Unexpected error:', unexpectedError)
        setError('An unexpected error occurred: ' + unexpectedError.message)
        setLoading(false)
      }
    }

    if (router.isReady) {
      fetchRallyDetails()
    }
  }, [id, router.isReady])

  // Rest of the code remains the same as in the previous version
  // ... (keep all existing functions and render methods)

  return (
    // Existing render code with added console.log for debugging
    <div>
      {/* Existing components */}
      {showAssignModal && (
        <div onClick={() => {
          console.log('Unassigned Members:', unassignedMembers)
          setShowAssignModal(false)
        }}>
          {/* Existing modal code */}
        </div>
      )}
    </div>
  )
}
