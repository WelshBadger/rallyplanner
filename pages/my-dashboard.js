import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

export default function MyDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [rallies, setRallies] = useState([])
  const [teamMembers, setTeamMembers] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const checkUserAndFetchData = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
          router.push('/login')
          return
        }

        setUser(user)

        // Fetch rallies
        const { data: userRallies, error: ralliesError } = await supabase
          .from('rally_events')
          .select('*')
          .eq('user_id', user.id)
          .order('start_date')

        if (ralliesError) throw ralliesError
        setRallies(userRallies || [])

        // Fetch team members
        const { data: team, error: teamError } = await supabase
          .from('team_members')
          .select('*')
          .eq('user_id', user.id)
          .order('name')
          .limit(5)

        if (teamError) throw teamError
        setTeamMembers(team || [])

      } catch (err) {
        console.error('Dashboard Error:', err)
        setError(err.message)
      }
    }

    checkUserAndFetchData()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  // Get upcoming rallies (next 3)
  const upcomingRallies = rallies
    .filter(r => new Date(r.start_date) >= new Date())
    .slice(0, 3)

  if (error) return <div>Error: {error}</div>
  if (!user) return <div>Loading...</div>

  return (
    <div style={{ minHeight: '100vh', background: '#1e2a3a', color: 'white', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Gradient Header */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px 40px',
        background: 'linear-gradient(180deg, #000000 0%, rgba(30, 42, 58, 0) 100%)'
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'white' }}>
          <img src="https://eu.chat-img.sintra.ai/dc1642b4-24d4-4708-b881-4a4a3d091f51/085dd2a1-4cb2-4eec-ad91-6a8aa0a1b119/channels4_profile.jpeg" style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '12px' }} />
          <span style={{ fontSize: '1.5rem', fontWeight: '700' }}>Rally Planner</span>
        </Link>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link href="/team" style={{ color: '#00d9cc', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}>Team</Link>
          <button onClick={handleLogout} style={{ padding: '8px 20px', background: '#00d9cc', color: '#000', border: 'none', borderRadius: '20px', fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem' }}>
            Logout
          </button>
        </div>
      </nav>

      <div style={{ padding: '40px 20px', maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '40px', color: 'white' }}>Dashboard</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
          
          {/* 1. MY RALLIES SECTION */}
          <div style={{ background: '#2d3e50', borderRadius: '16px', padding: '28px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', margin: 0 }}>My Rallies</h2>
              <Link href="/add-rally" style={{ padding: '6px 16px', background: 'rgba(0, 217, 204, 0.2)', color: '#00d9cc', border: '1px solid #00d9cc', borderRadius: '12px', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '600' }}>
                + Add
              </Link>
            </div>

            {rallies.length === 0 ? (
              <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.95rem' }}>No rallies yet. Create your first rally!</p>
            ) : (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.85rem', marginBottom: '12px', fontWeight: '600' }}>UPCOMING ({upcomingRallies.length})</p>
                  {upcomingRallies.length === 0 ? (
                    <p style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.9rem' }}>No upcoming rallies</p>
                  ) : (
                    upcomingRallies.map(rally => (
                      <Link key={rally.id} href={`/rally-detail/${rally.id}`} style={{ textDecoration: 'none' }}>
                        <div style={{ background: 'rgba(0, 217, 204, 0.05)', padding: '12px 16px', borderRadius: '8px', marginBottom: '8px', border: '1px solid rgba(0, 217, 204, 0.2)', cursor: 'pointer' }}>
                          <p style={{ color: 'white', fontWeight: '600', fontSize: '0.95rem', marginBottom: '4px' }}>{rally.name}</p>
                          <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.85rem' }}>📅 {new Date(rally.start_date).toLocaleDateString('en-GB')}</p>
                        </div>
                      </Link>
                    ))
                  )}
                </div>

                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>Total Rallies: <strong style={{ color: 'white' }}>{rallies.length}</strong></p>
                    <Link href="/add-rally" style={{ color: '#00d9cc', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '600' }}>View All →</Link>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* 2. TEAM SUMMARY SECTION */}
          <div style={{ background: '#2d3e50', borderRadius: '16px', padding: '28px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', margin: 0 }}>Team Summary</h2>
              <Link href="/team" style={{ padding: '6px 16px', background: 'rgba(0, 217, 204, 0.2)', color: '#00d9cc', border: '1px solid #00d9cc', borderRadius: '12px', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '600' }}>
                Manage
              </Link>
            </div>

            {teamMembers.length === 0 ? (
              <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.95rem' }}>No team members yet. Add your first team member!</p>
            ) : (
              <>
                <div style={{ marginBottom: '16px' }}>
                  {teamMembers.map(member => (
                    <div key={member.id} style={{ padding: '12px 16px', borderRadius: '8px', marginBottom: '8px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <p style={{ color: 'white', fontWeight: '600', fontSize: '0.95rem', marginBottom: '4px' }}>{member.name}</p>
                      <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.85rem' }}>{member.role || 'Team Member'}</p>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>Total Members: <strong style={{ color: 'white' }}>{teamMembers.length}</strong></p>
                    <Link href="/team" style={{ color: '#00d9cc', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '600' }}>View All →</Link>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* 3. QUICK ACTIONS SECTION */}
          <div style={{ background: '#2d3e50', borderRadius: '16px', padding: '28px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', marginBottom: '20px' }}>Quick Actions</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link href="/add-rally" style={{ textDecoration: 'none' }}>
                <div style={{ background: 'rgba(0, 217, 204, 0.1)', padding: '16px 20px', borderRadius: '12px', border: '1px solid rgba(0, 217, 204, 0.3)', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <p style={{ color: '#00d9cc', fontWeight: '700', fontSize: '1rem', marginBottom: '4px' }}>🏁 Add New Rally</p>
                  <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.85rem' }}>Create a new rally event</p>
                </div>
              </Link>

              <Link href="/team" style={{ textDecoration: 'none' }}>
                <div style={{ background: 'rgba(0, 217, 204, 0.1)', padding: '16px 20px', borderRadius: '12px', border: '1px solid rgba(0, 217, 204, 0.3)', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <p style={{ color: '#00d9cc', fontWeight: '700', fontSize: '1rem', marginBottom: '4px' }}>👥 Manage Team</p>
                  <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.85rem' }}>Add or edit team members</p>
                </div>
              </Link>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px 20px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)', opacity: 0.5 }}>
                <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontWeight: '700', fontSize: '1rem', marginBottom: '4px' }}>📄 Upload Documents</p>
                <p style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.85rem' }}>Coming soon</p>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px 20px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)', opacity: 0.5 }}>
                <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontWeight: '700', fontSize: '1rem', marginBottom: '4px' }}>📅 View Calendar</p>
                <p style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.85rem' }}>Coming soon</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
