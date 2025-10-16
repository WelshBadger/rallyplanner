import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

export default function Index() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        router.replace('/my-dashboard')
      } else {
        router.replace('/home')
      }
      setChecking(false)
    }

    checkAuth()
  }, [router])

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        Loading...
      </div>
    )
  }

  return null
}
