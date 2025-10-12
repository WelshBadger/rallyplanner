import { useState } from 'react'
import Link from 'next/link'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('calendar')
  
  const renderCalendarEntryForm = () => (
    <div style={{
      background: 'rgba(255, 255, 255, 0.05)',
      padding: '20px',
      borderRadius: '12px'
    }}>
      <h2 style={{ color: '#00ff88', marginBottom: '20px' }}>Add Rally Event</h2>
      <div style={{ display: 'grid', gap: '15px' }}>
        <input 
          placeholder="Rally Name" 
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
            padding: '10px',
            borderRadius: '8px'
          }}
        />
        <input 
          type="date" 
          placeholder="Start Date"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
            padding: '10px',
            borderRadius: '8px'
          }}
        />
        <input 
          type="date" 
          placeholder="End Date"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
            padding: '10px',
            borderRadius: '8px'
          }}
        />
        <select style={{
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: 'white',
          padding: '10px',
          borderRadius: '8px'
        }}>
          <option>Select Status</option>
          <option>Registration Open</option>
          <option>Coming Soon</option>
          <option>Completed</option>
        </select>
        <textarea 
          placeholder="Rally Description"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
            padding: '10px',
            borderRadius: '8px',
            minHeight: '100px'
          }}
        />
        <button style={{
          background: '#00ff88',
          color: 'black',
          border: 'none',
          padding: '12px',
          borderRadius: '8px',
          fontWeight: 'bold'
        }}>
          Add Rally Event
        </button>
      </div>
    </div>
  )

  const renderNewsForm = () => (
    <div style={{
      background: 'rgba(255, 255, 255, 0.05)',
      padding: '20px',
      borderRadius: '12px'
    }}>
      <h2 style={{ color: '#00ff88', marginBottom: '20px' }}>Add News Article</h2>
      <div style={{ display: 'grid', gap: '15px' }}>
        <input 
          placeholder="Article Title" 
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
            padding: '10px',
            borderRadius: '8px'
          }}
        />
        <textarea 
          placeholder="Article Content"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
            padding: '10px',
            borderRadius: '8px',
            minHeight: '200px'
          }}
        />
        <input 
          type="file" 
          placeholder="Featured Image"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
            padding: '10px',
            borderRadius: '8px'
          }}
        />
        <button style={{
          background: '#00ff88',
          color: 'black',
          border: 'none',
          padding: '12px',
          borderRadius: '8px',
          fontWeight: 'bold'
        }}>
          Publish Article
        </button>
      </div>
    </div>
  )

  const renderResultsForm = () => (
    <div style={{
      background: 'rgba(255, 255, 255, 0.05)',
      padding: '20px',
      borderRadius: '12px'
    }}>
      <h2 style={{ color: '#00ff88', marginBottom: '20px' }}>Add Rally Results</h2>
      <div style={{ display: 'grid', gap: '15px' }}>
        <select style={{
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: 'white',
          padding: '10px',
          borderRadius: '8px'
        }}>
          <option>Select Rally</option>
          <option>Wales Rally GB</option>
          <option>Monte Carlo Rally</option>
        </select>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '10px'
        }}>
          <input 
            placeholder="1st Place" 
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '10px',
              borderRadius: '8px'
            }}
          />
          <input 
            placeholder="2nd Place" 
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '10px',
              borderRadius: '8px'
            }}
          />
          <input 
            placeholder="3rd Place" 
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '10px',
              borderRadius: '8px'
            }}
          />
        </div>
        <textarea 
          placeholder="Additional Results/Notes"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
            padding: '10px',
            borderRadius: '8px',
            minHeight: '100px'
          }}
        />
        <button style={{
          background: '#00ff88',
          color: 'black',
          border: 'none',
          padding: '12px',
          borderRadius: '8px',
          fontWeight: 'bold'
        }}>
          Add Results
        </button>
      </div>
    </div>
  )

  return (
    <div style={{
      height: '100vh',
      background: '#000000',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Link href="/home" style={{ color: '#00ff88', textDecoration: 'none' }}>
          ← Back
        </Link>
        <h1 style={{ margin: 0, color: '#ffffff' }}>Rally League Admin</h1>
        <div></div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        padding: '20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <button 
          onClick={() => setActiveTab('calendar')}
          style={{
            background: activeTab === 'calendar' ? '#00ff88' : 'transparent',
            color: activeTab === 'calendar' ? '#000000' : '#ffffff',
            border: '1px solid #00ff88',
            padding: '10px 20px',
            borderRadius: '8px'
          }}
        >
          Calendar Entries
        </button>
        <button 
          onClick={() => setActiveTab('news')}
          style={{
            background: activeTab === 'news' ? '#00ff88' : 'transparent',
            color: activeTab === 'news' ? '#000000' : '#ffffff',
            border: '1px solid #00ff88',
            padding: '10px 20px',
            borderRadius: '8px'
          }}
        >
          News
        </button>
        <button 
          onClick={() => setActiveTab('results')}
          style={{
            background: activeTab === 'results' ? '#00ff88' : 'transparent',
            color: activeTab === 'results' ? '#000000' : '#ffffff',
            border: '1px solid #00ff88',
            padding: '10px 20px',
            borderRadius: '8px'
          }}
        >
          Results
        </button>
      </div>

      {/* Content Area */}
      <div style={{
        flex: 1,
        padding: '20px',
        overflowY: 'auto'
      }}>
        {activeTab === 'calendar' && renderCalendarEntryForm()}
        {activeTab === 'news' && renderNewsForm()}
        {activeTab === 'results' && renderResultsForm()}
      </div>
    </div>
  )
}
