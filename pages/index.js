import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function SplashScreen() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/home')
  }, [router])

  return (
    <div style={{
      height: '100vh',
      background: '#000000',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <img 
        src="https://eu.chat-img.sintra.ai/dc1642b4-24d4-4708-b881-4a4a3d091f51/085dd2a1-4cb2-4eec-ad91-6a8aa0a1b119/channels4_profile.jpeg"
        alt="The Rally League"
        style={{
          width: '200px',
          height: '200px',
          objectFit: 'contain',
          filter: 'drop-shadow(0 0 30px rgba(0, 255, 136, 0.5))',
          mixBlendMode: 'screen'
        }}
      />
    </div>
  )
}
