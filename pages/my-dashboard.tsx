import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import Link from 'next/link'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [rallies, setRallies] = useState([])
  const [teamMembers, setTeamMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.replace('/login')
        return
      }
      setUser(session.user)

      const { data: rallyData } = await supabase
        .from('rally_events')
        .select('*')
        .order('start_date', { ascending: true })
        .limit(3)

      const { data: teamData } = await supabase
        .from('team_members')
        .select('*')
        .eq('user_id', session.user.id)
        .limit(5)

      setRallies(rallyData || [])
      setTeamMembers(teamData || [])
      setLoading(false)
    }

    checkAuth()
  }, [router])

  if (loading) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1e2a3a', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
      Loading...
    </div>
  )

  const buttonStyle = { padding: '8px 16px', backgroundColor: '#00d9cc', color: '#000', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }

  return (
    <>
      <style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
          background-color: #1e2a3a !important;
          width: 100% !important;
          overflow-x: hidden !important;
        }
        #__next {
          width: 100%;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
      <div style={{ minHeight: '100vh', backgroundColor: '#1e2a3a', color: 'white', fontFamily: 'Arial, sans-serif', width: '100%' }}>
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', background: 'linear-gradient(180deg, #000000 0%, rgba(30, 42, 58, 0) 100%)' }}>
          <Link href="/home" style={{ color: '#00d9cc', textDecoration: 'none', fontSize: '1.2rem', fontWeight: 'bold' }}>Rally Planner</Link>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <Link href="/team-management" style={{ color: '#00d9cc', textDecoration: 'none' }}>Team</Link>
            <button onClick={async () => { await supabase.auth.signOut(); router.replace('/home') }} style={buttonStyle}>Logout</button>
          </div>
        </nav>

        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' }}>
          <h1 style={{ color: 'white', marginBottom: '40px', fontSize: '2.5rem' }}>Dashboard</h1>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            <div style={{ backgroundColor: '#2d3e50', padding: '30px', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid rgba(0, 217, 204, 0.2)', paddingBottom: '15px' }}>
                <h2 style={{ color: '#00d9cc', margin: 0 }}>My Rallies</h2>
                <button style={buttonStyle}>+ Add</button>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '15px' }}>UPCOMING ({rallies.length})</p>
              {rallies.length === 0 ? (
                <p style={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', padding: '20px' }}>No rallies yet</p>
              ) : (
                rallies.map(rally => (
                  <Link key={rally.id} href={`/rally-detail/${rally.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ backgroundColor: 'rgba(0, 217, 204, 0.1)', padding: '15px', marginBottom: '10px', borderRadius: '6px', cursor: 'pointer', border: '1px solid rgba(0, 217, 204, 0.2)' }}>
                      <p style={{ margin: 0, marginBottom: '5px', color: 'white' }}>{rally.name}</p>
                      <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0, fontSize: '0.85rem' }}>{new Date(rally.start_date).toLocaleDateString()}</p>
                    </div>
                  </Link>
                ))
              )}
              <p style={{ color: '#00d9cc', textAlign: 'center', marginTop: '15px', cursor: 'pointer', fontSize: '0.9rem' }}>View All →</p>
            </div>

            <div style={{ backgroundColor: '#2d3e50', padding: '30px', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid rgba(0, 217, 204, 0.2)', paddingBottom: '15px' }}>
                <h2 style={{ color: '#00d9cc', margin: 0 }}>Team Summary</h2>
                <button style={buttonStyle}>Manage</button>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '15px' }}>TEAM MEMBERS ({teamMembers.length})</p>
              {teamMembers.length === 0 ? (
                <p style={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', padding: '20px' }}>No team members yet</p>
              ) : (
                teamMembers.map(member => (
                  <div key={member.id} style={{ backgroundColor: 'rgba(0, 217, 204, 0.1)', padding: '10px', marginBottom: '8px', borderRadius: '6px' }}>
                    <p style={{ margin: 0, marginBottom: '3px', fontSize: '0.95rem' }}>{member.name}</p>
                    <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0, fontSize: '0.8rem' }}>{member.role}</p>
                  </div>
                ))
              )}
            </div>

            <div style={{ backgroundColor: '#2d3e50', padding: '30px', borderRadius: '12px' }}>
              <h2 style={{ color: '#00d9cc', marginBottom: '20px', margin: '0 0 20px 0' }}>Quick Actions</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button style={{...buttonStyle, width: '100%', padding: '15px', backgroundColor: 'rgba(0, 217, 204, 0.2)', color: '#00d9cc', border: '1px solid #00d9cc' }}>📄 Upload Documents</button>
                <button style={{...buttonStyle, width: '100%', padding: '15px', backgroundColor: 'rgba(0, 217, 204, 0.2)', color: '#00d9cc', border: '1px solid #00d9cc' }}>�� View Calendar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
