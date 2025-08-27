// human
import type { NextApiRequest, NextApiResponse } from 'next'

// Simple in-memory storage for demo
const auditReports = new Map<string, any>()

function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

// Mock audit function for now
async function mockAudit(url: string) {
  console.log(`[AUDIT] Starting mock audit for: ${url}`)
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Mock heuristics data
  const heuristics = {
    counts: {
      images: Math.floor(Math.random() * 20),
      links: Math.floor(Math.random() * 50),
      forms: Math.floor(Math.random() * 3),
    },
    headings: [
      { tag: 'h1', count: 1 },
      { tag: 'h2', count: Math.floor(Math.random() * 5) },
      { tag: 'h3', count: Math.floor(Math.random() * 8) },
    ],
    accessibility: {
      imagesMissingAlt: Math.floor(Math.random() * 5),
      hasAriaLabels: Math.random() > 0.5,
    },
    seo: {
      title: 'Sample Page Title',
      titleLength: 15,
      metaDescriptionPresent: Math.random() > 0.5,
    }
  }
  
  // Mock recommendations
  const recommendations = {
    summary: `🔍 Mock Analysis: Found ${heuristics.accessibility.imagesMissingAlt} accessibility issues and ${heuristics.counts.images} images. This is a demo response showing the audit tool workflow.`,
    priorities: [
      { p: 1, text: `Add alt attributes to ${heuristics.accessibility.imagesMissingAlt} missing images` },
      { p: 2, text: "Ensure proper heading hierarchy with single H1 tag" },
      { p: 3, text: "Add meta description for better SEO" },
      { p: 4, text: "Review color contrast for accessibility compliance" },
      { p: 5, text: "Consider implementing lazy loading for images" }
    ],
    webScore: Math.floor(Math.random() * 40) + 60, // Score between 60-100
    blockchain: {
      verified: true,
      timestamp: new Date().toISOString(),
      hash: `0x${Math.random().toString(16).substr(2, 40)}`
    }
  }
  
  return { heuristics, recommendations }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(`[API] ${req.method} /api/audit`)
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    // Handle POST /api/audit - Create new audit
    if (req.method === 'POST') {
      const { url } = req.body
      
      if (!url || typeof url !== 'string') {
        return res.status(400).json({ message: 'URL is required' })
      }
      
      // Validate URL format
      try {
        new URL(url)
      } catch {
        return res.status(400).json({ message: 'Invalid URL format' })
      }
      
      console.log(`[API] Creating audit for: ${url}`)
      
      const id = generateId()
      const auditData = await mockAudit(url)
      
      // Store report
      const report = {
        id,
        target: url,
        ...auditData,
        createdAt: new Date().toISOString(),
      }
      
      auditReports.set(id, report)
      
      console.log(`[API] Audit created with ID: ${id}`)
      
      return res.status(200).json({ id })
    }
    
    // Handle GET /api/audit?id=xxx - Get audit report
    if (req.method === 'GET') {
      const { id } = req.query
      
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ message: 'Report ID is required' })
      }
      
      const report = auditReports.get(id)
      
      if (!report) {
        return res.status(404).json({ message: 'Report not found' })
      }
      
      return res.status(200).json(report)
    }
    
    return res.status(405).json({ message: 'Method not allowed' })
    
  } catch (error: any) {
    console.error('[API] Error:', error)
    return res.status(500).json({ 
      message: error?.message || 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
}