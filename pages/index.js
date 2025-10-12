import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    checkUser()
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1e2a3a',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Navigation with gradient */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px 40px',
        background: 'linear-gradient(180deg, #000000 0%, rgba(30, 42, 58, 0) 100%)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <img 
            src="https://eu.chat-img.sintra.ai/dc1642b4-24d4-4708-b881-4a4a3d091f51/085dd2a1-4cb2-4eec-ad91-6a8aa0a1b119/channels4_profile.jpeg" 
            style={{ width: '40px', height: '40px', borderRadius: '50%' }} 
          />
          <span style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: 'white',
            letterSpacing: '0.02em'
          }}>
            Rally Planner
          </span>
        </div>
        <Link 
          href={user ? "/my-dashboard" : "/login"}
          style={{
            padding: '12px 32px',
            background: '#00d9cc',
            color: '#000',
            border: 'none',
            borderRadius: '25px',
            fontSize: '1rem',
            fontWeight: '700',
            textDecoration: 'none',
            transition: 'all 0.2s'
          }}
        >
          {user ? 'My Dashboard' : 'Log In'}
        </Link>
      </nav>

      {/* Hero Section */}
      <div style={{
        textAlign: 'center',
        padding: '60px 20px 80px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h1 style={{
          fontSize: '4rem',
          fontWeight: '800',
          color: 'white',
          marginBottom: '24px',
          lineHeight: '1.1',
          letterSpacing: '-0.02em'
        }}>
          Rally Community Hub
        </h1>
        <p style={{
          fontSize: '1.3rem',
          color: 'rgba(255, 255, 255, 0.7)',
          marginBottom: '48px',
          maxWidth: '600px',
          margin: '0 auto 48px',
          fontWeight: '400'
        }}>
          Professional rally logistics and team coordination
        </p>
        <Link 
          href={user ? "/my-dashboard" : "/signup"}
          style={{
            display: 'inline-block',
            padding: '16px 48px',
            background: '#00d9cc',
            color: '#000',
            border: 'none',
            borderRadius: '25px',
            fontSize: '1.1rem',
            fontWeight: '700',
            textDecoration: 'none',
            transition: 'transform 0.2s',
            letterSpacing: '0.02em'
          }}
        >
          {user ? 'Go to Dashboard' : 'Get Started'}
        </Link>
      </div>

      {/* Latest News */}
      <div style={{
        padding: '60px 20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: '700',
          color: 'white',
          marginBottom: '32px',
          letterSpacing: '-0.01em'
        }}>
          Latest News
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px'
        }}>
          <div style={{
            background: '#2d3e50',
            borderRadius: '16px',
            padding: '28px',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}>
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: '700',
              color: 'white',
              marginBottom: '12px'
            }}>
              Cambrian Rally 2025 Announced
            </h3>
            <p style={{
              color: 'rgba(255, 255, 255, 0.6)',
              marginBottom: '16px',
              lineHeight: '1.6',
              fontSize: '0.95rem'
            }}>
              The legendary Cambrian Rally returns with exciting new stages and challenges.
            </p>
            <p style={{
              color: '#00d9cc',
              fontSize: '0.85rem',
              fontWeight: '600'
            }}>
              2025-08-15
            </p>
          </div>

          <div style={{
            background: '#2d3e50',
            borderRadius: '16px',
            padding: '28px',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}>
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: '700',
              color: 'white',
              marginBottom: '12px'
            }}>
              New Safety Regulations Introduced
            </h3>
            <p style={{
              color: 'rgba(255, 255, 255, 0.6)',
              marginBottom: '16px',
              lineHeight: '1.6',
              fontSize: '0.95rem'
            }}>
              FIA announces comprehensive safety updates for rally competitions.
            </p>
            <p style={{
              color: '#00d9cc',
              fontSize: '0.85rem',
              fontWeight: '600'
            }}>
              2025-07-22
            </p>
          </div>
        </div>
      </div>

      {/* Upcoming Rallies */}
      <div style={{
        padding: '60px 20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: '700',
          color: 'white',
          marginBottom: '32px',
          letterSpacing: '-0.01em'
        }}>
          Upcoming Rallies
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px'
        }}>
          <div style={{
            background: '#2d3e50',
            borderRadius: '16px',
            padding: '28px',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}>
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: '700',
              color: 'white',
              marginBottom: '16px'
            }}>
              Grampian Forest Rally
            </h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '8px', fontSize: '1rem' }}>
              📅 2025-11-15
            </p>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1rem' }}>
              📍 Scotland
            </p>
          </div>

          <div style={{
            background: '#2d3e50',
            borderRadius: '16px',
            padding: '28px',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}>
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: '700',
              color: 'white',
              marginBottom: '16px'
            }}>
              Jim Clark Rally
            </h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '8px', fontSize: '1rem' }}>
              📅 2025-12-05
            </p>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1rem' }}>
              📍 Scottish Borders
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div style={{
        padding: '80px 20px 100px',
        textAlign: 'center'
      }}>
        <div style={{
          background: '#2d3e50',
          borderRadius: '20px',
          padding: '60px 40px',
          maxWidth: '800px',
          margin: '0 auto',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            color: 'white',
            marginBottom: '20px',
            letterSpacing: '-0.01em'
          }}>
            Join the Rally Community
          </h2>
          <p style={{
            fontSize: '1.1rem',
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '32px'
          }}>
            Professional logistics and team coordination tools
          </p>
          <Link 
            href={user ? "/my-dashboard" : "/signup"}
            style={{
              display: 'inline-block',
              padding: '16px 48px',
              background: '#00d9cc',
              color: '#000',
              border: 'none',
              borderRadius: '25px',
              fontSize: '1.1rem',
              fontWeight: '700',
              textDecoration: 'none',
              transition: 'transform 0.2s',
              letterSpacing: '0.02em'
            }}
          >
            {user ? 'Go to Dashboard' : 'Get Started'}
          </Link>
        </div>
      </div>
    </div>
  )
}
