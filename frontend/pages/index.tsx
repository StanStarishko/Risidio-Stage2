// human
import { useState } from 'react'

export default function Home() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [reportId, setReportId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    setProgress(0)
    setReportId(null)

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setProgress(prev => prev < 90 ? prev + 10 : prev)
    }, 200)

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Audit failed')
      
      setProgress(100)
      setTimeout(() => {
        setReportId(data.id)
        clearInterval(progressInterval)
      }, 500)
    } catch (err: any) {
      setError(err.message)
      clearInterval(progressInterval)
      setProgress(0)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            AI-powered UX Audit Tool
          </h1>
          <p className="text-gray-600 text-lg">
            Generate instant UX & accessibility insights for any website using AI analysis
          </p>
          <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              🤖 <span>AI Analysis</span>
            </span>
            <span className="flex items-center gap-1">
              ♿ <span>Accessibility Check</span>
            </span>
            <span className="flex items-center gap-1">
              📊 <span>Performance Insights</span>
            </span>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                Website URL to Audit
              </label>
              <input
                id="url"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com"
                value={url}
                onChange={e => setUrl(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            
            {/* Progress Bar */}
            {loading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Analyzing website...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full px-6 py-3 rounded-lg bg-black text-white font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={loading}
            >
              {loading ? 'Analyzing Website...' : 'Start UX Audit'}
            </button>
          </form>

          {/* Error State */}
          {error && (
            <div className="mt-4 p-4 border border-red-300 bg-red-50 rounded-lg">
              <p className="text-red-600 flex items-center gap-2">
                ⚠️ <span>{error}</span>
              </p>
            </div>
          )}

          {/* Success State */}
          {reportId && (
            <div className="mt-4 p-4 border border-green-300 bg-green-50 rounded-lg">
              <p className="text-green-700 flex items-center gap-2 mb-2">
                ✅ <span>Audit completed successfully!</span>
              </p>
              <a 
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                href={`/report/${reportId}`}
              >
                📊 View Detailed Report →
              </a>
            </div>
          )}
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="text-2xl mb-2">🔍</div>
            <h3 className="font-semibold mb-1">Deep Analysis</h3>
            <p className="text-sm text-gray-600">DOM structure, headings, links, and accessibility metrics</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="text-2xl mb-2">🤖</div>
            <h3 className="font-semibold mb-1">AI Recommendations</h3>
            <p className="text-sm text-gray-600">Smart, actionable suggestions powered by GPT-4</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="text-2xl mb-2">📈</div>
            <h3 className="font-semibold mb-1">Visual Reports</h3>
            <p className="text-sm text-gray-600">Interactive charts and clear priority rankings</p>
          </div>
        </div>
      </div>
    </main>
  )
}