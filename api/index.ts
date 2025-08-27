// human
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method === 'GET') {
    return res.json({ 
      ok: true, 
      service: 'ai-ux-audit-serverless',
      timestamp: new Date().toISOString(),
      endpoints: {
        audit: '/api/audit',
        report: '/api/audit/[id]'
      }
    })
  }

  return res.status(404).json({ message: 'API route not found' })
}