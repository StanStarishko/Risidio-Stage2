// human
import { randomUUID } from 'crypto'
import { fetchPage } from '../utils/fetchPage.js'
import { analyzeDom } from '../utils/analyzeDom.js'
import { askAI } from '../utils/aiClient.js'
import { createBlockchainRecord } from './web3Service.js'
import crypto from 'crypto'

type Report = {
  id: string
  target: string
  heuristics: any
  recommendations: any
  createdAt: string
  blockchain?: {
    hash: string
    verified: boolean
    timestamp: string
  }
  processingTime: number
  version: string
}

const memory = new Map<string, Report>()
const auditCache = new Map<string, {report: Report, expiresAt: number}>()

export async function runAudit(url: string): Promise<string> {
  const startTime = Date.now()
  
  // Check cache first (15 minutes)
  const cacheKey = crypto.createHash('md5').update(url).digest('hex')
  const cached = auditCache.get(cacheKey)
  if (cached && cached.expiresAt > Date.now()) {
    return cached.report.id
  }

  try {
    // Step 1: Fetch HTML content
    const html = await fetchPage(url)
    
    // Step 2: Perform heuristics analysis
    const heuristics = await analyzeDom(html)
    
    // Step 3: Get AI recommendations
    const recommendations = await askAI(url, heuristics)
    
    // Step 4: Create unique report ID
    const id = randomUUID()
    
    // Step 5: Create blockchain record for immutability
    const dataHash = crypto.createHash('sha256')
      .update(JSON.stringify({url, heuristics, recommendations}))
      .digest('hex')
    
    const blockchainRecord = createBlockchainRecord(id, url, dataHash)
    
    // Step 6: Compile final report
    const processingTime = Date.now() - startTime
    const report: Report = {
      id,
      target: url,
      heuristics,
      recommendations: {
        ...recommendations,
        blockchain: {
          hash: blockchainRecord.hash,
          verified: blockchainRecord.verified,
          timestamp: blockchainRecord.timestamp
        }
      },
      createdAt: new Date().toISOString(),
      blockchain: {
        hash: blockchainRecord.hash,
        verified: blockchainRecord.verified,
        timestamp: blockchainRecord.timestamp
      },
      processingTime,
      version: '1.2.0'
    }
    
    // Step 7: Store in memory and cache
    memory.set(id, report)
    auditCache.set(cacheKey, {
      report,
      expiresAt: Date.now() + (15 * 60 * 1000) // 15 minutes
    })
    
    return id
    
  } catch (error) {
    console.error(`Audit failed for ${url}:`, error)
    throw error
  }
}

export function getAudit(id: string): Report | undefined {
  return memory.get(id)
}

export function getAllAudits(): Report[] {
  return Array.from(memory.values()).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export function getAuditsByUrl(url: string): Report[] {
  return Array.from(memory.values())
    .filter(report => report.target === url)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function getAuditStats() {
  const reports = Array.from(memory.values())
  const totalAudits = reports.length
  const avgProcessingTime = reports.reduce((sum, r) => sum + r.processingTime, 0) / totalAudits || 0
  
  const uniqueDomains = new Set(reports.map(r => {
    try {
      return new URL(r.target).hostname
    } catch {
      return r.target
    }
  })).size
  
  const recentAudits = reports.filter(r => 
    new Date(r.createdAt).getTime() > Date.now() - (24 * 60 * 60 * 1000)
  ).length
  
  return {
    totalAudits,
    uniqueDomains,
    recentAudits,
    avgProcessingTime: Math.round(avgProcessingTime),
    cacheHitRate: Math.round((auditCache.size / Math.max(totalAudits, 1)) * 100)
  }
}

// Cleanup old cache entries every 30 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, cached] of auditCache.entries()) {
    if (cached.expiresAt < now) {
      auditCache.delete(key)
    }
  }
}, 30 * 60 * 1000)