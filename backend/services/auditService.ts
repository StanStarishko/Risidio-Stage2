// human
import { v4 as uuid } from 'uuid'
import { fetchPage } from '../utils/fetchPage.js'
import { analyseDom } from '../utils/analyseDom.js'
import { askAI } from '../utils/aiClient.js'

type Report = {
  id: string
  target: string
  heuristics: any
  recommendations: any
  createdAt: string
}

const memory = new Map<string, Report>()

export async function runAudit(url: string): Promise<string> {
  const html = await fetchPage(url)
  const heuristics = await analyseDom(html)
  const recommendations = await askAI(url, heuristics)
  const id = uuid()
  const report: Report = {
    id,
    target: url,
    heuristics,
    recommendations,
    createdAt: new Date().toISOString(),
  }
  memory.set(id, report)
  return id
}

export function getAudit(id: string): Report | undefined {
  return memory.get(id)
}
