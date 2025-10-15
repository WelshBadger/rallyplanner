import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function RallyDetail() {
  const router = useRouter()
  const { id } = router.query
  const [rally, setRally] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    
    const fetchRally = async () => {
      const { data } = await supabase
        .from('rally_events')
        .select('*')
        .eq('id', id)
        .single()
      
      setRally(data)
      setLoading(false)
    }
    
    fetchRally()
  }, [id])

  if (loading) return <div style={{ minHeight: '100vh', backgroundColor: '#1e2a3a', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>
  if (!rally) return <div style={{ minHeight: '100vh', backgroundColor: '#1e2a3a', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Rally not found</div>

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1e2a3a', color: 'white', padding: '40px' }}>
      <Link href="/my-dashboard" style={{ color: '#00d9cc' }}>← Back to Dashboard</Link>
      <h1 style={{ color: '#00d9cc', marginTop: '20px' }}>{rally.name}</h1>
      <p>Location: {rally.location}</p>
      <p>Dates: {new Date(rally.start_date).toLocaleDateString()} - {new Date(rally.end_date).toLocaleDateString()}</p>
    </div>
  )
}
