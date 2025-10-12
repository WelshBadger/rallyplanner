import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

export default function TeamManagement() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [teamMembers, setTeamMembers] = useState([])
  const [newMember, setNewMember] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    emergency_contact_name: '',
    emergency_contact_phone: ''
  })
  const [isAddingMember, setIsAddingMember] = useState(false)

  useEffect(() => {
    const fetchTeamData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)

      const { data: members, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('user_id', user.id)
        .order('name')

      if (error) console.error('Team fetch error:', error)
      setTeamMembers(members || [])
    }

    fetchTeamData()
  }, [])

  const handleAddMember = async (e) => {
    e.preventDefault()
    try {
      const { error } = await supabase
        .from('team_members')
        .insert({
          ...newMember,
          user_id: user.id
        })

      if (error) throw error

      // Refresh team members
      const { data: members } = await supabase
        .from('team_members')
        .select('*')
        .eq('user_id', user.id)
        .order('name')

      setTeamMembers(members || [])
      
      // Reset form
      setNewMember({
        name: '',
        role: '',
        email: '',
        phone: '',
        emergency_contact_name: '',
        emergency_contact_phone: ''
      })
      setIsAddingMember(false)
    } catch (error) {
      alert('Error adding team member: ' + error.message)
    }
  }

  const handleDeleteMember = async (memberId) => {
    if (!confirm('Are you sure you want to remove this team member?')) return

    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', memberId)

      if (error) throw error

      // Refresh team members
      const { data: members } = await supabase
        .from('team_members')
        .select('*')
        .eq('user_id', user.id)
        .order('name')

      setTeamMembers(members || [])
    } catch (error) {
      alert('Error deleting team member: ' + error.message)
    }
  }

  const userInitial = (user?.user_metadata?.full_name?.[0] || user?.email?.[0] || 'U').toUpperCase()

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: 'white', fontFamily: 'Arial' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Link href="/home" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'white' }}>
          <img src="https://eu.chat-img.sintra.ai/dc1642b4-24d4-4708-b881-4a4a3d091f51/085dd2a1-4cb2-4eec-ad91-6a8aa0a1b119/channels4_profile.jpeg" style={{ width: '40px', height: '40px', marginRight: '12px' }} />
          <span style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>Rally Planner</span>
        </Link>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link href="/my-dashboard" style={{ color: 'white', textDecoration: 'none', padding: '10px' }}>Dashboard</Link>
          <button 
            onClick={() => {
              supabase.auth.signOut()
              router.push('/home')
            }} 
            style={{ color: 'white', background: 'transparent', border: 'none', padding: '10px', cursor: 'pointer' }}
          >
            Logout
          </button>
          <div style={{ width: '45px', height: '45px', background: '#00ff88', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold', fontSize: '1.2rem' }}>
            {userInitial}
          </div>
        </div>
      </nav>

      <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#00ff88', margin: 0 }}>Team Management</h1>
          <button 
            onClick={() => setIsAddingMember(!isAddingMember)}
            style={{ 
              background: '#00ff88', 
              color: '#000', 
              border: 'none', 
              padding: '10px 20px', 
              borderRadius: '8px', 
              cursor: 'pointer' 
            }}
          >
            {isAddingMember ? 'Cancel' : 'Add Team Member'}
          </button>
        </div>

        {isAddingMember && (
          <form onSubmit={handleAddMember} style={{ 
            background: 'rgba(0,255,136,0.1)', 
            padding: '20px', 
            borderRadius: '12px', 
            marginBottom: '30px' 
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <input
                type="text"
                placeholder="Name *"
                required
                value={newMember.name}
                onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  background: 'rgba(255,255,255,0.1)', 
                  border: '1px solid rgba(255,255,255,0.2)', 
                  borderRadius: '8px', 
                  color: 'white' 
                }}
              />
              <input
                type="text"
                placeholder="Role *"
                required
                value={newMember.role}
                onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  background: 'rgba(255,255,255,0.1)', 
                  border: '1px solid rgba(255,255,255,0.2)', 
                  borderRadius: '8px', 
                  color: 'white' 
                }}
              />
              <input
                type="email"
                placeholder="Email"
                value={newMember.email}
                onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  background: 'rgba(255,255,255,0.1)', 
                  border: '1px solid rgba(255,255,255,0.2)', 
                  borderRadius: '8px', 
                  color: 'white' 
                }}
              />
              <input
                type="tel"
                placeholder="Phone"
                value={newMember.phone}
                onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  background: 'rgba(255,255,255,0.1)', 
                  border: '1px solid rgba(255,255,255,0.2)', 
                  borderRadius: '8px', 
                  color: 'white' 
                }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
              <input
                type="text"
                placeholder="Emergency Contact Name"
                value={newMember.emergency_contact_name}
                onChange={(e) => setNewMember({...newMember, emergency_contact_name: e.target.value})}
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  background: 'rgba(255,255,255,0.1)', 
                  border: '1px solid rgba(255,255,255,0.2)', 
                  borderRadius: '8px', 
                  color: 'white' 
                }}
              />
              <input
                type="tel"
                placeholder="Emergency Contact Phone"
                value={newMember.emergency_contact_phone}
                onChange={(e) => setNewMember({...newMember, emergency_contact_phone: e.target.value})}
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  background: 'rgba(255,255,255,0.1)', 
                  border: '1px solid rgba(255,255,255,0.2)', 
                  borderRadius: '8px', 
                  color: 'white' 
                }}
              />
            </div>
            <button 
              type="submit"
              style={{ 
                background: '#00ff88', 
                color: '#000', 
                border: 'none', 
                padding: '12px', 
                borderRadius: '8px', 
                width: '100%', 
                marginTop: '15px', 
                cursor: 'pointer' 
              }}
            >
              Save Team Member
            </button>
          </form>
        )}

        {teamMembers.length > 0 ? (
          <div>
            {teamMembers.map(member => (
              <div 
                key={member.id} 
                style={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  borderRadius: '12px', 
                  padding: '20px', 
                  marginBottom: '15px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <h3 style={{ margin: 0, marginBottom: '10px', color: '#00ff88' }}>{member.name}</h3>
                  <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)' }}>{member.role}</p>
                  {member.email && <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)' }}>{member.email}</p>}
                </div>
                <button 
                  onClick={() => handleDeleteMember(member.id)}
                  style={{ 
                    background: 'rgba(255,0,0,0.2)', 
                    color: '#ff6b6b', 
                    border: 'none', 
                    padding: '8px 15px', 
                    borderRadius: '8px', 
                    cursor: 'pointer' 
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center' }}>No team members yet</p>
        )}
      </div>
    </div>
  )
}
