import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

export default function Index() {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          router.replace('/my-dashboard')
        } else {
          router.replace('/home')
        }
      } catch (err) {
        router.replace('/home')
      }
    }

    // Add a small delay to prevent redirect loops
    const timer = setTimeout(() => {
      checkAuth()
    }, 100)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1e2a3a', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
      Loading...
    </div>
  )
}
