// ... (previous imports)

export default function Calendar() {
  // ... (previous code)

  const handleRallyClick = (rallyId) => {
    router.push(`/rally-detail?id=${rallyId}`)
  }

  // In the upcoming events section, modify the rally rendering:
  {upcomingEvents.map((event, index) => (
    <div 
      key={event.id || index} 
      style={{ 
        background: 'rgba(255,255,255,0.05)', 
        border: '1px solid rgba(255,255,255,0.1)', 
        borderRadius: '12px', 
        padding: '20px',
        position: 'relative',
        cursor: event.name ? 'pointer' : 'default'  // Only make rallies clickable
      }}
      onClick={() => event.name && handleRallyClick(event.id)}
    >
      {/* ... rest of the event rendering code ... */}
    </div>
  ))}
}
