export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            Rally Planner
          </h1>
          <p className="text-xl text-blue-200 mb-8">
            AI-powered rally logistics and team coordination
          </p>
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-3">📄 Document Upload</h3>
              <p className="text-blue-200">Upload rally regulations and final instructions</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-3">🤖 AI Processing</h3>
              <p className="text-blue-200">Automatically extract key times and locations</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-3">📍 GPS Tracking</h3>
              <p className="text-blue-200">Real-time team location sharing</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
