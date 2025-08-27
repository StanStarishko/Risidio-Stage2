// human
import { useState } from 'react'

export default function Home() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [reportId, setReportId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Audit failed')
      setReportId(data.id)
    } catch (err:any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <h1 className="text-3xl font-bold mb-4">AI-powered UX Audit Tool</h1>
        <p className="mb-6 text-gray-600">Enter a URL to generate a directional UX & accessibility report.</p>

        <form onSubmit={submit} className="flex gap-2">
          <input
            className="flex-1 border rounded-lg px-3 py-2"
            placeholder="https://example.com"
            value={url}
            onChange={e => setUrl(e.target.value)}
            required
          />
          <button
            className="px-4 py-2 rounded-lg bg-black text-white disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Auditing…' : 'Audit'}
          </button>
        </form>

        {error && <p className="mt-4 text-red-600">{error}</p>}
        {reportId && (
          <p className="mt-4">
            Report ready: <a className="underline" href={`/report/${reportId}`}>view report</a>
          </p>
        )}
      </div>
    </main>
  )
}
