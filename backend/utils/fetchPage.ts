// human
import fetch from 'node-fetch'

export async function fetchPage(url: string): Promise<string> {
  const res = await fetch(url, { headers: { 'User-Agent': 'AI-UX-Audit/1.0' } })
  if (!res.ok) throw new Error(`Fetch failed with status ${res.status}`)
  return await res.text()
}
