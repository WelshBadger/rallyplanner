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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showAssignTeam, setShowAssignTeam] = useState(false)
  const [showAddSchedule, setShowAddSchedule] = useState(false)
  const [scheduleForm, setScheduleForm] = useState({ title: '', date: '', time: '', location: '', description: '', item_type: '' })

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
      const { data: s } = await supabase.from('schedule_items').select('*').eq('rally_id', id).order('date', { ascending: true })
      setScheduleItems(s || [])
      setLoading(false)
    }
    if (router.isReady) fetchData()
  }, [id, router.isReady])

  const handleDelete = async () => { await supabase.from('rally_events').delete().eq('id', rally.id); router.push('/my-dashboard') }
  const handleAssign = async (memberId) => { await supabase.from('rally_team_assignments').insert({ rally_id: rally.id, team_member_id: memberId }); const { data: a } = await supabase.from('rally_team_assignments').select('*, team_members (*)').eq('rally_id', rally.id); setAssignedTeam(a || []); setShowAssignTeam(false) }
  const handleUnassign = async (assignmentId) => { await supabase.from('rally_team_assignments').delete().eq('id', assignmentId); const { data: a } = await supabase.from('rally_team_assignments').select('*, team_members (*)').eq('rally_id', rally.id); setAssignedTeam(a || []) }
  const handleAddSchedule = async (e) => { e.preventDefault(); const { data: { user } } = await supabase.auth.getUser(); await supabase.from('schedule_items').insert({ ...scheduleForm, rally_id: rally.id, user_id: user.id }); const { data: s } = await supabase.from('schedule_items').select('*').eq('rally_id', rally.id).order('date', { ascending: true }); setScheduleItems(s || []); setShowAddSchedule(false); setScheduleForm({ title: '', date: '', time: '', location: '', description: '', item_type: '' }) }
  const handleDeleteSchedule = async (scheduleId) => { await supabase.from('schedule_items').delete().eq('id', scheduleId); const { data: s } = await supabase.from('schedule_items').select('*').eq('rally_id', rally.id).order('date', { ascending: true }); setScheduleItems(s || []) }

  if (loading || !rally) return <div style={{ minHeight: '100vh', background: '#1e2a3a', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>
  const assignedIds = assignedTeam.map(a => a.team_member_id)
  const unassigned = teamMembers.filter(m => !assignedIds.includes(m.id))

  return <div style={{ minHeight: '100vh', background: '#1e2a3a', color: 'white', fontFamily: 'system-ui' }}><nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px 40px', background: 'linear-gradient(180deg, #000000 0%, rgba(30, 42, 58, 0) 100%)' }}><Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'white' }}><img src="https://eu.chat-img.sintra.ai/dc1642b4-24d4-4708-b881-4a4a3d091f51/085dd2a1-4cb2-4eec-ad91-6a8aa0a1b119/channels4_profile.jpeg" style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '12px' }} /><span style={{ fontSize: '1.5rem', fontWeight: '700' }}>Rally Planner</span></Link><Link href="/my-dashboard" style={{ color: '#00d9cc', textDecoration: 'none', fontWeight: '600' }}>← Dashboard</Link></nav></div>
}