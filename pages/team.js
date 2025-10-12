import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import Link from 'next/link'

export default function Team() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [teamMembers, setTeamMembers] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState({ name: '', role: '', phone: '', email: '', notes: '' })
  const [error, setError] = useState(null)

  useEffect(() => {
    const checkUserAndFetchTeam = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
          router.push('/login')
          return
        }

        setUser(user)
        await fetchTeamMembers(user.id)

      } catch (err) {
        console.error('Team Error:', err)
        setError(err.message)
      }
    }

    checkUserAndFetchTeam()
  }, [])

  const fetchTeamMembers = async (userId) => {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('user_id', userId)
      .order('name')

    if (error) throw error
    setTeamMembers(data || [])
  }

  const handleAddMember = async (e) => {
    e.preventDefault()
    
    try {
      const { error } = await supabase
        .from('team_members')
        .insert({
          ...formData,
          user_id: user.id
        })

      if (error) throw error

      await fetchTeamMembers(user.id)
      setShowAddModal(false)
      setFormData({ name: '', role: '', phone: '', email: '', notes: '' })

    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this team member?')) return

    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchTeamMembers(user.id)

    } catch (err) {
      setError(err.message)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (!user) return <div>Loading...</div>

  return (
    <div style={{ minHeight: '100vh', background: '#1e2a3a', color: 'white', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Gradient Header */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px 40px', background: 'linear-gradient(180deg, #000000 0%, rgba(30, 42, 58, 0) 100%)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'white' }}>
          <img src="https://eu.chat-img.sintra.ai/dc1642b4-24d4-4708-b881-4a4a3d091f51/085dd2a1-4cb2-4eec-ad91-6a8aa0a1b119/channels4_profile.jpeg" style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '12px' }} />
          <span style={{ fontSize: '1.5rem', fontWeight: '700' }}>Rally Planner</span>
        </Link>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link href="/my-dashboard" style={{ color: '#00d9cc', textDecoration: 'none', fontWeight: '600' }}>Dashboard</Link>
          <button onClick={handleLogout} style={{ padding: '10px 24px', background: '#00d9cc', color: '#000', border: 'none', borderRadius: '20px', fontWeight: '700', cursor: 'pointer' }}>Logout</button>
        </div>
      </nav>

      <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'white' }}>Team Management</h1>
          <button onClick={() => setShowAddModal(true)} style={{ padding: '12px 32px', background: '#00d9cc', color: '#000', border: 'none', borderRadius: '25px', fontWeight: '700', cursor: 'pointer' }}>
            + Add Team Member
          </button>
        </div>

        {error && <div style={{ background: 'rgba(255, 82, 82, 0.1)', border: '1px solid #FF5252', color: '#FF5252', padding: '15px', marginBottom: '20px', borderRadius: '8px' }}>{error}</div>}

        {teamMembers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '1.2rem', marginBottom: '24px' }}>No team members yet</p>
            <button onClick={() => setShowAddModal(true)} style={{ padding: '16px 32px', background: '#00d9cc', color: '#000', borderRadius: '25px', border: 'none', fontWeight: '700', cursor: 'pointer' }}>
              Add Your First Team Member
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {teamMembers.map(member => (
              <div key={member.id} style={{ background: '#2d3e50', borderRadius: '16px', padding: '28px', border: '1px solid rgba(255, 255, 255, 0.05)', position: 'relative' }}>
                <button onClick={() => handleDelete(member.id)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(255, 82, 82, 0.2)', color: '#FF5252', border: '1px solid #FF5252', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}>Delete</button>
                
                <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: 'white', marginBottom: '12px' }}>{member.name}</h2>
                {member.role && <p style={{ color: '#00d9cc', marginBottom: '12px', fontWeight: '600' }}>🏁 {member.role}</p>}
                {member.phone && <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '8px' }}>📞 {member.phone}</p>}
                {member.email && <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '8px' }}>✉️ {member.email}</p>}
                {member.notes && <p style={{ color: 'rgba(255, 255, 255, 0.5)', marginTop: '12px', fontSize: '0.9rem', fontStyle: 'italic' }}>"{member.notes}"</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: '#2d3e50', borderRadius: '16px', padding: '40px', maxWidth: '500px', width: '90%' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '24px' }}>Add Team Member</h2>
            
            <form onSubmit={handleAddMember}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.9)', fontWeight: '500' }}>Name *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required style={{ width: '100%', padding: '14px', background: '#1e2a3a', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'white', fontSize: '1rem' }} />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.9)', fontWeight: '500' }}>Role</label>
                <input type="text" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} placeholder="e.g. Co-driver, Mechanic" style={{ width: '100%', padding: '14px', background: '#1e2a3a', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'white', fontSize: '1rem' }} />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.9)', fontWeight: '500' }}>Phone</label>
                <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '14px', background: '#1e2a3a', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'white', fontSize: '1rem' }} />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.9)', fontWeight: '500' }}>Email</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '14px', background: '#1e2a3a', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'white', fontSize: '1rem' }} />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.9)', fontWeight: '500' }}>Notes</label>
                <textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} style={{ width: '100%', padding: '14px', background: '#1e2a3a', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'white', minHeight: '80px', fontSize: '1rem' }} />
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: '14px', background: 'rgba(255, 255, 255, 0.1)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '14px', background: '#00d9cc', color: '#000', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>Add Member</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
