import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import Link from 'next/link'

export default function Signup() {
  const router = useRouter()
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      })

      if (authError) throw authError

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: authData.user.id,
            name: formData.name,
            email: formData.email,
            trial_end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
          })

        if (profileError) throw profileError
      }

      router.push('/my-dashboard')
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#1e2a3a', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'white', margin: '0', letterSpacing: '0.02em' }}>Create Account</h1>
      </div>

      <div style={{ background: '#2d3e50', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '400px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
        {error && <div style={{ background: 'rgba(255, 82, 82, 0.1)', border: '1px solid #FF5252', borderRadius: '8px', padding: '12px', marginBottom: '20px', color: '#FF5252', fontSize: '0.9rem' }}>{error}</div>}

        <form onSubmit={handleSignup}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.9)', fontWeight: '500', fontSize: '0.9rem' }}>Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', padding: '14px 16px', background: '#1e2a3a', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', fontSize: '1rem', color: 'white', outline: 'none' }} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.9)', fontWeight: '500', fontSize: '0.9rem' }}>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '14px 16px', background: '#1e2a3a', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', fontSize: '1rem', color: 'white', outline: 'none' }} />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.9)', fontWeight: '500', fontSize: '0.9rem' }}>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required style={{ width: '100%', padding: '14px 16px', background: '#1e2a3a', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', fontSize: '1rem', color: 'white', outline: 'none' }} />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.9)', fontWeight: '500', fontSize: '0.9rem' }}>Confirm Password</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required style={{ width: '100%', padding: '14px 16px', background: '#1e2a3a', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', fontSize: '1rem', color: 'white', outline: 'none' }} />
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '16px', background: '#00d9cc', color: '#000', border: 'none', borderRadius: '25px', fontSize: '1rem', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p style={{ marginTop: '24px', textAlign: 'center', color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>
          Already have an account? <Link href="/login" style={{ color: '#00d9cc', textDecoration: 'none', fontWeight: '600' }}>Log In</Link>
        </p>
      </div>
    </div>
  )
}
