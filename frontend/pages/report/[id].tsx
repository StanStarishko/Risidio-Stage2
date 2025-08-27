// human
import { useRouter } from 'next/router'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(r => r.json())

// Simple Chart Components
const HealthScore = ({ score, label }: { score: number; label: string }) => (
  <div className="text-center">
    <div className="relative w-20 h-20 mx-auto mb-2">
      <div className="w-20 h-20 rounded-full border-4 border-gray-200"></div>
      <div 
        className="absolute top-0 left-0 w-20 h-20 rounded-full border-4 border-green-500"
        style={{
          clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((score / 100) * 2 * Math.PI - Math.PI / 2)}% ${50 + 50 * Math.sin((score / 100) * 2 * Math.PI - Math.PI / 2)}%, 50% 50%)`
        }}
      ></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold">{score}</span>
      </div>
    </div>
    <p className="text-sm text-gray-600">{label}</p>
  </div>
)

const BarChart = ({ data, title }: { data: Array<{label: string, value: number, max: number}>, title: string }) => (
  <div className="bg-white p-4 rounded-lg border">
    <h3 className="font-semibold mb-3">{title}</h3>
    <div className="space-y-2">
      {data.map((item, i) => (
        <div key={i}>
          <div className="flex justify-between text-sm mb-1">
            <span>{item.label}</span>
            <span>{item.value}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${Math.min((item.value / item.max) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  </div>
)

const PriorityCard = ({ priority, index }: { priority: any, index: number }) => {
  const colors = ['bg-red-50 border-red-200', 'bg-yellow-50 border-yellow-200', 'bg-blue-50 border-blue-200']
  const badges = ['🚨 High', '⚠️ Medium', '💡 Low']
  
  return (
    <div className={`p-4 rounded-lg border-2 ${colors[index % 3]}`}>
      <div className="flex items-start justify-between mb-2">
        <span className="text-sm font-medium">{badges[index % 3]}</span>
        <span className="text-xs text-gray-500">Priority {priority.p}</span>
      </div>
      <p className="text-gray-800">{priority.text}</p>
    </div>
  )
}

export default function Report() {
  const router = useRouter()
  const { id } = router.query
  const { data, error } = useSWR(
    id ? `/api/audit?id=${id}` : null,
    fetcher
  )

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">❌</div>
        <h1 className="text-2xl font-bold mb-2">Failed to Load Report</h1>
        <p className="text-gray-600">Please check your connection and try again.</p>
        <p className="text-sm text-gray-400 mt-2">Error: {error.message}</p>
      </div>
    </div>
  )

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin text-4xl mb-4">⚙️</div>
        <h1 className="text-xl font-semibold">Loading Report...</h1>
      </div>
    </div>
  )

  // Calculate health scores
  const accessibilityScore = Math.max(0, 100 - (data.heuristics?.accessibility?.imagesMissingAlt || 0) * 10)
  const seoScore = (data.heuristics?.seo?.title ? 50 : 0) + (data.heuristics?.seo?.metaDescriptionPresent ? 50 : 0)
  const overallScore = data.recommendations?.webScore || Math.round((accessibilityScore + seoScore) / 2)

  // Prepare chart data
  const chartData = [
    { 
      label: 'Images', 
      value: data.heuristics?.counts?.images || 0, 
      max: Math.max(data.heuristics?.counts?.images || 0, 20) 
    },
    { 
      label: 'Links', 
      value: data.heuristics?.counts?.links || 0, 
      max: Math.max(data.heuristics?.counts?.links || 0, 50) 
    },
    { 
      label: 'Missing Alt Tags', 
      value: data.heuristics?.accessibility?.imagesMissingAlt || 0, 
      max: data.heuristics?.counts?.images || 1 
    }
  ]

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <a href="/" className="hover:text-gray-700">← Back to Audit</a>
          </div>
          <h1 className="text-3xl font-bold mb-2">UX Audit Report</h1>
          <div className="flex flex-wrap items-center gap-4 text-gray-600">
            <span className="flex items-center gap-1">
              🌐 <span>{data.target}</span>
            </span>
            <span className="flex items-center gap-1">
              📅 <span>{new Date(data.createdAt).toLocaleDateString()}</span>
            </span>
            {/* Web3 Element - Blockchain Verification */}
            <span className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded text-sm">
              🔗 <span>Blockchain Verified</span>
            </span>
          </div>
        </div>

        {/* Demo Notice */}
        <div className="mb-6 p-4 border border-blue-300 bg-blue-50 rounded-lg flex items-center gap-2">
          🔍 <strong>Demo Mode:</strong> This report shows mock data to demonstrate the UX audit tool functionality.
        </div>

        {/* Health Scores Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <HealthScore score={overallScore} label="Overall Score" />
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <HealthScore score={accessibilityScore} label="Accessibility" />
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <HealthScore score={seoScore} label="SEO Basics" />
          </div>
        </div>

        {/* Data Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <BarChart data={chartData} title="Website Analysis Metrics" />
          
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-semibold mb-3">Heading Structure</h3>
            <div className="space-y-2">
              {data.heuristics?.headings?.map((heading: any, i: number) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-sm font-mono">&lt;{heading.tag}&gt;</span>
                  <span className="bg-gray-100 px-2 py-1 rounded text-sm">{heading.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            🤖 AI Recommendations
          </h2>
          
          {data.recommendations?.summary && (
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h3 className="font-medium mb-2">Executive Summary</h3>
              <p className="text-gray-700">{data.recommendations.summary}</p>
            </div>
          )}

          <div className="grid gap-4">
            {data.recommendations?.priorities?.map((priority: any, index: number) => (
              <PriorityCard key={index} priority={priority} index={index} />
            ))}
          </div>
        </div>

        {/* Web3 Integration - Future DAO Voting */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            🔗 Web3 Integration (Demo)
          </h3>
          <p className="text-gray-700 mb-4">
            This report demonstrates blockchain verification and DAO voting concepts. 
            In production, reports would be immutably stored and community-validated.
          </p>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200">
              📝 Mint Report NFT (Demo)
            </button>
            <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm hover:bg-purple-200">
              🗳️ Submit to DAO Review (Demo)
            </button>
          </div>
          {data.recommendations?.blockchain && (
            <div className="mt-4 p-3 bg-white rounded border text-xs">
              <strong>Blockchain Hash:</strong> {data.recommendations.blockchain.hash}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}