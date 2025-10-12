import { useState } from 'react'
import Link from 'next/link'

export default function Upload() {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragActive(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    
    const files = Array.from(e.dataTransfer.files)
    setUploadedFiles(prev => [...prev, ...files])
  }

  return (
    <div style={{
      height: '100vh',
      background: '#000000',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Top Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <img 
          src="https://eu.chat-img.sintra.ai/dc1642b4-24d4-4708-b881-4a4a3d091f51/085dd2a1-4cb2-4eec-ad91-6a8aa0a1b119/channels4_profile.jpeg"
          alt="The Rally League"
          style={{
            width: '40px',
            height: '40px',
            marginRight: '12px'
          }}
        />
        <span style={{
          color: '#ffffff',
          fontSize: '1.2rem',
          fontWeight: 'bold'
        }}>
          Upload Documents
        </span>
      </div>

      {/* Drag and Drop Full Screen Area */}
      {dragActive && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.9)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            border: '4px dashed #00ff88'
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div style={{ 
            fontSize: '64px', 
            color: '#00ff88',
            marginBottom: '20px'
          }}>
            📤
          </div>
          <h2 style={{ 
            color: '#ffffff', 
            fontSize: '2rem',
            marginBottom: '10px'
          }}>
            Drop files here
          </h2>
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '1rem'
          }}>
            Drag and drop your rally documents
          </p>
        </div>
      )}

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '400px',
          padding: '40px',
          border: '2px dashed rgba(255, 255, 255, 0.3)',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ 
            fontSize: '48px', 
            marginBottom: '20px',
            color: '#00ff88'
          }}>
            📤
          </div>
          <h2 style={{ 
            color: '#ffffff', 
            marginBottom: '10px',
            fontSize: '1.2rem'
          }}>
            Upload Rally Documents
          </h2>
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '20px'
          }}>
            Drag and drop or click to select files
          </p>
          <input 
            type="file" 
            multiple 
            style={{ display: 'none' }} 
            id="file-upload"
            onDragOver={handleDragOver}
          />
          <button 
            onClick={() => document.getElementById('file-upload').click()}
            style={{
              background: '#00ff88',
              color: '#000000',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Select Files
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        padding: '15px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Link href="/home">
          <div style={{
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center'
          }}>
            <div style={{ fontSize: '24px' }}>🏠</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Home</div>
          </div>
        </Link>

        <Link href="/team">
          <div style={{
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center'
          }}>
            <div style={{ fontSize: '24px' }}>👥</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Team</div>
          </div>
        </Link>

        <div style={{
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center'
        }}>
          <div style={{ fontSize: '24px' }}>📅</div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Events</div>
        </div>

        <div style={{
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          color: '#00ff88'
        }}>
          <div style={{ fontSize: '24px' }}>📤</div>
          <div style={{ fontSize: '12px', color: '#00ff88' }}>Upload</div>
        </div>

        <div style={{
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center'
        }}>
          <div style={{ fontSize: '24px' }}>⚙️</div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Settings</div>
        </div>
      </div>
    </div>
  )
}
