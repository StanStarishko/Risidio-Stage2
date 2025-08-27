// human
import { useRouter } from 'next/router'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function Report() {
  const router = useRouter()
  const { id } = router.query
  const { data, error } = useSWR(
    id ? (process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000') + `/audit/${id}` : null,
    fetcher
  )

  if (error) return <div className="p-6 text-red-600">Failed to load report.</div>
  if (!data) return <div className="p-6">Loading…</div>

  const isStub = typeof data.recommendations?.summary === 'string' &&
    data.recommendations.summary.toLowerCase().includes('stub')

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">UX Audit Report</h1>
      <p className="text-gray-600 mb-6">Target: {data.target}</p>

      {isStub && (
        <div className="mb-6 p-4 border border-yellow-400 bg-yellow-50 rounded-lg">
          ⚠️ This is a <strong>stubbed response</strong>. No real AI service was called.
        </div>
      )}

      <section className="space-y-4">
        <div className="border rounded-lg p-4">
          <h2 className="font-semibold mb-2">Heuristics</h2>
          <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(data.heuristics, null, 2)}</pre>
        </div>
        <div className="border rounded-lg p-4">
          <h2 className="font-semibold mb-2">AI Recommendations</h2>
          <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(data.recommendations, null, 2)}</pre>
        </div>
      </section>
    </main>
  )
}
